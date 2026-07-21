# Diagram Conventions

**Version:** 1.0.0  
**Status:** Active  
**Standard Tool:** Mermaid

## Objective

Ensure all technical diagrams in the project have a unified aesthetic, are easy to maintain ("diagram as code"), and use standard Mermaid syntax natively supported by GitHub and modern Markdown parsers.

---

## 🛠️ Standards by Diagram Type

### 1. C4 Model — Container / Component Diagrams (Level 2 & 3)
- **Purpose:** Represent the architectural boundaries, subsystems, and the clean DDD MVVM layers.
- **Syntax:** Mermaid Flowcharts (`graph TD` or `graph LR`).
- **Location:**
  - System topology: `/docs/2-architecture/c4-model/c4-containers.md`
  - Context C4: `/docs/4-modules/[bounded-context]/architecture/c4-component-diagram.md`

### 2. Sequence Diagrams
- **Purpose:** Detail time-ordered interactions between ViewModel, Repositories, i18n loaders, and physical files.
- **Syntax:** Mermaid Sequence (`sequenceDiagram`).
- **Location:**
  - Cross-cutting flows: `/docs/3-global-processes/`
  - Module use cases: `/docs/4-modules/[bounded-context]/use-cases/`

### 3. Domain Models and Relationships
- **Purpose:** Map relationships between Aggregate Roots, Entities, and Value Objects.
- **Syntax:** Mermaid Class Diagrams (`classDiagram`).
- **Location:** `/docs/4-modules/[bounded-context]/domain-model.md`

---

## 🎨 Style and Editorial Rules

To prevent rendering errors and maintain clean diagram aesthetics:

1. **Quote labels with special characters:** Always surround labels containing parentheses, brackets, or commas with double quotes.
   - ✅ `id["Label (Extra Info)"]` | ❌ `id[Label (Extra Info)]`
2. **No HTML formatting inside labels:** Avoid embedding raw HTML tags within node text to preserve compatibility across various Markdown renderers.
3. **Descriptive Arrows:** All arrows representing relationships must include a clean, descriptive verb or label.
   - ✅ `VM -->> View: Exposes flattened state` | ❌ `VM -->> View`
4. **PascalCase for Nodes:** Use clean PascalCase for class names and component identifiers.

---

## 📁 Maintenance

- Diagrams **must live exclusively inside Markdown code blocks** using the ````mermaid ```` code fence.
- Never commit binary images (PNG, JPG) of diagrams to the repository. The diagram-as-code must be processed by the rendering engine directly.

---

## 🔗 Related Templates

- [Template: C4 Component Diagram](./templates/c4-component-diagram.md)
- [Template: Sequence Diagram](./templates/sequence-diagram.md)
- [Template: Domain Model Diagram](./templates/domain-model-diagram.md)

[back](./documentation-guidelines.md)
