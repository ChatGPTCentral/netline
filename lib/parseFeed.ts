import { XMLParser } from 'fast-xml-parser';

export interface Resource {
  id: string;
  title: string;
  shortDescription: string;
  type: string;
  imageUrl: string;
  linkUrl: string;
  publisher: string;
  startDate: string;
}

const FEED_URL =
  'https://cts.tradepub.com/cts3/?ptnr=gptcentral&fmt=xml&ver=04gptcentral';

// Strip the marketing boilerplate TradePub appends to every title
function cleanTitle(raw: string): string {
  return raw
    .replace(/\s*\(\$[\d,]+ Value\).*$/i, '')
    .replace(/\s*FREE For a Limited Time\s*$/i, '')
    .trim();
}

// Decode HTML entities that appear in plain-text fields (e.g. &#8220; → ")
function decodeEntities(str: string): string {
  return str
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&rsquo;/g, '’')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rdquo;/g, '”')
    .replace(/&ldquo;/g, '“');
}

export async function parseFeed(): Promise<Resource[]> {
  const res = await fetch(FEED_URL, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`Feed fetch failed: ${res.status}`);

  const xml = await res.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
    parseAttributeValue: false,
    trimValues: true,
  });

  const doc = parser.parse(xml);

  // Handle both single publication and multiple publications
  const rawPublications =
    doc['TradePub.com']?.PublicationTable?.Publication ?? [];

  const publications = Array.isArray(rawPublications)
    ? rawPublications
    : [rawPublications];

  return publications.map((p: Record<string, string>) => ({
    id: String(p.PubCode ?? ''),
    title: cleanTitle(String(p.PubName ?? '')),
    shortDescription: decodeEntities(String(p.PubShortDescription ?? '')),
    type: String(p.OfferType ?? ''),
    imageUrl: String(p.SocialimgURL ?? p.MedC4ImgURL ?? p.ImageURL ?? ''),
    linkUrl: String(p.PubURL ?? ''),
    publisher: String(p.Publisher ?? ''),
    startDate: String(p.StartDate ?? ''),
  }));
}
