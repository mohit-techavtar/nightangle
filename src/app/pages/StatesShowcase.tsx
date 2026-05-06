import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Plus, SearchX, BellOff, ShieldAlert } from "lucide-react";
import {
  EmptyState,
  ErrorState,
  BuildingsIllustration,
  ChartFlatLineIllustration,
  BrokenChainIllustration,
  LostCompassIllustration,
} from "../components/states";

export function StatesShowcase() {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState<string>("no-tenants");

  const states = [
    { id: "no-tenants", label: "No Tenants", category: "empty" },
    { id: "no-search", label: "No Search Results", category: "empty" },
    { id: "no-usage", label: "No Usage Data", category: "empty" },
    { id: "no-notifications", label: "No Notifications", category: "empty" },
    { id: "error-500", label: "Page Error (500)", category: "error" },
    { id: "error-403", label: "Access Denied (403)", category: "error" },
    { id: "error-404", label: "Not Found (404)", category: "error" },
  ];

  const renderState = () => {
    switch (selectedState) {
      case "no-tenants":
        return (
          <EmptyState
            illustration={<BuildingsIllustration />}
            heading="No tenants yet"
            subtext="Create your first tenant to start managing customers on the platform."
            primaryButton={{
              label: "Create Tenant",
              icon: Plus,
              onClick: () => console.log("Create tenant clicked"),
            }}
          />
        );

      case "no-search":
        return (
          <EmptyState
            icon={SearchX}
            iconBgColor="#F5F5F5"
            iconColor="#9E9E9E"
            heading="No results found"
            subtext="Try adjusting your search terms or filters."
            primaryButton={{
              label: "Clear Filters",
              onClick: () => console.log("Clear filters clicked"),
            }}
            textLink={{
              label: "Clear Search",
              onClick: () => console.log("Clear search clicked"),
            }}
          />
        );

      case "no-usage":
        return (
          <EmptyState
            illustration={<ChartFlatLineIllustration />}
            heading="No usage data yet"
            subtext="Start making AI calls or launch a campaign to see your usage analytics here."
            primaryButton={{
              label: "Launch Campaign",
              onClick: () => console.log("Launch campaign clicked"),
            }}
            secondaryButton={{
              label: "Create AI Agent",
              onClick: () => console.log("Create AI agent clicked"),
            }}
          />
        );

      case "no-notifications":
        return (
          <EmptyState
            icon={BellOff}
            iconBgColor="#F5F5F5"
            iconColor="#9E9E9E"
            heading="All caught up!"
            subtext="You have no new notifications."
            textLink={{
              label: "Notification Settings",
              onClick: () => console.log("Notification settings clicked"),
            }}
          />
        );

      case "error-500":
        return (
          <ErrorState
            illustration={<BrokenChainIllustration />}
            heading="Something went wrong"
            subtext="We encountered an unexpected error. Please try again."
            primaryButton={{
              label: "Try Again",
              onClick: () => window.location.reload(),
            }}
            textLink={{
              label: "Contact Support",
              onClick: () => console.log("Contact support clicked"),
            }}
            errorReference="ERR-2026-0342"
          />
        );

      case "error-403":
        return (
          <ErrorState
            icon={ShieldAlert}
            iconBgColor="#FFEBEE"
            iconColor="#C62828"
            heading="Access Denied"
            subtext="You do not have permission to access this page. Contact your administrator for access."
            primaryButton={{
              label: "Go to Dashboard",
              onClick: () => navigate("/tenant/dashboard"),
            }}
            secondaryButton={{
              label: "Contact Admin",
              onClick: () => console.log("Contact admin clicked"),
            }}
          />
        );

      case "error-404":
        return (
          <ErrorState
            illustration={<LostCompassIllustration />}
            heading="Page not found"
            subtext="The page you are looking for does not exist or has been moved."
            primaryButton={{
              label: "Go to Dashboard",
              onClick: () => navigate("/tenant/dashboard"),
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="min-h-screen bg-[#F5F5F5] flex"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-[#E0E0E0] p-6">
        <h2 className="text-lg font-semibold text-[#212121] mb-4">Empty & Error States</h2>
        
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-[#9E9E9E] uppercase mb-2">Empty States</h3>
          <div className="space-y-1">
            {states
              .filter((s) => s.category === "empty")
              .map((state) => (
                <button
                  key={state.id}
                  onClick={() => setSelectedState(state.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedState === state.id
                      ? "bg-[#E3F2FD] text-[#1565C0] font-medium"
                      : "text-[#616161] hover:bg-[#F5F5F5]"
                  }`}
                >
                  {state.label}
                </button>
              ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-[#9E9E9E] uppercase mb-2">Error States</h3>
          <div className="space-y-1">
            {states
              .filter((s) => s.category === "error")
              .map((state) => (
                <button
                  key={state.id}
                  onClick={() => setSelectedState(state.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedState === state.id
                      ? "bg-[#E3F2FD] text-[#1565C0] font-medium"
                      : "text-[#616161] hover:bg-[#F5F5F5]"
                  }`}
                >
                  {state.label}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white m-6 rounded-lg shadow-sm border border-[#E0E0E0]">
        {renderState()}
      </div>
    </div>
  );
}
