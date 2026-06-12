/**
 * @codecite
 * generator: Antigravity by Google DeepMind
 * project: NadaKito E-Commerce
 * frameworks: React.js 18.x, Inertia.js
 * description: User orders history dashboard allowing receipt confirmation, cancelations, and writing/viewing product reviews (with image/video uploads).
 */

import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';

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
                        <span className="font-bold text-xl text-gray-800 tracking-tight">NadaKito</span>
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
    const [fileError, setFileError] = useState(null);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [videoPreview, setVideoPreview] = useState(null);

    // States untuk menulis ulasan
    const [reviewModal, setReviewModal] = useState(false);
    const [reviewTarget, setReviewTarget] = useState({ orderItemId: null, productName: '' });
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewProcessing, setReviewProcessing] = useState(false);
    const [reviewError, setReviewError] = useState(null);
    const [reviewImages, setReviewImages] = useState(null);
    const [reviewImagePreviews, setReviewImagePreviews] = useState([]);
    const [reviewVideo, setReviewVideo] = useState(null);
    const [reviewVideoPreview, setReviewVideoPreview] = useState(null);

    // States untuk melihat ulasan
    const [viewReviewModal, setViewReviewModal] = useState(false);
    const [viewReviewData, setViewReviewData] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const openReviewModal = (orderItemId, productName) => {
        setReviewTarget({ orderItemId, productName });
        setReviewRating(5);
        setReviewComment('');
        setReviewError(null);
        setReviewImages(null);
        reviewImagePreviews.forEach(url => URL.revokeObjectURL(url));
        setReviewImagePreviews([]);
        if (reviewVideoPreview) URL.revokeObjectURL(reviewVideoPreview);
        setReviewVideo(null);
        setReviewVideoPreview(null);
        setReviewModal(true);
    };

    const submitReview = (e) => {
        e.preventDefault();
        setReviewProcessing(true);
        setReviewError(null);
        
        const formData = new FormData();
        formData.append('order_item_id', reviewTarget.orderItemId);
        formData.append('rating', reviewRating);
        formData.append('comment', reviewComment);
        
        if (reviewImages) {
            Array.from(reviewImages).forEach((img) => formData.append('images[]', img));
        }
        if (reviewVideo) {
            formData.append('video', reviewVideo);
        }

        router.post(route('reviews.store'), formData, {
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

    const handleReviewImagesChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const currentFiles = reviewImages ? Array.from(reviewImages) : [];
        const files = [...currentFiles, ...newFiles];
        const MAX_IMAGE_MB = 2;
        const MAX_IMAGES = 3;

        if (files.length > MAX_IMAGES) {
            setReviewError(`Maksimal ${MAX_IMAGES} foto yang bisa diunggah.`);
            e.target.value = '';
            return;
        }

        for (const file of newFiles) {
            if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
                setReviewError(`File "${file.name}" melebihi batas ${MAX_IMAGE_MB}MB.`);
                e.target.value = '';
                return;
            }
        }

        setReviewError(null);
        const newPreviews = newFiles.map(f => URL.createObjectURL(f));
        setReviewImagePreviews([...reviewImagePreviews, ...newPreviews]);
        setReviewImages(files);
        e.target.value = '';
    };

    const removeReviewImage = (index) => {
        const newImages = [...reviewImages];
        newImages.splice(index, 1);
        
        const newPreviews = [...reviewImagePreviews];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);

        setReviewImages(newImages);
        setReviewImagePreviews(newPreviews);
    };

    const handleReviewVideoChange = (e) => {
        const file = e.target.files[0];
        const MAX_VIDEO_MB = 10;

        if (file && file.size > MAX_VIDEO_MB * 1024 * 1024) {
            setReviewError(`Video "${file.name}" melebihi batas ${MAX_VIDEO_MB}MB.`);
            e.target.value = '';
            return;
        }

        setReviewError(null);
        setReviewVideo(file || null);
        
        if (reviewVideoPreview) URL.revokeObjectURL(reviewVideoPreview);
        if (file) {
            setReviewVideoPreview(URL.createObjectURL(file));
        } else {
            setReviewVideoPreview(null);
        }
        e.target.value = '';
    };

    const removeReviewVideo = () => {
        setReviewVideo(null);
        if (reviewVideoPreview) URL.revokeObjectURL(reviewVideoPreview);
        setReviewVideoPreview(null);
    };

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        reason: '',
        images: null,
        video: null,
    });

    const openRefund = (id) => {
        reset();
        clearErrors();
        setFileError(null);
        
        imagePreviews.forEach(url => URL.revokeObjectURL(url));
        setImagePreviews([]);
        if (videoPreview) URL.revokeObjectURL(videoPreview);
        setVideoPreview(null);
        
        setSelectedOrderId(id);
        setRefundModal(true);
    };

    const handleImagesChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const currentFiles = data.images ? Array.from(data.images) : [];
        const files = [...currentFiles, ...newFiles];
        const MAX_IMAGE_MB = 2;
        const MAX_IMAGES = 3;

        if (files.length > MAX_IMAGES) {
            setFileError(`Maksimal ${MAX_IMAGES} foto yang bisa diunggah.`);
            e.target.value = '';
            return;
        }

        for (const file of newFiles) {
            if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
                setFileError(`File "${file.name}" melebihi batas ${MAX_IMAGE_MB}MB per foto.`);
                e.target.value = '';
                return;
            }
        }

        setFileError(null);
        const newPreviews = newFiles.map(f => URL.createObjectURL(f));
        setImagePreviews([...imagePreviews, ...newPreviews]);
        setData('images', files);
        e.target.value = '';
    };

    const removeImage = (index) => {
        const newImages = [...data.images];
        newImages.splice(index, 1);
        
        const newPreviews = [...imagePreviews];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);

        setData('images', newImages);
        setImagePreviews(newPreviews);
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        const MAX_VIDEO_MB = 10;

        if (file && file.size > MAX_VIDEO_MB * 1024 * 1024) {
            setFileError(`Video "${file.name}" melebihi batas ${MAX_VIDEO_MB}MB.`);
            e.target.value = '';
            return;
        }

        setFileError(null);
        setData('video', file || null);
        
        if (videoPreview) URL.revokeObjectURL(videoPreview);
        if (file) {
            setVideoPreview(URL.createObjectURL(file));
        } else {
            setVideoPreview(null);
        }
        e.target.value = '';
    };

    const removeVideo = () => {
        setData('video', null);
        if (videoPreview) URL.revokeObjectURL(videoPreview);
        setVideoPreview(null);
    };

    const submitRefund = (e) => {
        e.preventDefault();
        post(route('orders.refund', selectedOrderId), {
            onSuccess: () => setRefundModal(false),
        });
    };

    const handleReceive = (id) => {
        Swal.fire({
            title: '<span style="font-weight: 600; font-size: 20px; color: #374151;">Konfirmasi Pesanan Diterima</span>',
            html: `<div style="font-size: 14px; color: #6b7280; margin-bottom: 20px;">Apakah Anda yakin ingin menyelesaikan pesanan ini?</div>
                   <div style="background: #fef2f2; border: 1px solid #fee2e2; border-radius: 12px; padding: 12px; margin-top: 10px;">
                       <span style="color: #ef4444; font-size: 13px; font-weight: 500;">⚠️ Perhatian: Setelah pesanan diterima, barang tidak bisa dikembalikan / direfund.</span>
                   </div>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#f3f4f6',
            confirmButtonText: '<span style="font-weight: 500;">Ya, Saya Terima</span>',
            cancelButtonText: '<span style="color: #4b5563; font-weight: 500;">Batal</span>',
            reverseButtons: true,
            customClass: {
                popup: 'rounded-3xl shadow-xl border border-gray-100',
                confirmButton: 'rounded-xl px-6 py-2.5',
                cancelButton: 'rounded-xl px-6 py-2.5',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('orders.receive', id), {}, { 
                    preserveScroll: true,
                    onSuccess: () => Swal.fire({
                        title: '<span style="font-weight: 600; font-size: 20px; color: #374151;">Berhasil!</span>', 
                        html: '<span style="font-size: 14px; color: #6b7280;">Pesanan telah diterima. Terima kasih!</span>', 
                        icon: 'success',
                        confirmButtonColor: '#10b981',
                        confirmButtonText: '<span style="font-weight: 500;">Tutup</span>',
                        customClass: {
                            popup: 'rounded-3xl shadow-xl border border-gray-100',
                            confirmButton: 'rounded-xl px-6 py-2.5'
                        }
                    })
                });
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-10">
            <Head title="" />
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
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                        ord.refund_status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                        ord.refund_status === 'rejected' ? 'bg-red-100 text-red-700' :
                                        ord.refund_status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                        statusBadge[ord.status] || 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {ord.refund_status === 'approved' ? 'Refund Disetujui' :
                                         ord.refund_status === 'rejected' ? 'Refund Ditolak' :
                                         ord.refund_status === 'pending' ? 'Refund Diproses' :
                                         statusText[ord.status] || ord.status}
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
                                            
                                            {/* Tombol Ulasan per Item: hanya jika delivered/completed DAN refund TIDAK disetujui */}
                                            {(ord.status === 'delivered' || ord.status === 'completed') && ord.refund_status !== 'approved' && (
                                                <div className="flex-shrink-0">
                                                    {item.is_reviewed ? (
                                                        <button
                                                            onClick={() => { setViewReviewData(item.review); setViewReviewModal(true); }}
                                                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                            Lihat Ulasan
                                                        </button>
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
                                                {!ord.has_refund && (
                                                    <button onClick={() => openRefund(ord.order_id)} className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors">
                                                        Ajukan Refund
                                                    </button>
                                                )}
                                                {ord.has_refund && (
                                                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize ${
                                                        ord.refund_status === 'approved'  ? 'bg-emerald-100 text-emerald-700' :
                                                        ord.refund_status === 'rejected'  ? 'bg-red-100 text-red-600' :
                                                        'bg-amber-100 text-amber-700'
                                                    }`}>
                                                        {ord.refund_status === 'approved' ? 'Refund Disetujui' :
                                                         ord.refund_status === 'rejected' ? 'Refund Ditolak' :
                                                         'Refund Diproses'}
                                                    </span>
                                                )}
                                                {!ord.has_refund && (
                                                    <button onClick={() => handleReceive(ord.order_id)} className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors">
                                                        Diterima
                                                    </button>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <Link href={route('orders.show', ord.order_id)} className="px-4 py-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-xs font-bold transition-colors">
                                                    Detail
                                                </Link>
                                                {/* Tombol Refund: hanya jika belum refund */}
                                                {(ord.status === 'delivered' || ord.status === 'completed') && !ord.has_refund && (
                                                    <button onClick={() => openRefund(ord.order_id)} className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors">
                                                        Ajukan Refund
                                                    </button>
                                                )}
                                                {/* Status badge refund */}
                                                {ord.has_refund && (
                                                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                                                        ord.refund_status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                                        ord.refund_status === 'rejected' ? 'bg-red-100 text-red-600' :
                                                        'bg-amber-100 text-amber-700'
                                                    }`}>
                                                        {ord.refund_status === 'approved' ? 'Refund Disetujui' :
                                                         ord.refund_status === 'rejected' ? 'Refund Ditolak' :
                                                         'Refund Diproses'}
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

                            {(errors.message || fileError) && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-5">
                                    <p className="text-[11px] text-red-800 font-medium">
                                        <span className="font-bold">Error:</span> {fileError || errors.message}
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
                                    {data.images && data.images.length > 0 ? (
                                        <div className="flex flex-wrap gap-3">
                                            {imagePreviews.map((preview, idx) => (
                                                <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 group">
                                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(idx)}
                                                        className="absolute top-1 right-1 bg-white text-red-500 rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                                    >
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                    </button>
                                                </div>
                                            ))}
                                            {data.images.length < 3 && (
                                                <div className="relative w-20 h-20 border border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:bg-gray-50 cursor-pointer transition-colors">
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={handleImagesChange}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    />
                                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="border border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 cursor-pointer relative transition-colors">
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleImagesChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <div className="flex flex-col items-center justify-center">
                                                <svg className="w-6 h-6 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                <p className="text-xs text-gray-500 font-medium">Klik untuk mengunggah foto</p>
                                            </div>
                                        </div>
                                    )}
                                    {errors.images && <p className="text-red-500 text-[10px] mt-1">{errors.images}</p>}
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-gray-700 mb-2">Video Unboxing (Max 1, Max 10MB)</label>
                                    {data.video ? (
                                        <div className="relative w-full h-32 rounded-xl overflow-hidden border border-gray-200 group bg-black">
                                            <video src={videoPreview} className="w-full h-full object-contain" controls />
                                            <button
                                                type="button"
                                                onClick={removeVideo}
                                                className="absolute top-2 right-2 bg-white text-red-500 rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="border border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 cursor-pointer relative transition-colors">
                                            <input
                                                type="file"
                                                accept="video/*"
                                                onChange={handleVideoChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <div className="flex flex-col items-center justify-center">
                                                <svg className="w-6 h-6 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                                <p className="text-xs text-gray-500 font-medium">Klik untuk mengunggah video (MP4)</p>
                                            </div>
                                        </div>
                                    )}
                                    {errors.video && <p className="text-red-500 text-[10px] mt-1">{errors.video}</p>}
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={() => setRefundModal(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-50 transition-colors">
                                        Batal
                                    </button>
                                    <button type="submit" disabled={processing || !!fileError} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold text-xs rounded-xl transition-colors disabled:opacity-50">
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

                                <div>
                                    <label className="block text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Foto Produk (Max 3, Max 2MB/foto)</label>
                                    {reviewImages && reviewImages.length > 0 ? (
                                        <div className="flex flex-wrap gap-3">
                                            {reviewImagePreviews.map((preview, idx) => (
                                                <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 group">
                                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeReviewImage(idx)}
                                                        className="absolute top-1 right-1 bg-white text-red-500 rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                                    >
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                    </button>
                                                </div>
                                            ))}
                                            {reviewImages.length < 3 && (
                                                <div className="relative w-20 h-20 border border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:bg-gray-50 cursor-pointer transition-colors">
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={handleReviewImagesChange}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    />
                                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="border border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 cursor-pointer relative transition-colors">
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleReviewImagesChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <div className="flex flex-col items-center justify-center">
                                                <svg className="w-6 h-6 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                <p className="text-xs text-gray-500 font-medium">Klik untuk mengunggah foto</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Video Produk (Max 1, Max 10MB)</label>
                                    {reviewVideo ? (
                                        <div className="relative w-full h-32 rounded-xl overflow-hidden border border-gray-200 group bg-black">
                                            <video src={reviewVideoPreview} className="w-full h-full object-contain" controls />
                                            <button
                                                type="button"
                                                onClick={removeReviewVideo}
                                                className="absolute top-2 right-2 bg-white text-red-500 rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="border border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 cursor-pointer relative transition-colors">
                                            <input
                                                type="file"
                                                accept="video/*"
                                                onChange={handleReviewVideoChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <div className="flex flex-col items-center justify-center">
                                                <svg className="w-6 h-6 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                                <p className="text-xs text-gray-500 font-medium">Klik untuk mengunggah video (MP4)</p>
                                            </div>
                                        </div>
                                    )}
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
            {/* View Review Modal */}
            {viewReviewModal && viewReviewData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl my-8 overflow-hidden relative animate-in fade-in zoom-in-95 duration-150">
                        <button onClick={() => setViewReviewModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-5">Ulasan Saya</h3>
                            
                            <div className="mb-4">
                                <div className="flex gap-1 mb-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <svg key={star} className={`w-5 h-5 ${star <= viewReviewData.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-700 whitespace-pre-line">{viewReviewData.comment}</p>
                            </div>

                            {(viewReviewData.image_urls || viewReviewData.video_url) && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <h4 className="text-xs font-bold text-gray-500 mb-3 uppercase">Media</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {viewReviewData.image_urls && viewReviewData.image_urls.map((img, i) => (
                                            <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200" onClick={() => setSelectedImage(img)}>
                                                <img src={img} alt="Review" className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform" />
                                            </div>
                                        ))}
                                    </div>
                                    {viewReviewData.video_url && (
                                        <div className="mt-3 w-full h-40 bg-black rounded-xl overflow-hidden border border-gray-200">
                                            <video src={viewReviewData.video_url} controls className="w-full h-full object-contain" />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            
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
