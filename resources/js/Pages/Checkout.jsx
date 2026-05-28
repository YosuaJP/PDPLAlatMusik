import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

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

export default function Checkout({ cartItems, cart, addresses, promos, couriers }) {
    const { props } = usePage();
    const auth = props.auth;
    const cartCount = props.cartCount ?? 0;

    // State form checkout
    const [selectedAddressId, setSelectedAddressId] = useState(
        addresses.find(a => a.is_default)?.address_id ?? addresses[0]?.address_id ?? ''
    );
    const [selectedCourierCode, setSelectedCourierCode] = useState(couriers[0]?.code ?? '');
    const [selectedPromoId, setSelectedPromoId] = useState(cart.promo_id ?? '');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // State form alamat inline
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [addressForm, setAddressForm] = useState({
        label: '', address: '', city: '', postal_code: '', is_default: false
    });
    const [addressSubmitting, setAddressSubmitting] = useState(false);

    const openAddAddress = () => {
        setEditingAddressId(null);
        setAddressForm({ label: '', address: '', city: '', postal_code: '', is_default: false });
        setShowAddressForm(true);
    };

    const openEditAddress = (e, addr) => {
        e.preventDefault();
        e.stopPropagation();
        setEditingAddressId(addr.address_id);
        setAddressForm({
            label: addr.label, address: addr.address, city: addr.city, postal_code: addr.postal_code, is_default: addr.is_default
        });
        setShowAddressForm(true);
    };

    const saveAddress = (e) => {
        e.preventDefault();
        setAddressSubmitting(true);
        if (editingAddressId) {
            router.put(route('addresses.update', editingAddressId), addressForm, {
                onSuccess: () => {
                    setShowAddressForm(false);
                    setAddressSubmitting(false);
                },
                onError: () => setAddressSubmitting(false)
            });
        } else {
            router.post(route('addresses.store'), addressForm, {
                onSuccess: () => {
                    setShowAddressForm(false);
                    setAddressSubmitting(false);
                },
                onError: () => setAddressSubmitting(false)
            });
        }
    };

    // Kalkulasi subtotal
    const subtotal = cartItems.reduce((sum, i) => sum + (i.price_each * i.quantity), 0);

    // Ambil kurir aktif
    const activeCourier = couriers.find(c => c.code === selectedCourierCode) || { cost: 0 };
    const shippingCost = activeCourier.cost;

    // Ambil promo aktif & hitung diskon
    const activePromo = promos.find(p => p.promo_id === Number(selectedPromoId));
    let discount = 0;
    if (activePromo) {
        if (activePromo.promo_type === 'percent') {
            discount = (subtotal * activePromo.discount_value) / 100;
            if (activePromo.max_discount_amount && discount > activePromo.max_discount_amount) {
                discount = Number(activePromo.max_discount_amount);
            }
        } else {
            discount = Number(activePromo.discount_value);
        }
    }

    const finalAmount = Math.max(0, subtotal - discount + shippingCost);

    const fmt = (n) => 'Rp ' + Number(n).toLocaleString('id-ID');

    // Submit
    const handlePlaceOrder = (e) => {
        e.preventDefault();
        if (!selectedAddressId) {
            setErrorMessage('Silakan pilih alamat pengiriman terlebih dahulu.');
            return;
        }

        setIsSubmitting(true);
        setErrorMessage('');

        router.post(route('checkout.store'), {
            address_id: selectedAddressId,
            courier_code: selectedCourierCode,
            shipping_cost: shippingCost,
            notes: notes,
            promo_id: selectedPromoId ? Number(selectedPromoId) : null,
        }, {
            onError: (err) => {
                setIsSubmitting(false);
                setErrorMessage(err.error || 'Terjadi kesalahan saat memproses pesanan.');
            },
            onFinish: () => {
                // Di-handle otomatis jika berhasil (di-redirect oleh Inertia)
                setIsSubmitting(false);
            }
        });
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: "'Inter','Segoe UI',sans-serif", pb: 60 }}>
            <Head title="Checkout — NadaKito" />
            <Navbar auth={auth} cartCount={cartCount} />

            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '30px 20px' }}>
                {/* Breadcrumb */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24, fontSize: 13, color: '#888' }}>
                    <Link href={route('dashboard')} style={{ color: '#888', textDecoration: 'none' }}>Home</Link>
                    <span>›</span>
                    <Link href={route('cart.index')} style={{ color: '#888', textDecoration: 'none' }}>Cart</Link>
                    <span>›</span>
                    <span style={{ color: '#333', fontWeight: 600 }}>Checkout</span>
                </div>

                <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1a1a1a', marginBottom: 28, letterSpacing: '-0.5px' }}>Checkout Pemesanan</h1>

                {errorMessage && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '14px 18px', borderRadius: 12, marginBottom: 24, fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        {errorMessage}
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 30, alignItems: 'start' }}>
                    {/* LEFT COLUMN */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        
                        {/* 1. Alamat Pengiriman */}
                        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid #eef0f2' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                                <div style={{ width: 32, height: 32, background: '#eaf4eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3a7d44' }}>
                                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <h3 style={{ margin: 0, fontWeight: 750, fontSize: 16, color: '#1a1a1a' }}>Alamat Pengiriman</h3>
                            </div>

                            {addresses.length === 0 ? (
                                <div style={{ border: '2px dashed #ddd', borderRadius: 12, padding: 20, textAlign: 'center', color: '#666' }}>
                                    <p style={{ margin: '0 0 10px 0', fontSize: 14 }}>Belum ada alamat terdaftar.</p>
                                    {/* Link ke profil untuk menambahkan alamat */}
                                    <button onClick={openAddAddress} style={{ color: '#3a7d44', fontWeight: 700, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}>+ Tambah Alamat Baru</button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {addresses.map(addr => (
                                        <label key={addr.address_id} style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: 12,
                                            padding: 16,
                                            borderRadius: 12,
                                            border: selectedAddressId === addr.address_id ? '2px solid #3a7d44' : '1px solid #e2e8f0',
                                            background: selectedAddressId === addr.address_id ? '#f6faf7' : '#fff',
                                            cursor: 'pointer',
                                            transition: 'all 0.15s'
                                        }}>
                                            <input
                                                type="radio"
                                                name="address_id"
                                                value={addr.address_id}
                                                checked={selectedAddressId === addr.address_id}
                                                onChange={() => setSelectedAddressId(addr.address_id)}
                                                style={{ marginTop: 3, accentColor: '#3a7d44' }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <span style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>{addr.label}</span>
                                                        {addr.is_default && (
                                                            <span style={{ background: '#e2e8f0', color: '#475569', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 12 }}>Default</span>
                                                        )}
                                                    </div>
                                                    <button type="button" onClick={(e) => openEditAddress(e, addr)} style={{ background: 'none', border: 'none', color: '#3a7d44', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Edit</button>
                                                </div>
                                                <p style={{ margin: 0, fontSize: 13, color: '#555', lineHeight: 1.5 }}>{addr.address}, {addr.city}</p>
                                                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#888' }}>Kode Pos: {addr.postal_code}</p>
                                            </div>
                                        </label>
                                    ))}
                                    <button onClick={openAddAddress} style={{ alignSelf: 'flex-start', marginTop: 8, color: '#3a7d44', fontWeight: 700, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                        Tambah Alamat Baru
                                    </button>
                                </div>
                            )}

                            {/* Modal Form Alamat Inline */}
                            {showAddressForm && (
                                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                                    <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 500, padding: 24, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                                        <h3 style={{ margin: '0 0 20px 0', fontSize: 18, fontWeight: 800 }}>{editingAddressId ? 'Edit Alamat' : 'Tambah Alamat Baru'}</h3>
                                        <form onSubmit={saveAddress} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Label Alamat (Contoh: Rumah, Kantor)</label>
                                                <input type="text" required value={addressForm.label} onChange={e => setAddressForm({...addressForm, label: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', boxSizing: 'border-box' }} />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Alamat Lengkap</label>
                                                <textarea required value={addressForm.address} onChange={e => setAddressForm({...addressForm, address: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', minHeight: 80, boxSizing: 'border-box' }} />
                                            </div>
                                            <div style={{ display: 'flex', gap: 16 }}>
                                                <div style={{ flex: 1 }}>
                                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Kota</label>
                                                    <input type="text" required value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', boxSizing: 'border-box' }} />
                                                </div>
                                                <div style={{ width: 120 }}>
                                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Kode Pos</label>
                                                    <input type="text" required value={addressForm.postal_code} onChange={e => setAddressForm({...addressForm, postal_code: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', boxSizing: 'border-box' }} />
                                                </div>
                                            </div>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                                                <input type="checkbox" checked={addressForm.is_default} onChange={e => setAddressForm({...addressForm, is_default: e.target.checked})} style={{ accentColor: '#3a7d44' }} />
                                                Jadikan sebagai alamat utama
                                            </label>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
                                                <button type="button" onClick={() => setShowAddressForm(false)} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', fontWeight: 600, cursor: 'pointer' }}>Batal</button>
                                                <button type="submit" disabled={addressSubmitting} style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: '#3a7d44', color: '#fff', fontWeight: 600, cursor: addressSubmitting ? 'not-allowed' : 'pointer' }}>
                                                    {addressSubmitting ? 'Menyimpan...' : 'Simpan'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 2. Pilihan Kurir */}
                        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid #eef0f2' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                                <div style={{ width: 32, height: 32, background: '#eaf4eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3a7d44' }}>
                                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
                                </div>
                                <h3 style={{ margin: 0, fontWeight: 750, fontSize: 16, color: '#1a1a1a' }}>Pilihan Pengiriman (Kurir)</h3>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                                {couriers.map(cr => (
                                    <label key={cr.code} style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        padding: 16,
                                        borderRadius: 12,
                                        border: selectedCourierCode === cr.code ? '2px solid #3a7d44' : '1px solid #e2e8f0',
                                        background: selectedCourierCode === cr.code ? '#f6faf7' : '#fff',
                                        cursor: 'pointer',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        transition: 'all 0.15s'
                                    }}>
                                        <input
                                            type="radio"
                                            name="courier_code"
                                            value={cr.code}
                                            checked={selectedCourierCode === cr.code}
                                            onChange={() => setSelectedCourierCode(cr.code)}
                                            style={{ display: 'none' }}
                                        />
                                        <span style={{ fontWeight: 800, fontSize: 15, color: '#1a1a1a', marginBottom: 4 }}>{cr.code}</span>
                                        <span style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>{cr.name.replace(cr.code + ' ', '')}</span>
                                        <span style={{ fontWeight: 700, fontSize: 13, color: '#3a7d44' }}>{fmt(cr.cost)}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* 3. Detail Barang & Catatan */}
                        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid #eef0f2' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                                <div style={{ width: 32, height: 32, background: '#eaf4eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3a7d44' }}>
                                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                </div>
                                <h3 style={{ margin: 0, fontWeight: 750, fontSize: 16, color: '#1a1a1a' }}>Detail Pesanan</h3>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                                {cartItems.map(item => (
                                    <div key={item.cart_item_id} style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #f1f3f5', paddingBottom: 14 }}>
                                        <div style={{ width: 50, height: 50, borderRadius: 8, overflow: 'hidden', background: '#f5f5f5', border: '1px solid #eee', flexShrink: 0 }}>
                                            {item.product?.image_url ? (
                                                <img src={item.product.image_url} alt={item.product?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🎸</div>
                                            )}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: '#1a1a1a', lineHeight: 1.4 }}>{item.product?.name ?? '—'}</p>
                                            <p style={{ margin: '3px 0 0', fontSize: 12, color: '#777' }}>{item.quantity} x {fmt(item.price_each)}</p>
                                        </div>
                                        <span style={{ fontWeight: 700, fontSize: 13, color: '#1a1a1a' }}>{fmt(item.price_each * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 8 }}>Catatan Tambahan untuk Penjual (Opsional)</label>
                                <textarea
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    placeholder="Contoh: Tolong bungkus bubble wrap double, warna gitar disesuaikan, dll."
                                    style={{
                                        width: '100%',
                                        minHeight: 80,
                                        borderRadius: 10,
                                        border: '1px solid #cbd5e1',
                                        padding: '10px 14px',
                                        fontSize: 13,
                                        fontFamily: 'inherit',
                                        resize: 'vertical',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                        {/* RIGHT COLUMN: Ringkasan & Pembayaran */}
                        <div style={{ position: 'sticky', top: 84 }}>
                            
                            {/* Order Summary Card */}
                            <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.04)', border: '1px solid #eef0f2' }}>
                                <h3 style={{ margin: '0 0 20px 0', fontWeight: 800, fontSize: 18, color: '#1a1a1a' }}>Ringkasan Pesanan</h3>

                                {/* List Produk (Kecil) */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderBottom: '1px solid #f1f3f5', paddingBottom: 16, marginBottom: 16, maxHeight: 200, overflowY: 'auto' }}>
                                    {cartItems.map(item => (
                                        <div key={item.cart_item_id} style={{ display: 'flex', gap: 10 }}>
                                            <div style={{ width: 44, height: 44, borderRadius: 8, background: '#f5f5f5', overflow: 'hidden', flexShrink: 0 }}>
                                                {item.product?.image_url ? (
                                                    <img src={item.product.image_url} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>🎸</div>
                                                )}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#1a1a1a', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.product?.name}</p>
                                                <p style={{ margin: '2px 0 0', fontSize: 11, color: '#888' }}>{item.quantity} x {fmt(item.price_each)}</p>
                                            </div>
                                            <div style={{ fontWeight: 700, fontSize: 12, color: '#1a1a1a' }}>
                                                {fmt(item.quantity * item.price_each)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Promo / Kupon Redesigned */}
                                <div style={{ marginBottom: 20 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                        <span style={{ fontSize: 11, fontWeight: 700, color: '#888', letterSpacing: '0.5px' }}>KODE VOUCHER</span>
                                        {activePromo && (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: '#3a7d44' }}>
                                                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                Voucher Aktif
                                            </span>
                                        )}
                                    </div>
                                    <select
                                        value={selectedPromoId}
                                        onChange={e => setSelectedPromoId(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '12px 14px',
                                            borderRadius: 10,
                                            border: activePromo ? '1px solid #3a7d44' : '1px solid #cbd5e1',
                                            fontSize: 13,
                                            background: activePromo ? '#f5fff7' : '#fff',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            color: activePromo ? '#3a7d44' : '#333'
                                        }}
                                    >
                                        <option value="">Pilih / Masukkan Voucher</option>
                                        {promos.map(pr => (
                                            <option key={pr.promo_id} value={pr.promo_id}>
                                                {pr.promo_code} - Hemat {pr.promo_type === 'percent' ? pr.discount_value + '%' : fmt(pr.discount_value)}
                                            </option>
                                        ))}
                                    </select>
                                    {activePromo && (
                                        <div style={{ marginTop: 10, background: '#f0faf2', border: '1px solid #c8eacd', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#3a7d44', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <span>🎉</span>
                                            <span>Berhasil! Anda hemat {fmt(discount)}.</span>
                                        </div>
                                    )}
                                </div>

                                <div style={{ borderTop: '1px dashed #e2e8f0', paddingBottom: 16, marginBottom: 16 }}></div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderBottom: '1px dashed #e2e8f0', paddingBottom: 16, marginBottom: 16 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#666' }}>
                                        <span>Subtotal Barang</span>
                                        <span style={{ fontWeight: 600, color: '#333' }}>{fmt(subtotal)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#666' }}>
                                        <span>Biaya Pengiriman ({selectedCourierCode})</span>
                                        <span style={{ fontWeight: 600, color: '#333' }}>{fmt(shippingCost)}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#3a7d44', fontWeight: 600 }}>
                                            <span>Diskon Promo</span>
                                            <span>-{fmt(discount)}</span>
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                                    <span style={{ fontSize: 16, fontWeight: 800, color: '#1a1a1a' }}>Total Tagihan</span>
                                    <span style={{ fontSize: 22, fontWeight: 850, color: '#1a1a1a' }}>{fmt(finalAmount)}</span>
                                </div>

                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={isSubmitting || cartItems.length === 0}
                                    style={{
                                        width: '100%',
                                        padding: '16px 0',
                                        background: '#5cb85c',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: 30,
                                        fontSize: 16,
                                        fontWeight: 800,
                                        cursor: (isSubmitting || cartItems.length === 0) ? 'not-allowed' : 'pointer',
                                        boxShadow: '0 4px 14px rgba(92,184,92,0.3)',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 8,
                                        opacity: isSubmitting ? 0.7 : 1
                                    }}
                                    onMouseEnter={e => {
                                        if (!isSubmitting) {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 6px 18px rgba(92,184,92,0.4)';
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (!isSubmitting) {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 14px rgba(92,184,92,0.3)';
                                        }
                                    }}
                                >
                                    {isSubmitting ? (
                                        <span>Memproses Pesanan...</span>
                                    ) : (
                                        <>
                                            <span>Bayar Sekarang</span>
                                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </>
                                    )}
                                </button>

                            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#888', fontSize: 11, textAlign: 'center', lineHeight: 1.4 }}>
                                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                Transaksi dilindungi enkripsi SSL & Gateway Xendit
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
