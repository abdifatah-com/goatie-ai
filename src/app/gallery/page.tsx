import { Gallery } from "./gallery";

// Hand-written programs that exercise every OpenUI component.
export default async function GalleryPage({ searchParams }: { searchParams: Promise<{ theme?: string }> }) {
  const { theme } = await searchParams;
  return <Gallery theme={theme === "dark" ? "dark" : "light"} />;
}
