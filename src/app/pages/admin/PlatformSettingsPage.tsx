import React from "react";
import { TopBar } from "../../components/layout/TopBar";
import { PlatformSettings } from "./settings/PlatformSettings";

export function PlatformSettingsPage() {
  return (
    <>
      <TopBar
        title="Platform Settings"
        subtitle="General platform configuration and defaults"
      />
      <div className="flex-1 overflow-y-auto">
        <PlatformSettings />
      </div>
    </>
  );
}
