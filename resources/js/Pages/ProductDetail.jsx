/**
 * @codecite
 * generator: Antigravity by Google DeepMind
 * project: NadaKito E-Commerce
 * frameworks: React.js 18.x, Inertia.js
 * description: Product detail page rendering information, stock checks, manual quantity additions, and public reviews featuring images/videos.
 */

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
                    <Link href={route('welcome')} className="flex items-center gap-2 flex-shrink-0 no-underline">
                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                            <MusicIcon color="#fff" />
                        </div>
                        <span className="font-bold text-xl text-gray-800 tracking-tight">NadaKito</span>
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
                            <Link href={route('welcome')} className="hover:text-emerald-600 transition-colors">Beranda</Link>
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

export default function ProductDetail({ product, related, reviews, avgRating }) {
    const { props } = usePage();
    const auth = props.auth;
    const cartCount = props.cartCount ?? 0;
    const [qty, setQty] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const addToCart = () => {
        setIsLoading(true);
        router.post(route('cart.add'), { product_id: product.product_id, quantity: qty }, { preserveScroll: true, onFinish: () => setIsLoading(false) });
    };

    const confirmBuyNow = () => {
        setIsLoading(true);
        router.post(
            route('checkout.direct'),
            { product_id: product.product_id, quantity: qty },
            { onFinish: () => setIsLoading(false) }
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <Head title="" />
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
                                            <p className="mt-3 text-sm text-gray-700 whitespace-pre-line">{review.comment}</p>
                                            {(review.image_urls || review.video_url) && (
                                                <div className="mt-4 pt-3 border-t border-gray-200/60 flex flex-wrap gap-2">
                                                    {review.image_urls && review.image_urls.map((img, i) => (
                                                        <div key={i} className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shadow-sm" onClick={() => setSelectedImage(img)}>
                                                            <img src={img} alt="Review" className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer" />
                                                        </div>
                                                    ))}
                                                    {review.video_url && (
                                                        <div className="w-24 h-16 rounded-lg overflow-hidden border border-gray-200 bg-black shadow-sm relative group">
                                                            <video src={review.video_url} className="w-full h-full object-contain" controls />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <aside className="space-y-6">
                        <div className="rounded-[2rem] bg-white p-6 shadow-sm border border-gray-200 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-900 mb-5">Atur Pesanan</h3>
                            
                            {/* Stock Indicator */}
                            <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 px-4 py-3 rounded-2xl mb-6">
                                <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                <span className="font-medium text-sm flex-1">Stok Tersedia</span>
                                <span className="font-extrabold text-base">{product.stock_qty}</span>
                            </div>

                            {/* Quantity Controls & Buttons */}
                            {product.stock_qty > 0 ? (
                                <>
                                    <div className="flex items-center justify-between mb-6 border border-gray-200 rounded-full p-1.5">
                                        <button
                                            onClick={() => setQty(q => Math.max(1, q - 1))}
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition disabled:opacity-40"
                                            disabled={qty <= 1}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4" /></svg>
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            max={product.stock_qty}
                                            value={qty}
                                            onChange={(e) => {
                                                const val = e.target.value === '' ? '' : parseInt(e.target.value);
                                                setQty(val);
                                            }}
                                            onBlur={(e) => {
                                                let val = parseInt(e.target.value) || 1;
                                                if (val > product.stock_qty) val = product.stock_qty;
                                                if (val < 1) val = 1;
                                                setQty(val);
                                            }}
                                            className="w-16 text-lg font-bold text-center text-gray-900 bg-transparent border-none focus:ring-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                        <button
                                            onClick={() => setQty(q => Math.min(product.stock_qty, q + 1))}
                                            className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition disabled:opacity-40"
                                            disabled={qty >= product.stock_qty}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-center mb-6 px-1">
                                        <span className="text-sm text-gray-500 font-medium">Subtotal</span>
                                        <span className="text-xl font-extrabold text-gray-900">{fmt(product.price * qty)}</span>
                                    </div>

                                    <div className="space-y-3">
                                        <button
                                            onClick={addToCart}
                                            disabled={isLoading}
                                            className="w-full rounded-full bg-emerald-500 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-600 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                            + Keranjang
                                        </button>
                                        <button
                                            onClick={confirmBuyNow}
                                            disabled={isLoading}
                                            className="w-full rounded-full border-2 border-emerald-500 bg-white py-3.5 text-sm font-bold text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-70"
                                        >
                                            Beli Langsung
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-6">
                                    <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-6 py-3 text-sm font-bold text-red-600 mb-2">
                                        Stok Habis
                                    </span>
                                    <p className="text-xs text-gray-500">Mohon maaf, produk ini sedang tidak tersedia.</p>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
            {/* Image Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
                    <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center animate-in fade-in zoom-in-95 duration-200">
                        <button onClick={() => setSelectedImage(null)} className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <img src={selectedImage} alt="Fullscreen View" className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" onClick={e => e.stopPropagation()} />
                    </div>
                </div>
            )}
        </div>
    );
}
