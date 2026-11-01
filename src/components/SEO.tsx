import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
  structuredData?: Record<string, any> | Array<Record<string, any>>;
}

const DOMAIN = "https://sironindustry.com";
const DEFAULT_IMAGE = `${DOMAIN}/logo.png`;

export default function SEO({
  title,
  description,
  keywords,
  canonical,
  ogImage = DEFAULT_IMAGE,
  ogType = "website",
  noindex = false,
  structuredData,
}: SEOProps) {
  const location = useLocation();
  const currentUrl = canonical ? `${DOMAIN}${canonical}` : `${DOMAIN}${location.pathname}`;
  const fullTitle = title.includes("SATAH Iron Industry") ? title : `${title} | SATAH Iron Industry`;

  useEffect(() => {
    // 1. Update Title
    document.title = fullTitle;

    // Helper to set or create meta tag
    const setMeta = (attrName: string, attrVal: string, content: string) => {
      let tag = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attrName, attrVal);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    // 2. Standard Meta Tags
    setMeta("name", "description", description);
    if (keywords) {
      setMeta("name", "keywords", keywords);
    }
    setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    setMeta("name", "author", "SATAH Iron Industry");

    // 3. Canonical Tag
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement("link");
      linkCanonical.setAttribute("rel", "canonical");
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute("href", currentUrl);

    // 4. Open Graph Meta Tags
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", currentUrl);
    setMeta("property", "og:type", ogType);
    setMeta("property", "og:image", ogImage.startsWith("http") ? ogImage : `${DOMAIN}${ogImage}`);
    setMeta("property", "og:site_name", "SATAH Iron Industry");
    setMeta("property", "og:locale", "en_IN");

    // 5. Twitter Card Tags
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", ogImage.startsWith("http") ? ogImage : `${DOMAIN}${ogImage}`);

    // 6. Structured Data (JSON-LD)
    const existingScript = document.getElementById("seo-structured-data");
    if (existingScript) {
      existingScript.remove();
    }

    if (structuredData) {
      const script = document.createElement("script");
      script.id = "seo-structured-data";
      script.type = "application/ld+json";
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    return () => {
      const scriptToRemove = document.getElementById("seo-structured-data");
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [fullTitle, description, keywords, currentUrl, ogImage, ogType, noindex, structuredData]);

  return null;
}
