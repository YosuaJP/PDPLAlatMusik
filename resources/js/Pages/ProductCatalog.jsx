import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';

const fmt = (n) => 'Rp ' + Number(n).toLocaleString('id-ID');

function MusicIcon({ color = '#10b981', size = 24 }) {
    return (
        <svg width={size} height={size} fill="none" stroke={color} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
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
                        <Link href={route('product.catalog')} className="text-emerald-600 font-semibold">Produk</Link>
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
                                className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm hover:opacity-90 focus:outline-none">
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

/* ── Product Card ── */
function ProductCard({ product, onAdd, justAdded }) {
    const rating = (3.8 + (product.product_id % 12) * 0.1).toFixed(1);
    const sold   = product.product_id * 11 + 17;
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-100 transition-all group flex flex-col cursor-pointer">
            <Link href={route('product.detail', product.product_id)} className="no-underline">
                <div className="aspect-square bg-gray-50 overflow-hidden relative">
                    {product.image_url
                        ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        : <div className="w-full h-full flex items-center justify-center bg-gray-100"><MusicIcon color="#d1d5db" size={40} /></div>
                    }
                    {justAdded && (
                        <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                            <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">✓ Ditambahkan!</span>
                        </div>
                    )}
                </div>
            </Link>
            <div className="flex-1 flex flex-col p-3">
                <p className="text-[10px] text-emerald-600 font-semibold mb-1 truncate">{product.category?.category_name ?? 'Umum'}</p>
                <Link href={route('product.detail', product.product_id)} className="no-underline">
                    <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight mb-1.5 hover:text-emerald-700 transition-colors">{product.name}</p>
                </Link>
                <p className="text-sm font-bold text-gray-900 mb-1.5">{fmt(product.price)}</p>
                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                        <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-medium text-gray-600">{rating}</span>
                        <span>•</span>
                        <span>{sold} Terjual</span>
                    </div>
                    <button onClick={() => onAdd(product.product_id)}
                        className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors flex-shrink-0"
                        title="Tambah ke keranjang">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── Sort options ── */
const SORT_OPTIONS = [
    { value: 'latest',     label: 'Terbaru' },
    { value: 'price_asc',  label: 'Harga Terendah' },
    { value: 'price_desc', label: 'Harga Tertinggi' },
];

/* ── Main Page ── */
export default function ProductCatalog({ products, categories, filters }) {
    const { props }   = usePage();
    const auth        = props.auth;
    const cartCount   = props.cartCount ?? 0;

    const [search, setSearch]       = useState(filters?.search ?? '');
    const [catId, setCatId]         = useState(filters?.category ?? '');
    const [sort, setSort]           = useState(filters?.sort ?? 'latest');
    const [catOpen, setCatOpen]     = useState(false);
    const [sortOpen, setSortOpen]   = useState(false);
    const [addedIds, setAddedIds]   = useState([]);
    const catRef  = useRef(null);
    const sortRef = useRef(null);

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e) => {
            if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false);
            if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const applyFilters = (overrides = {}) => {
        const params = {
            search: overrides.search  ?? search,
            category: overrides.catId ?? catId,
            sort: overrides.sort      ?? sort,
        };
        router.get(route('product.catalog'), params, { preserveScroll: true, replace: true });
    };

    const handleCatSelect = (id) => {
        const newId = String(id);
        setCatId(newId);
        setCatOpen(false);
        applyFilters({ catId: newId });
    };

    const handleSortSelect = (val) => {
        setSort(val);
        setSortOpen(false);
        applyFilters({ sort: val });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters();
    };

    const handleAdd = (productId) => {
        router.post(route('cart.add'), { product_id: productId, quantity: 1 }, {
            preserveScroll: true,
            onSuccess: () => {
                setAddedIds(prev => [...prev, productId]);
                setTimeout(() => setAddedIds(prev => prev.filter(id => id !== productId)), 1800);
            },
        });
    };

    const activeCatName = catId
        ? (categories.find(c => String(c.category_id) === catId)?.category_name ?? 'Semua Kategori')
        : 'Semua Kategori';

    const activeSortLabel = SORT_OPTIONS.find(o => o.value === sort)?.label ?? 'Terbaru';

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Head title="Katalog Produk — Melodi POS" />
            <Navbar auth={auth} cartCount={cartCount} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-extrabold text-gray-900">Semua Produk</h1>
                    <p className="text-sm text-gray-500 mt-1">Temukan kebutuhan alat musikmu terbaiknya.</p>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-wrap items-center gap-3 mb-8">

                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex items-center flex-1 min-w-[200px] max-w-sm">
                        <div className="relative w-full">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Cari produk..."
                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition-all"
                            />
                        </div>
                    </form>

                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Category Dropdown */}
                        <div ref={catRef} className="relative">
                            <button
                                onClick={() => { setCatOpen(p => !p); setSortOpen(false); }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all
                                    ${catId ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300'}`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                                </svg>
                                {activeCatName}
                                <svg className={`w-3.5 h-3.5 transition-transform ${catOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {catOpen && (
                                <div className="absolute left-0 top-11 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50">
                                    <button
                                        onClick={() => handleCatSelect('')}
                                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${!catId ? 'font-bold text-emerald-600 bg-emerald-50' : 'text-gray-700 hover:bg-gray-50'}`}>
                                        Semua Kategori
                                    </button>
                                    <div className="border-t border-gray-100 my-1" />
                                    {categories.map(cat => (
                                        <button
                                            key={cat.category_id}
                                            onClick={() => handleCatSelect(cat.category_id)}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${String(catId) === String(cat.category_id) ? 'font-bold text-emerald-600 bg-emerald-50' : 'text-gray-700 hover:bg-gray-50'}`}>
                                            {cat.category_name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Sort Dropdown */}
                        <div ref={sortRef} className="relative">
                            <button
                                onClick={() => { setSortOpen(p => !p); setCatOpen(false); }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all
                                    ${sort !== 'latest' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300'}`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                </svg>
                                {activeSortLabel}
                                <svg className={`w-3.5 h-3.5 transition-transform ${sortOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {sortOpen && (
                                <div className="absolute left-0 top-11 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50">
                                    {SORT_OPTIONS.map(opt => (
                                        <button
                                            key={opt.value}
                                            onClick={() => handleSortSelect(opt.value)}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${sort === opt.value ? 'font-bold text-emerald-600 bg-emerald-50' : 'text-gray-700 hover:bg-gray-50'}`}>
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Reset filters */}
                        {(catId || sort !== 'latest' || search) && (
                            <button
                                onClick={() => {
                                    setSearch(''); setCatId(''); setSort('latest');
                                    router.get(route('product.catalog'), {}, { replace: true });
                                }}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border border-red-200 text-red-500 bg-white hover:bg-red-50 transition-colors">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                Reset
                            </button>
                        )}

                        {/* Result count */}
                        <span className="text-sm text-gray-400 ml-1">{products.length} produk</span>
                    </div>
                </div>

                {/* Product Grid */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {products.map(product => (
                            <ProductCard
                                key={product.product_id}
                                product={product}
                                onAdd={handleAdd}
                                justAdded={addedIds.includes(product.product_id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 p-20 text-center">
                        <svg className="w-14 h-14 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <p className="text-gray-500 font-semibold mb-1">Tidak ada produk ditemukan</p>
                        <p className="text-gray-400 text-sm mb-4">Coba ubah filter atau kata kunci pencarian.</p>
                        <button
                            onClick={() => {
                                setSearch(''); setCatId(''); setSort('latest');
                                router.get(route('product.catalog'), {}, { replace: true });
                            }}
                            className="text-emerald-600 text-sm font-semibold hover:underline">
                            Tampilkan semua produk
                        </button>
                    </div>
                )}
            </main>

            <p className="text-center text-xs text-gray-400 py-8">© 2025 NadaKito. Semua hak dilindungi.</p>
        </div>
    );
}
