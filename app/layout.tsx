import type { Metadata, Viewport } from "next";
import { Climate_Crisis, Playfair_Display } from "next/font/google";
import MotionProvider from "@/components/MotionProvider";
import { EMAIL } from "@/lib/site";
import { SITE_URL } from "@/lib/url";
import "./globals.css";

// Peso "400" = instancia estática en YEAR 1979: la versión sólida, sin el eje de derretimiento.
const climateCrisis = Climate_Crisis({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-climate-crisis",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const TITLE = "fRiA — Soluciones web";
const DESCRIPTION =
  "Hacemos páginas web, tiendas online, apps y automatizaciones a medida. Desde Río Tercero, para donde estés.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  // La imagen sale de app/opengraph-image.png (Copito y el logo).
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "fRiA",
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  icons: {
    icon: [
      { url: "/brand/fria-favicon.svg", type: "image/svg+xml" },
      { url: "/brand/fria-favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: { url: "/brand/fria-favicon-180.png", sizes: "180x180" },
  },
  manifest: "/manifest.webmanifest",
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "fRiA",
  url: SITE_URL,
  email: EMAIL,
  description: DESCRIPTION,
  founder: [
    { "@type": "Person", name: "Francisco Rissone" },
    { "@type": "Person", name: "Ismael Abrile" },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Río Tercero",
    addressRegion: "Córdoba",
    addressCountry: "AR",
  },
};

export const viewport: Viewport = {
  themeColor: "#EAF6FB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR" className={`${climateCrisis.variable} ${playfair.variable}`}>
      <body>
        <script
          type="application/ld+json"
          // Solo datos confirmados en el brief: nombre, servicios, mail y ciudad.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
