import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Clock,
  ArrowRight,
  AlertCircle,
  PauseCircle,
  Brain,
  Info,
} from "lucide-react";

interface TimeBlock {
  start: string;
  end: string;
}

interface DaySchedule {
  day: string;
  enabled: boolean;
  blocks: TimeBlock[];
}

const initialSchedule: DaySchedule[] = [
  { day: "Monday", enabled: true, blocks: [{ start: "10:00", end: "13:00" }, { start: "14:00", end: "18:00" }] },
  { day: "Tuesday", enabled: true, blocks: [{ start: "10:00", end: "13:00" }, { start: "14:00", end: "18:00" }] },
  { day: "Wednesday", enabled: true, blocks: [{ start: "10:00", end: "13:00" }, { start: "14:00", end: "18:00" }] },
  { day: "Thursday", enabled: true, blocks: [{ start: "10:00", end: "13:00" }, { start: "14:00", end: "18:00" }] },
  { day: "Friday", enabled: true, blocks: [{ start: "10:00", end: "13:00" }, { start: "14:00", end: "18:00" }] },
  { day: "Saturday", enabled: true, blocks: [{ start: "10:00", end: "13:00" }, { start: "14:00", end: "18:00" }] },
  { day: "Sunday", enabled: false, blocks: [] },
];

// Heatmap data - connection rates by day and hour
const heatmapData = [
  { day: "Mon", hours: [45, 52, 58, 62, 68, 71, 73, 69, 65, 58, 52] }, // 9AM-7PM
  { day: "Tue", hours: [48, 55, 61, 65, 70, 74, 76, 72, 67, 61, 54] },
  { day: "Wed", hours: [47, 54, 60, 64, 69, 73, 75, 71, 66, 59, 53] },
  { day: "Thu", hours: [49, 56, 62, 66, 71, 75, 77, 73, 68, 62, 55] },
  { day: "Fri", hours: [44, 51, 57, 61, 66, 69, 71, 67, 63, 56, 50] },
  { day: "Sat", hours: [38, 43, 48, 52, 56, 58, 60, 56, 52, 47, 42] },
];

