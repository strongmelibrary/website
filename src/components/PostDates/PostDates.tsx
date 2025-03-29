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
    <div className="flex flex-row space-x-4">
      {initialDraftAt && (
        <div title="Initial draft at">
          ✨ <TodaysHours date={initialDraftAt} />
        </div>
      )}
      {publishedAt && (
        <div title="Published at">
          📅 <TodaysHours date={publishedAt} />
        </div>
      )}
      {updatedAt && (
        <div title="Last updated at">
          🔃 <TodaysHours date={updatedAt} />
        </div>
      )}
    </div>
  );
};

export default PostDates;
