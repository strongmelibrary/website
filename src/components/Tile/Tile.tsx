import TodaysHours from "../TodaysHours/TodaysHours";
import Tag from "../Tag/Tag";
import React from "react";

function Tile({ post }: { post: Record<string, any> }) {
  return (
    <div className="flex flex-col">
      <div>
        <small>
          Published {post.frontmatter.publishedAt}
        </small>
      </div>
      <div>
        <a href={post.url}>{post.frontmatter.title}</a>
      </div>
      <div>
        <small>{post.frontmatter.description}</small>
      </div>
      <div>
        <small>
          {post.frontmatter.tags?.map((tag: string) => (
            <Tag
              key={tag}
              className="inline mr-4"
              anchorClassName="border-0 font-normal text-inherit hover:text-rose-600"
              href={`/tags/${tag}`}
            >
              {tag}
            </Tag>
          ))}
        </small>
      </div>
    </div>
  );
}

export default Tile;
