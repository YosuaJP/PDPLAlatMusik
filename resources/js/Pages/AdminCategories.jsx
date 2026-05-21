import { Head } from '@inertiajs/react';

export default function AdminCategories({ categories }) {
    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Head title="Kategori Admin — Melodi POS" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Kategori</h1>
                        <p className="text-slate-400 mt-2">Kelola kategori produk yang dapat dipilih user.</p>
                    </div>
                    <div className="rounded-2xl bg-slate-900 px-4 py-3 text-sm text-slate-400">
                        {categories.length} kategori tersedia
                    </div>
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-xl">
                    <table className="w-full min-w-[720px] border-collapse text-left text-sm text-slate-300">
                        <thead className="bg-slate-950 text-slate-400">
                            <tr>
                                <th className="px-6 py-4">Nama Kategori</th>
                                <th className="px-6 py-4">Deskripsi</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr key={category.category_id} className="border-t border-slate-800 hover:bg-slate-900/80">
                                    <td className="px-6 py-4 font-medium text-white">{category.category_name}</td>
                                    <td className="px-6 py-4">{category.description || 'Tidak ada deskripsi'}</td>
                                    <td className="px-6 py-4">{category.active ? 'Aktif' : 'Nonaktif'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
