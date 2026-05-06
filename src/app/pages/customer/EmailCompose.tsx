import { useState } from "react";
import { useNavigate } from "react-router";
import { useEmail } from "../../hooks/useEmail";
import {
  X,
  Send,
  Paperclip,
  Users,
  FileText,
  Sparkles,
  Save,
  ChevronDown
} from "lucide-react";

export function EmailCompose() {
  const navigate = useNavigate();
  const { templates, signatures, sendEmail } = useEmail();

  const [formData, setFormData] = useState({
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    bodyHtml: "",
    bodyText: ""
  });

  const [showTemplateSelect, setShowTemplateSelect] = useState(false);
  const [showSignatureSelect, setShowSignatureSelect] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedSignature, setSelectedSignature] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setFormData({
        ...formData,
        subject: template.subject,
        bodyHtml: template.bodyHtml,
        bodyText: template.bodyText
      });
      setSelectedTemplate(templateId);
      setShowTemplateSelect(false);
    }
  };

  const handleSignatureSelect = (signatureId: string) => {
    const signature = signatures.find(s => s.id === signatureId);
    if (signature) {
      setFormData({
        ...formData,
        bodyHtml: formData.bodyHtml + "\n\n" + signature.html,
        bodyText: formData.bodyText + "\n\n" + signature.text
      });
      setSelectedSignature(signatureId);
      setShowSignatureSelect(false);
    }
  };

  const handleAIDraft = () => {
    const aiDraft = `<p>Dear recipient,</p>
<p>I hope this email finds you well. I wanted to reach out regarding...</p>
<p>Looking forward to your response.</p>
<p>Best regards</p>`;
    
    setFormData({
      ...formData,
      bodyHtml: aiDraft,
      bodyText: aiDraft.replace(/<[^>]*>/g, '\n').trim()
    });
  };

  const handleSend = () => {
    setIsSending(true);
    
    const toEmails = formData.to.split(",").map(e => e.trim()).filter(Boolean);
    const ccEmails = formData.cc ? formData.cc.split(",").map(e => e.trim()).filter(Boolean) : undefined;
    const bccEmails = formData.bcc ? formData.bcc.split(",").map(e => e.trim()).filter(Boolean) : undefined;

    sendEmail({
      to: toEmails,
      cc: ccEmails,
      bcc: bccEmails,
      subject: formData.subject,
      bodyHtml: formData.bodyHtml,
      bodyText: formData.bodyText
    });

    setTimeout(() => {
      setIsSending(false);
      navigate("/tenant/email/inbox");
    }, 1000);
  };

  const handleSaveDraft = () => {
    console.log("Draft saved");
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Compose Email</h1>
          <button
            onClick={() => navigate("/tenant/email/inbox")}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg border">
          {/* Toolbar */}
          <div className="border-b px-6 py-3 flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowTemplateSelect(!showTemplateSelect)}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                {selectedTemplate ? "Template Applied" : "Use Template"}
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showTemplateSelect && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-10 max-h-64 overflow-y-auto">
                  {templates.filter(t => t.status === "active").map(template => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template.id)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0"
                    >
                      <div className="font-medium text-sm">{template.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{template.subject}</div>
                    </button>
                  ))}
                  {templates.filter(t => t.status === "active").length === 0 && (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      No active templates
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowSignatureSelect(!showSignatureSelect)}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Add Signature
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showSignatureSelect && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-10 max-h-64 overflow-y-auto">
                  {signatures.map(signature => (
                    <button
                      key={signature.id}
                      onClick={() => handleSignatureSelect(signature.id)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0"
                    >
                      <div className="font-medium text-sm">{signature.name}</div>
                      {signature.isDefault && (
                        <div className="text-xs text-blue-600 mt-1">Default</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleAIDraft}
              className="px-3 py-2 border border-purple-300 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              AI Draft
            </button>

            <div className="flex-1"></div>

            <button
              onClick={handleSaveDraft}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </button>
          </div>

          {/* Email Form */}
          <div className="p-6 space-y-4">
            {/* To */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 w-16">To:</label>
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={formData.to}
                  onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                  className="flex-1 px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                  placeholder="recipient@example.com"
                />
                <div className="flex gap-2">
                  {!showCc && (
                    <button
                      onClick={() => setShowCc(true)}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Cc
                    </button>
                  )}
                  {!showBcc && (
                    <button
                      onClick={() => setShowBcc(true)}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Bcc
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Cc */}
            {showCc && (
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700 w-16">Cc:</label>
                <input
                  type="text"
                  value={formData.cc}
                  onChange={(e) => setFormData({ ...formData, cc: e.target.value })}
                  className="flex-1 px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                  placeholder="cc@example.com"
                />
                <button
                  onClick={() => setShowCc(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Bcc */}
            {showBcc && (
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700 w-16">Bcc:</label>
                <input
                  type="text"
                  value={formData.bcc}
                  onChange={(e) => setFormData({ ...formData, bcc: e.target.value })}
                  className="flex-1 px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                  placeholder="bcc@example.com"
                />
                <button
                  onClick={() => setShowBcc(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Subject */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 w-16">Subject:</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="flex-1 px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                placeholder="Email subject"
              />
            </div>

            {/* Body */}
            <div className="pt-4">
              <textarea
                value={formData.bodyText}
                onChange={(e) => {
                  const text = e.target.value;
                  setFormData({
                    ...formData,
                    bodyText: text,
                    bodyHtml: `<p>${text.split('\n').join('</p><p>')}</p>`
                  });
                }}
                rows={16}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message here..."
              />
            </div>

            {/* Attachments */}
            <div className="pt-4 border-t">
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2">
                <Paperclip className="w-4 h-4" />
                Attach Files
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Tip: Use Ctrl+Enter to send
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/tenant/email/inbox")}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={!formData.to || !formData.subject || isSending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Email
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
