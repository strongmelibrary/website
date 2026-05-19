import React from "react";
import { HiCalendar, HiArrowPath } from "react-icons/hi2";

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
    <div className="flex flex-row flex-wrap gap-4 type-body-xs text-[var(--color-neutral-60)]">
      {publishedAt && (
        <div className="flex items-center gap-1" title="Published at">
          <HiCalendar aria-hidden="true" className="w-4 h-4 inline-block" />
          <span>Published </span>
          <time dateTime={publishedAt}>{publishedAt}</time>
        </div>
      )}
      {updatedAt && (
        <div className="flex items-center gap-1" title="Last updated at">
          <HiArrowPath aria-hidden="true" className="w-4 h-4 inline-block" />
          <span>Updated </span>
          <time dateTime={updatedAt}>{updatedAt}</time>
        </div>
      )}
    </div>
  );
};

export default PostDates;
