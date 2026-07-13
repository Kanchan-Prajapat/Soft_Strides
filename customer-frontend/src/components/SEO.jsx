import { Helmet } from "react-helmet-async";

const defaultSEO = {
  title: "Soft Strides | Premium Oversized & Graphic T-Shirts India",
  description:
    "Premium oversized, graphic and cotton t-shirts for men & women. Comfortable streetwear made for everyday wear. Secure payments, easy exchanges and fast delivery across India.",
  image: "https://softstrides.in/social-banner.jpg",
  url: "https://softstrides.in/",
};

export default function SEO({
  title = defaultSEO.title,
  description = defaultSEO.description,
  image = defaultSEO.image,
  url = defaultSEO.url,
  keywords,
  robots = "index,follow",
  author = "Soft Strides",
  schema,
}) {
  return (
    <Helmet>
      <title>{title}</title>

      <meta name="description" content={description} />

      {keywords && (
        <meta
          name="keywords"
          content={keywords}
        />
      )}

      <link rel="canonical" href={url} />

      {/* Open Graph */}

<meta property="og:site_name" content="Soft Strides" />
<meta property="og:locale" content="en_IN" />
<meta property="og:image:alt" content={title} />

<meta name="theme-color" content="#121212" />

      <meta property="og:type" content="website" />

      <meta property="og:title" content={title} />

      <meta property="og:description" content={description} />

      <meta property="og:image" content={image} />

      <meta property="og:url" content={url} />

      {/* Twitter */}

      <meta name="twitter:card" content="summary_large_image" />

      <meta name="twitter:title" content={title} />

      <meta name="twitter:description" content={description} />

      <meta name="twitter:image" content={image} />

      <meta name="robots" content={robots} />
<meta name="author" content={author} />
{schema && (
  <script type="application/ld+json">
    {JSON.stringify(schema)}
  </script>
)}
    </Helmet>
  );
}