import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const typeLabel = { in: 'Masuk (In)', out: 'Keluar (Out)' };
const typeBadge = {
    in:  'bg-emerald-100 text-emerald-700',
    out: 'bg-red-100 text-red-600',
};

export default function AdminStock({ movements, products, filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm]   = useState(filters?.search || '');
    const [typeFilter, setTypeFilter]   = useState(filters?.type  || '');

    const { data, setData, post, processing, errors, reset } = useForm({
        product_id:    '',
        movement_type: 'in',
        quantity:      '',
        notes:         '',
    });

    const movementList   = movements?.data  ?? [];
    const paginationLinks = movements?.links ?? [];

    const triggerFilter = () => {
        router.get(route('admin.stocks.index'), { search: searchTerm, type: typeFilter }, { preserveState: true, replace: true });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.stocks.store'), {
            onSuccess: () => { reset(); setIsModalOpen(false); },
        });
    };

    const formatMovementId = (id) => `MOVE-${String(id).padStart(8, '0')}`;

    return (
        <AdminLayout pageTitle="Riwayat Stok">
            <Head title="Pencatatan Stok — Admin" />

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Riwayat Masuk/Keluar</h2>
                        <p className="text-gray-400 text-xs mt-1">Catat penambahan stok baru atau barang rusak/hilang.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex-shrink-0"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Catat Stok
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                    <input
                        type="text"
                        placeholder="Cari nama / SKU produk..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && triggerFilter()}
                        className="flex-1 px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all"
                    />
                    <select
                        value={typeFilter}
                        onChange={e => { setTypeFilter(e.target.value); }}
                        className="px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all"
                    >
                        <option value="">Semua Tipe</option>
                        <option value="in">Masuk (In)</option>
                        <option value="out">Keluar (Out)</option>
                    </select>
                    <button
                        onClick={triggerFilter}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-bold transition-all"
                    >
                        Terapkan
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto border border-gray-100 rounded-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                                <th className="px-5 py-3.5">ID & Tanggal</th>
                                <th className="px-5 py-3.5">Produk</th>
                                <th className="px-5 py-3.5">Tipe</th>
                                <th className="px-5 py-3.5">Jumlah</th>
                                <th className="px-5 py-3.5">Referensi</th>
                                <th className="px-5 py-3.5">Oleh</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            {movementList.length > 0 ? movementList.map(m => (
                                <tr key={m.movement_id} className="hover:bg-gray-50/60 transition-colors">
                                    <td className="px-5 py-3.5">
                                        <p className="text-emerald-600 font-mono text-xs font-semibold">{formatMovementId(m.movement_id)}</p>
                                        <p className="text-gray-400 text-[11px] mt-0.5">{m.created_at}</p>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <p className="font-semibold text-gray-800 text-sm">{m.product?.name ?? '—'}</p>
                                        <p className="text-gray-400 text-[11px] font-mono">{m.product?.sku ?? ''}</p>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${typeBadge[m.movement_type] ?? 'bg-gray-100 text-gray-600'}`}>
                                            {m.movement_type === 'in' ? 'Masuk (In)' : 'Keluar (Out)'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`font-bold text-sm ${m.quantity >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                            {m.quantity >= 0 ? '+' : ''}{m.quantity}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-xs text-gray-500">
                                        {m.order_id ? (
                                            <span className="text-emerald-600 font-semibold">Order ORD-{String(m.order_id).padStart(8, '0')}</span>
                                        ) : (
                                            <span className="text-gray-400 italic">Manual</span>
                                        )}
                                        {m.notes && <p className="text-[11px] text-gray-400 mt-0.5 max-w-[160px] truncate">{m.notes}</p>}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <p className="text-sm font-medium text-gray-700">{m.creator?.name ?? '—'}</p>
                                        <p className="text-[11px] text-gray-400">ID: {m.created_by}</p>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-sm">
                                        Tidak ada data pergerakan stok.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {paginationLinks.length > 3 && (
                    <div className="flex items-center justify-center gap-1 mt-6">
                        {paginationLinks.map((link, idx) => {
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
                )}
            </div>

            {/* Catat Stok Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-gray-800 font-bold text-base">Catat Pergerakan Stok</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Produk</label>
                                    <select
                                        value={data.product_id}
                                        onChange={e => setData('product_id', e.target.value)}
                                        className={`w-full px-3.5 py-2.5 rounded-xl border ${errors.product_id ? 'border-red-400' : 'border-gray-200'} focus:ring-4 focus:ring-emerald-100 focus:outline-none text-sm`}
                                    >
                                        <option value="">-- Pilih Produk --</option>
                                        {products.map(p => (
                                            <option key={p.product_id} value={p.product_id}>
                                                {p.name} (Stok: {p.stock_qty})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.product_id && <span className="text-red-500 text-xs mt-1 block">{errors.product_id}</span>}
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Tipe Pergerakan</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['in', 'out'].map(t => (
                                            <button
                                                key={t}
                                                type="button"
                                                onClick={() => setData('movement_type', t)}
                                                className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                                                    data.movement_type === t
                                                        ? t === 'in'
                                                            ? 'bg-emerald-600 border-emerald-600 text-white'
                                                            : 'bg-red-500 border-red-500 text-white'
                                                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                                                }`}
                                            >
                                                {t === 'in' ? '▲ Masuk (Tambah)' : '▼ Keluar (Kurang)'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Jumlah</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={data.quantity}
                                        onChange={e => setData('quantity', e.target.value)}
                                        placeholder="Masukkan jumlah..."
                                        className={`w-full px-3.5 py-2.5 rounded-xl border ${errors.quantity ? 'border-red-400' : 'border-gray-200'} focus:ring-4 focus:ring-emerald-100 focus:outline-none text-sm`}
                                    />
                                    {errors.quantity && <span className="text-red-500 text-xs mt-1 block">{errors.quantity}</span>}
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Catatan (Opsional)</label>
                                    <textarea
                                        value={data.notes}
                                        onChange={e => setData('notes', e.target.value)}
                                        rows="2"
                                        placeholder="cth: Barang rusak saat pengiriman, Stok opname..."
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-100 focus:outline-none text-sm resize-none"
                                    />
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
