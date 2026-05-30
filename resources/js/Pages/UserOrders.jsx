import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const fmt = (n) => 'Rp ' + Number(n).toLocaleString('id-ID');

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
                        <span className="font-bold text-xl text-gray-800 tracking-tight">PawPaw</span>
                    </Link>

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
                                    className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-sm hover:opacity-90 transition-opacity focus:outline-none">
                                    {auth.user.name?.charAt(0).toUpperCase()}
                                </button>

                                {open && (
                                    <div className="absolute right-0 top-10 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-xs text-gray-400">Halo, Kak!</p>
                                            <p className="text-sm font-bold text-gray-800 truncate">{auth.user.name}</p>
                                        </div>

                                        <Link href={route('profile.edit')} onClick={() => setOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors no-underline">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Edit Profile
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

const statusText = {
    pending: 'pending',
    processing: 'Diproses',
    shipped: 'Dalam Pengiriman',
    delivered: 'Selesai',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
};

const statusBadge = {
    pending: 'bg-gray-100 text-gray-600',
    processing: 'bg-yellow-100 text-yellow-700',
    shipped: 'bg-blue-100 text-blue-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    completed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
};

export default function UserOrders({ auth, orders }) {
    const { props } = usePage();
    const cartCount = props.cartCount ?? 0;
    
    const [refundModal, setRefundModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    // States untuk menulis ulasan
    const [reviewModal, setReviewModal] = useState(false);
    const [reviewTarget, setReviewTarget] = useState({ orderItemId: null, productName: '' });
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewProcessing, setReviewProcessing] = useState(false);
    const [reviewError, setReviewError] = useState(null);

    const openReviewModal = (orderItemId, productName) => {
        setReviewTarget({ orderItemId, productName });
        setReviewRating(5);
        setReviewComment('');
        setReviewError(null);
        setReviewModal(true);
    };

    const submitReview = (e) => {
        e.preventDefault();
        setReviewProcessing(true);
        setReviewError(null);
        
        router.post(route('reviews.store'), {
            order_item_id: reviewTarget.orderItemId,
            rating: reviewRating,
            comment: reviewComment
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setReviewModal(false);
                setReviewProcessing(false);
            },
            onError: (err) => {
                setReviewError(err.message || 'Gagal menyimpan ulasan. Coba lagi.');
                setReviewProcessing(false);
            }
        });
    };

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        reason: '',
        images: null,
        video: null,
    });

    const openRefund = (id) => {
        reset();
        clearErrors();
        setSelectedOrderId(id);
        setRefundModal(true);
    };

    const submitRefund = (e) => {
        e.preventDefault();
        post(route('orders.refund', selectedOrderId), {
            onSuccess: () => setRefundModal(false),
        });
    };

    const handleReceive = (id) => {
        router.post(route('orders.receive', id), {}, { preserveScroll: true });
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-10">
            <Head title="Pesanan Saya" />
            <Navbar auth={auth} cartCount={cartCount} />

            <main className="max-w-4xl mx-auto px-4 mt-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Pesanan Saya</h1>

                <div className="space-y-4">
                    {orders.length > 0 ? orders.map(ord => {
                        const isPending = ord.status === 'pending';
                        const isShipped = ord.status === 'shipped';

                        return (
                            <div key={ord.order_id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative">
                                <div className="flex justify-between items-start border-b border-gray-50 pb-4 mb-4">
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">No. Pesanan</p>
                                        <p className="font-bold text-sm text-gray-800 font-mono">ORD-{String(ord.order_id).padStart(8, '0')}</p>
                                        <p className="text-xs text-gray-400 mt-1">{ord.created_at}</p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusBadge[ord.status] || 'bg-gray-100 text-gray-600'}`}>
                                        {statusText[ord.status] || ord.status}
                                    </span>
                                </div>

                                {/* Items Summary */}
                                <div className="space-y-3 mb-5">
                                    {ord.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between gap-4 py-2 border-b border-gray-50/50 last:border-0">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                                                    {item.image_url ? (
                                                        <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <MusicIcon color="#d1d5db" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-gray-800 leading-tight">{item.product_name}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{item.quantity} x {fmt(item.price_each)}</p>
                                                </div>
                                            </div>
                                            
                                            {/* Tombol Ulasan per Item jika status Delivered / Completed */}
                                            {(ord.status === 'delivered' || ord.status === 'completed') && (
                                                <div className="flex-shrink-0">
                                                    {item.is_reviewed ? (
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                            Diulas
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() => openReviewModal(item.order_item_id, item.product_name)}
                                                            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold transition-colors shadow-sm focus:outline-none"
                                                        >
                                                            Tulis Ulasan
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Total Tagihan</p>
                                        <p className="text-sm font-bold text-emerald-600">{fmt(ord.final_amount)}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {isPending ? (
                                            <>
                                                {ord.payment_external_id && (
                                                    <Link href={route('payment.checkout', ord.payment_external_id)} className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors">
                                                        Bayar
                                                    </Link>
                                                )}
                                                <Link href={route('orders.show', ord.order_id)} className="px-4 py-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-xs font-bold transition-colors">
                                                    Detail
                                                </Link>
                                            </>
                                        ) : isShipped ? (
                                            <>
                                                <Link href={route('orders.show', ord.order_id)} className="px-4 py-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-xs font-bold transition-colors">
                                                    Detail
                                                </Link>
                                                <button onClick={() => handleReceive(ord.order_id)} className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors">
                                                    Diterima
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <Link href={route('orders.show', ord.order_id)} className="px-4 py-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-xs font-bold transition-colors">
                                                    Detail
                                                </Link>
                                                {(ord.status === 'delivered' || ord.status === 'completed') && !ord.has_refund && (
                                                    <button onClick={() => openRefund(ord.order_id)} className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors">
                                                        Ajukan Refund
                                                    </button>
                                                )}
                                                {ord.has_refund && (
                                                    <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold capitalize">
                                                        Refund {ord.refund_status}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="text-center bg-white rounded-2xl p-10 border border-gray-100">
                            <p className="text-gray-400">Belum ada pesanan.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Refund Modal */}
            {refundModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl my-8 overflow-hidden relative">
                        <button onClick={() => setRefundModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-6">Ajukan Refund</h3>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-5">
                                <p className="text-[11px] text-yellow-800 font-medium">
                                    <span className="font-bold">Perhatian:</span> Pastikan Anda memiliki alasan yang valid untuk mengajukan refund. Admin akan meninjau permintaan Anda.
                                </p>
                            </div>

                            {errors.message && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-5">
                                    <p className="text-[11px] text-red-800 font-medium">
                                        <span className="font-bold">Error:</span> {errors.message}
                                    </p>
                                </div>
                            )}

                            <form onSubmit={submitRefund} className="space-y-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-700 mb-2">Alasan Refund</label>
                                    <textarea
                                        value={data.reason}
                                        onChange={e => setData('reason', e.target.value)}
                                        rows="3"
                                        placeholder="Jelaskan alasan Anda mengajukan refund..."
                                        className={`w-full px-3 py-2 border rounded-xl text-sm focus:ring-4 focus:outline-none resize-none ${errors.reason ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 focus:ring-emerald-100'}`}
                                        required
                                    />
                                    {errors.reason && <p className="text-red-500 text-[10px] mt-1">{errors.reason}</p>}
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-gray-700 mb-2">Foto Barang (Max 3, Max 2MB/foto)</label>
                                    <div className="border border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 cursor-pointer relative transition-colors">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={e => setData('images', e.target.files)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="flex flex-col items-center justify-center">
                                            <svg className="w-6 h-6 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            <p className="text-xs text-gray-500 font-medium">{data.images ? `${data.images.length} file terpilih` : 'Add'}</p>
                                        </div>
                                    </div>
                                    {errors.images && <p className="text-red-500 text-[10px] mt-1">{errors.images}</p>}
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-gray-700 mb-2">Video Unboxing (Max 1, Max 10MB)</label>
                                    <div className="border border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 cursor-pointer relative transition-colors">
                                        <input
                                            type="file"
                                            accept="video/*"
                                            onChange={e => setData('video', e.target.files[0])}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="flex flex-col items-center justify-center">
                                            <svg className="w-6 h-6 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                            <p className="text-xs text-gray-500 font-medium">{data.video ? data.video.name : 'Upload Video (MP4)'}</p>
                                        </div>
                                    </div>
                                    {errors.video && <p className="text-red-500 text-[10px] mt-1">{errors.video}</p>}
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={() => setRefundModal(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-50 transition-colors">
                                        Batal
                                    </button>
                                    <button type="submit" disabled={processing} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold text-xs rounded-xl transition-colors disabled:opacity-50">
                                        {processing ? 'Loading...' : 'Ajukan Refund'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {/* Review Modal */}
            {reviewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl my-8 overflow-hidden relative animate-in fade-in zoom-in-95 duration-150">
                        <button onClick={() => setReviewModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-1">Berikan Ulasan</h3>
                            <p className="text-xs text-gray-500 font-medium mb-5 truncate pb-2 border-b border-gray-100">{reviewTarget.productName}</p>

                            {reviewError && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-5">
                                    <p className="text-[11px] text-red-800 font-medium">
                                        <span className="font-bold">Error:</span> {reviewError}
                                    </p>
                                </div>
                            )}

                            <form onSubmit={submitReview} className="space-y-5">
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Rating Produk</label>
                                    <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                type="button"
                                                key={star}
                                                onClick={() => setReviewRating(star)}
                                                className="text-2xl focus:outline-none transition-transform active:scale-90 hover:scale-110"
                                            >
                                                <svg
                                                    className={`w-8 h-8 ${star <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            </button>
                                        ))}
                                        <span className="text-sm font-bold text-gray-700 ml-2">{reviewRating} dari 5</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Komentar / Ulasan</label>
                                    <textarea
                                        value={reviewComment}
                                        onChange={e => setReviewComment(e.target.value)}
                                        rows="4"
                                        placeholder="Tuliskan pengalaman Anda menggunakan produk ini. Ulasan Anda sangat berharga bagi kami dan pembeli lainnya..."
                                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-amber-100 focus:outline-none resize-none transition-all"
                                        maxLength="1000"
                                        required
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setReviewModal(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-50 transition-colors">
                                        Batal
                                    </button>
                                    <button type="submit" disabled={reviewProcessing} className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5">
                                        {reviewProcessing ? 'Mengirim...' : 'Kirim Ulasan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
