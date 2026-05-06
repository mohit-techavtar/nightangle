import React from "react";
import { TopBar } from "../../components/layout/TopBar";
import { EmailNotifications } from "./settings/EmailNotifications";

export function EmailNotificationsPage() {
  return (
    <>
      <TopBar
        title="Email & Notifications"
        subtitle="Email templates, SMTP, and notification preferences"
      />
      <div className="flex-1 overflow-y-auto">
        <EmailNotifications />
      </div>
    </>
  );
}
