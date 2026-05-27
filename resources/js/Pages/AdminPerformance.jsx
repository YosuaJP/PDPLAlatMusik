import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

function formatRp(val) {
    return 'Rp ' + Number(val || 0).toLocaleString('id-ID');
}

function StatCard({ label, value, color }) {
    return (
        <div className={`rounded-xl border p-5 ${color}`}>
            <p className="text-xs font-semibold text-current opacity-70 mb-1">{label}</p>
            <p className="text-2xl font-bold text-current">{value}</p>
        </div>
    );
}

export default function AdminPerformance({ products, categories, stats, filters }) {
    const [startDate,  setStartDate]  = useState(filters?.start_date  || '');
    const [endDate,    setEndDate]    = useState(filters?.end_date    || '');
    const [categoryId, setCategoryId] = useState(filters?.category_id || '');
    const [search,     setSearch]     = useState(filters?.search      || '');

    const applyFilter = () => {
        router.get(route('admin.performance.index'), {
            start_date:  startDate,
            end_date:    endDate,
            category_id: categoryId,
            search,
        }, { preserveState: true, replace: true });
    };

    const productList = products ?? [];

    return (
        <AdminLayout pageTitle="Performa Produk">
            <Head title="Performa Produk — Admin" />

            {/* Filter Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mb-5">
                <div className="flex flex-wrap gap-4 items-end">
                    <div>
                        <label className="block text-gray-500 text-[11px] font-bold uppercase tracking-wider mb-1.5">Dari Tanggal</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            className="px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-500 text-[11px] font-bold uppercase tracking-wider mb-1.5">Sampai Tanggal</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            className="px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-500 text-[11px] font-bold uppercase tracking-wider mb-1.5">Kategori</label>
                        <select
                            value={categoryId}
                            onChange={e => setCategoryId(e.target.value)}
                            className="px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all"
                        >
                            <option value="">-- Semua Kategori --</option>
                            {categories.map(c => (
                                <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={applyFilter}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-bold transition-all"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                        </svg>
                        Terapkan Filter
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-5">
                <input
                    type="text"
                    placeholder="Cari produk berdasarkan nama atau SKU..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && applyFilter()}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all bg-white shadow-sm"
                />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                <StatCard
                    label="Total Produk"
                    value={stats?.total_products ?? 0}
                    color="bg-white border-gray-100 text-emerald-600"
                />
                <StatCard
                    label="Total Terjual"
                    value={`${Number(stats?.total_sold ?? 0).toLocaleString('id-ID')} Unit`}
                    color="bg-blue-50 border-blue-100 text-blue-600"
                />
                <StatCard
                    label="Total Pendapatan"
                    value={formatRp(stats?.total_revenue ?? 0)}
                    color="bg-purple-50 border-purple-100 text-purple-600"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                            <th className="px-6 py-4">Produk</th>
                            <th className="px-6 py-4">Harga</th>
                            <th className="px-6 py-4">Terjual</th>
                            <th className="px-6 py-4 text-right">Pendapatan</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {productList.length > 0 ? productList.map(p => (
                            <tr key={p.product_id} className="hover:bg-gray-50/60 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg border border-gray-100 overflow-hidden flex items-center justify-center bg-gray-50 flex-shrink-0">
                                            {p.image_url ? (
                                                <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                                                </svg>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{p.name}</p>
                                            <p className="text-gray-400 text-xs font-mono">{p.sku || '—'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-700 font-medium">{formatRp(p.price)}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${p.total_sold > 0 ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                                        {p.total_sold} Unit
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className={`font-bold text-sm ${p.total_revenue > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>
                                        {formatRp(p.total_revenue)}
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-gray-400">Tidak ada data produk.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
