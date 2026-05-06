import React, { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import {
  Search, Filter, Send, Paperclip, MoreVertical, Star, Archive, Trash2,
  Bot, User, CheckCheck, Clock, UserPlus, Tag, Phone
} from "lucide-react";

const conversations = [
  {
    id: 1,
    contact: "Rajesh Kumar",
    phone: "+91 98765 43210",
    avatar: "RK",
    lastMessage: "Yes, I'm interested. Please send me more details",
    time: "2m ago",
    unread: 2,
    status: "AI",
    tags: ["Hot Lead", "Product Inquiry"],
  },
  {
    id: 2,
    contact: "Priya Sharma",
    phone: "+91 87654 32109",
    avatar: "PS",
    lastMessage: "Can you call me back?",
    time: "15m ago",
    unread: 1,
    status: "Escalated",
    tags: ["Support"],
  },
  {
    id: 3,
    contact: "Amit Patel",
    phone: "+91 76543 21098",
    avatar: "AP",
    lastMessage: "Thank you!",
    time: "1h ago",
    unread: 0,
    status: "Resolved",
    tags: [],
  },
  {
    id: 4,
    contact: "+91 65432 10987",
    phone: "+91 65432 10987",
    avatar: "?",
    lastMessage: "What are your prices?",
    time: "3h ago",
    unread: 1,
    status: "Active",
    tags: ["New"],
  },
];

const messages = [
  { id: 1, sender: "customer", text: "Hi, I saw your ad about the CRM software", time: "10:30 AM", status: "delivered" },
  { id: 2, sender: "ai", text: "Hello! Thank you for your interest. Our CRM helps businesses manage leads, automate workflows, and track customer interactions. What specific features are you looking for?", time: "10:31 AM", status: "delivered" },
  { id: 3, sender: "customer", text: "I need lead management and automation", time: "10:33 AM", status: "delivered" },
  { id: 4, sender: "ai", text: "Perfect! Our platform offers comprehensive lead management with AI-powered automation, scoring, and nurture campaigns. Would you like to see a demo or discuss pricing?", time: "10:34 AM", status: "delivered" },
  { id: 5, sender: "customer", text: "Yes, I'm interested. Please send me more details", time: "10:36 AM", status: "delivered" },
];

export function SMSInbox() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessageInput("");
    }
  };

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Communication" },
          { label: "SMS" },
          { label: "Inbox" }
        ]}
        companyName="Everest Digital Solutions"
        mode="customer"
        userName="Rajesh Sharma"
      />

      <div className="flex-1 flex overflow-hidden bg-[#F5F5F5]">
        {/* Conversations List */}
        <div className="w-80 bg-white border-r border-[#E5E7EB] flex flex-col">
          {/* Search & Filter */}
          <div className="p-4 border-b border-[#E5E7EB]">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={18} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-1.5 bg-[#1565C0] text-white rounded-lg text-xs font-medium hover:bg-[#0D47A1] transition-colors">
                All
              </button>
              <button className="flex-1 px-3 py-1.5 bg-white border border-[#E5E7EB] text-[#374151] rounded-lg text-xs font-medium hover:bg-[#F9FAFB] transition-colors">
                Unread
              </button>
              <button className="flex-1 px-3 py-1.5 bg-white border border-[#E5E7EB] text-[#374151] rounded-lg text-xs font-medium hover:bg-[#F9FAFB] transition-colors flex items-center justify-center gap-1">
                <Filter size={14} />
                Filter
              </button>
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`p-4 border-b border-[#E5E7EB] cursor-pointer transition-colors ${
                  selectedConversation.id === conv.id ? "bg-[#EBF5FF]" : "hover:bg-[#F9FAFB]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#1565C0] text-white flex items-center justify-center font-semibold shrink-0">
                    {conv.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-[#0F1B2D] truncate">{conv.contact}</span>
                      <span className="text-xs text-[#9CA3AF] shrink-0 ml-2">{conv.time}</span>
                    </div>
                    <div className="text-xs text-[#6B7280] mb-1">{conv.phone}</div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-[#6B7280] truncate">{conv.lastMessage}</p>
                      {conv.unread > 0 && (
                        <span className="w-5 h-5 rounded-full bg-[#1565C0] text-white text-xs flex items-center justify-center shrink-0 ml-2">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      {conv.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-[#F3F4F6] text-[#6B7280] text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ml-auto ${
                        conv.status === "AI" ? "bg-[#DBEAFE] text-[#1E40AF]" :
                        conv.status === "Escalated" ? "bg-[#FEF3C7] text-[#92400E]" :
                        conv.status === "Resolved" ? "bg-[#E5E7EB] text-[#374151]" :
                        "bg-[#D1FAE5] text-[#065F46]"
                      }`}>
                        <div className="flex items-center gap-1">
                          {conv.status === "AI" ? <Bot size={12} /> : <User size={12} />}
                          {conv.status}
                        </div>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="bg-white border-b border-[#E5E7EB] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1565C0] text-white flex items-center justify-center font-semibold">
                  {selectedConversation.avatar}
                </div>
                <div>
                  <div className="font-semibold text-[#0F1B2D]">{selectedConversation.contact}</div>
                  <div className="text-sm text-[#6B7280]">{selectedConversation.phone}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-[#F9FAFB] rounded-lg transition-colors">
                  <Phone size={20} className="text-[#6B7280]" />
                </button>
                <button className="p-2 hover:bg-[#F9FAFB] rounded-lg transition-colors">
                  <Star size={20} className="text-[#6B7280]" />
                </button>
                <button className="p-2 hover:bg-[#F9FAFB] rounded-lg transition-colors">
                  <Archive size={20} className="text-[#6B7280]" />
                </button>
                <button className="p-2 hover:bg-[#F9FAFB] rounded-lg transition-colors">
                  <MoreVertical size={20} className="text-[#6B7280]" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F9FAFB]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "customer" ? "justify-start" : "justify-end"}`}
              >
                <div className={`max-w-[70%]`}>
                  <div className={`rounded-lg p-3 ${
                    msg.sender === "customer"
                      ? "bg-white border border-[#E5E7EB]"
                      : "bg-[#1565C0] text-white"
                  }`}>
                    {msg.sender === "ai" && (
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/20">
                        <Bot size={14} />
                        <span className="text-xs font-semibold">AI Assistant</span>
                      </div>
                    )}
                    <p className={`text-sm ${msg.sender === "customer" ? "text-[#0F1B2D]" : "text-white"}`}>
                      {msg.text}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-1 px-1">
                    <span className="text-xs text-[#9CA3AF]">{msg.time}</span>
                    {msg.sender !== "customer" && (
                      <CheckCheck size={14} className={msg.status === "delivered" ? "text-[#1565C0]" : "text-[#9CA3AF]"} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Status Banner */}
          {selectedConversation.status === "AI" && (
            <div className="bg-[#DBEAFE] border-t border-[#93C5FD] px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot size={18} className="text-[#1565C0]" />
                  <span className="text-sm font-medium text-[#1E40AF]">AI is handling this conversation</span>
                </div>
                <button className="px-4 py-1.5 bg-[#1565C0] text-white rounded-lg text-sm font-medium hover:bg-[#0D47A1] transition-colors">
                  Take Over
                </button>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="bg-white border-t border-[#E5E7EB] p-4">
            <div className="flex items-end gap-3">
              <button className="p-2 hover:bg-[#F9FAFB] rounded-lg transition-colors">
                <Paperclip size={20} className="text-[#6B7280]" />
              </button>
              <div className="flex-1">
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message... (160 characters per SMS)"
                  rows={2}
                  maxLength={160}
                  className="w-full px-4 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <div className="flex items-center justify-between mt-1 px-1">
                  <span className="text-xs text-[#6B7280]">
                    {messageInput.length}/160 characters
                  </span>
                  {messageInput.length > 0 && (
                    <span className="text-xs text-[#6B7280]">
                      {Math.ceil(messageInput.length / 160)} SMS
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={handleSendMessage}
                className="p-3 bg-[#1565C0] text-white rounded-lg hover:bg-[#0D47A1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!messageInput.trim()}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Contact Info Sidebar */}
        <div className="w-80 bg-white border-l border-[#E5E7EB] overflow-y-auto">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-[#0F1B2D] mb-6">Contact Info</h3>

            {/* Contact Details */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-[#1565C0] text-white flex items-center justify-center font-bold text-2xl mx-auto mb-3">
                {selectedConversation.avatar}
              </div>
              <h4 className="font-semibold text-[#0F1B2D] text-lg">{selectedConversation.contact}</h4>
              <p className="text-sm text-[#9CA3AF] mt-1">{selectedConversation.phone}</p>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 mb-6">
              <button className="w-full px-4 py-2 bg-[#1565C0] text-white rounded-lg text-sm font-medium hover:bg-[#0D47A1] transition-colors flex items-center justify-center gap-2">
                <UserPlus size={16} />
                Convert to Lead
              </button>
              <button className="w-full px-4 py-2 bg-white border border-[#E5E7EB] text-[#374151] rounded-lg text-sm font-medium hover:bg-[#F9FAFB] transition-colors flex items-center justify-center gap-2">
                <Phone size={16} />
                Call Contact
              </button>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-[#0F1B2D] mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {selectedConversation.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-[#F3F4F6] text-[#374151] text-sm rounded-full">
                    {tag}
                  </span>
                ))}
                <button className="px-3 py-1 border border-dashed border-[#D1D5DB] text-[#6B7280] text-sm rounded-full hover:bg-[#F9FAFB] transition-colors flex items-center gap-1">
                  <Tag size={12} />
                  Add Tag
                </button>
              </div>
            </div>

            {/* Conversation Details */}
            <div>
              <h4 className="text-sm font-semibold text-[#0F1B2D] mb-3">Details</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Status</span>
                  <span className={`font-medium ${
                    selectedConversation.status === "AI" ? "text-[#1E40AF]" :
                    selectedConversation.status === "Escalated" ? "text-[#92400E]" :
                    "text-[#065F46]"
                  }`}>
                    {selectedConversation.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">First Contact</span>
                  <span className="text-[#0F1B2D]">2 hours ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Messages</span>
                  <span className="text-[#0F1B2D]">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Source</span>
                  <span className="text-[#0F1B2D]">Inbound</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Campaign</span>
                  <span className="text-[#0F1B2D]">Summer Sale</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
