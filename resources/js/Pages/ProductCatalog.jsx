import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const fmt = (value) => 'Rp ' + Number(value).toLocaleString('id-ID');

function MusicIcon({ color = '#10b981' }) {
    return (
        <svg width="24" height="24" fill="none" stroke={color} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
    );
}

function Navbar({ auth, cartCount, searchQuery, onSearch, onSubmitSearch }) {
    const [open, setOpen] = useState(false);
    return (
        <nav className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
            {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 gap-6">

                    {/* Logo */}
                    <Link href={route('welcome')} className="flex items-center gap-2 flex-shrink-0 no-underline">
                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                            <MusicIcon color="#fff" />
                        </div>
                        <span className="font-bold text-xl text-gray-800 tracking-tight">NadaKito</span>
                    </Link>

                    {/* Search */}
                    <div className="hidden md:block flex-1 max-w-xl">
                        <form onSubmit={(e) => { e.preventDefault(); onSubmitSearch(); }} className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 focus:bg-white transition-all"
                                placeholder="Cari gitar, piano, drum..."
                                value={searchQuery}
                                onChange={e => onSearch(e.target.value)}
                            />
                        </form>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-5">
                        <div className="hidden sm:flex items-center gap-5 text-sm font-medium text-gray-600">
                            <Link href={route('welcome')} className="hover:text-emerald-600 transition-colors">Beranda</Link>
                            <Link href={route('product.catalog')} className="text-emerald-600 font-semibold">Produk</Link>
                        </div>

                        {/* Cart icon */}
                        <Link href={route('cart.index')} className="relative text-gray-600 hover:text-emerald-600 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {cartCount > 9 ? '9+' : cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Avatar dropdown */}
                        {auth?.user && (
                            <div className="relative z-50">
                                <button
                                    onClick={() => setOpen(p => !p)}
                                    className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm hover:opacity-90 transition-opacity focus:outline-none">
                                    {auth.user.name?.charAt(0).toUpperCase()}
                                </button>

                                {open && (
                                    <div className="absolute right-0 top-10 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-bold text-gray-800 truncate">{auth.user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{auth.user.email}</p>
                                        </div>

                                        <Link href={route('profile.edit')} onClick={() => setOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors no-underline">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Profil Saya
                                        </Link>

                                        <Link href={route('cart.index')} onClick={() => setOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors no-underline">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            Keranjang Saya
                                        </Link>

                                        <Link href={route('orders.index')} onClick={() => setOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors no-underline">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Pesanan Saya
                                        </Link>

                                        <div className="border-t border-gray-100 mt-1 pt-1">
                                            <button
                                                onClick={() => { setOpen(false); router.post(route('logout')); }}
                                                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Keluar
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default function ProductCatalog({ products, categories, filters }) {
    const { props } = usePage();
    const auth = props.auth;
    const cartCount = props.cartCount ?? 0;
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
            <Head title="" />
            <Navbar auth={auth} cartCount={cartCount} searchQuery={search} onSearch={setSearch} onSubmitSearch={submitFilters} />

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
                    {products.map((product) => {
                        const isSoldOut = product.stock_qty <= 0;
                        return (
                        <div key={product.product_id} className={`rounded-3xl border border-gray-200 bg-white p-5 shadow-sm relative ${isSoldOut ? 'opacity-70 pointer-events-none grayscale-[0.8]' : 'transition hover:shadow-md'}`}>
                            {isSoldOut && (
                                <div className="absolute top-8 right-8 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                                    Habis
                                </div>
                            )}
                            <Link href={isSoldOut ? '#' : route('product.detail', product.product_id)} className="group block overflow-hidden rounded-3xl bg-gray-50 mb-4">
                                <img
                                    src={product.image_url || `https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80&sig=${product.product_id}`}
                                    alt={product.name}
                                    className={`h-48 w-full object-cover transition duration-300 ${!isSoldOut && 'group-hover:scale-105'}`}
                                />
                            </Link>
                            <div className="mb-2 text-xs uppercase tracking-[0.2em] text-emerald-600">{product.category?.category_name || 'Umum'}</div>
                            <Link href={isSoldOut ? '#' : route('product.detail', product.product_id)} className="text-lg font-bold text-gray-900 hover:text-emerald-600 transition-colors">
                                {product.name}
                            </Link>
                            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{product.description || 'Tidak ada deskripsi tersedia.'}</p>
                            <div className="mt-4 flex items-center justify-between gap-3">
                                <span className="text-xl font-extrabold text-gray-900">{fmt(product.price)}</span>
                                {product.stock_qty > 0 ? (
                                    <button
                                        onClick={() => addToCart(product.product_id)}
                                        className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors"
                                    >
                                        Tambah
                                    </button>
                                ) : (
                                    <span className="rounded-full bg-red-100 px-4 py-2 text-xs font-bold text-red-600">
                                        Stok Habis
                                    </span>
                                )}
                            </div>
                        </div>
                    )})}
                </div>
            </div>
        </div>
    );
}
