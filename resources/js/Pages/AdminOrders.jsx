import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';

function formatRp(val) {
    return 'Rp ' + Number(val || 0).toLocaleString('id-ID');
}

const tabs = [
    { key: 'all',        label: 'Semua' },
    { key: 'processing', label: 'Perlu Proses' },
    { key: 'shipped',    label: 'Dikirim' },
    { key: 'completed',  label: 'Selesai' },
    { key: 'refund',     label: 'Refund' },
];

const statusConfig = {
    pending:    { label: 'PENDING',     cls: 'bg-gray-100 text-gray-600' },
    processing: { label: 'PROCESSING',  cls: 'bg-yellow-100 text-yellow-700' },
    shipped:    { label: 'SHIPPED',     cls: 'bg-blue-100 text-blue-700' },
    delivered:  { label: 'DELIVERED',   cls: 'bg-cyan-100 text-cyan-700' },
    completed:  { label: 'COMPLETED',   cls: 'bg-emerald-100 text-emerald-700' },
    cancelled:  { label: 'CANCELLED',   cls: 'bg-red-100 text-red-600' },
};

export default function AdminOrders({ orders, filters, counts }) {
    const [activeTab, setActiveTab] = useState(filters?.status || 'all');
    const [processModalOpen, setProcessModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder]       = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        tracking_number: '',
    });

    const switchTab = (key) => {
        setActiveTab(key);
        router.get(route('admin.orders.index'), { status: key }, { preserveState: true, replace: true });
    };

    const openProcessModal = (order) => {
        reset();
        setSelectedOrder(order);
        setProcessModalOpen(true);
    };

    const handleProcess = (e) => {
        e.preventDefault();
        
        if (!data.tracking_number) {
            Swal.fire({
                title: '<span style="font-weight: 600; font-size: 20px; color: #374151;">Error</span>',
                html: '<span style="font-size: 14px; color: #6b7280;">Nomor resi harus diisi!</span>',
                icon: 'error',
                confirmButtonColor: '#3a7d44',
                confirmButtonText: '<span style="font-weight: 500;">Mengerti</span>',
                customClass: {
                    popup: 'rounded-3xl shadow-xl border border-gray-100',
                    confirmButton: 'rounded-xl px-6 py-2.5'
                }
            });
            return;
        }

        Swal.fire({
            title: '<span style="font-weight: 600; font-size: 20px; color: #374151;">Konfirmasi Pengiriman</span>',
            html: `<div style="font-size: 14px; color: #6b7280; margin-bottom: 20px;">Apakah nomor resi berikut sudah benar?</div>
                   <div style="background: #f0fdf4; border: 1px solid #dcfce7; border-radius: 12px; padding: 16px; margin-top: 10px;">
                       <span style="font-size: 22px; color: #166534; font-weight: 600; letter-spacing: 1px;">${data.tracking_number}</span><br>
                       <span style="font-size: 12px; color: #15803d; margin-top: 4px; display: block;">Kurir: ${selectedOrder.courier_code}</span>
                   </div>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3b82f6',
            cancelButtonColor: '#f3f4f6',
            confirmButtonText: '<span style="font-weight: 500;">Ya, Kirim Sekarang!</span>',
            cancelButtonText: '<span style="color: #4b5563; font-weight: 500;">Periksa Lagi</span>',
            reverseButtons: true,
            customClass: {
                popup: 'rounded-3xl shadow-xl border border-gray-100',
                confirmButton: 'rounded-xl px-6 py-2.5',
                cancelButton: 'rounded-xl px-6 py-2.5',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                post(route('admin.orders.process', selectedOrder.order_id), {
                    onSuccess: () => { 
                        setProcessModalOpen(false); 
                        reset(); 
                        Swal.fire({
                            title: '<span style="font-weight: 600; font-size: 20px; color: #374151;">Berhasil!</span>', 
                            html: '<span style="font-size: 14px; color: #6b7280;">Status pesanan diperbarui menjadi Dikirim.</span>', 
                            icon: 'success',
                            confirmButtonColor: '#3b82f6',
                            confirmButtonText: '<span style="font-weight: 500;">Tutup</span>',
                            customClass: {
                                popup: 'rounded-3xl shadow-xl border border-gray-100',
                                confirmButton: 'rounded-xl px-6 py-2.5'
                            }
                        });
                    },
                });
            }
        });
    };

    const orderList    = orders?.data  ?? [];
    const pagLinks     = orders?.links ?? [];

    return (
        <AdminLayout pageTitle="Admin Panel">
            <Head title="" />

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                {/* Header */}
                <div className="mb-5">
                    <h2 className="text-xl font-bold text-gray-800">Pesanan Masuk</h2>
                    <p className="text-gray-400 text-xs mt-1">Kelola pengiriman dan update status pesanan.</p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => switchTab(tab.key)}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                                activeTab === tab.key
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                        >
                            {tab.label}
                            {counts && counts[tab.key] !== undefined && (
                                <span className={`ml-1.5 text-[10px] font-bold ${activeTab === tab.key ? 'opacity-80' : 'text-gray-400'}`}>
                                    ({counts[tab.key]})
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="overflow-x-auto border border-gray-100 rounded-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                                <th className="px-5 py-3.5">Order ID</th>
                                <th className="px-5 py-3.5">Customer</th>
                                <th className="px-5 py-3.5">Total</th>
                                <th className="px-5 py-3.5">Status</th>
                                <th className="px-5 py-3.5">Resi</th>
                                <th className="px-5 py-3.5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            {orderList.length > 0 ? orderList.map(order => {
                                const sc = statusConfig[order.status] ?? { label: order.status, cls: 'bg-gray-100 text-gray-600' };
                                return (
                                    <tr key={order.order_id} className="hover:bg-gray-50/60 transition-colors">
                                        <td className="px-5 py-4">
                                            <p className="text-emerald-600 font-mono text-xs font-bold">
                                                ORD-{String(order.order_id).padStart(8, '0')}
                                            </p>
                                            <p className="text-gray-400 text-[11px] mt-0.5">{order.created_at}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-gray-800">{order.customer_name}</p>
                                            <p className="text-gray-400 text-[11px] mt-0.5 max-w-[180px] truncate">{order.customer_address}</p>
                                        </td>
                                        <td className="px-5 py-4 font-bold text-gray-800">{formatRp(order.final_amount)}</td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${sc.cls}`}>
                                                {sc.label}
                                            </span>
                                            {order.has_refund && (
                                                <p className="mt-1">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-500">
                                                        Refund: {order.refund_status}
                                                    </span>
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 text-xs text-gray-500 font-mono">
                                            {order.tracking_number ?? <span className="text-gray-300">—</span>}
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="inline-flex items-center gap-2">
                                                {order.status === 'processing' && (
                                                    <button
                                                        onClick={() => openProcessModal(order)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Proses
                                                    </button>
                                                )}
                                                {(order.status === 'shipped' || order.status === 'delivered' || order.status === 'completed') && (
                                                    <span className="text-xs text-gray-400 italic">Selesai/Dikirim</span>
                                                )}
                                                {order.status === 'pending' && (
                                                    <span className="text-xs text-gray-400 italic">Menunggu Bayar</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-sm">
                                        Tidak ada pesanan dalam kategori ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination info + links */}
                {orders?.total > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5">
                        <p className="text-xs text-gray-400">
                            Menampilkan {orders.from} sampai {orders.to} dari {orders.total} hasil
                        </p>
                        <div className="flex flex-wrap items-center gap-1">
                            {pagLinks.map((link, idx) => {
                                if (!link.url) return null;
                                return (
                                    <Link
                                        key={idx}
                                        href={link.url}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                            link.active
                                                ? 'bg-emerald-600 text-white shadow-sm'
                                                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Process Modal */}
            {processModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        
                        {/* Header */}
                        <div className="px-6 py-4 flex items-start justify-between bg-white z-10 border-b border-gray-100">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Detail Pesanan</h3>
                                <p className="text-xs text-gray-500 font-mono mt-0.5">ID: ORD-{String(selectedOrder.order_id).padStart(8, '0')}</p>
                            </div>
                            <button onClick={() => setProcessModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Scrollable Body */}
                        <div className="px-6 py-5 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
                            
                            {/* Shipping Info */}
                            <div className="bg-emerald-50/50 border border-emerald-100/70 rounded-2xl p-4 mb-6">
                                <h4 className="text-emerald-700 text-xs font-bold mb-2">Informasi Pengiriman</h4>
                                <p className="text-sm font-bold text-gray-800">{selectedOrder.customer_name}</p>
                                <p className="text-xs text-gray-600 leading-relaxed mt-1">{selectedOrder.customer_address}</p>
                            </div>

                            {/* Items List */}
                            <div className="mb-6">
                                <h4 className="text-sm font-bold text-gray-800 mb-3">Barang yang Dibeli ({selectedOrder.items?.length || 0} Item)</h4>
                                <div className="space-y-4">
                                    {selectedOrder.items?.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 items-center">
                                            <div className="w-12 h-12 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm flex items-center justify-center p-1">
                                                {item.image_url ? (
                                                    <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover rounded-lg" />
                                                ) : (
                                                    <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className="text-sm font-bold text-gray-800 truncate">{item.product_name}</h5>
                                                <p className="text-xs text-gray-500 mt-0.5">{item.quantity} x Rp {Number(item.price).toLocaleString('id-ID')}</p>
                                            </div>
                                            <div className="text-sm font-bold text-gray-800 flex-shrink-0">
                                                Rp {Number(item.quantity * item.price).toLocaleString('id-ID')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Form Proses */}
                            <div className="bg-blue-50/40 border border-blue-100 rounded-2xl p-5 mb-2">
                                <div className="flex items-center gap-2.5 mb-5">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                    </svg>
                                    <h4 className="text-sm font-bold text-blue-900">Proses Pengiriman</h4>
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">PILIH JASA KURIR</label>
                                    <div className="relative">
                                        <select disabled className="w-full appearance-none px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 outline-none cursor-not-allowed">
                                            <option>{selectedOrder.courier_code}</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">NOMOR RESI</label>
                                    <input
                                        type="text"
                                        value={data.tracking_number}
                                        onChange={e => setData('tracking_number', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm outline-none bg-white"
                                        placeholder="Contoh: JP1234567890"
                                        autoFocus
                                        required
                                    />
                                    {errors.tracking_number && <p className="text-red-500 text-xs mt-1.5">{errors.tracking_number}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-white border-t border-gray-100 flex items-center justify-between z-10">
                            <div>
                                <p className="text-[11px] text-gray-500 mb-0.5">Total Tagihan</p>
                                <p className="text-lg font-extrabold text-emerald-500">Rp {Number(selectedOrder.final_amount).toLocaleString('id-ID')}</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setProcessModalOpen(false)}
                                    className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full text-sm font-bold transition-colors"
                                >
                                    Tutup
                                </button>
                                <button
                                    type="button"
                                    onClick={handleProcess}
                                    disabled={processing}
                                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-bold transition-colors shadow-sm shadow-blue-200 disabled:opacity-70 flex items-center gap-2"
                                >
                                    {processing && (
                                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    )}
                                    Kirim Barang Sekarang
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
