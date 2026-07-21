# [UC-SITE-01] Resolve Modular i18n Translation

**Module:** Site (Global & Configuration)  
**Main Actor:** System (Next.js Presenter & i18n Loader)  
**Description:** Resolver cadenas localizadas de forma bilingüe (Español o Inglés) para cualquier sección o metadato de la web en tiempo de compilación o renderizado, aplicando la estrategia de diccionarios tipados y el motor de fallbacks jerárquico.

---

## 1. Preconditions

* El parámetro `locale` de la ruta actual (`/[locale]`) debe ser un idioma soportado (`es` o `en`).
* Los archivos físicos de diccionarios JSON correspondientes a la sección (ej: `common.json`, `blog.json`) deben existir y estar declarados bajo `src/shared/i18n/lang/[locale]/`.
* Los archivos de idioma de referencia deben estar tipados estrictamente como constantes literales (`as const`) de TypeScript.

---

## 2. Main Flow (Happy Path)

1. La página de Next.js o el ViewModel de la sección correspondiente solicita el diccionario localizado invocando `getDictionary(locale, namespace)`.
2. El cargador dinámico importa en tiempo de build o ejecución el archivo JSON correspondiente a la ruta local `src/shared/i18n/lang/[locale]/[namespace].json`.
3. El ViewModel accede a las claves anidadas necesarias (ej: `d.blog.title`) resolviendo la cadena tipada.
4. Si se utiliza la traducción en línea en componentes JSX o MDX, el componente `<T />` o el hook `useT()` resuelven la llave contra el cargador de traducción.
5. El sistema inyecta la cadena traducida en el árbol HTML final pre-renderizado.
6. El visitante recibe y visualiza la interfaz completamente traducida al idioma de su ruta sin desfases de hidratación.

---

## 3. Alternate Flows / Exceptions

### A1 - Llave de traducción faltante en el idioma solicitado
Si una clave de traducción específica no se encuentra en el archivo JSON del idioma del usuario (ej: falta en `en/blog.json` pero existe en `es/blog.json`):
1. El sistema evalúa el cargador de fallbacks de 5 niveles:
   - **Nivel 1:** Intenta leer la clave del diccionario local solicitado.
   - **Nivel 2:** Al fallar, realiza una búsqueda recursiva del mismo namespace en el diccionario base por defecto (`es`).
   - **Nivel 3:** Al fallar, lee la propiedad de traducción local explícita provista en el componente JSX (ej: el prop `es="..."` en `<T />`).
   - **Nivel 4:** Al fallar, devuelve el ID de traducción crudo formateado (ej: `"blog.notFound"`).
   - **Nivel 5:** Si todo lo anterior falla, devuelve una cadena vacía o valor neutro para no romper la interfaz visual.
2. El sistema emite una advertencia controlada en consola en entornos de desarrollo para su corrección.
3. El renderizador continúa sin provocar caídas de hidratación ni errores de compilación fatales.

### A2 - Solicitud de idioma no soportado (Localización por defecto)
Si el visitante accede a una ruta con un idioma inexistente (ej: `/fr/blog`):
1. El middleware de Next.js o el generador de rutas estáticas redirige la petición a la variante por defecto `/es/blog` o devuelve un error 404 estático localizado.

---

## 4. Postconditions

* **Success:** El marcado HTML es generado con las cadenas correspondientes en el idioma correcto y los buscadores web indexan la metadata SEO bilingüe asociada.
* **Failure:** La página se renderiza pero muestra claves de traducción por defecto o los props locales provistos directamente en línea, manteniendo la estabilidad y legibilidad global del sitio.

---

## 5. Domain Events

* **Domain Event (Build-time):** `I18nValidationSucceeded` (Disparado por el script Git Hook `validate-i18n.ts` que valida que no existan discrepancias entre claves idiomáticas antes de permitir commits).

---

[back](./index.md)
