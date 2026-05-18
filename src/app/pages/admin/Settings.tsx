import React, { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import { 
  Settings as SettingsIcon, Globe, Bell, Shield, CreditCard, 
  Plug, FileText, Wrench, Palette, Database, Mail, Lock,
  Server, Code, Zap, Eye, CheckCircle, Calendar
} from "lucide-react";
import { PlatformSettings } from "./settings/PlatformSettings";
import { EmailNotifications } from "./settings/EmailNotifications";
import { SecurityAuth } from "./settings/SecurityAuth";
import { BillingPayments } from "./settings/BillingPayments";
import { APIIntegrations } from "./settings/APIIntegrations";
import { AuditCompliance } from "./settings/AuditCompliance";
import { SystemMaintenance } from "./settings/SystemMaintenance";
import { AppearanceBranding } from "./settings/AppearanceBranding";
import { FiscalCalendar } from "./settings/FiscalCalendar";

type SettingsModule = 
  | "platform"
  | "fiscal"
  | "email"
  | "security"
  | "billing"
  | "api"
  | "audit"
  | "maintenance"
  | "appearance";

interface SettingsMenuItem {
  id: SettingsModule;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
  badge?: string;
}

const settingsMenu: SettingsMenuItem[] = [
  {
    id: "platform",
    label: "Platform Settings",
    icon: Globe,
    description: "General platform configuration and defaults",
  },
  {
    id: "fiscal",
    label: "Fiscal Year & Holidays",
    icon: Calendar,
    description: "Configure fiscal year, quarters, and holiday calendar",
  },
  {
    id: "email",
    label: "Email & Notifications",
    icon: Mail,
    description: "Email templates, SMTP, and notification preferences",
  },
  {
    id: "security",
    label: "Security & Authentication",
    icon: Shield,
    description: "Password policies, MFA, SSO, and session management",
  },
  {
    id: "billing",
    label: "Billing & Payments",
    icon: CreditCard,
    description: "Payment gateways, invoicing, and tax settings",
  },
  {
    id: "api",
    label: "API & Integrations",
    icon: Plug,
    description: "API keys, webhooks, and third-party integrations",
  },
  {
    id: "audit",
    label: "Audit & Compliance",
    icon: FileText,
    description: "Audit logs, data retention, and compliance settings",
  },
  {
    id: "maintenance",
    label: "System Maintenance",
    icon: Wrench,
    description: "Database, backups, cache, and system health",
  },
  {
    id: "appearance",
    label: "Appearance & Branding",
    icon: Palette,
    description: "White-labeling, themes, and UI customization",
    badge: "Beta",
  },
];

export function Settings() {
  const [activeModule, setActiveModule] = useState<SettingsModule>("platform");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const renderModule = () => {
    switch (activeModule) {
      case "platform":
        return <PlatformSettings />;
      case "fiscal":
        return <FiscalCalendar />;
      case "email":
        return <EmailNotifications />;
      case "security":
        return <SecurityAuth />;
      case "billing":
        return <BillingPayments />;
      case "api":
        return <APIIntegrations />;
      case "audit":
        return <AuditCompliance />;
      case "maintenance":
        return <SystemMaintenance />;
      case "appearance":
        return <AppearanceBranding />;
      default:
        return <PlatformSettings />;
    }
  };

  return (
    <>
      <TopBar 
        breadcrumbs={[
          { label: "Dashboard" }, 
          { label: "Settings" },
          { label: settingsMenu.find(m => m.id === activeModule)?.label || "Platform" }
        ]} 
        mode="admin" 
      />
      <div className="flex-1 overflow-hidden flex">
        {/* Sidebar Navigation */}
        <div className="w-72 bg-white border-r border-[#E0E0E0] overflow-y-auto">
          <div className="p-4 border-b border-[#E0E0E0]">
            <div className="flex items-center gap-2 mb-1">
              <SettingsIcon size={20} className="text-[#1565C0]" />
              <h3 className="font-semibold text-[#212121]">System Settings</h3>
            </div>
            <p className="text-xs text-[#616161]">Configure platform-wide settings</p>
          </div>

          <div className="p-2">
            {settingsMenu.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className={`w-full text-left p-3 rounded-lg mb-1 transition-colors group ${
                    isActive
                      ? "bg-[#E3F2FD] text-[#1565C0]"
                      : "hover:bg-[#F5F5F5] text-[#616161]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon 
                      size={18} 
                      className={`mt-0.5 flex-shrink-0 ${
                        isActive ? "text-[#1565C0]" : "text-[#9E9E9E] group-hover:text-[#616161]"
                      }`} 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-sm font-medium ${isActive ? "text-[#1565C0]" : "text-[#212121]"}`}>
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#FFF8E1] text-[#F57F17]">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#9E9E9E] line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    {isActive && (
                      <CheckCircle size={16} className="text-[#1565C0] flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-[#E0E0E0] mt-4">
            <div className="bg-[#F5F5F5] rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={14} className="text-[#F57F17]" />
                <span className="text-xs font-semibold text-[#212121]">Quick Tip</span>
              </div>
              <p className="text-xs text-[#616161] leading-relaxed">
                Changes are auto-saved. You can navigate between modules without losing your work.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-[#F5F5F5]">
          {renderModule()}
        </div>
      </div>

      {/* Unsaved Changes Warning (if needed) */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-4 right-4 bg-[#FFF8E1] border border-[#F57F17] rounded-lg px-4 py-3 shadow-lg">
          <div className="flex items-center gap-3">
            <Eye size={18} className="text-[#F57F17]" />
            <div>
              <p className="text-sm font-medium text-[#212121]">Unsaved Changes</p>
              <p className="text-xs text-[#616161]">Your changes are being saved automatically</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
