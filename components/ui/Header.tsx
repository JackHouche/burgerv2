import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  backHref?: string;
  showLogo?: boolean;
  rightElement?: React.ReactNode;
}

export function Header({
  title,
  subtitle,
  showBack = false,
  backHref = "/",
  showLogo = true,
  rightElement,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-blockb-dark/95 backdrop-blur-md border-b border-blockb-gold/20 shadow-dark">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-blockb-gold via-amber-500 to-blockb-gold opacity-60"></div>

      <div className="px-4 py-4 blockb-texture relative">
        {/* Street texture overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full bg-[radial-gradient(circle_at_25%_25%,_#f59e0b_1px,_transparent_1px),_radial-gradient(circle_at_75%_75%,_#f59e0b_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
        </div>

        <div className="flex items-center justify-between relative">
          <div className="flex items-center min-w-0 flex-1">
            {showBack && (
              <Link
                href={backHref}
                className="mr-4 p-2 text-blockb-gold-light hover:text-blockb-gold hover:bg-blockb-darker rounded-full transition-all duration-300 active:scale-95 border border-blockb-gold/30 hover:border-blockb-gold/50"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
            )}

            <div className="flex items-center min-w-0 flex-1">
              {showLogo && !showBack && (
                <div className="mr-4 flex-shrink-0">
                  <Image
                    src="/block-b-logo.svg"
                    alt="Block B Logo"
                    width={120}
                    height={48}
                    className="h-12 w-auto drop-shadow-lg"
                  />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center">
                  <h1 className="text-xl font-blockb font-black text-blockb-gold-light truncate drop-shadow-lg animate-neon-flicker">
                    {title}
                  </h1>

                  {/* Decorative elements */}
                  <div className="ml-3 flex space-x-1">
                    <div className="w-2 h-2 bg-blockb-gold rounded-full animate-street-pulse"></div>
                    <div
                      className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-street-pulse"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blockb-gold rounded-full animate-street-pulse"
                      style={{ animationDelay: "1s" }}
                    ></div>
                  </div>
                </div>

                {subtitle && (
                  <p className="text-sm text-blockb-gold-muted mt-0.5 truncate font-blockb-body font-bold drop-shadow-sm">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>

          {rightElement && (
            <div className="flex items-center ml-4">{rightElement}</div>
          )}
        </div>

        {/* Decorative bottom line */}
        <div className="mt-3 h-0.5 bg-gradient-to-r from-transparent via-blockb-gold/40 to-transparent"></div>
      </div>
    </header>
  );
}
