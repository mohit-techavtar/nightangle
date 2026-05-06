import React from "react";
import { TopBar } from "../../components/layout/TopBar";
import { BillingPayments } from "./settings/BillingPayments";

export function BillingPaymentsPage() {
  return (
    <>
      <TopBar
        title="Billing & Payments"
        subtitle="Payment gateways, invoicing, and tax settings"
      />
      <div className="flex-1 overflow-y-auto">
        <BillingPayments />
      </div>
    </>
  );
}
