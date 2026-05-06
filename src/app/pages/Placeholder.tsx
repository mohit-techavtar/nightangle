import React from "react";
import { useLocation } from "react-router";
import { TopBar } from "../components/layout/TopBar";
import { Construction } from "lucide-react";

export function Placeholder() {
  const location = useLocation();
  const pageName = location.pathname.split("/").filter(Boolean).pop() || "Page";
  const title = pageName.charAt(0).toUpperCase() + pageName.slice(1).replace(/-/g, " ");

  return (
    <>
      <TopBar breadcrumbs={[{ label: title }]} />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Construction size={48} className="text-[#E0E0E0] mx-auto mb-4" />
          <h2 className="text-[#616161] mb-2">{title}</h2>
          <p className="text-sm text-[#9E9E9E]">This module is under development.</p>
        </div>
      </div>
    </>
  );
}
