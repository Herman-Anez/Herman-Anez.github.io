# Template: C4 Component Diagram (Level 3)

This template serves as a guide to draw Mermaid component diagrams representing the layers within a specific Bounded Context in our project.

## Component Diagram

```mermaid
graph TD
    subgraph "[Bounded Context Name]"
        Views["Visual Views (Once UI React Pages)"]
        VM["ViewModels (Presentation Layer)"]
        Domain["Domain Model (Pure Entities)"]
        Infra["Infrastructure Repositories (MDX Readers)"]
    end

    Files["Physical .mdx Files (Disk Storage)"]
    Dicts["JSON Dictionaries (i18n Shared)"]

    Views -->> VM: "Consumes flattened states"
    VM -->> Domain: "Coordinates domain entities"
    VM -->> Dicts: "Resolves translations (resolveKey)"
    VM -->> Infra: "Queries data via interfaces"
    Infra -->> Files: "Parses gray-matter from filesystem"
```

## Highlighted Components

- **Visual Views:** Declarative React/Once UI components. Completely "dumb", consuming pre-flattened properties.
- **ViewModels:** Asynchronous state orchestrators. They format dates, resolve translation IDs, and structure data cleanly.
- **Domain Model:** Protects domain invariants, representing business entities pure and decoupled from React.
- **Infrastructure Repositories:** Low-level fs/gray-matter adapters that read physical disk contents.

[back](../diagram-conventions.md)
