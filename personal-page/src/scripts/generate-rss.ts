import { getBlogListViewModel } from "@/modules/blog/3-infrastructure/presentation/vm-c/blog.vm";
import { getDictionary } from "@/shared/i18n/dictionaries";
import { getLocalizedSlug } from "@/shared/routing/PageRouter";
import fs from "fs";
import path from "path";

// Leemos el baseURL usando fs para evitar importar next/font/google (que es exclusivo del runtime de Next.js)
const configContent = fs.readFileSync(
  path.join(process.cwd(), "src/resources/once-ui.config.ts"),
  "utf-8",
);
const baseURLMatch = configContent.match(/const baseURL:\s*string\s*=\s*"([^"]+)"/);
const baseURL = baseURLMatch ? baseURLMatch[1] : "https://your-github-pages-url.com";

async function generateRSSForLocale(locale: string) {
  const dict = getDictionary(locale);
  const blog = {
    title: dict.blog.title,
    description: dict.blog.description,
  };
  const person = {
    name: dict.person.name,
    email: dict.person.email || "noreply@example.com",
    avatar: "/images/avatar.jpg",
  };

  const sortedPosts = await getBlogListViewModel({ locale });
  const blogSectionSlug = getLocalizedSlug("blog", locale);

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${blog.title}</title>
    <link>${baseURL}/${locale}/${blogSectionSlug}</link>
    <description>${blog.description}</description>
    <language>${locale}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseURL}/rss-${locale}.xml" rel="self" type="application/rss+xml" />
    <managingEditor>${person.email} (${person.name})</managingEditor>
    <webMaster>${person.email} (${person.name})</webMaster>
    <image>
      <url>${baseURL}${person.avatar}</url>
      <title>${blog.title}</title>
      <link>${baseURL}/${locale}/${blogSectionSlug}</link>
    </image>
    ${sortedPosts
      .map(
        (post) => `
    <item>
      <title>${post.title}</title>
      <link>${baseURL}/${locale}/${blogSectionSlug}/${post.slug}</link>
      <guid>${baseURL}/${locale}/${blogSectionSlug}/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${post.summary}]]></description>
      ${post.image ? `<enclosure url="${baseURL}${post.image}" type="image/jpeg" />` : ""}
      ${post.tag ? `<category>${post.tag}</category>` : ""}
      <author>${person.email} (${person.name})</author>
    </item>`,
      )
      .join("")}
  </channel>
</rss>`;

  const publicDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Escribir el RSS localizado
  fs.writeFileSync(path.join(publicDir, `rss-${locale}.xml`), rssXml);

  // Para el idioma por defecto (es), generar también rss.xml en la raíz
  if (locale === "es") {
    fs.writeFileSync(path.join(publicDir, `rss.xml`), rssXml);
  }

  console.log(`✅ RSS generado estáticamente para el idioma: ${locale}`);
}

async function main() {
  console.log("Iniciando generación estática de RSS...");
  await generateRSSForLocale("es");
  await generateRSSForLocale("en");
  console.log("✅ Feeds RSS generados exitosamente en /public");
}

main().catch((err) => {
  console.error("Error al generar RSS:", err);
  process.exit(1);
});
