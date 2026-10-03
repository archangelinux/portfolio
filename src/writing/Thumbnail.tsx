import React from "react";

/** A post thumbnail: the photo as-is, with rounded corners. */
const Thumbnail: React.FC<{ src: string; className?: string; size?: "sm" | "lg" }> = ({
  src,
  className = "",
  size = "lg",
}) => (
  <img
    src={src}
    alt=""
    loading="lazy"
    className={`block w-full object-cover ${size === "lg" ? "rounded-xl" : "rounded-lg aspect-[12/5]"} ${className}`}
  />
);

export default Thumbnail;
