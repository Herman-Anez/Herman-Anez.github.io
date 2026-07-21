# Mecanismos de Eventos y Ciclo de Vida

Este catálogo define los eventos lógicos y físicos que coordinan el comportamiento dinámico de la interfaz de usuario de **Herman's Personal Page** en el cliente y los procesos de automatización estática en tiempo de compilación.

---

## 🏛️ 1. Client Navigation Events (Eventos de Navegación Localizados)

### `NavigateToLocalizedPathEvent`

Intercepción transparente de rutas a través del componente customizado de traducción y enlaces Markdown.

- **Módulo Productor**: `site` / `shared`
- **Módulo Consumidor**: Enrutador declarativo Next.js (App Router)
- **Mecanismo**: Interceptor `createCustomLink` nativo.

**Contrato de Datos (Event Payload)**
```typescript
interface NavigateToLocalizedPathEvent {
  eventId: string;          // UUID único del evento
  targetPath: string;       // Ruta original solicitada por el link (ej: "/blog/mi-post")
  activeLocale: 'es' | 'en'; // Idioma activo en la sesión del cliente
  resolvedPath: string;     // Ruta final inyectada en el router (ej: "/es/blog/mi-post")
}
```

---

## 🌗 2. Browser Theme Lifecycle Events (Ciclo de Vida del Tema Visual)

### `ThemePreferenceChangedEvent`

Evento de escucha en tiempo real ante variaciones del tema visual en el sistema operativo del usuario.

- **Módulo Productor**: Motor del navegador (Media Query Listener)
- **Módulo Consumidor**: Componente Root Layout (`site`)
- **Mecanismo**: `window.matchMedia('(prefers-color-scheme: dark)')`

**Contrato de Datos (Event Payload)**
```typescript
interface ThemePreferenceChangedEvent {
  occurredOn: string;       // Timestamp ISO 8601 UTC
  prefersDark: boolean;     // Indica si el usuario prefiere interfaz oscura en OS
  resolvedTheme: 'dark' | 'light'; // Tema final aplicado al atributo HTML data-theme
}
```

---

## 📁 3. Build-Time Static Generation Events (Eventos de Compilación)

### `ContentIndexedIntegrationEvent`

Gatillado automáticamente durante la fase de compilación del monorepo (`npm run build`).

- **Módulo Productor**: Adaptador `mdxBlogRepository` (`blog` / `work`)
- **Módulo Consumidor**: Sitemap Generator, RSS Syndication Engine
- **Mecanismo**: Lectura física en disco y compilación estática.

**Contrato de Datos (Event Payload)**
```json
{
  "occurredOn": "2026-05-19T13:22:00Z",
  "data": {
    "slug": "clean-architecture-frontend",
    "locales": ["es", "en"],
    "publishedAt": "2026-05-19",
    "readingTimeMinutes": 5,
    "tags": ["architecture", "clean-code"]
  }
}
```
- **Resultado del Flujo**: Generación física en disco de los ficheros `/sitemap.xml` y `/feed.xml` listos para su indexación SEO.

---

[back](./readme.md)
