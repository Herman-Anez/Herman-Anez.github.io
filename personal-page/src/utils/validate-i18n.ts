import fs from "fs";
import path from "path";

/**
 * Script de validación de diccionarios i18n (Versión Modular).
 * Compara las llaves entre la carpeta base (lang/es) y la carpeta objetivo (lang/en).
 */

const LANG_DIR = path.join(process.cwd(), "src/shared/i18n/lang");

function getKeys(obj: any, prefix = ""): string[] {
  return Object.keys(obj).reduce((res: string[], el) => {
    if (Array.isArray(obj[el])) {
      return res.concat(`${prefix}${el}`);
    } else if (typeof obj[el] === "object" && obj[el] !== null) {
      return res.concat(getKeys(obj[el], `${prefix}${el}.`));
    }
    return res.concat(`${prefix}${el}`);
  }, []);
}

function loadDirAsObj(dir: string): any {
  const obj: any = {};
  if (!fs.existsSync(dir)) return obj;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.forEach((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      Object.assign(obj, loadDirAsObj(fullPath));
    } else if (entry.name.endsWith(".json")) {
      const content = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
      Object.assign(obj, content);
    }
  });
  return obj;
}

function validate() {
  console.log("🔍 Validando consistencia de i18n modular...");

  const esObj = loadDirAsObj(path.join(LANG_DIR, "es"));
  const enObj = loadDirAsObj(path.join(LANG_DIR, "en"));

  const baseKeys = getKeys(esObj);
  const targetKeys = getKeys(enObj);

  const missingInEN = baseKeys.filter((key) => !targetKeys.includes(key));
  const missingInES = targetKeys.filter((key) => !baseKeys.includes(key));

  if (missingInEN.length === 0 && missingInES.length === 0) {
    console.log("✅ ¡Diccionarios modulares sincronizados!");
  } else {
    if (missingInEN.length > 0) {
      console.error("❌ Faltan llaves en EN:");
      missingInEN.forEach((key) => console.error(`  - ${key}`));
    }
    if (missingInES.length > 0) {
      console.error("⚠️ Llaves extra en EN (no existen en ES):");
      missingInES.forEach((key) => console.error(`  - ${key}`));
    }
    process.exit(1);
  }
}

try {
  validate();
} catch (error) {
  console.error("💥 Error durante la validación:", error);
  process.exit(1);
}
