# [UC-CTX-00] Use Case Name

**Module:** [Module Name]  
**Main Actor:** [e.g., End User, Admin, System]  
**Description:** Brief summary of what the actor is trying to achieve.

---

## 1. Preconditions

* List of prerequisites (e.g., User must be authenticated).
* Previous system state.

## 2. Main Flow (Happy Path)

1. The actor [performs action].
2. The system [validates/processes].
3. The system [saves/notifies].
4. ...

## 3. Alternate Flows / Exceptions

* **A1 - [Error name]:** What happens if data is invalid.
* **A2 - [Error name]:** What happens if the user has no permissions.

## 4. Postconditions

* **Success:** What changed in the database and what response the actor receives.
* **Failure:** System state must not be altered (Atomicity).

## 5. Domain Events (Domain & Integration Events)

* **Domain Event:** [Name of the internal event if applicable].
* **Integration Event:** [Name of the published integration event, if applicable].

[back](./index.md)
