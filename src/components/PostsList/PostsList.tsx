import Tile from "../Tile/Tile";
import React from "react";

function PostsList({ posts }: { posts: Record<string, any>[] }) {
  return (
    <section aria-label="Posts">
      <ul className="space-y-6 mt-8">
        {posts.map((post) => (
          <li key={post.url}>
            <Tile post={post} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default PostsList;
