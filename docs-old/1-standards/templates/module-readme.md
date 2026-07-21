# [Bounded Context Name]

**Bounded Context:** [Technical Name]  
**Main Responsibility:** [One clear and concise sentence]  
**Version:** 1.0.0

## Objective

[Business description — what problem does this context solve]

## Main Entities

- **`EntityName`** — Brief description and role in the domain.
- **`AnotherEntity`** — Brief description.

## Key Responsibilities

- Responsibility 1
- Responsibility 2
- ...

## Integration with Other Contexts

- **Subscribes to:** `ExternalEvent1`, `ExternalEvent2`
- **Publishes:** `OwnEvent1`, `OwnEvent2`
- **Direct relation with:** [other modules]

## Architecture and Attributes

- **Integrity:** Business invariants protected in the domain core (Hexagonal Architecture).
- **Auditability:** Full traceability of relevant state changes.
- **Resilience:** [Pattern used for reliable event publishing, e.g., Outbox].
- **Security:** Strict access control (RBAC) over sensitive data and PII.

## Important Links

- [Domain Model](./domain-model.md)
- [Requirements](./requirements.md)
- [API Specification](./api-spec.md)
- [Use Cases](./use-cases/index.md)
- [C4 Component Diagram](./architecture/c4-component-diagram.md)
- [Integration Events](../../5-events/integration-events.md)
- [Architecture Details](./architecture/infrastructure.md)
- [Quality Attributes](./architecture/quality-attributes.md)

[back](../../readme.md)
