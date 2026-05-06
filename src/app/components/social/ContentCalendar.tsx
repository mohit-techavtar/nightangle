import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Clock, Send, Edit, Trash2, Plus } from "lucide-react";

interface ScheduledPost {
  id: string;
  platform: string;
  platformIcon: string;
  caption: string;
  scheduledDate: Date;
  status: "scheduled" | "published" | "failed";
  campaignTag?: string;
}

interface ContentCalendarProps {
  scheduledPosts: ScheduledPost[];
  onReschedule: (postId: string, newDate: Date) => void;
  onEdit: (postId: string) => void;
  onDelete: (postId: string) => void;
  onAddPost: () => void;
}

export function ContentCalendar({ scheduledPosts, onReschedule, onEdit, onDelete, onAddPost }: ContentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "list">("month");

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getPostsForDate = (day: number) => {
    return scheduledPosts.filter(post => {
      const postDate = new Date(post.scheduledDate);
      return postDate.getDate() === day &&
             postDate.getMonth() === month &&
             postDate.getFullYear() === year;
    });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day &&
           today.getMonth() === month &&
           today.getFullYear() === year;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-[#FFF8E1] text-[#F57F17] border-[#FFE082]";
      case "published": return "bg-[#E8F5E9] text-[#2E7D32] border-[#66BB6A]";
      case "failed": return "bg-[#FFEBEE] text-[#C62828] border-[#EF5350]";
      default: return "bg-[#F5F5F5] text-[#616161] border-[#E0E0E0]";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#E0E0E0] bg-gradient-to-r from-[#1565C0] to-[#0D47A1]">
        <div className="flex items-center justify-between mb-3 max-md:flex-col max-md:gap-3">
          <div className="flex items-center gap-3">
            <Calendar className="text-white" size={24} />
            <h3 className="text-lg font-semibold text-white">Content Calendar</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/20 rounded-md p-1">
              {["month", "week", "list"].map(v => (
                <button
                  key={v}
                  onClick={() => setView(v as any)}
                  className={`px-3 py-1 rounded text-xs font-medium capitalize transition-all ${
                    view === v
                      ? "bg-white text-[#1565C0]"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <button
              onClick={onAddPost}
              className="px-4 h-8 rounded-md bg-white text-[#1565C0] text-sm font-semibold hover:bg-white/90 flex items-center gap-2"
            >
              <Plus size={16} />
              Schedule Post
            </button>
          </div>
        </div>

        {/* Month Navigation */}
        {view === "month" && (
          <div className="flex items-center justify-between">
            <button
              onClick={previousMonth}
              className="w-8 h-8 rounded flex items-center justify-center text-white hover:bg-white/20"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="text-white font-semibold">
              {monthNames[month]} {year}
            </div>
            <button
              onClick={nextMonth}
              className="w-8 h-8 rounded flex items-center justify-center text-white hover:bg-white/20"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Calendar Grid */}
      {view === "month" && (
        <div className="p-4">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs font-semibold text-[#616161] py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells before first day */}
            {Array.from({ length: startingDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const posts = getPostsForDate(day);
              const today = isToday(day);

              return (
                <div
                  key={day}
                  className={`aspect-square border rounded-lg p-2 ${
                    today
                      ? "border-[#1565C0] bg-[#E3F2FD]"
                      : "border-[#E0E0E0] hover:bg-[#F5F5F5]"
                  } transition-all cursor-pointer`}
                >
                  <div className={`text-sm font-semibold mb-1 ${
                    today ? "text-[#1565C0]" : "text-[#212121]"
                  }`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {posts.slice(0, 2).map(post => (
                      <div
                        key={post.id}
                        className="text-[10px] px-1 py-0.5 rounded bg-[#1565C0] text-white truncate"
                        title={post.caption}
                      >
                        {post.platformIcon} {post.scheduledDate.getHours()}:{post.scheduledDate.getMinutes().toString().padStart(2, '0')}
                      </div>
                    ))}
                    {posts.length > 2 && (
                      <div className="text-[10px] text-[#616161]">
                        +{posts.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="p-4 space-y-3">
          {scheduledPosts.length === 0 ? (
            <div className="py-12 text-center text-[#9E9E9E]">
              <Calendar size={48} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm">No scheduled posts</p>
              <button
                onClick={onAddPost}
                className="mt-4 px-4 h-9 rounded-md bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1]"
              >
                Schedule Your First Post
              </button>
            </div>
          ) : (
            scheduledPosts
              .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
              .map(post => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg border border-[#E0E0E0] p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3 max-md:flex-col max-md:gap-2">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="text-2xl">{post.platformIcon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-[#212121] capitalize">
                            {post.platform}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(post.status)}`}>
                            {post.status}
                          </span>
                          {post.campaignTag && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#E3F2FD] text-[#1565C0]">
                              {post.campaignTag}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#616161] line-clamp-2">{post.caption}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(post.id)}
                        className="w-8 h-8 rounded flex items-center justify-center text-[#616161] hover:bg-[#F5F5F5]"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(post.id)}
                        className="w-8 h-8 rounded flex items-center justify-center text-[#C62828] hover:bg-[#FFEBEE]"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#616161] pt-3 border-t border-[#EEEEEE]">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{post.scheduledDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{post.scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {/* Stats Footer */}
      <div className="px-6 py-3 border-t border-[#E0E0E0] bg-[#F5F5F5]">
        <div className="flex items-center justify-between text-sm max-md:flex-col max-md:gap-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#FFF8E1] border border-[#FFE082]"></div>
              <span className="text-[#616161]">
                {scheduledPosts.filter(p => p.status === "scheduled").length} Scheduled
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#E8F5E9] border border-[#66BB6A]"></div>
              <span className="text-[#616161]">
                {scheduledPosts.filter(p => p.status === "published").length} Published
              </span>
            </div>
          </div>
          <span className="text-[#9E9E9E]">
            Total: {scheduledPosts.length} posts
          </span>
        </div>
      </div>
    </div>
  );
}
