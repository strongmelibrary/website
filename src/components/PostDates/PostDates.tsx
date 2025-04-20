import TodaysHours from "../TodaysHours/TodaysHours";

import React from "react";



const PostDates = ({
  initialDraftAt,
  publishedAt,
  updatedAt,
}: {
  initialDraftAt?: string;
  publishedAt?: string;
  updatedAt?: string;
}) => {
  return (
    <div className="flex flex-row space-x-6">
      {publishedAt && (
        <div title="Published at">
          📅 Published {publishedAt}
        </div>
      )}
      {updatedAt && (
        <div title="Last updated at">
          🔃 Updated {updatedAt}
        </div>
      )}
    </div>
  );
};

export default PostDates;
