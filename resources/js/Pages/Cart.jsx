import Navbar from '@/Components/Navbar';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';


export default function Cart({ cartItems: initialItems, recommended, cartId, cart }) {
    const { props } = usePage();
    const auth = props.auth;
    const cartCount = props.cartCount ?? 0;

    const [items, setItems] = useState(initialItems ?? []);
    
    // Promo states
    const [promoCodeInput, setPromoCodeInput] = useState('');
    const [isApplyingPromo, setIsApplyingPromo] = useState(false);
    const [promoError, setPromoError] = useState('');
    const [promoSuccess, setPromoSuccess] = useState('');
    const [appliedPromo, setAppliedPromo] = useState(cart?.promo || null);
    const [promoPreview, setPromoPreview] = useState(null);

    const updateQty = (cartItemId, newQty) => {
        if (newQty < 1) return;
        router.patch(route('cart.update', cartItemId), { quantity: newQty }, {
            preserveScroll: true,
            onSuccess: () => setItems(prev => prev.map(i => i.cart_item_id === cartItemId ? { ...i, quantity: newQty } : i)),
        });
    };

    const removeItem = (cartItemId) => {
        router.delete(route('cart.remove', cartItemId), {
            preserveScroll: true,
            onSuccess: () => setItems(prev => prev.filter(i => i.cart_item_id !== cartItemId)),
        });
    };

    const addToCart = (productId) => {
        router.post(route('cart.add'), { product_id: productId, quantity: 1 }, { preserveScroll: true });
    };

    const subtotal = items.reduce((sum, i) => {
        const inStock = (i.product?.stock_qty ?? 0) > 0;
        return inStock ? sum + (i.price_each * i.quantity) : sum;
    }, 0);
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const hasOutOfStock = items.some(i => (i.product?.stock_qty ?? 0) === 0);

    const fmt = (n) => 'Rp ' + Number(n).toLocaleString('id-ID');

    // Handle initial promo load if exists in cart
    // Use React useEffect to fetch preview on load if there's an applied promo
    useState(() => {
        if (appliedPromo && subtotal > 0) {
            fetchPreview(appliedPromo.promo_code);
        }
    }, []);

    // Re-fetch promo preview when items change
    useState(() => {
        if (appliedPromo && subtotal > 0) {
            fetchPreview(appliedPromo.promo_code);
        } else if (subtotal === 0) {
            setPromoPreview(null);
            setPromoError('');
            setPromoSuccess('');
        }
    }, [subtotal]);

    function fetchPreview(code) {
        fetch(route('cart.preview-promo'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
            },
            body: JSON.stringify({ promo_code: code, subtotal: subtotal })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setPromoPreview(data);
                setPromoError('');
            } else {
                setPromoPreview(null);
                setPromoError(data.message);
            }
        })
        .catch(err => console.error(err));
    }

    const handleApplyPromo = () => {
        if (!promoCodeInput.trim()) return;
        setIsApplyingPromo(true);
        setPromoError('');
        setPromoSuccess('');

        router.post(route('cart.apply-promo'), { promo_code: promoCodeInput }, {
            preserveScroll: true,
            onSuccess: (page) => {
                setIsApplyingPromo(false);
                // Check if there are errors from backend
                if (page.props.errors && page.props.errors.promo_error) {
                    setPromoError(page.props.errors.promo_error);
                    setPromoPreview(null);
                    setAppliedPromo(null);
                } else {
                    setPromoSuccess('Promo berhasil diterapkan!');
                    setPromoCodeInput('');
                    setAppliedPromo(page.props.cart?.promo);
                    fetchPreview(page.props.cart?.promo?.promo_code);
                }
            },
            onError: (errors) => {
                setIsApplyingPromo(false);
                setPromoError(errors.promo_error || 'Gagal menerapkan promo');
                setPromoPreview(null);
            }
        });
    };

    const handleRemovePromo = () => {
        setIsApplyingPromo(true);
        router.delete(route('cart.remove-promo'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsApplyingPromo(false);
                setAppliedPromo(null);
                setPromoPreview(null);
                setPromoSuccess('');
                setPromoError('');
                setPromoCodeInput('');
            }
        });
    };

    const discountAmount = promoPreview?.discount_amount || 0;
    const finalTotal = Math.max(0, subtotal - discountAmount);

    return (
        <div style={{ minHeight: '100vh', background: '#f2f3f0', fontFamily: "'Inter','Segoe UI',sans-serif" }}>
            <Head title="" />
            <Navbar auth={auth} cartCount={cartCount} />

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px' }}>
                {/* Breadcrumb */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: 13, color: '#888' }}>
                    <Link href={route('dashboard')} style={{ color: '#888', textDecoration: 'none' }}>Home</Link>
                    <span>›</span>
                    <span style={{ color: '#333', fontWeight: 600 }}>Cart</span>
                </div>

                <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a1a', marginBottom: 24 }}>
                    Keranjang Kamu{' '}
                    <span style={{ fontSize: 18, fontWeight: 500, color: '#888' }}>
                        ({totalItems}/{totalItems} Items)
                    </span>
                </h1>

                {items.length === 0 ? (
                    /* Empty State */
                    <div style={{ background: '#fff', borderRadius: 16, padding: '60px 20px', textAlign: 'center' }}>
                        <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
                        <p style={{ fontSize: 16, color: '#555', marginBottom: 20 }}>Keranjang kamu masih kosong.</p>
                        <Link href={route('dashboard')} style={{ background: '#3a7d44', color: '#fff', padding: '12px 28px', borderRadius: 28, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
                            Mulai Belanja
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
                        {/* LEFT: Cart Items */}
                        <div>
                            {/* Table Header */}
                            <div style={{ background: '#fff', borderRadius: '12px 12px 0 0', padding: '14px 20px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 40px', gap: 12, borderBottom: '1px solid #f0f0f0' }}>
                                {['PRODUCT', 'PRICE', 'QUANTITY', 'TOTAL', ''].map((h, i) => (
                                    <span key={i} style={{ fontSize: 11, fontWeight: 700, color: '#999', letterSpacing: '0.5px', textAlign: i > 1 ? 'center' : 'left' }}>{h}</span>
                                ))}
                            </div>

                            {/* Items */}
                            {items.map((item, idx) => {
                                const isOutOfStock = (item.product?.stock_qty ?? 0) === 0;
                                return (
                                    <div key={item.cart_item_id} style={{
                                        background: isOutOfStock ? '#fafafa' : '#fff',
                                        borderBottom: idx < items.length - 1 ? '1px solid #f5f5f5' : 'none',
                                        borderRadius: idx === items.length - 1 ? '0 0 12px 12px' : 0,
                                        padding: '16px 20px',
                                        display: 'grid',
                                        gridTemplateColumns: '2fr 1fr 1fr 1fr 40px',
                                        gap: 12,
                                        alignItems: 'center',
                                        opacity: isOutOfStock ? 0.7 : 1,
                                        position: 'relative',
                                    }}>
                                        {/* Product Info */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{ width: 64, height: 64, borderRadius: 8, overflow: 'hidden', background: '#f5f5f5', flexShrink: 0, border: '1px solid #eee' }}>
                                                {item.product?.image_url ? (
                                                    <img src={item.product.image_url} alt={item.product?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <svg width="24" height="24" fill="none" stroke="#ccc" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a', marginBottom: 2 }}>{item.product?.name ?? '—'}</p>
                                                <p style={{ fontSize: 12, color: '#888' }}>Kategori: {item.product?.category_name ?? 'Umum'}</p>
                                                <span style={{ fontSize: 11, color: isOutOfStock ? '#ef4444' : '#3a7d44', fontWeight: 600 }}>
                                                    {isOutOfStock ? 'Stok Habis' : 'In Stock'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 600, color: '#333' }}>
                                            {fmt(item.price_each)}
                                        </div>

                                        {/* Qty Controls */}
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                            <button
                                                onClick={() => !isOutOfStock && updateQty(item.cart_item_id, item.quantity - 1)}
                                                disabled={isOutOfStock}
                                                style={{ width: 28, height: 28, borderRadius: 6, border: '1.5px solid #ddd', background: isOutOfStock ? '#f5f5f5' : '#fff', cursor: isOutOfStock ? 'not-allowed' : 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: isOutOfStock ? '#ccc' : '#555', fontWeight: 700 }}>
                                                −
                                            </button>
                                            <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 700, fontSize: 14, color: isOutOfStock ? '#bbb' : '#1a1a1a' }}>{item.quantity}</span>
                                            <button
                                                onClick={() => !isOutOfStock && updateQty(item.cart_item_id, item.quantity + 1)}
                                                disabled={isOutOfStock}
                                                style={{ width: 28, height: 28, borderRadius: 6, border: '1.5px solid #ddd', background: isOutOfStock ? '#f5f5f5' : '#fff', cursor: isOutOfStock ? 'not-allowed' : 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: isOutOfStock ? '#ccc' : '#555', fontWeight: 700 }}>
                                                +
                                            </button>
                                        </div>

                                        {/* Total */}
                                        <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 700, color: isOutOfStock ? '#ccc' : '#1a1a1a', textDecoration: isOutOfStock ? 'line-through' : 'none' }}>
                                            {fmt(item.price_each * item.quantity)}
                                        </div>

                                        {/* Delete */}
                                        <button onClick={() => removeItem(item.cart_item_id)}
                                            title={isOutOfStock ? 'Hapus barang stok habis' : 'Hapus'}
                                            style={{ background: isOutOfStock ? '#fee2e2' : 'none', border: isOutOfStock ? '1px solid #fca5a5' : 'none', cursor: 'pointer', color: isOutOfStock ? '#ef4444' : '#bbb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4, borderRadius: 6, transition: 'color 0.15s' }}
                                            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                                            onMouseLeave={e => e.currentTarget.style.color = isOutOfStock ? '#ef4444' : '#bbb'}>
                                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                );
                            })}

                            {/* Recommendations */}
                            {(recommended ?? []).length > 0 && (
                                <div style={{ marginTop: 32 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                        <div style={{ width: 20, height: 20, background: '#3a7d44', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <svg width="10" height="10" fill="#fff" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                        </div>
                                        <h3 style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a', margin: 0 }}>Mungkin Kamu Suka</h3>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                                        {recommended.map(p => (
                                            <div key={p.product_id} style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', cursor: 'pointer' }}>
                                                <div style={{ aspectRatio: '1/1', background: '#f5f5f5', overflow: 'hidden' }}>
                                                    {p.image_url
                                                        ? <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <svg width="32" height="32" fill="none" stroke="#ccc" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
                                                        </div>
                                                    }
                                                </div>
                                                <div style={{ padding: '8px 10px 10px' }}>
                                                    <p style={{ fontSize: 10, color: '#3a7d44', fontWeight: 600, marginBottom: 2 }}>Rekomendasi</p>
                                                    <p style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', marginBottom: 4, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</p>
                                                    <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>{fmt(p.price)}</p>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                                                        <span style={{ color: '#f59e0b', fontSize: 11 }}>★</span>
                                                        <span style={{ fontSize: 11, color: '#555' }}>{(3.8 + (p.product_id % 5) * 0.1).toFixed(1)}</span>
                                                        <span style={{ fontSize: 10, color: '#999' }}>• {p.product_id * 10 + 14} terjual</span>
                                                    </div>
                                                    <button onClick={() => addToCart(p.product_id)}
                                                        style={{ width: '100%', padding: '6px 0', background: '#f0faf2', border: '1px solid #c8eacd', borderRadius: 6, fontSize: 11, fontWeight: 700, color: '#3a7d44', cursor: 'pointer' }}>
                                                        + Keranjang
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT: Order Summary */}
                        <div style={{ position: 'sticky', top: 80 }}>
                            <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                                <h3 style={{ fontWeight: 800, fontSize: 18, color: '#1a1a1a', marginBottom: 20 }}>Ringkasan Order</h3>

                                {/* Total Diskon Highlight - Tampil jika ada promo valid */}
                                {promoPreview && promoPreview.discount_amount > 0 && (
                                    <div style={{ background: '#eafaf0', border: '1px solid #bbedcc', borderRadius: 12, padding: '16px', marginBottom: 24 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                            <svg width="20" height="20" fill="none" stroke="#3a7d44" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                                            <span style={{ fontSize: 14, fontWeight: 700, color: '#3a7d44' }}>Total Diskon & Hemat</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                            <span style={{ fontSize: 13, fontWeight: 700, color: '#333' }}>Total Hemat</span>
                                            <span style={{ fontSize: 16, fontWeight: 800, color: '#3a7d44' }}>-{fmt(promoPreview.discount_amount)}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Input Promo / Voucher */}
                                <div style={{ marginBottom: 24 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                        <span style={{ fontSize: 11, fontWeight: 700, color: '#888', letterSpacing: '0.5px' }}>GUNAKAN VOUCHER</span>
                                        {appliedPromo && (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: '#3a7d44' }}>
                                                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                Voucher Aktif
                                            </span>
                                        )}
                                    </div>

                                    {appliedPromo ? (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f5fff7', border: '1px solid #3a7d44', padding: '12px 16px', borderRadius: 10 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <svg width="20" height="20" fill="none" stroke="#3a7d44" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                                                <div>
                                                    <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333' }}>{appliedPromo.promo_name}</span>
                                                    <span style={{ fontSize: 11, color: '#3a7d44', fontWeight: 600 }}>Kode: {appliedPromo.promo_code}</span>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={handleRemovePromo}
                                                disabled={isApplyingPromo}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontWeight: 700, fontSize: 12 }}
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <input 
                                                type="text" 
                                                value={promoCodeInput}
                                                onChange={e => setPromoCodeInput(e.target.value.toUpperCase())}
                                                placeholder="Masukkan kode promo" 
                                                style={{ flex: 1, padding: '12px 14px', borderRadius: 10, border: '1px solid #ddd', fontSize: 13, textTransform: 'uppercase' }}
                                                onKeyDown={e => e.key === 'Enter' && handleApplyPromo()}
                                            />
                                            <button 
                                                onClick={handleApplyPromo}
                                                disabled={!promoCodeInput.trim() || isApplyingPromo}
                                                style={{ padding: '0 16px', background: promoCodeInput.trim() ? '#3a7d44' : '#e0e0e0', color: promoCodeInput.trim() ? '#fff' : '#999', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: promoCodeInput.trim() && !isApplyingPromo ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}
                                            >
                                                {isApplyingPromo ? '...' : 'Terapkan'}
                                            </button>
                                        </div>
                                    )}

                                    {promoError && (
                                        <p style={{ margin: '8px 0 0', fontSize: 12, color: '#ef4444', fontWeight: 500 }}>{promoError}</p>
                                    )}
                                    {promoSuccess && !promoError && (
                                        <p style={{ margin: '8px 0 0', fontSize: 12, color: '#3a7d44', fontWeight: 500 }}>{promoSuccess}</p>
                                    )}
                                </div>

                                <div style={{ borderTop: '1px dashed #ddd', marginBottom: 20 }}></div>

                                {/* Info rows */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: 14, color: '#666' }}>Subtotal ({totalItems} items)</span>
                                        <span style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>{fmt(subtotal)}</span>
                                    </div>
                                    
                                    {promoPreview && promoPreview.discount_amount > 0 && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: 14, color: '#3a7d44', fontWeight: 600 }}>Diskon</span>
                                            <span style={{ fontSize: 14, fontWeight: 700, color: '#3a7d44' }}>-{fmt(promoPreview.discount_amount)}</span>
                                        </div>
                                    )}
                                </div>

                                <div style={{ borderTop: '1px dashed #ddd', marginBottom: 20 }}></div>

                                {/* Total */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                                    <span style={{ fontSize: 16, fontWeight: 700, color: '#666' }}>Total</span>
                                    <span style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a' }}>
                                        {fmt(finalTotal)}
                                    </span>
                                </div>

                                {/* Checkout button */}
                                {hasOutOfStock && (
                                    <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, padding: '10px 14px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ fontSize: 16 }}>⚠️</span>
                                        <p style={{ margin: 0, fontSize: 12, color: '#dc2626', fontWeight: 600 }}>
                                            Ada barang yang stok habis. Hapus terlebih dahulu sebelum checkout.
                                        </p>
                                    </div>
                                )}
                                <button
                                    onClick={() => !hasOutOfStock && router.get(route('checkout.index'))}
                                    disabled={hasOutOfStock}
                                    style={{
                                        width: '100%', padding: '16px 0',
                                        background: hasOutOfStock ? '#d1d5db' : '#5cb85c',
                                        color: '#fff', border: 'none', borderRadius: 30,
                                        fontSize: 16, fontWeight: 800,
                                        cursor: hasOutOfStock ? 'not-allowed' : 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                        boxShadow: hasOutOfStock ? 'none' : '0 4px 14px rgba(92,184,92,0.3)',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={e => { if (!hasOutOfStock) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(92,184,92,0.4)'; }}}
                                    onMouseLeave={e => { if (!hasOutOfStock) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(92,184,92,0.3)'; }}}
                                >
                                    {hasOutOfStock ? 'Ada Stok Habis' : `Checkout (${totalItems})`}
                                    {!hasOutOfStock && <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
                                </button>

                                {/* Security badge */}
                                <div style={{ marginTop: 20, padding: '14px', background: '#f8faf9', borderRadius: 12, border: '1px solid #eef2ef', display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 36, height: 36, background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
                                        <svg width="18" height="18" fill="none" stroke="#3a7d44" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>Pembayaran Aman</p>
                                        <p style={{ margin: '2px 0 0', fontSize: 12, color: '#888' }}>100% jaminan produk asli.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
