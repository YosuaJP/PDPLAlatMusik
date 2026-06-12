import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const fmt = (n) => 'Rp ' + Number(n).toLocaleString('id-ID');

function MusicIcon({ color = '#10b981' }) {
    return (
        <svg width="24" height="24" fill="none" stroke={color} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
    );
}

/* ── Navbar ── */
function Navbar({ auth, cartCount, searchQuery, onSearch }) {
    const [open, setOpen] = useState(false);
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
                        <span className="font-bold text-xl text-gray-800 tracking-tight">NadaKito</span>
                    </Link>

                    {/* Search */}
                    <div className="hidden md:block flex-1 max-w-xl">
                        <div className="relative">
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
                        </div>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-5">
                        <div className="hidden sm:flex items-center gap-5 text-sm font-medium text-gray-600">
                            <Link href={route('dashboard')} className="text-emerald-600 font-semibold">Beranda</Link>
                            <Link href={route('product.catalog')} className="cursor-pointer hover:text-emerald-600 transition-colors">Produk</Link>
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

/* ── Pending Order Countdown ── */
function PendingOrderCountdown({ createdAtRaw, externalId, orderId, amount }) {
    const EXPIRE_MINUTES = 15;

    const calcRemaining = () => {
        if (!createdAtRaw) return 0;
        const created = new Date(createdAtRaw).getTime();
        if (isNaN(created)) return 0;
        const expireAt = created + EXPIRE_MINUTES * 60 * 1000;
        const diff = expireAt - Date.now();
        return Math.max(0, Math.floor(diff / 1000));
    };

    const [secs, setSecs] = useState(calcRemaining);

    useEffect(() => {
        setSecs(calcRemaining());
        const interval = setInterval(() => setSecs(calcRemaining()), 1000);
        return () => clearInterval(interval);
    }, [createdAtRaw]);

    const mm = String(Math.floor(secs / 60)).padStart(2, '0');
    const ss = String(secs % 60).padStart(2, '0');
    const isExpiring = secs > 0 && secs <= 120;
    const isExpired = secs === 0;

    // Kalau sudah expired, hilang dari daftar
    if (isExpired) return null;

    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px',
            background: '#fff',
            border: `1.5px solid ${isExpired ? '#fecaca' : isExpiring ? '#fed7aa' : '#fde68a'}`,
            borderRadius: 16,
            borderLeft: `5px solid ${isExpired ? '#ef4444' : isExpiring ? '#f97316' : '#f59e0b'}`,
            transition: 'all 0.3s ease',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {/* Clock icon */}
                <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: isExpired ? '#fee2e2' : '#fef3c7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18,
                }}>
                    {isExpired ? '❌' : '🕐'}
                </div>
                <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>
                        Pesanan #{orderId}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                        {isExpired ? (
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#ef4444' }}>• Expired</span>
                        ) : (
                            <span style={{
                                fontSize: 12, fontWeight: 700,
                                color: isExpiring ? '#ea580c' : '#d97706',
                                animation: isExpiring ? 'pulse 1s ease infinite' : 'none',
                            }}>
                                • Expiring in {mm}:{ss}
                            </span>
                        )}
                        <span style={{ fontSize: 12, color: '#6b7280' }}>amount: {fmt(amount)}</span>
                    </div>
                </div>
            </div>

            {externalId ? (
                <Link
                    href={route('payment.checkout', externalId)}
                    style={{
                        flexShrink: 0,
                        padding: '9px 18px',
                        background: '#1a1a1a',
                        color: '#fff',
                        borderRadius: 10,
                        fontSize: 12,
                        fontWeight: 700,
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                    }}
                >
                    resume payment →
                </Link>
            ) : (
                <Link
                    href={route('orders.show', orderId)}
                    style={{
                        flexShrink: 0,
                        padding: '9px 18px',
                        background: '#6b7280',
                        color: '#fff',
                        borderRadius: 10,
                        fontSize: 12,
                        fontWeight: 700,
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                    }}
                >
                    lihat detail →
                </Link>
            )}
        </div>
    );
}


