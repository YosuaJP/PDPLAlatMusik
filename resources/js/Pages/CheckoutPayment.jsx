import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';

const fmt = (n) => 'Rp ' + Number(n).toLocaleString('id-ID');

export default function CheckoutPayment({ payment, clientKey, isSandbox }) {
    // 'idle' | 'opened' | 'closed' | 'processing' | 'done'
    const [snapState, setSnapState] = useState('idle');
    const [snapLoaded, setSnapLoaded] = useState(false);

    // Webhook cheat loading state
    const [isCheatLoading, setIsCheatLoading] = useState(false);
    const [cheatPercent, setCheatPercent] = useState(0);
    const [cheatText, setCheatText] = useState('');

    const snapUrl = isSandbox
        ? 'https://app.sandbox.midtrans.com/snap/snap.js'
        : 'https://app.midtrans.com/snap/snap.js';

    // Load Midtrans Snap.js script
    useEffect(() => {
        if (document.querySelector(`script[src="${snapUrl}"]`)) {
            setSnapLoaded(true);
            return;
        }
        const script = document.createElement('script');
        script.src = snapUrl;
        script.setAttribute('data-client-key', clientKey);
        script.onload = () => setSnapLoaded(true);
        document.head.appendChild(script);
    }, [snapUrl, clientKey]);

    // Open Midtrans Snap popup
    const openSnap = useCallback(() => {
        if (!snapLoaded || !payment.snap_token) return;
        setSnapState('opened');
        window.snap.pay(payment.snap_token, {
            onSuccess: () => {
                setSnapState('done');
                // Paksa update status dengan memanggil webhook manual
                // (karena webhook dari Midtrans ke localtunnel sering gagal/telat)
                executeCheatWebhook();
            },
            onPending: () => {
                setSnapState('closed');
            },
            onError: () => {
                setSnapState('closed');
            },
            onClose: () => {
                setSnapState('closed');
            },
        });
    }, [snapLoaded, payment.snap_token, payment.order.order_id]);

    // Mock Payment Success (Cheat) — animasi loading lalu tembak webhook
    const runCheat = () => {
        setIsCheatLoading(true);
        setCheatPercent(0);
        setCheatText('Menginisialisasi webhook...');

        let percent = 0;
        const interval = setInterval(() => {
            percent += 10;
            setCheatPercent(percent);
            if (percent === 20) setCheatText('Menyiapkan payload notifikasi asinkron...');
            else if (percent === 40) setCheatText('Memverifikasi status transaksi (SETTLEMENT) via API Sandbox...');
            else if (percent === 60) setCheatText('Menjalankan database transaction aman (lockForUpdate)...');
            else if (percent === 80) setCheatText('Memperbarui status pesanan menjadi PROCESSING & mencatat riwayat...');
            else if (percent >= 100) {
                clearInterval(interval);
                executeCheatWebhook();
            }
        }, 300);
    };

    const executeCheatWebhook = async () => {
        try {
            const payload = {
                order_id: payment.external_id,
                transaction_status: 'settlement',
                payment_type: 'qris',
                gross_amount: payment.amount.toString(),
            };
            await fetch(route('payment.webhook.midtrans'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(payload),
            });
            // Redirect ke dashboard setelah cheat berhasil
            router.visit(route('dashboard'));
        } catch {
            setIsCheatLoading(false);
        }
    };

    const isPaid = payment.payment_status === 'paid';
    const hasSnapToken = !!payment.snap_token;

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f5f5f5',
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            display: 'flex',
            flexDirection: 'column',
        }}>
            <Head title="Complete Your Payment — NadaKito" />

            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
                @keyframes spinCircle {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.6; }
                }
                .pay-btn-proceed {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    width: 100%;
                    padding: 16px;
                    background: #ef4444;
                    color: #fff;
                    border: none;
                    border-radius: 12px;
                    font-size: 15px;
                    font-weight: 700;
                    cursor: pointer;
                    font-family: inherit;
                    transition: all 0.2s ease;
                    box-shadow: 0 6px 20px rgba(239,68,68,0.3);
                }
                .pay-btn-proceed:hover:not(:disabled) {
                    background: #dc2626;
                    transform: translateY(-1px);
                    box-shadow: 0 8px 24px rgba(239,68,68,0.4);
                }
                .pay-btn-proceed:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                .pay-btn-resume {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    width: 100%;
                    padding: 16px;
                    background: #16a34a;
                    color: #fff;
                    border: none;
                    border-radius: 12px;
                    font-size: 15px;
                    font-weight: 700;
                    cursor: pointer;
                    font-family: inherit;
                    transition: all 0.2s ease;
                    box-shadow: 0 6px 20px rgba(22,163,74,0.3);
                }
                .pay-btn-resume:hover {
                    background: #15803d;
                    transform: translateY(-1px);
                }
                .pay-btn-change {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    width: 100%;
                    padding: 14px;
                    background: #2563eb;
                    color: #fff;
                    border: none;
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: 700;
                    cursor: pointer;
                    font-family: inherit;
                    transition: all 0.2s ease;
                    box-shadow: 0 6px 20px rgba(37,99,235,0.25);
                }
                .pay-btn-change:hover {
                    background: #1d4ed8;
                    transform: translateY(-1px);
                }
                .pay-btn-later {
                    display: block;
                    width: 100%;
                    padding: 12px;
                    background: transparent;
                    color: #6b7280;
                    border: 1.5px solid #e5e7eb;
                    border-radius: 12px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    font-family: inherit;
                    text-align: center;
                    transition: all 0.2s ease;
                    text-decoration: none;
                }
                .pay-btn-later:hover {
                    background: #f9fafb;
                    border-color: #d1d5db;
                    color: #374151;
                }
                .cheat-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    width: 100%;
                    padding: 11px;
                    background: rgba(251, 191, 36, 0.08);
                    color: #d97706;
                    border: 1.5px solid rgba(251,191,36,0.35);
                    border-radius: 10px;
                    font-size: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    font-family: inherit;
                    transition: all 0.2s ease;
                }
                .cheat-btn:hover {
                    background: rgba(251,191,36,0.15);
                    border-color: rgba(251,191,36,0.5);
                }
            `}} />

            {/* Cheat Loading Overlay */}
            {isCheatLoading && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(15, 23, 42, 0.96)',
                    backdropFilter: 'blur(12px)',
                    zIndex: 9999,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    animation: 'fadeIn 0.3s ease',
                }}>
                    <div style={{ width: 90, height: 90, position: 'relative', marginBottom: 28 }}>
                        <div style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                            border: '5px solid rgba(59,130,246,0.15)', borderTopColor: '#38bdf8',
                            borderRadius: '50%', animation: 'spinCircle 1s linear infinite',
                        }} />
                        <div style={{ fontSize: 36, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>✅</div>
                    </div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: 22, fontWeight: 900, color: '#f1f5f9' }}>
                        Memproses Konfirmasi Pembayaran...
                    </h3>
                    <p style={{ margin: '0 0 32px 0', fontSize: 14, color: '#94a3b8', maxWidth: 440, lineHeight: 1.7, textAlign: 'center' }}>
                        Midtrans (Sandbox) mengirimkan notifikasi webhook ke server NadaKito. Status pesanan sedang diperbarui secara aman.
                    </p>
                    <div style={{ width: 400, maxWidth: '90%', height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden', marginBottom: 14 }}>
                        <div style={{ height: '100%', width: `${cheatPercent}%`, background: 'linear-gradient(90deg,#3b82f6,#06b6d4)', borderRadius: 4, transition: 'width 0.3s ease-out' }} />
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: '#cbd5e1', fontWeight: 600, fontStyle: 'italic' }}>{cheatText}</p>
                </div>
            )}

            {/* Toast notification when popup is closed */}
            {snapState === 'closed' && (
                <div style={{
                    position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
                    background: '#1f2937', color: '#f9fafb',
                    padding: '12px 20px', borderRadius: 12,
                    fontSize: 13, fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 8,
                    zIndex: 1000, animation: 'slideUp 0.3s ease',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                    whiteSpace: 'nowrap',
                }}>
                    <span style={{ fontSize: 16 }}>ℹ️</span>
                    Payment window closed. Please select an option below.
                </div>
            )}

            {/* Main content — centered card */}
            <div style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '40px 16px',
            }}>
                <div style={{
                    width: '100%', maxWidth: 460,
                    background: '#fff',
                    borderRadius: 20,
                    boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
                    overflow: 'hidden',
                    animation: 'fadeIn 0.4s ease',
                }}>
                    {/* Card Header */}
                    <div style={{ padding: '32px 32px 24px', textAlign: 'center', borderBottom: '1px solid #f3f4f6' }}>
                        <div style={{
                            width: 52, height: 52, background: 'linear-gradient(135deg,#dbeafe,#eff6ff)',
                            borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px', fontSize: 24,
                        }}>💳</div>
                        <h1 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 900, color: '#111827' }}>
                            Complete Your Payment
                        </h1>
                        <p style={{ margin: 0, fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>
                            Please complete your transaction to secure your order.<br />Do not refresh this page while processing.
                        </p>
                    </div>

                    {/* Transaction Details */}
                    <div style={{ padding: '20px 32px', borderBottom: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>Transaction ID</span>
                            <span style={{
                                fontSize: 12, fontWeight: 700, color: '#374151',
                                background: '#f3f4f6', padding: '4px 10px', borderRadius: 6,
                                fontFamily: 'monospace', letterSpacing: '0.3px',
                            }}>{payment.external_id}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>Status</span>
                            <span style={{
                                fontSize: 11, fontWeight: 800, letterSpacing: '0.8px',
                                background: isPaid ? '#dcfce7' : '#fef3c7',
                                color: isPaid ? '#15803d' : '#b45309',
                                padding: '4px 10px', borderRadius: 6,
                            }}>{isPaid ? 'PAID' : 'PENDING'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>Total Amount</span>
                            <span style={{ fontSize: 20, fontWeight: 900, color: '#ef4444' }}>{fmt(payment.amount)}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {!isPaid && (
                        <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {/* State: idle → Proceed to Payment */}
                            {(snapState === 'idle' || snapState === 'opened') && (
                                <button
                                    className="pay-btn-proceed"
                                    onClick={openSnap}
                                    disabled={!snapLoaded || snapState === 'opened'}
                                >
                                    {snapState === 'opened' ? (
                                        <>
                                            <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spinCircle 0.8s linear infinite' }} />
                                            Opening Payment...
                                        </>
                                    ) : !snapLoaded ? (
                                        'Memuat...'
                                    ) : hasSnapToken ? (
                                        <>
                                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            Proceed to Payment
                                        </>
                                    ) : (
                                        <a href={payment.payment_url} style={{ color: '#fff', textDecoration: 'none' }}>Proceed to Payment</a>
                                    )}
                                </button>
                            )}

                            {/* State: closed → Resume + Change */}
                            {snapState === 'closed' && (
                                <>
                                    <button className="pay-btn-resume" onClick={openSnap}>
                                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Resume Payment
                                    </button>
                                    <button className="pay-btn-change" onClick={() => setSnapState('idle')}>
                                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                        </svg>
                                        Change Payment Method
                                    </button>
                                </>
                            )}

                            {/* Pay Later */}
                            <Link href={route('dashboard')} className="pay-btn-later">
                                Return to Dashboard (Pay Later)
                            </Link>

                            {/* Developer Tools */}
                            <div style={{ marginTop: 8, borderTop: '1px dashed #e5e7eb', paddingTop: 16 }}>
                                <p style={{ margin: '0 0 10px', fontSize: 10, fontWeight: 800, color: '#9ca3af', textAlign: 'center', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                    Developer Tools
                                </p>
                                <button className="cheat-btn" onClick={runCheat}>
                                    <span>⚡</span>
                                    Mock Payment Success (Cheat)
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Already paid state */}
                    {isPaid && (
                        <div style={{ padding: '24px 32px', textAlign: 'center' }}>
                            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                            <p style={{ fontSize: 15, fontWeight: 700, color: '#16a34a', marginBottom: 4 }}>Pembayaran Berhasil!</p>
                            <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>Pesanan Anda sedang diproses.</p>
                            <Link href={route('orders.show', payment.order.order_id)} style={{
                                display: 'inline-block', padding: '12px 28px',
                                background: '#16a34a', color: '#fff',
                                borderRadius: 12, fontWeight: 700, fontSize: 14,
                                textDecoration: 'none',
                            }}>
                                Lihat Detail Pesanan →
                            </Link>
                        </div>
                    )}

                    {/* Footer */}
                    <div style={{ padding: '12px 32px 20px', textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: 11, color: '#d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Secured by Midtrans{isSandbox ? ' (Sandbox)' : ''} · NadaKito
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
