import POSLayout from '@/Layouts/POSLayout';
import { Head, usePage } from '@inertiajs/react';

function StatCard({ title, value, subtitle, icon, color }) {
    const colors = {
        amber:  { bg: 'bg-orange-50',  icon: 'bg-orange-100',  text: 'text-orange-500', iconColor: 'text-orange-500'  },
        green:  { bg: 'bg-green-50',   icon: 'bg-green-100',   text: 'text-green-500',  iconColor: 'text-green-500'   },
        blue:   { bg: 'bg-blue-50',    icon: 'bg-blue-100',    text: 'text-blue-500',   iconColor: 'text-blue-500'    },
        purple: { bg: 'bg-purple-50',  icon: 'bg-purple-100',  text: 'text-purple-500', iconColor: 'text-purple-500'  },
    };
    const c = colors[color] ?? colors.amber;

    return (
        <div className={`rounded-2xl border border-slate-100 bg-white p-6 flex items-center gap-5 shadow-sm`}>
            <div className={`w-14 h-14 rounded-2xl ${c.icon} flex items-center justify-center flex-shrink-0`}>
                <span className={c.iconColor}>{icon}</span>
            </div>
            <div>
                <p className="text-slate-500 text-xs font-medium mb-1">{title}</p>
                <p className="text-slate-800 text-2xl font-bold leading-none">{value}</p>
                {subtitle && <p className={`text-xs mt-1.5 font-medium ${c.text}`}>{subtitle}</p>}
            </div>
        </div>
    );
}

function OrderRow({ order }) {
    const statusStyle = {
        pending:    'bg-yellow-500/20 text-yellow-400',
        processing: 'bg-blue-500/20 text-blue-400',
        shipped:    'bg-indigo-500/20 text-indigo-400',
        delivered:  'bg-green-500/20 text-green-400',
        cancelled:  'bg-red-500/20 text-red-400',
    };
    return (
        <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
            <td className="py-4 px-6 text-slate-500 text-sm font-mono">#{order.order_id}</td>
            <td className="py-4 px-6 text-slate-800 text-sm font-medium">{order.user?.name ?? '—'}</td>
            <td className="py-4 px-6 text-slate-800 text-sm font-bold">
                Rp {Number(order.final_amount).toLocaleString('id-ID')}
            </td>
            <td className="py-4 px-6">
                <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${statusStyle[order.status] ?? 'bg-slate-100 text-slate-600'}`}>
                    {order.status}
                </span>
            </td>
            <td className="py-4 px-6 text-slate-400 text-xs font-medium">
                {order.created_at ? new Date(order.created_at).toLocaleDateString('id-ID') : '—'}
            </td>
        </tr>
    );
}

export default function Dashboard({ stats, recentOrders, lowStockProducts }) {
    const { auth } = usePage().props;

    const defaultStats = stats ?? {
        total_orders: 0,
        total_revenue: 0,
        total_products: 0,
        pending_orders: 0,
    };

    return (
        <POSLayout title="Dashboard">
            <Head title="Dashboard" />

            {/* Greeting */}
            <div className="mb-8">
                <h2 className="text-slate-800 text-2xl font-bold flex items-center gap-2">
                    Halo, {auth?.user?.name?.split(' ')[0] ?? 'Admin'}! 👋
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                    Berikut ringkasan performa toko hari ini.
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                <StatCard
                    title="Total Pesanan"
                    value={defaultStats.total_orders}
                    subtitle="Semua status"
                    color="amber"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    }
                />
                <StatCard
                    title="Total Pendapatan"
                    value={`Rp ${Number(defaultStats.total_revenue).toLocaleString('id-ID')}`}
                    subtitle="Order selesai"
                    color="green"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                <StatCard
                    title="Total Produk"
                    value={defaultStats.total_products}
                    subtitle="Produk aktif"
                    color="blue"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    }
                />
                <StatCard
                    title="Menunggu Proses"
                    value={defaultStats.pending_orders}
                    subtitle="Perlu tindakan"
                    color="purple"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
            </div>

            {/* Content grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Top Products Table / Recent Orders */}
                <div className="xl:col-span-2 space-y-6">
                    {/* Produk Terlaris Card */}
                    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                            <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                            </svg>
                            <h3 className="text-slate-800 font-bold text-base">Produk Terlaris</h3>
                        </div>
                        <div className="p-6 space-y-3">
                            {[1, 2, 3].map((rank) => (
                                <div key={rank} className="flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-sm font-bold shadow-sm">
                                        {rank}
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-slate-800 text-sm font-bold truncate">Gitar Yamaha F310</p>
                                        <p className="text-slate-500 text-xs font-medium mt-0.5">120 Terjual</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[#6BCB77] text-sm font-bold">Rp 1.450.000</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pesanan Perlu Diproses */}
                    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-slate-800 font-bold text-base">Pesanan Perlu Diproses</h3>
                            </div>
                            <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-bold">
                                {defaultStats.pending_orders} Baru
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50">
                                        <th className="py-3 px-6 text-left text-slate-500 text-xs font-bold uppercase tracking-wider">ID</th>
                                        <th className="py-3 px-6 text-left text-slate-500 text-xs font-bold uppercase tracking-wider">Pelanggan</th>
                                        <th className="py-3 px-6 text-left text-slate-500 text-xs font-bold uppercase tracking-wider">Total</th>
                                        <th className="py-3 px-6 text-left text-slate-500 text-xs font-bold uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders && recentOrders.length > 0 ? (
                                        recentOrders.map(order => <OrderRow key={order.order_id} order={order} />)
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="py-10 text-center text-slate-500 text-sm font-medium">
                                                Belum ada pesanan
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Low Stock Warning */}
                <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm h-fit">
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h3 className="text-slate-800 font-bold text-base">Stok Menipis</h3>
                    </div>
                    <div className="p-6">
                        <p className="text-slate-500 text-xs mb-4 font-medium">Segera lakukan restock untuk barang berikut:</p>
                        <div className="space-y-3">
                            {lowStockProducts && lowStockProducts.length > 0 ? (
                                lowStockProducts.map(product => (
                                    <div key={product.product_id}
                                        className="bg-red-50/50 border border-red-100 rounded-xl p-4 flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-slate-800 text-sm font-bold truncate">{product.name}</p>
                                            <p className="text-red-500 text-xs mt-0.5 font-medium">{product.sku}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-red-600 text-xl font-bold flex-shrink-0">
                                                {product.stock_qty}
                                            </span>
                                            <span className="text-red-600 text-xs ml-1 font-bold">Pcs</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-slate-800 text-sm font-bold truncate">Senar Gitar Elixir</p>
                                        <p className="text-red-500 text-xs mt-0.5 font-medium">STR-001</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-red-600 text-xl font-bold flex-shrink-0">2</span>
                                        <span className="text-red-600 text-xs ml-1 font-bold">Pcs</span>
                                    </div>
                                </div>
                            )}
                            <button className="w-full bg-[#D92D20] hover:bg-[#B42318] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors mt-3 shadow-sm">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Restock Sekarang
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </POSLayout>
    );
}
