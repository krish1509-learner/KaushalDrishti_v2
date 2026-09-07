import { createFileRoute } from "@tanstack/react-router";
import { BookExperience } from "../components/BookExperience";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "KaushalDrishtiv2" },
      {
        name: "description",
        content:
          "KaushalDrishtiv2 is an interactive 3D book experience.",
      },
      { property: "og:title", content: "KaushalDrishtiv2" },
      {
        property: "og:description",
        content:
          "Explore the interactive KaushalDrishtiv2 3D book experience.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BookExperience,
});
