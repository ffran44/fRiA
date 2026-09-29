import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "fRiA — Soluciones web",
    short_name: "fRiA",
    start_url: "/",
    display: "standalone",
    background_color: "#EAF6FB",
    theme_color: "#EAF6FB",
    icons: [
      { src: "/brand/fria-favicon-180.png", sizes: "180x180", type: "image/png" },
      { src: "/brand/fria-favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
