import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

function Toggle({ active, onToggle }) {
    return (
        <button
            onClick={onToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${active ? 'bg-emerald-500' : 'bg-gray-300'}`}
        >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${active ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    );
}

function formatRp(val) {
    return 'Rp ' + Number(val || 0).toLocaleString('id-ID');
}

const SCOPE_LABELS = {
    global:   { label: 'Global',           cls: 'bg-gray-100 text-gray-600' },
    category: { label: 'Kategori Tertentu', cls: 'bg-purple-100 text-purple-700' },
    product:  { label: 'Produk Tertentu',   cls: 'bg-blue-100 text-blue-700' },
};

export default function AdminPromo({ promos, categories = [], products = [] }) {
    const [isModalOpen, setIsModalOpen]   = useState(false);
    const [editMode, setEditMode]         = useState(false);
    const [currentId, setCurrentId]       = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId]         = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        promo_code:          '',
        promo_name:          '',
        promo_type:          'fixed',
        discount_value:      '',
        max_discount_amount: '',
        min_purchase:        '',
        start_date:          '',
        end_date:            '',
        active:              true,
        scope:               'global',
        scope_category_ids:  [],
        scope_product_ids:   [],
        quota:               '',
    });

    const openCreate = () => {
        reset(); clearErrors(); setEditMode(false); setIsModalOpen(true);
    };

    const openEdit = (promo) => {
        clearErrors();
        setData({
            promo_code:          promo.promo_code || '',
            promo_name:          promo.promo_name || '',
            promo_type:          promo.promo_type || 'fixed',
            discount_value:      String(promo.discount_value || ''),
            max_discount_amount: String(promo.max_discount_amount || ''),
            min_purchase:        String(promo.min_purchase || ''),
            start_date:          promo.start_date ? promo.start_date.split('T')[0] : '',
            end_date:            promo.end_date   ? promo.end_date.split('T')[0]   : '',
            active:              promo.active ?? true,
            scope:               promo.scope || 'global',
            scope_category_ids:  promo.scope_category_ids || [],
            scope_product_ids:   promo.scope_product_ids  || [],
            quota:               promo.quota ? String(promo.quota) : '',
        });
        setCurrentId(promo.promo_id);
        setEditMode(true);
        setIsModalOpen(true);
    };

    const closeModal = () => { setIsModalOpen(false); reset(); };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) {
            put(route('admin.promos.update', currentId), { onSuccess: closeModal });
        } else {
            post(route('admin.promos.store'), { onSuccess: closeModal });
        }
    };

    const handleToggle = (id) => {
        router.patch(route('admin.promos.toggle', id), {}, { preserveState: true });
    };

    const confirmDelete = (id) => { setDeleteId(id); setShowDeleteModal(true); };
    const handleDelete  = () => {
        router.delete(route('admin.promos.destroy', deleteId), {
            onSuccess: () => setShowDeleteModal(false),
        });
    };

    // Toggle multi-select for IDs
    const toggleId = (field, id) => {
        const current = data[field] || [];
        const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id];
        setData(field, next);
    };

    const promoList = promos ?? [];

    return (
        <AdminLayout pageTitle="Kelola Promo">
            <Head title="" />

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Daftar Promo</h2>
                        <p className="text-gray-400 text-xs mt-1">Kelola kode diskon global, per-kategori, atau per-produk.</p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Promo
                    </button>
                </div>

                <div className="overflow-x-auto border border-gray-100 rounded-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Kode & Nama</th>
                                <th className="px-6 py-4">Cakupan</th>
                                <th className="px-6 py-4">Periode</th>
                                <th className="px-6 py-4">Diskon</th>
                                <th className="px-6 py-4">Min. Belanja</th>
                                <th className="px-6 py-4 text-center">Terpakai / Kuota</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            {promoList.length > 0 ? promoList.map(promo => (
                                <tr key={promo.promo_id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1.5 mb-1.5">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${promo.promo_type === 'fixed' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {promo.promo_code}
                                            </span>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500">
                                                {promo.promo_type === 'fixed' ? 'Potongan Tetap' : promo.promo_type === 'free_shipping' ? 'Gratis Ongkir' : 'Persen (%)'}
                                            </span>
                                        </div>
                                        <p className="font-semibold text-gray-800">{promo.promo_name}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${SCOPE_LABELS[promo.scope || 'global']?.cls}`}>
                                            {SCOPE_LABELS[promo.scope || 'global']?.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-xs text-gray-700">{promo.start_date?.split('T')[0] ?? '—'}</p>
                                        <p className="text-[11px] text-gray-400">s/d</p>
                                        <p className="text-xs text-gray-700">{promo.end_date?.split('T')[0] ?? '—'}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-emerald-600 font-bold text-sm">
                                            {promo.promo_type === 'percent'
                                                ? `${Number(promo.discount_value)}%`
                                                : promo.promo_type === 'free_shipping'
                                                    ? 'Gratis'
                                                    : formatRp(promo.discount_value)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {Number(promo.min_purchase) > 0 ? formatRp(promo.min_purchase) : <span className="text-gray-400">Rp 0</span>}
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm">
                                        <span className="font-bold text-gray-800">{promo.used_quota || 0}</span>
                                        <span className="text-gray-400 mx-1">/</span>
                                        <span className="text-gray-600">{promo.quota ? promo.quota : '∞'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Toggle active={promo.active} onToggle={() => handleToggle(promo.promo_id)} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="inline-flex items-center gap-2">
                                            <button
                                                onClick={() => openEdit(promo)}
                                                className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 flex items-center justify-center transition-colors"
                                                title="Edit Promo"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => confirmDelete(promo.promo_id)}
                                                className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
                                                title="Hapus Promo"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-10 text-center text-gray-400">Belum ada promo. Tambahkan promo pertama!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 my-8 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-gray-800 font-bold text-base">{editMode ? 'Edit Promo' : 'Tambah Promo Baru'}</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                                {/* Row 1: Kode & Tipe */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Kode Promo</label>
                                        <input type="text" value={data.promo_code} onChange={e => setData('promo_code', e.target.value)}
                                            placeholder="cth: NEWYEAR2026"
                                            className={`w-full px-3.5 py-2.5 rounded-xl border ${errors.promo_code ? 'border-red-400' : 'border-gray-200'} focus:ring-4 focus:ring-emerald-100 focus:outline-none text-sm uppercase`} />
                                        {errors.promo_code && <span className="text-red-500 text-xs mt-1 block">{errors.promo_code}</span>}
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Tipe Diskon</label>
                                        <select value={data.promo_type} onChange={e => setData('promo_type', e.target.value)}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-100 focus:outline-none text-sm">
                                            <option value="fixed">Potongan Tetap (Rp)</option>
                                            <option value="percent">Persentase (%)</option>
                                            <option value="free_shipping">Gratis Ongkir</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Nama */}
                                <div>
                                    <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Nama Promo</label>
                                    <input type="text" value={data.promo_name} onChange={e => setData('promo_name', e.target.value)}
                                        placeholder="cth: Diskon Spesial Hari Musik"
                                        className={`w-full px-3.5 py-2.5 rounded-xl border ${errors.promo_name ? 'border-red-400' : 'border-gray-200'} focus:ring-4 focus:ring-emerald-100 focus:outline-none text-sm`} />
                                    {errors.promo_name && <span className="text-red-500 text-xs mt-1 block">{errors.promo_name}</span>}
                                </div>

                                {/* Nilai & Min Belanja */}
                                <div className="grid grid-cols-2 gap-4">
                                    {data.promo_type !== 'free_shipping' && (
                                        <div>
                                            <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">
                                                Nilai Diskon {data.promo_type === 'percent' ? '(%)' : '(Rp)'}
                                            </label>
                                            <input type="number" min="0" value={data.discount_value} onChange={e => setData('discount_value', e.target.value)}
                                                placeholder={data.promo_type === 'percent' ? 'cth: 10' : 'cth: 50000'}
                                                className={`w-full px-3.5 py-2.5 rounded-xl border ${errors.discount_value ? 'border-red-400' : 'border-gray-200'} focus:ring-4 focus:ring-emerald-100 focus:outline-none text-sm`} />
                                            {errors.discount_value && <span className="text-red-500 text-xs mt-1 block">{errors.discount_value}</span>}
                                        </div>
                                    )}
                                    <div className={data.promo_type === 'free_shipping' ? "col-span-2" : ""}>
                                        <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Min. Belanja (Rp)</label>
                                        <input type="number" min="0" value={data.min_purchase} onChange={e => setData('min_purchase', e.target.value)}
                                            placeholder="cth: 100000"
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-100 focus:outline-none text-sm" />
                                    </div>
                                </div>

                                {data.promo_type === 'percent' && (
                                    <div>
                                        <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Maks. Potongan (Rp)</label>
                                        <input type="number" min="0" value={data.max_discount_amount} onChange={e => setData('max_discount_amount', e.target.value)}
                                            placeholder="cth: 100000 (kosongkan jika tidak ada batas)"
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-100 focus:outline-none text-sm" />
                                    </div>
                                )}

                                {/* Tanggal */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Tanggal Mulai</label>
                                        <input type="date" value={data.start_date} onChange={e => setData('start_date', e.target.value)}
                                            className={`w-full px-3.5 py-2.5 rounded-xl border ${errors.start_date ? 'border-red-400' : 'border-gray-200'} focus:ring-4 focus:ring-emerald-100 focus:outline-none text-sm`} />
                                        {errors.start_date && <span className="text-red-500 text-xs mt-1 block">{errors.start_date}</span>}
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Tanggal Berakhir</label>
                                        <input type="date" value={data.end_date} onChange={e => setData('end_date', e.target.value)}
                                            className={`w-full px-3.5 py-2.5 rounded-xl border ${errors.end_date ? 'border-red-400' : 'border-gray-200'} focus:ring-4 focus:ring-emerald-100 focus:outline-none text-sm`} />
                                        {errors.end_date && <span className="text-red-500 text-xs mt-1 block">{errors.end_date}</span>}
                                    </div>
                                </div>

                                {/* Kuota */}
                                <div>
                                    <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Batas Kuota Penggunaan</label>
                                    <input type="number" min="1" value={data.quota} onChange={e => setData('quota', e.target.value)}
                                        placeholder="Kosongkan jika kuota tidak terbatas (unlimited)"
                                        className={`w-full px-3.5 py-2.5 rounded-xl border ${errors.quota ? 'border-red-400' : 'border-gray-200'} focus:ring-4 focus:ring-emerald-100 focus:outline-none text-sm`} />
                                    {errors.quota && <span className="text-red-500 text-xs mt-1 block">{errors.quota}</span>}
                                </div>

                                {/* Cakupan Promo */}
                                <div>
                                    <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Cakupan Promo</label>
                                    <select value={data.scope} onChange={e => setData('scope', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-100 focus:outline-none text-sm">
                                        <option value="global">🌐 Global (Semua Produk)</option>
                                        <option value="category">🗂️ Kategori Tertentu</option>
                                        <option value="product">📦 Produk Tertentu</option>
                                    </select>
                                    <p className="text-gray-400 text-xs mt-1.5">
                                        {data.scope === 'global'   && 'Promo berlaku untuk semua produk di cart.'}
                                        {data.scope === 'category' && 'Diskon dihitung dari subtotal item dalam kategori yang dipilih saja (Opsi B).'}
                                        {data.scope === 'product'  && 'Diskon dihitung dari subtotal item produk yang dipilih saja (Opsi B).'}
                                    </p>
                                </div>

                                {/* Multi-select Kategori */}
                                {data.scope === 'category' && (
                                    <div>
                                        <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Pilih Kategori Target</label>
                                        <div className="border border-gray-200 rounded-xl p-3 max-h-40 overflow-y-auto space-y-1.5">
                                            {categories.length === 0 && <p className="text-gray-400 text-xs">Tidak ada kategori aktif.</p>}
                                            {categories.map(cat => (
                                                <label key={cat.category_id} className="flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1.5 transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={(data.scope_category_ids || []).includes(cat.category_id)}
                                                        onChange={() => toggleId('scope_category_ids', cat.category_id)}
                                                        className="accent-emerald-600 w-4 h-4"
                                                    />
                                                    <span className="text-sm text-gray-700">{cat.category_name}</span>
                                                </label>
                                            ))}
                                        </div>
                                        {(data.scope_category_ids || []).length === 0 && (
                                            <p className="text-amber-600 text-xs mt-1">⚠ Pilih minimal 1 kategori.</p>
                                        )}
                                    </div>
                                )}

                                {/* Multi-select Produk */}
                                {data.scope === 'product' && (
                                    <div>
                                        <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Pilih Produk Target</label>
                                        <div className="border border-gray-200 rounded-xl p-3 max-h-40 overflow-y-auto space-y-1.5">
                                            {products.length === 0 && <p className="text-gray-400 text-xs">Tidak ada produk aktif.</p>}
                                            {products.map(prd => (
                                                <label key={prd.product_id} className="flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1.5 transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={(data.scope_product_ids || []).includes(prd.product_id)}
                                                        onChange={() => toggleId('scope_product_ids', prd.product_id)}
                                                        className="accent-emerald-600 w-4 h-4"
                                                    />
                                                    <span className="text-sm text-gray-700">{prd.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                        {(data.scope_product_ids || []).length === 0 && (
                                            <p className="text-amber-600 text-xs mt-1">⚠ Pilih minimal 1 produk.</p>
                                        )}
                                    </div>
                                )}

                                {/* Status */}
                                <div>
                                    <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Status</label>
                                    <select value={data.active ? '1' : '0'} onChange={e => setData('active', e.target.value === '1')}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-100 focus:outline-none text-sm">
                                        <option value="1">Aktif</option>
                                        <option value="0">Nonaktif</option>
                                    </select>
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
                                <button type="button" onClick={closeModal} className="px-4 py-2 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors">Batal</button>
                                <button type="submit" disabled={processing} className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50">
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-gray-100 p-6 text-center">
                        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h4 className="text-gray-800 font-bold text-base">Hapus Promo?</h4>
                        <p className="text-gray-400 text-xs mt-2">Tindakan ini permanen dan tidak bisa dibatalkan.</p>
                        <div className="flex items-center justify-center gap-3 mt-6">
                            <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors">Batal</button>
                            <button onClick={handleDelete} className="px-5 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors">Hapus</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
