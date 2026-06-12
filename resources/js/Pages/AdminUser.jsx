import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminUser({ users, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [role, setRole]     = useState(filters?.role   || '');
    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode]   = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId]       = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name:         '',
        email:        '',
        password:     '',
        role:         'user',
        phone_number: '',
        status:       'active',
    });

    const triggerFilter = () => {
        router.get(route('admin.users.index'), { search, role }, { preserveState: true, replace: true });
    };

    const openCreate = () => {
        reset(); clearErrors(); setEditMode(false); setModalOpen(true);
    };

    const openEdit = (user) => {
        clearErrors();
        setData({
            name:         user.name,
            email:        user.email,
            role:         user.role,
            phone_number: user.phone_number || '',
            status:       user.status || 'active',
            password:     '',
        });
        setSelectedId(user.user_id);
        setEditMode(true);
        setModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) {
            put(route('admin.users.update', selectedId), { onSuccess: () => setModalOpen(false) });
        } else {
            post(route('admin.users.store'), { onSuccess: () => setModalOpen(false) });
        }
    };

    const confirmDelete = (id) => { setDeleteId(id); setDeleteModal(true); };
    const handleDelete = () => {
        destroy(route('admin.users.destroy', deleteId), { onSuccess: () => setDeleteModal(false) });
    };

    const userList = users?.data ?? [];
    const pagLinks = users?.links ?? [];

    return (
        <AdminLayout pageTitle="Daftar User">
            <Head title="" />

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Daftar Pengguna</h2>
                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            value={role}
                            onChange={e => setRole(e.target.value)}
                            className="px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all"
                        >
                            <option value="">-- Semua Role --</option>
                            <option value="admin">Admin / Pemilik</option>
                            <option value="user">Customer Toko</option>
                        </select>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Cari nama / email..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && triggerFilter()}
                                className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all w-48 sm:w-64"
                            />
                            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <button onClick={triggerFilter} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-bold transition-all">
                            Cari
                        </button>
                        <button onClick={openCreate} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all">
                            + Tambah
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto border border-gray-100 rounded-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                                <th className="px-5 py-3.5">User</th>
                                <th className="px-5 py-3.5">Role</th>
                                <th className="px-5 py-3.5">Kontak</th>
                                <th className="px-5 py-3.5">Status</th>
                                <th className="px-5 py-3.5">Tanggal Bergabung</th>
                                <th className="px-5 py-3.5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            {userList.length > 0 ? userList.map(u => (
                                <tr key={u.user_id} className="hover:bg-gray-50/60 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                                                {u.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{u.name}</p>
                                                <p className="text-[10px] text-gray-400 font-mono mt-0.5">ID: {u.user_id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">
                                            {u.role === 'admin' ? 'Owner / Pemilik' : 'Customer Toko'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-xs text-gray-500">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                            <span>{u.email}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                            <span>{u.phone_number || '—'}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        {u.status === 'active' ? (
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                                Active
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-red-600">
                                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                                Inactive
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-xs text-gray-500">{u.created_at}</td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="inline-flex items-center gap-2">
                                            <button onClick={() => openEdit(u)} className="text-blue-600 hover:text-blue-800 transition-colors" title="Edit">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </button>
                                            <button onClick={() => confirmDelete(u.user_id)} className="text-red-500 hover:text-red-700 transition-colors" title="Hapus">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-sm">Tidak ada data pengguna.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {pagLinks.length > 3 && (
                    <div className="flex justify-center mt-6 gap-1">
                        {pagLinks.map((link, idx) => {
                            if (!link.url) return null;
                            return (
                                <Link
                                    key={idx} href={link.url}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${link.active ? 'bg-emerald-600 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal Create/Edit */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 my-8 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-gray-800 font-bold text-base">{editMode ? 'Edit Pengguna' : 'Tambah Pengguna'}</h3>
                            <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Nama Lengkap</label>
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-100 focus:outline-none text-sm" />
                                    {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name}</span>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Email</label>
                                        <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-100 focus:outline-none text-sm" />
                                        {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email}</span>}
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">No. HP</label>
                                        <input type="text" value={data.phone_number} onChange={e => setData('phone_number', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-100 focus:outline-none text-sm" />
                                        {errors.phone_number && <span className="text-red-500 text-xs mt-1 block">{errors.phone_number}</span>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Role</label>
                                        <select value={data.role} onChange={e => setData('role', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-100 focus:outline-none text-sm">
                                            <option value="user">Customer Toko</option>
                                            <option value="admin">Admin / Pemilik</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Status Akun</label>
                                        <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-100 focus:outline-none text-sm">
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Password {editMode && '(Opsional)'}</label>
                                    <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-emerald-100 focus:outline-none text-sm" />
                                    {errors.password && <span className="text-red-500 text-xs mt-1 block">{errors.password}</span>}
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-100">Batal</button>
                                <button type="submit" disabled={processing} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold disabled:opacity-50">
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Delete */}
            {deleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl">
                        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h4 className="font-bold">Hapus Pengguna?</h4>
                        <p className="text-xs text-gray-400 mt-2">Data ini tidak dapat dikembalikan.</p>
                        <div className="flex justify-center gap-3 mt-6">
                            <button onClick={() => setDeleteModal(false)} className="px-4 py-2 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-100">Batal</button>
                            <button onClick={handleDelete} className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold">Hapus</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
