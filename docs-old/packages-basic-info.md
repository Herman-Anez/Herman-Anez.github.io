# Paquetes Internos (Monorepo) — Guía Básica

Este documento explica qué es un paquete local, por qué creamos `@herman/i18n`, cómo está estructurado y cómo funciona la conexión con la app principal.

---

## 1. ¿Qué es un paquete interno?

Normalmente, cuando instalas una librería usas `npm install algo` y esa librería vive en `node_modules/`. Un **paquete interno** es exactamente lo mismo, pero en vez de descargarlo de internet, apunta a una carpeta local dentro del mismo repositorio.

```
herman-personal-blog/
├── personal-page/           ← la app Next.js (el "consumidor")
│   ├── package.json         ← declara @herman/i18n como dependencia
│   └── src/...
└── personal-page/packages/
    └── i18n/                ← el paquete interno (el "proveedor")
        ├── src/
        ├── dist/
        └── package.json
```

La ventaja: el código de i18n puede vivir aislado, ser reutilizable en cualquier proyecto, y tiene su propio ciclo de compilación.

---

## 2. ¿Por qué extrajimos i18n a un paquete?

Antes, toda la lógica de traducción (`getDictionary`, `resolveKey`, `getNestedValue`, `useT`, `<T />`) vivía mezclada dentro de la app en `src/shared/i18n/`. El problema:

- Estaba **acoplada a Next.js**: usaba `useParams()` directamente, haciéndola imposible de reutilizar en otro framework.
- Era **monolítica**: lógica de servidor (pura TS) mezclada con lógica de cliente (React hooks).

Al extraerla al paquete `@herman/i18n`:

| Antes | Después |
|---|---|
| Lógica pegada a Next.js | Framework-agnóstico |
| `useParams()` hardcodeado | Inyectado por el consumidor |
| Un solo archivo grande | Separado en `core.ts` y `react.tsx` |

---

## 3. Estructura del paquete `@herman/i18n`

```
personal-page/packages/i18n/
├── src/
│   ├── core.ts      # Lógica pura TypeScript, sin React, sin framework
│   ├── react.tsx    # Factory de hooks/componentes React
│   └── index.ts     # Re-exporta todo (barrel export)
├── dist/            # ⚠️ Generado por tsc. NO editar manualmente.
├── package.json
└── tsconfig.json
```

### `core.ts` — el núcleo sin dependencias

Contiene tres funciones portables a cualquier entorno (servidor, CLI, tests):

```typescript
getNestedValue(obj, 'ui.btn.submit')  // navega objetos anidados con dot-notation
resolveKey(dict, 'ui.btn')            // igual, pero retorna la clave si no existe
createI18nCore(dictionaries, 'es')    // fábrica que genera getDictionary tipado
```

### `react.tsx` — la capa React

Contiene una sola función fábrica:

```typescript
createI18nHooks(useLocaleHook, dictionaries, 'es')
// retorna: { useT, T, getDictionary, resolveKey, ... }
```

El truco está en el parámetro `useLocaleHook`. Es un React Hook que tú defines, y le dice al paquete cómo leer el locale. Así el paquete no sabe ni le importa si usas Next.js, Vite, Expo u otro:

```typescript
// En Next.js le inyectas useParams:
createI18nHooks(() => useParams()?.locale as string, dictionaries, 'es')

// En Vite + React Router le inyectarías useParams de react-router:
createI18nHooks(() => useParams().lang, dictionaries, 'es')
```

### `index.ts` — barrel export

Solo re-exporta todo para que los consumidores importen desde un solo punto:

```typescript
import { createI18nCore, createI18nHooks, getNestedValue } from '@herman/i18n';
```

---

## 4. Cómo se conecta con la app (`personal-page`)

### Paso 1 — Declarar la dependencia local

En `personal-page/package.json`, el paquete se declara usando el prefijo `file:`:

```json
{
  "dependencies": {
    "@herman/i18n": "file:./packages/i18n"
  }
}
```

`file:` le dice a npm que en vez de buscar en el registro de internet, use esa carpeta local. Funciona igual que una dependencia normal una vez instalada.

### Paso 2 — Compilar el paquete

El paquete está escrito en TypeScript, pero Node.js y los bundlers consumen JavaScript. Por eso existe el script de build:

```bash
# Desde personal-page/packages/i18n/
npm run build
# equivale a: npx tsc
# resultado: genera personal-page/packages/i18n/dist/*.js y *.d.ts
```

El `package.json` del paquete apunta a `dist/`:

```json
{
  "main":  "dist/index.js",   ← lo que se importa en runtime
  "types": "dist/index.d.ts"  ← los tipos TypeScript
}
```

Para no tener que recordar compilar manualmente, `personal-page/package.json` tiene:

```json
{
  "scripts": {
    "postinstall": "npm run build --prefix packages/i18n"
  }
}
```

`postinstall` corre automáticamente después de cada `npm install`, asegurando que `dist/` esté siempre actualizado.

### Paso 3 — El adaptador de Next.js (`hooks.tsx`)

El paquete no sabe nada de Next.js. La app crea su propio adaptador que inyecta `useParams`:

```typescript
// personal-page/src/shared/i18n/hooks.tsx
import { useParams } from 'next/navigation';
import { createI18nHooks } from '@herman/i18n';
import { dictionaries } from './dictionaries';

export const { useT, T, getDictionary, resolveKey } = createI18nHooks(
  () => (useParams()?.locale as string) || 'es',
  dictionaries,
  'es'
);
```

Este archivo es el único que conoce Next.js. Todo el resto del código de la app importa desde aquí o directamente del core:

```typescript
// En Client Components (necesitan locale reactivo):
import { useT, T } from '@/shared/i18n/hooks';

// En Server Components, scripts y tests (sin React):
import { getDictionary, resolveKey } from '@/shared/i18n/dictionaries';
```

---

## 5. Flujo completo resumido

```
npm install
    └── postinstall → packages/i18n/: tsc → genera dist/

app importa '@herman/i18n'
    └── Node resuelve 'file:./packages/i18n' → lee dist/index.js

hooks.tsx (adaptador Next.js)
    └── createI18nHooks(useParams wrapper, dictionaries, 'es')
        └── retorna { useT, T, getDictionary, ... }

Client Component usa useT() o <T />
    └── useT() llama al wrapper → useParams() → locale actual
        └── busca en dictionaries[locale] con dot-notation

Server Component usa getDictionary(locale)
    └── lógica pura del core, sin React
```

---

## 6. Reglas de mantenimiento

| Situación | Acción requerida |
|---|---|
| Modificaste `packages/i18n/src/*.ts` | Correr `npm run build` en `packages/i18n/` |
| Añadiste nueva clave a los JSON de lang | Correr `npm test` para validar paridad es/en |
| Usas i18n en Server Component | Importar de `@/shared/i18n/dictionaries` (no de hooks) |
| Usas i18n en Client Component | Importar de `@/shared/i18n/hooks` |
| `dist/` borrado accidentalmente | `npm install` en `personal-page/` lo regenera vía postinstall |
