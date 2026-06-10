# Template: Sequence Diagram

This template outlines how time-ordered interactions between MVVM layers and technical components should be visualized using Mermaid sequence syntax.

## Flow: [Process Name]

```mermaid
sequenceDiagram
    autonumber
    actor User as Visitor / Author
    participant Views as Visual Page (Once UI)
    participant VM as ViewModel (Presentation)
    participant Repo as Repository (Infrastructure)
    participant Files as Physical Storage (Disk MDX)

    User ->> Views: Navigates or performs action
    Views ->> VM: Invokes async VM function (locale, params)
    VM ->> Repo: Queries data entities
    Repo ->> Files: Reads .mdx contents (fs + gray-matter)
    Files -->> Repo: Raw string & frontmatter fields
    Repo -->> VM: Domain entity instance (pure TS)
    VM ->> VM: Resolves i18n, formats dates & flattens properties
    VM -->> Views: Returns clean UI state object
    Views -->> User: Renders localized, responsive UI
```

## Scenario Description

Briefly describe the business and technical purpose of this flow, its triggers, preconditions, and postconditions.

[back](../diagram-conventions.md)
