import Tag from "../Tag/Tag";
import React from "react";

function Tile({ post }: { post: Record<string, any> }) {
  return (
    <div className="card card-hover p-4 md:p-6 flex flex-col gap-2">
      <div>
        <span className="type-body-xs text-[var(--color-charcoal)]/60">
          Published {post.frontmatter.publishedAt}
        </span>
      </div>
      <div>
        <a
          href={post.url}
          className="type-heading-4 text-[var(--color-charcoal)] hover:text-[var(--color-terracotta)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-forest)] rounded-sm"
        >
          {post.frontmatter.title}
        </a>
      </div>
      {post.frontmatter.description && (
        <div>
          <p className="type-body-sm text-[var(--color-charcoal)]/70">
            {post.frontmatter.description}
          </p>
        </div>
      )}
      {post.frontmatter.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {post.frontmatter.tags.map((tag: string) => (
            <Tag
              key={tag}
              href={`/tags/${tag}`}
            >
              {tag}
            </Tag>
          ))}
        </div>
      )}
    </div>
  );
}

export default Tile;
