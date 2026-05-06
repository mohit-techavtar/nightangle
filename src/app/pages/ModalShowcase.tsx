import React, { useState } from "react";
import {
  SuspendTenantModal,
  TerminateLicenseModal,
  GrantGraceExtensionModal,
  ConfirmUpgradeModal,
  CancelSubscriptionModal,
} from "../components/modals";

export function ModalShowcase() {
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [terminateModalOpen, setTerminateModalOpen] = useState(false);
  const [graceModalOpen, setGraceModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-8" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0F1B2D] mb-2">OmniCRM Modal Dialogs</h1>
          <p className="text-[#616161]">Click any button below to preview the modal dialogs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Modal 1 - Suspend Tenant */}
          <div className="bg-white p-6 rounded-lg border border-[#E0E0E0]">
            <h3 className="text-lg font-semibold text-[#212121] mb-2">Suspend Tenant</h3>
            <p className="text-sm text-[#616161] mb-4">
              Admin modal for suspending a tenant with reason codes and timing options
            </p>
            <button
              onClick={() => setSuspendModalOpen(true)}
              className="px-4 h-9 rounded-[6px] bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors"
            >
              Open Modal
            </button>
          </div>

          {/* Modal 2 - Terminate License */}
          <div className="bg-white p-6 rounded-lg border border-[#E0E0E0]">
            <h3 className="text-lg font-semibold text-[#212121] mb-2">Terminate License</h3>
            <p className="text-sm text-[#616161] mb-4">
              Destructive confirmation with type-to-confirm pattern
            </p>
            <button
              onClick={() => setTerminateModalOpen(true)}
              className="px-4 h-9 rounded-[6px] bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors"
            >
              Open Modal
            </button>
          </div>

          {/* Modal 3 - Grant Grace Extension */}
          <div className="bg-white p-6 rounded-lg border border-[#E0E0E0]">
            <h3 className="text-lg font-semibold text-[#212121] mb-2">Grant Grace Extension</h3>
            <p className="text-sm text-[#616161] mb-4">
              Admin modal with selectable cards for grace type
            </p>
            <button
              onClick={() => setGraceModalOpen(true)}
              className="px-4 h-9 rounded-[6px] bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors"
            >
              Open Modal
            </button>
          </div>

          {/* Modal 4 - Confirm Upgrade */}
          <div className="bg-white p-6 rounded-lg border border-[#E0E0E0]">
            <h3 className="text-lg font-semibold text-[#212121] mb-2">Confirm Upgrade Request</h3>
            <p className="text-sm text-[#616161] mb-4">
              Customer modal with plan comparison and prorated credit
            </p>
            <button
              onClick={() => setUpgradeModalOpen(true)}
              className="px-4 h-9 rounded-[6px] bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors"
            >
              Open Modal
            </button>
          </div>

          {/* Modal 5 - Cancel Subscription */}
          <div className="bg-white p-6 rounded-lg border border-[#E0E0E0]">
            <h3 className="text-lg font-semibold text-[#212121] mb-2">Cancel Subscription</h3>
            <p className="text-sm text-[#616161] mb-4">
              Customer modal with cancellation types and feature loss warning
            </p>
            <button
              onClick={() => setCancelModalOpen(true)}
              className="px-4 h-9 rounded-[6px] bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors"
            >
              Open Modal
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 p-4 bg-white rounded-lg border border-[#E0E0E0]">
          <h3 className="text-sm font-semibold text-[#212121] mb-2">Modal Features:</h3>
          <ul className="text-sm text-[#616161] space-y-1">
            <li>• Backdrop with blur effect</li>
            <li>• Consistent header with icons and close button</li>
            <li>• Form validation and conditional inputs</li>
            <li>• Color-coded actions (Primary, Danger, Warning)</li>
            <li>• Sticky headers/footers for scrollable content</li>
            <li>• Responsive design with max-widths</li>
          </ul>
        </div>
      </div>

      {/* Modals */}
      <SuspendTenantModal
        isOpen={suspendModalOpen}
        onClose={() => setSuspendModalOpen(false)}
        tenantName="Everest Digital Solutions Pvt. Ltd."
        tenantId="TNT-00042"
        onConfirm={(data) => {
          console.log("Suspend confirmed:", data);
          setSuspendModalOpen(false);
        }}
      />

      <TerminateLicenseModal
        isOpen={terminateModalOpen}
        onClose={() => setTerminateModalOpen(false)}
        licenseId="LIC-2026-00142"
        tenantName="Everest Digital Solutions"
        onConfirm={(reason) => {
          console.log("Terminate confirmed:", reason);
          setTerminateModalOpen(false);
        }}
      />

      <GrantGraceExtensionModal
        isOpen={graceModalOpen}
        onClose={() => setGraceModalOpen(false)}
        tenantName="Everest Digital Solutions Pvt. Ltd."
        onConfirm={(data) => {
          console.log("Grace granted:", data);
          setGraceModalOpen(false);
        }}
      />

      <ConfirmUpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        currentPlan={{ name: "Growth", color: "#1565C0" }}
        newPlan={{ name: "Enterprise", color: "#FF6F00" }}
        comparisonRows={[
          { label: "AI Minutes", current: "15,000", new: "50,000" },
          { label: "Agents", current: "15", new: "50" },
          { label: "Price", current: "NPR 35,000", new: "NPR 75,000" },
        ]}
        proratedCredit="NPR 49,000"
        remainingDays={42}
        onConfirm={(note) => {
          console.log("Upgrade confirmed:", note);
          setUpgradeModalOpen(false);
        }}
      />

      <CancelSubscriptionModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        currentCycleEndDate="Dec 31, 2026"
        onConfirm={(data) => {
          console.log("Subscription cancelled:", data);
          setCancelModalOpen(false);
        }}
      />
    </div>
  );
}
