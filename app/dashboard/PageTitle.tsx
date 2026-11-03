import type { ComponentProps } from "react";

type DashboardPageTitleProps = Pick<
  ComponentProps<"h1">,
  "children" | "className" | "id"
>;

export function DashboardPageTitle({
  children,
  className = "",
  id,
}: DashboardPageTitleProps) {
  return (
    <h1 className={`text-2xl font-bold ${className}`} id={id}>
      {children}
    </h1>
  );
}
