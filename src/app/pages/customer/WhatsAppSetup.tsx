import React, { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  CheckCircle, XCircle, AlertCircle, Settings, Phone, Key, Globe,
  ShieldCheck, DollarSign, Zap, ArrowRight, ExternalLink, Copy, Check
} from "lucide-react";

export function WhatsAppSetup() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [copied, setCopied] = useState(false);

  const [setupData, setSetupData] = useState({
    businessName: "",
    phoneNumber: "",
    displayName: "",
    category: "",
    appId: "",
    appSecret: "",
    phoneNumberId: "",
    businessAccountId: "",
    webhookUrl: "",
    verifyToken: "",
    accessToken: ""
  });

  const [connectionStatus, setConnectionStatus] = useState({
    metaConnected: false,
    phoneVerified: false,
    webhookConfigured: false,
    templatesApproved: false
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    { id: 1, title: "Meta Business Account", icon: Globe },
    { id: 2, title: "WhatsApp Business Number", icon: Phone },
    { id: 3, title: "API Configuration", icon: Key },
    { id: 4, title: "Webhook Setup", icon: Zap },
    { id: 5, title: "Verification", icon: ShieldCheck }
  ];

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "WhatsApp" },
          { label: "Settings" },
          { label: "Account Setup" }
        ]}
        companyName="Everest Digital Solutions"
        mode="customer"
        userName="Rajesh Sharma"
      />

      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              WhatsApp Business Account Setup
            </h1>
            <p className="text-sm text-gray-600">
              Connect your WhatsApp Business Account to enable messaging capabilities
            </p>
          </div>

          {/* Connection Status Cards */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className={`p-4 rounded-lg border-2 ${connectionStatus.metaConnected ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {connectionStatus.metaConnected ? (
                  <CheckCircle size={20} className="text-green-600" />
                ) : (
                  <XCircle size={20} className="text-gray-400" />
                )}
                <span className="font-medium text-sm text-gray-900">Meta Connected</span>
              </div>
              <p className="text-xs text-gray-600">Business Manager linked</p>
            </div>

            <div className={`p-4 rounded-lg border-2 ${connectionStatus.phoneVerified ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {connectionStatus.phoneVerified ? (
                  <CheckCircle size={20} className="text-green-600" />
                ) : (
                  <XCircle size={20} className="text-gray-400" />
                )}
                <span className="font-medium text-sm text-gray-900">Phone Verified</span>
              </div>
              <p className="text-xs text-gray-600">WhatsApp number active</p>
            </div>

            <div className={`p-4 rounded-lg border-2 ${connectionStatus.webhookConfigured ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {connectionStatus.webhookConfigured ? (
                  <CheckCircle size={20} className="text-green-600" />
                ) : (
                  <XCircle size={20} className="text-gray-400" />
                )}
                <span className="font-medium text-sm text-gray-900">Webhook Active</span>
              </div>
              <p className="text-xs text-gray-600">Receiving messages</p>
            </div>

            <div className={`p-4 rounded-lg border-2 ${connectionStatus.templatesApproved ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {connectionStatus.templatesApproved ? (
                  <CheckCircle size={20} className="text-green-600" />
                ) : (
                  <XCircle size={20} className="text-gray-400" />
                )}
                <span className="font-medium text-sm text-gray-900">Templates Ready</span>
              </div>
              <p className="text-xs text-gray-600">Can send campaigns</p>
            </div>
          </div>

          {/* Setup Steps */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            {/* Progress Indicator */}
            <div className="flex items-center justify-between mb-8">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      currentStep > step.id ? 'bg-[#25D366] border-[#25D366]' :
                      currentStep === step.id ? 'border-[#25D366] bg-white' :
                      'border-gray-300 bg-white'
                    }`}>
                      {currentStep > step.id ? (
                        <Check size={24} className="text-white" />
                      ) : (
                        <step.icon size={24} className={currentStep === step.id ? 'text-[#25D366]' : 'text-gray-400'} />
                      )}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 ${currentStep > step.id ? 'bg-[#25D366]' : 'bg-gray-300'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Step 1: Meta Business Account */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Meta Business Account</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    You'll need a Meta Business Manager account to use WhatsApp Business API
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle size={20} className="text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <strong>Prerequisites:</strong>
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                      <li>Meta Business Manager account</li>
                      <li>Verified business on Meta</li>
                      <li>WhatsApp Business Platform access approved</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={setupData.businessName}
                      onChange={(e) => setSetupData({ ...setupData, businessName: e.target.value })}
                      placeholder="Your Business Name"
                      className="w-full h-11 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Account ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={setupData.businessAccountId}
                      onChange={(e) => setSetupData({ ...setupData, businessAccountId: e.target.value })}
                      placeholder="123456789012345"
                      className="w-full h-11 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Find this in your Meta Business Manager settings
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <a
                    href="https://business.facebook.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-[#25D366] hover:text-[#128C7E] font-medium"
                  >
                    <ExternalLink size={16} />
                    Open Meta Business Manager
                  </a>
                </div>
              </div>
            )}

            {/* Step 2: WhatsApp Business Number */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">WhatsApp Business Number</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Register your business phone number with WhatsApp
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={setupData.phoneNumber}
                      onChange={(e) => setSetupData({ ...setupData, phoneNumber: e.target.value })}
                      placeholder="+1234567890"
                      className="w-full h-11 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Must be a phone number not currently registered with WhatsApp
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={setupData.displayName}
                      onChange={(e) => setSetupData({ ...setupData, displayName: e.target.value })}
                      placeholder="Business Display Name"
                      className="w-full h-11 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      This name will be displayed to your customers
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={setupData.phoneNumberId}
                      onChange={(e) => setSetupData({ ...setupData, phoneNumberId: e.target.value })}
                      placeholder="From WhatsApp Business Platform"
                      className="w-full h-11 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={setupData.category}
                      onChange={(e) => setSetupData({ ...setupData, category: e.target.value })}
                      className="w-full h-11 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                    >
                      <option value="">Select category</option>
                      <option value="retail">Retail</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="services">Professional Services</option>
                      <option value="education">Education</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="realestate">Real Estate</option>
                      <option value="automotive">Automotive</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: API Configuration */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">API Configuration</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Enter your WhatsApp Business API credentials
                  </p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle size={20} className="text-orange-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-orange-900">
                    <strong>Security Notice:</strong> These credentials provide access to your WhatsApp Business account. Keep them secure and never share them publicly.
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      App ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={setupData.appId}
                      onChange={(e) => setSetupData({ ...setupData, appId: e.target.value })}
                      placeholder="Your Meta App ID"
                      className="w-full h-11 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      App Secret <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={setupData.appSecret}
                      onChange={(e) => setSetupData({ ...setupData, appSecret: e.target.value })}
                      placeholder="Your Meta App Secret"
                      className="w-full h-11 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Access Token <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={setupData.accessToken}
                      onChange={(e) => setSetupData({ ...setupData, accessToken: e.target.value })}
                      placeholder="Your permanent access token from Meta"
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent resize-none font-mono text-xs"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Generate a permanent token with whatsapp_business_messaging and whatsapp_business_management permissions
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <a
                    href="https://developers.facebook.com/apps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-[#25D366] hover:text-[#128C7E] font-medium"
                  >
                    <ExternalLink size={16} />
                    Open Meta Developers Console
                  </a>
                </div>
              </div>
            )}

            {/* Step 4: Webhook Setup */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Webhook Configuration</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Configure webhooks to receive incoming WhatsApp messages
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Webhook URL
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={`https://api.yourplatform.com/webhook/whatsapp/${setupData.businessAccountId}`}
                        readOnly
                        className="flex-1 h-11 px-4 rounded-lg border border-gray-300 text-sm bg-gray-50 font-mono text-xs"
                      />
                      <button
                        onClick={() => handleCopy(`https://api.yourplatform.com/webhook/whatsapp/${setupData.businessAccountId}`)}
                        className="h-11 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Use this URL in your Meta App webhook configuration
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Verify Token
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={setupData.verifyToken || "whatsapp_verify_token_2024"}
                        readOnly
                        className="flex-1 h-11 px-4 rounded-lg border border-gray-300 text-sm bg-gray-50 font-mono"
                      />
                      <button
                        onClick={() => handleCopy(setupData.verifyToken || "whatsapp_verify_token_2024")}
                        className="h-11 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-medium text-sm text-gray-900 mb-3">Webhook Subscription Fields</h4>
                    <p className="text-xs text-gray-600 mb-3">Subscribe to these fields in your Meta webhook configuration:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {['messages', 'message_status', 'message_echoes', 'message_template_status_update'].map((field) => (
                        <div key={field} className="flex items-center gap-2 text-xs text-gray-700">
                          <CheckCircle size={14} className="text-[#25D366]" />
                          <code className="bg-white px-2 py-0.5 rounded border border-gray-200">{field}</code>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <a
                    href="https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/components"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-[#25D366] hover:text-[#128C7E] font-medium"
                  >
                    <ExternalLink size={16} />
                    View Webhook Documentation
                  </a>
                </div>
              </div>
            )}

            {/* Step 5: Verification */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify Connection</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Test your WhatsApp Business API connection
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-900">API Connection</span>
                      <CheckCircle size={20} className="text-green-600" />
                    </div>
                    <p className="text-xs text-gray-600">Connected to Meta Business API</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-900">Phone Number</span>
                      <CheckCircle size={20} className="text-green-600" />
                    </div>
                    <p className="text-xs text-gray-600">Verified and active</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-900">Webhook</span>
                      <CheckCircle size={20} className="text-green-600" />
                    </div>
                    <p className="text-xs text-gray-600">Receiving events successfully</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-900">Message Delivery</span>
                      <CheckCircle size={20} className="text-green-600" />
                    </div>
                    <p className="text-xs text-gray-600">Test message sent successfully</p>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900 mb-1">
                      Setup Complete!
                    </p>
                    <p className="text-sm text-green-800">
                      Your WhatsApp Business Account is now connected and ready to use. You can start creating templates and sending messages.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate("/tenant/whatsapp/templates/create")}
                    className="flex-1 h-11 px-6 rounded-lg bg-[#25D366] text-white text-sm font-medium hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2"
                  >
                    Create Your First Template
                    <ArrowRight size={16} />
                  </button>
                  <button
                    onClick={() => navigate("/tenant/whatsapp")}
                    className="h-11 px-6 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep < 5 && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
                  disabled={currentStep === 1}
                  className="h-11 px-6 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="h-11 px-6 rounded-lg bg-[#25D366] text-white text-sm font-medium hover:bg-[#128C7E] transition-colors flex items-center gap-2"
                >
                  Continue
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Helpful Resources</h3>
            <div className="grid grid-cols-3 gap-4">
              <a
                href="https://business.whatsapp.com/products/platform-pricing"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 border border-gray-200 rounded-lg hover:border-[#25D366] hover:bg-green-50 transition-all group"
              >
                <DollarSign size={24} className="text-gray-400 group-hover:text-[#25D366] mb-2" />
                <h4 className="font-medium text-sm text-gray-900 mb-1">Pricing Information</h4>
                <p className="text-xs text-gray-600">View WhatsApp Business API pricing</p>
              </a>

              <a
                href="https://developers.facebook.com/docs/whatsapp/cloud-api"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 border border-gray-200 rounded-lg hover:border-[#25D366] hover:bg-green-50 transition-all group"
              >
                <Settings size={24} className="text-gray-400 group-hover:text-[#25D366] mb-2" />
                <h4 className="font-medium text-sm text-gray-900 mb-1">API Documentation</h4>
                <p className="text-xs text-gray-600">Learn about Cloud API features</p>
              </a>

              <a
                href="https://business.whatsapp.com/policy"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 border border-gray-200 rounded-lg hover:border-[#25D366] hover:bg-green-50 transition-all group"
              >
                <ShieldCheck size={24} className="text-gray-400 group-hover:text-[#25D366] mb-2" />
                <h4 className="font-medium text-sm text-gray-900 mb-1">WhatsApp Policy</h4>
                <p className="text-xs text-gray-600">Understand compliance requirements</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
