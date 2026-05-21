import { Head, Link } from '@inertiajs/react';

function Navbar({ auth, cartCount }) {
    return (
        <nav style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', gap: 20, height: 64 }}>
                <Link href={route('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
                    <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#3a7d44,#6BCB77)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="18" height="18" fill="none" stroke="#fff" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 17, color: '#1a1a1a' }}>NadaKito</span>
                </Link>
                <div style={{ flex: 1 }} />
                <Link href={route('dashboard')} style={{ fontSize: 14, fontWeight: 500, color: '#555', textDecoration: 'none' }}>Beranda</Link>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#555' }}>Produk</span>
                <Link href={route('cart.index')} style={{ position: 'relative', color: '#555', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                    <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    {cartCount > 0 && (
                        <span style={{ position: 'absolute', top: -6, right: -6, background: '#3a7d44', color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount > 9 ? '9+' : cartCount}</span>
                    )}
                </Link>
                {auth?.user && (
                    <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#3a7d44,#6BCB77)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                        {auth.user.name?.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>
        </nav>
    );
}

export default function OrderStatus({ order }) {
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
            case 'cancelled':
                return { bg: '#fee2e2', color: '#dc2626', label: 'Dibatalkan' };
            default:
                return { bg: '#f3f4f6', color: '#4b5563', label: status };
        }
    };

    const orderStatus = getStatusStyles(order.status);
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
            case 'cancelled':
                return { char: '❌', bg: '#fee2e2', border: '#ef4444' };
            default:
                return { char: '📌', bg: '#f3f4f6', border: '#9ca3af' };
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: "'Inter','Segoe UI',sans-serif", paddingBottom: 60 }}>
            <Head title={`Pesanan #${order.order_id} — NadaKito`} />
            <Navbar auth={null} cartCount={0} />

            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '30px 20px' }}>
                
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
                                            {/* Bullet icon */}
                                            <div style={{
                                                position: 'absolute',
                                                left: -30,
                                                top: 0,
                                                width: 30,
                                                height: 30,
                                                borderRadius: '50%',
                                                background: bullet.bg,
                                                border: `2px solid ${bullet.border}`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 14,
                                                zIndex: 2,
                                                boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                                            }}>
                                                {bullet.char}
                                            </div>

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
                                                    👤 Diperbarui oleh: <strong>{hist.changed_by}</strong>
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
                        
                        {/* Action Bayar (hanya tampil jika PENDING) */}
                        {order.status === 'pending' && order.payment && (
                            <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 4px 14px rgba(245,158,11,0.06)', border: '1px solid #fde68a', background: '#fffbeb' }}>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: 15, fontWeight: 800, color: '#b45309' }}>Menunggu Pembayaran</h3>
                                <p style={{ margin: '0 0 16px 0', fontSize: 13, color: '#d97706', lineHeight: 1.5 }}>
                                    Segera selesaikan pembayaran tagihan Anda agar pesanan dapat langsung kami proses dan kirimkan.
                                </p>
                                <a
                                    href={order.payment.payment_url}
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
                                    <span>Simulasikan Bayar Sekarang</span>
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                </a>
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
