import React, { useState } from "react";
import { Save, Palette, Upload, Eye } from "lucide-react";

export function AppearanceBranding() {
  const [branding, setBranding] = useState({
    logoUrl: "",
    faviconUrl: "",
    primaryColor: "#1565C0",
    secondaryColor: "#0F1B2D",
    accentColor: "#2E7D32",
    customCSS: "",
    customDomain: "omnicrm.example.com",
    enableWhiteLabel: false,
  });

  return (
    <div className="p-6">
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-[#212121] mb-1">Appearance & Branding</h2>
            <p className="text-sm text-[#616161]">Customize platform appearance and white-label settings</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-[#FFF8E1] text-[#F57F17] text-xs font-semibold">BETA FEATURE</span>
          </div>
          <button className="h-10 px-5 rounded-md bg-[#1565C0] text-white hover:bg-[#0D47A1] flex items-center gap-2">
            <Save size={16} /> Save Changes
          </button>
        </div>

        {/* White Label */}
        <div className="bg-white rounded-lg border border-[#E0E0E0] p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Palette size={18} className="text-[#1565C0]" />
            <h3 className="font-semibold text-[#212121]">White Label Settings</h3>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 border border-[#E0E0E0] rounded-md">
              <div>
                <span className="text-sm font-medium text-[#212121] block mb-0.5">Enable White Labeling</span>
                <span className="text-xs text-[#616161]">Remove OmniCRM branding from tenant interfaces</span>
              </div>
              <input
                type="checkbox"
                checked={branding.enableWhiteLabel}
                onChange={(e) => setBranding({ ...branding, enableWhiteLabel: e.target.checked })}
                className="rounded border-[#E0E0E0] text-[#1565C0]"
              />
            </label>

            <div>
              <label className="block text-sm font-medium text-[#212121] mb-1">Platform Logo</label>
              <div className="flex items-center gap-3">
                <div className="w-32 h-16 border-2 border-dashed border-[#E0E0E0] rounded-md flex items-center justify-center bg-[#F5F5F5]">
                  {branding.logoUrl ? (
                    <img src={branding.logoUrl} alt="Logo" className="max-w-full max-h-full" />
                  ) : (
                    <span className="text-xs text-[#9E9E9E]">Logo</span>
                  )}
                </div>
                <button className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5] text-sm flex items-center gap-2">
                  <Upload size={14} /> Upload Logo
                </button>
              </div>
              <p className="text-xs text-[#616161] mt-1">Recommended: 200x50px, PNG with transparent background</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#212121] mb-1">Favicon</label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 border-2 border-dashed border-[#E0E0E0] rounded-md flex items-center justify-center bg-[#F5F5F5]">
                  {branding.faviconUrl ? (
                    <img src={branding.faviconUrl} alt="Favicon" className="max-w-full max-h-full" />
                  ) : (
                    <span className="text-xs text-[#9E9E9E]">ICO</span>
                  )}
                </div>
                <button className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5] text-sm flex items-center gap-2">
                  <Upload size={14} /> Upload Favicon
                </button>
              </div>
              <p className="text-xs text-[#616161] mt-1">32x32px, .ico or .png format</p>
            </div>
          </div>
        </div>

        {/* Color Scheme */}
        <div className="bg-white rounded-lg border border-[#E0E0E0] p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Palette size={18} className="text-[#1565C0]" />
            <h3 className="font-semibold text-[#212121]">Color Scheme</h3>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-2">Primary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={branding.primaryColor}
                  onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                  className="w-12 h-10 border border-[#E0E0E0] rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={branding.primaryColor}
                  onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                  className="flex-1 h-10 border border-[#E0E0E0] rounded-md px-3 text-sm font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#212121] mb-2">Secondary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={branding.secondaryColor}
                  onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                  className="w-12 h-10 border border-[#E0E0E0] rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={branding.secondaryColor}
                  onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                  className="flex-1 h-10 border border-[#E0E0E0] rounded-md px-3 text-sm font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#212121] mb-2">Accent Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={branding.accentColor}
                  onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                  className="w-12 h-10 border border-[#E0E0E0] rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={branding.accentColor}
                  onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                  className="flex-1 h-10 border border-[#E0E0E0] rounded-md px-3 text-sm font-mono"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button className="h-9 px-4 rounded-md border border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5] text-sm">
              Reset to Default
            </button>
            <button className="h-9 px-4 rounded-md border border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5] text-sm flex items-center gap-2">
              <Eye size={14} /> Preview Changes
            </button>
          </div>
        </div>

        {/* Custom Domain */}
        <div className="bg-white rounded-lg border border-[#E0E0E0] p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Palette size={18} className="text-[#1565C0]" />
            <h3 className="font-semibold text-[#212121]">Custom Domain</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#212121] mb-1">Domain Name</label>
            <input
              type="text"
              value={branding.customDomain}
              onChange={(e) => setBranding({ ...branding, customDomain: e.target.value })}
              className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm"
              placeholder="your-domain.com"
            />
            <p className="text-xs text-[#616161] mt-1">
              Configure your DNS to point to our servers. <a href="#" className="text-[#1565C0] hover:underline">View setup guide</a>
            </p>
          </div>

          <div className="mt-3 bg-[#E3F2FD] rounded-md p-3 text-sm text-[#1565C0]">
            <strong>Note:</strong> Custom domain requires Enterprise plan or above.
          </div>
        </div>

        {/* Custom CSS */}
        <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Palette size={18} className="text-[#1565C0]" />
            <h3 className="font-semibold text-[#212121]">Custom CSS</h3>
            <span className="px-2 py-0.5 rounded-md bg-[#FFEBEE] text-[#C62828] text-xs font-semibold">ADVANCED</span>
          </div>

          <div>
            <textarea
              value={branding.customCSS}
              onChange={(e) => setBranding({ ...branding, customCSS: e.target.value })}
              className="w-full h-48 border border-[#E0E0E0] rounded-md p-3 text-sm font-mono resize-none"
              placeholder="/* Add custom CSS here */&#10;.custom-class {&#10;  color: #1565C0;&#10;}"
            />
            <p className="text-xs text-[#616161] mt-1">
              Add custom CSS to override default styles. Use with caution.
            </p>
          </div>

          <div className="mt-3 bg-[#FFF8E1] rounded-md p-3 text-sm text-[#F57F17]">
            <strong>Warning:</strong> Custom CSS may break with platform updates. Test thoroughly before deploying.
          </div>
        </div>
      </div>
    </div>
  );
}
