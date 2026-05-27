import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

function formatRp(val) {
    return 'Rp ' + Number(val || 0).toLocaleString('id-ID');
}

const statusColor = {
    processing: 'bg-yellow-100 text-yellow-700',
    shipped:    'bg-blue-100 text-blue-700',
    delivered:  'bg-cyan-100 text-cyan-700',
    completed:  'bg-emerald-100 text-emerald-700',
};

const statusLabel = {
    processing: 'Processing',
    shipped:    'Shipped',
    delivered:  'Delivered',
    completed:  'Completed',
};

export default function AdminReport({ orders, total_revenue, total_transaksi, filters }) {
    const [startDate, setStartDate] = useState(filters?.start_date || '');
    const [endDate,   setEndDate]   = useState(filters?.end_date   || '');

    const applyFilter = () => {
        router.get(route('admin.reports.index'), { start_date: startDate, end_date: endDate }, { preserveState: true, replace: true });
    };

    const handlePrint = () => window.print();

    const orderList = orders ?? [];

    return (
        <AdminLayout pageTitle="Laporan Penjualan">
            <Head title="Laporan Penjualan — Admin" />

            {/* Filter */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mb-5">
                <div className="flex flex-wrap items-end gap-4">
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
                    <button
                        onClick={applyFilter}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-bold transition-all"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                        </svg>
                        Terapkan Filter
                    </button>
                    <button
                        onClick={handlePrint}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Cetak Laporan (PDF)
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <p className="text-xs font-semibold text-emerald-600 mb-1">Total Omzet Periode Ini</p>
                    <p className="text-3xl font-bold text-gray-900">{formatRp(total_revenue)}</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <p className="text-xs font-semibold text-blue-600 mb-1">Total Transaksi</p>
                    <p className="text-3xl font-bold text-gray-900">{total_transaksi} <span className="text-base font-medium text-gray-400">Order</span></p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                            <th className="px-6 py-4">Tanggal</th>
                            <th className="px-6 py-4">Invoice</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {orderList.length > 0 ? orderList.map(o => (
                            <tr key={o.order_id} className="hover:bg-gray-50/60 transition-colors">
                                <td className="px-6 py-4 text-gray-500 text-xs">{o.created_at}</td>
                                <td className="px-6 py-4 font-mono text-emerald-600 font-semibold text-xs">
                                    ORD-{String(o.order_id).padStart(8, '0')}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-700">{o.customer}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${statusColor[o.status] ?? 'bg-gray-100 text-gray-500'}`}>
                                        {statusLabel[o.status] ?? o.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-gray-800">{formatRp(o.final_amount)}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-gray-400 text-sm italic">
                                    Tidak ada data penjualan pada tanggal yang dipilih.
                                </td>
                            </tr>
                        )}
                    </tbody>
                    {orderList.length > 0 && (
                        <tfoot>
                            <tr className="bg-gray-50 border-t-2 border-gray-100">
                                <td colSpan={4} className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</td>
                                <td className="px-6 py-3 text-right font-bold text-emerald-600 text-sm">{formatRp(total_revenue)}</td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
        </AdminLayout>
    );
}
