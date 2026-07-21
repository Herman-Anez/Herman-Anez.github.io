# About — C4 Component Diagram (MVVM-C)

## Component Diagram

```plantuml
@startuml C4_Elements
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml

title Components - About Module (Frontend MVVM-C)

Container_Boundary(mod, "About Module") {
    Component(view, "AboutView", "React Server Component", "Bio, Gallery, Timeline")
    Component(coord, "AboutCoordinator", "TypeScript", "Assembles profile layout data")
    Component(vm, "About ViewModel", "TypeScript", "Maps nested profile configs to flat UI props")
}

Container_Boundary(shared, "Shared Core") {
    Component(sharedCoord, "SharedCoordinator", "TypeScript", "Provides global 'person' and 'social' data")
}

ContainerDb(config, "Configuration", "TypeScript", "once-ui.config.ts")

Rel(view, coord, "Requests biography state")
Rel(coord, vm, "Injects raw data into")
Rel(coord, sharedCoord, "Fetches central profile info")
Rel(sharedCoord, config, "Reads person/social config")
@enduml
```

## Highlighted components

- **AboutView:** El componente de montaje principal para la página "Sobre mí". Usa los módulos atómicos de Once UI para la galería y biografía.
- **AboutCoordinator:** Orquesta la vista principal. Para la información de la persona no lee la configuración directamente, sino que pide al `SharedCoordinator`.
- **SharedCoordinator:** Asegura que la metadata de la "persona" sea idéntica tanto en la página About como en el Home o el Footer.

[back](../readme.md)
