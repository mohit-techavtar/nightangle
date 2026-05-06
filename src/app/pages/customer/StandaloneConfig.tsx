import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Upload,
  Download,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Info,
  Play,
  Code,
  Link as LinkIcon,
  XCircle,
} from "lucide-react";

interface UploadRecord {
  id: string;
  fileName: string;
  records: number;
  status: "imported" | "error";
  errorCount?: number;
  date: string;
}

interface WebhookDelivery {
  id: string;
  event: string;
  status: "success" | "error";
  statusCode: number;
  response: string;
  time: string;
}

const uploadHistory: UploadRecord[] = [
  {
    id: "1",
    fileName: "leads_april_batch1.csv",
    records: 500,
    status: "imported",
    date: "Apr 1",
  },
  {
    id: "2",
    fileName: "mumbai_leads.xlsx",
    records: 247,
    status: "error",
    errorCount: 12,
    date: "Mar 29",
  },
  {
    id: "3",
    fileName: "collections_list.csv",
    records: 300,
    status: "imported",
    date: "Mar 25",
  },
];

const webhookDeliveries: WebhookDelivery[] = [
  {
    id: "1",
    event: "call_completed",
    status: "success",
    statusCode: 200,
    response: "OK",
    time: "2m ago",
  },
  {
    id: "2",
    event: "call_completed",
    status: "success",
    statusCode: 200,
    response: "OK",
    time: "5m ago",
  },
  {
    id: "3",
    event: "call_failed",
    status: "error",
    statusCode: 500,
    response: "Timeout",
    time: "15m ago",
  },
];

