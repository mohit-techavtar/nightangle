import React from "react";
import { TopBar } from "../../components/layout/TopBar";
import { AppearanceBranding } from "./settings/AppearanceBranding";

export function AppearanceBrandingPage() {
  return (
    <>
      <TopBar
        title="Appearance & Branding"
        subtitle="White-labeling, themes, and UI customization"
      />
      <div className="flex-1 overflow-y-auto">
        <AppearanceBranding />
      </div>
    </>
  );
}
