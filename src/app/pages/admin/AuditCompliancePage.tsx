import React from "react";
import { TopBar } from "../../components/layout/TopBar";
import { AuditCompliance } from "./settings/AuditCompliance";

export function AuditCompliancePage() {
  return (
    <>
      <TopBar
        title="Audit & Compliance"
        subtitle="Audit logs, data retention, and compliance settings"
      />
      <div className="flex-1 overflow-y-auto">
        <AuditCompliance />
      </div>
    </>
  );
}
