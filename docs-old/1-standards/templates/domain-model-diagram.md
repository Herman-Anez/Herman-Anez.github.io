# Template: Domain Model Diagram

This template outlines standard tactical relationships between Aggregate Roots, Entities, and Value Objects inside a Bounded Context.

## Tactical Model

```mermaid
classDiagram
    class AggregateRootName {
        <<Aggregate Root>>
        -Id id
        -Status status
        +businessInvariantCheck()
    }
    class EntityName {
        -Id id
        -Attributes info
    }
    class ValueObjectName {
        <<Value Object>>
        -String value
    }

    AggregateRootName "1" *-- "n" EntityName : contains
    AggregateRootName "1" *-- "1" ValueObjectName : has
```

## Model Explanation

Use this section to explain the main invariants (business rules) that the Aggregate Root protects and clarify tactical design choices.

[back](../diagram-conventions.md)
