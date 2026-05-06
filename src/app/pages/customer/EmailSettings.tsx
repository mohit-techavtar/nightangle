import { useState } from "react";
import { useEmail } from "../../hooks/useEmail";
import {
  Mail,
  Server,
  Shield,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  Save,
  RefreshCw,
  Globe,
  Lock,
  Database,
  Trash2,
  FileText,
  Clock
} from "lucide-react";

export function EmailSettings() {
  const { config, updateConfig } = useEmail();
  const [activeTab, setActiveTab] = useState<"sender" | "deliverability" | "limits" | "compliance">("sender");
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(config);

  const handleSave = async () => {
    setIsSaving(true);
    updateConfig(formData);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const getDeliverabilityStatus = (status: string) => {
    switch (status) {
      case "verified":
        return { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" };
      case "pending":
        return { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" };
      case "failed":
        return { icon: XCircle, color: "text-red-600", bg: "bg-red-50" };
      default:
        return { icon: AlertCircle, color: "text-gray-600", bg: "bg-gray-50" };
    }
  };

  const tabs = [
    { id: "sender", label: "Sender Identity", icon: Mail },
    { id: "deliverability", label: "Deliverability", icon: Shield },
    { id: "limits", label: "Send Limits", icon: Settings },
    { id: "compliance", label: "Compliance", icon: FileText }
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Email Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Configure email infrastructure and policies</p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b px-6">
        <div className="flex gap-6">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "sender" && (
          <div className="max-w-4xl space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Sender Identity</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.senderIdentity.fromEmail}
                    onChange={(e) => setFormData({
                      ...formData,
                      senderIdentity: { ...formData.senderIdentity, fromEmail: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="noreply@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Name
                  </label>
                  <input
                    type="text"
                    value={formData.senderIdentity.fromName}
                    onChange={(e) => setFormData({
                      ...formData,
                      senderIdentity: { ...formData.senderIdentity, fromName: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Company Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reply-To Email
                  </label>
                  <input
                    type="email"
                    value={formData.senderIdentity.replyTo}
                    onChange={(e) => setFormData({
                      ...formData,
                      senderIdentity: { ...formData.senderIdentity, replyTo: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="support@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sender Domain
                  </label>
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.senderIdentity.domain}
                      onChange={(e) => setFormData({
                        ...formData,
                        senderIdentity: { ...formData.senderIdentity, domain: e.target.value }
                      })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="company.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">SMTP Configuration</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Provider
                  </label>
                  <select
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="sendgrid">SendGrid</option>
                    <option value="mailgun">Mailgun</option>
                    <option value="ses">Amazon SES</option>
                    <option value="smtp">Custom SMTP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Key / SMTP Password
                  </label>
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value="••••••••••••••••"
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                    <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "deliverability" && (
          <div className="max-w-4xl space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Authentication Status</h3>

              <div className="space-y-4">
                {/* SPF */}
                <div className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex items-start gap-3 flex-1">
                    {(() => {
                      const status = getDeliverabilityStatus(formData.deliverability.spf.status);
                      const Icon = status.icon;
                      return (
                        <div className={`w-10 h-10 rounded-lg ${status.bg} flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${status.color}`} />
                        </div>
                      );
                    })()}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">SPF Record</h4>
                        <span className={`text-xs px-2 py-1 rounded capitalize ${
                          formData.deliverability.spf.status === "verified"
                            ? "bg-green-100 text-green-700"
                            : formData.deliverability.spf.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {formData.deliverability.spf.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Sender Policy Framework authentication
                      </p>
                      {formData.deliverability.spf.record && (
                        <div className="bg-gray-50 rounded p-2 font-mono text-xs break-all">
                          {formData.deliverability.spf.record}
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                    Verify
                  </button>
                </div>

                {/* DKIM */}
                <div className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex items-start gap-3 flex-1">
                    {(() => {
                      const status = getDeliverabilityStatus(formData.deliverability.dkim.status);
                      const Icon = status.icon;
                      return (
                        <div className={`w-10 h-10 rounded-lg ${status.bg} flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${status.color}`} />
                        </div>
                      );
                    })()}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">DKIM Record</h4>
                        <span className={`text-xs px-2 py-1 rounded capitalize ${
                          formData.deliverability.dkim.status === "verified"
                            ? "bg-green-100 text-green-700"
                            : formData.deliverability.dkim.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {formData.deliverability.dkim.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        DomainKeys Identified Mail signature
                      </p>
                      {formData.deliverability.dkim.selector && (
                        <div className="bg-gray-50 rounded p-2 font-mono text-xs">
                          <div className="mb-1">Selector: <span className="text-blue-600">{formData.deliverability.dkim.selector}</span></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                    Verify
                  </button>
                </div>

                {/* DMARC */}
                <div className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex items-start gap-3 flex-1">
                    {(() => {
                      const status = getDeliverabilityStatus(formData.deliverability.dmarc.status);
                      const Icon = status.icon;
                      return (
                        <div className={`w-10 h-10 rounded-lg ${status.bg} flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${status.color}`} />
                        </div>
                      );
                    })()}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">DMARC Policy</h4>
                        <span className={`text-xs px-2 py-1 rounded capitalize ${
                          formData.deliverability.dmarc.status === "verified"
                            ? "bg-green-100 text-green-700"
                            : formData.deliverability.dmarc.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {formData.deliverability.dmarc.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Domain-based Message Authentication policy
                      </p>
                      {formData.deliverability.dmarc.policy && (
                        <div className="bg-gray-50 rounded p-2 font-mono text-xs break-all">
                          Policy: <span className="text-blue-600">{formData.deliverability.dmarc.policy}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                    Verify
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900 mb-1">DNS Configuration Required</h4>
                  <p className="text-sm text-blue-800">
                    Add these DNS records to your domain to improve email deliverability and authentication.
                    Changes may take up to 48 hours to propagate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "limits" && (
          <div className="max-w-4xl space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Sending Limits</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daily Send Limit
                  </label>
                  <input
                    type="number"
                    value={formData.sendLimits.dailyLimit}
                    onChange={(e) => setFormData({
                      ...formData,
                      sendLimits: { ...formData.sendLimits, dailyLimit: parseInt(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum emails per 24-hour period</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hourly Send Limit
                  </label>
                  <input
                    type="number"
                    value={formData.sendLimits.hourlyLimit}
                    onChange={(e) => setFormData({
                      ...formData,
                      sendLimits: { ...formData.sendLimits, hourlyLimit: parseInt(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum emails per hour</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Per-Recipient Limit
                  </label>
                  <input
                    type="number"
                    value={formData.sendLimits.perRecipientLimit}
                    onChange={(e) => setFormData({
                      ...formData,
                      sendLimits: { ...formData.sendLimits, perRecipientLimit: parseInt(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum emails to send to a single recipient per day</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Throttling</h3>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.sendLimits.throttling.enabled}
                      onChange={(e) => setFormData({
                        ...formData,
                        sendLimits: {
                          ...formData.sendLimits,
                          throttling: { ...formData.sendLimits.throttling, enabled: e.target.checked }
                        }
                      })}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Enable rate throttling</span>
                  </label>
                </div>

                {formData.sendLimits.throttling.enabled && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Messages per Batch
                      </label>
                      <input
                        type="number"
                        value={formData.sendLimits.throttling.messagesPerBatch}
                        onChange={(e) => setFormData({
                          ...formData,
                          sendLimits: {
                            ...formData.sendLimits,
                            throttling: {
                              ...formData.sendLimits.throttling,
                              messagesPerBatch: parseInt(e.target.value)
                            }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delay Between Batches (seconds)
                      </label>
                      <input
                        type="number"
                        value={formData.sendLimits.throttling.delayBetweenBatchesMs / 1000}
                        onChange={(e) => setFormData({
                          ...formData,
                          sendLimits: {
                            ...formData.sendLimits,
                            throttling: {
                              ...formData.sendLimits.throttling,
                              delayBetweenBatchesMs: parseInt(e.target.value) * 1000
                            }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "compliance" && (
          <div className="max-w-4xl space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Unsubscribe Management</h3>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.compliance.unsubscribe.enabled}
                      onChange={(e) => setFormData({
                        ...formData,
                        compliance: {
                          ...formData.compliance,
                          unsubscribe: { ...formData.compliance.unsubscribe, enabled: e.target.checked }
                        }
                      })}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Include unsubscribe link in all marketing emails
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unsubscribe Page URL
                  </label>
                  <input
                    type="url"
                    value={formData.compliance.unsubscribe.pageUrl}
                    onChange={(e) => setFormData({
                      ...formData,
                      compliance: {
                        ...formData.compliance,
                        unsubscribe: { ...formData.compliance.unsubscribe, pageUrl: e.target.value }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://company.com/unsubscribe"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.compliance.unsubscribe.oneClickUnsubscribe}
                      onChange={(e) => setFormData({
                        ...formData,
                        compliance: {
                          ...formData.compliance,
                          unsubscribe: {
                            ...formData.compliance.unsubscribe,
                            oneClickUnsubscribe: e.target.checked
                          }
                        }
                      })}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Enable one-click unsubscribe (List-Unsubscribe header)
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Suppression Lists</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Database className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium">Suppressed Addresses</div>
                      <div className="text-sm text-gray-500">
                        {formData.compliance.suppressionList.addresses.length} addresses
                      </div>
                    </div>
                  </div>
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                    Manage
                  </button>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.compliance.suppressionList.autoSuppressBounces}
                      onChange={(e) => setFormData({
                        ...formData,
                        compliance: {
                          ...formData.compliance,
                          suppressionList: {
                            ...formData.compliance.suppressionList,
                            autoSuppressBounces: e.target.checked
                          }
                        }
                      })}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Automatically suppress hard bounces
                    </span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.compliance.suppressionList.autoSuppressComplaints}
                      onChange={(e) => setFormData({
                        ...formData,
                        compliance: {
                          ...formData.compliance,
                          suppressionList: {
                            ...formData.compliance.suppressionList,
                            autoSuppressComplaints: e.target.checked
                          }
                        }
                      })}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Automatically suppress spam complaints
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Data Retention</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Content Retention (days)
                  </label>
                  <input
                    type="number"
                    value={formData.compliance.dataRetention.emailContentDays}
                    onChange={(e) => setFormData({
                      ...formData,
                      compliance: {
                        ...formData.compliance,
                        dataRetention: {
                          ...formData.compliance.dataRetention,
                          emailContentDays: parseInt(e.target.value)
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">How long to retain full email content</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Analytics Data Retention (days)
                  </label>
                  <input
                    type="number"
                    value={formData.compliance.dataRetention.analyticsDataDays}
                    onChange={(e) => setFormData({
                      ...formData,
                      compliance: {
                        ...formData.compliance,
                        dataRetention: {
                          ...formData.compliance.dataRetention,
                          analyticsDataDays: parseInt(e.target.value)
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">How long to retain open/click tracking data</p>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.compliance.dataRetention.deleteUnsubscribedUsers}
                      onChange={(e) => setFormData({
                        ...formData,
                        compliance: {
                          ...formData.compliance,
                          dataRetention: {
                            ...formData.compliance.dataRetention,
                            deleteUnsubscribedUsers: e.target.checked
                          }
                        }
                      })}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Auto-delete unsubscribed user data after retention period
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-yellow-900 mb-1">Compliance Notice</h4>
                  <p className="text-sm text-yellow-800">
                    Ensure these settings comply with GDPR, CAN-SPAM, CASL, and other applicable regulations
                    in your jurisdiction. Consult with legal counsel if needed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
