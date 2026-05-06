import React, { useState } from "react";
import { EmptyStates } from "../components/EmptyStates";

export function EmptyStatesShowcase() {
  const [activeState, setActiveState] = useState<"no-campaigns" | "no-agents" | "no-recordings" | "first-time-dashboard">("no-campaigns");

  const states = [
    { id: "no-campaigns" as const, label: "No Campaigns" },
    { id: "no-agents" as const, label: "No AI Agents" },
    { id: "no-recordings" as const, label: "No Recordings" },
    { id: "first-time-dashboard" as const, label: "First Time Dashboard" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">Empty States Showcase</h1>
          <div className="flex gap-2">
            {states.map((state) => (
              <button
                key={state.id}
                onClick={() => setActiveState(state.id)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeState === state.id
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {state.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Empty State Display */}
      <div className="bg-white min-h-screen">
        <EmptyStates type={activeState} />
      </div>
    </div>
  );
}
