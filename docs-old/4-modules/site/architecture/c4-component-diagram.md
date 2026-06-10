# Site — C4 Component Diagram (MVVM-C Core)

## Component Diagram

```plantuml
@startuml C4_Elements
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml

title Components - Site Core Module

Container_Boundary(mod, "Site Module (Core)") {
    Component(shell, "Next.js Catch-All", "Server Component", "app/[locale]/[...slug]/page.tsx")
    Component(router, "PageRouter", "Singleton", "Resolves semantic slugs to canonical PageIds")
    Component(i18n, "Dictionary Loader", "TypeScript", "Loads JSON language files")
    Component(guard, "RouteGuard", "Client Component", "Client-side auth validation")
}

ContainerDb(config, "Configuration", "TypeScript", "once-ui.config.ts")
ContainerDb(json, "I18n Dictionaries", "JSON", "src/shared/i18n/lang/")

Rel(shell, router, "Queries route mapping")
Rel(shell, i18n, "Loads locale dictionaries")
Rel(shell, guard, "Wraps protected routes with")
Rel(router, config, "Reads base route config")
Rel(i18n, json, "Parses")
@enduml
```

## Highlighted components

- **Next.js Catch-All:** La capa límite del framework. Intercepta todas las URLs dinámicas e inicia la cadena de resolución.
- **PageRouter:** El motor de enrutamiento semántico que cruza los slugs de las URLs con las IDs internas del sistema.
- **RouteGuard:** Un componente de orden superior (HOC) que verifica contraseñas en el cliente antes de montar contenido protegido.
- **Configuration & I18n:** Archivos de recursos puramente estáticos que definen el comportamiento global del portal.

[back](../readme.md)
