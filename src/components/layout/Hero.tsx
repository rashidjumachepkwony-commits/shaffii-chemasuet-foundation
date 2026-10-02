import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  title: string;
  subtitle?: string;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  backgroundImage?: string;
  className?: string;
  children?: React.ReactNode;
  overlay?: React.ReactNode;
  size?: "default" | "large";
}

export function Hero({
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  backgroundImage,
  className,
  children,
  overlay,
  size = "default",
}: HeroProps) {
  const sizeClasses = {
    default: "min-h-[70vh] md:min-h-[80vh]",
    large: "min-h-[80vh] md:min-h-[90vh]",
  };

  return (
    <section
      className={cn(
        "relative flex items-center justify-center overflow-hidden text-white",
        backgroundImage ? "bg-cover bg-center" : "bg-neutral-900",
        sizeClasses[size],
        className
      )}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
    >
      {backgroundImage && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
          aria-hidden="true"
        />
      )}
      <div
        className={cn(
          "absolute inset-0",
          backgroundImage
            ? "bg-gradient-to-t from-black/70 via-black/40 to-transparent"
            : "bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900"
        )}
      />
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-20 text-center">
        <div className="mx-auto max-w-4xl space-y-6">
          <h1 className={cn(
            "font-display font-extrabold tracking-tight",
            size === "large" ? "text-4xl sm:text-5xl md:text-6xl" : "text-3xl sm:text-4xl md:text-5xl"
          )}>
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto max-w-2xl text-lg text-neutral-200 md:text-xl">
              {subtitle}
            </p>
          )}
          {(primaryAction || secondaryAction) && (
            <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
              {primaryAction && (
                <Link to={primaryAction.href}>
                  <Button
                    variant="primary"
                    size="lg"
                    rounded="full"
                    className="bg-gold-500 text-neutral-900 hover:bg-gold-400 shadow-lg hover:shadow-xl"
                  >
                    {primaryAction.label} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
              {secondaryAction && (
                <Link to={secondaryAction.href}>
                  <Button variant="outline" size="lg" rounded="full" className="border-neutral-300 text-white hover:bg-white hover:text-neutral-900">
                    {secondaryAction.label}
                  </Button>
                </Link>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
      {overlay}
    </section>
  );
}
