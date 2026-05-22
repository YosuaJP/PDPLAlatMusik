import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function AdminProducts({ products, categories, filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        category_id: '',
        name: '',
        description: '',
        price: '',
        stock_qty: '',
        sku: '',
        image_url: '',
        active: true,
    });

    // Handle search input changes with debounce or search trigger
    const triggerSearch = () => {
        router.get(
            route('products.index'),
            { search: searchTerm },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            triggerSearch();
        }
    };

    const openCreateModal = () => {
        reset();
        clearErrors();
        if (categories && categories.length > 0) {
            setData(prev => ({ ...prev, category_id: categories[0].category_id }));
        }
        setEditMode(false);
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        clearErrors();
        setData({
            category_id: product.category_id || '',
            name: product.name || '',
            description: product.description || '',
            price: String(product.price || ''),
            stock_qty: String(product.stock_qty || ''),
            sku: product.sku || '',
            image_url: product.image_url || '',
            active: product.active ?? true,
        });
        setCurrentProductId(product.product_id);
        setEditMode(true);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) {
            put(route('products.update', currentProductId), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('products.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        destroy(route('products.destroy', deleteId), {
            onSuccess: () => setShowDeleteModal(false),
        });
    };

    const productList = products?.data ?? [];
    const paginationLinks = products?.links ?? [];

    return (
        <AdminLayout pageTitle="Manajemen Produk">
            <Head title="Manajemen Produk — Melodi POS" />

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                {/* Header & Controls Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Daftar Produk</h2>
                        <p className="text-gray-400 text-xs mt-1">Kelola barang, harga, persediaan stok, dan status produk alat musik.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                        {/* Search Input */}
                        <div className="relative flex-1 sm:w-64">
                            <input
                                type="text"
                                placeholder="Cari nama / SKU..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all"
                            />
                            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <button
                            onClick={triggerSearch}
                            className="px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl text-xs font-bold transition-all"
                        >
                            Cari
                        </button>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                            Tambah Produk
                        </button>
                    </div>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto border border-gray-100 rounded-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Info Produk (SKU)</th>
                                <th className="px-6 py-4">Kategori</th>
                                <th className="px-6 py-4">Harga</th>
                                <th className="px-6 py-4">Stok</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            {productList.length > 0 ? (
                                productList.map((product) => (
                                    <tr key={product.product_id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {/* Mini Image */}
                                                <div className="w-12 h-12 rounded-lg border border-gray-100 overflow-hidden flex items-center justify-center bg-gray-50 flex-shrink-0">
                                                    {product.image_url ? (
                                                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-gray-800 truncate max-w-xs">{product.name}</p>
                                                    <p className="text-gray-400 text-xs font-mono mt-0.5">{product.sku || 'No SKU'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600">
                                                {product.category?.category_name || 'Umum'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-800">
                                            Rp {Number(product.price).toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                                product.stock_qty <= 5 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                                            }`}>
                                                {product.stock_qty} Pcs
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${product.active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                                                {product.active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="inline-flex items-center gap-2">
                                                <button
                                                    onClick={() => openEditModal(product)}
                                                    className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 flex items-center justify-center transition-colors"
                                                    title="Edit Produk"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(product.product_id)}
                                                    className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
                                                    title="Hapus Produk"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                                        Tidak ada produk yang cocok dengan pencarian.
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
                            const isActive = link.active;
                            return (
                                <Link
                                    key={idx}
                                    href={link.url}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                        isActive
                                            ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-100'
                                            : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-100 my-8 overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                            <h3 className="text-gray-800 font-bold text-base">
                                {editMode ? 'Edit Produk' : 'Tambah Produk Baru'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Name Input */}
                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Nama Produk</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="cth: Yamaha Acoustic Guitar F310"
                                        className={`w-full px-3.5 py-2.5 rounded-xl border ${errors.name ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 focus:ring-emerald-100'} focus:outline-none focus:ring-4 transition-all text-sm`}
                                    />
                                    {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name}</span>}
                                </div>

                                {/* Category Input */}
                                <div>
                                    <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Kategori</label>
                                    <select
                                        value={data.category_id}
                                        onChange={e => setData('category_id', e.target.value)}
                                        className={`w-full px-3.5 py-2.5 rounded-xl border ${errors.category_id ? 'border-red-400' : 'border-gray-200'} focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all text-sm`}
                                    >
                                        <option value="">Pilih Kategori</option>
                                        {categories.map((cat) => (
                                            <option key={cat.category_id} value={cat.category_id}>
                                                {cat.category_name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category_id && <span className="text-red-500 text-xs mt-1 block">{errors.category_id}</span>}
                                </div>

                                {/* SKU Input */}
                                <div>
                                    <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">SKU (Kode Barang)</label>
                                    <input
                                        type="text"
                                        value={data.sku}
                                        onChange={e => setData('sku', e.target.value)}
                                        placeholder="cth: YMH-F310-NT"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all text-sm"
                                    />
                                    {errors.sku && <span className="text-red-500 text-xs mt-1 block">{errors.sku}</span>}
                                </div>

                                {/* Price Input */}
                                <div>
                                    <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Harga (Rp)</label>
                                    <input
                                        type="number"
                                        value={data.price}
                                        onChange={e => setData('price', e.target.value)}
                                        placeholder="cth: 1500000"
                                        className={`w-full px-3.5 py-2.5 rounded-xl border ${errors.price ? 'border-red-400' : 'border-gray-200'} focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all text-sm`}
                                    />
                                    {errors.price && <span className="text-red-500 text-xs mt-1 block">{errors.price}</span>}
                                </div>

                                {/* Stock Quantity Input */}
                                <div>
                                    <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Stok (Pcs)</label>
                                    <input
                                        type="number"
                                        value={data.stock_qty}
                                        onChange={e => setData('stock_qty', e.target.value)}
                                        placeholder="cth: 12"
                                        className={`w-full px-3.5 py-2.5 rounded-xl border ${errors.stock_qty ? 'border-red-400' : 'border-gray-200'} focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all text-sm`}
                                    />
                                    {errors.stock_qty && <span className="text-red-500 text-xs mt-1 block">{errors.stock_qty}</span>}
                                </div>

                                {/* Status Active Dropdown */}
                                <div>
                                    <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Status Produk</label>
                                    <select
                                        value={data.active ? '1' : '0'}
                                        onChange={e => setData('active', e.target.value === '1')}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all text-sm"
                                    >
                                        <option value="1">Aktif</option>
                                        <option value="0">Nonaktif</option>
                                    </select>
                                </div>

                                {/* Image URL Input */}
                                <div>
                                    <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">URL Gambar Produk</label>
                                    <input
                                        type="text"
                                        value={data.image_url}
                                        onChange={e => setData('image_url', e.target.value)}
                                        placeholder="cth: https://images.unsplash.com/..."
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all text-sm"
                                    />
                                    {errors.image_url && <span className="text-red-500 text-xs mt-1 block">{errors.image_url}</span>}
                                </div>

                                {/* Description Input */}
                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Deskripsi Produk</label>
                                    <textarea
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        rows="3"
                                        placeholder="Tulis spesifikasi atau deskripsi lengkap produk..."
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all text-sm resize-none"
                                    ></textarea>
                                </div>

                                {/* Mini Preview if URL entered */}
                                {data.image_url && (
                                    <div className="md:col-span-2 p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center gap-4">
                                        <img
                                            src={data.image_url}
                                            alt="Preview"
                                            className="w-16 h-16 object-cover rounded-lg border border-gray-200 bg-white"
                                            onError={(e) => {
                                                e.target.src = 'https://placehold.co/100?text=Invalid+URL';
                                            }}
                                        />
                                        <div>
                                            <p className="text-xs font-bold text-gray-800">Preview Gambar</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">Pastikan tautan gambar dapat diakses secara publik.</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3 -mx-6 -mb-6 mt-6">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-gray-100 overflow-hidden p-6 text-center">
                        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h4 className="text-gray-800 font-bold text-base">Hapus Produk?</h4>
                        <p className="text-gray-400 text-xs mt-2">Tindakan ini permanen dan akan menghapus produk ini dari katalog.</p>
                        <div className="flex items-center justify-center gap-3 mt-6">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-5 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
