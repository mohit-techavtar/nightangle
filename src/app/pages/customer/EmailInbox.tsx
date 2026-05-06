import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useEmail } from "../../hooks/useEmail";
import {
  Search,
  Filter,
  Mail,
  MailOpen,
  Archive,
  Trash2,
  Star,
  StarOff,
  Tag,
  Reply,
  ReplyAll,
  Forward,
  MoreVertical,
  X,
  Paperclip,
  Send,
  RefreshCw,
  Inbox as InboxIcon,
  AlertCircle,
  CheckCircle,
  User,
  Check,
  Circle,
  FileText,
  Folder,
  ChevronDown,
  Download,
  Image as ImageIcon,
  File,
  Clock,
  AlertTriangle,
  Info
} from "lucide-react";

export function EmailInbox() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { threads, updateThread, deleteThread, sendEmail } = useEmail();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [folderFilter, setFolderFilter] = useState<string>("inbox");
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(
    searchParams.get("thread")
  );
  const [selectedThreadIds, setSelectedThreadIds] = useState<Set<string>>(new Set());
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "sender" | "subject">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [replyType, setReplyType] = useState<"reply" | "replyAll" | "forward">("reply");

  useEffect(() => {
    const threadId = searchParams.get("thread");
    if (threadId) {
      setSelectedThreadId(threadId);
      const thread = threads.find(t => t.id === threadId);
      if (thread && thread.status === "unread") {
        updateThread(threadId, { status: "read" });
      }
    }
  }, [searchParams, threads, updateThread]);

  const folders = [
    { id: "inbox", label: "Inbox", icon: InboxIcon, count: threads.filter(t => t.folder === "inbox" && t.status === "unread").length },
    { id: "sent", label: "Sent", icon: Send, count: 0 },
    { id: "drafts", label: "Drafts", icon: FileText, count: threads.filter(t => t.folder === "drafts").length },
    { id: "starred", label: "Starred", icon: Star, count: threads.filter(t => t.isStarred).length },
    { id: "archived", label: "Archived", icon: Archive, count: threads.filter(t => t.status === "archived").length },
    { id: "spam", label: "Spam", icon: AlertCircle, count: threads.filter(t => t.folder === "spam").length },
    { id: "trash", label: "Trash", icon: Trash2, count: threads.filter(t => t.folder === "trash").length },
  ];

  const filteredThreads = threads
    .filter(thread => {
      const matchesSearch =
        thread.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.participants.from.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || thread.status === statusFilter;
      const matchesFolder =
        folderFilter === "starred" ? thread.isStarred :
        folderFilter === "inbox" ? (thread.folder === "inbox" || !thread.folder) :
        thread.folder === folderFilter || thread.status === folderFilter;
      return matchesSearch && matchesStatus && matchesFolder;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === "date") {
        comparison = new Date(a.lastMessageAt).getTime() - new Date(b.lastMessageAt).getTime();
      } else if (sortBy === "sender") {
        comparison = a.participants.from.localeCompare(b.participants.from);
      } else if (sortBy === "subject") {
        comparison = a.subject.localeCompare(b.subject);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const selectedThread = threads.find(t => t.id === selectedThreadId);
  const unreadCount = threads.filter(t => t.status === "unread").length;

  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId);
    setSearchParams({ thread: threadId });
    setShowReplyBox(false);
    const thread = threads.find(t => t.id === threadId);
    if (thread && thread.status === "unread") {
      updateThread(threadId, { status: "read" });
    }
  };

  const handleToggleSelect = (threadId: string) => {
    const newSelected = new Set(selectedThreadIds);
    if (newSelected.has(threadId)) {
      newSelected.delete(threadId);
    } else {
      newSelected.add(threadId);
    }
    setSelectedThreadIds(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const handleSelectAll = () => {
    if (selectedThreadIds.size === filteredThreads.length) {
      setSelectedThreadIds(new Set());
      setShowBulkActions(false);
    } else {
      setSelectedThreadIds(new Set(filteredThreads.map(t => t.id)));
      setShowBulkActions(true);
    }
  };

  const handleBulkAction = (action: "archive" | "delete" | "markRead" | "markUnread" | "star") => {
    selectedThreadIds.forEach(threadId => {
      switch (action) {
        case "archive":
          updateThread(threadId, { status: "archived" });
          break;
        case "delete":
          deleteThread(threadId);
          break;
        case "markRead":
          updateThread(threadId, { status: "read" });
          break;
        case "markUnread":
          updateThread(threadId, { status: "unread" });
          break;
        case "star":
          const thread = threads.find(t => t.id === threadId);
          if (thread) {
            updateThread(threadId, { isStarred: !thread.isStarred });
          }
          break;
      }
    });
    setSelectedThreadIds(new Set());
    setShowBulkActions(false);
  };

  const handleArchive = (threadId: string) => {
    updateThread(threadId, { status: "archived", folder: "archived" });
    setShowActionMenu(null);
    if (selectedThreadId === threadId) {
      setSelectedThreadId(null);
      setSearchParams({});
    }
  };

  const handleDelete = (threadId: string) => {
    updateThread(threadId, { folder: "trash" });
    setShowActionMenu(null);
    if (selectedThreadId === threadId) {
      setSelectedThreadId(null);
      setSearchParams({});
    }
  };

  const handleStarToggle = (threadId: string) => {
    const thread = threads.find(t => t.id === threadId);
    if (thread) {
      updateThread(threadId, { isStarred: !thread.isStarred });
    }
  };

  const handleSendReply = () => {
    if (selectedThread && replyContent.trim()) {
      const recipients = replyType === "replyAll"
        ? [...selectedThread.participants.to, selectedThread.participants.from]
        : [selectedThread.participants.from];

      sendEmail({
        threadId: selectedThread.id,
        to: recipients,
        subject: replyType === "forward"
          ? `Fwd: ${selectedThread.subject}`
          : `Re: ${selectedThread.subject}`,
        bodyHtml: `<p>${replyContent}</p>`,
        bodyText: replyContent
      });
      setReplyContent("");
      setShowReplyBox(false);
      updateThread(selectedThread.id, { status: "replied" });
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600 bg-green-50";
      case "negative":
        return "text-red-600 bg-red-50";
      case "neutral":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case "positive":
        return CheckCircle;
      case "negative":
        return AlertCircle;
      case "neutral":
        return Info;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "border-l-4 border-l-red-500";
      case "medium":
        return "border-l-4 border-l-yellow-500";
      case "low":
        return "border-l-4 border-l-green-500";
      default:
        return "";
    }
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext || '')) {
      return ImageIcon;
    }
    return File;
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Email</h1>
            <p className="text-sm text-gray-500 mt-1">
              {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => window.location.reload()}
              className="p-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Refresh</span>
            </button>
            <button
              onClick={() => navigate("/tenant/email/compose")}
              className="px-3 py-2 sm:px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Compose</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Date</option>
              <option value="sender">Sender</option>
              <option value="subject">Subject</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {showBulkActions && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedThreadIds.size} email{selectedThreadIds.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction("markRead")}
                className="px-3 py-1.5 text-sm bg-white border border-blue-300 text-blue-700 rounded hover:bg-blue-50"
              >
                Mark Read
              </button>
              <button
                onClick={() => handleBulkAction("archive")}
                className="px-3 py-1.5 text-sm bg-white border border-blue-300 text-blue-700 rounded hover:bg-blue-50"
              >
                Archive
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                className="px-3 py-1.5 text-sm bg-white border border-red-300 text-red-700 rounded hover:bg-red-50"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setSelectedThreadIds(new Set());
                  setShowBulkActions(false);
                }}
                className="p-1.5 hover:bg-blue-100 rounded"
              >
                <X className="w-4 h-4 text-blue-700" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Folders */}
        <div className="hidden lg:block w-56 bg-white border-r overflow-y-auto">
          <div className="p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Folders</h3>
            <nav className="space-y-1">
              {folders.map((folder) => {
                const Icon = folder.icon;
                return (
                  <button
                    key={folder.id}
                    onClick={() => setFolderFilter(folder.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      folderFilter === folder.id
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{folder.label}</span>
                    </div>
                    {folder.count > 0 && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        folderFilter === folder.id
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {folder.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Thread List */}
        <div className={`${selectedThread ? "hidden lg:block lg:w-96" : "flex-1"} border-r bg-white overflow-y-auto`}>
          {/* List Header */}
          <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center gap-3 z-10">
            <input
              type="checkbox"
              checked={selectedThreadIds.size === filteredThreads.length && filteredThreads.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">
              {filteredThreads.length} email{filteredThreads.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Thread Items */}
          <div className="divide-y">
            {filteredThreads.map(thread => {
              const SentimentIcon = getSentimentIcon(thread.sentiment);
              const isSelected = selectedThreadIds.has(thread.id);
              const isActive = selectedThreadId === thread.id;

              return (
                <div
                  key={thread.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    isActive ? "bg-blue-50" : ""
                  } ${thread.status === "unread" ? "bg-blue-25" : ""} ${getPriorityColor(thread.priority)}`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleToggleSelect(thread.id);
                      }}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStarToggle(thread.id);
                      }}
                      className="mt-1"
                    >
                      {thread.isStarred ? (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      ) : (
                        <StarOff className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                    <div
                      className="flex-1 min-w-0"
                      onClick={() => handleSelectThread(thread.id)}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <h3 className={`font-medium truncate ${
                            thread.status === "unread" ? "font-semibold text-gray-900" : "text-gray-700"
                          }`}>
                            {thread.participants.from}
                          </h3>
                          {thread.status === "unread" && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {thread.hasAttachments && (
                            <Paperclip className="w-3.5 h-3.5 text-gray-400" />
                          )}
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {new Date(thread.lastMessageAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className={`text-sm truncate mb-1 ${
                        thread.status === "unread" ? "font-medium text-gray-900" : "text-gray-600"
                      }`}>
                        {thread.subject}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {thread.messages[thread.messages.length - 1]?.bodyText.substring(0, 100)}...
                      </p>
                      {(thread.tags.length > 0 || SentimentIcon) && (
                        <div className="flex items-center gap-2 mt-2">
                          {thread.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                          {SentimentIcon && (
                            <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded ${getSentimentColor(thread.sentiment)}`}>
                              <SentimentIcon className="w-3 h-3" />
                              <span className="capitalize">{thread.sentiment}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredThreads.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <InboxIcon className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-1">No emails found</p>
              <p className="text-sm">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Your inbox is empty"}
              </p>
            </div>
          )}
        </div>

        {/* Thread Detail */}
        {selectedThread ? (
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            {/* Thread Header */}
            <div className="border-b p-4 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => {
                      setSelectedThreadId(null);
                      setSearchParams({});
                    }}
                    className="lg:hidden mb-3 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    ← Back to list
                  </button>
                  <h2 className="text-lg sm:text-xl font-semibold mb-2 break-words">{selectedThread.subject}</h2>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{selectedThread.participants.from}</span>
                    </div>
                    <span className="hidden sm:inline">•</span>
                    <span className="whitespace-nowrap">{selectedThread.messages.length} message{selectedThread.messages.length !== 1 ? 's' : ''}</span>
                    {selectedThread.leadId && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <button
                          onClick={() => navigate(`/tenant/leads/${selectedThread.leadId}`)}
                          className="text-blue-600 hover:underline whitespace-nowrap"
                        >
                          View Lead
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 ml-2 flex-shrink-0 relative">
                  <button
                    onClick={() => {
                      setReplyType("reply");
                      setShowReplyBox(true);
                    }}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Reply"
                  >
                    <Reply className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleStarToggle(selectedThread.id)}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Star"
                  >
                    {selectedThread.isStarred ? (
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-yellow-500" />
                    ) : (
                      <StarOff className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    )}
                  </button>
                  <button
                    onClick={() => handleArchive(selectedThread.id)}
                    className="hidden sm:block p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Archive"
                  >
                    <Archive className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setShowActionMenu(showActionMenu === selectedThread.id ? null : selectedThread.id)}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </button>

                  {showActionMenu === selectedThread.id && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                      <button
                        onClick={() => {
                          setReplyType("replyAll");
                          setShowReplyBox(true);
                          setShowActionMenu(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <ReplyAll className="w-4 h-4" />
                        Reply All
                      </button>
                      <button
                        onClick={() => {
                          setReplyType("forward");
                          setShowReplyBox(true);
                          setShowActionMenu(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Forward className="w-4 h-4" />
                        Forward
                      </button>
                      <div className="border-t my-1"></div>
                      <button
                        onClick={() => {
                          handleArchive(selectedThread.id);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Archive className="w-4 h-4" />
                        Archive
                      </button>
                      <button
                        onClick={() => handleDelete(selectedThread.id)}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {selectedThread.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {selectedThread.tags.map(tag => (
                    <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
              {selectedThread.messages.map((message, index) => (
                <div key={message.id} className="border rounded-lg p-4 sm:p-5 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-medium text-gray-900">{message.from}</span>
                        {message.aiOwnership && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                            AI-{message.aiOwnership}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 break-words">
                        to: {message.to.join(", ")}
                      </div>
                      {message.cc && message.cc.length > 0 && (
                        <div className="text-sm text-gray-600 break-words">
                          cc: {message.cc.join(", ")}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 ml-2 flex-shrink-0">
                      {new Date(message.sentAt).toLocaleString()}
                    </span>
                  </div>

                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mb-4 space-y-2">
                      {message.attachments.map((attachment, i) => {
                        const FileIcon = getFileIcon(attachment.filename);
                        return (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <FileIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">{attachment.filename}</div>
                                <div className="text-xs text-gray-500">{(attachment.size / 1024).toFixed(1)} KB</div>
                              </div>
                            </div>
                            <button className="p-2 hover:bg-gray-200 rounded transition-colors ml-2">
                              <Download className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: message.bodyHtml }}
                  />

                  {message.trackingData && (
                    <div className="mt-4 pt-4 border-t flex flex-wrap gap-3 sm:gap-4 text-xs text-gray-500">
                      {message.trackingData.opened && (
                        <div className="flex items-center gap-1">
                          <MailOpen className="w-3 h-3" />
                          Opened {new Date(message.trackingData.openedAt!).toLocaleString()}
                        </div>
                      )}
                      {message.trackingData.clicked && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Link clicked
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Reply Box */}
            {showReplyBox && (
              <div className="border-t p-4 sm:p-6 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">
                    {replyType === "reply" ? "Reply" : replyType === "replyAll" ? "Reply All" : "Forward"}
                  </h3>
                  <button
                    onClick={() => setShowReplyBox(false)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 resize-none"
                  placeholder="Type your message..."
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowReplyBox(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendReply}
                    disabled={!replyContent.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-50">
            <div className="text-center">
              <MailOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-600 mb-1">No email selected</p>
              <p className="text-sm text-gray-500">Select an email from the list to view it here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
