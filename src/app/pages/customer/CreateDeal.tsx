import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useDeals, Deal, DealLineItem, DealType } from "../../hooks/useDeals";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  DollarSign,
  Calendar,
  User,
  Building,
  Tag,
  AlertCircle,
  Info,
  Percent,
  X,
  Search,
} from "lucide-react";

export function CreateDeal() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dealId = searchParams.get("id");

  const {
    createDeal,
    updateDeal,
    getDealById,
    pipelines,
    products
  } = useDeals();

  const isEditMode = !!dealId;
  const existingDeal = isEditMode ? getDealById(dealId) : null;

  // Form state
  const [formData, setFormData] = useState({
    name: existingDeal?.name || "",
    leadId: existingDeal?.leadId || "",
    leadName: existingDeal?.leadName || "",
    companyId: existingDeal?.companyId || "",
    companyName: existingDeal?.companyName || "",
    pipelineId: existingDeal?.pipelineId || (pipelines[0]?.id || ""),
    stageId: existingDeal?.stageId || "",
    owner: existingDeal?.owner || "user-1",
    ownerName: existingDeal?.ownerName || "Current User",
    dealType: existingDeal?.dealType || ("new-business" as DealType),
    currency: existingDeal?.currency || "USD",
    probability: existingDeal?.probability || 10,
    expectedCloseDate: existingDeal?.expectedCloseDate || "",
    sourceCampaign: existingDeal?.sourceCampaign || "",
    tags: existingDeal?.tags || [],
    notes: existingDeal?.notes || "",
  });

  const [lineItems, setLineItems] = useState<DealLineItem[]>(
    existingDeal?.lineItems || []
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showLeadSearch, setShowLeadSearch] = useState(false);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [newTag, setNewTag] = useState("");

  // Get pipeline and stages
  const selectedPipeline = pipelines.find(p => p.id === formData.pipelineId);
  const stages = selectedPipeline?.stages || [];

  // Set initial stage when pipeline changes
  useEffect(() => {
    if (!isEditMode && selectedPipeline && !formData.stageId) {
      const firstStage = stages.find(s => s.probability > 0 && s.probability < 100);
      if (firstStage) {
        setFormData(prev => ({
          ...prev,
          stageId: firstStage.id,
          probability: firstStage.probability,
        }));
      }
    }
  }, [formData.pipelineId, selectedPipeline, isEditMode]);

  // Calculate totals
  const calculateLineItemTotal = (item: Partial<DealLineItem>) => {
    const subtotal = (item.quantity || 0) * (item.unitPrice || 0);
    let discount = 0;

    if (item.discountType === "percentage") {
      discount = subtotal * ((item.discount || 0) / 100);
    } else {
      discount = item.discount || 0;
    }

    const afterDiscount = subtotal - discount;
    const total = afterDiscount + (item.tax || 0);

    return {
      subtotal,
      total,
    };
  };

  const dealTotal = lineItems.reduce((sum, item) => sum + item.total, 0);

  // Handlers
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleStageChange = (stageId: string) => {
    const stage = stages.find(s => s.id === stageId);
    if (stage) {
      setFormData(prev => ({
        ...prev,
        stageId,
        probability: stage.probability,
      }));
    }
  };

  const addLineItem = (productId?: string) => {
    const product = productId ? products.find(p => p.id === productId) : null;

    const newItem: DealLineItem = {
      id: `li-${Date.now()}`,
      productId: product?.id || "",
      productName: product?.name || "",
      quantity: 1,
      unitPrice: product?.basePrice || 0,
      discount: 0,
      discountType: "percentage",
      tax: 0,
      subtotal: product?.basePrice || 0,
      total: product?.basePrice || 0,
    };

    setLineItems(prev => [...prev, newItem]);
    setShowProductSearch(false);
  };

  const updateLineItem = (index: number, field: string, value: any) => {
    setLineItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };

      // Recalculate totals
      const { subtotal, total } = calculateLineItemTotal(updated[index]);
      updated[index].subtotal = subtotal;
      updated[index].total = total;

      return updated;
    });
  };

  const removeLineItem = (index: number) => {
    setLineItems(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleChange("tags", [...formData.tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    handleChange("tags", formData.tags.filter(t => t !== tag));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Deal name is required";
    if (!formData.leadId) newErrors.leadId = "Lead is required";
    if (!formData.pipelineId) newErrors.pipelineId = "Pipeline is required";
    if (!formData.stageId) newErrors.stageId = "Stage is required";
    if (!formData.expectedCloseDate) newErrors.expectedCloseDate = "Expected close date is required";
    if (lineItems.length === 0) newErrors.lineItems = "At least one line item is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const dealData = {
      ...formData,
      pipelineName: selectedPipeline?.name || "",
      stageName: stages.find(s => s.id === formData.stageId)?.name || "",
      status: "open" as const,
      estimatedValue: dealTotal,
      lineItems,
      attribution: {
        leadSource: "Manual Entry",
        campaigns: formData.sourceCampaign ? [formData.sourceCampaign] : [],
      },
    };

    if (isEditMode && dealId) {
      updateDeal(dealId, dealData);
    } else {
      createDeal(dealData);
    }

    navigate("/tenant/deals/list");
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/tenant/deals/list")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {isEditMode ? "Edit Deal" : "Create New Deal"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {isEditMode ? "Update deal information" : "Add a new opportunity to your pipeline"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/tenant/deals/list")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isEditMode ? "Save Changes" : "Create Deal"}
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Deal Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deal Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., Enterprise CRM Implementation - TechCorp"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Lead */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lead *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.leadName}
                    onClick={() => setShowLeadSearch(true)}
                    readOnly
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                      errors.leadId ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Select a lead"
                  />
                  <Search className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                {errors.leadId && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.leadId}
                  </p>
                )}
                {showLeadSearch && (
                  <div className="absolute z-10 mt-2 w-full bg-white border rounded-lg shadow-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Select Lead</h4>
                      <button
                        onClick={() => setShowLeadSearch(false)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {["Contact 1", "Contact 2", "Contact 3"].map((lead, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            handleChange("leadId", `lead-${idx + 1}`);
                            handleChange("leadName", lead);
                            setShowLeadSearch(false);
                          }}
                          className="w-full p-3 text-left hover:bg-gray-50 rounded-lg border"
                        >
                          <p className="font-medium text-gray-900">{lead}</p>
                          <p className="text-sm text-gray-500">Company {idx + 1}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company (Optional)
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., TechCorp Inc."
                />
              </div>

              {/* Deal Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deal Type *
                </label>
                <select
                  value={formData.dealType}
                  onChange={(e) => handleChange("dealType", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="new-business">New Business</option>
                  <option value="renewal">Renewal</option>
                  <option value="upsell">Upsell</option>
                  <option value="cross-sell">Cross-sell</option>
                </select>
              </div>

              {/* Owner */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deal Owner *
                </label>
                <select
                  value={formData.owner}
                  onChange={(e) => {
                    const selectedOwner = e.target.value;
                    const ownerNames: Record<string, string> = {
                      "user-1": "Current User",
                      "user-2": "John Doe",
                      "user-3": "Jane Smith",
                    };
                    handleChange("owner", selectedOwner);
                    handleChange("ownerName", ownerNames[selectedOwner]);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user-1">Current User</option>
                  <option value="user-2">John Doe</option>
                  <option value="user-3">Jane Smith</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pipeline & Stage */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline & Stage</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Pipeline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pipeline *
                </label>
                <select
                  value={formData.pipelineId}
                  onChange={(e) => {
                    handleChange("pipelineId", e.target.value);
                    setFormData(prev => ({ ...prev, stageId: "" }));
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.pipelineId ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select pipeline</option>
                  {pipelines.map(pipeline => (
                    <option key={pipeline.id} value={pipeline.id}>{pipeline.name}</option>
                  ))}
                </select>
              </div>

              {/* Stage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stage *
                </label>
                <select
                  value={formData.stageId}
                  onChange={(e) => handleStageChange(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.stageId ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={!formData.pipelineId}
                >
                  <option value="">Select stage</option>
                  {stages.filter(s => s.probability > 0 && s.probability < 100).map(stage => (
                    <option key={stage.id} value={stage.id}>{stage.name} ({stage.probability}%)</option>
                  ))}
                </select>
              </div>

              {/* Probability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Win Probability
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={formData.probability}
                    onChange={(e) => handleChange("probability", parseInt(e.target.value) || 0)}
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Percent className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Deal Value & Line Items */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Products & Pricing</h3>
              <button
                onClick={() => setShowProductSearch(!showProductSearch)}
                className="px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>

            {showProductSearch && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
                <h4 className="font-medium text-gray-900 mb-3">Select Product</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {products.filter(p => p.isActive).map(product => (
                    <button
                      key={product.id}
                      onClick={() => addLineItem(product.id)}
                      className="p-3 text-left bg-white border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500 mb-1">{product.description}</p>
                      <p className="text-sm font-semibold text-gray-900">${product.basePrice} {product.currency}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {lineItems.length > 0 ? (
              <div className="space-y-3">
                {lineItems.map((item, index) => (
                  <div key={item.id} className="p-4 border rounded-lg">
                    <div className="grid grid-cols-12 gap-3 items-start">
                      <div className="col-span-12 md:col-span-3">
                        <label className="block text-xs text-gray-500 mb-1">Product</label>
                        <input
                          type="text"
                          value={item.productName}
                          onChange={(e) => updateLineItem(index, "productName", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="col-span-6 md:col-span-2">
                        <label className="block text-xs text-gray-500 mb-1">Quantity</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(index, "quantity", parseInt(e.target.value) || 0)}
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="col-span-6 md:col-span-2">
                        <label className="block text-xs text-gray-500 mb-1">Unit Price</label>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateLineItem(index, "unitPrice", parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="col-span-6 md:col-span-2">
                        <label className="block text-xs text-gray-500 mb-1">Discount</label>
                        <div className="flex gap-1">
                          <input
                            type="number"
                            value={item.discount}
                            onChange={(e) => updateLineItem(index, "discount", parseFloat(e.target.value) || 0)}
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <select
                            value={item.discountType}
                            onChange={(e) => updateLineItem(index, "discountType", e.target.value)}
                            className="px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="percentage">%</option>
                            <option value="absolute">$</option>
                          </select>
                        </div>
                      </div>

                      <div className="col-span-6 md:col-span-2">
                        <label className="block text-xs text-gray-500 mb-1">Total</label>
                        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-900">
                          ${item.total.toFixed(2)}
                        </div>
                      </div>

                      <div className="col-span-12 md:col-span-1 flex items-end">
                        <button
                          onClick={() => removeLineItem(index)}
                          className="w-full p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Estimated Deal Value</span>
                    <span className="text-2xl font-bold text-blue-600">${dealTotal.toFixed(2)} {formData.currency}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No products added yet</p>
                <p className="text-sm text-gray-500 mt-1">Click "Add Product" to add line items</p>
              </div>
            )}

            {errors.lineItems && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.lineItems}
              </p>
            )}
          </div>

          {/* Timeline & Additional Info */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline & Additional Info</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Expected Close Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Close Date *
                </label>
                <input
                  type="date"
                  value={formData.expectedCloseDate}
                  onChange={(e) => handleChange("expectedCloseDate", e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.expectedCloseDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.expectedCloseDate && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.expectedCloseDate}
                  </p>
                )}
              </div>

              {/* Source Campaign */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source Campaign (Optional)
                </label>
                <input
                  type="text"
                  value={formData.sourceCampaign}
                  onChange={(e) => handleChange("sourceCampaign", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Q1 Outreach Campaign"
                />
              </div>

              {/* Tags */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a tag..."
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Add any additional notes about this deal..."
                />
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Attribution & Tracking</p>
                <p className="text-blue-700">
                  This deal will be automatically linked to the selected lead and tracked through your pipeline.
                  All activities, stage changes, and updates will be logged in the deal timeline.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
