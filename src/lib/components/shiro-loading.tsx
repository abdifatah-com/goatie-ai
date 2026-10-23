import React from "react";

export interface ShiroLoadingIconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function ShiroLoadingIcon({
  size = 32,
  className = "",
  style = {},
}: ShiroLoadingIconProps) {
  return (
    <span
      className={`shiro-loading-icon ${className}`}
      role="status"
      aria-label="Loading..."
      style={{
        width: size,
        height: size,
        ...style,
      }}
    />
  );
}
