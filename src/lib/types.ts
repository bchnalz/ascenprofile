import homeDefaults from "@/content/home.json";
import contactDefaults from "@/content/contact.json";

export type HomeContent = typeof homeDefaults;
export type ContactInfo = typeof contactDefaults;

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_url: string | null;
  tags: string[];
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PostSummary = Pick<Post, "id" | "slug" | "title" | "excerpt" | "cover_url" | "tags" | "published_at">;

export { homeDefaults, contactDefaults };
