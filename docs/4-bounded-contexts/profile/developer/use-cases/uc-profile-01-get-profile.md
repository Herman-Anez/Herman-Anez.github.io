# [UC-PROFILE-01] Get Developer Profile

**Bounded Context:** Profile  
**Main Actor:** Site BC (consumidor interno)  
**Application Use Case:** `GetProfileUseCase`  
**Description:** Obtiene los datos completos del developer para renderizar las páginas About, Home (tagline + avatar) y el layout global (social links en Footer).

---

## 1. Preconditions

- Los datos del perfil están definidos en la fuente de datos del bounded context Profile (archivo de configuración o JSON estático).

---

## 2. Main Flow

1. El Coordinator del módulo consumidor (Site, About) instancia `GetProfileUseCase` inyectando `JsonProfileRepository` como implementación de `IProfileRepository`.
2. `GetProfileUseCase.execute(locale)`:
   - Llama `IProfileRepository.getProfile(locale)`.
   - `JsonProfileRepository` lee los datos de perfil y construye la entidad `Person`.
   - El Use Case mapea a `PersonDTO`.
3. El Coordinator incluye el `PersonDTO` en el DTO de página correspondiente (`HomePageDTO`, `AboutPageDTO`).

---

## 3. Alternate Flows / Exceptions

### A1 — Datos de perfil incompletos

1. La entidad `Person` no puede construirse por violar invariantes (ej: `name` vacío, `email` inválido).
2. `JsonProfileRepository` lanza error en build-time — el build falla antes de llegar a producción.

---

## 4. Postconditions

- **Success:** El `PersonDTO` contiene todos los campos del developer listos para renderizar: nombre, rol localizado, bio, tagline, avatar, email, social links, skills, experiencia.

---

## 5. Consumers

| Caso de Uso Consumidor | Datos usados |
|------------------------|-------------|
| `GetHomePageUseCase` | `name`, `role`, `tagline`, `avatar` |
| `GetAboutPageUseCase` | `PersonDTO` completo |
| Layout / Footer | `socialLinks` |

---

[back](./index.md)
