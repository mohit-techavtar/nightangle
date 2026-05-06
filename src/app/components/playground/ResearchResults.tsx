import React from "react";
import { TrendingUp, Target, DollarSign, Package, AlertCircle, CheckCircle, XCircle, Info } from "lucide-react";

interface CompetitorData {
  name: string;
  marketShare: number;
  priceRange: string;
  strengths: string[];
  weaknesses: string[];
}

interface PricingData {
  channel: string;
  priceRange: string;
  averagePrice: number;
  discount: string;
  availability: string;
}

interface ProductVariant {
  name: string;
  specs: string;
  price: string;
  availability: string;
}

interface SWOTData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export function CompetitorTable({ competitors }: { competitors: CompetitorData[] }) {
  return (
    <div className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden">
      <div className="px-4 py-3 bg-[#F5F5F5] border-b border-[#E0E0E0] flex items-center gap-2">
        <Target className="text-[#1565C0]" size={18} />
        <h4 className="font-semibold text-[#212121]">Competitor Analysis</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E0E0E0] bg-[#FAFAFA]">
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Competitor</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Market Share</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Price Range</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Strengths</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Weaknesses</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((comp, index) => (
              <tr key={index} className="border-b border-[#EEEEEE] last:border-0 hover:bg-[#FAFAFA]">
                <td className="py-3 px-4">
                  <span className="font-semibold text-[#212121]">{comp.name}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-[#E0E0E0] rounded-full overflow-hidden max-w-[100px]">
                      <div 
                        className="h-2 bg-[#1565C0] rounded-full"
                        style={{ width: `${comp.marketShare}%` }}
                      />
                    </div>
                    <span className="text-sm text-[#616161]">{comp.marketShare}%</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-[#212121] font-medium">{comp.priceRange}</span>
                </td>
                <td className="py-3 px-4">
                  <ul className="text-xs text-[#616161] space-y-1">
                    {comp.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <CheckCircle size={12} className="text-[#4CAF50] mt-0.5 shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="py-3 px-4">
                  <ul className="text-xs text-[#616161] space-y-1">
                    {comp.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <XCircle size={12} className="text-[#F44336] mt-0.5 shrink-0" />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function PricingComparison({ pricing }: { pricing: PricingData[] }) {
  return (
    <div className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden">
      <div className="px-4 py-3 bg-[#F5F5F5] border-b border-[#E0E0E0] flex items-center gap-2">
        <DollarSign className="text-[#1565C0]" size={18} />
        <h4 className="font-semibold text-[#212121]">Pricing Benchmark</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E0E0E0] bg-[#FAFAFA]">
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Channel</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Price Range</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Average</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Typical Discount</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Availability</th>
            </tr>
          </thead>
          <tbody>
            {pricing.map((p, index) => (
              <tr key={index} className="border-b border-[#EEEEEE] last:border-0 hover:bg-[#FAFAFA]">
                <td className="py-3 px-4">
                  <span className="font-semibold text-[#212121]">{p.channel}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-[#616161]">{p.priceRange}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-[#1565C0] font-bold">NPR {p.averagePrice.toLocaleString()}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-[#616161]">{p.discount}</span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    p.availability === "High" ? "bg-[#E8F5E9] text-[#2E7D32]" :
                    p.availability === "Medium" ? "bg-[#FFF8E1] text-[#F57F17]" :
                    "bg-[#FFEBEE] text-[#C62828]"
                  }`}>
                    {p.availability}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ProductVariantsTable({ variants }: { variants: ProductVariant[] }) {
  return (
    <div className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden">
      <div className="px-4 py-3 bg-[#F5F5F5] border-b border-[#E0E0E0] flex items-center gap-2">
        <Package className="text-[#1565C0]" size={18} />
        <h4 className="font-semibold text-[#212121]">Product Variants & Specifications</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E0E0E0] bg-[#FAFAFA]">
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Variant</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Specifications</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Price</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Availability</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((variant, index) => (
              <tr key={index} className="border-b border-[#EEEEEE] last:border-0 hover:bg-[#FAFAFA]">
                <td className="py-3 px-4">
                  <span className="font-semibold text-[#212121]">{variant.name}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-[#616161]">{variant.specs}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-[#1565C0] font-bold">{variant.price}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-[#616161]">{variant.availability}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SWOTMatrix({ swot }: { swot: SWOTData }) {
  return (
    <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
      {/* Strengths */}
      <div className="bg-white rounded-lg border-2 border-[#4CAF50] overflow-hidden">
        <div className="px-4 py-3 bg-[#E8F5E9] border-b border-[#4CAF50] flex items-center gap-2">
          <CheckCircle className="text-[#2E7D32]" size={18} />
          <h4 className="font-semibold text-[#2E7D32]">Strengths</h4>
        </div>
        <div className="p-4">
          <ul className="space-y-2">
            {swot.strengths.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#212121]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50] mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Weaknesses */}
      <div className="bg-white rounded-lg border-2 border-[#F44336] overflow-hidden">
        <div className="px-4 py-3 bg-[#FFEBEE] border-b border-[#F44336] flex items-center gap-2">
          <XCircle className="text-[#C62828]" size={18} />
          <h4 className="font-semibold text-[#C62828]">Weaknesses</h4>
        </div>
        <div className="p-4">
          <ul className="space-y-2">
            {swot.weaknesses.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#212121]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F44336] mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Opportunities */}
      <div className="bg-white rounded-lg border-2 border-[#2196F3] overflow-hidden">
        <div className="px-4 py-3 bg-[#E3F2FD] border-b border-[#2196F3] flex items-center gap-2">
          <TrendingUp className="text-[#1565C0]" size={18} />
          <h4 className="font-semibold text-[#1565C0]">Opportunities</h4>
        </div>
        <div className="p-4">
          <ul className="space-y-2">
            {swot.opportunities.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#212121]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2196F3] mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Threats */}
      <div className="bg-white rounded-lg border-2 border-[#FF9800] overflow-hidden">
        <div className="px-4 py-3 bg-[#FFF8E1] border-b border-[#FF9800] flex items-center gap-2">
          <AlertCircle className="text-[#F57F17]" size={18} />
          <h4 className="font-semibold text-[#F57F17]">Threats</h4>
        </div>
        <div className="p-4">
          <ul className="space-y-2">
            {swot.threats.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#212121]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF9800] mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function MarketInsights({ insights }: { insights: { title: string; value: string; trend?: string }[] }) {
  return (
    <div className="grid grid-cols-3 max-md:grid-cols-1 gap-4">
      {insights.map((insight, index) => (
        <div key={index} className="bg-white rounded-lg border border-[#E0E0E0] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info className="text-[#1565C0]" size={16} />
            <span className="text-xs text-[#616161] uppercase font-semibold">{insight.title}</span>
          </div>
          <div className="text-xl font-bold text-[#212121] mb-1">{insight.value}</div>
          {insight.trend && (
            <div className="flex items-center gap-1">
              <TrendingUp size={14} className="text-[#4CAF50]" />
              <span className="text-xs text-[#4CAF50] font-medium">{insight.trend}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
