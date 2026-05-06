import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Upload, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  Building2, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check
} from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

// Mock Data for Contacts
const CONTACTS_DATA = [
  {
    id: "1",
    name: "Sarah Jenkins",
    email: "sarah.j@techflow.io",
    phone: "+1 (555) 012-3456",
    company: "TechFlow Inc.",
    status: "Active",
    tags: ["Decision Maker", "Enterprise"],
    lastContacted: "2 hours ago",
    avatar: "https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHdvbWFufGVufDF8fHx8MTc3NDUzNDAyOHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    email: "m.rodriguez@nexus.corp",
    phone: "+1 (555) 019-8765",
    company: "Nexus Corp",
    status: "Lead",
    tags: ["SaaS", "Q3 Target"],
    lastContacted: "1 day ago",
    avatar: "https://images.unsplash.com/photo-1652471943570-f3590a4e52ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMG1hbnxlbnwxfHx8fDE3NzQ2MDI0NjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "3",
    name: "Emily Chen",
    email: "echen@innovate.co",
    phone: "+1 (555) 014-2233",
    company: "Innovate Co.",
    status: "Inactive",
    tags: ["SMB", "Former Client"],
    lastContacted: "2 weeks ago",
    avatar: "https://images.unsplash.com/photo-1758599543120-4e462429a4d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBoZWFkc2hvdCUyMHdvbWFufGVufDF8fHx8MTc3NDU3MjM5MHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "4",
    name: "David Smith",
    email: "david.smith@globaltech.net",
    phone: "+1 (555) 011-9988",
    company: "GlobalTech",
    status: "Active",
    tags: ["Enterprise", "Key Account"],
    lastContacted: "3 days ago",
    avatar: "https://images.unsplash.com/photo-1723537742563-15c3d351dbf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMGhlYWRzaG90JTIwbWFufGVufDF8fHx8MTc3NDU1Mjk4M3ww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "5",
    name: "Jessica Taylor",
    email: "jtaylor@startup.io",
    phone: "+1 (555) 017-5544",
    company: "Startup.io",
    status: "Lead",
    tags: ["Startup", "High Priority"],
    lastContacted: "5 hours ago",
    avatar: "https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMGhlYWRzaG90JTIwd29tYW58ZW58MXx8fHwxNzc0NjE0ODA3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "6",
    name: "Michael Brown",
    email: "mbrown@enterprisesys.com",
    phone: "+1 (555) 018-7766",
    company: "Enterprise Systems",
    status: "Active",
    tags: ["IT", "Decision Maker"],
    lastContacted: "1 week ago",
    avatar: "https://images.unsplash.com/photo-1769636929261-e913ed023c83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBoZWFkc2hvdCUyMG1hbnxlbnwxfHx8fDE3NzQ1NzEwOTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  }
];

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'lead':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'inactive':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

const getTagColor = (tag: string) => {
  const colors = [
    'bg-indigo-50 text-indigo-700 border-indigo-200',
    'bg-purple-50 text-purple-700 border-purple-200',
    'bg-amber-50 text-amber-700 border-amber-200',
    'bg-rose-50 text-rose-700 border-rose-200',
    'bg-cyan-50 text-cyan-700 border-cyan-200',
  ];
  // Simple hash to consistently assign colors based on tag string
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export function Contacts() {
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedContacts(new Set(CONTACTS_DATA.map(c => c.id)));
    } else {
      setSelectedContacts(new Set());
    }
  };

  const handleSelectContact = (id: string) => {
    const newSelected = new Set(selectedContacts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedContacts(newSelected);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-semibold text-[#0F1B2D]">Contacts</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and view your CRM contacts directory.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1565C0] hover:bg-blue-700 rounded-lg transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            Add Contact
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 flex flex-col min-h-0">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-full">
          
          {/* Toolbar */}
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search contacts by name, email, or company..."
                  className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shrink-0">
                <Filter className="w-4 h-4" />
                Filters
                <span className="flex items-center justify-center w-5 h-5 ml-1 text-xs font-medium text-[#1565C0] bg-blue-50 rounded-full">2</span>
              </button>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              {selectedContacts.size > 0 && (
                <span className="text-sm text-slate-500 font-medium mr-2">
                  {selectedContacts.size} selected
                </span>
              )}
              <div className="relative inline-block text-left">
                <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                  Bulk Actions
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 sticky top-0 z-10 border-b border-slate-200">
                <tr>
                  <th scope="col" className="p-4 w-4">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-[#1565C0] bg-white border-slate-300 rounded focus:ring-[#1565C0]"
                        onChange={handleSelectAll}
                        checked={selectedContacts.size === CONTACTS_DATA.length && CONTACTS_DATA.length > 0}
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">Contact Name</th>
                  <th scope="col" className="px-6 py-3 font-medium">Company</th>
                  <th scope="col" className="px-6 py-3 font-medium">Status</th>
                  <th scope="col" className="px-6 py-3 font-medium">Tags</th>
                  <th scope="col" className="px-6 py-3 font-medium">Last Contacted</th>
                  <th scope="col" className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {CONTACTS_DATA.filter(contact => 
                  contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  contact.company.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((contact) => (
                  <tr 
                    key={contact.id} 
                    className={`hover:bg-slate-50/50 transition-colors ${selectedContacts.has(contact.id) ? 'bg-blue-50/30' : 'bg-white'}`}
                  >
                    <td className="p-4 w-4">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-[#1565C0] bg-white border-slate-300 rounded focus:ring-[#1565C0]"
                          checked={selectedContacts.has(contact.id)}
                          onChange={() => handleSelectContact(contact.id)}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <ImageWithFallback className="w-10 h-10 rounded-full border border-slate-200 object-cover" src={contact.avatar} alt={contact.name} />
                        <div>
                          <div className="font-medium text-[#0F1B2D]">{contact.name}</div>
                          <div className="text-slate-500 text-xs mt-0.5 flex items-center gap-2">
                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{contact.email}</span>
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{contact.phone}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        {contact.company}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(contact.status)}`}>
                        {contact.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {contact.tags.map((tag, idx) => (
                          <span key={idx} className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getTagColor(tag)}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {contact.lastContacted}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-slate-200 flex items-center justify-between shrink-0 bg-white rounded-b-xl">
            <div className="text-sm text-slate-500">
              Showing <span className="font-medium text-slate-900">1</span> to <span className="font-medium text-slate-900">6</span> of <span className="font-medium text-slate-900">{CONTACTS_DATA.length}</span> results
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center">
                <button className="px-3 py-1 text-sm font-medium text-white bg-[#1565C0] rounded-md">1</button>
                <button className="px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-md">2</button>
                <button className="px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-md">3</button>
                <span className="px-2 text-slate-400">...</span>
                <button className="px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-md">10</button>
              </div>
              <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
