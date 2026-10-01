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
}: HeroProps) {
  return (
    <section
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-neutral-900 text-white",
        "min-h-[70vh] md:min-h-[80vh]",
        className
      )}
    >
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
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
            : "bg-gradient-to-br from-foundation-900 via-foundation-800 to-neutral-900"
        )}
      />
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-20 text-center">
        <div className="mx-auto max-w-4xl space-y-6">
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
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
                    className="bg-gold-500 text-neutral-900 hover:bg-gold-400"
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
