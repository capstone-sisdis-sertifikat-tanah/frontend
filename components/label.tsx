import React from "react";

export function Label({
  htmlFor = "",
  required = false,
  children,
}: {
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
    >
      {children}
      {required && <span className="text-red-500">*</span>}
    </label>
  );
}
