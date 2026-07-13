export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",

  name: "Soft Strides",

  url: "https://softstrides.in",

  logo: "https://softstrides.in/favicon-512.png",

  description:
    "Soft Strides is an Indian clothing brand offering premium oversized, graphic and cotton t-shirts for men and women.",

  sameAs: [
    "https://instagram.com/soft.strides7"
  ],

  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Support",

    availableLanguage: ["English", "Hindi"]
  }
});