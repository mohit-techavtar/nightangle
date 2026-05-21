# OmniCRM — Feature Implementation Changelog

Senior PM + Frontend Engineer delivery. All code matches the existing design system
(Material hex palette, Tailwind utilities, lucide-react icons, mock-store/hook pattern)
and is **backend-swap ready** — every hook isolates data so a real API can replace the
mock layer without touching UI.

Files are delivered under the same paths as the source repo. Drop them into
`src/app/...`. **3 existing files are modified** (diffs described below); the rest are new.

---

## How the 11 requirements map to files

| # | Requirement | New / Changed files |
|---|-------------|---------------------|
| 1 | Multi-level hierarchy + reporting-to-manager + branch level | `hooks/useOrgHierarchy.ts`, `pages/customer/OrgHierarchy.tsx` |
| 2 | Branch-level lead & data distribution | `lib/leadDistribution.ts`, `pages/customer/OrgHierarchy.tsx` (Distribution tab) |
| 3 | Miti (Nepali date) when location = Nepal | `lib/nepaliDate.ts`, `components/common/MitiDateField.tsx`, `pages/customer/CompanySettingsEnhanced.tsx` |
| 4 | Salesforce-like Contacts module | `pages/customer/ContactsEnhanced.tsx`, `hooks/useCrmData.ts` |
| 5 | User-configurable Contact form | `lib/formSchema.ts`, `hooks/useFormConfig.ts`, `components/forms/FormBuilder.tsx`, `pages/customer/FormSettings.tsx` |
| 6 | CSV/Excel import + add-contact form | `lib/csvImport.ts`, `components/forms/ContactImportWizard.tsx`, `components/forms/DynamicForm.tsx`, `pages/customer/ContactsEnhanced.tsx` |
| 7 | Detailed Salesforce-like Lead form config | `lib/formSchema.ts` (`defaultLeadSchema`), `pages/customer/FormSettings.tsx` (`LeadFormSettings`) |
| 8 | Enhanced company settings + initial setup steps | `pages/customer/CompanySettingsEnhanced.tsx` |
| 9 | Gradient colour design on lead stage tabs | `components/lead/LeadStageTabs.tsx`, integrated into `pages/customer/LeadDetail.tsx` |
| 10 | Activity form in lead module | `components/lead/ActivityForm.tsx`, integrated into `pages/customer/LeadDetail.tsx` |
| 11 | Accounts module (deals + many contacts) | `hooks/useCrmData.ts`, `pages/customer/Accounts.tsx`, `pages/customer/AccountDetail.tsx` |

Plus wiring: `routes.tsx` and `components/layout/Sidebar.tsx`.

---

## NEW FILES

### Foundation — libraries (`src/app/lib/`)
- **`nepaliDate.ts`** — Bikram Sambat (Miti) ⇄ Gregorian conversion + formatting
  (`adToBs`, `bsToAd`, `formatMiti`, `todayMiti`, `isNepaliLocale`, `dualDateLabel`),
  Latin + Devanagari numerals, month-length table for 2078–2090 BS with heuristic fallback.
- **`leadDistribution.ts`** — Branch-level distribution engine: `round_robin`,
  `load_balanced`, `territory`, `manual` strategies + `simulateDistribution()`.
- **`formSchema.ts`** — Configurable form-schema model (sections/fields/validation) with
  Salesforce-like `defaultContactSchema` and `defaultLeadSchema`. Shared by Contact (5) & Lead (7) configs.
- **`csvImport.ts`** — Dependency-free CSV/TSV (Excel-paste) parser, fuzzy header → field
  auto-mapping, validation + duplicate detection.

### Foundation — hooks (`src/app/hooks/`)
- **`useOrgHierarchy.ts`** — Users with `branchId` + `reportsTo` (multi-level). Builds the
  reporting tree (`buildTree`), `getDescendants`, `getManagerChain`, `getTeam` (data-visibility
  rollup), branch scoping. Seed users mirror the existing branch ids (`comp-1..comp-5`).
- **`useFormConfig.ts`** — Persists live contact/lead/account layouts to `localStorage`
  (key `omnicrm.formSchemas.v1`); used by builder + renderer.