export function CallSchedulingRetry() {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState<DaySchedule[]>(initialSchedule);
  const [timezoneHandling, setTimezoneHandling] = useState("lead-timezone");
  
  // Retry Logic
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [waitBetweenRetries, setWaitBetweenRetries] = useState(4);
  const [retryNoAnswer, setRetryNoAnswer] = useState(true);
  const [retryBusy, setRetryBusy] = useState(true);
  const [retryNetworkError, setRetryNetworkError] = useState(true);
  const [retryVoicemail, setRetryVoicemail] = useState(false);
  const [increaseWaitTime, setIncreaseWaitTime] = useState(true);
  const [tryDifferentTime, setTryDifferentTime] = useState(true);
  const [finalDisposition, setFinalDisposition] = useState("unreachable");

  // Queue Management
  const [concurrentCalls, setConcurrentCalls] = useState(15);
  const [callPacing, setCallPacing] = useState("progressive");
  const [callsPerMinute, setCallsPerMinute] = useState(8);
  const [queuePriority, setQueuePriority] = useState("fifo");

  // Smart Scheduling
  const [bestTimeToCall, setBestTimeToCall] = useState(true);
  const [autoOptimize, setAutoOptimize] = useState(true);

  const getRetryWaitTime = (attempt: number) => {
    if (!increaseWaitTime) return waitBetweenRetries;
    return waitBetweenRetries * Math.pow(2, attempt - 1);
  };

  const getHeatmapColor = (value: number) => {
    if (value >= 70) return "bg-green-700";
    if (value >= 60) return "bg-green-600";
    if (value >= 50) return "bg-green-500";
    if (value >= 40) return "bg-green-400";
    return "bg-green-300";
  };

  const hours = ["9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM"];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/tenant/ai-calling")}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Call Scheduling & Retry Logic
              </h1>
              <p className="text-sm text-gray-600 mt-1">Control when and how calls are made</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* SECTION 1 - Schedule Configuration */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-5">Schedule Configuration</h3>

            {/* Week Grid */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Calling Window
              </label>

              {/* Time Header */}
              <div className="flex gap-2 mb-2 ml-24">
                <div className="text-xs text-gray-500 w-12 text-center">9AM</div>
                <div className="text-xs text-gray-500 w-12 text-center">10AM</div>
                <div className="text-xs text-gray-500 w-12 text-center">11AM</div>
                <div className="text-xs text-gray-500 w-12 text-center">12PM</div>
                <div className="text-xs text-gray-500 w-12 text-center">1PM</div>
                <div className="text-xs text-gray-500 w-12 text-center">2PM</div>
                <div className="text-xs text-gray-500 w-12 text-center">3PM</div>
                <div className="text-xs text-gray-500 w-12 text-center">4PM</div>
                <div className="text-xs text-gray-500 w-12 text-center">5PM</div>
                <div className="text-xs text-gray-500 w-12 text-center">6PM</div>
                <div className="text-xs text-gray-500 w-12 text-center">7PM</div>
              </div>

              {/* Day Rows */}
              <div className="space-y-2">
                {schedule.map((daySchedule, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-20 text-sm font-medium text-gray-700">
                      {daySchedule.day}
                    </div>

                    {/* Time blocks grid */}
                    <div className="flex-1 flex gap-0.5 bg-gray-100 rounded-lg p-1">
                      {[9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((hour) => {
                        const isEnabled = daySchedule.enabled;
                        const isActive =
                          isEnabled &&
                          daySchedule.blocks.some((block) => {
                            const blockStart = parseInt(block.start.split(":")[0]);
                            const blockEnd = parseInt(block.end.split(":")[0]);
                            return hour >= blockStart && hour < blockEnd;
                          });
                        const isLunchBreak = hour === 13; // 1PM

                        return (
                          <div
                            key={hour}
                            className={`flex-1 h-10 rounded cursor-pointer transition-colors ${
                              !isEnabled
                                ? "bg-gray-200"
                                : isLunchBreak && isEnabled
                                ? "bg-gray-300 border border-gray-400"
                                : isActive
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-white hover:bg-green-200"
                            }`}
                            title={
                              !isEnabled
                                ? "Day disabled"
                                : isLunchBreak
                                ? "Lunch break (1-2 PM)"
                                : isActive
                                ? "Active calling hours"
                                : "Click to enable"
                            }
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Active calling hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300 border border-gray-400 rounded"></div>
                  <span>Lunch break (blocked)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <span>Disabled</span>
                </div>
              </div>
            </div>

            {/* Timezone Handling */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Timezone Handling
              </label>
              <div className="space-y-2">
                <label className="flex items-start gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="timezone"
                    value="lead-timezone"
                    checked={timezoneHandling === "lead-timezone"}
                    onChange={(e) => setTimezoneHandling(e.target.value)}
                    className="mt-0.5 w-4 h-4 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Use lead's timezone</div>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Automatically detect and respect each lead's local timezone
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="timezone"
                    value="fixed-ist"
                    checked={timezoneHandling === "fixed-ist"}
                    onChange={(e) => setTimezoneHandling(e.target.value)}
                    className="mt-0.5 w-4 h-4 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Use fixed timezone: IST</div>
                    <p className="text-xs text-gray-600 mt-0.5">
                      All calls follow Indian Standard Time regardless of lead location
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="timezone"
                    value="campaign-timezone"
                    checked={timezoneHandling === "campaign-timezone"}
                    onChange={(e) => setTimezoneHandling(e.target.value)}
                    className="mt-0.5 w-4 h-4 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      Use campaign timezone
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Each campaign can specify its own timezone setting
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* SECTION 2 - Retry Logic */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-5">Retry Logic</h3>

            {/* Visual Retry Flow Diagram */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 overflow-x-auto">
              <div className="flex items-center gap-3 min-w-max">
                <div className="text-center">
                  <div className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium text-sm mb-1">
                    Call 1
                  </div>
                </div>

                <ArrowRight className="w-5 h-5 text-gray-400" />

                <div className="text-center">
                  <div className="px-3 py-2 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium mb-1">
                    No Answer
                  </div>
                </div>

                <ArrowRight className="w-5 h-5 text-gray-400" />

                <div className="text-center">
                  <div className="px-3 py-1.5 bg-gray-200 text-gray-600 rounded text-xs mb-1">
                    Wait {getRetryWaitTime(1)}h
                  </div>
                </div>

                <ArrowRight className="w-5 h-5 text-gray-400" />

                <div className="text-center">
                  <div className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium text-sm mb-1">
                    Call 2
                  </div>
                </div>

                <ArrowRight className="w-5 h-5 text-gray-400" />

                <div className="text-center">
                  <div className="px-3 py-2 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium mb-1">
                    Busy
                  </div>
                </div>

                <ArrowRight className="w-5 h-5 text-gray-400" />

                <div className="text-center">
                  <div className="px-3 py-1.5 bg-gray-200 text-gray-600 rounded text-xs mb-1">
                    Wait {getRetryWaitTime(2)}h
                  </div>
                </div>

                <ArrowRight className="w-5 h-5 text-gray-400" />

                <div className="text-center">
                  <div className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium text-sm mb-1">
                    Call 3
                  </div>
                </div>

                <ArrowRight className="w-5 h-5 text-gray-400" />

                <div className="text-center">
                  <div className="px-3 py-2 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium mb-1">
                    No Answer
                  </div>
                </div>

                <ArrowRight className="w-5 h-5 text-gray-400" />

                <div className="text-center">
                  <div className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium text-sm">
                    Unreachable
                  </div>
                </div>
              </div>
            </div>

            {/* Retry Settings */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Attempts
                  </label>
                  <input
                    type="number"
                    value={maxAttempts}
                    onChange={(e) => setMaxAttempts(Number(e.target.value))}
                    min="1"
                    max="10"
                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wait Between Retries
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={waitBetweenRetries}
                      onChange={(e) => setWaitBetweenRetries(Number(e.target.value))}
                      min="1"
                      max="48"
                      className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                    <span className="text-sm text-gray-600">hours</span>
                  </div>
                </div>
              </div>

              {/* Retry On */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Retry On</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={retryNoAnswer}
                      onChange={(e) => setRetryNoAnswer(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">No Answer</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={retryBusy}
                      onChange={(e) => setRetryBusy(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Busy</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={retryNetworkError}
                      onChange={(e) => setRetryNetworkError(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Network Error</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={retryVoicemail}
                      onChange={(e) => setRetryVoicemail(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Voicemail</span>
                  </label>
                </div>
              </div>

              {/* Increase Wait Time */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      Increase wait time for each retry
                    </div>
                    <p className="text-xs text-gray-600">
                      Double the wait time between each subsequent retry attempt
                    </p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={increaseWaitTime}
                      onChange={(e) => setIncreaseWaitTime(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                    />
                    <span
                      className={`text-sm font-medium ${
                        increaseWaitTime ? "text-green-700" : "text-gray-500"
                      }`}
                    >
                      {increaseWaitTime ? "ON" : "OFF"}
                    </span>
                  </label>
                </div>

                {increaseWaitTime && (
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Retry 1:</span>
                      <span className="font-mono font-medium text-gray-900">
                        {getRetryWaitTime(1)}h
                      </span>
                    </div>
                    <span className="text-gray-400">|</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Retry 2:</span>
                      <span className="font-mono font-medium text-gray-900">
                        {getRetryWaitTime(2)}h
                      </span>
                    </div>
                    <span className="text-gray-400">|</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Retry 3:</span>
                      <span className="font-mono font-medium text-gray-900">
                        {getRetryWaitTime(3)}h
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Try Different Time */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    Try different time of day for each retry
                  </div>
                  <p className="text-xs text-gray-600">
                    Spread retry attempts across morning, afternoon, and evening
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tryDifferentTime}
                    onChange={(e) => setTryDifferentTime(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                  <span
                    className={`text-sm font-medium ${
                      tryDifferentTime ? "text-green-700" : "text-gray-500"
                    }`}
                  >
                    {tryDifferentTime ? "ON" : "OFF"}
                  </span>
                </label>
              </div>

              {/* Final Disposition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Final disposition after all retries
                </label>
                <select
                  value={finalDisposition}
                  onChange={(e) => setFinalDisposition(e.target.value)}
                  className="w-full lg:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="unreachable">Mark as Unreachable</option>
                  <option value="failed">Mark as Failed</option>
                  <option value="callback">Schedule Human Callback</option>
                  <option value="archive">Archive Lead</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3 - Queue Management */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-5">Queue Management</h3>

            <div className="space-y-6">
              {/* Concurrent Call Limit */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">
                    Concurrent Call Limit
                  </label>
                  <span className="text-2xl font-mono font-bold text-indigo-600">
                    {concurrentCalls}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={concurrentCalls}
                  onChange={(e) => setConcurrentCalls(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span>25</span>
                  <span>50</span>
                </div>
              </div>

              {/* Call Pacing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Call Pacing
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center justify-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50">
                    <input
                      type="radio"
                      name="pacing"
                      value="predictive"
                      checked={callPacing === "predictive"}
                      onChange={(e) => setCallPacing(e.target.value)}
                      className="w-4 h-4 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-900">Predictive</span>
                  </label>

                  <label className="flex items-center justify-center gap-2 p-3 border-2 border-indigo-600 bg-indigo-50 rounded-lg cursor-pointer transition-all">
                    <input
                      type="radio"
                      name="pacing"
                      value="progressive"
                      checked={callPacing === "progressive"}
                      onChange={(e) => setCallPacing(e.target.value)}
                      className="w-4 h-4 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-indigo-900">Progressive</span>
                  </label>

                  <label className="flex items-center justify-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50">
                    <input
                      type="radio"
                      name="pacing"
                      value="fixed"
                      checked={callPacing === "fixed"}
                      onChange={(e) => setCallPacing(e.target.value)}
                      className="w-4 h-4 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-900">Fixed Rate</span>
                  </label>
                </div>
              </div>

              {/* Calls Per Minute */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calls Per Minute
                </label>
                <input
                  type="number"
                  value={callsPerMinute}
                  onChange={(e) => setCallsPerMinute(Number(e.target.value))}
                  min="1"
                  max="100"
                  className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              {/* Queue Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Queue Priority
                </label>
                <select
                  value={queuePriority}
                  onChange={(e) => setQueuePriority(e.target.value)}
                  className="w-full lg:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="fifo">FIFO (First In, First Out)</option>
                  <option value="score">Score-based (Highest score first)</option>
                  <option value="recent">Recent Activity (Most recent first)</option>
                  <option value="lifo">LIFO (Last In, First Out)</option>
                </select>
              </div>

              {/* Pause Queue Button */}
              <div className="pt-4 border-t border-gray-200">
                <button className="flex items-center gap-2 px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium">
                  <PauseCircle className="w-5 h-5" />
                  Pause Queue (Emergency)
                </button>
                <p className="text-xs text-gray-600 mt-2">
                  Immediately halt all outbound calls and pause the queue
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 4 - Smart Scheduling (AI-Powered) */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200 p-6 shadow-sm">
            <div className="flex items-start gap-3 mb-5">
              <Brain className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Smart Scheduling (AI-Powered)
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  AI analyzes past call data to determine optimal calling times for each lead
                </p>
              </div>
            </div>

            {/* Best Time to Call Toggle */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-indigo-200 mb-6">
              <div>
                <div className="text-sm font-medium text-gray-900 mb-1">
                  Best time to call prediction
                </div>
                <p className="text-xs text-gray-600">
                  Use AI to schedule calls during peak connection hours
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bestTimeToCall}
                  onChange={(e) => setBestTimeToCall(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                />
                <span
                  className={`text-sm font-medium ${
                    bestTimeToCall ? "text-green-700" : "text-gray-500"
                  }`}
                >
                  {bestTimeToCall ? "ON" : "OFF"}
                </span>
              </label>
            </div>

            {/* Heatmap */}
            <div className="bg-white rounded-lg border border-indigo-200 p-4">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-indigo-600" />
                <h4 className="text-sm font-semibold text-gray-900">
                  Connection Rate Heatmap (Last 30 Days)
                </h4>
              </div>

              {/* Heatmap Grid */}
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                  {/* Hour Labels */}
                  <div className="flex gap-1 mb-2 ml-12">
                    {hours.map((hour) => (
                      <div key={hour} className="w-12 text-xs text-gray-600 text-center">
                        {hour}
                      </div>
                    ))}
                  </div>

                  {/* Day Rows */}
                  <div className="space-y-1">
                    {heatmapData.map((dayData) => (
                      <div key={dayData.day} className="flex items-center gap-1">
                        <div className="w-10 text-xs font-medium text-gray-700">
                          {dayData.day}
                        </div>
                        <div className="flex gap-1">
                          {dayData.hours.map((value, index) => (
                            <div
                              key={index}
                              className={`w-12 h-8 rounded ${getHeatmapColor(
                                value
                              )} cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center`}
                              title={`${dayData.day} ${hours[index]}: ${value}% connection rate`}
                            >
                              <span className="text-xs font-medium text-white">
                                {value}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-4 mt-4 ml-12">
                    <span className="text-xs text-gray-600">Connection Rate:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-300 rounded"></div>
                      <span className="text-xs text-gray-600">Low</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="text-xs text-gray-600">Medium</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-700 rounded"></div>
                      <span className="text-xs text-gray-600">High</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Auto-optimize Toggle */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-indigo-200 mt-4">
              <div>
                <div className="text-sm font-medium text-gray-900 mb-1">
                  Auto-optimize schedule based on data
                </div>
                <p className="text-xs text-gray-600">
                  Automatically adjust calling windows to match peak connection times
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoOptimize}
                  onChange={(e) => setAutoOptimize(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                />
                <span
                  className={`text-sm font-medium ${
                    autoOptimize ? "text-green-700" : "text-gray-500"
                  }`}
                >
                  {autoOptimize ? "ON" : "OFF"}
                </span>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-3">
            <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Cancel
            </button>
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
