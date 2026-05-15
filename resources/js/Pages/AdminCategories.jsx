import React, { useState } from 'react';
import POSLayout from '@/Layouts/POSLayout';
import { Head, usePage, useForm, router } from '@inertiajs/react';

export default function AdminCategories() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [selectedId, setSelectedId] = useState(null);

    const { categories } = usePage().props;

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        category_name: '',
        description: '',
        active: true,
    });

    const openModal = (mode, category = null) => {
        setModalMode(mode);
        if (mode === 'edit' && category) {
            setSelectedId(category.category_id);
            setData({
                category_name: category.category_name,
                description: category.description ?? '',
                active: category.active,
            });
        } else {
            setSelectedId(null);
            reset();
            setData('active', true);
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (modalMode === 'add') {
            post(route('categories.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            put(route('categories.update', selectedId), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
            router.delete(route('categories.destroy', id));
        }
    };

    return (
        <POSLayout title="Manajemen Kategori">
            <Head title="Kategori" />

            {/* Header Area */}
            <div className="flex justify-between items-center mb-6 w-full">
                <div className="text-left">
                    <h2 className="text-slate-800 text-2xl font-bold">Daftar Kategori</h2>
                    <p className="text-slate-500 text-sm mt-1">Kelola kelompok produk di tokomu.</p>
                </div>
                <button
                    onClick={() => openModal('add')}
                    className="bg-[#6BCB77] hover:bg-[#5bb866] text-white px-5 py-2.5 rounded-xl font-bold shadow-sm transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Baru
                </button>
            </div>

            {/* Table Card */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="py-4 px-6 text-slate-500 text-sm font-bold whitespace-nowrap">ID</th>
                                <th className="py-4 px-6 text-slate-500 text-sm font-bold whitespace-nowrap">Nama Kategori</th>
                                <th className="py-4 px-6 text-slate-500 text-sm font-bold whitespace-nowrap">Deskripsi</th>
                                <th className="py-4 px-6 text-slate-500 text-sm font-bold whitespace-nowrap text-center">Jumlah Produk</th>
                                <th className="py-4 px-6 text-slate-500 text-sm font-bold whitespace-nowrap text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories?.map((cat) => (
                                <tr key={cat.category_id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 px-6 text-[#6BCB77] text-sm font-bold">{cat.category_id}</td>
                                    <td className="py-4 px-6 text-slate-800 text-sm font-bold">{cat.category_name}</td>
                                    <td className="py-4 px-6 text-slate-500 text-sm">{cat.description ?? '—'}</td>
                                    <td className="py-4 px-6 text-center">
                                        <span className="text-blue-500 text-sm font-bold bg-blue-50 px-3 py-1 rounded-full">{cat.products_count ?? 0} Item</span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => openModal('edit', cat)}
                                                className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 text-amber-500 hover:bg-amber-100 flex items-center justify-center transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(cat.category_id)}
                                                className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
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
                    <button className="w-10 h-10 flex items-center justify-center text-sm font-bold text-white bg-[#6BCB77] rounded-lg shadow-sm">
                        1
                    </button>
                    <button className="px-4 py-2 text-sm text-slate-600 bg-white border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                        Next &raquo;
                    </button>
                </div>
            </div>            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    {/* Background backdrop */}
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                    
                    {/* Modal Panel - Flex Centered with Internal Scroll */}
                    <div className="relative w-full max-w-md bg-white rounded-3xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden">
                        
                        {/* Header */}
                        <div className="bg-white px-6 py-5 border-b border-slate-100 flex-shrink-0">
                            <h3 className="text-slate-800 text-lg font-bold" id="modal-title">
                                {modalMode === 'add' ? 'Tambah Kategori' : 'Edit Kategori'}
                            </h3>
                        </div>
                        
                        {/* Body - Scrollable */}
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 min-h-0 bg-white">
                            <form id="categoryForm" onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-slate-700 text-sm font-medium mb-1.5">Nama Kategori</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#6BCB77]/20 focus:border-[#6BCB77] transition-all" 
                                        placeholder="Contoh: Aksesoris"
                                        value={data.category_name}
                                        onChange={e => setData('category_name', e.target.value)}
                                        required
                                    />
                                    {errors.category_name && <p className="text-red-500 text-xs mt-1">{errors.category_name}</p>}
                                </div>
                                <div>
                                    <label className="block text-slate-700 text-sm font-medium mb-1.5">Status Kategori</label>
                                    <select 
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#6BCB77]/20 focus:border-[#6BCB77] transition-all"
                                        value={data.active ? '1' : '0'}
                                        onChange={e => setData('active', e.target.value === '1')}
                                    >
                                        <option value="1">Aktif</option>
                                        <option value="0">Non-aktif</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-slate-700 text-sm font-medium mb-1.5">Deskripsi (Opsional)</label>
                                    <textarea 
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#6BCB77]/20 focus:border-[#6BCB77] transition-all custom-scrollbar" 
                                        rows="3" 
                                        placeholder="Tulis deskripsi kategori..."
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
                                form="categoryForm"
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
