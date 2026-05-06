import React, { useState } from "react";
import { ChevronLeft, ChevronRight, User, Users, Plus, Star, Clock, AlertCircle, UserX } from "lucide-react";

interface SavedView {
  id: string;
  name: string;
  icon: React.ElementType;
  count: number;
  type: "personal" | "shared";
  filters: any;
}

interface SavedViewsSidebarProps {
  views: SavedView[];
  activeViewId: string | null;
  onSelectView: (viewId: string) => void;
  onCreateView: () => void;
}

export function SavedViewsSidebar({ views, activeViewId, onSelectView, onCreateView }: SavedViewsSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const personalViews = views.filter(v => v.type === "personal");
  const sharedViews = views.filter(v => v.type === "shared");

  return (
    <aside className={`${
      collapsed ? "w-12" : "w-64"
    } bg-white border-r border-[#E0E0E0] flex flex-col shrink-0 transition-all duration-200 overflow-hidden max-md:hidden`}>
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-[#E0E0E0]">
        {!collapsed && (
          <div>
            <h3 className="text-sm font-semibold text-[#212121]">Saved Views</h3>
            <p className="text-xs text-[#9E9E9E]">{views.length} views</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-7 h-7 rounded flex items-center justify-center text-[#616161] hover:bg-[#F5F5F5] transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Views List */}
      <div className="flex-1 overflow-y-auto py-3">
        {/* Personal Views */}
        {!collapsed && personalViews.length > 0 && (
          <div className="mb-4">
            <div className="px-4 mb-2 flex items-center gap-2">
              <User size={14} className="text-[#616161]" />
              <span className="text-xs font-semibold text-[#616161] uppercase tracking-wider">
                Personal
              </span>
            </div>
            <div className="space-y-1 px-2">
              {personalViews.map(view => (
                <button
                  key={view.id}
                  onClick={() => onSelectView(view.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                    activeViewId === view.id
                      ? "bg-[#E3F2FD] text-[#1565C0] font-semibold"
                      : "text-[#212121] hover:bg-[#F5F5F5]"
                  }`}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <view.icon size={16} className={activeViewId === view.id ? "text-[#1565C0]" : "text-[#616161]"} />
                    <span className="truncate">{view.name}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ml-2 ${
                    activeViewId === view.id
                      ? "bg-[#1565C0] text-white"
                      : "bg-[#F5F5F5] text-[#616161]"
                  }`}>
                    {view.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Collapsed Personal Views */}
        {collapsed && personalViews.length > 0 && (
          <div className="mb-4">
            <div className="px-2 mb-2">
              <div className="w-8 h-8 rounded flex items-center justify-center bg-[#F5F5F5]">
                <User size={14} className="text-[#616161]" />
              </div>
            </div>
            {personalViews.map(view => (
              <button
                key={view.id}
                onClick={() => onSelectView(view.id)}
                className={`w-full flex flex-col items-center justify-center py-2 transition-all relative ${
                  activeViewId === view.id ? "bg-[#E3F2FD]" : "hover:bg-[#F5F5F5]"
                }`}
                title={view.name}
              >
                {activeViewId === view.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1565C0] rounded-r" />
                )}
                <view.icon size={18} className={activeViewId === view.id ? "text-[#1565C0]" : "text-[#616161]"} />
                <span className={`text-[10px] font-semibold mt-1 ${
                  activeViewId === view.id ? "text-[#1565C0]" : "text-[#9E9E9E]"
                }`}>
                  {view.count}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Shared Views */}
        {!collapsed && sharedViews.length > 0 && (
          <div className="mb-4">
            <div className="px-4 mb-2 flex items-center gap-2">
              <Users size={14} className="text-[#616161]" />
              <span className="text-xs font-semibold text-[#616161] uppercase tracking-wider">
                Shared
              </span>
            </div>
            <div className="space-y-1 px-2">
              {sharedViews.map(view => (
                <button
                  key={view.id}
                  onClick={() => onSelectView(view.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                    activeViewId === view.id
                      ? "bg-[#E3F2FD] text-[#1565C0] font-semibold"
                      : "text-[#212121] hover:bg-[#F5F5F5]"
                  }`}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <view.icon size={16} className={activeViewId === view.id ? "text-[#1565C0]" : "text-[#616161]"} />
                    <span className="truncate">{view.name}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ml-2 ${
                    activeViewId === view.id
                      ? "bg-[#1565C0] text-white"
                      : "bg-[#F5F5F5] text-[#616161]"
                  }`}>
                    {view.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Collapsed Shared Views */}
        {collapsed && sharedViews.length > 0 && (
          <div className="mb-4">
            <div className="px-2 mb-2">
              <div className="w-8 h-8 rounded flex items-center justify-center bg-[#F5F5F5]">
                <Users size={14} className="text-[#616161]" />
              </div>
            </div>
            {sharedViews.map(view => (
              <button
                key={view.id}
                onClick={() => onSelectView(view.id)}
                className={`w-full flex flex-col items-center justify-center py-2 transition-all relative ${
                  activeViewId === view.id ? "bg-[#E3F2FD]" : "hover:bg-[#F5F5F5]"
                }`}
                title={view.name}
              >
                {activeViewId === view.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1565C0] rounded-r" />
                )}
                <view.icon size={18} className={activeViewId === view.id ? "text-[#1565C0]" : "text-[#616161]"} />
                <span className={`text-[10px] font-semibold mt-1 ${
                  activeViewId === view.id ? "text-[#1565C0]" : "text-[#9E9E9E]"
                }`}>
                  {view.count}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Create View Button */}
      <div className="p-3 border-t border-[#E0E0E0]">
        {!collapsed ? (
          <button
            onClick={onCreateView}
            className="w-full h-9 rounded-lg bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1] flex items-center justify-center gap-2 transition-all"
          >
            <Plus size={16} />
            Create View
          </button>
        ) : (
          <button
            onClick={onCreateView}
            className="w-full h-9 rounded-lg bg-[#1565C0] text-white flex items-center justify-center hover:bg-[#0D47A1] transition-all"
            title="Create View"
          >
            <Plus size={18} />
          </button>
        )}
      </div>
    </aside>
  );
}

// Predefined saved views
export const defaultSavedViews: SavedView[] = [
  {
    id: "my-hot-leads",
    name: "My Hot Leads",
    icon: Star,
    count: 12,
    type: "personal",
    filters: {
      sources: [],
      stages: [],
      owners: ["Current User"],
      scoreRange: [80, 100],
      valueRange: [0, 1000000],
      dateRange: { start: null, end: null },
    },
  },
  {
    id: "stale-leads",
    name: "Stale Leads",
    icon: Clock,
    count: 8,
    type: "personal",
    filters: {
      sources: [],
      stages: [],
      owners: ["Current User"],
      scoreRange: [0, 100],
      valueRange: [0, 1000000],
      dateRange: {
        start: new Date("2026-01-01"),
        end: new Date("2026-03-01"),
      },
    },
  },
  {
    id: "all-open-leads",
    name: "All Open Leads",
    icon: AlertCircle,
    count: 45,
    type: "shared",
    filters: {
      sources: [],
      stages: ["New", "Contacted", "Qualified", "Proposal", "Negotiation"],
      owners: [],
      scoreRange: [0, 100],
      valueRange: [0, 1000000],
      dateRange: { start: null, end: null },
    },
  },
  {
    id: "unassigned",
    name: "Unassigned",
    icon: UserX,
    count: 5,
    type: "shared",
    filters: {
      sources: [],
      stages: [],
      owners: [],
      scoreRange: [0, 100],
      valueRange: [0, 1000000],
      dateRange: { start: null, end: null },
    },
  },
];