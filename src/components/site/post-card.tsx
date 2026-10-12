import Link from "next/link";
import type { PostSummary } from "@/lib/types";
import { formatDate } from "@/lib/format";

export function PostCard({ post, large = false }: { post: PostSummary; large?: boolean }) {
  return (
    <article className="group relative flex flex-col">
      <div className={`overflow-hidden rounded-2xl bg-sunken ${large ? "aspect-[4/3]" : "aspect-[3/2]"}`}>
        {post.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_url}
            alt=""
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="girih size-full opacity-30" />
        )}
      </div>
      <time dateTime={post.published_at ?? undefined} className="mt-4 text-sm text-muted">
        {formatDate(post.published_at)}
      </time>
      <h3 className={`mt-1.5 font-bold leading-snug tracking-tight text-pretty ${large ? "text-2xl sm:text-[1.7rem]" : "text-lg"}`}>
        <Link href={`/berita/${post.slug}`} className="after:absolute after:inset-0 group-hover:text-emerald">
          {post.title}
        </Link>
      </h3>
      {large && post.excerpt && <p className="mt-3 leading-relaxed text-muted">{post.excerpt}</p>}
    </article>
  );
}
