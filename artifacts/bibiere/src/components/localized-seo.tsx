import { SEO } from "./seo";

export function LocalizedSEO(props: {
  title?: string;
  description?: string;
  url?: string;
  locale?: string;
  image?: string;
  type?: "website" | "article" | "product";
}) {
  return <SEO {...props} />;
}

export default LocalizedSEO;
