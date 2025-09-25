import React from "react";
import Link from "next/link";
import Image from "next/image";
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
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 py-3">
        <div className="flex items-center">
          {showBack && (
            <Link
              href={backHref}
              className="mr-3 p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          )}

          <div className="flex-1">
            {showLogo && !showBack && (
              <div className="flex items-center gap-3 mb-2">
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Block B"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Block B</h2>
                  <p className="text-xs text-gray-500">Click & Collect</p>
                </div>
              </div>
            )}

            {(!showLogo || showBack) && (
              <>
                <h1 className="text-lg font-semibold text-gray-900">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-sm text-gray-500 mt-1">
                    {subtitle}
                  </p>
                )}
              </>
            )}
          </div>

          {rightElement && (
            <div className="ml-4">{rightElement}</div>
          )}
        </div>
      </div>
    </header>
  );
}