# Guía de Despliegue en GitHub Pages con GitHub Actions

Esta guía detalla el proceso paso a paso para configurar un pipeline automatizado de integración y despliegue continuo (CI/CD) utilizando GitHub Actions para alojar tu portafolio estático en **GitHub Pages**.

---

## 🛠️ Paso 1: Configurar GitHub Pages en el Repositorio

1. Entra a tu repositorio en **GitHub**.
2. Dirígete a la pestaña **Settings** (Configuración) en el menú superior.
3. En la barra lateral izquierda, selecciona la sección **Pages**.
4. En el apartado **Build and deployment**:
   * Bajo **Source** (Origen), selecciona **GitHub Actions** en el menú desplegable (esto indica que GitHub no compilará tu sitio de forma genérica, sino que utilizará el archivo de configuración personalizado que crearemos a continuación).

---

## 🔑 Paso 2: Configurar las Variables de Entorno en GitHub

Dado que la seguridad (`RouteGuard.tsx`) valida la contraseña usando una variable de entorno, debes inyectar este valor durante el flujo de compilación en GitHub.

1. En la configuración de tu repositorio (**Settings**), expande el menú **Secrets and variables** de la barra lateral izquierda y haz clic en **Actions**.
2. Ve a la pestaña **Variables** (es seguro usar variables públicas para el prefijo `NEXT_PUBLIC_`, aunque también puedes configurarlo como Secret si lo deseas).
3. Añade una nueva variable haciendo clic en **New repository variable**:
   * **Name**: `NEXT_PUBLIC_PAGE_ACCESS_PASSWORD`
   * **Value**: *[Tu contraseña deseada para proteger los proyectos de trabajo]*
4. Añade otra variable si tu sitio utiliza una URL base distinta:
   * **Name**: `NEXT_PUBLIC_BASE_URL`
   * **Value**: `https://tu-usuario.github.io/tu-repositorio` (o tu dominio personalizado).

---

## 📄 Paso 3: Crear el Archivo del Workflow (Workflow de CI/CD)

Crea el archivo de configuración para el pipeline automatizado en tu repositorio. La ruta del archivo debe ser exactamente:
`.github/workflows/deploy.yml`

Aquí tienes la configuración óptima para tu proyecto con Next.js y el script `prebuild`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - publish  # Rama designada para el despliegue automático
  # Permite ejecutar el flujo manualmente desde la pestaña de Actions en GitHub
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

# Permite una sola compilación activa a la vez para evitar colisiones
concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build_and_deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
          cache-dependency-path: personal-page/package.json

      # Optimiza los tiempos de build cacheando la compilación de Next.js
      - name: Restore Next.js build cache
        uses: actions/cache@v4
        with:
          path: |
            personal-page/.next/cache
          key: ${{ runner.os }}-nextjs-${{ hashFiles('personal-page/package-lock.json') }}-${{ hashFiles('personal-page/src/**/*.[jt]s', 'personal-page/src/**/*.[jt]sx', 'personal-page/src/**/*.mdx') }}
          restore-keys: |
            ${{ runner.os }}-nextjs-${{ hashFiles('personal-page/package-lock.json') }}-

      - name: Install dependencies
        run: npm ci
        working-directory: personal-page

      # Inyección de las variables de entorno configuradas en GitHub
      - name: Build with Next.js (triggers generate-rss.ts & next build)
        env:
          NEXT_PUBLIC_PAGE_ACCESS_PASSWORD: ${{ vars.NEXT_PUBLIC_PAGE_ACCESS_PASSWORD }}
          NEXT_PUBLIC_BASE_URL: ${{ vars.NEXT_PUBLIC_BASE_URL }}
        run: npm run build
        working-directory: personal-page

      - name: Setup Pages
        uses: actions/configure-pages@v5

      # Next.js exporta todo el contenido estático a la carpeta 'out' dentro de 'personal-page'
      - name: Upload static files artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./personal-page/out

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## ⚡ Paso 4: Proceso de Despliegue Automático

Una vez realizados los pasos anteriores:
1. Sube los cambios y la carpeta `.github` a la rama de producción (`git push origin publish`).
2. GitHub detectará el archivo `.github/workflows/deploy.yml` y arrancará la compilación.
3. Puedes ver el progreso en tiempo real en la pestaña **Actions** de tu repositorio.
4. Al completarse, verás un enlace directo hacia tu sitio web de GitHub Pages con el feed RSS autogenerado en la raíz y la protección por contraseña completamente funcional en producción.

---

## 📂 Consideraciones sobre el Dominio Personalizado

Si vas a usar un dominio personalizado (ej: `www.tudominio.com` en lugar de `usuario.github.io/repositorio`):
1. Asegúrate de configurar el dominio en la pestaña **Settings > Pages** de GitHub.
2. Agrega el archivo `CNAME` en la carpeta `personal-page/public/` que contenga tu nombre de dominio (ej. `tudominio.com`). Al compilar, Next.js copiará automáticamente este archivo a la carpeta raíz de salida `out/`.

---

## 🔍 Resolución de Problemas Comunes

### Error: `Branch "publish" is not allowed to deploy to github-pages due to environment protection rules`
*   **Causa**: Por seguridad, GitHub Pages limita los despliegues del entorno `github-pages` únicamente a la rama por defecto (`master` o `main`).
*   **Solución**:
    1. Ve a **Settings** > **Environments** en tu repositorio.
    2. Selecciona el entorno **`github-pages`**.
    3. En **Deployment branches**, cambia la regla a **"All branches"** o agrega la rama **`publish`** de forma explícita.
    4. Ve a la pestaña **Actions** y vuelve a ejecutar el flujo fallido.

