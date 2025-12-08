import React, { useState, useEffect } from 'react';
import { fetchSales, getPrediction, addSale, fetchStats } from './services/api';
import { 
  Search, ChevronDown, Plus, MoreHorizontal, 
  LayoutDashboard, ShoppingCart, FileText, Settings, 
  Users, LogOut, ChevronLeft, ChevronRight, Filter
} from 'lucide-react';

const App = () => {
  // --- STATE ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total_revenue: 0, total_orders: 0, avg_order_value: 0 });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [showModal, setShowModal] = useState(false);
  
  // Filters State
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
    const result = await fetchSales({ ...filters, page: pagination.page });
    setData(result.data);
    setPagination({ ...pagination, total: result.total, pages: result.pages });
    setLoading(false);
  };

  const loadStats = async () => {
    const result = await fetchStats();
    setStats(result);
  };

  const handleFilterChange = (key, value) => {
    // For single select dropdown style (simpler for this layout)
    setFilters({ ...filters, [key]: [value] });
    setPagination({ ...pagination, page: 1 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addSale(newSale);
    setShowModal(false);
    loadData();
    loadStats();
  };

  // Helper for "Figma-style" dropdown button
  const FilterDropdown = ({ label, options, active, onChange }) => (
    <div className="relative group">
      <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-gray-300 transition min-w-[140px] justify-between">
        <span>{active.length > 0 ? active[0] : label}</span>
        <ChevronDown size={14} className="text-gray-400" />
      </button>
      {/* Dropdown Content (Hidden by default, shown on hover/focus) */}
      <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-100 shadow-lg rounded-lg hidden group-hover:block z-20 py-1">
        <div 
            className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-500"
            onClick={() => onChange([])} // Reset
        >
            All
        </div>
        {options.map(opt => (
          <div 
            key={opt} 
            className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
            onClick={() => onChange([opt])}
          >
            {opt}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] font-sans">
      
      {/* --- SIDEBAR (Dark, as per "Main Screen") --- */}
      <aside className="w-64 bg-[#1E1E2D] text-white flex flex-col flex-shrink-0 sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">V</div>
          <span className="text-xl font-bold tracking-tight">Vault</span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <div className="flex items-center gap-3 px-4 py-3 bg-blue-600 rounded-lg text-white cursor-pointer shadow-md">
            <LayoutDashboard size={18} /> <span className="text-sm font-medium">Sales Management</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer transition">
            <ShoppingCart size={18} /> <span className="text-sm font-medium">Products</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer transition">
            <Users size={18} /> <span className="text-sm font-medium">Customers</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer transition">
            <FileText size={18} /> <span className="text-sm font-medium">Invoices</span>
          </div>
        </nav>

        <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white cursor-pointer">
                <Settings size={18} /> <span className="text-sm">Settings</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 cursor-pointer">
                <LogOut size={18} /> <span className="text-sm">Log Out</span>
            </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 min-w-0 flex flex-col">
        
        {/* Header Section */}
        <header className="bg-white border-b border-gray-200 px-8 py-5">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Sales Management System</h1>
                
                {/* Search Bar (Top Right) */}
                <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Name, Phone no..." 
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm transition"
                        onChange={(e) => { setFilters({ ...filters, search: e.target.value }); setPagination({ ...pagination, page: 1 }); }}
                    />
                </div>
            </div>

            {/* --- HORIZONTAL FILTER BAR (Key Figma Feature) --- */}
            <div className="flex flex-wrap items-center gap-3">
                <FilterDropdown 
                    label="Customer Region" 
                    options={['North', 'South', 'East', 'West']} 
                    active={filters.region}
                    onChange={(val) => setFilters({...filters, region: val})}
                />
                <FilterDropdown 
                    label="Gender" 
                    options={['Male', 'Female']} 
                    active={filters.gender}
                    onChange={(val) => setFilters({...filters, gender: val})}
                />
                <FilterDropdown 
                    label="Category" 
                    options={['Electronics', 'Clothing', 'Home', 'Beauty']} 
                    active={filters.category}
                    onChange={(val) => setFilters({...filters, category: val})}
                />
                
                <div className="ml-auto flex items-center gap-3">
                     <span className="text-sm text-gray-500">Sort by:</span>
                     <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600"
                        onClick={() => setFilters({...filters, sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'})}>
                        {filters.sortBy === 'date' ? 'Date' : 'Amount'} 
                        {filters.sortOrder === 'asc' ? <ChevronDown size={14} className="rotate-180"/> : <ChevronDown size={14}/>}
                     </button>
                </div>
            </div>
        </header>

        <div className="p-8">
            {/* --- STATS CARDS (Figma Style) --- */}
            <div className="flex gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-w-[200px]">
                    <p className="text-gray-500 text-sm font-medium mb-2">Total Unit Sold</p>
                    <h3 className="text-3xl font-bold text-gray-900">{stats.total_orders.toLocaleString()}</h3>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-w-[240px]">
                    <p className="text-gray-500 text-sm font-medium mb-2">Total Revenue</p>
                    <h3 className="text-3xl font-bold text-gray-900">${stats.total_revenue.toLocaleString()}</h3>
                </div>
                
                {/* Add Sale Button (Floating right or inline) */}
                <button 
                    onClick={() => setShowModal(true)}
                    className="ml-auto bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg transition h-fit self-center">
                    <Plus size={20} /> Add New Sale
                </button>
            </div>

            {/* --- TABLE (Wide & Spacious) --- */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead className="bg-gray-50/50 border-b border-gray-200">
                            <tr>
                                {['Transaction ID', 'Date', 'Customer Name', 'Phone', 'Gender', 'Category', 'Qty', 'Total Amount', 'Region'].map(h => (
                                    <th key={h} className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                                ))}
                                <th className="py-4 px-6"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="9" className="p-10 text-center text-gray-400">Loading data...</td></tr>
                            ) : data.length === 0 ? (
                                <tr><td colSpan="9" className="p-10 text-center text-gray-400">No records found.</td></tr>
                            ) : data.map((item, idx) => (
                                <tr key={item._id} className="hover:bg-gray-50 transition group">
                                    <td className="py-4 px-6 text-sm text-blue-600 font-medium">#{item._id.slice(-6).toUpperCase()}</td>
                                    <td className="py-4 px-6 text-sm text-gray-600">
                                        {new Date(item.date).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{item.customer_name}</td>
                                    <td className="py-4 px-6 text-sm text-gray-500">{item.phone_number}</td>
                                    <td className="py-4 px-6 text-sm text-gray-500">{item.gender}</td>
                                    <td className="py-4 px-6">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-900">{item.quantity}</td>
                                    <td className="py-4 px-6 text-sm font-bold text-gray-900">${item.total_amount.toLocaleString()}</td>
                                    <td className="py-4 px-6 text-sm text-gray-500">{item.region}</td>
                                    <td className="py-4 px-6 text-right">
                                        <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/50">
                    <span className="text-sm text-gray-500">
                        Page <span className="font-medium text-gray-900">{pagination.page}</span> of {pagination.pages}
                    </span>
                    <div className="flex gap-2">
                        <button 
                            disabled={pagination.page === 1}
                            onClick={() => setPagination({...pagination, page: pagination.page - 1})}
                            className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition bg-white text-gray-600">
                            <ChevronLeft size={16} />
                        </button>
                        <div className="flex items-center gap-1">
                            {[...Array(Math.min(5, pagination.pages))].map((_, i) => (
                                <button 
                                    key={i}
                                    onClick={() => setPagination({...pagination, page: i + 1})}
                                    className={`w-8 h-8 rounded-lg text-sm font-medium transition ${pagination.page === i + 1 ? 'bg-black text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button 
                            disabled={pagination.page === pagination.pages}
                            onClick={() => setPagination({...pagination, page: pagination.page + 1})}
                            className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition bg-white text-gray-600">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </main>

      {/* --- ADD SALE MODAL (Hidden by default) --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl w-[500px] shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">New Transaction</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input className="w-full border p-3 rounded-lg bg-gray-50" placeholder="Customer Name" onChange={e => setNewSale({...newSale, customer_name: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                  <input className="border p-3 rounded-lg bg-gray-50" placeholder="Product" onChange={e => setNewSale({...newSale, product_name: e.target.value})} />
                  <input className="border p-3 rounded-lg bg-gray-50" type="number" placeholder="Amount" onChange={e => setNewSale({...newSale, total_amount: parseFloat(e.target.value)})} />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border rounded-xl hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-black text-white rounded-xl hover:bg-gray-800">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;