export function StandaloneConfig() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"import" | "webhooks" | "mapping">("import");
  const [showApiKey, setShowApiKey] = useState(false);
  const [codeTab, setCodeTab] = useState<"curl" | "python" | "nodejs">("curl");
  const [webhookUrl, setWebhookUrl] = useState("https://yourdomain.com/api/webhook");
  const [webhookAuth, setWebhookAuth] = useState("bearer");
  const [erpConnected, setErpConnected] = useState(true);
  const [erpSync, setErpSync] = useState(true);

  // Webhook events
  const [callCompleted, setCallCompleted] = useState(true);
  const [callFailed, setCallFailed] = useState(true);
  const [transferToHuman, setTransferToHuman] = useState(true);
  const [callStarted, setCallStarted] = useState(false);
  const [retryScheduled, setRetryScheduled] = useState(false);

  const apiEndpoint = "https://api.nightangle.ai/v1/leads";
  const apiKey = "sk_live_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567k4Fz";

  const curlExample = `curl -X POST ${apiEndpoint} \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "leads": [
      {
        "name": "Rajesh Kumar",
        "phone": "+919876543210",
        "company": "Mehta Jewellers",
        "campaign_id": "camp_jewellery_q2",
        "custom_fields": {
          "city": "Mumbai",
          "product_interest": "Billing Software"
        }
      }
    ]
  }'`;

  const pythonExample = `import requests

url = "${apiEndpoint}"
headers = {
    "Authorization": "Bearer ${apiKey}",
    "Content-Type": "application/json"
}
data = {
    "leads": [
        {
            "name": "Rajesh Kumar",
            "phone": "+919876543210",
            "company": "Mehta Jewellers",
            "campaign_id": "camp_jewellery_q2"
        }
    ]
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`;

  const nodejsExample = `const axios = require('axios');

const url = '${apiEndpoint}';
const headers = {
  'Authorization': 'Bearer ${apiKey}',
  'Content-Type': 'application/json'
};
const data = {
  leads: [
    {
      name: 'Rajesh Kumar',
      phone: '+919876543210',
      company: 'Mehta Jewellers',
      campaign_id: 'camp_jewellery_q2'
    }
  ]
};

axios.post(url, data, { headers })
  .then(response => console.log(response.data))
  .catch(error => console.error(error));`;

  const getCodeExample = () => {
    switch (codeTab) {
      case "python":
        return pythonExample;
      case "nodejs":
        return nodejsExample;
      default:
        return curlExample;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/tenant/ai-calling")}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Standalone Configuration</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Configure lead import and outcome delivery for non-CRM deployments
                </p>
              </div>
            </div>
          </div>

          {/* Mode Indicator Banner */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold text-blue-900">
                  Running in Standalone Mode
                </div>
                <div className="text-xs text-blue-700 mt-0.5">
                  Operating without CRM integration - using CSV uploads and API
                </div>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              <LinkIcon className="w-4 h-4" />
              Connect to CRM
            </button>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("import")}
              className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "import"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Lead Import
            </button>
            <button
              onClick={() => setActiveTab("webhooks")}
              className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "webhooks"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              API & Webhooks
            </button>
            <button
              onClick={() => setActiveTab("mapping")}
              className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "mapping"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Field Mapping
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* TAB 1 - Lead Import */}
          {activeTab === "import" && (
            <>
              {/* Upload Leads Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-5">Upload Leads</h3>

                {/* Drag and Drop Zone */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-indigo-400 hover:bg-indigo-50 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="text-lg font-medium text-gray-900 mb-2">
                    Drag and drop your file here
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    or click to browse (CSV, XLSX supported)
                  </div>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                    Select File
                  </button>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                    <Download className="w-4 h-4" />
                    Download Template
                  </button>
                  <span className="text-sm text-gray-500">
                    (Required fields: name, phone, campaign)
                  </span>
                </div>

                {/* Recent Uploads Table */}
                <div className="mt-8">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Recent Uploads</h4>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            File Name
                          </th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Records
                          </th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {uploadHistory.map((upload) => (
                          <tr key={upload.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4">
                              <span className="text-sm font-mono text-gray-900">
                                {upload.fileName}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-sm font-mono text-gray-900">
                                {upload.records.toLocaleString()}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {upload.status === "imported" ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  Imported
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  {upload.errorCount} errors
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-sm text-gray-700">{upload.date}</span>
                            </td>
                            <td className="py-3 px-4">
                              {upload.status === "imported" ? (
                                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                                  View Log
                                </button>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                                    View
                                  </button>
                                  <span className="text-gray-400">/</span>
                                  <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                                    Fix
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* API Ingestion Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-5">API Ingestion</h3>

                {/* API Endpoint */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Endpoint
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg font-mono text-sm text-gray-900">
                        {apiEndpoint}
                      </div>
                      <button
                        onClick={() => copyToClipboard(apiEndpoint)}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        title="Copy"
                      >
                        <Copy className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* API Key */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg font-mono text-sm text-gray-900">
                        {showApiKey ? apiKey : "••••••••••••••••••••••••••••••••••••k4Fz"}
                      </div>
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        title={showApiKey ? "Hide" : "Show"}
                      >
                        {showApiKey ? (
                          <EyeOff className="w-4 h-4 text-gray-600" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(apiKey)}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        title="Copy"
                      >
                        <Copy className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Rate limit: <span className="font-semibold">100 leads/minute</span>
                    </p>
                  </div>

                  {/* Code Snippet */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Code Example
                    </label>

                    {/* Code Tab Bar */}
                    <div className="flex gap-2 mb-2">
                      <button
                        onClick={() => setCodeTab("curl")}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                          codeTab === "curl"
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        cURL
                      </button>
                      <button
                        onClick={() => setCodeTab("python")}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                          codeTab === "python"
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Python
                      </button>
                      <button
                        onClick={() => setCodeTab("nodejs")}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                          codeTab === "nodejs"
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Node.js
                      </button>
                    </div>

                    {/* Code Block */}
                    <div className="relative">
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs font-mono leading-relaxed">
                        {getCodeExample()}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(getCodeExample())}
                        className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                        title="Copy code"
                      >
                        <Copy className="w-4 h-4 text-gray-300" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2 - API & Webhooks */}
          {activeTab === "webhooks" && (
            <>
              {/* Outbound Webhooks Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-5">
                  Outbound Webhooks (Outcome Delivery)
                </h3>

                <div className="space-y-6">
                  {/* Webhook URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Webhook URL
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        placeholder="https://yourdomain.com/api/webhook"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                      />
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Test
                      </button>
                    </div>
                  </div>

                  {/* Events to Send */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Events to send
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={callCompleted}
                          onChange={(e) => setCallCompleted(e.target.checked)}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">Call Completed</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={callFailed}
                          onChange={(e) => setCallFailed(e.target.checked)}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">Call Failed</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={transferToHuman}
                          onChange={(e) => setTransferToHuman(e.target.checked)}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">Transfer to Human</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={callStarted}
                          onChange={(e) => setCallStarted(e.target.checked)}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">Call Started</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={retryScheduled}
                          onChange={(e) => setRetryScheduled(e.target.checked)}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">Retry Scheduled</span>
                      </label>
                    </div>
                  </div>

                  {/* Authentication */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Authentication
                      </label>
                      <select
                        value={webhookAuth}
                        onChange={(e) => setWebhookAuth(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      >
                        <option value="none">None</option>
                        <option value="bearer">Bearer Token</option>
                        <option value="hmac">HMAC</option>
                      </select>
                    </div>
                    {webhookAuth !== "none" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {webhookAuth === "bearer" ? "Bearer Token" : "Secret Key"}
                        </label>
                        <input
                          type="password"
                          placeholder="Enter secret..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                        />
                      </div>
                    )}
                  </div>

                  {/* Recent Deliveries */}
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">
                      Recent Deliveries
                    </h4>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Event
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Response
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Time
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {webhookDeliveries.map((delivery) => (
                            <tr key={delivery.id} className="hover:bg-gray-50 transition-colors">
                              <td className="py-3 px-4">
                                <span className="text-sm font-mono text-gray-900">
                                  {delivery.event}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                {delivery.status === "success" ? (
                                  <span className="inline-flex items-center gap-1 text-sm font-mono text-green-700">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    {delivery.statusCode}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-sm font-mono text-red-700">
                                    <XCircle className="w-3.5 h-3.5" />
                                    {delivery.statusCode}
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <span className="text-sm font-mono text-gray-700">
                                  {delivery.response}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span className="text-sm text-gray-700">{delivery.time}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                      <ExternalLink className="w-4 h-4" />
                      View Full Webhook Log
                    </button>
                  </div>
                </div>
              </div>

              {/* Hitech ERP Integration */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border-2 border-purple-200 p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Hitech ERP Integration
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Direct integration with your ERP notification module
                    </p>
                  </div>
                  {erpConnected ? (
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Connected
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                      Not Connected
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {/* ERP Endpoint */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ERP Notification Module Endpoint
                    </label>
                    <div className="px-4 py-2 bg-white border border-purple-300 rounded-lg font-mono text-sm text-gray-900">
                      https://erp.yourdomain.com/api/notifications
                    </div>
                  </div>

                  {/* Sync Settings */}
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200">
                    <div>
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        Push outcomes to ERP
                      </div>
                      <p className="text-xs text-gray-600">
                        Automatically sync call outcomes back to ERP system
                      </p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={erpSync}
                        onChange={(e) => setErpSync(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                      />
                      <span
                        className={`text-sm font-medium ${
                          erpSync ? "text-green-700" : "text-gray-500"
                        }`}
                      >
                        {erpSync ? "ON" : "OFF"}
                      </span>
                    </label>
                  </div>

                  {/* Field Mapping Preview */}
                  <div className="p-4 bg-white rounded-lg border border-purple-200">
                    <div className="text-sm font-medium text-gray-900 mb-3">
                      Field Mapping Preview
                    </div>
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">lead_id</span>
                        <span className="text-gray-400">→</span>
                        <span className="text-gray-900">ERP.customer_id</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">call_outcome</span>
                        <span className="text-gray-400">→</span>
                        <span className="text-gray-900">ERP.status</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">transcript</span>
                        <span className="text-gray-400">→</span>
                        <span className="text-gray-900">ERP.notes</span>
                      </div>
                    </div>
                    <button className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                      Edit Field Mapping →
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 3 - Field Mapping */}
          {activeTab === "mapping" && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Field Mapping</h3>
              <p className="text-sm text-gray-600 mb-6">
                Map CSV columns to system fields for lead import
              </p>

              <div className="text-center py-12">
                <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="text-gray-600">Field mapping configuration coming soon</div>
                <div className="text-sm text-gray-500 mt-2">
                  Configure custom field mappings for CSV uploads
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
