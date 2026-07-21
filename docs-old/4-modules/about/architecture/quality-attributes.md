# About — Quality Attributes

## Consistency

- **Data Centralization:** Toda la información personal, biográfica y enlaces sociales residen en la configuración central. El `SharedCoordinator` garantiza que cambiar el avatar en la configuración lo actualice automáticamente en todo el sistema.

## Performance

- **Media Optimization:** Las imágenes de la galería (`public/images/gallery/`) deben servirse mediante componentes que prevengan reflows (dimensiones explícitas) y se beneficien de la compresión del framework.
- **Zero Runtime Logic:** El ensamblado del perfil ocurre en servidor (SSG), resultando en HTML puramente estático descargado de forma instantánea.

## Related documents

- [Infrastructure](./infrastructure.md)
- [Architecture and Patterns](../../../2-architecture/arquitectura-y-patrones.md)
