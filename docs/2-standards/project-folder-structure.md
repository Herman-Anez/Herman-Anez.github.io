# Estructura Genérica de Carpetas por Módulo (Patrón MVVM-C)

Este documento define la plantilla y separación genérica de directorios por módulo del sistema. Se basa en una arquitectura desacoplada que separa la infraestructura web (Next.js), los componentes visuales interactivos (React Views) y la lógica de negocio pura (Clean Architecture / Domain-Driven Design).

---

## 📂 Árbol de Directorios Genérico

```text
src/
│
├── app/[locale]/[modulo-slug]/          # 1. CAPA DE RUTA / DELEGACIÓN (Next.js)
│   ├── page.tsx                         # Shell para el listado o portada del módulo
│   └── [...slug]/
│       └── page.tsx                     # Shell para la vista de detalle dinámico (opcional)
│
├── components/
│   ├── [modulo-slug]/                   # 2. COMPONENTES INTERNOS ACOTADOS (Opcional)
│   │   └── [InternalComponent].tsx      # Componentes UI reutilizables solo dentro del módulo
│   │
│   └── layout-components/               # 3. CAPA DE VISTAS DE PRESENTACIÓN PURA
│       ├── [Modulo]ListView.tsx         # Vista visual desacoplada para listado del módulo
│       └── [Modulo]DetailView.tsx       # Vista visual desacoplada para detalle del módulo
│
└── modules/[modulo-slug]/               # 4. CAPA DE NEGOCIO Y DATOS (MVVM-C Puro)
    ├── domain/                          # A. DOMINIO (Contratos y Modelos de Negocio)
    │   └── types.ts                     # Interfaces y tipos de datos planos
    │
    ├── infrastructure/                  # B. INFRAESTRUCTURA (Adaptadores Físicos)
    │   └── [modulo]Repository.ts        # Acceso físico a datos (FileSystem, API, etc.)
    │
    └── presentation/                    # C. PRESENTACIÓN (Lógica bilingüe / Orquestación)
        ├── [modulo]Coordinator.ts       # Coordinador: Orquesta flujos y redirecciones
        └── viewModels/
            ├── [modulo]ListViewModel.ts # ViewModel: Mapea y traduce datos para el listado
            └── [modulo]DetailViewModel.ts# ViewModel: Mapea y traduce datos para el detalle
```

---

## 🧩 Responsabilidad Genérica de los Componentes

### 1. El Shell de la Ruta (`src/app/`)
* **Qué hace**: Resuelve parámetros de Next.js, inyecta metadatos SEO y esquemas JSON-LD en el servidor.
* **Flujo**: Consulta al **Coordinator** del módulo pasándole los parámetros y renderiza la **Vista** de presentación pasándole el estado calculado.

### 2. Los Componentes Internos (`src/components/[modulo-slug]/`)
* **Qué hace**: Elementos visuales reutilizables específicos de un módulo (por ejemplo, una grilla de ítems o filtros de búsqueda). Son componentes subordinados que consume la vista principal del módulo.

### 3. Las Vistas de Presentación Pura (`src/components/layout-components/`)
* **Qué hace**: Contienen el 100% de la maquetación visual responsiva y estilos interactivos.
* **Regla**: Reciben toda la información a renderizar a través de `props`. Tienen prohibido interactuar con APIs de servidor, el filesystem o variables de entorno directas.

### 4. Capa de Negocio del Módulo (`src/modules/`)
* **Domain**: Tipado estricto e invariantes libres de acoplamiento tecnológico.
* **Infrastructure**: Código de acceso a bases de datos, APIs externas o parsers de disco.
* **ViewModels**: Código de TypeScript puro. Recibe los datos crudos del repositorio y las traducciones de idioma, transformándolos en un objeto de estado plano ideal para la vista.
* **Coordinators**: Decide cuál es el flujo correcto (ejemplo: mostrar el detalle si existe, o disparar la redirección a error `404` si el recurso no es válido).
