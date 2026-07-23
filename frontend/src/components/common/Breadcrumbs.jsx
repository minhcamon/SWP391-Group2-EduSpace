import React from "react";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";

export const Breadcrumbs = ({ items = [], className = "" }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-1.5 text-xs font-semibold ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {item.to ? (
              <Link
                to={item.to}
                className="text-neutral-medium hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={item.className || (isLast ? "text-primary font-bold" : "text-neutral-dark")}>
                {item.label}
              </span>
            )}
            {!isLast && (
              <ChevronRight className="w-3.5 h-3.5 text-neutral-light shrink-0" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
