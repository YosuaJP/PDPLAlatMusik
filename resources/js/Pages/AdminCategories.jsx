import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminCategories({ categories }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentCategoryId, setCurrentCategoryId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        category_name: '',
        description: '',
        active: true,
    });

    const openCreateModal = () => {
        reset();
        clearErrors();
        setEditMode(false);
        setIsModalOpen(true);
    };

    const openEditModal = (category) => {
        clearErrors();
        setData({
            category_name: category.category_name || '',
            description: category.description || '',
            active: category.active ?? true,
        });
        setCurrentCategoryId(category.category_id);
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
            put(route('categories.update', currentCategoryId), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('categories.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        destroy(route('categories.destroy', deleteId), {
            onSuccess: () => setShowDeleteModal(false),
        });
    };

    const categoryList = categories?.data ?? [];
    const paginationLinks = categories?.links ?? [];

    return (
        <AdminLayout pageTitle="Manajemen Kategori">
            <Head title="Manajemen Kategori — Melodi POS" />

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Daftar Kategori</h2>
                        <p className="text-gray-400 text-xs mt-1">Kelompokkan dan kelola jenis produk alat musik di tokomu.</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Baru
                    </button>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto border border-gray-100 rounded-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Nama Kategori</th>
                                <th className="px-6 py-4">Deskripsi</th>
                                <th className="px-6 py-4">Jumlah Produk</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            {categoryList.length > 0 ? (
                                categoryList.map((category) => (
                                    <tr key={category.category_id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-emerald-600 text-xs tracking-wider">
                                            CAT-{String(category.category_id).padStart(3, '0')}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">
                                            {category.category_name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-xs max-w-xs truncate">
                                            {category.description || '—'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                                                {category.products_count ?? 0} Item
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${category.active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                                                {category.active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="inline-flex items-center gap-2">
                                                <button
                                                    onClick={() => openEditModal(category)}
                                                    className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 flex items-center justify-center transition-colors"
                                                    title="Edit Kategori"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(category.category_id)}
                                                    className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
                                                    title="Hapus Kategori"
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
                                        Belum ada kategori yang ditambahkan.
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden transform transition-all">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-gray-800 font-bold text-base">
                                {editMode ? 'Edit Kategori' : 'Tambah Kategori'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit}>
                            <div className="p-6 space-y-4">
                                {/* Name Input */}
                                <div>
                                    <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Nama Kategori</label>
                                    <input
                                        type="text"
                                        value={data.category_name}
                                        onChange={e => setData('category_name', e.target.value)}
                                        placeholder="cth: Alat Tiup"
                                        className={`w-full px-3.5 py-2.5 rounded-xl border ${errors.category_name ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 focus:ring-emerald-100'} focus:outline-none focus:ring-4 transition-all text-sm`}
                                    />
                                    {errors.category_name && <span className="text-red-500 text-xs mt-1 block">{errors.category_name}</span>}
                                </div>

                                {/* Status Active Dropdown */}
                                <div>
                                    <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Status Kategori</label>
                                    <select
                                        value={data.active ? '1' : '0'}
                                        onChange={e => setData('active', e.target.value === '1')}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all text-sm"
                                    >
                                        <option value="1">Aktif</option>
                                        <option value="0">Nonaktif</option>
                                    </select>
                                </div>

                                {/* Description Input */}
                                <div>
                                    <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Deskripsi</label>
                                    <textarea
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        rows="3"
                                        placeholder="Tulis deskripsi kategori..."
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all text-sm resize-none"
                                    ></textarea>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
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
                        <h4 className="text-gray-800 font-bold text-base">Hapus Kategori?</h4>
                        <p className="text-gray-400 text-xs mt-2">Tindakan ini permanen dan akan menghapus kategori ini dari sistem.</p>
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
