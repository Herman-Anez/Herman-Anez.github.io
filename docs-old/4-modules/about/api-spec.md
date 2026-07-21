# API & ViewModel Specification — About Module

**Bounded Context:** about  
**Version:** 2.0.0  
**Format:** TypeScript Interfaces  

## 🎯 API Objective

El módulo de **About** expone una **API Programática Estrictamente Tipada** en TypeScript bajo el patrón **DDD + MVVM**, aislando la lectura física de disco de los layouts declarativos de **Once UI**.

---

## 🏛️ Programmatic Contracts (TypeScript Interfaces)

### 1. Presentation Layer (ViewModels)

Representaciones aplanadas e internacionalizadas listas para renderizarse reactivamente en Once UI.

#### A. `AboutViewModel` (Perfil Profesional Consolidado)
```typescript
export interface AboutViewModel {
  biography: {
    greeting: string;             // Saludo bilingüe (ej: "¡Hola! Soy Herman")
    textHTML: string;             // Contenido HTML rico procesado de forma segura
  };
  skills: {
    expert: string[];            // Tecnologías nivel experto (ej: ["Next.js", "TypeScript"])
    proficient: string[];        // Tecnologías nivel avanzado (ej: ["Docker", "Vitest"])
    familiar: string[];          // Tecnologías conocidas (ej: ["Python", "Kubernetes"])
  };
  cvDownload: {
    url: string;                 // URL local de descarga física del PDF bilingüe
    label: string;               // Literal localizado del botón (ej: "Descargar CV (PDF)")
    fileSize: string;            // Tamaño aproximado expuesto (ej: "1.2 MB")
  };
}
```

#### B. `TimelineEventViewModel` (Hito de Trayectoria)
```typescript
export interface TimelineEventViewModel {
  id: string;                    // Identificador único del evento
  type: 'work' | 'education';    // Categoría unívoca
  roleOrDegree: string;          // Cargo profesional o título académico
  institutionOrCompany: string;  // Empresa o universidad
  period: string;                // Periodo de fechas localizado (ej: "2022 - 2024" o "Present")
  description: string;           // Detalle y logros del hito localized
}
```

---

### 2. Infrastructure Layer (Ports / Repositories)

Mapea los lectores físicos del monorepo y deserializa archivos estáticos.

#### A. `IAboutRepository` (Puerto de Persistencia)
```typescript
export interface IAboutRepository {
  /**
   * Carga la biografía profesional de Herman localizada
   */
  getBiography(locale: string): Promise<Biography>;

  /**
   * Obtiene todos los hitos académicos y laborales del timeline
   */
  getTimelineEvents(locale: string): Promise<TimelineEvent[]>;

  /**
   * Carga el listado consolidado de competencias
   */
  getSkillSet(): Promise<SkillSet>;
}
```

---

### 3. Application Use Cases (Programmatic API / Presenters)

#### A. `getAboutVM`
- **Firma:** `(locale: string): Promise<AboutViewModel>`
- **Acción:** Invoca el repositorio físico, recupera la biografía y competencias, y mapea el enlace al asset CV de forma localizada.

#### B. `getTimelineVM`
- **Firma:** `(locale: string): Promise<TimelineEventViewModel[]>`
- **Acción:** Recupera todos los hitos cronológicos, los ordena de forma estrictamente descendente (experiencia más reciente al principio) y retorna la colección.

---

## 🛡️ Validation Rules

- **Pre-renderizado Estático**: Todas las firmas de ViewModels son consumidas a través de rutas pre-compiladas, garantizando una hidratación visual sin parpadeos de carga.
- **Resolución de CV Local**: El enlace inyectado en `cvDownload.url` se mapea dinámicamente según el locale activo, previniendo descargas de idioma equivocado.
- **Categorización Rígida**: Las vistas Once UI bloquean el renderizado de cualquier hito del Timeline que no coincida exactamente con las propiedades del enumerado `work` o `education`.

---

[back](./readme.md)
