# Guía Paso a Paso: Cómo configurar Graphify en cualquier proyecto (Explicado fácil)

Esta guía te explicará cómo configurar **Graphify** en un nuevo proyecto desde cero, paso a paso, sin consumir tu cuota de API y asegurando que tu asistente de IA (como Antigravity) pueda usarlo para entender tu código.

---

## 📋 Resumen Rápido (El "Tengo Prisa")
Si ya tienes Graphify instalado y quieres configurarlo rápido en un nuevo proyecto:
1. Abre la terminal en la raíz de tu proyecto.
2. Ejecuta: `graphify extract . --code-only` *(extrae el código gratis)*.
3. Ejecuta: `graphify cluster-only .` *(agrupa las comunidades)*.
4. Ejecuta: `graphify hook install` *(activa actualizaciones automáticas en cada commit)*.
5. Ejecuta: `graphify antigravity install` *(permite que el Agente lea tu grafo)*.

Si quieres entender el paso a paso detallado y cómo evitar gastar dinero/tokens, sigue leyendo abajo.

---

## 🛠️ Paso a Paso Completo

### Paso 1: Instalar Graphify en tu computadora
Antes de poder usarlo, Graphify tiene que estar instalado en tu sistema.
Abre tu terminal y ejecuta uno de estos comandos:

*   **Si usas `uv` (Recomendado, más rápido):**
    ```bash
    uv tool install --upgrade graphifyy
    ```
*   **Si usas `pip` de Python normal:**
    ```bash
    pip install graphifyy
    ```
*(Ojo: El paquete de Python termina con doble "y": `graphifyy`)*.

---

### Paso 2: Extraer el código localmente (Gratis - Cero Tokens)
Por defecto, si corres Graphify directamente, intentará llamar a un modelo de IA (LLM) para analizar todo, lo cual consumirá tu cuota de API muy rápido. 

Para evitar esto, le decimos a Graphify que **solo analice el código** de forma local y matemática:
```bash
graphify extract . --code-only
```
*   `extract .`: Significa "extrae los archivos de esta carpeta actual".
*   `--code-only`: Le dice "solo lee archivos de código (.js, .ts, .py, etc.) de forma local. No uses internet ni LLMs".

Esto generará una carpeta llamada `graphify-out/` con un archivo `graph.json` que contiene tu mapa de código.

---

### Paso 3: Agrupar tu código en "Comunidades"
Ahora que el mapa está creado, queremos que Graphify agrupe los archivos relacionados (por ejemplo, poner todos los archivos de traducción juntos y todas las páginas juntas).

*   **Opción A: Agrupar con nombres genéricos (Gratis - Sin LLM):**
    Si no tienes una API Key o no quieres gastar tokens, ejecuta:
    ```bash
    graphify cluster-only .
    ```
    *Esto agrupará tus archivos en comunidades llamadas "Community 1", "Community 2" o con el nombre del archivo principal de ese grupo. Es 100% offline.*

*   **Opción B: Agrupar con nombres inteligentes creados por IA (Usa tu propia API Key):**
    Si quieres usar tu propia clave de API externa:
    1. Consigue una API key de Gemini.
    2. Configúrala en tu terminal:
       ```bash
       export GEMINI_API_KEY="tu-api-key-aqui"
       ```
    3. Ejecuta:
       ```bash
       graphify cluster-only . --backend gemini
       ```
    *(Este paso es muy barato porque solo envía al LLM los nombres de los archivos en bloques, no el código completo).*

*   **Opción C: Agrupar mediante el Asistente de IA (Gratis y desde el Chat):**
    Si no tienes API key de Gemini pero quieres que las comunidades tengan nombres inteligentes, puedes pedirle a tu asistente de IA (como Antigravity) en el chat que lo haga por ti:
    1. Primero ejecuta en tu terminal:
       ```bash
       graphify cluster-only .
       ```
       *(Esto agrupa el código y genera el archivo `graphify-out/.graphify_analysis.json` necesario).*
    2. En el chat con el asistente de IA, escribe exactamente esto:
       > "Por favor, lee el archivo `graphify-out/.graphify_analysis.json`, ponle nombres conceptuales descriptivos a cada comunidad según el código que contienen, y actualiza los archivos `graph.json`, `graph.html` y `GRAPH_REPORT.md` con las nuevas etiquetas."
    3. El asistente leerá el archivo, decidirá nombres conceptuales y ejecutará de forma autónoma la actualización y reconstrucción de los archivos de salida por ti.


---

### Paso 4: Hacer que se actualice solo (Git Hooks)
No quieres estar corriendo comandos manualmente cada vez que editas código. Para que Graphify actualice tu mapa automáticamente cada vez que haces un `git commit` o cambias de rama con `git checkout`, ejecuta:
```bash
graphify hook install
```
¡Listo! A partir de ahora, tu grafo se actualizará de forma invisible en segundo plano y de manera local (gratis) en cada commit.

---

### Paso 5: Conectarlo con tu Asistente de IA (Antigravity)
Para que el agente de IA que utilices en este proyecto (como Antigravity) sepa que existe este mapa y lo consulte antes de responder tus dudas sobre el código, ejecuta:
```bash
graphify antigravity install
```
Esto creará archivos especiales en la carpeta `.agents/` para que el asistente entienda cómo interactuar con el grafo de conocimiento.

---

### Paso 6: Añadir accesos rápidos en `package.json`
Para no tener que recordar los comandos de Graphify, abre el archivo `package.json` de tu proyecto y añade estas líneas dentro de la sección `"scripts"`:

```json
"scripts": {
  "graphify:query": "graphify query",
  "graphify:update": "graphify update .",
  "graphify:viz": "graphify export html"
}
```

Ahora podrás ejecutar desde tu terminal:
*   `npm run graphify:update` — Para forzar una actualización rápida y local del grafo.
*   `npm run graphify:query -- "tu pregunta"` — Para buscar conexiones de código desde la consola.
*   `npm run graphify:viz` — Para exportar la última versión del mapa visual interactivo.

---

## 🔍 ¿Cómo veo mi mapa visual de código?
Una vez completados los pasos, ve a la carpeta `graphify-out/` que se creó en tu proyecto y haz doble clic sobre el archivo:

👉 **`graph.html`**

Se abrirá en tu navegador web un mapa interactivo en 2D donde podrás hacer clic en los archivos, ver qué funciones llaman a cuáles, buscar dependencias y explorar cómo está estructurado tu software de forma visual.
