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

function Navbar({ auth, cartCount }) {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    return (
        <nav className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
            {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 gap-6">

                    {/* Logo */}
                    <Link href={route('dashboard')} className="flex items-center gap-2 flex-shrink-0 no-underline">
                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                            <MusicIcon color="#fff" />
                        </div>
                        <span className="font-bold text-xl text-gray-800 tracking-tight">Melodi POS</span>
                    </Link>

                    {/* Search */}
                    <div className="hidden md:block flex-1 max-w-xl">
                        <form onSubmit={(e) => { e.preventDefault(); router.get(route('product.catalog'), { search: searchQuery }); }} className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 focus:bg-white transition-all"
                                placeholder="Cari gitar, piano, drum..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </form>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-5">
                        <div className="hidden sm:flex items-center gap-5 text-sm font-medium text-gray-600">
                            <Link href={route('dashboard')} className="hover:text-emerald-600 transition-colors">Beranda</Link>
                            <Link href={route('product.catalog')} className="hover:text-emerald-600 transition-colors">Produk</Link>
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

export default function ProductDetail({ product, related, reviews, avgRating }) {
    const { props } = usePage();
    const auth = props.auth;
    const cartCount = props.cartCount ?? 0;
    
    const addToCart = () => {
        router.post(route('cart.add'), { product_id: product.product_id, quantity: 1 }, { preserveScroll: true });
    };

    const buyNow = () => {
        router.post(route('cart.add'), { product_id: product.product_id, quantity: 1, redirect_to_checkout: true });
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <Head title={`${product.name} — Melodi POS`} />
            <Navbar auth={auth} cartCount={cartCount} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
                    <div className="space-y-8">
                        <div className="rounded-[2rem] bg-white p-6 shadow-sm border border-gray-200">
                            <div className="aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-gray-100">
                                <img
                                    src={product.image_url || 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80'}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="mt-6 space-y-4">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                                        {product.category?.category_name || 'Umum'}
                                    </span>
                                    <span className="text-sm text-gray-500">Stok: {product.stock_qty}</span>
                                </div>
                                <h1 className="text-4xl font-extrabold text-gray-900">{product.name}</h1>
                                <p className="text-3xl font-bold text-emerald-600">{fmt(product.price)}</p>
                                <p className="text-gray-600 leading-relaxed">{product.description || 'Deskripsi produk belum tersedia.'}</p>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                    <span>Rating rata-rata: {avgRating.toFixed(1)} / 5</span>
                                    <span>•</span>
                                    <span>{reviews.length} ulasan</span>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={addToCart}
                                        className="rounded-full border-2 border-emerald-500 bg-white px-7 py-3 text-sm font-semibold text-emerald-600 shadow-sm hover:bg-emerald-50 transition-colors"
                                    >
                                        Tambahkan ke Keranjang
                                    </button>
                                    <button
                                        onClick={buyNow}
                                        className="rounded-full bg-emerald-500 px-7 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 transition-colors"
                                    >
                                        Beli Langsung
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[2rem] bg-white p-6 shadow-sm border border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Ulasan Pelanggan</h2>
                            {reviews.length === 0 ? (
                                <p className="text-gray-600">Belum ada ulasan untuk produk ini.</p>
                            ) : (
                                <div className="space-y-4">
                                    {reviews.map((review) => (
                                        <div key={review.review_id} className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <p className="font-semibold text-gray-900">{review.user_name}</p>
                                                    <p className="text-xs text-gray-500">{review.created_at}</p>
                                                </div>
                                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                                                    {review.rating} / 5
                                                </span>
                                            </div>
                                            <p className="mt-3 text-sm text-gray-700">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <aside className="space-y-6">
                        <div className="rounded-[2rem] bg-white p-6 shadow-sm border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">Produk Terkait</h3>
                            <div className="space-y-4">
                                {related.map((item) => (
                                    <Link
                                        key={item.product_id}
                                        href={route('product.detail', item.product_id)}
                                        className="block rounded-3xl border border-gray-100 bg-gray-50 p-4 hover:border-emerald-200 hover:bg-white transition"
                                    >
                                        <p className="font-semibold text-gray-900">{item.name}</p>
                                        <p className="text-sm text-gray-500">{item.category?.category_name || 'Umum'}</p>
                                        <p className="mt-2 text-sm font-bold text-gray-900">{fmt(item.price)}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
