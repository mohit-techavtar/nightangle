import React, { useState, useEffect } from "react";
import { TopBar } from "../../components/layout/TopBar";
import {
  Search, Filter, Send, Paperclip, Smile, Phone, Video, Info, Bot, User, CheckCheck, Sparkles, UserPlus
} from "lucide-react";
import { useWhatsApp } from "../../hooks/useWhatsApp";
import { useLeads, Lead } from "../../hooks/useLeads";
import { LeadProfileSidebar } from "../../components/whatsapp/LeadProfileSidebar";
import { AIQualificationModal } from "../../components/whatsapp/AIQualificationModal";

export function WhatsAppInbox() {
  const {
    contacts,
    messages,
    selectedContact,
    setSelectedContact,
    sendMessage,
    getContactMessages,
    markAsRead,
    simulateIncomingMessage,
    linkContactToLead
  } = useWhatsApp();

  const {
    leads,
    aiQualificationQuestions,
    createLeadFromWhatsApp,
    findLeadByPhone,
    updateLeadStage,
    addLeadTag,
    removeLeadTag,
    updateLeadField,
    qualifyLeadWithAI,
    updateLeadDeal,
    addTimelineEntry
  } = useLeads();

  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showLeadProfile, setShowLeadProfile] = useState(false);
  const [showAIQualification, setShowAIQualification] = useState(false);
  const [currentLead, setCurrentLead] = useState<Lead | undefined>(undefined);

  // Auto-select first contact on mount
  useEffect(() => {
    if (!selectedContact && contacts.length > 0) {
      setSelectedContact(contacts[0].id);
    }
  }, [contacts, selectedContact, setSelectedContact]);

  // Update current lead when contact changes
  useEffect(() => {
    if (selectedContact) {
      const contact = contacts.find(c => c.id === selectedContact);
      if (contact) {
        const lead = findLeadByPhone(contact.phone);
        setCurrentLead(lead);
        if (lead) {
          setShowLeadProfile(true);
        }
      }
    }
  }, [selectedContact, contacts, findLeadByPhone]);

  const selectedContactData = contacts.find(c => c.id === selectedContact);
  const contactMessages = selectedContactData ? getContactMessages(selectedContactData.id) : [];

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedContactData) {
      sendMessage(selectedContactData.id, messageInput);

      // Add to lead timeline if lead exists
      if (currentLead) {
        addTimelineEntry(currentLead.id, {
          type: "message",
          content: messageInput,
          actor: "user"
        });
      }

      setMessageInput("");
    }
  };

  const handleConvertToLead = () => {
    if (!selectedContactData) return;

    const firstMessage = contactMessages.find(m => m.direction === "incoming")?.content || "";
    const newLead = createLeadFromWhatsApp(
      selectedContactData.phone,
      selectedContactData.name,
      firstMessage,
      selectedContactData.id
    );

    linkContactToLead(selectedContactData.id, newLead.id);
    setCurrentLead(newLead);
    setShowLeadProfile(true);
  };

  const handleStartAIQualification = () => {
    setShowAIQualification(true);
  };

  const handleAIQualificationSubmit = (answers: Record<string, string>) => {
    if (currentLead) {
      qualifyLeadWithAI(currentLead.id, answers);
    }
  };

  const handleSelectContact = (contactId: string) => {
    setSelectedContact(contactId);
    markAsRead(contactId);
  };

  // Simulate new incoming message for demo
  const handleSimulateIncoming = () => {
    const newPhone = `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const names = ["John Smith", "Emma Johnson", "Michael Brown", "Sophia Davis"];
    const messages = [
      "Hi, I'm interested in your CRM platform",
      "Can you tell me about your pricing?",
      "I'd like to schedule a demo",
      "What features do you offer for lead management?"
    ];

    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    const { contactId } = simulateIncomingMessage(newPhone, randomName, randomMessage);

    // Auto-create lead
    const lead = createLeadFromWhatsApp(newPhone, randomName, randomMessage, contactId);
    linkContactToLead(contactId, lead.id);
  };

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Communication" },
          { label: "WhatsApp" },
          { label: "Inbox" }
        ]}
        companyName="Everest Digital Solutions"
        mode="customer"
        userName="Rajesh Sharma"
      />

      <div className="flex-1 flex overflow-hidden bg-[#F5F5F5]">
        {/* Conversations List */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Search & Filter */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 mb-3">
              <button className="flex-1 px-3 py-1.5 bg-[#25D366] text-white rounded-lg text-xs font-medium hover:bg-[#128C7E] transition-colors">
                All ({contacts.length})
              </button>
              <button className="flex-1 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors">
                Unread ({contacts.filter(c => c.unreadCount > 0).length})
              </button>
              <button className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors flex items-center gap-1">
                <Filter size={14} />
              </button>
            </div>

            {/* Demo: Simulate Incoming */}
            <button
              onClick={handleSimulateIncoming}
              className="w-full px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles size={14} />
              Simulate Incoming Message
            </button>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {contacts
              .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery))
              .map((contact) => {
                const lead = findLeadByPhone(contact.phone);
                return (
                  <div
                    key={contact.id}
                    onClick={() => handleSelectContact(contact.id)}
                    className={`p-4 border-b border-gray-200 cursor-pointer transition-colors ${
                      selectedContact === contact.id ? "bg-green-50 border-l-4 border-l-[#25D366]" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center font-semibold shrink-0">
                          {contact.name.charAt(0).toUpperCase()}
                        </div>
                        {contact.status === "online" && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-[#0F1B2D] truncate">{contact.name}</span>
                          <span className="text-xs text-gray-400 shrink-0 ml-2">{contact.lastMessageTime}</span>
                        </div>
                        {lead && (
                          <div className="flex items-center gap-1 mb-1">
                            <UserPlus size={12} className="text-green-600" />
                            <span className="text-xs text-green-600 font-medium">Lead</span>
                            {lead.stage && (
                              <span className="text-xs text-gray-500">• {lead.stage}</span>
                            )}
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate">{contact.lastMessage}</p>
                          {contact.unreadCount > 0 && (
                            <span className="w-5 h-5 rounded-full bg-[#25D366] text-white text-xs flex items-center justify-center shrink-0 ml-2">
                              {contact.unreadCount}
                            </span>
                          )}
                        </div>
                        {contact.tags.length > 0 && (
                          <div className="flex items-center gap-1 mt-2">
                            {contact.tags.slice(0, 2).map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Chat Area */}
        {selectedContactData ? (
          <div className="flex-1 flex flex-col bg-[#E5DDD5]">
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center font-semibold">
                      {selectedContactData.name.charAt(0).toUpperCase()}
                    </div>
                    {selectedContactData.status === "online" && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-[#0F1B2D]">{selectedContactData.name}</div>
                    <div className="text-sm text-gray-600">
                      {selectedContactData.status === "online" ? "Online" : "Offline"} • {selectedContactData.phone}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Phone size={20} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Video size={20} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => setShowLeadProfile(!showLeadProfile)}
                    className={`p-2 rounded-lg transition-colors ${showLeadProfile ? "bg-green-100 text-[#25D366]" : "hover:bg-gray-100 text-gray-600"}`}
                  >
                    <Info size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {contactMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.direction === "incoming" ? "justify-start" : "justify-end"}`}
                >
                  <div className={`max-w-[70%]`}>
                    <div className={`rounded-lg p-3 ${
                      msg.direction === "incoming"
                        ? "bg-white shadow-sm"
                        : "bg-[#DCF8C6]"
                    }`}>
                      <p className="text-sm text-[#0F1B2D] whitespace-pre-wrap break-words">{msg.content}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1 px-1">
                      <span className="text-xs text-gray-500">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.direction === "outgoing" && (
                        <CheckCheck size={14} className={msg.status === "read" ? "text-[#25D366]" : "text-gray-400"} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Lead Conversion Banner */}
            {!currentLead && (
              <div className="bg-blue-50 border-t border-blue-200 px-6 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserPlus size={18} className="text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">This contact is not linked to a lead</span>
                  </div>
                  <button
                    onClick={handleConvertToLead}
                    className="px-4 py-1.5 bg-[#25D366] text-white rounded-lg text-sm font-medium hover:bg-[#128C7E] transition-colors"
                  >
                    Convert to Lead
                  </button>
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-end gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Paperclip size={20} className="text-gray-600" />
                </button>
                <div className="flex-1">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    rows={2}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Smile size={20} className="text-gray-600" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="p-3 bg-[#25D366] text-white rounded-lg hover:bg-[#128C7E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-[#E5DDD5]">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
                <Phone size={40} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No conversation selected</h3>
              <p className="text-sm text-gray-500">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}

        {/* Lead Profile Sidebar */}
        {showLeadProfile && currentLead && (
          <LeadProfileSidebar
            lead={currentLead}
            onClose={() => setShowLeadProfile(false)}
            onUpdateStage={(stage) => updateLeadStage(currentLead.id, stage)}
            onAddTag={(tag) => addLeadTag(currentLead.id, tag)}
            onRemoveTag={(tag) => removeLeadTag(currentLead.id, tag)}
            onUpdateField={(field, value) => updateLeadField(currentLead.id, field, value)}
            onUpdateDeal={(value, pipeline) => updateLeadDeal(currentLead.id, value, pipeline)}
            onStartAIQualification={handleStartAIQualification}
          />
        )}
      </div>

      {/* AI Qualification Modal */}
      {showAIQualification && currentLead && (
        <AIQualificationModal
          questions={aiQualificationQuestions}
          onSubmit={handleAIQualificationSubmit}
          onClose={() => setShowAIQualification(false)}
        />
      )}
    </>
  );
}
