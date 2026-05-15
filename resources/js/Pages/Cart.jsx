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
                <Link href={route('cart.index')} style={{ position: 'relative', color: '#3a7d44', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
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

export default function Cart({ cartItems: initialItems, recommended, cartId }) {
    const { props } = usePage();
    const auth = props.auth;
    const cartCount = props.cartCount ?? 0;

    const [items, setItems] = useState(initialItems ?? []);

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

    const subtotal = items.reduce((sum, i) => sum + (i.price_each * i.quantity), 0);
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

    const fmt = (n) => 'Rp ' + Number(n).toLocaleString('id-ID');

    return (
        <div style={{ minHeight: '100vh', background: '#f2f3f0', fontFamily: "'Inter','Segoe UI',sans-serif" }}>
            <Head title="Keranjang — NadaKito" />
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
                            {items.map((item, idx) => (
                                <div key={item.cart_item_id} style={{
                                    background: '#fff',
                                    borderBottom: idx < items.length - 1 ? '1px solid #f5f5f5' : 'none',
                                    borderRadius: idx === items.length - 1 ? '0 0 12px 12px' : 0,
                                    padding: '16px 20px',
                                    display: 'grid',
                                    gridTemplateColumns: '2fr 1fr 1fr 1fr 40px',
                                    gap: 12,
                                    alignItems: 'center',
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
                                            <span style={{ fontSize: 11, color: '#3a7d44', fontWeight: 600 }}>
                                                {(item.product?.stock_qty ?? 0) > 0 ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 600, color: '#333' }}>
                                        {fmt(item.price_each)}
                                    </div>

                                    {/* Qty Controls */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                        <button onClick={() => updateQty(item.cart_item_id, item.quantity - 1)}
                                            style={{ width: 28, height: 28, borderRadius: 6, border: '1.5px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontWeight: 700 }}>
                                            −
                                        </button>
                                        <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 700, fontSize: 14 }}>{item.quantity}</span>
                                        <button onClick={() => updateQty(item.cart_item_id, item.quantity + 1)}
                                            style={{ width: 28, height: 28, borderRadius: 6, border: '1.5px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontWeight: 700 }}>
                                            +
                                        </button>
                                    </div>

                                    {/* Total */}
                                    <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>
                                        {fmt(item.price_each * item.quantity)}
                                    </div>

                                    {/* Delete */}
                                    <button onClick={() => removeItem(item.cart_item_id)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4, borderRadius: 6, transition: 'color 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                                        onMouseLeave={e => e.currentTarget.style.color = '#bbb'}>
                                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            ))}

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
                            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
                                <h3 style={{ fontWeight: 800, fontSize: 16, color: '#1a1a1a', marginBottom: 16 }}>Ringkasan Order</h3>

                                {/* Info rows */}
                                <div style={{ background: '#f0faf2', border: '1px solid #c8eacd', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <p style={{ fontSize: 12, fontWeight: 700, color: '#3a7d44', margin: 0 }}>Total Produk</p>
                                            <p style={{ fontSize: 11, color: '#666', margin: '2px 0 0' }}>{totalItems} item dalam keranjang</p>
                                        </div>
                                        <svg width="20" height="20" fill="none" stroke="#3a7d44" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17" /></svg>
                                    </div>
                                </div>

                                {/* Price breakdown */}
                                <div style={{ borderTop: '1px dashed #eee', paddingTop: 14, marginBottom: 14 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <span style={{ fontSize: 13, color: '#666' }}>Subtotal ({totalItems} items)</span>
                                        <span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>{fmt(subtotal)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <span style={{ fontSize: 13, color: '#666' }}>Ongkos Kirim</span>
                                        <span style={{ fontSize: 13, fontWeight: 600, color: subtotal >= 200000 ? '#3a7d44' : '#333' }}>
                                            {subtotal >= 200000 ? 'GRATIS' : fmt(15000)}
                                        </span>
                                    </div>
                                </div>

                                {/* Total */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #f0f0f0', paddingTop: 14, marginBottom: 18 }}>
                                    <span style={{ fontSize: 15, fontWeight: 800, color: '#1a1a1a' }}>Total</span>
                                    <span style={{ fontSize: 18, fontWeight: 800, color: '#1a1a1a' }}>
                                        {fmt(subtotal >= 200000 ? subtotal : subtotal + 15000)}
                                    </span>
                                </div>

                                {/* Checkout button */}
                                <button style={{
                                    width: '100%', padding: '14px 0',
                                    background: 'linear-gradient(135deg,#2d6e3e,#3a7d44)',
                                    color: '#fff', border: 'none', borderRadius: 28,
                                    fontSize: 15, fontWeight: 800, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                    boxShadow: '0 4px 12px rgba(58,125,68,0.35)',
                                    transition: 'opacity 0.15s',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = '0.92'}
                                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                >
                                    Checkout ({totalItems})
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </button>

                                {/* Security badge */}
                                <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#888', fontSize: 12 }}>
                                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                    Pembayaran Aman — 100% jaminan produk asli
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
