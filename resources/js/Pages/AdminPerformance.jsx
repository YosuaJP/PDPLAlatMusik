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

export default function AdminPerformance({ products, categories, category_performance, stats, filters }) {
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
    const categoryList = category_performance ?? [];

    return (
        <AdminLayout pageTitle="Performa Produk & Kategori">
            <Head title="Performa Produk — Admin" />

            {/* Filter Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mb-6 print:hidden">
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
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                        </svg>
                        Terapkan Filter
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <StatCard
                    label="Total Produk"
                    value={stats?.total_products ?? 0}
                    color="bg-white border-gray-100 text-emerald-600 shadow-sm"
                />
                <StatCard
                    label="Total Terjual"
                    value={`${Number(stats?.total_sold ?? 0).toLocaleString('id-ID')} Unit`}
                    color="bg-blue-50 border-blue-100 text-blue-600 shadow-sm"
                />
                <StatCard
                    label="Total Pendapatan"
                    value={formatRp(stats?.total_revenue ?? 0)}
                    color="bg-purple-50 border-purple-100 text-purple-600 shadow-sm"
                />
            </div>

            {/* Laporan Performa Kategori (Orang 2) */}
            {categoryList.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                    <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Laporan Performa Per Kategori</h3>
                    </div>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                                <th className="px-6 py-3.5">Nama Kategori</th>
                                <th className="px-6 py-3.5 text-center">Unit Terjual</th>
                                <th className="px-6 py-3.5 text-right">Total Omzet</th>
                                <th className="px-6 py-3.5 text-center">Rata-Rata Rating</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xs">
                            {categoryList.map(cat => (
                                <tr key={cat.category_id} className="hover:bg-gray-50/40 transition-colors">
                                    <td className="px-6 py-3.5 font-bold text-gray-800">{cat.category_name}</td>
                                    <td className="px-6 py-3.5 text-center font-semibold text-blue-600">{cat.total_sold} Unit</td>
                                    <td className="px-6 py-3.5 text-right font-bold text-emerald-600">{formatRp(cat.total_revenue)}</td>
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center justify-center gap-1">
                                            <svg className="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <span className="font-bold text-gray-700">{cat.avg_rating > 0 ? cat.avg_rating.toFixed(1) : '—'}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Individual Product Performance Search & Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex flex-wrap justify-between items-center gap-4">
                    <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Performa Produk Individual</h3>
                    
                    {/* Search Bar */}
                    <div className="w-full sm:w-80 print:hidden">
                        <input
                            type="text"
                            placeholder="Cari nama atau SKU..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && applyFilter()}
                            className="w-full px-3 py-1.5 border border-gray-200 rounded-xl text-xs focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all bg-white"
                        />
                    </div>
                </div>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                            <th className="px-6 py-4">Produk</th>
                            <th className="px-6 py-4">Harga</th>
                            <th className="px-6 py-4 text-center">Rating Ulasan</th>
                            <th className="px-6 py-4 text-center">Unit Terjual</th>
                            <th className="px-6 py-4 text-right">Total Pendapatan</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs">
                        {productList.length > 0 ? productList.map(p => (
                            <tr key={p.product_id} className="hover:bg-gray-50/40 transition-colors">
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
                                            <p className="font-bold text-gray-800 leading-tight">{p.name}</p>
                                            <p className="text-gray-400 text-[10px] font-mono mt-0.5">{p.sku || '—'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-700 font-semibold">{formatRp(p.price)}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-1">
                                        <svg className="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="font-bold text-gray-700">{p.avg_rating > 0 ? p.avg_rating.toFixed(1) : '—'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${p.total_sold > 0 ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                                        {p.total_sold} Unit
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className={`font-bold ${p.total_revenue > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>
                                        {formatRp(p.total_revenue)}
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-gray-400">Tidak ada data produk.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
