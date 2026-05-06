import React from "react";
import { TopBar } from "../../components/layout/TopBar";
import { SystemMaintenance } from "./settings/SystemMaintenance";

export function SystemMaintenancePage() {
  return (
    <>
      <TopBar
        title="System Maintenance"
        subtitle="Database, backups, cache, and system health"
      />
      <div className="flex-1 overflow-y-auto">
        <SystemMaintenance />
      </div>
    </>
  );
}
