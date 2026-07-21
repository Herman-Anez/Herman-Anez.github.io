# Adopción de Once UI como Sistema de Diseño Primario

- Status: accepted
- Deciders: Herman Anez
- Date: 2026-05-14
- Tags: frontend, design-system, ui, once-ui, css

## Context and Problem Statement

El portafolio personal requiere una interfaz minimalista, moderna y de alta calidad visual, similar a los estándares estéticos impuestos por plataformas líderes de la industria como Linear, Vercel o Raycast. El problema consiste en lograr esta estética premium de manera eficiente sin reinventar un sistema de diseño desde cero, al mismo tiempo que se garantiza compatibilidad nativa con modo oscuro/claro y un excelente rendimiento web (Lighthouse score cercano a 100).

## Decision Drivers

- **Excelencia Visual**: Conseguir un diseño premium, minimalista y con tipografías y contrastes perfectamente afinados.
- **Modo Oscuro Integrado**: Soporte nativo para modo oscuro/claro de forma fluida.
- **Rendimiento**: Minimizar la carga de CSS en runtime y evitar librerías visuales pesadas o mal optimizadas.
- **Semántica y Estructura**: Mantener un código limpio y estructurado que elimine el "ruido de utilidades" (utility noise) presente en frameworks como Tailwind CSS.

## Considered Options

- **Option 1: Tailwind CSS + Shadcn UI**: Muy popular, pero añade un excesivo ruido de clases en el HTML (utility noise) y requiere mucha configuración para lograr la estética minimalista altamente personalizada.
- **Option 2: Vanilla CSS/SCSS desde cero**: Proporciona control total pero incrementa drásticamente el tiempo de desarrollo del sistema de diseño, tokens, espaciados y componentes comunes.
- **Option 3: Once UI (@once-ui-system/core)**: Un sistema de diseño minimalista basado en tokens semánticos, un motor de layout rígido y limpio, y estética orientada a la claridad y contraste premium por defecto.

## Decision Outcome

Chosen option: **Option 3: Once UI**, porque proporciona de inmediato la estética de alta calidad buscada, incluye un conjunto completo de componentes fluidos y flexibles construidos sobre estándares semánticos puros y cuenta con soporte nativo de excelente rendimiento para modo oscuro.

### Positive Consequences

- **Consistencia de Tokens**: Uso estricto de tokens de espaciado y color (en escalas HSL), lo que evita la introducción de colores arbitrarios (hex codes) o márgenes inconsistentes.
- **Cero Utility Noise**: Se prefiere el uso de propiedades estructurales claras sobre componentes semánticos antes que listas interminables de clases de utilidad.
- **Estructura Limpia**: Adopción de la regla estricta de **cero divs planos (`<div>`)** en la capa visual, reemplazándolos por `<Column>`, `<Row>` o `<Grid>` que facilitan layouts semánticos autoexplicativos.

### Negative Consequences

- **Curva de Aprendizaje**: Los desarrolladores deben familiarizarse con las propiedades de layout de Once UI (por ejemplo, `horizontal`, `vertical`, `fillWidth`, etc.) y evitar la tentación de usar etiquetas HTML tradicionales o clases tradicionales de CSS para tareas de layout comunes.
- **Rigidez del Framework**: Algunas personalizaciones muy específicas requieren anular estilos a través de módulos SCSS independientes o estilos en línea controlados, evitando romper los tokens del sistema.

## Pros and Cons of the Options

### Tailwind CSS + Shadcn UI

- Good, porque tiene un ecosistema enorme y gran facilidad de copiar componentes prediseñados.
- Bad, porque añade demasiado ruido en el JSX con docenas de clases CSS en línea, dificultando la lectura de la jerarquía semántica.
- Bad, porque requiere configurar manualmente los contrastes y paletas HSL para lograr la estética minimalista deseada.

### Vanilla CSS/SCSS desde cero

- Good, porque no añade ninguna dependencia externa de framework en la capa visual.
- Bad, porque exige construir y mantener manualmente la lógica de cambio de temas (light/dark theme) y todos los componentes base (Buttons, Flex boxes, Layouts).

### Once UI

- Good, porque impone una estética premium por defecto inspirada en interfaces como Linear o Raycast.
- Good, porque proporciona un motor semántico claro (`<Row>`, `<Column>`, `<Grid>`) que estandariza el diseño de la interfaz.
- Bad, porque la personalización extrema requiere un conocimiento profundo de su sistema de tokens y propiedades específicas.

## Links

- [Once UI Development Rules](../../1-standards/coding-conventions.md)
