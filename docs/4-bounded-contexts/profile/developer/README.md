# Module: Profile

**Bounded Context:** Profile  
**Responsabilidad:** Datos del developer — identidad, biografía, experiencia, skills y redes sociales. Fuente de verdad del perfil público. Consumido por Site (Home y About) y el layout global (Footer).

---

## Dominio

### Aggregate Root: `Person`
```
Person
├── name: string
├── role: LocalizedText        ← "Desarrollador de Software" / "Software Developer"
├── bio: LocalizedText         ← descripción larga para About
├── tagline: LocalizedText     ← descripción corta para Home/Hero
├── avatar: ImagePath
├── location: string
├── email: Email
├── socialLinks: SocialLink[]
├── skills: Skill[]
└── experience: Experience[]
```

**Invariantes:**
- `name`, `email`, `avatar` obligatorios
- `email` con formato RFC 5322 válido
- `socialLinks` puede ser vacío, no null

### Value Objects
| VO | Campos |
|----|--------|
| `Email` | `value: string` — formato válido |
| `SocialLink` | `platform, url (https://), icon?` |
| `Skill` | `name, category?` |
| `Experience` | `company, role, period: DateRange, description, technologies[]` |

### Puerto
```typescript
interface IProfileRepository {
  getProfile(locale: Locale): Promise<Person>;
}
```

---

## Aplicación

### Casos de Uso
| Use Case | Entrada | Salida |
|----------|---------|--------|
| `GetProfileUseCase` | `locale` | `PersonDTO` |

### DTOs
- `PersonDTO` — `name, role, bio, tagline, avatar, location, email, socialLinks[], skills[], experience[]`

---

## Infraestructura

### `JsonProfileRepository`
- Implementa `IProfileRepository`
- Lee datos del developer desde archivo de configuración estático (JSON o TypeScript con `as const`)
- Construye entidad `Person` con sus value objects
- Error en build-time si invariantes no se cumplen

---

## Presentación (MVVM-C)

Este BC no tiene vistas propias. Sus datos son consumidos por Site BC.

| Consumidor | Datos usados |
|------------|-------------|
| `GetHomePageUseCase` | `name, role, tagline, avatar` |
| `GetAboutPageUseCase` | `PersonDTO` completo |
| Layout / Footer | `socialLinks` |

---

## Estructura de Archivos

```
src/
├── domain/profile/
│   ├── entities/Person.ts
│   ├── value-objects/Email.ts
│   ├── value-objects/SocialLink.ts
│   ├── value-objects/Skill.ts
│   ├── value-objects/Experience.ts
│   └── ports/IProfileRepository.ts
├── application/profile/
│   ├── GetProfileUseCase.ts
│   └── dtos/PersonDTO.ts
└── infrastructure/profile/
    └── JsonProfileRepository.ts
```

---

## Use Cases
- [UC-PROFILE-01 — Get Developer Profile](./use-cases/uc-profile-01-get-profile.md)
