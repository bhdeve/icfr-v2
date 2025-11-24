import React from "react";

interface EnhancedPageLayoutProps {
  children: React.ReactNode;
  pageId?: string;
  title?: string;
  description: string;
  icon: React.ReactNode;
  headerContent?: React.ReactNode;
  className?: string;
}

export function EnhancedPageLayout({
  children,
  pageId,
  title,
  description,
  icon,
  headerContent,
  className = "",
}: EnhancedPageLayoutProps) {
  return (
    <div
      id={pageId}
      className={`min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-slate-900 text-white py-12 ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-gradient-to-br from-[#18325a] to-[#2a4a7a] p-3 shadow-lg">
              {icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {title ??
                  pageId
                    ?.replace(/-/g, " ")
                    ?.replace(/\b\w/g, (char) => char.toUpperCase())}
              </h1>
              <p className="text-sm text-gray-300">{description}</p>
            </div>
          </div>
          {headerContent && (
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              {headerContent}
            </div>
          )}
        </div>

        <div className="relative rounded-3xl border border-white/5 bg-white/5 shadow-2xl backdrop-blur-lg p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
