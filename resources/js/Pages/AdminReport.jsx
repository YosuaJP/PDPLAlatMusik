import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

function formatRp(val) {
    return 'Rp ' + Number(val || 0).toLocaleString('id-ID');
}

const statusColor = {
    processing: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    shipped:    'bg-blue-50 text-blue-700 border-blue-100',
    delivered:  'bg-cyan-50 text-cyan-700 border-cyan-100',
    completed:  'bg-emerald-50 text-emerald-700 border-emerald-100',
};

const statusLabel = {
    processing: 'Processing',
    shipped:    'Shipped',
    delivered:  'Delivered',
    completed:  'Completed',
};

export default function AdminReport({ 
    orders, 
    total_revenue, 
    total_gateway_fee, 
    net_revenue, 
    total_transaksi, 
    method_breakdown, 
    daily_data, 
    server_notifications, 
    filters 
}) {
    const [startDate, setStartDate] = useState(filters?.start_date || '');
    const [endDate,   setEndDate]   = useState(filters?.end_date   || '');

    const applyFilter = () => {
        router.get(route('admin.reports.index'), { start_date: startDate, end_date: endDate }, { preserveState: true, replace: true });
    };

    const handlePrint = () => window.print();

    const orderList = orders ?? [];
    
    // Tentukan nilai maksimum untuk grafik agar skala pas
    const revenues = (daily_data ?? []).map(d => d.revenue) ?? [];
    const maxVal = revenues.length > 0 ? Math.max(...revenues, 50000) : 50000;

    return (
        <AdminLayout pageTitle="Rekonsiliasi Keuangan">
            <Head title="Rekonsiliasi Keuangan & Laporan — Admin" />

            {/* Server-Side Notifications Feed (Orang 1) */}
            {server_notifications && server_notifications.length > 0 && (
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-5 shadow-lg mb-6 text-white print:hidden">
                    <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-slate-700">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Notifikasi Server-Side Real-Time</h3>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400 bg-slate-700/60 px-2 py-0.5 rounded-full">
                            {server_notifications.length} Info
                        </span>
                    </div>
                    <div className="space-y-2 max-h-28 overflow-y-auto pr-2 custom-scrollbar">
                        {server_notifications.map((notif) => (
                            <div key={notif.id} className="flex justify-between items-start gap-4 bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/50 hover:bg-slate-800/80 transition-colors">
                                <p className="text-xs text-emerald-400 font-medium">{notif.message}</p>
                                <span className="text-[9px] text-slate-500 font-mono whitespace-nowrap">{new Date(notif.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Filter */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mb-6 print:hidden">
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
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                        </svg>
                        Terapkan Filter
                    </button>
                    <button
                        onClick={handlePrint}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Cetak Laporan (PDF)
                    </button>
                </div>
            </div>

            {/* Financial Summary Cards (Orang 2) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <p className="text-xs font-semibold text-emerald-600 mb-1">Total Omzet Kotor</p>
                    <p className="text-2xl font-bold text-gray-900">{formatRp(total_revenue)}</p>
                    <span className="text-[10px] text-gray-400 font-medium">Berdasarkan total transaksi lunas</span>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <p className="text-xs font-semibold text-amber-600 mb-1">Total Biaya Gateway</p>
                    <p className="text-2xl font-bold text-gray-900">{formatRp(total_gateway_fee)}</p>
                    <span className="text-[10px] text-gray-400 font-medium">Potongan fee payment gateway</span>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm bg-gradient-to-br from-emerald-50 to-white">
                    <p className="text-xs font-semibold text-emerald-700 mb-1">Pendapatan Bersih</p>
                    <p className="text-2xl font-bold text-emerald-600">{formatRp(net_revenue)}</p>
                    <span className="text-[10px] text-gray-500 font-medium">Omzet Kotor - Biaya Gateway</span>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <p className="text-xs font-semibold text-blue-600 mb-1">Total Transaksi</p>
                    <p className="text-2xl font-bold text-gray-900">{total_transaksi} <span className="text-xs font-medium text-gray-400">Order</span></p>
                    <span className="text-[10px] text-gray-400 font-medium">Total transaksi sukses</span>
                </div>
            </div>

            {/* Daily Chart: Revenue vs Gateway Fee (Orang 2) — Fixed */}
            {daily_data && daily_data.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6 print:hidden">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Grafik Pendapatan vs Biaya Gateway</h3>

                    {/* Chart area */}
                    <div style={{ height: '200px', position: 'relative', display: 'flex', alignItems: 'flex-end', gap: '12px', overflow: 'hidden' }}>
                        {daily_data.map((day, idx) => {
                            const CHART_H = 180; // pixel tinggi maksimum batang
                            const revH   = Math.max(Math.round((day.revenue      / maxVal) * CHART_H), 4);
                            const feeH   = Math.max(Math.round((day.gateway_fee  / maxVal) * CHART_H), 4);

                            return (
                                <div
                                    key={idx}
                                    style={{ flex: '1', minWidth: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', position: 'relative' }}
                                    className="group"
                                >
                                    {/* Batang-batang berdampingan */}
                                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', width: '100%', justifyContent: 'center' }}>

                                        {/* Batang Omzet (hijau) */}
                                        <div style={{ position: 'relative' }}>
                                            <div
                                                style={{
                                                    width: '18px',
                                                    height: `${revH}px`,
                                                    backgroundColor: '#10b981',
                                                    borderRadius: '4px 4px 0 0',
                                                    transition: 'opacity 0.2s',
                                                    cursor: 'pointer',
                                                }}
                                                className="hover:opacity-80"
                                            />
                                            {/* Tooltip Omzet */}
                                            <div style={{
                                                position: 'absolute', bottom: `${revH + 6}px`, left: '50%', transform: 'translateX(-50%)',
                                                background: '#0f172a', color: '#fff', fontSize: '9px', padding: '3px 8px',
                                                borderRadius: '6px', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 30,
                                            }} className="hidden group-hover:block">
                                                Omzet: {formatRp(day.revenue)}
                                            </div>
                                        </div>

                                        {/* Batang Biaya Gateway (oranye) */}
                                        <div style={{ position: 'relative' }}>
                                            <div
                                                style={{
                                                    width: '10px',
                                                    height: `${feeH}px`,
                                                    backgroundColor: '#f59e0b',
                                                    borderRadius: '4px 4px 0 0',
                                                    transition: 'opacity 0.2s',
                                                    cursor: 'pointer',
                                                }}
                                                className="hover:opacity-80"
                                            />
                                            {/* Tooltip Fee */}
                                            <div style={{
                                                position: 'absolute', bottom: `${feeH + 6}px`, left: '50%', transform: 'translateX(-50%)',
                                                background: '#0f172a', color: '#fff', fontSize: '9px', padding: '3px 8px',
                                                borderRadius: '6px', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 30,
                                            }} className="hidden group-hover:block">
                                                Fee: {formatRp(day.gateway_fee)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Label tanggal */}
                                    <span style={{ fontSize: '10px', color: '#9ca3af', fontWeight: '700', marginTop: '8px', fontFamily: 'monospace' }}>
                                        {day.date}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Garis sumbu-X */}
                    <div style={{ borderTop: '1px solid #f3f4f6', marginTop: '-1px' }} />

                    {/* Legenda */}
                    <div className="flex gap-4 mt-4 text-[10px] font-bold text-gray-500 justify-end">
                        <div className="flex items-center gap-1.5">
                            <span style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '3px', display: 'inline-block' }} />
                            <span>Omzet Kotor</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span style={{ width: '12px', height: '12px', backgroundColor: '#f59e0b', borderRadius: '3px', display: 'inline-block' }} />
                            <span>Biaya Gateway</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Detailed Reconciliation Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                    <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Tabel Rekonsiliasi Transaksi</h3>
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">Terverifikasi</span>
                </div>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                            <th className="px-6 py-4">Invoice</th>
                            <th className="px-6 py-4">Tanggal</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Payment</th>
                            <th className="px-6 py-4 text-right">Omzet Kotor</th>
                            <th className="px-6 py-4 text-right">Fee Gateway</th>
                            <th className="px-6 py-4 text-right">Bersih</th>
                            <th className="px-6 py-4 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs">
                        {orderList.length > 0 ? orderList.map(o => (
                            <tr key={o.order_id} className="hover:bg-gray-50/40 transition-colors">
                                <td className="px-6 py-4 font-mono text-emerald-600 font-bold">
                                    ORD-{String(o.order_id).padStart(8, '0')}
                                </td>
                                <td className="px-6 py-4 text-gray-500">{o.created_at}</td>
                                <td className="px-6 py-4 font-semibold text-gray-700">{o.customer}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-bold uppercase text-[9px]">
                                        {o.payment_method}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-gray-800">{formatRp(o.final_amount)}</td>
                                <td className="px-6 py-4 text-right font-bold text-amber-600">{formatRp(o.gateway_fee)}</td>
                                <td className="px-6 py-4 text-right font-bold text-emerald-600">{formatRp(o.net_amount)}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${statusColor[o.status] ?? 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                                        {statusLabel[o.status] ?? o.status}
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={8} className="px-6 py-10 text-center text-gray-400 text-sm italic">
                                    Tidak ada data penjualan pada tanggal yang dipilih.
                                </td>
                            </tr>
                        )}
                    </tbody>
                    {orderList.length > 0 && (
                        <tfoot>
                            <tr className="bg-gray-50/80 border-t-2 border-gray-100 text-xs font-bold text-gray-700">
                                <td colSpan={4} className="px-6 py-3 uppercase tracking-wider text-gray-500 text-[10px]">Total Periode Ini</td>
                                <td className="px-6 py-3 text-right text-gray-800">{formatRp(total_revenue)}</td>
                                <td className="px-6 py-3 text-right text-amber-600">{formatRp(total_gateway_fee)}</td>
                                <td className="px-6 py-3 text-right text-emerald-600 text-sm">{formatRp(net_revenue)}</td>
                                <td className="px-6 py-3"></td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>

            {/* Payment Method Summary */}
            {Object.keys(method_breakdown ?? {}).length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:hidden">
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Breakdown Metode Pembayaran</h3>
                        <div className="space-y-3">
                            {Object.entries(method_breakdown).map(([method, data]) => (
                                <div key={method} className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                                    <div>
                                        <p className="text-xs font-bold text-gray-700 uppercase">{method}</p>
                                        <p className="text-[10px] text-gray-400">{data.count} Transaksi</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-emerald-600">{formatRp(data.revenue)}</p>
                                        <p className="text-[9px] text-amber-600 font-medium">Fee: {formatRp(data.fee)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
