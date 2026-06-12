import Navbar from '@/Components/Navbar';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';


export default function OrderStatus({ order }) {
    const [isWebhookLoading, setIsWebhookLoading] = useState(false);
    const [webhookMessage, setWebhookMessage] = useState(null);
    const [loadingPercent, setLoadingPercent] = useState(0);
    const [loadingText, setLoadingText] = useState('');
    const [simulatedStatus, setSimulatedStatus] = useState('');

    const triggerWebhook = (status) => {
        setIsWebhookLoading(true);
        setSimulatedStatus(status);
        setWebhookMessage(null);
        setLoadingPercent(0);
        setLoadingText('Menginisialisasi webhook...');

        let percent = 0;
        const interval = setInterval(() => {
            percent += 10;
            setLoadingPercent(percent);
            
            if (percent === 20) {
                setLoadingText('Menyiapkan payload notifikasi asinkron...');
            } else if (percent === 40) {
                setLoadingText(status === 'settlement' 
                    ? 'Memverifikasi status transaksi (SETTLEMENT) via API Sandbox...' 
                    : 'Mengirimkan notifikasi kegagalan transaksi (EXPIRED)...'
                );
            } else if (percent === 60) {
                setLoadingText('Menjalankan database transaction aman (lockForUpdate)...');
            } else if (percent === 80) {
                setLoadingText(status === 'settlement' 
                    ? 'Memperbarui status pesanan menjadi PROCESSING & mencatat riwayat...' 
                    : 'Mengembalikan stok produk & mencatat mutasi pengembalian...'
                );
            } else if (percent >= 100) {
                clearInterval(interval);
                executeWebhookCall(status);
            }
        }, 300);
    };

    const executeWebhookCall = async (status) => {
        try {
            const payload = {
                order_id: order.payment.external_id,
                transaction_status: status,
                payment_type: status === 'settlement' ? 'qris' : 'bank_transfer',
                gross_amount: order.final_amount.toString(),
            };

            const response = await fetch(route('payment.webhook.midtrans'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                setWebhookMessage({ type: 'success', text: `Webhook ${status} sukses terkirim!` });
                router.reload({ preserveScroll: true });
            } else {
                setWebhookMessage({ type: 'error', text: data.message || 'Gagal memproses webhook.' });
            }
        } catch (err) {
            setWebhookMessage({ type: 'error', text: 'Koneksi error saat mengirim webhook.' });
        } finally {
            setIsWebhookLoading(false);
        }
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

    const fmt = (n) => 'Rp ' + Number(n).toLocaleString('id-ID');

    // Pemetaan warna badge status pesanan
    const getStatusStyles = (status) => {
        switch (status) {
            case 'pending':
                return { bg: '#fef3c7', color: '#d97706', label: 'Menunggu Pembayaran' };
            case 'processing':
                return { bg: '#dbeafe', color: '#2563eb', label: 'Diproses' };
            case 'shipped':
                return { bg: '#f3e8ff', color: '#7c3aed', label: 'Dikirim' };
            case 'delivered':
                return { bg: '#d1fae5', color: '#059669', label: 'Diterima' };
            case 'completed':
                return { bg: '#d1fae5', color: '#059669', label: 'Selesai' };
            case 'cancelled':
                return { bg: '#fee2e2', color: '#dc2626', label: 'Dibatalkan' };
            case 'refund_requested':
                return { bg: '#fff7ed', color: '#c2410c', label: 'Refund Diajukan' };
            case 'refund_approved':
                return { bg: '#dcfce7', color: '#16a34a', label: 'Refund Disetujui' };
            case 'refund_rejected':
                return { bg: '#fee2e2', color: '#dc2626', label: 'Refund Ditolak' };
            default:
                return { bg: '#f3f4f6', color: '#4b5563', label: status };
        }
    };

    // Gunakan status refund untuk badge jika refund sudah selesai
    const refundStatus = order.refund?.status;
    const refundApproved = refundStatus === 'approved';
    const refundRejected = refundStatus === 'rejected';

    const displayStatus = refundApproved
        ? 'refund_approved'
        : refundRejected
        ? 'refund_rejected'
        : order.status;

    const orderStatus = getStatusStyles(displayStatus);
    const paymentStatus = order.payment?.payment_status === 'paid'
        ? { bg: '#e6f4ea', color: '#137333', label: 'Lunas' }
        : order.payment?.payment_status === 'failed'
            ? { bg: '#fce8e6', color: '#c5221f', label: 'Gagal' }
            : { bg: '#fef7e0', color: '#b06000', label: 'Belum Dibayar' };

    // Dapatkan icon/bullet timeline berdasarkan status baru
    const getTimelineBullet = (status) => {
        switch (status) {
            case 'pending':
                return { char: '📄', bg: '#fef3c7', border: '#f59e0b' };
            case 'processing':
                return { char: '⚙️', bg: '#dbeafe', border: '#3b82f6' };
            case 'shipped':
                return { char: '🚚', bg: '#f3e8ff', border: '#8b5cf6' };
            case 'delivered':
                return { char: '✅', bg: '#d1fae5', border: '#10b981' };
            case 'completed':
                return { char: '🏁', bg: '#d1fae5', border: '#10b981' };
            case 'cancelled':
                return { char: '❌', bg: '#fee2e2', border: '#ef4444' };
            case 'refund_requested':
                return { char: '🔄', bg: '#fff7ed', border: '#f97316' };
            case 'refund_approved':
                return { char: '💚', bg: '#dcfce7', border: '#16a34a' };
            case 'refund_rejected':
                return { char: '🚫', bg: '#fee2e2', border: '#dc2626' };
            default:
                return { char: '📌', bg: '#f3f4f6', border: '#9ca3af' };
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: "'Inter','Segoe UI',sans-serif", paddingBottom: 60 }}>
            <Head title="" />
            <Navbar auth={null} cartCount={0} />

            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '30px 20px', position: 'relative' }}>
                
                {/* Full-page loading overlay for Webhook Mock */}
                {isWebhookLoading && (
                    <div style={{
                        position: 'fixed',
                        top: 0, left: 0, width: '100%', height: '100%',
                        background: 'rgba(15, 23, 42, 0.95)',
                        backdropFilter: 'blur(10px)',
                        zIndex: 9999,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'fadeIn 0.3s ease forwards'
                    }}>
                        <style dangerouslySetInnerHTML={{__html: `
                            @keyframes spinCircle {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                            @keyframes fadeIn {
                                from { opacity: 0; }
                                to { opacity: 1; }
                            }
                        `}} />
                        <div style={{ width: 90, height: 90, position: 'relative', marginBottom: 28 }}>
                            <div style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                border: '5px solid rgba(59,130,246,0.1)', borderTopColor: '#38bdf8',
                                borderRadius: '50%', animation: 'spinCircle 1s linear infinite'
                            }} />
                            <div style={{ fontSize: 36, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                {simulatedStatus === 'settlement' ? '✅' : '❌'}
                            </div>
                        </div>
                        <h3 style={{ margin: '0 0 8px 0', fontSize: 22, fontWeight: 900, color: '#f1f5f9' }}>
                            {simulatedStatus === 'settlement' ? 'Memproses Konfirmasi Pembayaran...' : 'Membatalkan Transaksi...'}
                        </h3>
                        <p style={{ margin: '0 0 32px 0', fontSize: 14, color: '#94a3b8', maxWidth: 450, lineHeight: 1.7, textAlign: 'center' }}>
                            {simulatedStatus === 'settlement'
                                ? 'Midtrans (Sandbox) mengirimkan notifikasi webhook ke server NadaKito. Status pesanan sedang diperbarui secara aman.'
                                : 'Transaksi dibatalkan via webhook (Expired). Stok produk sedang dikembalikan ke database.'}
                        </p>
                        <div style={{ width: '100%', maxWidth: 400, height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden', marginBottom: 14 }}>
                            <div style={{ height: '100%', width: `${loadingPercent}%`, background: 'linear-gradient(90deg, #3b82f6, #06b6d4)', borderRadius: 4, transition: 'width 0.3s ease-out' }} />
                        </div>
                        <p style={{ margin: 0, fontSize: 13, color: '#cbd5e1', fontWeight: 600, fontStyle: 'italic' }}>{loadingText}</p>
                    </div>
                )}

                {/* Header detail */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontSize: 13, color: '#888' }}>
                            <Link href={route('dashboard')} style={{ color: '#888', textDecoration: 'none' }}>Home</Link>
                            <span>›</span>
                            <span style={{ color: '#333', fontWeight: 600 }}>Detail Pesanan</span>
                        </div>
                        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.5px' }}>
                            Detail Pesanan <span style={{ color: '#666', fontWeight: 500 }}>#{order.order_id}</span>
                        </h1>
                        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#666' }}>Dibuat pada {order.created_at} WIB</p>
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                        <Link
                            href={route('dashboard')}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '10px 18px',
                                background: '#fff',
                                color: '#475569',
                                border: '1px solid #cbd5e1',
                                borderRadius: 10,
                                fontSize: 13,
                                fontWeight: 700,
                                textDecoration: 'none',
                                transition: 'all 0.15s'
                            }}
                        >
                            Kembali ke Dashboard
                        </Link>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 30, alignItems: 'start' }}>

                    {/* LEFT COLUMN: Order Details & Timeline */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                        {/* 1. Status Overview Card */}
                        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid #eef0f2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ margin: 0, fontSize: 12, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Status Pesanan</p>
                                <span style={{
                                    display: 'inline-block',
                                    background: orderStatus.bg,
                                    color: orderStatus.color,
                                    fontWeight: 800,
                                    fontSize: 14,
                                    padding: '6px 14px',
                                    borderRadius: 8
                                }}>
                                    {orderStatus.label}
                                </span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ margin: 0, fontSize: 12, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Pembayaran</p>
                                <span style={{
                                    display: 'inline-block',
                                    background: paymentStatus.bg,
                                    color: paymentStatus.color,
                                    fontWeight: 800,
                                    fontSize: 14,
                                    padding: '6px 14px',
                                    borderRadius: 8
                                }}>
                                    {paymentStatus.label}
                                </span>
                            </div>
                        </div>

                        {/* 2. Timeline Riwayat Status Pesanan */}
                        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid #eef0f2' }}>
                            <h3 style={{ margin: '0 0 20px 0', fontWeight: 800, fontSize: 16, color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 20 }}>🕒</span> Alur Riwayat Status (Real-time Timeline)
                            </h3>

                            <div style={{ position: 'relative', paddingLeft: 30, display: 'flex', flexDirection: 'column', gap: 24 }}>
                                {/* Garis vertikal timeline */}
                                <div style={{
                                    position: 'absolute',
                                    top: 10,
                                    bottom: 10,
                                    left: 14,
                                    width: 2,
                                    background: 'linear-gradient(to bottom, #3a7d44, #e2e8f0)'
                                }} />

                                {order.status_histories.map((hist, idx) => {
                                    const bullet = getTimelineBullet(hist.new_status);
                                    return (
                                        <div key={hist.id || idx} style={{ position: 'relative' }}>
                                            {/* Elegant Dot */}
                                            <div style={{
                                                position: 'absolute',
                                                left: -22,
                                                top: 6,
                                                width: 14,
                                                height: 14,
                                                borderRadius: '50%',
                                                background: bullet.border,
                                                border: '2px solid #fff',
                                                zIndex: 2,
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                            }} />

                                            {/* Content box */}
                                            <div style={{
                                                background: idx === order.status_histories.length - 1 ? '#fcfdfd' : '#fff',
                                                border: idx === order.status_histories.length - 1 ? '1.5px solid #3a7d44' : '1px solid #eef0f2',
                                                borderRadius: 12,
                                                padding: '12px 16px',
                                                marginLeft: 14,
                                                boxShadow: idx === order.status_histories.length - 1 ? '0 3px 8px rgba(58,125,68,0.08)' : 'none'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                                    <span style={{
                                                        fontWeight: 750,
                                                        fontSize: 13,
                                                        color: idx === order.status_histories.length - 1 ? '#3a7d44' : '#1a1a1a'
                                                    }}>
                                                        Status Baru: {getStatusStyles(hist.new_status).label}
                                                    </span>
                                                    <span style={{ fontSize: 11, color: '#999', fontWeight: 500 }}>{hist.changed_at}</span>
                                                </div>
                                                <p style={{ margin: 0, fontSize: 13, color: '#555', lineHeight: 1.4 }}>{hist.note}</p>
                                                <div style={{ marginTop: 6, fontSize: 11, color: '#888', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    Diperbarui oleh: <strong>{hist.changed_by}</strong>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 3. Detail Barang Belanja */}
                        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid #eef0f2' }}>
                            <h3 style={{ margin: '0 0 16px 0', fontWeight: 800, fontSize: 16, color: '#1a1a1a' }}>Barang yang Dipesan</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {order.items.map(item => (
                                    <div key={item.order_item_id} style={{ display: 'flex', alignItems: 'center', gap: 14, borderBottom: '1px solid #f1f3f5', paddingBottom: 14 }}>
                                        <div style={{ width: 54, height: 54, borderRadius: 8, overflow: 'hidden', background: '#f5f5f5', border: '1px solid #eee', flexShrink: 0 }}>
                                            {item.image_url ? (
                                                <img src={item.image_url} alt={item.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🎸</div>
                                            )}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#1a1a1a', lineHeight: 1.4 }}>{item.product_name}</p>
                                            <p style={{ margin: '3px 0 0', fontSize: 12, color: '#777' }}>{item.quantity} x {fmt(item.price_each)}</p>
                                        </div>
                                        <span style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>{fmt(item.price_each * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Summary & Payment Actions */}
                    <div style={{ position: 'sticky', top: 84, display: 'flex', flexDirection: 'column', gap: 20 }}>

                        {/* Aksi Pesanan (Diterima / Refund) */}
                        {(order.status === 'shipped' || order.status === 'delivered' || order.status === 'completed') && !refundApproved && (
                            <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid #eef0f2' }}>
                                <h3 style={{ margin: '0 0 14px 0', fontSize: 14, fontWeight: 800, color: '#1a1a1a' }}>Aksi Pesanan</h3>
                                
                                {order.status === 'shipped' && (!order.refund || refundRejected) && (
                                    <button
                                        onClick={() => handleReceive(order.order_id)}
                                        style={{ width: '100%', padding: '12px 0', background: '#10b981', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 8 }}
                                    >
                                        Pesanan Diterima
                                    </button>
                                )}

                                {(order.status === 'shipped' || order.status === 'delivered' || order.status === 'completed') && !order.refund && (
                                    <Link
                                        href={route('orders.index')}
                                        style={{ display: 'block', textAlign: 'center', width: '100%', padding: '12px 0', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', textDecoration: 'none' }}
                                    >
                                        Ajukan Refund di Dashboard
                                    </Link>
                                )}

                                {order.refund && order.refund.status === 'pending' && (
                                    <div style={{ padding: '10px 14px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#c2410c', textAlign: 'center' }}>
                                        Refund sedang diproses oleh admin
                                    </div>
                                )}
                            </div>
                        )}

                        {refundApproved && (
                            <div style={{ background: '#f0fdf4', borderRadius: 16, padding: 20, border: '1.5px solid #86efac' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <svg width="22" height="22" fill="none" stroke="#16a34a" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 800, fontSize: 14, color: '#15803d' }}>Refund Berhasil Disetujui</p>
                                        <p style={{ margin: '2px 0 0', fontSize: 12, color: '#4ade80', fontWeight: 500 }}>Stok produk telah dikembalikan ke toko</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Bayar (hanya tampil jika PENDING) */}
                        {order.status === 'pending' && order.payment && (
                            <div style={{ borderRadius: 16, padding: 20, boxShadow: '0 4px 14px rgba(245,158,11,0.06)', border: '1px solid #fde68a', background: '#fffbeb' }}>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: 15, fontWeight: 800, color: '#b45309' }}>Menunggu Pembayaran</h3>
                                <p style={{ margin: '0 0 16px 0', fontSize: 13, color: '#d97706', lineHeight: 1.5 }}>
                                    Segera selesaikan pembayaran tagihan Anda agar pesanan dapat langsung kami proses dan kirimkan.
                                </p>
                                <a
                                    href={route('payment.checkout', order.payment.external_id)}
                                    style={{
                                        display: 'flex',
                                        width: '100%',
                                        padding: '13px 0',
                                        background: 'linear-gradient(135deg, #b45309, #d97706)',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: 10,
                                        fontSize: 14,
                                        fontWeight: 800,
                                        textDecoration: 'none',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 8,
                                        boxShadow: '0 4px 12px rgba(217,119,6,0.25)',
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    <span>Bayar Sekarang</span>
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                </a>
                            </div>
                        )}

                        {/* Developer Sandbox Tools (Hanya muncul jika payment method adalah Midtrans & status pending) */}
                        {order.status === 'pending' && order.payment?.payment_method === 'midtrans' && (
                            <div style={{
                                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                                borderRadius: 16,
                                padding: 20,
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                                border: '1px solid #334155',
                                color: '#f8fafc'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                    <span style={{ fontSize: 18 }}>🛠️</span>
                                    <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#38bdf8', letterSpacing: '-0.3px' }}>
                                        Developer Sandbox Tools
                                    </h3>
                                </div>

                                <p style={{ margin: '0 0 14px 0', fontSize: 11, color: '#94a3b8', lineHeight: 1.5 }}>
                                    Gunakan panel ini untuk mensimulasikan notifikasi webhook Sandbox secara instan tanpa perlu menyelesaikan pembayaran.
                                </p>

                                <div style={{
                                    background: 'rgba(56, 189, 248, 0.1)',
                                    border: '1px solid rgba(56, 189, 248, 0.2)',
                                    borderRadius: 8,
                                    padding: '8px 10px',
                                    fontSize: 10,
                                    color: '#7dd3fc',
                                    marginBottom: 14,
                                    lineHeight: 1.4
                                }}>
                                    <strong>🔗 Sandbox Mode:</strong> Tombol di bawah akan menyimulasikan notifikasi webhook dari payment gateway ke server lokal Anda.
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {/* Link simulator Midtrans */}
                                    {!order.payment.payment_url.includes('payment/simulate') && (
                                        <a
                                            href="https://simulator.sandbox.midtrans.com/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 6,
                                                padding: '8px 0',
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                border: '1px solid #475569',
                                                color: '#e2e8f0',
                                                borderRadius: 8,
                                                fontSize: 12,
                                                fontWeight: 600,
                                                textDecoration: 'none'
                                            }}
                                        >
                                            <span>🏦 Buka Simulator Sandbox Midtrans</span>
                                        </a>
                                    )}

                                    {/* Divider */}
                                    <div style={{ height: 1, background: '#334155', margin: '4px 0' }} />

                                    <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        Simulasi Webhook Instan (Tanpa ngrok)
                                    </span>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                        <button
                                            disabled={isWebhookLoading}
                                            onClick={() => triggerWebhook('settlement')}
                                            style={{
                                                padding: '8px 4px',
                                                background: '#059669',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: 6,
                                                fontSize: 11,
                                                fontWeight: 700,
                                                cursor: isWebhookLoading ? 'not-allowed' : 'pointer',
                                                opacity: isWebhookLoading ? 0.6 : 1
                                            }}
                                        >
                                            {isWebhookLoading ? '...' : '✅ Sukses (Paid)'}
                                        </button>
                                        <button
                                            disabled={isWebhookLoading}
                                            onClick={() => triggerWebhook('expire')}
                                            style={{
                                                padding: '8px 4px',
                                                background: '#dc2626',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: 6,
                                                fontSize: 11,
                                                fontWeight: 700,
                                                cursor: isWebhookLoading ? 'not-allowed' : 'pointer',
                                                opacity: isWebhookLoading ? 0.6 : 1
                                            }}
                                        >
                                            {isWebhookLoading ? '...' : '❌ Gagal (Expired)'}
                                        </button>
                                    </div>

                                    {webhookMessage && (
                                        <div style={{
                                            marginTop: 6,
                                            fontSize: 10,
                                            color: webhookMessage.type === 'success' ? '#34d399' : '#f87171',
                                            background: 'rgba(0,0,0,0.2)',
                                            padding: '4px 8px',
                                            borderRadius: 6,
                                            textAlign: 'center'
                                        }}>
                                            {webhookMessage.text}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Order Address & Shipment Info */}
                        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid #eef0f2' }}>
                            <h4 style={{ margin: '0 0 14px 0', fontWeight: 850, fontSize: 14, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Informasi Pengiriman</h4>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div>
                                    <p style={{ margin: 0, fontSize: 11, color: '#888', fontWeight: 600 }}>KURIR PILIHAN</p>
                                    <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 700, color: '#333' }}>{order.courier_code || '—'}</p>
                                </div>
                                <div style={{ borderTop: '1px solid #f1f3f5', paddingTop: 10 }}>
                                    <p style={{ margin: 0, fontSize: 11, color: '#888', fontWeight: 600 }}>ALAMAT TUJUAN</p>
                                    <p style={{ margin: '2px 0 0', fontSize: 13, color: '#555', lineHeight: 1.4 }}>{order.shipping_address}</p>
                                </div>
                                {order.notes && (
                                    <div style={{ borderTop: '1px solid #f1f3f5', paddingTop: 10, background: '#f8fafc', padding: 8, borderRadius: 8 }}>
                                        <p style={{ margin: 0, fontSize: 11, color: '#888', fontWeight: 600 }}>CATATAN PELANGGAN</p>
                                        <p style={{ margin: '4px 0 0', fontSize: 12, color: '#555', fontStyle: 'italic' }}>"{order.notes}"</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Financial Details */}
                        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 3px 12px rgba(0,0,0,0.04)', border: '1px solid #eef0f2' }}>
                            <h3 style={{ margin: '0 0 16px 0', fontWeight: 800, fontSize: 15, color: '#1a1a1a' }}>Detail Biaya</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderBottom: '1px dashed #e2e8f0', paddingBottom: 14, marginBottom: 14 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#666' }}>
                                    <span>Subtotal Barang</span>
                                    <span style={{ fontWeight: 600, color: '#333' }}>{fmt(order.subtotal_amount)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#666' }}>
                                    <span>Ongkos Kirim</span>
                                    <span style={{ fontWeight: 600, color: '#333' }}>{fmt(order.shipping_cost)}</span>
                                </div>
                                {order.discount_amount > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#3a7d44', fontWeight: 600 }}>
                                        <span>Potongan Diskon</span>
                                        <span>-{fmt(order.discount_amount)}</span>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: 14, fontWeight: 850, color: '#1a1a1a' }}>Total Biaya</span>
                                <span style={{ fontSize: 18, fontWeight: 850, color: '#3a7d44' }}>{fmt(order.final_amount)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
