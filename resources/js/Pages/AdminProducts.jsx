import React, { useState } from 'react';
import POSLayout from '@/Layouts/POSLayout';
import { Head, usePage, useForm, router } from '@inertiajs/react';

export default function AdminProducts() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [selectedId, setSelectedId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const { products, categories } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        category_id: categories.length > 0 ? categories[0].category_id : '',
        stock_qty: 0,
        active: true,
        price: '',
        description: '',
        image: null,
    });

    const openModal = (mode, product = null) => {
        setModalMode(mode);
        if (mode === 'edit' && product) {
            setSelectedId(product.product_id);
            setData({
                name: product.name,
                category_id: product.category_id,
                stock_qty: product.stock_qty,
                active: product.active,
                price: Number(product.price), // ensure numeric
                description: product.description ?? '',
                image: null, // Don't prefill image, let them upload a new one
            });
        } else {
            setSelectedId(null);
            reset();
            if (categories.length > 0) {
                setData('category_id', categories[0].category_id);
            }
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Setup FormData manually is not needed since useForm handles files automatically
        if (modalMode === 'add') {
            post(route('products.store'), {
                forceFormData: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            // For file uploads via PUT/PATCH, Laravel requires POST with _method=PUT
            post(route('products.update', selectedId) + '?_method=PUT', {
                forceFormData: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            router.delete(route('products.destroy', id));
        }
    };

    const filteredProducts = products?.filter(prod => {
        const query = searchQuery.toLowerCase();
        return (
            prod.name.toLowerCase().includes(query) ||
            prod.sku.toLowerCase().includes(query) ||
            (prod.category?.category_name || '').toLowerCase().includes(query)
        );
    });

    return (
        <POSLayout title="Manajemen Produk">
            <Head title="Produk" />

            {/* Header Area */}
            <div className="flex justify-between items-center mb-6 w-full">
                <div className="w-full max-w-md relative flex items-center">
                    {!isSearchFocused && !searchQuery && (
                        <div className="absolute left-4 flex items-center pointer-events-none transition-opacity duration-200">
                            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    )}
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        className={`block w-full pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6BCB77]/20 focus:border-[#6BCB77] transition-all shadow-sm ${(!isSearchFocused && !searchQuery) ? 'pl-11' : 'pl-4'}`}
                        placeholder={(!isSearchFocused && !searchQuery) ? "  Cari nama / SKU..." : "Ketik untuk mencari..."}
                    />
                </div>
                <button
                    onClick={() => openModal('add')}
                    className="bg-[#6BCB77] hover:bg-[#5bb866] text-white px-5 py-2.5 rounded-xl font-bold shadow-sm transition-colors flex items-center gap-2 flex-shrink-0"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Produk
                </button>
            </div>

            {/* Table Card */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="py-4 px-6 text-slate-500 text-sm font-bold whitespace-nowrap">Info Produk (SKU)</th>
                                <th className="py-4 px-6 text-slate-500 text-sm font-bold whitespace-nowrap">Kategori</th>
                                <th className="py-4 px-6 text-slate-500 text-sm font-bold whitespace-nowrap">Harga</th>
                                <th className="py-4 px-6 text-slate-500 text-sm font-bold whitespace-nowrap text-center">Stok</th>
                                <th className="py-4 px-6 text-slate-500 text-sm font-bold whitespace-nowrap text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts?.length > 0 ? (
                                filteredProducts.map((prod) => (
                                    <tr key={prod.product_id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                {prod.image_url ? (
                                                    <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-slate-800 text-sm font-bold">{prod.name}</p>
                                                <p className="text-slate-500 text-xs mt-0.5">{prod.sku}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-blue-500 text-xs font-bold">{prod.category?.category_name ?? '—'}</span>
                                    </td>
                                    <td className="py-4 px-6 text-slate-800 text-sm font-bold whitespace-nowrap">
                                        Rp {Number(prod.price).toLocaleString('id-ID')}
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <span className={`${prod.stock_qty <= 5 ? 'bg-red-50 border-red-200 text-red-500' : 'bg-[#6BCB77]/10 border-[#6BCB77]/30 text-[#6BCB77]'} border text-[11px] font-bold px-2 py-1 rounded-md`}>
                                            {prod.stock_qty} Pcs
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => openModal('edit', prod)}
                                                className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 text-amber-500 hover:bg-amber-100 flex items-center justify-center transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(prod.product_id)}
                                                className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
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
                                    <td colSpan="5" className="py-8 text-center text-slate-500">
                                        Tidak ada produk yang cocok dengan pencarian "{searchQuery}".
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Placeholder */}
            <div className="flex justify-center mt-6">
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 text-sm text-slate-400 bg-white border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                        &laquo; Previous
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center text-sm font-bold text-white bg-[#6BCB77] rounded-lg shadow-sm">1</button>
                    <button className="w-10 h-10 flex items-center justify-center text-sm font-medium text-slate-600 bg-white border border-slate-100 rounded-lg hover:bg-slate-50">2</button>
                    <button className="w-10 h-10 flex items-center justify-center text-sm font-medium text-slate-600 bg-white border border-slate-100 rounded-lg hover:bg-slate-50">3</button>
                    <button className="px-4 py-2 text-sm text-slate-600 bg-white border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                        Next &raquo;
                    </button>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 sm:px-12 sm:py-10">
                    {/* Background backdrop */}
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                    
                    {/* Modal Panel - Flex Centered with Internal Scroll */}
                    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
                        
                        {/* Header */}
                        <div className="bg-white px-6 py-5 border-b border-slate-100 flex-shrink-0">
                            <h3 className="text-slate-800 text-lg font-bold" id="modal-title">
                                {modalMode === 'add' ? 'Tambah Produk' : 'Edit Produk'}
                            </h3>
                        </div>
                        
                        {/* Body - Scrollable */}
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 min-h-0 bg-white">
                            <form id="productForm" onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-slate-700 text-sm font-medium mb-1.5">Nama Produk</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#6BCB77]/20 focus:border-[#6BCB77] transition-all" 
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-slate-700 text-sm font-medium mb-1.5">Kategori</label>
                                        <select 
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#6BCB77]/20 focus:border-[#6BCB77] transition-all"
                                            value={data.category_id}
                                            onChange={e => setData('category_id', e.target.value)}
                                            required
                                        >
                                            <option value="">Pilih Kategori</option>
                                            {categories?.map((cat) => (
                                                <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                                            ))}
                                        </select>
                                        {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
                                    </div>
                                    <div className="w-32">
                                        <label className="block text-slate-700 text-sm font-medium mb-1.5">Stok (Pcs)</label>
                                        <input 
                                            type="number" 
                                            min="0"
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#6BCB77]/20 focus:border-[#6BCB77] transition-all" 
                                            value={data.stock_qty}
                                            onChange={e => setData('stock_qty', e.target.value)}
                                            required
                                        />
                                        {errors.stock_qty && <p className="text-red-500 text-xs mt-1">{errors.stock_qty}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-slate-700 text-sm font-medium mb-1.5">Status Produk</label>
                                    <select 
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#6BCB77]/20 focus:border-[#6BCB77] transition-all"
                                        value={data.active ? '1' : '0'}
                                        onChange={e => setData('active', e.target.value === '1')}
                                    >
                                        <option value="1">Aktif (Tampil di Katalog)</option>
                                        <option value="0">Non-aktif</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-slate-700 text-sm font-medium mb-1.5">Harga (Rp)</label>
                                    <input 
                                        type="number" 
                                        min="0"
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#6BCB77]/20 focus:border-[#6BCB77] transition-all" 
                                        value={data.price}
                                        onChange={e => setData('price', e.target.value)}
                                        required
                                    />
                                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                                </div>
                                <div>
                                    <label className="block text-slate-700 text-sm font-medium mb-1.5">Gambar Produk</label>
                                    <div className="flex items-center gap-4">
                                        <label className="cursor-pointer bg-white border border-[#6BCB77] text-[#6BCB77] hover:bg-[#6BCB77]/10 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex-shrink-0">
                                            Choose File
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                accept="image/*"
                                                onChange={e => setData('image', e.target.files[0])}
                                            />
                                        </label>
                                        <span className="text-slate-400 text-sm truncate max-w-[200px]">
                                            {data.image ? data.image.name : 'No file chosen'}
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-xs mt-1.5">Upload gambar baru untuk mengganti yang lama. (Maks 2MB)</p>
                                    {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                                </div>
                                <div>
                                    <label className="block text-slate-700 text-sm font-medium mb-1.5">Deskripsi</label>
                                    <textarea 
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#6BCB77]/20 focus:border-[#6BCB77] transition-all custom-scrollbar" 
                                        rows="3" 
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                    ></textarea>
                                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                                </div>
                            </form>
                        </div>
                        
                        {/* Footer - Fixed */}
                        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 flex-shrink-0">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 bg-white border border-slate-200 shadow-sm rounded-xl transition-colors text-sm"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                form="productForm"
                                disabled={processing}
                                className="bg-[#6BCB77] hover:bg-[#5bb866] text-white px-6 py-2.5 rounded-xl font-bold shadow-sm transition-colors text-sm disabled:opacity-50"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </POSLayout>
    );
}
