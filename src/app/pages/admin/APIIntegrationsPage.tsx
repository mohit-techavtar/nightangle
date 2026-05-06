import React from "react";
import { TopBar } from "../../components/layout/TopBar";
import { APIIntegrations } from "./settings/APIIntegrations";

export function APIIntegrationsPage() {
  return (
    <>
      <TopBar
        title="API & Integrations"
        subtitle="API keys, webhooks, and third-party integrations"
      />
      <div className="flex-1 overflow-y-auto">
        <APIIntegrations />
      </div>
    </>
  );
}
