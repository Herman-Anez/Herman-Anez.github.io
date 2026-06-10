# Guía de Referencia: Patrón Arquitectónico MVVM-C

Este documento explica de forma sencilla y estructurada el patrón **MVVM-C (Model-View-ViewModel-Coordinator)** y cómo se encuentra implementado específicamente en el proyecto **Herman's Personal Blog**.

---

## 1. ¿Qué es MVVM-C?

**MVVM-C** es un patrón de arquitectura de software para la capa de presentación que divide las responsabilidades en cuatro partes claramente diferenciadas. Su objetivo principal es lograr un **desacoplamiento total**: que la vista no sepa cómo se obtienen los datos, y que los datos no sepan cómo se pintan en pantalla.

*   **M**odel (Modelo): *¿Qué datos tenemos?* (Los datos crudos y las reglas de negocio).
*   **V**iew (Vista): *¿Cómo los pintamos en pantalla?* (Componentes visuales puros).
*   **VM** (ViewModel): *¿Cómo preparamos los datos para que la vista los entienda?* (El traductor y formateador).
*   **C**oordinator (Coordinador): *¿Hacia dónde vamos y qué flujo cargamos?* (El director de orquesta y mapa de navegación).

---

## 2. Las Partes de MVVM-C en Nuestro Proyecto

Aquí tienes un desglose de cómo mapeamos cada pieza conceptual dentro de la estructura real de carpetas de tu código:

```
[ Capa de Datos / MDX ]   ───►  MODEL (domain/ & infrastructure/)
          │
          ▼
[ Capa de Orquestación ]  ───►  COORDINATOR (*Coordinator.ts)
          │
          ▼
[ Capa de Preparación ]   ───►  VIEWMODEL (viewModels/*.ts)
          │
          ▼
[ Capa de Pintado (UI) ]  ───►  VIEW (layout-components/ & page.tsx)
```

### 1. El Modelo (Model)
Es el origen de la verdad de los datos de la aplicación. En este proyecto, nuestro "servidor" o base de datos son archivos **MDX estáticos**.
*   **Representación en el código**: 
    *   **Entidades de Dominio**: Clases o tipos de TypeScript puros (`src/modules/[modulo]/domain/`) que definen cómo es un Post o un Proyecto.
    *   **Repositorios de Infraestructura**: Clases (`src/modules/[modulo]/infrastructure/`) encargadas de leer el disco con `fs` y `gray-matter`, parsear el Markdown y devolver entidades del dominio.

### 2. El Coordinador (Coordinator)
Es la puerta de entrada de las peticiones. No dibuja nada en pantalla ni formatea datos directamente. En su lugar:
*   Decide qué flujo de vista cargar (ej. decide si mostrar una lista de posts, una ficha de detalle, o redirigir a un error 404).
*   Provee dependencias comunes y contextos globales compartidos (como el perfil del programador o el mapa de navegación bilingüe centralizado).
*   **Representación en el código**: 
    *   Coordinadores locales: `src/modules/[modulo]/presentation/[modulo]Coordinator.ts`
    *   Coordinadores compartidos: `src/shared/coordinator/` (ej. `sharedCoordinator.ts`, `navigationCoordinator.ts`).

### 3. El ViewModel
Es un traductor de datos. Toma las entidades crudas entregadas por el repositorio (Modelo) y las transforma en una estructura de datos plana, simplificada y lista para ser pintada por la pantalla.
*   **Ejemplos de tareas del ViewModel**:
    *   Formatear fechas según el idioma (`"16 de mayo de 2026"` o `"May 16, 2026"`).
    *   Consultar diccionarios JSON de i18n para traducir títulos mediante `resolveKey()`.
    *   Simplificar objetos complejos a variables simples (un string HTML ya parseado, strings para avatares, etc.).
*   **Regla de oro**: Es TypeScript **100% puro**. No tiene imports de `react` ni elementos JSX, lo que permite probarlo con tests unitarios automáticos en milisegundos.
*   **Representación en el código**: `src/modules/[modulo]/presentation/viewModels/`

### 4. La Vista (View)
Es la interfaz gráfica que ve el usuario. Recibe un estado de datos completamente plano del ViewModel y lo dibuja en pantalla usando los componentes de UI.
*   **Regla de oro**: No realiza cálculos lógicos complejos, no lee diccionarios de traducción directamente, ni accede al filesystem. Si el dato dice `title: "Hola"`, la vista se limita a pintar `<h1>Hola</h1>`.
*   **Representación en el código**:
    *   Las "Proto-Pages" y shells de Next.js: `src/app/` y `src/proto-pages/`.
    *   Los componentes de maquetación: `src/components/personal/layout-components/` (ej. `BlogPostView.tsx`, `WorkDetailView.tsx`).

---

## 3. Ejemplo Práctico: Flujo de un Post de Blog

Imaginemos que un usuario entra en `https://tusitio.com/es/blog/mi-post`. Este es el viaje de los datos:

1.  **La Vista Shell (Next.js)** captura la petición en `src/app/[locale]/blog/[slug]/page.tsx` y le pasa la pelota al coordinador:
    ```typescript
    const flow = await getBlogPostCoordinator(slug, locale);
    ```
2.  **El Coordinador (`blogCoordinator.ts`)** evalúa la ruta:
    *   Llama al repositorio para buscar el post físico `mi-post`.
    *   *¿Existe?* Sí $\rightarrow$ Llama al `blogPostViewModel` para preparar la información y devuelve `{ type: 'post', state: datosDelPost }`.
    *   *¿No existe?* No $\rightarrow$ Devuelve `{ type: 'not-found' }` (la shell capturará esto y llamará a la función `notFound()` de Next.js).
3.  **El ViewModel (`blogPostViewModel.ts`)** toma el post crudo, aplica `resolveKey` para traducir el título usando el diccionario de español, formatea la fecha del artículo a `"numeric-long"` en castellano, y entrega una estructura plana llamada `BlogPostViewState`.
4.  **La Vista Reutilizable (`BlogPostView.tsx`)** recibe ese objeto `BlogPostViewState` y dibuja los componentes premium de Once UI utilizando variables totalmente planas:
    ```tsx
    <Heading>{post.title}</Heading>
    <Text>{post.dateFormatted}</Text>
    ```

---

## 4. ¿Por qué este patrón es genial para tu portafolio?

1.  **Mantenibilidad Extrema**: Si mañana decides migrar tu base de datos de archivos MDX a un Headless CMS (como Sanity o Strapi), **solo modificas la carpeta `infrastructure/`**. El Coordinador, el ViewModel y las Vistas de React seguirán funcionando exactamente igual sin enterarse del cambio.
2.  **i18n Centralizado**: No tienes rutas ni traducciones desparramadas por el código. Si agregas un nuevo idioma, los coordinadores y diccionarios centralizados lo absorben de manera natural.
3.  **Testabilidad de Hierro**: Al estar los ViewModels libres de JSX y React, puedes testear toda la lógica de tu web (filtrado de tags, ordenación de posts, fallbacks de traducción) con simples scripts de node en terminal.
