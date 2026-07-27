import "server-only";

export type SubstackPost = {
  title?: string;
  link?: string;
  pubDate?: string;
  contentSnippet?: string;
  content?: string;
  "content:encoded"?: string;

  enclosure?: {
    url?: string;
    type?: string;
  };

  slug: string;
  image?: string;
};

const FEED_URL = "https://yuliesolva.substack.com/feed";

function createSlug(link?: string): string {
  if (!link) return "";

  try {
    const url = new URL(link);
    const parts = url.pathname.split("/").filter(Boolean);

    return parts.at(-1) ?? "";
  } catch {
    return "";
  }
}

function decodeHtmlEntities(value: string): string {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&#38;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#34;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&#8217;", "’")
    .replaceAll("&#8216;", "‘")
    .replaceAll("&#8220;", "“")
    .replaceAll("&#8221;", "”")
    .replaceAll("&#8230;", "…")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function stripCdata(value: string): string {
  return value
    .replace(/^<!\[CDATA\[/, "")
    .replace(/\]\]>$/, "")
    .trim();
}

function getXmlTag(itemXml: string, tagName: string): string | undefined {
  const escapedTagName = tagName.replace(":", "\\:");

  const match = itemXml.match(new RegExp(`<${escapedTagName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escapedTagName}>`, "i"));

  if (!match?.[1]) return undefined;

  return decodeHtmlEntities(stripCdata(match[1]));
}

function cleanImageUrl(value?: string): string | undefined {
  if (!value) return undefined;

  const cleaned = decodeHtmlEntities(value)
    .trim()
    .replace(/^["']|["']$/g, "");

  if (cleaned.startsWith("https://") || cleaned.startsWith("http://")) {
    return cleaned;
  }

  return undefined;
}

function getImageFromHtml(html?: string): string | undefined {
  if (!html) return undefined;

  const decodedHtml = decodeHtmlEntities(html);

  const srcMatch = decodedHtml.match(/<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/i);

  const srcImage = cleanImageUrl(srcMatch?.[1]);

  if (srcImage) {
    return srcImage;
  }

  const dataSrcMatch = decodedHtml.match(/<img\b[^>]*\bdata-src\s*=\s*["']([^"']+)["'][^>]*>/i);

  return cleanImageUrl(dataSrcMatch?.[1]);
}

function getEnclosure(itemXml: string): SubstackPost["enclosure"] {
  const enclosureMatch = itemXml.match(/<enclosure\b([^>]*)\/?>/i);

  if (!enclosureMatch?.[1]) return undefined;

  const attributes = enclosureMatch[1];

  const urlMatch = attributes.match(/\burl=["']([^"']+)["']/i);
  const typeMatch = attributes.match(/\btype=["']([^"']+)["']/i);

  const url = cleanImageUrl(urlMatch?.[1]);

  if (!url) return undefined;

  return {
    url,
    type: typeMatch?.[1],
  };
}

function getMetaImage(html: string): string | undefined {
  const patterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    const image = cleanImageUrl(match?.[1]);

    if (image) {
      return image;
    }
  }

  return undefined;
}

async function getImageFromPostPage(postUrl?: string): Promise<string | undefined> {
  if (!postUrl) return undefined;

  try {
    const response = await fetch(postUrl, {
      next: {
        revalidate: 3600,
      },
      headers: {
        "User-Agent": "Notes-In-Between/1.0",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      console.error(`Could not fetch Substack post page: ${response.status}`);

      return undefined;
    }

    const html = await response.text();

    return getMetaImage(html) ?? getImageFromHtml(html);
  } catch (error) {
    console.error("Could not retrieve Substack image:", error);

    return undefined;
  }
}

function getPostTimestamp(post: SubstackPost): number {
  if (!post.pubDate) return 0;

  const timestamp = Date.parse(post.pubDate);

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function removeHtml(html?: string): string | undefined {
  if (!html) return undefined;

  return decodeHtmlEntities(
    html
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

async function parseFeedItem(itemXml: string): Promise<SubstackPost> {
  const title = getXmlTag(itemXml, "title");
  const link = getXmlTag(itemXml, "link");
  const pubDate = getXmlTag(itemXml, "pubDate");
  const description = getXmlTag(itemXml, "description");
  const encodedContent = getXmlTag(itemXml, "content:encoded");
  const enclosure = getEnclosure(itemXml);

  const feedContent = encodedContent ?? description ?? "";

  const rssImage = getImageFromHtml(feedContent) ?? cleanImageUrl(enclosure?.url);

  const image = rssImage ?? (await getImageFromPostPage(link));

  return {
    title,
    link,
    pubDate,
    contentSnippet: removeHtml(description),
    content: encodedContent,
    "content:encoded": encodedContent,
    enclosure,
    slug: createSlug(link),
    image,
  };
}

export async function getSubstackPosts(): Promise<SubstackPost[]> {
  const response = await fetch(`${FEED_URL}?t=${Date.now()}`, {
    cache: "no-store",
    headers: {
      "User-Agent": "Mozilla/5.0",
      Accept: "application/rss+xml, application/xml, text/xml",
      "Cache-Control": "no-cache, no-store, max-age=0",
      Pragma: "no-cache",
    },
  });

  if (!response.ok) {
    throw new Error(`Could not fetch Substack feed: ${response.status}`);
  }

  const xml = await response.text();

  const itemMatches = Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/gi));

  const posts = await Promise.all(itemMatches.map((match) => parseFeedItem(match[1])));

  return posts
    .filter((post) => post.slug)
    .sort((firstPost, secondPost) => getPostTimestamp(secondPost) - getPostTimestamp(firstPost));
}

export async function getSubstackPostBySlug(slug: string): Promise<SubstackPost | undefined> {
  const posts = await getSubstackPosts();

  return posts.find((post) => post.slug === slug);
}
