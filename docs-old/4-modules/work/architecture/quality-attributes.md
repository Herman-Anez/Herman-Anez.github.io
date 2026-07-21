# Work — Quality Attributes

## Performance

- **Static Generation (SSG):** Al igual que el blog, el portafolio de trabajo está pre-renderizado. La carga de vistas de galería y casos de estudio es inmediata.
- **Asset Co-location:** Las imágenes de proyectos están organizadas jerárquicamente, permitiendo optimización estática y cargas de recursos eficientes (LCP bajo).

## Maintainability & Integrity

- **Family Sub-routing:** La integridad jerárquica de proyectos y sub-proyectos está garantizada por el esquema de `ProjectRepository`.
- **Content Decoupling:** Los casos de estudio escritos en MDX no dependen de componentes React específicos, facilitando la refactorización visual global.

## SEO & Rich Media

- **Open Graph Ready:** Cada proyecto exporta metadatos OG predictivos (usando imágenes estáticas) para maximizar el impacto visual al compartirse en redes sociales.
- **Semantic HTML:** Las Vistas del portafolio inyectan esquemas semánticos (JSON-LD) para mejorar la lectura por parte de indexadores.

## Related documents

- [Infrastructure](./infrastructure.md)
- [Architecture and Patterns](../../../2-architecture/arquitectura-y-patrones.md)
