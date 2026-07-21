import { getBlogListViewModel } from "@/modules/blog/3-infrastructure/presentation/vm-c/blog.vm";
import { baseURL } from "@/resources";
import { getDictionary } from "@/shared/i18n/dictionaries";
import { NextResponse } from "next/server";

export async function GET() {
  const locale = "es"; // RSS en idioma por defecto
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

  // Generate RSS XML
  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${blog.title}</title>
    <link>${baseURL}/${locale}/blog</link>
    <description>${blog.description}</description>
    <language>${locale}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseURL}/api/rss" rel="self" type="application/rss+xml" />
    <managingEditor>${person.email} (${person.name})</managingEditor>
    <webMaster>${person.email} (${person.name})</webMaster>
    <image>
      <url>${baseURL}${person.avatar}</url>
      <title>${blog.title}</title>
      <link>${baseURL}/${locale}/blog</link>
    </image>
    ${sortedPosts
      .map(
        (post) => `
    <item>
      <title>${post.title}</title>
      <link>${baseURL}/${locale}/blog/${post.slug}</link>
      <guid>${baseURL}/${locale}/blog/${post.slug}</guid>
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

  // Return the RSS XML with the appropriate content type
  return new NextResponse(rssXml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
