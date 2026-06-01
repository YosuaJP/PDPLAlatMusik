import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, Link } from '@inertiajs/react';
import { useState } from 'react';

function Stars({ rating }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <svg
                    key={i}
                    style={{
                        width: 14, height: 14,
                        fill: i <= rating ? '#f59e0b' : '#e5e7eb',
                        color: i <= rating ? '#f59e0b' : '#e5e7eb',
                    }}
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

function StatCard({ label, value, sub, color }) {
    return (
        <div className={`rounded-xl border p-4 ${color}`}>
            <p className="text-[11px] font-bold uppercase tracking-wider opacity-70 mb-1">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
            {sub && <p className="text-[11px] opacity-60 mt-0.5">{sub}</p>}
        </div>
    );
}

export default function AdminReviews({ reviews, stats, filters }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [rating, setRating] = useState(filters?.rating ?? '');

    const applyFilter = () => {
        router.get(route('admin.reviews.index'), { search, rating }, { preserveState: true, replace: true });
    };

    const list = reviews?.data ?? [];

    return (
        <AdminLayout pageTitle="Ulasan Pelanggan">
            <Head title="Ulasan Pelanggan — Admin" />

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <StatCard
                    label="Total Ulasan"
                    value={stats?.total ?? 0}
                    color="bg-white border-gray-100 text-gray-800 shadow-sm"
                />
                <StatCard
                    label="Rata-rata Rating"
                    value={stats?.avg_rating > 0 ? `⭐ ${stats.avg_rating}` : '—'}
                    color="bg-amber-50 border-amber-100 text-amber-700 shadow-sm"
                />
                <StatCard
                    label="Bintang 5 ⭐⭐⭐⭐⭐"
                    value={stats?.rating_5 ?? 0}
                    sub="ulasan terbaik"
                    color="bg-emerald-50 border-emerald-100 text-emerald-700 shadow-sm"
                />
                <StatCard
                    label="Bintang 1 ⭐"
                    value={stats?.rating_1 ?? 0}
                    sub="perlu perhatian"
                    color="bg-red-50 border-red-100 text-red-700 shadow-sm"
                />
            </div>

            {/* Filter */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-wrap gap-3 items-end">
                <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Cari Produk / Pelanggan</label>
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && applyFilter()}
                        placeholder="Nama produk atau pelanggan..."
                        className="px-3 py-2 border border-gray-200 rounded-xl text-xs w-64 focus:ring-4 focus:ring-amber-100 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Filter Rating</label>
                    <select
                        value={rating}
                        onChange={e => setRating(e.target.value)}
                        className="pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-xs focus:ring-4 focus:ring-amber-100 focus:outline-none bg-white cursor-pointer"
                    >
                        <option value="">Semua Rating</option>
                        {[5, 4, 3, 2, 1].map(r => (
                            <option key={r} value={r}>{r} Bintang</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={applyFilter}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-bold transition-all"
                >
                    Terapkan
                </button>
                {(search || rating) && (
                    <button
                        onClick={() => { setSearch(''); setRating(''); router.get(route('admin.reviews.index')); }}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition-all"
                    >
                        Reset
                    </button>
                )}
            </div>

            {/* Reviews Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                    <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Semua Ulasan</h3>
                    <span className="text-[11px] text-gray-400 font-semibold">
                        {reviews?.total ?? 0} ulasan ditemukan
                    </span>
                </div>

                {list.length === 0 ? (
                    <div className="py-16 text-center text-gray-400 text-sm">
                        <svg className="w-10 h-10 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        Belum ada ulasan yang masuk.
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                                <th className="px-5 py-3.5">Produk</th>
                                <th className="px-5 py-3.5">Pelanggan</th>
                                <th className="px-5 py-3.5 text-center">Rating</th>
                                <th className="px-5 py-3.5">Komentar</th>
                                <th className="px-5 py-3.5 text-right">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-xs">
                            {list.map(r => (
                                <tr key={r.review_id} className="hover:bg-gray-50/40 transition-colors">
                                    {/* Produk */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg border border-gray-100 bg-gray-50 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                                {r.product_image ? (
                                                    <img src={r.product_image} alt={r.product_name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                                                    </svg>
                                                )}
                                            </div>
                                            <span className="font-semibold text-gray-800 leading-tight">{r.product_name}</span>
                                        </div>
                                    </td>

                                    {/* Pelanggan */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <div style={{
                                                width: 28, height: 28, borderRadius: '50%',
                                                background: 'linear-gradient(135deg,#16a34a,#22c55e)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: '#fff', fontWeight: 700, fontSize: 11, flexShrink: 0,
                                            }}>
                                                {r.customer_name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{r.customer_name}</p>
                                                {r.order_id && (
                                                    <p className="text-gray-400 text-[10px] font-mono">Order #{r.order_id}</p>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Rating */}
                                    <td className="px-5 py-4 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <Stars rating={r.rating} />
                                            <span className="text-[10px] font-bold text-gray-500">{r.rating}/5</span>
                                        </div>
                                    </td>

                                    {/* Komentar */}
                                    <td className="px-5 py-4 max-w-xs">
                                        {r.comment ? (
                                            <p className="text-gray-600 leading-relaxed line-clamp-2">{r.comment}</p>
                                        ) : (
                                            <span className="text-gray-300 italic">Tidak ada komentar</span>
                                        )}
                                    </td>

                                    {/* Tanggal */}
                                    <td className="px-5 py-4 text-right text-gray-400 font-mono whitespace-nowrap">
                                        {r.created_at}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Pagination */}
                {reviews?.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-500">
                        <span>Halaman {reviews.current_page} dari {reviews.last_page}</span>
                        <div className="flex gap-2">
                            {reviews.links?.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                                        link.active
                                            ? 'bg-gray-800 text-white'
                                            : link.url
                                                ? 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                                                : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
