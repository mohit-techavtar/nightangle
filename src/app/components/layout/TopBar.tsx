import React, { useState, useRef, useEffect } from "react";
import { Bell, Search, ChevronRight, ChevronDown, LogOut, User, Settings } from "lucide-react";
import { useNavigate } from "react-router";

interface TopBarProps {
  breadcrumbs: { label: string; path?: string }[];
  companyName?: string;
  userInitials?: string;
  userName?: string;
  userEmail?: string;
  mode?: "admin" | "customer";
}

export function TopBar({ breadcrumbs, companyName, userInitials = "SA", userName = "Super Admin", userEmail = "admin@omnicrm.com", mode = "admin" }: TopBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Clear any session data (in a real app, this would clear tokens, etc.)
    setDropdownOpen(false);
    // Redirect to landing page
    navigate("/");
  };

  const handleSettings = () => {
    setDropdownOpen(false);
    if (mode === "admin") {
      navigate("/admin/settings");
    } else {
      navigate("/tenant/settings/company");
    }
  };

  return (
    <header className="h-16 bg-white border-b border-[#E0E0E0] flex items-center justify-between px-6 max-md:px-4 max-md:pl-16 shrink-0">
      <div className="flex items-center gap-1.5 text-sm max-md:text-xs max-md:hidden">
        {breadcrumbs.map((b, i) => (
          <React.Fragment key={i}>
            {i > 0 && <ChevronRight size={14} className="text-[#9E9E9E]" />}
            <span className={i === breadcrumbs.length - 1 ? "text-[#212121] font-medium" : "text-[#616161]"}>
              {b.label}
            </span>
          </React.Fragment>
        ))}
      </div>
      
      {/* Mobile: Show last breadcrumb only */}
      <div className="md:hidden text-sm font-medium text-[#212121]">
        {breadcrumbs[breadcrumbs.length - 1]?.label}
      </div>
      
      <div className="flex items-center gap-4 max-md:gap-2">
        {companyName && <span className="text-sm font-medium text-[#212121] mr-2 max-md:hidden">{companyName}</span>}
        <button className="w-9 h-9 max-md:w-8 max-md:h-8 rounded-md border border-[#E0E0E0] bg-[#F5F5F5] flex items-center justify-center text-[#616161] hover:bg-[#EEEEEE] transition max-md:hidden">
          <Search size={16} />
        </button>
        <button className="w-9 h-9 max-md:w-8 max-md:h-8 rounded-md border border-[#E0E0E0] bg-[#F5F5F5] flex items-center justify-center text-[#616161] hover:bg-[#EEEEEE] transition relative">
          <Bell size={16} className="max-md:w-4 max-md:h-4" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C62828] text-white text-[10px] font-bold flex items-center justify-center">3</span>
        </button>
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-8 h-8 rounded-full bg-[#1565C0] text-white flex items-center justify-center text-sm font-semibold hover:bg-[#0D47A1] transition-colors"
          >
            {userInitials}
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 top-12 bg-white border border-[#E0E0E0] shadow-lg rounded-[8px] w-64 max-md:w-56 z-50 overflow-hidden">
              {/* User Info Section */}
              <div className="p-4 max-md:p-3 border-b border-[#E0E0E0]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 max-md:w-8 max-md:h-8 rounded-full bg-[#1565C0] text-white flex items-center justify-center text-sm font-semibold">
                    {userInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm max-md:text-[13px] font-semibold text-[#212121] truncate">{userName}</div>
                    <div className="text-xs max-md:text-[11px] text-[#616161] truncate">{userEmail}</div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button 
                  onClick={handleSettings}
                  className="w-full px-4 max-md:px-3 py-2.5 max-md:py-2 text-left text-sm max-md:text-[13px] text-[#212121] hover:bg-[#F5F5F5] transition-colors flex items-center gap-3"
                >
                  <Settings size={16} className="text-[#616161]" />
                  <span>Settings</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 text-left text-sm text-[#C62828] hover:bg-[#FFEBEE] transition-colors flex items-center gap-3"
                >
                  <LogOut size={16} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}