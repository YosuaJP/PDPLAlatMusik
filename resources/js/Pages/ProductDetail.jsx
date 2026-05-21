import { Head, Link, router } from '@inertiajs/react';

const fmt = (value) => 'Rp ' + Number(value).toLocaleString('id-ID');

export default function ProductDetail({ product, related, reviews, avgRating }) {
    const addToCart = () => {
        router.post(route('cart.add'), { product_id: product.product_id, quantity: 1 }, { preserveScroll: true });
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <Head title={`${product.name} — Melodi POS`} />

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
                                <button
                                    onClick={addToCart}
                                    className="rounded-full bg-emerald-500 px-7 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 transition-colors"
                                >
                                    Tambahkan ke Keranjang
                                </button>
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
