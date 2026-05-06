import React from "react";
import { WorkflowNode, NodeData } from "./WorkflowNode";

interface Connection {
  id: string;
  from: string;
  to: string;
  label?: string;
}

interface WorkflowCanvasProps {
  nodes: NodeData[];
  connections: Connection[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  onNodeSettingsClick: (nodeId: string) => void;
}

export function WorkflowCanvas({
  nodes,
  connections,
  selectedNodeId,
  onSelectNode,
  onNodeSettingsClick,
}: WorkflowCanvasProps) {
  // Helper to get node center position
  const getNodeCenter = (node: NodeData): { x: number; y: number } => {
    if (node.type === "condition") {
      return { x: node.x + 100, y: node.y + 100 }; // Diamond is 200x200
    }
    return { x: node.x + 120, y: node.y + 50 }; // Rounded rect is ~240x100
  };

  // Helper to get connection point on node edge
  const getConnectionPoint = (
    node: NodeData,
    direction: "top" | "bottom" | "left" | "right"
  ): { x: number; y: number } => {
    const center = getNodeCenter(node);
    
    if (node.type === "condition") {
      // Diamond shape
      switch (direction) {
        case "top":
          return { x: center.x, y: node.y + 10 };
        case "bottom":
          return { x: center.x, y: node.y + 190 };
        case "left":
          return { x: node.x + 10, y: center.y };
        case "right":
          return { x: node.x + 190, y: center.y };
      }
    } else {
      // Rounded rectangle
      switch (direction) {
        case "top":
          return { x: center.x, y: node.y };
        case "bottom":
          return { x: center.x, y: node.y + 100 };
        case "left":
          return { x: node.x, y: center.y };
        case "right":
          return { x: node.x + 240, y: center.y };
      }
    }
  };

  // Draw connection arrow
  const renderConnection = (conn: Connection) => {
    const fromNode = nodes.find((n) => n.id === conn.from);
    const toNode = nodes.find((n) => n.id === conn.to);

    if (!fromNode || !toNode) return null;

    const start = getConnectionPoint(fromNode, "bottom");
    const end = getConnectionPoint(toNode, "top");

    // For condition nodes, adjust connection points
    let adjustedStart = start;
    let adjustedEnd = end;

    if (fromNode.type === "condition") {
      // If 'Yes' branch, connect from right; if 'No', from left
      if (conn.label === "Yes") {
        adjustedStart = getConnectionPoint(fromNode, "right");
      } else if (conn.label === "No") {
        adjustedStart = getConnectionPoint(fromNode, "left");
      }
    }

    // Calculate path - use curved line for better visual
    const midY = (adjustedStart.y + adjustedEnd.y) / 2;
    const path = `M ${adjustedStart.x} ${adjustedStart.y} 
                  C ${adjustedStart.x} ${midY}, 
                    ${adjustedEnd.x} ${midY}, 
                    ${adjustedEnd.x} ${adjustedEnd.y}`;

    return (
      <g key={conn.id}>
        {/* Connection line */}
        <path
          d={path}
          stroke="#1565C0"
          strokeWidth="3"
          fill="none"
          markerEnd="url(#arrowhead)"
          className="drop-shadow-sm"
        />

        {/* Label */}
        {conn.label && (
          <g>
            <rect
              x={(adjustedStart.x + adjustedEnd.x) / 2 - 20}
              y={(adjustedStart.y + adjustedEnd.y) / 2 - 10}
              width="40"
              height="20"
              rx="10"
              fill="#1565C0"
              className="drop-shadow-sm"
            />
            <text
              x={(adjustedStart.x + adjustedEnd.x) / 2}
              y={(adjustedStart.y + adjustedEnd.y) / 2 + 5}
              textAnchor="middle"
              fill="white"
              fontSize="12"
              fontWeight="600"
            >
              {conn.label}
            </text>
          </g>
        )}
      </g>
    );
  };

  return (
    <div className="relative w-full h-full bg-white overflow-auto">
      {/* Grid background */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #E0E0E0 1px, transparent 1px),
            linear-gradient(to bottom, #E0E0E0 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      >
        <defs>
          {/* Arrow marker for connections */}
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#1565C0" />
          </marker>
        </defs>

        {/* Render all connections */}
        {connections.map(renderConnection)}
      </svg>

      {/* Render nodes */}
      <div className="relative" style={{ minWidth: "2000px", minHeight: "2000px" }}>
        {nodes.map((node) => (
          <WorkflowNode
            key={node.id}
            node={node}
            isSelected={selectedNodeId === node.id}
            onSelect={onSelectNode}
            onSettingsClick={onNodeSettingsClick}
          />
        ))}
      </div>

      {/* Helper text when empty */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold text-[#9E9E9E] mb-2">
              Start building your workflow
            </p>
            <p className="text-sm text-[#BDBDBD]">
              Add nodes from the toolbar to create your automation
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
