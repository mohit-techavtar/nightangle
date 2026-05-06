import React from "react";
import { TopBar } from "../../components/layout/TopBar";
import { SecurityAuth } from "./settings/SecurityAuth";

export function SecurityAuthPage() {
  return (
    <>
      <TopBar
        title="Security & Authentication"
        subtitle="Password policies, MFA, SSO, and session management"
      />
      <div className="flex-1 overflow-y-auto">
        <SecurityAuth />
      </div>
    </>
  );
}
