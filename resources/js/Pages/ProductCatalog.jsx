import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const fmt = (value) => 'Rp ' + Number(value).toLocaleString('id-ID');

export default function ProductCatalog({ products, categories, filters }) {
    const { props } = usePage();
    const auth = props.auth;
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');
    const [sort, setSort] = useState(filters.sort || 'latest');

    const submitFilters = () => {
        router.get(route('product.catalog'), { search, category, sort }, { preserveState: true, replace: true });
    };

    const addToCart = (productId) => {
        router.post(route('cart.add'), { product_id: productId, quantity: 1 }, { preserveScroll: true });
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <Head title="Katalog Produk — Melodi POS" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">Katalog Produk</h1>
                        <p className="mt-2 text-gray-600">Temukan semua alat musik terbaik kami di sini.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 w-full sm:w-auto">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari produk..."
                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus:border-emerald-400 focus:outline-none"
                        />
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus:border-emerald-400 focus:outline-none"
                        >
                            <option value="">Semua Kategori</option>
                            {categories.map((cat) => (
                                <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                            ))}
                        </select>
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus:border-emerald-400 focus:outline-none"
                        >
                            <option value="latest">Terbaru</option>
                            <option value="price_asc">Harga Terendah</option>
                            <option value="price_desc">Harga Tertinggi</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end mb-6">
                    <button
                        onClick={submitFilters}
                        className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 transition-colors"
                    >
                        Terapkan Filter
                    </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {products.map((product) => (
                        <div key={product.product_id} className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                            <Link href={route('product.detail', product.product_id)} className="group block overflow-hidden rounded-3xl bg-gray-50 mb-4">
                                <img
                                    src={product.image_url || `https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80&sig=${product.product_id}`}
                                    alt={product.name}
                                    className="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
                                />
                            </Link>
                            <div className="mb-2 text-xs uppercase tracking-[0.2em] text-emerald-600">{product.category?.category_name || 'Umum'}</div>
                            <Link href={route('product.detail', product.product_id)} className="text-lg font-bold text-gray-900 hover:text-emerald-600 transition-colors">
                                {product.name}
                            </Link>
                            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{product.description || 'Tidak ada deskripsi tersedia.'}</p>
                            <div className="mt-4 flex items-center justify-between gap-3">
                                <span className="text-xl font-extrabold text-gray-900">{fmt(product.price)}</span>
                                <button
                                    onClick={() => addToCart(product.product_id)}
                                    className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors"
                                >
                                    Tambah
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