- **`useCrmData.ts`** — Contacts + Accounts data layer with account↔contact associations,
  account hierarchy (`parentAccountId`), and `relatedDealIds`.

### Components
- **`components/common/MitiDateField.tsx`** — Dual AD/BS date input + `DualDateLabel`.
- **`components/forms/DynamicForm.tsx`** — Renders any `FormSchema` into a validated form.
- **`components/forms/FormBuilder.tsx`** — Salesforce-style layout editor (reorder, show/hide,
  required toggle, add/edit/delete fields & sections).
- **`components/forms/ContactImportWizard.tsx`** — 4-step CSV/Excel import (Upload → Map → Review → Done).
- **`components/lead/LeadStageTabs.tsx`** — Gradient stage tabs (`path` chevrons or `tabs` pills).
- **`components/lead/ActivityForm.tsx`** — Log Call/Email/Meeting/Task/Note with outcome,
  duration, priority, and follow-up scheduling.

### Pages (`src/app/pages/customer/`)
- **`OrgHierarchy.tsx`** — Reporting Hierarchy tree (branch-filterable, capacity bars) +
  Lead Distribution rules with live simulation.
- **`ContactsEnhanced.tsx`** — Salesforce-like contacts: search, branch filter, account &
  branch columns, configurable add form, CSV import, export.
- **`FormSettings.tsx`** — Exports `ContactFormSettings` and `LeadFormSettings` (Build + Live Preview tabs).
- **`Accounts.tsx`** / **`AccountDetail.tsx`** — Accounts module: list with KPIs + detail with
  Contacts / Deals / Sub-accounts tabs and add-contact.
- **`CompanySettingsEnhanced.tsx`** — Adds **Localization & Miti** (Nepal-aware) and
  **Initial Setup** (onboarding steps + progress) tabs.

---

## MODIFIED EXISTING FILES

### `src/app/routes.tsx`
1. Added imports: `ContactsEnhanced`, `Accounts`, `AccountDetail`, `OrgHierarchy`,
   `ContactFormSettings`, `LeadFormSettings`, `CompanySettingsEnhanced`.
2. Under the `/tenant` children:
   - `contacts` now points to **`ContactsEnhanced`** (old page kept at `contacts/legacy`).
   - Added: `accounts`, `accounts/:id`, `org-hierarchy`,
     `settings/contact-form`, `settings/lead-form`.
   - `settings/company` now points to **`CompanySettingsEnhanced`**.

### `src/app/components/layout/Sidebar.tsx`
1. **CRM** group: added `Accounts` (`/tenant/accounts`) under Contacts.
2. **Team** group: added `Org Hierarchy` (`/tenant/org-hierarchy`).
3. **CRM Setup** submenu (`crmCustomizationItems`): added `Contact Form Config`
   (`/tenant/settings/contact-form`) and `Lead Form Config` (`/tenant/settings/lead-form`).
   (All icons reused from the existing import block — no new icon imports needed.)

### `src/app/pages/customer/LeadDetail.tsx`
1. Imports `LeadStageTabs` + `ActivityForm`.
2. The hand-rolled "Stage Stepper" is replaced by the gradient **`<LeadStageTabs variant="path">`** (req 9).
3. "Add Activity" now toggles the inline **`<ActivityForm>`**; logged entries render above the
   timeline (req 10). Miti is auto-enabled when the lead location contains "Nepal".

---

## Integration notes & assumptions
- **Mock-layer ids:** `useOrgHierarchy` users (`u-1..u-14`) align with `useCompanies` branch ids
  (`comp-1..comp-5`) but are intentionally **separate** from the Zustand `seedUsers` (`USR-001`).
  A production step would add `branchId` + `reportsTo` to the store `User` type and merge these.
- **Form config persistence** uses `localStorage`; swap `useFormConfig` internals for an API call.
- **Distribution** runs client-side for demo/preview; in production it would execute server-side
  on lead capture (web form, import, AI call) using the same rule shapes.
- **Build:** the project builds with `vite build` (esbuild, no type-check gate). All new/edited
  files were transform-validated and cross-file exports verified. Run `pnpm install && pnpm build`.
- **Nepal is the HQ** (`comp-1`, Kathmandu/NPR/Asia-Kathmandu) in the existing mock, so Miti is
  active by default on the company settings + lead detail surfaces.
