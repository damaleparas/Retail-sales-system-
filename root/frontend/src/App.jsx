import React, { useState, useEffect } from 'react';
import { fetchSales, getPrediction, addSale, fetchStats } from './services/api';
import { 
  Search, ChevronDown, Plus, MoreHorizontal, 
  LayoutDashboard, ShoppingCart, FileText, Settings, 
  Users, LogOut, ChevronLeft, ChevronRight, X
} from 'lucide-react';

const App = () => {
  // --- STATE ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total_revenue: 0, total_orders: 0, avg_order_value: 0 });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [showModal, setShowModal] = useState(false);
  
  // Filters State (Multi-select arrays)
  const [filters, setFilters] = useState({
    search: '',
    region: [],
    gender: [],
    category: [],
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const [newSale, setNewSale] = useState({
    customer_id: "CUST_NEW", customer_name: "", phone_number: "", gender: "Male",
    age: 25, region: "North", product_id: "PROD_NEW", product_name: "",
    category: "Electronics", tags: ["New"], quantity: 1, total_amount: 0,
    date: new Date().toISOString(), payment_method: "Credit Card", order_status: "Completed"
  });

  // --- EFFECTS ---
  useEffect(() => {
    loadData();
    loadStats();
  }, [filters, pagination.page]);

  // --- HANDLERS ---
  const loadData = async () => {
    setLoading(true);
    // Filters are passed as arrays to backend for multi-select support
    const result = await fetchSales({ ...filters, page: pagination.page });
    setData(result.data);
    setPagination({ ...pagination, total: result.total, pages: result.pages });
    setLoading(false);
  };

  const loadStats = async () => {
    // ⚠️ CRITICAL: Pass the 'filters' state here!
    const result = await fetchStats(filters); 
    setStats(result);
  };

  // MULTI-SELECT HANDLER
  const handleFilterChange = (key, value) => {
    if (value === 'RESET') {
        setFilters({ ...filters, [key]: [] });
        setPagination({ ...pagination, page: 1 });
        return;
    }
    const current = filters[key];
    const updated = current.includes(value) 
      ? current.filter(item => item !== value) // Remove if exists
      : [...current, value]; // Add if new
    setFilters({ ...filters, [key]: updated });
    setPagination({ ...pagination, page: 1 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addSale(newSale);
    setShowModal(false);
    loadData();
    loadStats();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
      case 'returned': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  // --- COMPONENT: Multi-Select Dropdown ---
  const FilterDropdown = ({ label, options, active, onChange }) => (
    <div className="relative group">
      <button className={`flex items-center gap-2 px-4 py-2.5 bg-white border rounded-lg text-sm transition min-w-[160px] justify-between ${active.length > 0 ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
        <span className="truncate max-w-[120px] font-medium">
            {active.length === 0 ? label : `${label} (${active.length})`}
        </span>
        <ChevronDown size={14} className={active.length > 0 ? "text-blue-500" : "text-gray-400"} />
      </button>
      
      {/* Dropdown Menu */}
      <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-100 shadow-xl rounded-xl hidden group-hover:block z-50 p-2">
        <div className="max-h-60 overflow-y-auto space-y-1">
            {options.map(opt => (
            <label key={opt} className="flex items-center px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer text-sm text-gray-700 gap-3 select-none">
                <input 
                    type="checkbox" 
                    checked={active.includes(opt)}
                    onChange={() => onChange(opt)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition"
                />
                {opt}
            </label>
            ))}
        </div>
        {active.length > 0 && (
            <div className="border-t border-gray-100 mt-2 pt-2">
                <button 
                    onClick={() => onChange('RESET')} 
                    className="w-full text-center py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-lg transition">
                    Clear Selection
                </button>
            </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] font-sans text-gray-900">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-[#1E1E2D] text-white flex flex-col flex-shrink-0 sticky top-0 h-screen">
        <div className="p-8 flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-900/50">V</div>
          <span className="text-2xl font-bold tracking-tight">Vault</span>
        </div>

        <nav className="flex-1 px-4 space-y-1.5">
          <div className="flex items-center gap-3 px-4 py-3.5 bg-blue-600 rounded-xl text-white cursor-pointer shadow-md shadow-blue-900/20">
            <LayoutDashboard size={20} /> <span className="text-sm font-semibold">Sales Management</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl cursor-pointer transition">
            <ShoppingCart size={20} /> <span className="text-sm font-medium">Products</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl cursor-pointer transition">
            <Users size={20} /> <span className="text-sm font-medium">Customers</span>
          </div>
        </nav>

        <div className="p-6 border-t border-white/5">
            <div className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white cursor-pointer transition">
                <Settings size={18} /> <span className="text-sm">Settings</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 cursor-pointer transition">
                <LogOut size={18} /> <span className="text-sm">Log Out</span>
            </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 min-w-0 flex flex-col">
        
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-10 py-6 sticky top-0 z-40 bg-white/90 backdrop-blur-md">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Sales Management System</h1>
                
                {/* Search */}
                <div className="relative w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search Name, Phone..." 
                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm transition shadow-sm"
                        onChange={(e) => { setFilters({ ...filters, search: e.target.value }); setPagination({ ...pagination, page: 1 }); }}
                    />
                </div>
            </div>

            {/* --- MULTI-SELECT FILTERS --- */}
            <div className="flex flex-wrap items-center gap-3">
                <FilterDropdown 
                    label="Region" 
                    options={['North', 'South', 'East', 'West', 'Central']} 
                    active={filters.region}
                    onChange={(val) => handleFilterChange('region', val)}
                />
                <FilterDropdown 
                    label="Gender" 
                    options={['Male', 'Female']} 
                    active={filters.gender}
                    onChange={(val) => handleFilterChange('gender', val)}
                />
                <FilterDropdown 
                    label="Category" 
                    options={['Electronics', 'Clothing', 'Home', 'Beauty']} 
                    active={filters.category}
                    onChange={(val) => handleFilterChange('category', val)}
                />
                
                <div className="ml-auto flex items-center gap-4">
                     <div className="h-8 w-[1px] bg-gray-200"></div>
                     <span className="text-sm text-gray-500 font-medium">Sort by:</span>
                     <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition"
                        onClick={() => setFilters({...filters, sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'})}>
                        {filters.sortBy === 'date' ? 'Date' : 'Amount'} 
                        {filters.sortOrder === 'asc' ? <ChevronDown size={16} className="rotate-180"/> : <ChevronDown size={16}/>}
                     </button>
                </div>
            </div>
        </header>

        <div className="p-10">
            {/* Stats Cards */}
            <div className="flex gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm min-w-[220px]">
                    <p className="text-gray-500 text-sm font-semibold mb-2 uppercase tracking-wide">Total Units</p>
                    <h3 className="text-3xl font-extrabold text-gray-900">{stats.total_orders.toLocaleString()}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm min-w-[260px]">
                    <p className="text-gray-500 text-sm font-semibold mb-2 uppercase tracking-wide">Total Revenue</p>
                    <h3 className="text-3xl font-extrabold text-gray-900">${stats.total_revenue.toLocaleString()}</h3>
                </div>
                
                <button 
                    onClick={() => setShowModal(true)}
                    className="ml-auto bg-gray-900 hover:bg-black text-white px-6 py-4 rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-gray-200 transition transform hover:-translate-y-0.5 self-center">
                    <Plus size={20} /> Add New Sale
                </button>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead className="bg-gray-50/80 border-b border-gray-200">
                            <tr>
                                {['Transaction ID', 'Date', 'Customer Name', 'Phone', 'Gender', 'Category', 'Qty', 'Total Amount', 'Region', 'Status'].map(h => (
                                    <th key={h} className="py-5 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                                ))}
                                <th className="py-5 px-6"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="11" className="p-20 text-center text-gray-400 animate-pulse">Loading data...</td></tr>
                            ) : data.length === 0 ? (
                                <tr><td colSpan="11" className="p-20 text-center text-gray-400">No records found matching filters.</td></tr>
                            ) : data.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50/80 transition group">
                                    <td className="py-4 px-6 text-sm text-blue-600 font-semibold font-mono">#{item._id.slice(-6).toUpperCase()}</td>
                                    <td className="py-4 px-6 text-sm text-gray-600 font-medium">
                                        {new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </td>
                                    <td className="py-4 px-6 text-sm font-semibold text-gray-900">{item.customer_name}</td>
                                    <td className="py-4 px-6 text-sm text-gray-500 font-mono">{item.phone_number}</td>
                                    <td className="py-4 px-6 text-sm text-gray-500">{item.gender}</td>
                                    <td className="py-4 px-6">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-900 font-medium">{item.quantity}</td>
                                    <td className="py-4 px-6 text-sm font-bold text-gray-900">${item.total_amount.toLocaleString()}</td>
                                    <td className="py-4 px-6 text-sm text-gray-500">{item.region}</td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.order_status)}`}>
                                            {item.order_status || 'Completed'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button className="text-gray-300 hover:text-gray-600 transition"><MoreHorizontal size={20} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-auto flex items-center justify-between px-8 py-5 border-t border-gray-200 bg-gray-50/50">
                    <span className="text-sm text-gray-500 font-medium">
                        Page <span className="text-gray-900 font-bold">{pagination.page}</span> of {pagination.pages}
                    </span>
                    <div className="flex gap-2">
                        <button 
                            disabled={pagination.page === 1}
                            onClick={() => setPagination({...pagination, page: pagination.page - 1})}
                            className="p-2.5 border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm">
                            <ChevronLeft size={18} />
                        </button>
                        <button 
                            disabled={pagination.page === pagination.pages}
                            onClick={() => setPagination({...pagination, page: pagination.page + 1})}
                            className="p-2.5 border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </main>

      {/* --- ADD SALE MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity">
          <div className="bg-white p-8 rounded-2xl w-[500px] shadow-2xl transform transition-all scale-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">New Transaction</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Customer Name</label>
                  <input className="w-full border border-gray-300 p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="e.g. John Doe" onChange={e => setNewSale({...newSale, customer_name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-5">
                  <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product</label>
                      <input className="w-full border border-gray-300 p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="e.g. Laptop" onChange={e => setNewSale({...newSale, product_name: e.target.value})} />
                  </div>
                  <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Amount ($)</label>
                      <input type="number" className="w-full border border-gray-300 p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="0.00" onChange={e => setNewSale({...newSale, total_amount: parseFloat(e.target.value)})} />
                  </div>
              </div>
              <button type="submit" className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black hover:shadow-lg transition mt-4">Confirm Transaction</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;