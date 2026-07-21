# Git Subtree — Gestión de Paquetes Internos

Guía para vincular un subdirectorio del monorepo a un repositorio externo de GitHub usando `git subtree`.

---

## ¿Por qué subtree y no submodule?

| | `git submodule` | `git subtree` |
|---|---|---|
| Código en el repo principal | Puntero externo | Código real embebido |
| Clone normal | Requiere `git submodule update` | Funciona sin pasos extra |
| Historial | Repos completamente separados | Historia unificada en el monorepo |
| Complejidad diaria | Alta (detached HEAD, estado roto fácil) | Baja (comandos normales de git) |

**Conclusión**: subtree es más simple para consumir. La sincronización es levemente más verbosa pero explícita.

---

## Caso de uso en este proyecto

El paquete `@herman/i18n` vive en dos lugares simultáneamente:

```
Monorepo (herman-personal-blog)
  └── personal-page/packages/i18n/    ← código fuente

GitHub externo
  └── Herman-Anez/node-package-herman-dictionary (master)
```

---

## Setup inicial (solo se hace una vez)

### 1. Asegurarse que el paquete tiene `.gitignore`

```
dist/
node_modules/
```

Si el `.gitignore` raíz ignora archivos `.gitignore` anidados, forzar el add:

```bash
git add -f personal-page/packages/i18n/.gitignore
```

### 2. Commitear el paquete al monorepo

```bash
git add personal-page/packages/i18n/
git commit -m "feat: add @herman/i18n internal package"
```

### 3. Registrar el remote del paquete

```bash
git remote add i18n-pkg https://github.com/Herman-Anez/node-package-herman-dictionary.git
```

Verificar:
```bash
git remote -v
# i18n-pkg  https://github.com/Herman-Anez/node-package-herman-dictionary.git (fetch)
# i18n-pkg  https://github.com/Herman-Anez/node-package-herman-dictionary.git (push)
# origin    https://github.com/Herman-Anez/herman-personal-blog.git (fetch)
```

### 4. `git subtree split` — extraer historial del subdirectorio

Git recorre todo el historial del monorepo, filtra los commits que tocaron el prefix, y los reescribe como si ese directorio fuera la raíz del proyecto. Resultado: rama temporal con historia limpia solo del paquete.

```bash
git subtree split --prefix=personal-page/packages/i18n -b i18n-split
```

Verificar que la rama tiene el contenido correcto (los paths deben ser raíz, no el prefix):
```bash
git show i18n-split --stat | head -10
# .gitignore  ← raíz, no personal-page/packages/i18n/.gitignore
# README.md
# package.json
# src/core.ts
```

### 5. Push al repo externo

```bash
git push i18n-pkg i18n-split:master --force
# --force solo en setup inicial si GitHub creó un README por defecto
```

### 6. Limpiar rama temporal

La rama `i18n-split` es sintética (no mergeada en el sentido normal), requiere `-D`:

```bash
git branch -D i18n-split
```

---

## Workflow diario

### Publicar cambios del monorepo → paquete externo

Editar archivos en `personal-page/packages/i18n/`, commitear normalmente en el monorepo, luego:

```bash
git subtree push --prefix=personal-page/packages/i18n i18n-pkg master
```

Git internamente hace el split y push en un solo comando.

### Traer cambios del paquete externo → monorepo

```bash
git subtree pull --prefix=personal-page/packages/i18n i18n-pkg master --squash
```

`--squash`: colapsa todos los commits del paquete en uno solo al mergearlo. Mantiene el historial del monorepo limpio.

---

## Añadir un nuevo paquete (patrón repetible)

```bash
# 1. Crear el paquete en personal-page/packages/<nombre>/
# 2. Commitear
git add personal-page/packages/<nombre>/
git commit -m "feat: add @herman/<nombre> package"

# 3. Registrar remote
git remote add <alias> https://github.com/Herman-Anez/<repo>.git

# 4. Split y push
git subtree split --prefix=personal-page/packages/<nombre> -b <alias>-split
git push <alias> <alias>-split:master --force
git branch -D <alias>-split
```

---

## Paquetes activos

| Alias remote | Prefix en monorepo | Repo GitHub | Rama |
|---|---|---|---|
| `i18n-pkg` | `personal-page/packages/i18n` | `Herman-Anez/node-package-herman-dictionary` | `master` |

---

[back](../README.md)
