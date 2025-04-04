import Tile from "../Tile/Tile";
import React from "react";

function PostsList({ posts }: { posts: Record<string, any>[] }) {
  return (
    <section>
      <ul className="space-y-8 mt-12">
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
