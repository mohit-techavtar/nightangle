import React from "react";
import { Settings, Zap, GitBranch, Play } from "lucide-react";

export interface NodeData {
  id: string;
  type: "trigger" | "condition" | "action";
  label: string;
  description?: string;
  x: number;
  y: number;
}

interface WorkflowNodeProps {
  node: NodeData;
  isSelected: boolean;
  onSelect: (nodeId: string) => void;
  onSettingsClick: (nodeId: string) => void;
}

export function WorkflowNode({ node, isSelected, onSelect, onSettingsClick }: WorkflowNodeProps) {
  const getNodeStyles = () => {
    switch (node.type) {
      case "trigger":
        return {
          bgColor: "bg-gradient-to-br from-[#1565C0] to-[#0D47A1]",
          borderColor: "border-[#1565C0]",
          textColor: "text-white",
          icon: <Zap size={16} />,
        };
      case "condition":
        return {
          bgColor: "bg-gradient-to-br from-[#F57F17] to-[#E65100]",
          borderColor: "border-[#F57F17]",
          textColor: "text-white",
          icon: <GitBranch size={16} />,
        };
      case "action":
        return {
          bgColor: "bg-gradient-to-br from-[#2E7D32] to-[#1B5E20]",
          borderColor: "border-[#2E7D32]",
          textColor: "text-white",
          icon: <Play size={16} />,
        };
      default:
        return {
          bgColor: "bg-[#F5F5F5]",
          borderColor: "border-[#E0E0E0]",
          textColor: "text-[#212121]",
          icon: null,
        };
    }
  };

  const styles = getNodeStyles();

  // Connection ports
  const renderConnectionPort = (position: "top" | "bottom" | "left" | "right") => {
    const positionStyles = {
      top: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
      bottom: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
      left: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
      right: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
    };

    return (
      <div
        className={`absolute ${positionStyles[position]} w-3 h-3 rounded-full bg-[#1565C0] border-2 border-white shadow-sm cursor-crosshair hover:scale-125 transition-transform z-10`}
      />
    );
  };

  if (node.type === "condition") {
    // Diamond shape for condition
    return (
      <div
        className="absolute cursor-pointer group"
        style={{
          left: `${node.x}px`,
          top: `${node.y}px`,
          width: "200px",
          height: "200px",
        }}
        onClick={() => onSelect(node.id)}
      >
        {/* Connection ports */}
        {renderConnectionPort("top")}
        {renderConnectionPort("bottom")}
        {renderConnectionPort("left")}
        {renderConnectionPort("right")}

        {/* Diamond SVG */}
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          className={`drop-shadow-md ${isSelected ? "drop-shadow-xl" : ""}`}
        >
          <defs>
            <linearGradient id={`grad-${node.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F57F17" />
              <stop offset="100%" stopColor="#E65100" />
            </linearGradient>
          </defs>
          <path
            d="M 100 10 L 190 100 L 100 190 L 10 100 Z"
            fill={`url(#grad-${node.id})`}
            stroke={isSelected ? "#1565C0" : "#F57F17"}
            strokeWidth={isSelected ? "4" : "2"}
            className="transition-all"
          />
        </svg>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-white">{styles.icon}</div>
            <p className="text-xs font-semibold text-white text-center">{node.label}</p>
          </div>
          {node.description && (
            <p className="text-xs text-white/80 text-center line-clamp-2">{node.description}</p>
          )}
        </div>

        {/* Settings button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSettingsClick(node.id);
          }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/20 text-white opacity-0 group-hover:opacity-100 hover:bg-white/30 transition-all"
        >
          <Settings size={14} />
        </button>
      </div>
    );
  }

  // Rounded rectangle for trigger and action
  return (
    <div
      className="absolute cursor-pointer group"
      style={{
        left: `${node.x}px`,
        top: `${node.y}px`,
      }}
      onClick={() => onSelect(node.id)}
    >
      <div
        className={`relative ${styles.bgColor} ${
          isSelected ? `ring-4 ring-[#1565C0] ring-offset-2` : ""
        } rounded-2xl shadow-lg hover:shadow-xl transition-all p-4 min-w-[240px] max-w-[240px]`}
      >
        {/* Connection ports */}
        {renderConnectionPort("top")}
        {renderConnectionPort("bottom")}
        {node.type !== "trigger" && renderConnectionPort("left")}
        {renderConnectionPort("right")}

        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className={styles.textColor}>{styles.icon}</div>
          <span className={`text-xs font-bold uppercase ${styles.textColor} opacity-80`}>
            {node.type}
          </span>
        </div>

        {/* Content */}
        <p className={`text-sm font-semibold ${styles.textColor} mb-1`}>{node.label}</p>
        {node.description && (
          <p className={`text-xs ${styles.textColor} opacity-80`}>{node.description}</p>
        )}

        {/* Settings button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSettingsClick(node.id);
          }}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 text-white opacity-0 group-hover:opacity-100 hover:bg-white/30 transition-all"
        >
          <Settings size={14} />
        </button>
      </div>
    </div>
  );
}
