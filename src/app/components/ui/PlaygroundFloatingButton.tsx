import React, { useState } from "react";
import { Bot, X, Send, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";

const quickSuggestions = [
  "Find 50 tech leads in Nepal",
  "Create GTM strategy",
  "Research competitors",
  "Plan email campaign",
];

export function PlaygroundFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (query?: string) => {
    const finalQuery = query || message;
    if (!finalQuery.trim()) return;
    
    setIsOpen(false);
    setMessage("");
    navigate("/tenant/playground", { state: { initialQuery: finalQuery } });
  };

  return (
    <>
      {/* Popup Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal */}
          <div className="fixed bottom-24 right-6 max-md:right-4 max-md:bottom-20 z-50 w-[400px] max-md:w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border-2 border-[#1565C0] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1565C0] to-[#0D47A1] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="text-white" size={16} />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">Business Playground</div>
                  <div className="text-white/80 text-xs">Quick AI Assistant</div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 max-h-[400px] overflow-y-auto">
              <p className="text-sm text-[#616161] mb-3">Quick start with:</p>
              <div className="space-y-2 mb-4">
                {quickSuggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSubmit(suggestion)}
                    className="w-full text-left px-3 py-2 rounded-lg bg-[#F5F5F5] hover:bg-[#E3F2FD] hover:border-[#1565C0] border border-transparent transition-all text-sm text-[#212121]"
                  >
                    <Sparkles size={14} className="inline mr-2 text-[#1565C0]" />
                    {suggestion}
                  </button>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Or type your own question..."
                  rows={3}
                  className="w-full px-3 py-2 pr-10 border-2 border-[#E0E0E0] rounded-lg bg-white text-[#212121] text-sm outline-none transition-all focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/10 resize-none"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="absolute right-2 bottom-2 w-8 h-8 rounded-lg bg-[#1565C0] text-white flex items-center justify-center hover:bg-[#0D47A1] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 max-md:bottom-4 max-md:right-4 z-50 w-14 h-14 max-md:w-12 max-md:h-12 rounded-full bg-gradient-to-br from-[#1565C0] to-[#0D47A1] text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
      >
        {isOpen ? (
          <X size={24} className="max-md:w-5 max-md:h-5" />
        ) : (
          <>
            <Bot size={24} className="max-md:w-5 max-md:h-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#4CAF50] rounded-full border-2 border-white animate-pulse" />
          </>
        )}
      </button>
    </>
  );
}
