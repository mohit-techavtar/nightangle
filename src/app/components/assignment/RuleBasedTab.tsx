import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { GripVertical, Plus, Trash2, AlertCircle } from "lucide-react";

interface AssignmentRule {
  id: string;
  field: string;
  operator: string;
  value: string;
  assignTo: string;
  priority: number;
  isFallback?: boolean;
}

interface User {
  id: string;
  name: string;
  initials: string;
}

const mockUsers: User[] = [
  { id: "1", name: "Akash Verma", initials: "AV" },
  { id: "2", name: "Priya Sharma", initials: "PS" },
  { id: "3", name: "Rohit Singh", initials: "RS" },
  { id: "4", name: "Neha Gupta", initials: "NG" },
  { id: "5", name: "Vikram Patel", initials: "VP" },
];

const fieldOptions = [
  { value: "source", label: "Source" },
  { value: "location", label: "Location" },
  { value: "tags", label: "Tags" },
  { value: "scoreRange", label: "Score Range" },
  { value: "industry", label: "Industry" },
  { value: "companySize", label: "Company Size" },
];

const operatorOptions = [
  { value: "equals", label: "Equals" },
  { value: "contains", label: "Contains" },
  { value: "greaterThan", label: "Greater Than" },
  { value: "lessThan", label: "Less Than" },
  { value: "startsWith", label: "Starts With" },
  { value: "in", label: "In" },
];

const ITEM_TYPE = "RULE_ROW";

interface RuleRowProps {
  rule: AssignmentRule;
  index: number;
  onUpdate: (id: string, field: keyof AssignmentRule, value: string) => void;
  onDelete: (id: string) => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
}

