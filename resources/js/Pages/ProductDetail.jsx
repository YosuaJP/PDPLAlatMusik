import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const fmt = (n) => 'Rp ' + Number(n).toLocaleString('id-ID');

function MusicIcon({ color = '#10b981', size = 24 }) {
    return (
        <svg width={size} height={size} fill="none" stroke={color} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
    );
}

function Stars({ rating, size = 'md' }) {
    const sz = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <svg key={i} className={`${sz} ${i <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

/* ── Navbar ── */
function Navbar({ auth, cartCount }) {
    const [open, setOpen] = useState(false);
    return (
        <nav className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
            {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 gap-6">
                    <Link href={route('dashboard')} className="flex items-center gap-2 flex-shrink-0 no-underline">
                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                            <MusicIcon color="#fff" />
                        </div>
                        <span className="font-bold text-xl text-gray-800 tracking-tight">Melodi POS</span>
                    </Link>
                    <div className="flex-1" />
                    <div className="hidden sm:flex items-center gap-5 text-sm font-medium text-gray-600">
                        <Link href={route('dashboard')} className="hover:text-emerald-600 transition-colors">Beranda</Link>
                        <span className="cursor-pointer hover:text-emerald-600 transition-colors">Produk</span>
                    </div>
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
                    {auth?.user && (
                        <div className="relative z-50">
                            <button onClick={() => setOpen(p => !p)}
                                className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm hover:opacity-90 transition-opacity focus:outline-none">
                                {auth.user.name?.charAt(0).toUpperCase()}
                            </button>
                            {open && (
                                <div className="absolute right-0 top-10 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-bold text-gray-800 truncate">{auth.user.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{auth.user.email}</p>
                                    </div>
                                    <Link href={route('profile.edit')} onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 no-underline">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        Profil Saya
                                    </Link>
                                    <Link href={route('cart.index')} onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 no-underline">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                        Keranjang Saya
                                    </Link>
                                    <div className="border-t border-gray-100 mt-1 pt-1">
                                        <button onClick={() => { setOpen(false); router.post(route('logout')); }}
                                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 text-left">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                            Keluar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

/* ── Main Page ── */
export default function ProductDetail({ product, related, reviews, avgRating }) {
    const { props }   = usePage();
    const auth        = props.auth;
    const cartCount   = props.cartCount ?? 0;

    const [qty, setQty]         = useState(1);
    const [activeTab, setTab]   = useState('deskripsi');
    const [addedToCart, setAdded] = useState(false);

    const subtotal = Number(product.price) * qty;

    const handleAddToCart = () => {
        router.post(route('cart.add'), { product_id: product.product_id, quantity: qty }, {
            preserveScroll: true,
            onSuccess: () => {
                setAdded(true);
                setTimeout(() => setAdded(false), 2000);
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Head title={`${product.name} — Melodi POS`} />
            <Navbar auth={auth} cartCount={cartCount} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link href={route('dashboard')} className="hover:text-emerald-600 transition-colors no-underline">Home</Link>
                    <span>›</span>
                    <span>Produk</span>
                    <span>›</span>
                    <span className="text-gray-800 font-medium truncate max-w-xs">{product.name}</span>
                </nav>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr_320px] gap-8 mb-12">

                    {/* ── Left: Images ── */}
                    <div className="flex flex-col gap-3">
                        {/* Badge */}
                        <div className="relative">
                            {product.active && (
                                <span className="absolute top-3 left-3 z-10 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow">
                                    Original
                                </span>
                            )}
                            <div className="aspect-square bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex items-center justify-center">
                                {product.image_url
                                    ? <img src={product.image_url} alt={product.name} className="w-full h-full object-contain p-4" />
                                    : <MusicIcon color="#d1d5db" size={80} />
                                }
                            </div>
                        </div>
                        {/* Thumbnail */}
                        {product.image_url && (
                            <div className="flex gap-2">
                                <div className="w-16 h-16 bg-white rounded-xl border-2 border-emerald-400 overflow-hidden cursor-pointer">
                                    <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Center: Info + Tabs ── */}
                    <div>
                        <p className="text-emerald-600 text-sm font-semibold mb-1">{product.category?.category_name ?? 'Umum'}</p>
                        <h1 className="text-2xl font-extrabold text-gray-900 mb-2 leading-snug">{product.name}</h1>

                        {/* Rating row */}
                        <div className="flex items-center gap-2 mb-4">
                            <Stars rating={avgRating} />
                            <span className="text-sm font-semibold text-gray-700">{avgRating > 0 ? avgRating.toFixed(1) : '—'}</span>
                            <span className="text-sm text-gray-400">({reviews.length} Ulasan)</span>
                        </div>

                        {/* Price */}
                        <p className="text-3xl font-extrabold text-gray-900 mb-6">{fmt(product.price)}</p>

                        {/* Tabs */}
                        <div className="border-b border-gray-200 mb-4">
                            <div className="flex gap-6">
                                {['deskripsi', 'info'].map(tab => (
                                    <button key={tab} onClick={() => setTab(tab)}
                                        className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === tab ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                                        {tab === 'deskripsi' ? 'Deskripsi' : 'Info Penting'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {activeTab === 'deskripsi' ? (
                            <div className="text-sm text-gray-600 leading-relaxed">
                                {product.description
                                    ? <p>{product.description}</p>
                                    : <p className="text-gray-400 italic">Tidak ada deskripsi untuk produk ini.</p>
                                }
                            </div>
                        ) : (
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">SKU</span>
                                    <span className="font-semibold text-gray-800">{product.sku}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Kategori</span>
                                    <span className="font-semibold text-gray-800">{product.category?.category_name ?? '—'}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Status</span>
                                    <span className={`font-semibold ${product.stock_qty > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                        {product.stock_qty > 0 ? 'Tersedia' : 'Habis'}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-500">Stok</span>
                                    <span className="font-semibold text-gray-800">{product.stock_qty} pcs</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Right: Order Panel ── */}
                    <div className="lg:sticky lg:top-20 self-start">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <h3 className="font-bold text-gray-900 mb-4 text-base">Atur Pesanan</h3>

                            {/* Stock info */}
                            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 mb-5">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    <span className="text-sm text-gray-600 font-medium">Stok Tersedia</span>
                                </div>
                                <span className="text-sm font-extrabold text-gray-800">{product.stock_qty}</span>
                            </div>

                            {/* Qty selector */}
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-gray-500 font-medium">Jumlah</span>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setQty(q => Math.max(1, q - 1))}
                                        className="w-9 h-9 rounded-full border border-gray-200 bg-white text-gray-600 flex items-center justify-center text-lg font-bold hover:border-emerald-400 hover:text-emerald-600 transition-colors shadow-sm">
                                        −
                                    </button>
                                    <span className="w-10 text-center font-bold text-gray-900 text-lg">{qty}</span>
                                    <button
                                        onClick={() => setQty(q => Math.min(product.stock_qty, q + 1))}
                                        disabled={qty >= product.stock_qty}
                                        className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center text-lg font-bold hover:bg-emerald-600 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed">
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Subtotal */}
                            <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-4 mb-5">
                                <span className="text-sm text-gray-500">Subtotal</span>
                                <span className="text-base font-extrabold text-gray-900">{fmt(subtotal)}</span>
                            </div>

                            {/* Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock_qty === 0}
                                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-full font-bold text-sm transition-all shadow-sm
                                        ${addedToCart
                                            ? 'bg-gray-100 text-emerald-700 border-2 border-emerald-300'
                                            : 'bg-white border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50'
                                        } disabled:opacity-40 disabled:cursor-not-allowed`}>
                                    {addedToCart ? (
                                        <>✓ Ditambahkan!</>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            + Keranjang
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => {
                                        router.post(route('cart.add'), { product_id: product.product_id, quantity: qty }, {
                                            preserveScroll: false,
                                            onSuccess: () => router.get(route('cart.index')),
                                        });
                                    }}
                                    disabled={product.stock_qty === 0}
                                    className="w-full py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-colors shadow-md shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed">
                                    Beli Langsung
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Reviews Section ── */}
                <div className="mb-12">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        Ulasan Pembeli
                        {reviews.length > 0 && <span className="text-base font-normal text-gray-400 ml-2">({reviews.length})</span>}
                    </h2>

                    {reviews.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
                            {/* Rating Summary */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center">
                                <p className="text-5xl font-extrabold text-gray-900">{avgRating.toFixed(1)}</p>
                                <p className="text-sm text-gray-400 mb-2">/ 5.0</p>
                                <Stars rating={avgRating} size="lg" />
                                <p className="text-xs text-gray-400 mt-2">{reviews.length} ulasan</p>
                            </div>

                            {/* Review Cards */}
                            <div className="space-y-4">
                                {reviews.map(r => (
                                    <div key={r.review_id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                        <div className="flex items-start gap-3">
                                            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                                                {r.user_name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="font-semibold text-gray-800 text-sm">{r.user_name}</p>
                                                    <p className="text-xs text-gray-400">{r.created_at}</p>
                                                </div>
                                                <Stars rating={r.rating} size="sm" />
                                                {r.comment && <p className="text-sm text-gray-600 mt-2 leading-relaxed">{r.comment}</p>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                            <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            <p className="text-gray-400 text-sm">Belum ada ulasan untuk produk ini.</p>
                        </div>
                    )}
                </div>

                {/* ── Related Products ── */}
                {related.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Produk Serupa</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                            {related.map(p => (
                                <Link key={p.product_id} href={route('product.detail', p.product_id)}
                                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-200 transition-all no-underline group flex flex-col">
                                    <div className="aspect-square bg-gray-50 overflow-hidden">
                                        {p.image_url
                                            ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                            : <div className="w-full h-full flex items-center justify-center"><MusicIcon color="#d1d5db" /></div>
                                        }
                                    </div>
                                    <div className="p-3 flex-1 flex flex-col">
                                        <p className="text-[10px] text-emerald-600 font-semibold mb-1">{p.category?.category_name ?? 'Umum'}</p>
                                        <p className="text-xs font-bold text-gray-900 line-clamp-2 leading-tight flex-1">{p.name}</p>
                                        <p className="text-sm font-extrabold text-gray-900 mt-2">{fmt(p.price)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
