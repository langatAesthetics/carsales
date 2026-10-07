import { Helmet } from "react-helmet-async";

interface SEOProps {
    title: string;
    description: string;
    canonical?: string;
    image?: string;
    type?: "website" | "article";
    noIndex?: boolean;
    structuredData?: Record<string, unknown>;
}

const SITE_URL = "https://carsales-4ew6.vercel.app";

const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

export default function SEO({
    title,
    description,
    canonical,
    image = DEFAULT_IMAGE,
    type = "website",
    noIndex = false,
    structuredData,
}: SEOProps) {
    const canonicalUrl = canonical
        ? `${SITE_URL}${canonical}`
        : SITE_URL;

    return (
        <Helmet>
            {/* Basic SEO */}
            <title>{title}</title>

            <meta
                name="description"
                content={description}
            />

            <meta
                name="robots"
                content={
                    noIndex
                        ? "noindex, nofollow"
                        : "index, follow"
                }
            />

            <link
                rel="canonical"
                href={canonicalUrl}
            />

            {/* Open Graph */}
            <meta
                property="og:title"
                content={title}
            />

            <meta
                property="og:description"
                content={description}
            />

            <meta
                property="og:type"
                content={type}
            />

            <meta
                property="og:url"
                content={canonicalUrl}
            />

            <meta
                property="og:image"
                content={image}
            />

            <meta
                property="og:site_name"
                content="Carsales"
            />

            {/* Twitter / X */}
            <meta
                name="twitter:card"
                content="summary_large_image"
            />

            <meta
                name="twitter:title"
                content={title}
            />

            <meta
                name="twitter:description"
                content={description}
            />

            <meta
                name="twitter:image"
                content={image}
            />

            {/* JSON-LD Structured Data */}
            {structuredData && (
                <script
                    type="application/ld+json"
                >
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </Helmet>
    );
}