import { useNavigate } from "react-router";
import { useEmail } from "../../hooks/useEmail";
import {
  Mail,
  Send,
  Inbox,
  FileText,
  MousePointer,
  MessageSquare,
  Plus,
  ArrowUpRight,
  BarChart3,
  Settings
} from "lucide-react";

export function EmailDashboard() {
  const navigate = useNavigate();
  const { getStats, threads, campaigns } = useEmail();
  const stats = getStats();

  const recentThreads = threads.slice(0, 5);
  const activeCampaigns = campaigns.filter(c => c.status === "active").slice(0, 3);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Email CRM</h1>
            <p className="text-sm text-gray-500 mt-1">Manage email communication and campaigns</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/tenant/email/inbox")}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Inbox className="w-4 h-4" />
              Inbox
            </button>
            <button
              onClick={() => navigate("/tenant/email/compose")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Compose
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                {stats.unreadThreads} new
              </span>
            </div>
            <div className="text-2xl font-bold">{stats.totalThreads}</div>
            <div className="text-sm text-gray-500 mt-1">Total Threads</div>
          </div>

          <div className="bg-white rounded-lg border p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <Send className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {stats.openRate}%
              </span>
            </div>
            <div className="text-2xl font-bold">{stats.totalSent.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-1">Emails Sent</div>
          </div>

          <div className="bg-white rounded-lg border p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <MousePointer className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
                {stats.clickRate}%
              </span>
            </div>
            <div className="text-2xl font-bold">{stats.totalClicked.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-1">Clicks</div>
          </div>

          <div className="bg-white rounded-lg border p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
                {stats.replyRate}%
              </span>
            </div>
            <div className="text-2xl font-bold">{stats.totalReplied.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-1">Replies</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg border">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Recent Threads</h2>
              <button
                onClick={() => navigate("/tenant/email/inbox")}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                View All
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
            <div className="divide-y">
              {recentThreads.map(thread => (
                <div
                  key={thread.id}
                  onClick={() => navigate(`/tenant/email/inbox?thread=${thread.id}`)}
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{thread.subject}</h3>
                        {thread.status === "unread" && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{thread.participants.from}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(thread.lastMessageAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {thread.tags.map(tag => (
                      <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg border">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold">Quick Access</h2>
              </div>
              <div className="p-4 space-y-2">
                <button
                  onClick={() => navigate("/tenant/email/templates")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-left"
                >
                  <FileText className="w-5 h-5 text-gray-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Templates</div>
                    <div className="text-xs text-gray-500">{stats.totalTemplates} templates</div>
                  </div>
                </button>

                <button
                  onClick={() => navigate("/tenant/email/campaigns")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-left"
                >
                  <Send className="w-5 h-5 text-gray-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Campaigns</div>
                    <div className="text-xs text-gray-500">{stats.activeCampaigns} active</div>
                  </div>
                </button>

                <button
                  onClick={() => navigate("/tenant/email/analytics")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-left"
                >
                  <BarChart3 className="w-5 h-5 text-gray-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Analytics</div>
                    <div className="text-xs text-gray-500">View reports</div>
                  </div>
                </button>

                <button
                  onClick={() => navigate("/tenant/email/settings")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-left"
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Settings</div>
                    <div className="text-xs text-gray-500">Configure email</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
