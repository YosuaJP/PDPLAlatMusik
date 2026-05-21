import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function SimulatePayment({ payment }) {
    const [isProcessing, setIsProcessing] = useState(false);

    const fmt = (n) => 'Rp ' + Number(n).toLocaleString('id-ID');

    const handleProcess = (status) => {
        setIsProcessing(true);
        router.post(route('payment.process', payment.external_id), {
            status: status
        }, {
            onFinish: () => setIsProcessing(false)
        });
    };

    return (
        <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f8fafc', fontFamily: "'Inter','Segoe UI',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <Head title="Xendit Payment Simulator — NadaKito" />

            <div style={{ width: '100%', maxWidth: 520, background: '#1e293b', borderRadius: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.5)', overflow: 'hidden', border: '1px solid #334155' }}>
                
                {/* Header */}
                <div style={{ background: 'linear-gradient(135deg, #1e40af, #3b82f6)', padding: '24px 30px', textAlign: 'center', position: 'relative' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: 20, fontSize: 11, fontWeight: 700, color: '#bfdbfe', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>
                        🛡️ Secure Sandbox Mode
                    </div>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#fff' }}>Xendit Simulator</h1>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#93c5fd' }}>Simulasi Pembayaran Alat Musik NadaKito</p>
                </div>

                {/* Body Content */}
                <div style={{ padding: '30px 30px 24px' }}>
                    
                    {/* Invoice Info */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: 16, marginBottom: 20 }}>
                        <div>
                            <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>ID TAGIHAN (EXTERNAL ID)</p>
                            <p style={{ margin: '2px 0 0', fontSize: 15, fontWeight: 700, color: '#f8fafc' }}>{payment.external_id}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>PELANGGAN</p>
                            <p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{payment.order.user_name}</p>
                        </div>
                    </div>

                    {/* Ringkasan Item */}
                    <div style={{ background: '#0f172a', borderRadius: 12, padding: 16, marginBottom: 24 }}>
                        <p style={{ margin: '0 0 10px 0', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Daftar Pembelian</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {payment.order.items.map((item, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#cbd5e1' }}>
                                    <span style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: '75%' }}>
                                        {item.product_name} <span style={{ color: '#64748b' }}>(x{item.quantity})</span>
                                    </span>
                                    <span style={{ fontWeight: 600 }}>{fmt(item.price_each * item.quantity)}</span>
                                </div>
                            ))}
                        </div>
                        
                        {/* Ongkos kirim / Diskon */}
                        <div style={{ borderTop: '1px dashed #334155', marginTop: 10, paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: '#94a3b8' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Ongkir</span>
                                <span>{fmt(payment.order.shipping_cost)}</span>
                            </div>
                            {payment.order.discount_amount > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                                    <span>Diskon Promo</span>
                                    <span>-{fmt(payment.order.discount_amount)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Total Amount Box */}
                    <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 14, padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                        <div>
                            <span style={{ fontSize: 12, color: '#93c5fd', fontWeight: 600 }}>TOTAL TAGIHAN</span>
                            <h2 style={{ margin: '2px 0 0', fontSize: 24, fontWeight: 900, color: '#3b82f6' }}>{fmt(payment.amount)}</h2>
                        </div>
                        <span style={{ fontSize: 11, background: '#1e3a8a', color: '#60a5fa', padding: '4px 10px', borderRadius: 20, fontWeight: 700 }}>PENDING PAYMENT</span>
                    </div>

                    {/* Simulator Action Panel */}
                    <div style={{ borderTop: '1px solid #334155', paddingTop: 24 }}>
                        <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 10, padding: 14, fontSize: 12, color: '#f59e0b', lineHeight: 1.5, marginBottom: 20, textAlign: 'center' }}>
                            ⚠️ <strong>Pemberitahuan:</strong> Rute ini mensimulasikan webhook respons Xendit di backend secara real-time. Memilih salah satu tombol di bawah akan mengeksekusi DB Transaction.
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <button
                                onClick={() => handleProcess('paid')}
                                disabled={isProcessing}
                                style={{
                                    width: '100%',
                                    padding: '14px 0',
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 10,
                                    fontSize: 14,
                                    fontWeight: 700,
                                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 4px 14px rgba(16,185,129,0.35)',
                                    transition: 'all 0.15s',
                                    opacity: isProcessing ? 0.7 : 1
                                }}
                            >
                                {isProcessing ? 'Memproses...' : 'Simulasikan Pembayaran BERHASIL (Lunas)'}
                            </button>

                            <button
                                onClick={() => handleProcess('failed')}
                                disabled={isProcessing}
                                style={{
                                    width: '100%',
                                    padding: '12px 0',
                                    background: '#334155',
                                    color: '#f1f5f9',
                                    border: '1.5px solid #475569',
                                    borderRadius: 10,
                                    fontSize: 13,
                                    fontWeight: 700,
                                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.15s',
                                    opacity: isProcessing ? 0.7 : 1
                                }}
                                onMouseEnter={e => { if(!isProcessing) e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#fca5a5'; }}
                                onMouseLeave={e => { if(!isProcessing) e.currentTarget.style.borderColor = '#475569'; e.currentTarget.style.color = '#f1f5f9'; }}
                            >
                                {isProcessing ? 'Memproses...' : 'Simulasikan Pembayaran GAGAL (Batalkan & Balikkan Stok)'}
                            </button>
                        </div>
                    </div>

                </div>

                {/* Footer brand */}
                <div style={{ background: '#0f172a', padding: '16px 20px', textAlign: 'center', fontSize: 11, color: '#475569', borderTop: '1px solid #1e293b' }}>
                    Secured by <strong>Xendit Sandbox API</strong> integration — NadaKito
                </div>

            </div>
        </div>
    );
}
