import React, { useState } from "react";
import { Save, Wrench, Database, HardDrive, Activity, RefreshCw, AlertCircle } from "lucide-react";

export function SystemMaintenance() {
  const [systemHealth, setSystemHealth] = useState({
    database: "healthy",
    cache: "healthy",
    storage: "warning",
    api: "healthy",
  });

  return (
    <div className="p-6">
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-[#212121] mb-1">System Maintenance</h2>
            <p className="text-sm text-[#616161]">Monitor system health, manage backups, and perform maintenance tasks</p>
          </div>
          <button className="h-10 px-5 rounded-md bg-[#1565C0] text-white hover:bg-[#0D47A1] flex items-center gap-2">
            <RefreshCw size={16} /> Refresh Status
          </button>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-lg border border-[#E0E0E0] p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={18} className="text-[#1565C0]" />
            <h3 className="font-semibold text-[#212121]">System Health</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "database", label: "Database", icon: Database },
              { key: "cache", label: "Cache Server", icon: HardDrive },
              { key: "storage", label: "Storage", icon: HardDrive },
              { key: "api", label: "API Services", icon: Activity },
            ].map((service) => {
              const status = systemHealth[service.key];
              const Icon = service.icon;
              
              return (
                <div key={service.key} className="border border-[#E0E0E0] rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon size={16} className="text-[#616161]" />
                      <span className="text-sm font-medium text-[#212121]">{service.label}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      status === "healthy" 
                        ? "bg-[#E8F5E9] text-[#2E7D32]" 
                        : status === "warning"
                        ? "bg-[#FFF8E1] text-[#F57F17]"
                        : "bg-[#FFEBEE] text-[#C62828]"
                    }`}>
                      {status === "healthy" ? "Healthy" : status === "warning" ? "Warning" : "Error"}
                    </span>
                  </div>
                  <div className="text-xs text-[#616161]">
                    {status === "healthy" && "All systems operational"}
                    {status === "warning" && "High usage detected"}
                    {status === "error" && "Service unavailable"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Database Management */}
        <div className="bg-white rounded-lg border border-[#E0E0E0] p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Database size={18} className="text-[#1565C0]" />
            <h3 className="font-semibold text-[#212121]">Database Management</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-[#E0E0E0] rounded-md">
              <div>
                <span className="text-sm font-medium text-[#212121] block mb-0.5">Optimize Database</span>
                <span className="text-xs text-[#616161]">Last optimized: 2 days ago</span>
              </div>
              <button className="h-9 px-4 rounded-md border border-[#1565C0] text-[#1565C0] hover:bg-[#E3F2FD] text-sm">
                Optimize Now
              </button>
            </div>

            <div className="flex items-center justify-between p-3 border border-[#E0E0E0] rounded-md">
              <div>
                <span className="text-sm font-medium text-[#212121] block mb-0.5">Clear Old Records</span>
                <span className="text-xs text-[#616161]">Remove records older than retention policy</span>
              </div>
              <button className="h-9 px-4 rounded-md border border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5] text-sm">
                Clean Up
              </button>
            </div>

            <div className="flex items-center justify-between p-3 border border-[#E0E0E0] rounded-md">
              <div>
                <span className="text-sm font-medium text-[#212121] block mb-0.5">Database Backup</span>
                <span className="text-xs text-[#616161]">Last backup: 6 hours ago</span>
              </div>
              <button className="h-9 px-4 rounded-md border border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5] text-sm">
                Backup Now
              </button>
            </div>
          </div>
        </div>

        {/* Cache Management */}
        <div className="bg-white rounded-lg border border-[#E0E0E0] p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <HardDrive size={18} className="text-[#1565C0]" />
            <h3 className="font-semibold text-[#212121]">Cache Management</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5] text-sm">
              Clear Application Cache
            </button>
            <button className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5] text-sm">
              Clear API Cache
            </button>
            <button className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5] text-sm">
              Clear Template Cache
            </button>
            <button className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5] text-sm">
              Clear All Caches
            </button>
          </div>

          <div className="mt-3 bg-[#FFF8E1] rounded-md p-3 flex items-start gap-2">
            <AlertCircle size={16} className="text-[#F57F17] mt-0.5 flex-shrink-0" />
            <p className="text-xs text-[#F57F17]">
              Clearing cache may temporarily slow down the application while data is regenerated.
            </p>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Wrench size={18} className="text-[#1565C0]" />
            <h3 className="font-semibold text-[#212121]">System Information</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-[#616161] block mb-1">Platform Version</span>
              <span className="text-sm font-semibold text-[#212121]">v2.4.1</span>
            </div>
            <div>
              <span className="text-xs text-[#616161] block mb-1">Database Version</span>
              <span className="text-sm font-semibold text-[#212121]">PostgreSQL 15.2</span>
            </div>
            <div>
              <span className="text-xs text-[#616161] block mb-1">Server Uptime</span>
              <span className="text-sm font-semibold text-[#212121]">15 days, 8 hours</span>
            </div>
            <div>
              <span className="text-xs text-[#616161] block mb-1">Storage Used</span>
              <span className="text-sm font-semibold text-[#212121]">456 GB / 1 TB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
