# Transición de MVVM a MVVM-C (Model-View-ViewModel-Coordinator)

- Status: accepted
- Deciders: Herman Anez, Antigravity
- Date: 2026-05-24
- Tags: architecture, mvvm-c, coordinators, typescript, nextjs, presentation-layer

Technical Story: Refactorización y desacoplamiento completo de la capa de presentación de la web para eliminar duplicaciones, centralizar el enrutamiento localizado y purificar los ViewModels removiendo elementos React/JSX.

## Context and Problem Statement

A pesar de que el patrón **MVVM** inicial lograba desacoplar la infraestructura (MDX) de las vistas, presentaba varias limitaciones:
1. **Duplicación de Contextos**: Los datos globales del programador (`person` y `social`) y las llamadas a diccionarios se construían independientemente en múltiples ViewModels (`homeViewModel`, `aboutViewModel`, `layoutViewModel`), requiriendo actualizar múltiples archivos para cambios sencillos.
2. **Hardcoding de Rutas**: Las URLs localizadas dinámicas (`/[locale]/blog`, `/[locale]/work`) estaban distribuidas estáticamente en la UI y en la lógica del negocio.
3. **Acoplamiento Visual en ViewModels**: Algunos ViewModels importaban React e inyectaban elementos JSX y nodos estructurados, imposibilitando que fuesen funciones TypeScript puras y fáciles de testear offline.
4. **Falta de Control de Flujo**: Las páginas de Next.js (`page.tsx`) controlaban directamente cuándo redirigir a una página 404 (`notFound()`) o cómo enrutar entre listados y detalles basándose en respuestas del ViewModel.

## Decision Drivers

- **Pureza de ViewModels**: Los ViewModels deben ser 100% funciones de TypeScript puro, sin imports de `react` o sintaxis JSX, maximizando la testabilidad unitaria.
- **Centralización**: El mapa de enrutamiento y los datos transversales bilingües deben definirse en un único punto físico del codebase.
- **Abstracción del Flujo de Vistas**: Las páginas de Next.js deben ser vistas declarativas "tontas" que deleguen la decisión de flujo (listar, detalle o no-encontrado) a un componente intermedio de orquestación.

## Considered Options

- **Option 1: Mantener MVVM Clásico**: Continuar permitiendo lógica JSX en los ViewModels y resolviendo la navegación localizada de forma ad-hoc en cada página de Next.js.
- **Option 2: Adopción del Patrón MVVM-C con Coordinadores**: Introducir una capa de **Coordinators** para encapsular la resolución de rutas, las dependencias comunes y los flujos de página complejos. Limpiar por completo JSX de los ViewModels y convertirlos en archivos `.ts` puros.

## Decision Outcome

Chosen option: **Option 2: Adopción del Patrón MVVM-C con Coordinadores**, porque logra la máxima pureza de la capa de ViewModels (TypeScript 100% puro), elimina la duplicación de datos de perfil/rutas en toda la app y delega formalmente las decisiones de flujo en orquestadores de presentación reutilizables.

### Positive Consequences

- **Coordinadores Comunes (Shared / Navigation)**:
  - `SharedCoordinator`: Expone el contexto bilingüe unificado de datos del desarrollador (`person` y `social`).
  - `NavigationCoordinator`: Provee el mapa de rutas localizado completo (`ROUTE_MAP`), eliminando strings hardcodeados en el `Header`, `RouteGuard`, `Footer` y páginas.
- **Coordinadores de Módulo**:
  - `BlogCoordinator` y `WorkCoordinator` orquestan los flujos específicos de lista, detalle o caso `not-found`, encapsulando la toma de decisiones lógicas antes de renderizar la vista.
- **Pureza Absoluta de ViewModels**:
  - Renombramos `homeViewModel.tsx` y `aboutViewModel.tsx` a archivos de TypeScript puros (`homeViewModel.ts` y `aboutViewModel.ts`).
  - Las vistas `page.tsx` correspondientes importan `<RenderHTML />` y renderizan de forma segura a partir de strings HTML provistos por los ViewModels.
- **Testabilidad y Mantenibilidad**: Mayor facilidad para agregar tests unitarios lógicos e incorporar nuevas rutas localizadas sin tocar múltiples componentes de Next.js.

### Negative Consequences

- **Mayor número de abstracciones**: Introduce la distinción formal entre Coordinador y ViewModel, lo que requiere disciplina en el desarrollo del equipo.

## Pros and Cons of the Options

### Estructura MVVM Clásica

- Good, porque requiere menos archivos individuales por cada módulo de Next.js.
- Bad, porque mezcla maquetación JSX dentro de archivos ViewModel y duplica datos comunes en toda la aplicación.

### Patrón MVVM-C con Coordinadores

- Good, porque aísla por completo las páginas de Next.js de la estructura física del modelo de datos y de llamadas crudas al diccionario.
- Good, porque permite modificar slugs globales (ej. cambiar `/blog` por `/articulos`) en un único archivo de enrutamiento (`navigationCoordinator.ts`) sin romper la UI.
- Bad, porque requiere pasar parámetros locale y de slugs a través de la cadena Coordinador ➔ ViewModel.

## Links

- [MVVM-C Bitácora](../../../.vitacoras-contexto/mvvmc-vitacora.md)
- [Arquitectura General](../arquitectura-y-patrones.md)
- [Estructura de Directorios](../src-structure.md)