/* ── Product Card ── */
function ProductCard({ product, onAdd, justAdded }) {
    const isSoldOut = product.stock_qty <= 0;
    
    return (
        <div className={`bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col relative ${isSoldOut ? 'opacity-70 pointer-events-none grayscale-[0.8]' : 'hover:shadow-lg hover:border-emerald-200 transition-all group'}`}>
            {isSoldOut && (
                <div className="absolute top-4 right-4 z-30 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                    Habis
                </div>
            )}
            
            {/* Link overlay covering the entire card */}
            <Link href={isSoldOut ? '#' : route('product.detail', product.product_id)} className="absolute inset-0 z-10" />

            <div className="aspect-square bg-gray-50 overflow-hidden relative">
                {product.image_url
                    ? <img src={product.image_url} alt={product.name} className={`w-full h-full object-cover ${!isSoldOut && 'group-hover:scale-105 transition-transform duration-300'}`} />
                    : <div className="w-full h-full flex items-center justify-center"><MusicIcon color="#d1d5db" /></div>
                }
                {justAdded && !isSoldOut && (
                    <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center z-20">
                        <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">✓ Ditambahkan!</span>
                    </div>
                )}
            </div>
            <div className="flex-1 flex flex-col p-4 relative z-0">
                <p className="text-[11px] text-emerald-600 font-semibold mb-1">{product.category?.category_name ?? 'Umum'}</p>
                <h3 className="text-sm font-bold text-gray-900 leading-tight mb-2 line-clamp-2 flex-1 group-hover:text-emerald-700 transition-colors">{product.name}</h3>
                <p className="text-base font-extrabold text-gray-900 mb-2">{fmt(product.price)}</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <svg className="w-3.5 h-3.5 text-amber-400 fill-amber-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-semibold text-gray-700">{product.avg_rating > 0 ? product.avg_rating.toFixed(1) : '0.0'}</span>
                        <span>•</span>
                        <span>{product.total_sold} Terjual</span>
                    </div>
                    <button onClick={(e) => { e.preventDefault(); onAdd(product.product_id); }}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors shadow-sm relative z-20 ${isSoldOut ? 'bg-gray-100 text-gray-400' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white'}`}
                        title={isSoldOut ? 'Stok Habis' : 'Tambah ke keranjang'}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}


/* ── Main Page ── */
export default function UserDashboard({ auth, products, categories }) {
    const { props }       = usePage();
    const sharedAuth      = auth ?? props.auth;
    const cartCount       = props.cartCount ?? 0;
    const allProducts     = products ?? [];
    const allCategories   = categories ?? [];

    const [searchQuery, setSearchQuery] = useState('');
    const [addedIds, setAddedIds]       = useState([]);

    // Otomatis refresh data pesanan jika user menggunakan tombol back browser
    useEffect(() => {
        const handlePopState = () => {
            router.reload({ only: ['orders', 'cartCount'] });
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const filtered = allProducts.filter(p => {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || (p.category?.category_name ?? '').toLowerCase().includes(q);
    });

    const handleAdd = (productId) => {
        router.post(route('cart.add'), { product_id: productId, quantity: 1 }, {
            preserveScroll: true,
            onSuccess: () => {
                setAddedIds(prev => [...prev, productId]);
                setTimeout(() => setAddedIds(prev => prev.filter(id => id !== productId)), 1800);
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <Head title="" />
            <Navbar auth={sharedAuth} cartCount={cartCount} searchQuery={searchQuery} onSearch={setSearchQuery} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Hero */}
                <div className="bg-emerald-50 rounded-3xl p-8 sm:p-12 mb-12 relative overflow-hidden flex items-center min-h-[340px]">
                    <div className="relative z-10 max-w-xl">
                        <span className="inline-block py-1 px-3 rounded-full bg-emerald-200 text-emerald-800 text-xs font-bold mb-4 shadow-sm">
                            Promo Spesial Hari Ini
                        </span>
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">
                            Diskon 50% untuk <br />
                            <span className="text-emerald-600">Alat Musik Premium!</span>
                        </h1>
                        <p className="text-gray-600 text-base mb-8 leading-relaxed max-w-md">
                            Temukan melodi terbaikmu. Dapatkan instrumen berkualitas tinggi dengan harga yang lebih hemat hanya bulan ini.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <button onClick={() => document.getElementById('produk-pilihan')?.scrollIntoView({ behavior: 'smooth' })}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-full transition-colors flex items-center gap-2 shadow-md shadow-emerald-500/20">
                                Belanja Sekarang
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </button>
                            <button onClick={() => document.getElementById('kategori-populer')?.scrollIntoView({ behavior: 'smooth' })}
                                className="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-6 rounded-full transition-colors shadow-sm border border-gray-200">
                                Lihat Katalog
                            </button>
                        </div>
                    </div>

                    {/* Decorative cards */}
                    <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2">
                        <div className="relative w-80 h-72">
                            <div className="absolute right-0 top-0 w-52 h-60 bg-gray-200 rounded-3xl transform rotate-6 shadow-xl border-4 border-white overflow-hidden">
                                <img src="/images/products/Fender Stratocaster Standard Electric Guitar.webp" alt="Gitar" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute right-10 top-6 w-52 h-60 bg-gray-200 rounded-3xl transform -rotate-3 shadow-2xl border-4 border-white overflow-hidden">
                                <img src="/images/products/Yamaha P-45 Digital Piano.jpg" alt="Piano" className="w-full h-full object-cover" />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                    <p className="text-white font-bold text-base">Digital Piano</p>
                                    <p className="text-gray-300 text-xs">Premium Quality</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pesanan Menunggu Pembayaran — dengan countdown */}
                {sharedAuth?.user && props.orders && props.orders.some(o => {
                    if (o.status !== 'pending') return false;
                    const diff = new Date().getTime() - new Date(o.created_at_raw || o.created_at).getTime();
                    return diff < 15 * 60 * 1000;
                }) && (
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                                </span>
                                Waiting for Payment
                            </h2>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {props.orders
                                .filter(o => {
                                    if (o.status !== 'pending') return false;
                                    const diff = new Date().getTime() - new Date(o.created_at_raw || o.created_at).getTime();
                                    return diff < 15 * 60 * 1000;
                                })
                                .map(ord => (
                                    <PendingOrderCountdown
                                        key={ord.order_id}
                                        createdAtRaw={ord.created_at_raw}
                                        externalId={ord.payment_external_id}
                                        orderId={ord.order_id}
                                        amount={ord.final_amount}
                                    />
                                ))
                            }
                        </div>
                    </div>
                )}

                {/* Semua Pesanan — hanya tampil non-pending */}
                {sharedAuth?.user && props.orders && props.orders.filter(o => o.status !== 'pending').length > 0 && (
                    <div className="mb-12 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
                                📦 Pesanan Saya
                            </h2>
                            <span className="text-xs text-gray-500 font-medium">Riwayat pesanan terakhir</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {props.orders
                                .filter(ord => ord.status !== 'pending')
                                .map(ord => (
                                <Link key={ord.order_id} href={route('orders.show', ord.order_id)}
                                    className={`flex items-center justify-between p-4 rounded-2xl transition-all no-underline border ${
                                        ord.status === 'processing'
                                            ? 'border-blue-200 bg-blue-50/40 hover:bg-blue-50'
                                            : 'border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/10'
                                    }`}>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-gray-800 text-sm truncate max-w-[180px]" title={ord.first_item_name}>
                                                {ord.first_item_name}{ord.items_count > 1 ? ` +${ord.items_count - 1} lainnya` : ''}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                ord.refund_status === 'approved' ? 'bg-teal-100 text-teal-700' :
                                                ord.refund_status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                ord.refund_status === 'pending'  ? 'bg-orange-100 text-orange-700' :
                                                ord.status === 'processing'      ? 'bg-blue-100 text-blue-700' :
                                                ord.status === 'shipped'         ? 'bg-purple-100 text-purple-700' :
                                                ord.status === 'delivered' || ord.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                                ord.status === 'cancelled'       ? 'bg-red-100 text-red-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                                {ord.refund_status === 'approved' ? 'Refund Disetujui' :
                                                 ord.refund_status === 'rejected' ? 'Refund Ditolak' :
                                                 ord.refund_status === 'pending'  ? 'Refund Diproses' :
                                                 ord.status === 'processing' ? 'Diproses' :
                                                 ord.status === 'shipped'    ? 'Dikirim' :
                                                 ord.status === 'delivered'  ? 'Diterima' :
                                                 ord.status === 'completed'  ? 'Selesai' :
                                                 ord.status === 'cancelled'  ? 'Dibatalkan' :
                                                 ord.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 m-0">{ord.created_at} • {ord.items_count} Barang</p>

                                    </div>
                                    <div className="text-right">
                                        <p className="font-extrabold text-sm text-gray-900 mb-1">{fmt(ord.final_amount)}</p>
                                        <span className="text-xs text-emerald-600 font-bold">Lihat Detail ›</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Kategori Populer */}
                <div id="kategori-populer" className="mb-12">
                    <div className="flex justify-between items-end mb-6">
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Kategori Populer</h2>
                        <button onClick={() => setSearchQuery('')} className="text-emerald-600 text-sm font-semibold hover:underline">Lihat Semua</button>
                    </div>
                    {allCategories.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
                            {allCategories.map(cat => (
                                <button key={cat.category_id} onClick={() => setSearchQuery(cat.category_name)}
                                    className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all group">
                                    <div className="w-10 h-10 mx-auto bg-emerald-50 rounded-full flex items-center justify-center mb-2 group-hover:bg-emerald-100 transition-colors">
                                        <MusicIcon color="#10b981" />
                                    </div>
                                    <h3 className="text-xs font-bold text-gray-800 leading-tight">{cat.category_name}</h3>
                                    <p className="text-[10px] text-gray-400 mt-0.5">Lihat Produk</p>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm">Belum ada kategori.</p>
                    )}
                </div>

                {/* Produk Pilihan */}
                <div id="produk-pilihan">
                    <div className="flex justify-between items-end mb-6">
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                            {searchQuery ? `Hasil: "${searchQuery}"` : 'Produk Pilihan Kami'}
                        </h2>
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="text-sm text-emerald-600 font-semibold hover:underline">
                                Tampilkan Semua
                            </button>
                        )}
                    </div>

                    {filtered.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                            {filtered.map(product => (
                                <ProductCard key={product.product_id} product={product} onAdd={handleAdd} justAdded={addedIds.includes(product.product_id)} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl p-16 text-center border border-gray-100">
                            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <p className="text-gray-400 text-sm">Tidak ada produk ditemukan untuk "{searchQuery}".</p>
                            <button onClick={() => setSearchQuery('')} className="mt-4 text-emerald-600 text-sm font-semibold hover:underline">
                                Reset pencarian
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <p className="text-center text-xs text-gray-400 py-8">© 2025 NadaKito. Semua hak dilindungi.</p>
        </div>
    );
}
