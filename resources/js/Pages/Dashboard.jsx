import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard({ stats, recentOrders, lowStockProducts, topProducts, pendingOrdersList }) {
    const { auth } = usePage().props;
    const [processModalOpen, setProcessModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        tracking_number: '',
    });

    const openProcessModal = (order) => {
        reset();
        setSelectedOrder(order);
        setProcessModalOpen(true);
    };

    const handleProcess = (e) => {
        e.preventDefault();
        post(route('admin.orders.process', selectedOrder.order_id), {
            onSuccess: () => { setProcessModalOpen(false); reset(); },
        });
    };

    const defaultStats = stats ?? {
        total_orders: 0,
        total_revenue: 0,
        total_products: 0,
        pending_orders: 0,
        total_customers: 0,
    };

    const formattedRevenue = 'Rp ' + Number(defaultStats.total_revenue).toLocaleString('id-ID');

    return (
        <AdminLayout pageTitle="Overview">
            <Head title="Dashboard Admin — Melodi POS" />

            {/* Welcome banner */}
            <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
                    Halo, Bos {auth?.user?.name ?? 'Admin'}! 👋
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                    Berikut ringkasan performa toko hari ini.
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Revenue Card */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Pendapatan</p>
                        <p className="text-gray-800 text-xl font-bold mt-1">{formattedRevenue}</p>
                    </div>
                </div>

                {/* Pending Orders Card */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Pesanan Pending</p>
                        <p className="text-gray-800 text-xl font-bold mt-1">{defaultStats.pending_orders} Order</p>
                    </div>
                </div>

                {/* Total Products Card */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Produk</p>
                        <p className="text-gray-800 text-xl font-bold mt-1">{defaultStats.total_products} Item</p>
                    </div>
                </div>

                {/* Total Customers Card */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Customer</p>
                        <p className="text-gray-800 text-xl font-bold mt-1">{defaultStats.total_customers ?? 0} Orang</p>
                    </div>
                </div>
            </div>

            {/* Dashboard Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Side: Top Products & Pending Orders needing process */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Top Products */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                            </svg>
                            <h3 className="text-gray-800 font-bold text-base">Produk Terlaris</h3>
                        </div>

                        <div className="space-y-4">
                            {topProducts && topProducts.length > 0 ? (
                                topProducts.map((item, index) => (
                                    <div key={item.product_id || index} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100/50 hover:bg-gray-100/50 transition-colors">
                                        <div className="flex items-center gap-4 min-w-0">
                                            {/* Position badge */}
                                            <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs flex items-center justify-center flex-shrink-0">
                                                {index + 1}
                                            </div>
                                            {/* Product image */}
                                            <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                                                {item.image_url ? (
                                                    <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                                    </svg>
                                                )}
                                            </div>
                                            {/* Product Info */}
                                            <div className="min-w-0">
                                                <h4 className="text-gray-800 text-sm font-semibold truncate">{item.product_name}</h4>
                                                <p className="text-gray-400 text-xs mt-0.5">{item.total_sold} Terjual</p>
                                            </div>
                                        </div>
                                        <span className="text-emerald-600 font-bold text-sm">
                                            Rp {Number(item.total_revenue).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 text-sm py-4 text-center">Belum ada data penjualan.</p>
                            )}
                        </div>
                    </div>

                    {/* Pending Orders List */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <h3 className="text-gray-800 font-bold text-base">Pesanan Perlu Diproses</h3>
                            </div>
                            <span className="bg-orange-50 text-orange-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                                {pendingOrdersList?.length ?? 0} Baru
                            </span>
                        </div>

                        <div className="space-y-4">
                            {pendingOrdersList && pendingOrdersList.length > 0 ? (
                                pendingOrdersList.map(order => (
                                    <div key={order.order_id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-gray-100 hover:border-emerald-100 transition-colors">
                                        <div className="flex items-center gap-3">
                                            {/* Status Badge */}
                                            <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md tracking-wider ${order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                    order.status === 'processing' ? 'bg-orange-100 text-orange-700' :
                                                        order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                                            'bg-gray-100 text-gray-600'
                                                }`}>
                                                {order.status}
                                            </span>
                                            <div>
                                                <h4 className="text-gray-800 text-sm font-semibold truncate max-w-[120px]">- {order.user_name}</h4>
                                                <p className="text-gray-400 text-xs mt-0.5">{order.created_at}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end gap-4">
                                            <span className="text-gray-800 font-bold text-sm sm:text-base">
                                                Rp {Number(order.final_amount).toLocaleString('id-ID')}
                                            </span>
                                            <button 
                                                onClick={() => openProcessModal(order)}
                                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Proses
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 text-sm py-4 text-center">Semua pesanan selesai diproses.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Side: Low Stock Warnings */}
                <div>
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
                        <div className="flex items-center gap-2 mb-6">
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <h3 className="text-gray-800 font-bold text-base">Stok Menipis</h3>
                        </div>

                        <p className="text-gray-400 text-xs mb-4">Segera lakukan restock untuk barang berikut:</p>

                        <div className="space-y-3 mb-6">
                            {lowStockProducts && lowStockProducts.length > 0 ? (
                                lowStockProducts.map(product => (
                                    <div key={product.product_id} className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <h4 className="text-gray-800 text-sm font-semibold truncate">{product.name}</h4>
                                            <p className="text-gray-400 text-xs mt-0.5">{product.sku || 'No SKU'}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <span className="text-red-600 text-base font-bold">{product.stock_qty}</span>
                                            <p className="text-red-400 text-[10px] uppercase font-semibold tracking-wider">Pcs</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 rounded-xl bg-green-50 border border-green-100 text-green-700 text-sm font-semibold text-center">
                                    Semua stok aman dan terjaga! ✓
                                </div>
                            )}
                        </div>

                        {lowStockProducts && lowStockProducts.length > 0 && (
                            <Link href="/products" className="w-full inline-flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-md shadow-red-200 transition-all">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Restock Sekarang
                            </Link>
                        )}
                    </div>
                </div>

            </div>

            {/* Modal Proses Pesanan */}
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
                                <p className="text-sm font-bold text-gray-800">{selectedOrder.user_name}</p>
                                <p className="text-xs text-gray-600 leading-relaxed mt-1">{selectedOrder.shipping_address}</p>
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
