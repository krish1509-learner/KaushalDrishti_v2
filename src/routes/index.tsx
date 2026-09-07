import { createFileRoute } from "@tanstack/react-router";
import { BookExperience } from "../components/BookExperience";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "How to Talk to White Kids About Racism — An interactive book" },
      {
        name: "description",
        content:
          "A dark, cinematic 3D book you can page through: seven honest starting points for talking with children about race.",
      },
      { property: "og:title", content: "How to Talk to White Kids About Racism" },
      {
        property: "og:description",
        content:
          "An interactive 3D book with seven honest starting points for talking with children about race.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BookExperience,
});
