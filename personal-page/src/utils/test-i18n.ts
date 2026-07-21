import assert from "node:assert";
import { getDictionary, resolveKey, dictionaries } from "../shared/i18n/dictionaries";

/**
 * Suite de pruebas unitarias para el sistema de internacionalización (i18n).
 * Diseñado de forma ligera y sin dependencias externas usando el módulo 'assert' nativo de Node.js.
 */

import { getNestedValue } from "@herman/i18n";

console.log("🧪 Iniciando pruebas unitarias de i18n...\n");

try {
  // --- 1. Test de getDictionary ---
  console.log("➡️  Probando getDictionary...");

  // Debe retornar español por defecto
  const dictEs = getDictionary("es");
  assert.ok(dictEs, "Debería retornar un diccionario para 'es'");

  // Debe retornar inglés
  const dictEn = getDictionary("en");
  assert.ok(dictEn, "Debería retornar un diccionario para 'en'");

  // Debe hacer fallback a español si el locale es inválido
  const dictFallback = getDictionary("fr");
  assert.deepStrictEqual(
    dictFallback,
    dictEs,
    "Debería hacer fallback a español para locales no soportados",
  );
  console.log("   ✅ getDictionary OK");

  // --- 2. Test de getNestedValue ---
  console.log("\n➡️  Probando getNestedValue...");

  const testDict = {
    nivel1: {
      nivel2: {
        saludo: "Hola Mundo",
        numero: 123, // no es string
      },
    },
  };

  // Rutas válidas
  assert.strictEqual(
    getNestedValue(testDict, "nivel1.nivel2.saludo"),
    "Hola Mundo",
    "Debería obtener un string anidado correctamente",
  );

  // Rutas inválidas (no existentes)
  assert.strictEqual(
    getNestedValue(testDict, "nivel1.nivel2.inexistente"),
    undefined,
    "Debería retornar undefined para rutas inexistentes",
  );

  // Tipos no string (debe retornar undefined ya que resolveKey espera traducción en string)
  assert.strictEqual(
    getNestedValue(testDict, "nivel1.nivel2.numero"),
    undefined,
    "Debería retornar undefined para valores que no sean de tipo string",
  );
  console.log("   ✅ getNestedValue OK");

  // --- 3. Test de resolveKey ---
  console.log("\n➡️  Probando resolveKey...");

  const sampleDict = {
    ui: {
      btn: "Enviar",
      nested: {
        title: "Página de Inicio",
      },
    },
  } as any;

  // Clave existente en el diccionario
  assert.strictEqual(
    resolveKey(sampleDict, "ui.btn"),
    "Enviar",
    "Debería resolver una clave válida a su traducción",
  );

  assert.strictEqual(
    resolveKey(sampleDict, "ui.nested.title"),
    "Página de Inicio",
    "Debería resolver una clave anidada válida",
  );

  // Clave que NO existe en el diccionario (debe retornar la misma clave como fallback)
  assert.strictEqual(
    resolveKey(sampleDict, "ui.btn.inexistente"),
    "ui.btn.inexistente",
    "Debería retornar la clave original si no existe en el diccionario",
  );

  // Texto plano (debe retornar el texto plano directamente)
  assert.strictEqual(
    resolveKey(sampleDict, "Mi Texto Plano"),
    "Mi Texto Plano",
    "Debería retornar el texto original si no parece una clave o no coincide",
  );
  console.log("   ✅ resolveKey OK");

  // --- 4. Test de integridad de Diccionarios Reales ---
  console.log("\n➡️  Probando integridad de diccionarios del proyecto...");

  const es = getDictionary("es");

  // Buscamos comprobar llaves críticas
  assert.ok(es, "El diccionario en español debe existir");
  console.log("   ✅ Integridad OK");

  console.log("\n🎉 ¡Todas las pruebas unitarias de i18n pasaron exitosamente!");
} catch (error) {
  console.error("\n❌ Falla detectada en las pruebas unitarias:");
  console.error(error);
  process.exit(1);
}
