import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Welcome({ auth, categories, products }) {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <Head title="" />

            {/* Navbar */}
            <nav className="bg-white sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                </svg>
                            </div>
                            <span className="font-bold text-xl text-gray-800">NadaKito</span>
                        </div>

                        {/* Search Bar */}
                        <div className="hidden md:block flex-1 max-w-2xl mx-8">
                            <form onSubmit={(e) => { e.preventDefault(); router.get(route('product.catalog'), { search: searchQuery }); }} className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors"
                                    placeholder="Cari gitar, piano, drum..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </form>
                        </div>

                        {/* Right Nav */}
                        <div className="flex items-center gap-6">
                            <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-600">
                                <Link href="/" className="text-emerald-600">Beranda</Link>
                                <Link href={route('product.catalog')} className="hover:text-emerald-600 transition-colors">Produk</Link>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Cart Icon */}
                                <Link href={route('cart.index')} className="relative text-gray-600 hover:text-emerald-600 transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                                        0
                                    </span>
                                </Link>

                                {/* Auth / Profile */}
                                {auth.user ? (
                                    <Link href={route('dashboard')} className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm hover:opacity-90 transition-opacity">
                                        {auth.user.name.charAt(0).toUpperCase()}
                                    </Link>
                                ) : (
                                    <div className="flex gap-2">
                                        <Link href={route('login')} className="text-sm font-medium text-gray-600 hover:text-emerald-600 px-3 py-2">Masuk</Link>
                                        <Link href={route('register')} className="text-sm font-medium bg-emerald-500 text-white px-4 py-2 rounded-full hover:bg-emerald-600 transition-colors shadow-sm">Daftar</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Hero Section */}
                <div className="bg-emerald-50 rounded-3xl p-8 sm:p-12 mb-12 relative overflow-hidden flex items-center min-h-[360px]">
                    <div className="relative z-10 max-w-xl">
                        <span className="inline-block py-1 px-3 rounded-full bg-emerald-200 text-emerald-800 text-xs font-bold mb-4 shadow-sm">Promo Spesial Hari Ini</span>
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">
                            Diskon 50% untuk <br />
                            <span className="text-emerald-600">Alat Musik Premium!</span>
                        </h1>
                        <p className="text-gray-600 text-lg mb-8 leading-relaxed max-w-md">
                            Temukan melodi terbaikmu. Dapatkan instrumen berkualitas tinggi dengan harga yang lebih hemat hanya bulan ini.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href={route('product.catalog')} className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-full transition-colors flex items-center gap-2 shadow-md shadow-emerald-500/20">
                                Belanja Sekarang
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </Link>
                            <Link href={route('product.catalog')} className="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-6 rounded-full transition-colors shadow-sm border border-gray-200">
                                Lihat Katalog
                            </Link>
                        </div>
                    </div>

                    {/* Decorative Hero Images (Cards) */}
                    <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2">
                        <div className="relative w-80 h-80">
                            <div className="absolute right-0 top-0 w-56 h-64 bg-gray-200 rounded-3xl transform rotate-6 shadow-xl border-4 border-white overflow-hidden">
                                <img src="/images/products/Fender Stratocaster Standard Electric Guitar.webp" alt="Gitar" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute right-12 top-8 w-56 h-64 bg-gray-200 rounded-3xl transform -rotate-3 shadow-2xl border-4 border-white overflow-hidden">
                                <img src="/images/products/Yamaha P-45 Digital Piano.jpg" alt="Piano" className="w-full h-full object-cover" />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                    <p className="text-white font-bold text-lg">Digital Piano</p>
                                    <p className="text-gray-300 text-xs">Premium Quality</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className="mb-12">
                    <div className="flex justify-between items-end mb-6">
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Kategori Populer</h2>
                        <Link href={route('product.catalog')} className="text-emerald-600 text-sm font-semibold hover:underline">Lihat Semua</Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                        {categories?.map((cat) => (
                            <Link key={cat.category_id} href={route('product.catalog', { category: cat.category_id })} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all group">
                                <div className="w-12 h-12 mx-auto bg-emerald-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-emerald-100 transition-colors">
                                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-bold text-gray-800">{cat.category_name}</h3>
                                <p className="text-xs text-gray-500 mt-1">Lihat Produk</p>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Featured Products */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">Produk Pilihan Kami</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products?.map((product) => {
                            const isSoldOut = product.stock_qty <= 0;
                            return (
                            <Link href={isSoldOut ? '#' : route('product.detail', product.product_id)} key={product.product_id} 
                                className={`bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col h-full relative ${isSoldOut ? 'opacity-70 pointer-events-none grayscale-[0.8]' : 'hover:shadow-lg hover:border-emerald-200 transition-all group'}`}>
                                
                                {isSoldOut && (
                                    <div className="absolute top-6 right-6 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                                        Habis
                                    </div>
                                )}

                                <div className="aspect-square bg-gray-50 rounded-2xl mb-4 overflow-hidden relative">
                                    <img
                                        src={product.image_url || `https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`}
                                        alt={product.name}
                                        className={`w-full h-full object-cover ${!isSoldOut && 'group-hover:scale-105 transition-transform duration-300'}`}
                                    />
                                </div>
                                <div className="flex-1 flex flex-col">
                                    <p className="text-xs text-gray-500 mb-1">{product.category?.category_name || 'Umum'}</p>
                                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">{product.name}</h3>

                                    <div className="mt-auto pt-2">
                                        <p className="font-extrabold text-lg text-gray-900 mb-2">
                                            Rp {Number(product.price).toLocaleString('id-ID')}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-1.5 font-bold text-gray-700">
                                                <svg className="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <span>{product.avg_rating > 0 ? product.avg_rating.toFixed(1) : '0.0'} •</span>
                                                <span>{product.total_sold} Terjual</span>
                                            </span>

                                            <button className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isSoldOut ? 'bg-gray-100 text-gray-400' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white'}`}>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )})}
                    </div>
                </div>
            </main>
        </div>
    );
}
