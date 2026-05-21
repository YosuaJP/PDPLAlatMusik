import { Head } from '@inertiajs/react';

export default function AdminProducts({ products, categories }) {
    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Head title="Produk Admin — Melodi POS" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Produk</h1>
                        <p className="text-slate-400 mt-2">Kelola daftar produk yang tersedia di toko.</p>
                    </div>
                    <div className="rounded-2xl bg-slate-900 px-4 py-3 text-sm text-slate-400">
                        {products.length} produk terdaftar
                    </div>
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-xl">
                    <table className="w-full min-w-[720px] border-collapse text-left text-sm text-slate-300">
                        <thead className="bg-slate-950 text-slate-400">
                            <tr>
                                <th className="px-6 py-4">Nama</th>
                                <th className="px-6 py-4">Kategori</th>
                                <th className="px-6 py-4">Harga</th>
                                <th className="px-6 py-4">Stok</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.product_id} className="border-t border-slate-800 hover:bg-slate-900/80">
                                    <td className="px-6 py-4 font-medium text-white">{product.name}</td>
                                    <td className="px-6 py-4">{product.category?.category_name || 'Umum'}</td>
                                    <td className="px-6 py-4">Rp {Number(product.price).toLocaleString('id-ID')}</td>
                                    <td className="px-6 py-4">{product.stock_qty}</td>
                                    <td className="px-6 py-4">{product.active ? 'Aktif' : 'Nonaktif'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
