# [UC-SITE-02] Get About Page

**Bounded Context:** Site (composición)  
**Main Actor:** Visitor  
**Application Use Case:** `GetAboutPageUseCase`  
**Description:** Obtiene el perfil completo del developer para renderizar la página "Sobre mí".

---

## 1. Preconditions

- El bounded context Profile tiene datos del developer definidos.
- La ruta `/[locale]/sobre-mi` (ES) o `/[locale]/about` (EN) está registrada en `PageRouter`.

---

## 2. Main Flow (Happy Path)

1. El visitante navega a `/es/sobre-mi`.
2. `[...slug]/page.tsx` resuelve `pageId: "about"` via `PageRouter` y delega al `AboutCoordinator`.
3. `AboutCoordinator` instancia `GetAboutPageUseCase` inyectando `JsonProfileRepository`.
4. `GetAboutPageUseCase.execute(locale)`:
   - Llama `GetProfileUseCase.execute(locale)` → `PersonDTO` completo.
   - Compone `AboutPageDTO`:
     ```typescript
     {
       profile: PersonDTO  // bio completa, experience, skills, social links
     }
     ```
5. `AboutCoordinator` pasa el `AboutPageDTO` al `AboutViewModel`.
6. `AboutViewModel` transforma a `AboutViewState` (bio como HTML seguro via `RenderHTML`, timeline de experiencia, skills agrupadas por categoría).
7. `page.tsx` genera metadata SEO con bio y JSON-LD de tipo `Person`.
8. `AboutView` renderiza el layout de biografía: avatar sticky, bio, timeline de experiencia, skills, social links.

---

## 3. Alternate Flows / Exceptions

### A1 — Bio no definida en el idioma activo

1. `PersonDTO.bio` en el idioma activo es string vacío.
2. `AboutViewModel` usa fallback: `bio` del idioma por defecto (ES).
3. `AboutView` renderiza la bio en el idioma de fallback.

---

## 4. Postconditions

- **Success:** La página About muestra el perfil completo del developer: bio localizada, experiencia cronológica, skills categorizadas y links de contacto.

---

[back](./index.md)
