import React from "react";
import { 
  Skeleton, 
  SkeletonText, 
  SkeletonCard, 
  SkeletonTable, 
  SkeletonStatCard, 
  SkeletonAvatar,
  SkeletonBadge 
} from "../components/ui/Skeleton";
import { LoadingSpinner, FullPageLoader, OverlayLoader } from "../components/ui/LoadingSpinner";

export function LoadingShowcase() {
  return (
    <div 
      className="min-h-screen bg-[#F5F5F5] p-6"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-[#212121] mb-6">Loading & Skeleton States</h1>

        {/* Spinners Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#212121] mb-4">Loading Spinners</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-[#E0E0E0] p-6 flex flex-col items-center justify-center gap-4">
              <h3 className="text-sm font-semibold text-[#616161]">Small</h3>
              <LoadingSpinner size="sm" color="primary" />
            </div>
            <div className="bg-white rounded-lg border border-[#E0E0E0] p-6 flex flex-col items-center justify-center gap-4">
              <h3 className="text-sm font-semibold text-[#616161]">Medium</h3>
              <LoadingSpinner size="md" color="primary" />
            </div>
            <div className="bg-white rounded-lg border border-[#E0E0E0] p-6 flex flex-col items-center justify-center gap-4">
              <h3 className="text-sm font-semibold text-[#616161]">Large</h3>
              <LoadingSpinner size="lg" color="primary" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-[#E0E0E0] p-6 flex flex-col items-center justify-center gap-4">
              <h3 className="text-sm font-semibold text-[#616161]">With Text</h3>
              <LoadingSpinner size="md" color="primary" text="Loading data..." />
            </div>
            <div className="bg-white rounded-lg border border-[#E0E0E0] p-6 flex flex-col items-center justify-center gap-4">
              <h3 className="text-sm font-semibold text-[#616161]">Centered</h3>
              <div className="w-full h-32">
                <LoadingSpinner size="md" color="primary" centered />
              </div>
            </div>
            <div className="bg-[#1565C0] rounded-lg border border-[#E0E0E0] p-6 flex flex-col items-center justify-center gap-4">
              <h3 className="text-sm font-semibold text-white">White Color</h3>
              <LoadingSpinner size="md" color="white" text="Processing..." />
            </div>
          </div>
        </section>

        {/* Basic Skeletons */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#212121] mb-4">Basic Skeletons</h2>
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-[#616161] mb-3">Single Line</h3>
              <Skeleton height="20px" width="60%" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#616161] mb-3">Multiple Widths</h3>
              <div className="space-y-2">
                <Skeleton height="16px" width="100%" />
                <Skeleton height="16px" width="80%" />
                <Skeleton height="16px" width="60%" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#616161] mb-3">Text Lines</h3>
              <SkeletonText lines={3} />
            </div>
            <div className="flex items-center gap-4">
              <div>
                <h3 className="text-sm font-semibold text-[#616161] mb-3">Avatar Small</h3>
                <SkeletonAvatar size="sm" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#616161] mb-3">Avatar Medium</h3>
                <SkeletonAvatar size="md" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#616161] mb-3">Avatar Large</h3>
                <SkeletonAvatar size="lg" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#616161] mb-3">Badge</h3>
                <SkeletonBadge />
              </div>
            </div>
          </div>
        </section>

        {/* Component Skeletons */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#212121] mb-4">Component Skeletons</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-[#616161] mb-3">Stat Cards</h3>
              <div className="grid grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonStatCard key={i} />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#616161] mb-3">Generic Cards</h3>
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Table Skeleton */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#212121] mb-4">Table Skeleton</h2>
          <SkeletonTable rows={5} columns={6} />
        </section>

        {/* Overlay Loader */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#212121] mb-4">Overlay Loader</h2>
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-6 relative h-64">
            <h3 className="text-lg font-semibold text-[#212121] mb-3">Card with Content</h3>
            <p className="text-sm text-[#616161]">This card shows an overlay loader when processing...</p>
            <OverlayLoader text="Processing..." />
          </div>
        </section>

        {/* Page States */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#212121] mb-4">Usage Examples</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border border-[#E0E0E0] p-6">
              <h3 className="text-sm font-semibold text-[#616161] mb-4">Dashboard Loading</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <SkeletonStatCard />
                  <SkeletonStatCard />
                </div>
                <SkeletonCard />
              </div>
            </div>
            <div className="bg-white rounded-lg border border-[#E0E0E0] p-6">
              <h3 className="text-sm font-semibold text-[#616161] mb-4">List Loading</h3>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <SkeletonAvatar size="md" />
                    <div className="flex-1">
                      <Skeleton height="16px" width="70%" className="mb-2" />
                      <Skeleton height="12px" width="40%" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Animation Note */}
        <div className="bg-[#E3F2FD] rounded-lg border border-[#90CAF9] p-4">
          <p className="text-sm text-[#1565C0]">
            ℹ️ All skeleton components use a subtle pulse animation to indicate loading state.
            The animation uses a gradient that shifts from light gray to slightly darker gray.
          </p>
        </div>
      </div>
    </div>
  );
}
