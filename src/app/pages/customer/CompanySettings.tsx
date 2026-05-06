import React, { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import { Info, Lock } from "lucide-react";

const tabs = ["Company Profile", "Business Hours", "Notifications", "Data & Privacy"];

export function CompanySettings() {
  const [tab, setTab] = useState("Company Profile");

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Settings" }, { label: "Company" }]} companyName="Everest Digital Solutions" mode="customer" userName="Rajesh Sharma" userEmail="rajesh@everestdigital.com" userInitials="RS" />
      <div className="flex-1 overflow-auto p-6">
        <div className="flex gap-6">
          {/* Vertical Tabs */}
          <div className="w-[200px] shrink-0">
            {tabs.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`w-full text-left px-4 py-2.5 text-sm rounded-md mb-1 transition-colors ${
                  tab === t ? "bg-[#E3F2FD] text-[#1565C0] font-medium border-l-3 border-[#1565C0]" : "text-[#616161] hover:bg-[#F5F5F5]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 max-w-3xl">
            {tab === "Company Profile" && (
              <div className="space-y-6">
                {/* Info Banner */}
                <div className="bg-[#E3F2FD] border border-[#90CAF9] border-l-4 border-l-[#1565C0] rounded-md p-3 flex items-start gap-2">
                  <Info size={16} className="text-[#1565C0] mt-0.5 shrink-0" />
                  <span className="text-sm text-[#1565C0]">Company details are managed by the platform administrator. Contact support to request changes.</span>
                </div>

                {/* Read-only */}
                <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
                  <h4 className="mb-4">Company Information</h4>
                  <div className="space-y-3">
                    {[
                      { label: "Company Legal Name", value: "Everest Digital Solutions Pvt. Ltd." },
                      { label: "Registered Address", value: "Durbar Marg, Ward 10, Kathmandu, Nepal" },
                      { label: "PAN Number", value: "123456789" },
                      { label: "Tenant Code", value: "TNT-00042" },
                    ].map(f => (
                      <div key={f.label}>
                        <label className="block mb-1 text-[#212121]">{f.label}</label>
                        <div className="flex items-center gap-2">
                          <input value={f.value} readOnly className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-[#FAFAFA] text-[#616161] cursor-not-allowed" />
                          <Lock size={14} className="text-[#9E9E9E] shrink-0" />
                        </div>
                      </div>
                    ))}
                    <button className="text-sm text-[#1565C0] hover:underline mt-1">Request Change →</button>
                  </div>
                </div>

                {/* Editable */}
                <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
                  <h4 className="mb-4">Contact Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block mb-1">Primary Contact Name</label>
                      <input defaultValue="Rajesh Sharma" className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm focus:border-[#1565C0] outline-none" />
                    </div>
                    <div>
                      <label className="block mb-1">Primary Contact Mobile</label>
                      <div className="flex">
                        <span className="h-10 px-3 border border-r-0 border-[#E0E0E0] rounded-l-md bg-[#F5F5F5] flex items-center text-sm text-[#616161]">+977</span>
                        <input defaultValue="9841234567" className="flex-1 h-10 border border-[#E0E0E0] rounded-r-md px-3 text-sm focus:border-[#1565C0] outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1">Primary Contact Email</label>
                      <input defaultValue="rajesh@everestdigital.com" className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm focus:border-[#1565C0] outline-none" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] text-sm">Discard</button>
                  <button className="h-10 px-5 rounded-md bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1]">Save Changes</button>
                </div>
              </div>
            )}

            {tab === "Business Hours" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4>Weekly Schedule</h4>
                    <button className="text-sm text-[#1565C0] hover:underline">Copy to All Weekdays</button>
                  </div>
                  <div className="space-y-3">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                      <div key={day} className="flex items-center gap-4">
                        <span className="w-24 text-sm text-[#212121]">{day}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={day !== "Saturday" && day !== "Sunday"} />
                          <div className="w-9 h-5 bg-[#E0E0E0] peer-checked:bg-[#2E7D32] rounded-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                        </label>
                        <input type="time" defaultValue="09:00" className="h-9 border border-[#E0E0E0] rounded-md px-2 text-sm w-28" />
                        <span className="text-[#9E9E9E]">to</span>
                        <input type="time" defaultValue="18:00" className="h-9 border border-[#E0E0E0] rounded-md px-2 text-sm w-28" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
                  <h4 className="mb-4">Default Call Timezone</h4>
                  <select className="w-full max-w-sm h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
                    <option>Asia/Kathmandu (UTC +5:45)</option>
                    <option>Asia/Kolkata (UTC +5:30)</option>
                  </select>
                  <p className="text-xs text-[#616161] mt-1">This affects all scheduled campaigns</p>
                </div>
                <div className="flex justify-end gap-3">
                  <button className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] text-sm">Discard</button>
                  <button className="h-10 px-5 rounded-md bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1]">Save Changes</button>
                </div>
              </div>
            )}

            {tab === "Notifications" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
                  <h4 className="mb-4">Channel Preferences</h4>
                  <div className="space-y-3">
                    {["Email Notifications", "WhatsApp Alerts", "In-App Notifications"].map(ch => (
                      <div key={ch} className="flex items-center justify-between py-2">
                        <span className="text-sm text-[#212121]">{ch}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-9 h-5 bg-[#E0E0E0] peer-checked:bg-[#2E7D32] rounded-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
                  <h4 className="mb-4">Alert Thresholds</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-1 text-sm text-[#212121]">AI Minutes Warning at</label>
                      <div className="flex items-center gap-2">
                        <input type="range" min="50" max="95" defaultValue="80" className="flex-1 accent-[#1565C0]" />
                        <span className="text-sm font-medium text-[#212121] w-10">80%</span>
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1 text-sm text-[#212121]">AI Minutes Critical at</label>
                      <div className="flex items-center gap-2">
                        <input type="range" min="80" max="100" defaultValue="95" className="flex-1 accent-[#C62828]" />
                        <span className="text-sm font-medium text-[#212121] w-10">95%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
                  <h4 className="mb-4">Digest Preference</h4>
                  <div className="space-y-2">
                    {["Real-time", "Daily Digest", "Weekly Digest"].map(opt => (
                      <label key={opt} className="flex items-center gap-2 text-sm text-[#212121] cursor-pointer">
                        <input type="radio" name="digest" defaultChecked={opt === "Real-time"} className="accent-[#1565C0]" />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] text-sm">Discard</button>
                  <button className="h-10 px-5 rounded-md bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1]">Save Changes</button>
                </div>
              </div>
            )}

            {tab === "Data & Privacy" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
                  <h4 className="mb-4">Data Retention Period</h4>
                  <div className="flex items-center gap-2 max-w-xs">
                    <input type="number" defaultValue="365" min={90} className="w-24 h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" />
                    <span className="text-sm text-[#616161]">days</span>
                  </div>
                  <p className="text-xs text-[#616161] mt-1">Minimum 90 days required by compliance policy</p>
                </div>
                <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
                  <h4 className="mb-4">Date Format</h4>
                  <select className="w-full max-w-xs h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
                    <option>YYYY-MM-DD (Gregorian)</option>
                    <option>DD/MM/YYYY (Gregorian)</option>
                    <option>Nepali BS</option>
                  </select>
                </div>
                <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
                  <h4 className="mb-4">Data Export</h4>
                  <p className="text-sm text-[#616161] mb-3">Download all your data for compliance or portability purposes.</p>
                  <button className="h-10 px-5 rounded-md bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1]">Export All My Data</button>
                </div>
                <div className="flex justify-end gap-3">
                  <button className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] text-sm">Discard</button>
                  <button className="h-10 px-5 rounded-md bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1]">Save Changes</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}