import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import { useFormConfig } from "../../hooks/useFormConfig";
import { useLeadRecords } from "../../hooks/useLeadRecords";
import { useOrgHierarchy } from "../../hooks/useOrgHierarchy";
import { useCompanies } from "../../hooks/useCompanies";
import { DynamicForm, type OptionItem } from "../../components/forms/DynamicForm";
import { ArrowLeft, Settings2, UserPlus, Save } from "lucide-react";
import { toast } from "sonner";

// Task 9 — Create / Edit Lead with a fully configurable form (driven by
// useFormConfig('lead')) and complete CRUD via useLeadRecords.
export function CreateLead() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const editId = params.get("id");

  const { schema } = useFormConfig("lead");
  const { createLead, updateLead, getLead } = useLeadRecords();
  const { users } = useOrgHierarchy();
  const { companies } = useCompanies();

  const existing = editId ? getLead(editId) : null;
  const isEdit = !!existing;

  const optionSources: Record<string, OptionItem[]> = useMemo(() => ({
    ownerId: users.map((u) => ({ value: u.id, label: u.name })),
    branchId: companies.map((c) => ({ value: c.id, label: c.name })),
  }), [users, companies]);

  const nepali = useMemo(
    () => companies.some((c) => (c.address?.country || "").toLowerCase() === "nepal"),
    [companies]
  );

  const handleSubmit = (values: Record<string, unknown>) => {
    if (isEdit && existing) {
      updateLead(existing.id, values);
      toast.success("Lead updated");
    } else {
      const rec = createLead(values);
      toast.success(`Lead ${rec.id} created`);
    }
    navigate("/tenant/leads/records");
  };

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB]">
      <TopBar breadcrumbs={[{ label: "CRM" }, { label: "Leads", path: "/tenant/leads/records" }, { label: isEdit ? "Edit Lead" : "Create Lead" }]} companyName="Everest Digital Solutions" mode="customer" userName="Rajesh Sharma" userEmail="rajesh@everestdigital.com" userInitials="RS" />

      <div className="flex-1 overflow-auto">
        {/* Sticky action bar (Zoho-style) */}
        <div className="sticky top-0 z-10 bg-white border-b border-[#E0E0E0] px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-[#F5F5F5] text-[#616161]"><ArrowLeft size={18} /></button>
            <div className="flex items-center gap-2">
              <UserPlus size={20} className="text-[#1565C0]" />
              <h1 className="text-lg font-semibold text-[#212121]">{isEdit ? `Edit Lead · ${existing?.id}` : "Create Lead"}</h1>
            </div>
          </div>
          <button onClick={() => navigate("/tenant/settings/lead-form")}
            className="text-sm text-[#1565C0] font-medium flex items-center gap-1.5 hover:underline">
            <Settings2 size={15} /> Edit Page Layout
          </button>
        </div>

        <div className="max-w-5xl mx-auto p-6">
          <div className="bg-white border border-[#E0E0E0] rounded-xl p-5">
            <DynamicForm
              schema={schema}
              initialValues={existing?.values || {}}
              optionSources={optionSources}
              nepali={nepali}
              onSubmit={handleSubmit}
              onCancel={() => navigate("/tenant/leads/records")}
              submitLabel={isEdit ? "Save Changes" : "Create Lead"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
