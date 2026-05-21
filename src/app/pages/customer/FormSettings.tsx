import React, { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import { useFormConfig } from "../../hooks/useFormConfig";
import { useOrgHierarchy } from "../../hooks/useOrgHierarchy";
import { useCompanies } from "../../hooks/useCompanies";
import { useCrmData } from "../../hooks/useCrmData";
import { FormBuilder } from "../../components/forms/FormBuilder";
import { DynamicForm, type OptionItem } from "../../components/forms/DynamicForm";
import type { FormSchema } from "../../lib/formSchema";
import { Settings2, Eye, LayoutGrid, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface Props { object: "contact" | "lead"; }

export function FormSettings({ object }: Props) {
  const { schema, save, resetToDefault } = useFormConfig(object);
  const { users } = useOrgHierarchy();
  const { companies } = useCompanies();
  const { accounts } = useCrmData();

  const [draft, setDraft] = useState<FormSchema>(schema);
  const [tab, setTab] = useState<"build" | "preview">("build");

  const optionSources: Record<string, OptionItem[]> = {
    accountId: accounts.map((a) => ({ value: a.id, label: a.name })),
    ownerId: users.map((u) => ({ value: u.id, label: u.name })),
    branchId: companies.map((c) => ({ value: c.id, label: c.name })),
  };

  const title = object === "lead" ? "Lead Form Configuration" : "Contact Form Configuration";

  const handleSave = () => { save(draft); toast.success(`${object === "lead" ? "Lead" : "Contact"} form layout saved`); };
  const handleReset = () => { resetToDefault(); setDraft(object === "lead" ? schema : schema); toast.message("Reset to default layout"); window.location.reload(); };

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB]">
      <TopBar breadcrumbs={[{ label: "Settings" }, { label: title }]} companyName="Everest Digital Solutions" mode="customer" userName="Rajesh Sharma" userEmail="rajesh@everestdigital.com" userInitials="RS" />

      <div className="flex-1 overflow-auto p-6 max-w-5xl w-full mx-auto">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-[#212121] flex items-center gap-2"><Settings2 size={24} className="text-[#1565C0]" /> {title}</h1>
          <p className="text-sm text-[#616161] mt-1">Add, reorder, hide, or require fields. Changes apply to the {object} create/edit forms across the CRM.</p>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => setTab("build")} className={`px-4 h-10 rounded-lg text-sm font-semibold flex items-center gap-1.5 ${tab === "build" ? "bg-[#1565C0] text-white" : "bg-white border border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5]"}`}><LayoutGrid size={16} /> Build Layout</button>
          <button onClick={() => setTab("preview")} className={`px-4 h-10 rounded-lg text-sm font-semibold flex items-center gap-1.5 ${tab === "preview" ? "bg-[#1565C0] text-white" : "bg-white border border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5]"}`}><Eye size={16} /> Live Preview</button>
        </div>

        {tab === "build" ? (
          <FormBuilder schema={draft} onChange={setDraft} onSave={handleSave} onReset={handleReset} />
        ) : (
          <div className="bg-white border border-[#E0E0E0] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4 text-sm text-[#2E7D32] bg-[#E8F5E9] rounded-lg px-3 py-2">
              <CheckCircle2 size={16} /> This is exactly what users see when creating a {object}.
            </div>
            <DynamicForm schema={draft} optionSources={optionSources} onSubmit={() => toast.success("Preview submit (no data saved)")} submitLabel={`Save ${object}`} />
          </div>
        )}
      </div>
    </div>
  );
}

export function ContactFormSettings() { return <FormSettings object="contact" />; }
export function LeadFormSettings() { return <FormSettings object="lead" />; }
