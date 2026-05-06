import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useOmniStore } from "../../../store";
import {
  Search, Filter, Star, TrendingUp, Sparkles, Check,
  ChevronDown, Mail, Calendar, MessageCircle, CreditCard,
  HardDrive, Share2, BarChart3, Phone, Plug, Crown
} from "lucide-react";
import type { MarketplaceIntegration, Integration } from "../../../store/types";

const categories = [
  { id: 'all', label: 'All', icon: Plug },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'communication', label: 'Communication', icon: MessageCircle },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'storage', label: 'Storage', icon: HardDrive },
  { id: 'social', label: 'Social', icon: Share2 },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'telephony', label: 'Telephony', icon: Phone },
];

export function IntegrationMarketplace() {
  const navigate = useNavigate();
  const { getMarketplaceIntegrations, getIntegrations } = useOmniStore();

  const [marketplaceIntegrations, setMarketplaceIntegrations] = useState<MarketplaceIntegration[]>([]);
  const [installedIntegrations, setInstalledIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [marketplace, installed] = await Promise.all([
        getMarketplaceIntegrations(),
        getIntegrations()
      ]);
      setMarketplaceIntegrations(marketplace);
      setInstalledIntegrations(installed);
    } catch (error) {
      console.error('Failed to load integrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredIntegrations = marketplaceIntegrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-screen overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-semibold text-[#0F1B2D] mb-1">Integration Marketplace</h1>
              <p className="text-sm text-[#64748B]">
                Discover and install integrations to power up your CRM
              </p>
            </div>
            <button
              onClick={() => navigate("/tenant/integrations")}
              className="h-10 px-5 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Search */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" size={18} />
              <input
                type="text"
                placeholder="Search integrations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`h-11 px-4 rounded-lg border text-sm font-medium flex items-center gap-2 transition-colors ${
                showFilters ? "border-[#1565C0] bg-[#1565C0]/5 text-[#1565C0]" : "border-gray-300 text-[#0F1B2D] hover:bg-gray-50"
              }`}
            >
              <Filter size={18} />
              Filters
              <ChevronDown size={16} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="text-sm font-medium text-[#64748B]">Sort by:</div>
                <div className="flex items-center gap-2">
                  {[
                    { value: 'popular', label: 'Most Popular' },
                    { value: 'rating', label: 'Highest Rated' },
                    { value: 'new', label: 'Newest' },
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        sortBy === option.value
                          ? "bg-[#1565C0] text-white"
                          : "bg-white text-[#64748B] hover:bg-gray-100"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-8">
        {/* Categories */}
        <div className="mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map(category => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 transition-colors ${
                    selectedCategory === category.id
                      ? "border-[#1565C0] bg-[#1565C0] text-white"
                      : "border-gray-300 text-[#64748B] bg-white hover:border-[#1565C0] hover:text-[#1565C0]"
                  }`}
                >
                  <IconComponent size={16} />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-3 gap-6">
          {filteredIntegrations.map((integration) => {
            const isInstalled = installedIntegrations.some(i => i.slug === integration.slug);
            const formatInstalls = (count: number) => {
              if (count >= 1000) return `${Math.floor(count / 1000)}K+`;
              return count.toString();
            };

            return (
              <div
                key={integration.id}
                onClick={() => navigate(`/tenant/integrations/marketplace/${integration.id}`)}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:border-[#1565C0] hover:shadow-lg transition-all cursor-pointer group"
              >
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-3xl shrink-0">
                    {integration.logoUrl}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-[#0F1B2D] mb-0.5 group-hover:text-[#1565C0] transition-colors">
                          {integration.name}
                        </h3>
                        <p className="text-xs text-[#64748B]">{integration.provider}</p>
                      </div>
                      {integration.isPremium && (
                        <Crown size={16} className="text-yellow-500" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-[#64748B] mb-4 line-clamp-2">
                  {integration.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-xs text-[#64748B]">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="font-medium text-[#0F1B2D]">{integration.rating}</span>
                    <span>({integration.reviewCount})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp size={14} />
                    <span>{formatInstalls(integration.installCount)} installs</span>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 mb-4">
                  {integration.isPopular && (
                    <span className="px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs font-medium flex items-center gap-1">
                      <Sparkles size={12} />
                      Popular
                    </span>
                  )}
                  {integration.isPremium && (
                    <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-medium">
                      Premium
                    </span>
                  )}
                </div>

                {/* Action Button */}
                {isInstalled ? (
                <button
                  disabled
                  className="w-full h-10 rounded-lg bg-green-50 text-green-700 text-sm font-medium flex items-center justify-center gap-2 cursor-default"
                >
                  <Check size={18} />
                  Installed
                </button>
              ) : (
                <button className="w-full h-10 rounded-lg bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors">
                  Install
                </button>
              )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredIntegrations.length === 0 && (
          <div className="text-center py-12">
            <Plug size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="font-medium text-[#0F1B2D] mb-2">No integrations found</h3>
            <p className="text-sm text-[#64748B] mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="h-10 px-5 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
