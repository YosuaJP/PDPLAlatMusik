import POSLayout from '@/Layouts/POSLayout';
import { Head, usePage } from '@inertiajs/react';

function StatCard({ title, value, subtitle, icon, color }) {
    const colors = {
        amber:  { bg: 'bg-amber-500/10',  icon: 'bg-amber-500',  text: 'text-amber-400'  },
        green:  { bg: 'bg-green-500/10',  icon: 'bg-green-500',  text: 'text-green-400'  },
        blue:   { bg: 'bg-blue-500/10',   icon: 'bg-blue-500',   text: 'text-blue-400'   },
        purple: { bg: 'bg-purple-500/10', icon: 'bg-purple-500', text: 'text-purple-400' },
    };
    const c = colors[color] ?? colors.amber;

    return (
        <div className={`rounded-2xl border border-slate-700/50 bg-slate-800/60 p-5 flex items-center gap-4`}>
            <div className={`w-12 h-12 rounded-xl ${c.icon} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                <span className="text-white">{icon}</span>
            </div>
            <div>
                <p className="text-slate-400 text-xs font-medium">{title}</p>
                <p className="text-white text-2xl font-bold mt-0.5">{value}</p>
                {subtitle && <p className={`text-xs mt-0.5 ${c.text}`}>{subtitle}</p>}
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
        <tr className="border-b border-slate-700/40 hover:bg-slate-700/20 transition-colors">
            <td className="py-3 px-4 text-slate-300 text-sm font-mono">#{order.order_id}</td>
            <td className="py-3 px-4 text-slate-300 text-sm">{order.user?.name ?? '—'}</td>
            <td className="py-3 px-4 text-white text-sm font-medium">
                Rp {Number(order.final_amount).toLocaleString('id-ID')}
            </td>
            <td className="py-3 px-4">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusStyle[order.status] ?? 'bg-slate-600 text-slate-300'}`}>
                    {order.status}
                </span>
            </td>
            <td className="py-3 px-4 text-slate-400 text-xs">
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
            <div className="mb-6">
                <h2 className="text-slate-100 text-xl font-bold">
                    Selamat datang, {auth?.user?.name?.split(' ')[0]} 👋
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                    Berikut ringkasan aktivitas toko alat musik hari ini.
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

                {/* Recent Orders Table */}
                <div className="xl:col-span-2 bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
                        <h3 className="text-white font-semibold text-sm">Pesanan Terbaru</h3>
                        <a href="/orders" className="text-amber-400 text-xs hover:text-amber-300 transition-colors">Lihat semua →</a>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-700/50">
                                    <th className="py-3 px-4 text-left text-slate-400 text-xs font-semibold uppercase tracking-wider">ID</th>
                                    <th className="py-3 px-4 text-left text-slate-400 text-xs font-semibold uppercase tracking-wider">Pelanggan</th>
                                    <th className="py-3 px-4 text-left text-slate-400 text-xs font-semibold uppercase tracking-wider">Total</th>
                                    <th className="py-3 px-4 text-left text-slate-400 text-xs font-semibold uppercase tracking-wider">Status</th>
                                    <th className="py-3 px-4 text-left text-slate-400 text-xs font-semibold uppercase tracking-wider">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders && recentOrders.length > 0 ? (
                                    recentOrders.map(order => <OrderRow key={order.order_id} order={order} />)
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-10 text-center text-slate-500 text-sm">
                                            Belum ada pesanan
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Low Stock Warning */}
                <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
                        <h3 className="text-white font-semibold text-sm">Stok Menipis</h3>
                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                            {lowStockProducts?.length ?? 0} item
                        </span>
                    </div>
                    <div className="p-3 space-y-2">
                        {lowStockProducts && lowStockProducts.length > 0 ? (
                            lowStockProducts.map(product => (
                                <div key={product.product_id}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-slate-600 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-slate-200 text-xs font-medium truncate">{product.name}</p>
                                        <p className="text-slate-400 text-xs">{product.sku}</p>
                                    </div>
                                    <span className={`text-xs font-bold flex-shrink-0 ${product.stock_qty === 0 ? 'text-red-400' : 'text-yellow-400'}`}>
                                        {product.stock_qty} pcs
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="py-6 text-center text-slate-500 text-sm">Semua stok aman ✓</p>
                        )}
                    </div>
                </div>
            </div>
        </POSLayout>
    );
}