function RuleRow({ rule, index, onUpdate, onDelete, onMove }: RuleRowProps) {
  const [{ isDragging }, drag, preview] = useDrag({
    type: ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        onMove(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => preview(drop(node))}
      className={`bg-white rounded-lg border-2 border-[#E0E0E0] p-4 transition-all ${
        isDragging ? "opacity-50 rotate-1 scale-95" : "opacity-100"
      } ${rule.isFallback ? "border-[#F57F17] bg-[#FFF8E1]/30" : ""}`}
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <div
          ref={drag}
          className="cursor-grab active:cursor-grabbing text-[#9E9E9E] hover:text-[#1565C0] transition-colors mt-2"
        >
          <GripVertical size={20} />
        </div>

        {/* Priority Badge */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#1565C0] to-[#0D47A1] text-white flex items-center justify-center text-sm font-bold mt-2">
          {rule.priority}
        </div>

        {/* Rule Fields */}
        <div className="flex-1 grid grid-cols-4 gap-3">
          {/* Field Dropdown */}
          <div>
            <label className="block text-xs font-medium text-[#616161] mb-1">
              Field
            </label>
            <select
              value={rule.field}
              onChange={(e) => onUpdate(rule.id, "field", e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-[#E0E0E0] text-sm text-[#212121] focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0]"
            >
              <option value="">Select field</option>
              {fieldOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Operator Dropdown */}
          <div>
            <label className="block text-xs font-medium text-[#616161] mb-1">
              Operator
            </label>
            <select
              value={rule.operator}
              onChange={(e) => onUpdate(rule.id, "operator", e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-[#E0E0E0] text-sm text-[#212121] focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0]"
            >
              <option value="">Select operator</option>
              {operatorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Value Input */}
          <div>
            <label className="block text-xs font-medium text-[#616161] mb-1">
              Value
            </label>
            <input
              type="text"
              value={rule.value}
              onChange={(e) => onUpdate(rule.id, "value", e.target.value)}
              placeholder="Enter value"
              className="w-full h-10 px-3 rounded-md border border-[#E0E0E0] text-sm text-[#212121] focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0]"
            />
          </div>

          {/* Assign To Dropdown */}
          <div>
            <label className="block text-xs font-medium text-[#616161] mb-1">
              Assign To
            </label>
            <select
              value={rule.assignTo}
              onChange={(e) => onUpdate(rule.id, "assignTo", e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-[#E0E0E0] text-sm text-[#212121] focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0]"
            >
              <option value="">Select user</option>
              {mockUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(rule.id)}
          className="flex-shrink-0 w-8 h-8 rounded-md text-[#D32F2F] hover:bg-[#FFEBEE] transition-colors flex items-center justify-center mt-2"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {rule.isFallback && (
        <div className="mt-3 flex items-center gap-2 text-xs text-[#EF6C00]">
          <AlertCircle size={14} />
          <span>Fallback rule - applies when no other rules match</span>
        </div>
      )}
    </div>
  );
}

export function RuleBasedTab() {
  const [rules, setRules] = useState<AssignmentRule[]>([
    {
      id: "1",
      field: "source",
      operator: "equals",
      value: "Web Form",
      assignTo: "1",
      priority: 1,
    },
    {
      id: "2",
      field: "scoreRange",
      operator: "greaterThan",
      value: "80",
      assignTo: "2",
      priority: 2,
    },
    {
      id: "3",
      field: "location",
      operator: "contains",
      value: "Mumbai",
      assignTo: "3",
      priority: 3,
    },
  ]);

  const handleAddRule = () => {
    const newRule: AssignmentRule = {
      id: Date.now().toString(),
      field: "",
      operator: "",
      value: "",
      assignTo: "",
      priority: rules.filter((r) => !r.isFallback).length + 1,
    };
    setRules((prev) => {
      const fallback = prev.find((r) => r.isFallback);
      const regular = prev.filter((r) => !r.isFallback);
      return fallback ? [...regular, newRule, fallback] : [...regular, newRule];
    });
  };

  const handleAddFallback = () => {
    if (rules.some((r) => r.isFallback)) {
      alert("A fallback rule already exists");
      return;
    }
    const newRule: AssignmentRule = {
      id: Date.now().toString(),
      field: "any",
      operator: "any",
      value: "any",
      assignTo: "",
      priority: rules.length + 1,
      isFallback: true,
    };
    setRules((prev) => [...prev, newRule]);
  };

  const handleUpdateRule = (id: string, field: keyof AssignmentRule, value: string) => {
    setRules((prev) =>
      prev.map((rule) => (rule.id === id ? { ...rule, [field]: value } : rule))
    );
  };

  const handleDeleteRule = (id: string) => {
    setRules((prev) => {
      const updated = prev.filter((rule) => rule.id !== id);
      return updated.map((rule, index) => ({ ...rule, priority: index + 1 }));
    });
  };

  const handleMoveRule = (dragIndex: number, hoverIndex: number) => {
    setRules((prev) => {
      const updated = [...prev];
      const [removed] = updated.splice(dragIndex, 1);
      updated.splice(hoverIndex, 0, removed);
      return updated.map((rule, index) => ({ ...rule, priority: index + 1 }));
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold text-[#212121] mb-2">Rule-Based Assignment</h2>
          <p className="text-sm text-[#616161]">
            Create custom rules to automatically assign leads based on criteria
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-[#E3F2FD] rounded-lg p-4 border border-[#1565C0]/20">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-[#1565C0] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#212121] mb-1">
                Rules are evaluated in priority order
              </p>
              <p className="text-xs text-[#616161]">
                Drag rules to reorder. The first matching rule will be applied. Add a fallback rule to
                handle leads that don't match any criteria.
              </p>
            </div>
          </div>
        </div>

        {/* Rules List */}
        <div className="bg-[#FAFAFA] rounded-lg border border-[#E0E0E0] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#212121]">
              Assignment Rules ({rules.length})
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddFallback}
                disabled={rules.some((r) => r.isFallback)}
                className="flex items-center gap-2 px-4 py-2 rounded-md border border-[#F57F17] text-[#EF6C00] text-sm font-semibold hover:bg-[#FFF8E1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={16} />
                Add Fallback
              </button>
              <button
                onClick={handleAddRule}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-[#1565C0] to-[#0D47A1] text-white text-sm font-semibold hover:shadow-lg transition-shadow"
              >
                <Plus size={16} />
                Add Rule
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {rules.length === 0 ? (
              <div className="text-center py-12 text-[#9E9E9E]">
                <p className="text-sm">No rules configured</p>
                <p className="text-xs mt-1">Click "Add Rule" to create your first assignment rule</p>
              </div>
            ) : (
              rules.map((rule, index) => (
                <RuleRow
                  key={rule.id}
                  rule={rule}
                  index={index}
                  onUpdate={handleUpdateRule}
                  onDelete={handleDeleteRule}
                  onMove={handleMoveRule}
                />
              ))
            )}
          </div>
        </div>

        {/* Preview/Test Section */}
        <div className="bg-white rounded-lg border border-[#E0E0E0] p-6">
          <h3 className="text-lg font-semibold text-[#212121] mb-4">Test Rules</h3>
          <p className="text-sm text-[#616161] mb-4">
            Enter lead details to see which rule would be applied
          </p>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-[#616161] mb-1">Source</label>
              <input
                type="text"
                placeholder="e.g., Web Form"
                className="w-full h-10 px-3 rounded-md border border-[#E0E0E0] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#616161] mb-1">Location</label>
              <input
                type="text"
                placeholder="e.g., Mumbai"
                className="w-full h-10 px-3 rounded-md border border-[#E0E0E0] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#616161] mb-1">Score</label>
              <input
                type="number"
                placeholder="e.g., 85"
                className="w-full h-10 px-3 rounded-md border border-[#E0E0E0] text-sm"
              />
            </div>
          </div>
          <button className="px-4 py-2 rounded-md bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1] transition-colors">
            Test Assignment
          </button>
        </div>
      </div>
    </DndProvider>
  );
}
