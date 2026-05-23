import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function SimulatePayment({ payment }) {
    const isMidtrans = payment.payment_method === 'midtrans';

    // Current active menu item in the simulator
    // Options: 'bca', 'bri', 'bni', 'permata', 'cimb', 'mandiri', 'danamon', 'bsi', 'seabank', 'saqu', 'qris', 'deeplink', 'introduction'
    const [activeMenu, setActiveMenu] = useState(isMidtrans ? 'bca' : 'xendit');
    
    // Core state controls
    const [inputValue, setInputValue] = useState('');
    const [isSearched, setIsSearched] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [progressPercent, setProgressPercent] = useState(0);
    const [progressMessage, setProgressMessage] = useState('Menginisialisasi webhook...');
    const [isSuccessPayment, setIsSuccessPayment] = useState(false);

    // Xendit specific states
    const [xenditStep, setXenditStep] = useState(2); // directly to payment panel

    const fmt = (n) => 'Rp ' + Number(n).toLocaleString('id-ID');
    const orderIdPadded = String(payment.order.order_id).padStart(8, '0');

    // Helper to get payment details based on selected simulator method
    const getSimulatorConfig = (menu) => {
        switch (menu) {
            case 'bca':
                return {
                    bankName: 'BCA',
                    title: 'BCA Virtual Account',
                    label: 'Virtual Account Number',
                    expectedValue: `98123${orderIdPadded}`,
                    logoText: 'BCA',
                    logoBg: '#0060af',
                    logoColor: '#fff',
                    instructions: 'Masukkan nomor BCA Virtual Account sandbox yang diberikan pada Snap popup di NadaKito.',
                    simulatorUrl: 'https://simulator.sandbox.midtrans.com/bca/va/index'
                };
            case 'bri':
                return {
                    bankName: 'BRI',
                    title: 'BRI Virtual Account',
                    label: 'Virtual Account Number',
                    expectedValue: `88788${orderIdPadded}`,
                    logoText: 'BRI',
                    logoBg: '#00529c',
                    logoColor: '#fff',
                    instructions: 'Masukkan nomor BRI Virtual Account sandbox yang diberikan pada Snap popup di NadaKito.',
                    simulatorUrl: 'https://simulator.sandbox.midtrans.com/bri/va/index'
                };
            case 'bni':
                return {
                    bankName: 'BNI',
                    title: 'BNI Virtual Account',
                    label: 'Virtual Account Number',
                    expectedValue: `8578${orderIdPadded}`,
                    logoText: 'BNI',
                    logoBg: '#f15a23',
                    logoColor: '#fff',
                    instructions: 'Masukkan nomor BNI Virtual Account sandbox yang diberikan pada Snap popup di NadaKito.',
                    simulatorUrl: 'https://simulator.sandbox.midtrans.com/bni/va/index'
                };
            case 'permata':
                return {
                    bankName: 'Permata',
                    title: 'Permata Virtual Account',
                    label: 'Virtual Account Number',
                    expectedValue: `8778${orderIdPadded}`,
                    logoText: 'Permata',
                    logoBg: '#8cc63f',
                    logoColor: '#004c1f',
                    instructions: 'Masukkan nomor Permata Virtual Account sandbox yang diberikan pada Snap popup di NadaKito.',
                    simulatorUrl: 'https://simulator.sandbox.midtrans.com/permata/va/index'
                };
            case 'cimb':
                return {
                    bankName: 'CIMB Niaga',
                    title: 'CIMB Virtual Account',
                    label: 'Virtual Account Number',
                    expectedValue: `99901${orderIdPadded}`,
                    logoText: 'CIMB',
                    logoBg: '#e60000',
                    logoColor: '#fff',
                    instructions: 'Masukkan nomor CIMB Virtual Account sandbox yang diberikan pada Snap popup di NadaKito.',
                    simulatorUrl: 'https://simulator.sandbox.midtrans.com/cimb/va/index'
                };
            case 'mandiri':
                return {
                    bankName: 'Mandiri',
                    title: 'Mandiri Bill Payment',
                    label: 'Bill Key / VA Number',
                    expectedValue: `88012${orderIdPadded}`,
                    logoText: 'Mandiri',
                    logoBg: '#1c3f94',
                    logoColor: '#fff',
                    instructions: 'Masukkan nomor Mandiri Bill Key / VA Number sandbox yang diberikan pada Snap popup di NadaKito.',
                    simulatorUrl: 'https://simulator.sandbox.midtrans.com/mandiri/bill/index'
                };
            case 'danamon':
                return {
                    bankName: 'Danamon',
                    title: 'Danamon Virtual Account',
                    label: 'Virtual Account Number',
                    expectedValue: `99902${orderIdPadded}`,
                    logoText: 'Danamon',
                    logoBg: '#ff6600',
                    logoColor: '#fff',
                    instructions: 'Masukkan nomor Danamon Virtual Account sandbox yang diberikan pada Snap popup di NadaKito.',
                    simulatorUrl: 'https://simulator.sandbox.midtrans.com/danamon/va/index'
                };
            case 'bsi':
                return {
                    bankName: 'BSI',
                    title: 'BSI Virtual Account',
                    label: 'Virtual Account Number',
                    expectedValue: `99903${orderIdPadded}`,
                    logoText: 'BSI',
                    logoBg: '#008b8b',
                    logoColor: '#fff',
                    instructions: 'Masukkan nomor BSI Virtual Account sandbox yang diberikan pada Snap popup di NadaKito.',
                    simulatorUrl: 'https://simulator.sandbox.midtrans.com/bsi/va/index'
                };
            case 'seabank':
                return {
                    bankName: 'SeaBank',
                    title: 'SeaBank Virtual Account',
                    label: 'Virtual Account Number',
                    expectedValue: `99904${orderIdPadded}`,
                    logoText: 'SeaBank',
                    logoBg: '#ff4500',
                    logoColor: '#fff',
                    instructions: 'Masukkan nomor SeaBank Virtual Account sandbox yang diberikan pada Snap popup di NadaKito.',
                    simulatorUrl: 'https://simulator.sandbox.midtrans.com/seabank/va/index'
                };
            case 'saqu':
                return {
                    bankName: 'Bank Saqu',
                    title: 'Bank Saqu Virtual Account',
                    label: 'Virtual Account Number',
                    expectedValue: `99905${orderIdPadded}`,
                    logoText: 'Saqu',
                    logoBg: '#6a0dad',
                    logoColor: '#fff',
                    instructions: 'Masukkan nomor Bank Saqu Virtual Account sandbox yang diberikan pada Snap popup di NadaKito.',
                    simulatorUrl: 'https://simulator.sandbox.midtrans.com/saqu/va/index'
                };
            case 'qris':
                return {
                    bankName: 'QRIS',
                    title: 'QRIS (Gopay / ShopeePay)',
                    label: 'Reference / Transaction ID',
                    expectedValue: `REF-${orderIdPadded}`,
                    logoText: 'QRIS',
                    logoBg: '#334155',
                    logoColor: '#fff',
                    instructions: 'Masukkan Kode Reference / Transaction ID sandbox yang tertera di layar checkout NadaKito.',
                    simulatorUrl: 'https://simulator.sandbox.midtrans.com/gopay/partner/index'
                };
            case 'alfamart':
                return {
                    bankName: 'Alfamart',
                    title: 'Alfamart Convenience Store',
                    label: 'Payment Code',
                    expectedValue: `11103${orderIdPadded}`,
                    logoText: 'ALFA',
                    logoBg: '#d9251c',
                    logoColor: '#fff',
                    instructions: 'Masukkan Kode Pembayaran Alfamart sandbox yang diberikan pada Snap popup di NadaKito.',
                    simulatorUrl: 'https://simulator.sandbox.midtrans.com/alfamart/index'
                };
            case 'indomaret':
                return {
                    bankName: 'Indomaret',
                    title: 'Indomaret Convenience Store',
                    label: 'Payment Code',
                    expectedValue: `22203${orderIdPadded}`,
                    logoText: 'INDO',
                    logoBg: '#0055a5',
                    logoColor: '#fbc02d',
                    instructions: 'Masukkan Kode Pembayaran Indomaret sandbox yang diberikan pada Snap popup di NadaKito.',
                    simulatorUrl: 'https://simulator.sandbox.midtrans.com/indomaret/index'
                };
            case 'kredivo':
                return {
                    bankName: 'Kredivo',
                    title: 'Kredivo Cardless Credit',
                    label: 'Transaction ID / Phone Number',
                    expectedValue: `33303${orderIdPadded}`,
                    logoText: 'KRED',
                    logoBg: '#ff5a00',
                    logoColor: '#fff',
                    instructions: 'Masukkan nomor telepon atau Kode Transaksi Kredivo sandbox yang diberikan pada Snap popup di NadaKito.',
                    simulatorUrl: 'https://simulator.sandbox.midtrans.com/kredivo/index'
                };
            case 'akulaku':
                return {
                    bankName: 'Akulaku',
                    title: 'Akulaku Cardless Credit',
                    label: 'Transaction ID / Phone Number',
                    expectedValue: `44403${orderIdPadded}`,
                    logoText: 'AKUL',
                    logoBg: '#e60012',
                    logoColor: '#fff',
                    instructions: 'Masukkan nomor telepon atau Kode Transaksi Akulaku sandbox yang diberikan pada Snap popup di NadaKito.',
                    simulatorUrl: 'https://simulator.sandbox.midtrans.com/akulaku/index'
                };
            default:
                return {
                    bankName: 'BCA',
                    title: 'BCA Virtual Account',
                    label: 'Virtual Account Number',
                    expectedValue: `98123${orderIdPadded}`,
                    logoText: 'BCA',
                    logoBg: '#0060af',
                    logoColor: '#fff',
                    instructions: 'Masukkan nomor BCA Virtual Account sandbox yang diberikan pada Snap popup di NadaKito.',
                    simulatorUrl: 'https://simulator.sandbox.midtrans.com/bca/va/index'
                };
        }
    };

    const currentConfig = getSimulatorConfig(activeMenu);

    // Reset input search states when menu changes
    useEffect(() => {
        setInputValue('');
        setIsSearched(false);
        setSearchError('');
    }, [activeMenu]);

    // Handle Inquiry click
    const handleInquire = () => {
        if (!inputValue.trim()) {
            setSearchError('Virtual Account / Reference ID cannot be empty.');
            return;
        }

        // Standardize input comparison (remove spaces/dashes if any)
        const cleanInput = inputValue.replace(/[\s-]/g, '').toLowerCase();
        const cleanExpected = currentConfig.expectedValue.replace(/[\s-]/g, '').toLowerCase();

        if (cleanInput === cleanExpected) {
            setIsSearched(true);
            setSearchError('');
        } else {
            setSearchError(`Virtual Account / Reference ID not found. Tip: Gunakan kredensial di panel kanan.`);
            setIsSearched(false);
        }
    };

    // Auto-fill input for quick sandbox testing
    const handleQuickFill = () => {
        setInputValue(currentConfig.expectedValue);
        setSearchError('');
    };

    // Simulated Webhook Submission Loader
    const runBackendSubmission = (status) => {
        setXenditStep(3); // Go to step 3 loading
        setIsProcessing(true);
        setIsSuccessPayment(status === 'paid');
        
        let percent = 0;
        const interval = setInterval(() => {
            percent += 10;
            setProgressPercent(percent);
            
            if (percent === 20) {
                setProgressMessage('Menyiapkan payload notifikasi asinkron...');
            } else if (percent === 40) {
                setProgressMessage(status === 'paid' 
                    ? 'Memverifikasi status transaksi (SETTLEMENT) via API Sandbox...' 
                    : 'Mengirimkan notifikasi kegagalan transaksi (EXPIRED)...'
                );
            } else if (percent === 60) {
                setProgressMessage('Menjalankan database transaction aman (lockForUpdate)...');
            } else if (percent === 80) {
                setProgressMessage(status === 'paid' 
                    ? 'Memperbarui status pesanan menjadi PROCESSING & mencatat riwayat...' 
                    : 'Mengembalikan stok produk & mencatat mutasi pengembalian...'
                );
            } else if (percent === 100) {
                clearInterval(interval);
                // Perform Inertia POST submit
                router.post(route('payment.process', payment.external_id), {
                    status: status
                }, {
                    onFinish: () => setIsProcessing(false)
                });
            }
        }, 200);
    };

    // Return to the order page
    const handleCancelOrder = () => {
        runBackendSubmission('failed');
    };

    // Xendit Simulator Fallback View
    if (!isMidtrans) {
        return (
            <div style={{ 
                minHeight: '100vh', 
                background: 'radial-gradient(circle at top right, #0f172a, #020617)', 
                color: '#f8fafc', 
                fontFamily: "'Outfit', 'Inter', 'Segoe UI', sans-serif", 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                padding: 20 
            }}>
                <Head title="Xendit Invoice Simulator — NadaKito" />
                
                {/* Embedded global styles */}
                <style dangerouslySetInnerHTML={{__html: `
                    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
                    .premium-card {
                        backdrop-filter: blur(16px);
                        background: rgba(30, 41, 59, 0.7);
                        border: 1px solid rgba(255, 255, 255, 0.08);
                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1);
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                    .hover-scale {
                        transition: all 0.2s ease-in-out;
                    }
                    .hover-scale:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 20px rgba(59, 130, 246, 0.2);
                        border-color: rgba(59, 130, 246, 0.4) !important;
                    }
                `}} />

                <div className="premium-card" style={{ width: '100%', maxWidth: 500, borderRadius: 24, overflow: 'hidden' }}>
                    {xenditStep !== 3 ? (
                        <>
                            {/* Header */}
                            <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a8a)', padding: '28px 30px', textAlign: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(59, 130, 246, 0.2)', padding: '6px 14px', borderRadius: 20, fontSize: 11, fontWeight: 700, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 12, border: '1px solid rgba(59,130,246,0.3)' }}>
                                    🛡️ Xendit Sandbox Mode
                                </div>
                                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>Xendit Invoice Simulator</h1>
                                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94a3b8' }}>Simulasi Pembayaran Terintegrasi — NadaKito</p>
                            </div>

                            {/* Body */}
                            <div style={{ padding: '30px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 16, marginBottom: 20 }}>
                                    <div>
                                        <p style={{ margin: 0, fontSize: 11, color: '#64748b', fontWeight: 600, letterSpacing: '0.5px' }}>KODE INVOICE</p>
                                        <p style={{ margin: '2px 0 0', fontSize: 15, fontWeight: 800, color: '#f8fafc' }}>{payment.external_id}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ margin: 0, fontSize: 11, color: '#64748b', fontWeight: 600, letterSpacing: '0.5px' }}>CUSTOMER</p>
                                        <p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>{payment.order.user_name}</p>
                                    </div>
                                </div>

                                <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 16, padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                                    <div>
                                        <span style={{ fontSize: 11, color: '#60a5fa', fontWeight: 700, letterSpacing: '0.5px' }}>TOTAL TAGIHAN LUNAS</span>
                                        <h2 style={{ margin: '2px 0 0', fontSize: 26, fontWeight: 900, color: '#93c5fd' }}>{fmt(payment.amount)}</h2>
                                    </div>
                                    <span style={{ fontSize: 10, background: '#1e293b', color: '#94a3b8', padding: '6px 12px', borderRadius: 20, fontWeight: 800, border: '1px solid rgba(255,255,255,0.05)' }}>
                                        PENDING
                                    </span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <button
                                        onClick={() => runBackendSubmission('paid')}
                                        disabled={isProcessing}
                                        style={{
                                            width: '100%',
                                            padding: '16px 0',
                                            background: 'linear-gradient(135deg, #10b981, #059669)',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: 12,
                                            fontSize: 14,
                                            fontWeight: 800,
                                            cursor: 'pointer',
                                            boxShadow: '0 6px 20px rgba(16, 185, 129, 0.35)',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        Simulasikan Bayar SEKARANG (Lunas)
                                    </button>

                                    <button
                                        onClick={() => runBackendSubmission('failed')}
                                        disabled={isProcessing}
                                        style={{
                                            width: '100%',
                                            padding: '12px 0',
                                            background: '#1e1b4b',
                                            color: '#f87171',
                                            border: '1px solid rgba(248,113,113,0.2)',
                                            borderRadius: 10,
                                            fontSize: 12,
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        ❌ Simulasikan GAGAL / EXPIRED (Balikkan Stok)
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Webhook Loader screen */
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '40px 30px' }}>
                            <div style={{ width: 80, height: 80, position: 'relative', marginBottom: 24 }}>
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                    border: '4px solid rgba(59,130,246,0.1)', borderTopColor: '#38bdf8',
                                    borderRadius: '50%', animation: 'spinCircle 1s linear infinite'
                                }} />
                                <div style={{ fontSize: 32, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>💾</div>
                            </div>
                            <h3 style={{ margin: '0 0 8px 0', fontSize: 18, color: '#f8fafc', fontWeight: 800 }}>Memproses Webhook Otorisasi</h3>
                            <p style={{ margin: '0 0 24px 0', fontSize: 13, color: '#94a3b8' }}>Mengamankan database transaction & pencatatan riwayat...</p>
                            <div style={{ width: '100%', height: 8, background: '#0f172a', borderRadius: 4, overflow: 'hidden', marginBottom: 14 }}>
                                <div style={{ height: '100%', width: `${progressPercent}%`, background: 'linear-gradient(90deg, #38bdf8, #93c5fd)', borderRadius: 4, transition: 'width 0.2s ease-out' }} />
                            </div>
                            <p style={{ margin: 0, fontSize: 12, color: '#e2e8f0', fontWeight: 600, fontStyle: 'italic' }}>{progressMessage}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Midtrans Sandbox Simulator View (Recreation of official simulator interface)
    return (
        <div style={{ 
            minHeight: '100vh', 
            background: '#ffffff', 
            color: '#334155', 
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", 
            display: 'flex', 
            flexDirection: 'column'
        }}>
            <Head title="Midtrans Payment Simulator - BCA VA" />

            {/* Embedded styles for simulator animations and custom states */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes spinCircle {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .nav-item {
                    display: flex;
                    align-items: center;
                    padding: 8px 16px 8px 24px;
                    color: #5c6f84;
                    font-size: 13px;
                    font-weight: 500;
                    text-decoration: none;
                    cursor: pointer;
                    border-left: 3px solid transparent;
                    transition: all 0.2s ease;
                }
                .nav-item:hover {
                    color: #0b1a30;
                    background: #f1f5f9;
                }
                .nav-item.active {
                    color: #0060af;
                    background: #e0f2fe;
                    font-weight: 700;
                    border-left-color: #0060af;
                }
                .active-badge {
                    margin-left: auto;
                    font-size: 9px;
                    background: #f43f5e;
                    color: #fff;
                    padding: 2px 6px;
                    borderRadius: 10px;
                    font-weight: bold;
                    letter-spacing: 0.5px;
                }
                .simulator-btn {
                    background: #002244;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 8px 20px;
                    font-weight: bold;
                    font-size: 13px;
                    cursor: pointer;
                    transition: background 0.15s;
                }
                .simulator-btn:hover {
                    background: #003366;
                }
                .simulator-btn:disabled {
                    background: #94a3b8;
                    cursor: not-allowed;
                }
            `}} />

            {/* Step 3 Webhook Loader Overlay (Full Screen for premium feel) */}
            {isProcessing && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(11, 26, 48, 0.95)', color: '#fff',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    zIndex: 99999, backdropFilter: 'blur(8px)'
                }}>
                    <div style={{ width: 100, height: 100, position: 'relative', marginBottom: 28 }}>
                        <div style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                            border: '5px solid rgba(255,255,255,0.1)', borderTopColor: '#38bdf8',
                            borderRadius: '50%', animation: 'spinCircle 1s linear infinite'
                        }} />
                        <div style={{ fontSize: 40, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                            {isSuccessPayment ? '⚡' : '❌'}
                        </div>
                    </div>
                    
                    <h2 style={{ margin: '0 0 8px 0', fontSize: 24, fontWeight: 800 }}>
                        {isSuccessPayment ? 'Memproses Webhook Otorisasi...' : 'Membatalkan Transaksi pesanan...'}
                    </h2>
                    <p style={{ margin: '0 0 30px 0', fontSize: 14, color: '#94a3b8', maxWidth: 460, textAlign: 'center', lineHeight: 1.6 }}>
                        Sistem sedang memicu callback webhook asinkron secara asinkron ke server lokal dan memperbarui mutasi basis data.
                    </p>

                    <div style={{ width: '100%', maxWidth: 460, height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden', marginBottom: 16 }}>
                        <div style={{ height: '100%', width: `${progressPercent}%`, background: 'linear-gradient(90deg, #38bdf8, #60a5fa)', borderRadius: 4, transition: 'width 0.2s ease-out' }} />
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: '#e2e8f0', fontWeight: 600, fontStyle: 'italic' }}>
                        {progressMessage}
                    </p>
                </div>
            )}

            {/* Header Bar */}
            <div style={{ 
                background: '#0b1a30', 
                height: 56, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '0 24px',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {/* Midtrans replica logo */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <svg width="130" height="24" viewBox="0 0 130 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0" y="3" width="3" height="18" rx="1.5" fill="#ffffff" />
                            <rect x="7" y="3" width="3" height="18" rx="1.5" fill="#38bdf8" />
                            <rect x="14" y="3" width="3" height="18" rx="1.5" fill="#ffffff" />
                            <text x="24" y="17" fill="#ffffff" fontSize="16" fontWeight="bold" fontFamily="system-ui, sans-serif" letterSpacing="-0.2px">midtrans</text>
                        </svg>
                    </div>
                    <span style={{ fontSize: 11, background: 'rgba(56,189,248,0.15)', color: '#38bdf8', padding: '3px 8px', borderRadius: 4, fontWeight: 700, letterSpacing: '0.5px' }}>
                        SANDBOX SIMULATOR
                    </span>
                </div>
                
                <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                    <a href="https://docs.midtrans.com" target="_blank" rel="noreferrer" style={{ fontSize: 13, color: '#94a3b8', textDecoration: 'none', fontWeight: 500 }}>
                        Technical Documentation
                    </a>
                    <a href="https://submit-feedback" style={{ fontSize: 13, color: '#94a3b8', textDecoration: 'none', fontWeight: 500 }}>
                        Submit Feedback
                    </a>
                </div>
            </div>

            {/* Layout Body */}
            <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 56px)' }}>
                
                {/* Left Sidebar Menu */}
                <div style={{ width: 260, background: '#f8fafc', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                    
                    {/* Section: Introduction */}
                    <div style={{ padding: '16px 24px 8px', fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.8px' }}>
                        INTRODUCTION
                    </div>
                    <div 
                        onClick={() => setActiveMenu('introduction')} 
                        className={`nav-item ${activeMenu === 'introduction' ? 'active' : ''}`}
                    >
                        <span>Midtrans Payment Simulator</span>
                    </div>

                    {/* Section: Payment Simulator */}
                    <div style={{ padding: '24px 24px 8px', fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.8px' }}>
                        PAYMENT SIMULATOR
                    </div>
                    
                    <div 
                        onClick={() => setActiveMenu('qris')} 
                        className={`nav-item ${activeMenu === 'qris' ? 'active' : ''}`}
                    >
                        <span>QRIS (Gopay / ShopeePay)</span>
                        {payment.payment_method === 'midtrans' && (
                            <span className="active-badge">Order</span>
                        )}
                    </div>
                    
                    <div style={{ padding: '8px 16px 8px 24px', fontSize: 12, fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>✓</span> Virtual Account
                    </div>

                    <div 
                        onClick={() => setActiveMenu('bca')} 
                        className={`nav-item ${activeMenu === 'bca' ? 'active' : ''}`}
                        style={{ paddingLeft: 36 }}
                    >
                        <span>BCA VA</span>
                    </div>

                    <div 
                        onClick={() => setActiveMenu('bri')} 
                        className={`nav-item ${activeMenu === 'bri' ? 'active' : ''}`}
                        style={{ paddingLeft: 36 }}
                    >
                        <span>BRI VA</span>
                    </div>

                    <div 
                        onClick={() => setActiveMenu('bni')} 
                        className={`nav-item ${activeMenu === 'bni' ? 'active' : ''}`}
                        style={{ paddingLeft: 36 }}
                    >
                        <span>BNI VA</span>
                    </div>

                    <div 
                        onClick={() => setActiveMenu('permata')} 
                        className={`nav-item ${activeMenu === 'permata' ? 'active' : ''}`}
                        style={{ paddingLeft: 36 }}
                    >
                        <span>Permata VA</span>
                    </div>

                    <div 
                        onClick={() => setActiveMenu('cimb')} 
                        className={`nav-item ${activeMenu === 'cimb' ? 'active' : ''}`}
                        style={{ paddingLeft: 36 }}
                    >
                        <span>CIMB VA</span>
                    </div>

                    <div 
                        onClick={() => setActiveMenu('mandiri')} 
                        className={`nav-item ${activeMenu === 'mandiri' ? 'active' : ''}`}
                        style={{ paddingLeft: 36 }}
                    >
                        <span>Mandiri Bill</span>
                    </div>

                    <div 
                        onClick={() => setActiveMenu('danamon')} 
                        className={`nav-item ${activeMenu === 'danamon' ? 'active' : ''}`}
                        style={{ paddingLeft: 36 }}
                    >
                        <span>Danamon VA</span>
                    </div>

                    <div 
                        onClick={() => setActiveMenu('bsi')} 
                        className={`nav-item ${activeMenu === 'bsi' ? 'active' : ''}`}
                        style={{ paddingLeft: 36 }}
                    >
                        <span>BSI VA</span>
                    </div>

                    <div 
                        onClick={() => setActiveMenu('seabank')} 
                        className={`nav-item ${activeMenu === 'seabank' ? 'active' : ''}`}
                        style={{ paddingLeft: 36 }}
                    >
                        <span>SeaBank VA</span>
                    </div>

                    <div 
                        onClick={() => setActiveMenu('saqu')} 
                        className={`nav-item ${activeMenu === 'saqu' ? 'active' : ''}`}
                        style={{ paddingLeft: 36 }}
                    >
                        <span>Bank Saqu VA</span>
                    </div>

                    <div style={{ padding: '8px 16px 8px 24px', fontSize: 12, fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>✓</span> Over The Counter
                    </div>

                    <div 
                        onClick={() => setActiveMenu('alfamart')} 
                        className={`nav-item ${activeMenu === 'alfamart' ? 'active' : ''}`}
                        style={{ paddingLeft: 36 }}
                    >
                        <span>Alfamart</span>
                    </div>

                    <div 
                        onClick={() => setActiveMenu('indomaret')} 
                        className={`nav-item ${activeMenu === 'indomaret' ? 'active' : ''}`}
                        style={{ paddingLeft: 36 }}
                    >
                        <span>Indomaret</span>
                    </div>

                    <div style={{ padding: '8px 16px 8px 24px', fontSize: 12, fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>✓</span> Cardless Credit
                    </div>

                    <div 
                        onClick={() => setActiveMenu('kredivo')} 
                        className={`nav-item ${activeMenu === 'kredivo' ? 'active' : ''}`}
                        style={{ paddingLeft: 36 }}
                    >
                        <span>Kredivo</span>
                    </div>

                    <div 
                        onClick={() => setActiveMenu('akulaku')} 
                        className={`nav-item ${activeMenu === 'akulaku' ? 'active' : ''}`}
                        style={{ paddingLeft: 36 }}
                    >
                        <span>Akulaku</span>
                    </div>

                    {/* Resources */}
                    <div style={{ padding: '24px 24px 8px', fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.8px', marginTop: 'auto' }}>
                        RESOURCES
                    </div>
                    <div style={{ padding: '8px 24px 24px', fontSize: 13, color: '#64748b' }}>
                        <span>© 2026 PT Midtrans</span>
                    </div>
                </div>

                {/* Main Content Area */}
                <div style={{ flex: 1, padding: 40, display: 'flex', gap: 30, background: '#ffffff' }}>
                    
                    {/* Simulator Center Module */}
                    <div style={{ flex: 1, maxWidth: 640 }}>
                        {activeMenu === 'introduction' ? (
                            <div>
                                <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>
                                    Midtrans Payment Simulator
                                </h1>
                                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, marginBottom: 20 }}>
                                    Selamat datang di Simulator Pembayaran Sandbox Midtrans NadaKito. Di sini Anda dapat mensimulasikan berbagai metode transaksi pembayaran yang didukung oleh Midtrans API di lingkungan sandbox developer secara dinamis.
                                </p>
                                
                                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20, marginBottom: 20 }}>
                                    <h4 style={{ margin: '0 0 10px 0', fontSize: 15, fontWeight: 700, color: '#0f172a' }}>👉 Cara Melakukan Uji Coba:</h4>
                                    <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: '#475569', lineHeight: 1.8 }}>
                                        <li>Pilih metode pembayaran yang sesuai di sidebar kiri.</li>
                                        <li>Lihat data kredensial / Virtual Account Number pada panel kanan.</li>
                                        <li>Gunakan tombol salin atau ketik nomor Virtual Account ke kotak input.</li>
                                        <li>Klik tombol **Inquire** untuk melacak detail transaksi belanja dari NadaKito.</li>
                                        <li>Klik **Pay** untuk mensimulasikan otentikasi status Lunas (Settlement) via Webhook.</li>
                                    </ol>
                                </div>
                            </div>
                        ) : (
                            <div>
                                {/* Active Bank Header Row */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #e2e8f0', paddingBottom: 20, marginBottom: 30 }}>
                                    <div style={{
                                        background: currentConfig.logoBg,
                                        color: currentConfig.logoColor,
                                        width: 54, height: 32,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        borderRadius: 4, fontSize: 13, fontWeight: 900,
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                    }}>
                                        {currentConfig.logoText}
                                    </div>
                                    <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0b1a30', margin: 0 }}>
                                        {currentConfig.title}
                                    </h1>
                                </div>

                                {!isSearched ? (
                                    /* Step 1: Input VA Form */
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            <label style={{ fontSize: 13, fontWeight: 650, color: '#475569' }}>
                                                {currentConfig.label}
                                            </label>
                                            <div style={{ display: 'flex', gap: 10 }}>
                                                <input 
                                                    type="text" 
                                                    placeholder={`Masukkan ${currentConfig.label}`}
                                                    value={inputValue}
                                                    onChange={e => setInputValue(e.target.value)}
                                                    style={{
                                                        flex: 1,
                                                        border: '1px solid #cbd5e1',
                                                        borderRadius: 4,
                                                        padding: '10px 14px',
                                                        fontSize: 14,
                                                        color: '#0f172a',
                                                        outline: 'none',
                                                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                                                    }}
                                                />
                                                <button 
                                                    onClick={handleInquire}
                                                    className="simulator-btn"
                                                >
                                                    Inquire
                                                </button>
                                            </div>
                                            
                                            {searchError && (
                                                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#ef4444', fontWeight: 600 }}>
                                                    ⚠️ {searchError}
                                                </p>
                                            )}
                                        </div>

                                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 20, display: 'flex', gap: 10 }}>
                                            <button
                                                onClick={handleQuickFill}
                                                style={{
                                                    background: '#e0f2fe',
                                                    color: '#0369a1',
                                                    border: '1px solid #bae6fd',
                                                    borderRadius: 4,
                                                    padding: '8px 16px',
                                                    fontSize: 12,
                                                    fontWeight: 700,
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                ⚡ Otomatis Isi Nomor VA
                                            </button>

                                            <button
                                                onClick={handleCancelOrder}
                                                style={{
                                                    background: '#fef2f2',
                                                    color: '#b91c1c',
                                                    border: '1px solid #fca5a5',
                                                    borderRadius: 4,
                                                    padding: '8px 16px',
                                                    fontSize: 12,
                                                    fontWeight: 700,
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                ❌ Batalkan Transaksi (Cancel)
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* Step 2: Show Transaction Details after Inquire */
                                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                                        <h3 style={{ margin: '0 0 18px 0', fontSize: 16, fontWeight: 800, color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: 10 }}>
                                            Transaction Details
                                        </h3>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                                                <span style={{ color: '#64748b', fontWeight: 600 }}>Merchant Name</span>
                                                <span style={{ color: '#0f172a', fontWeight: 700 }}>NadaKito Alat Musik</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                                                <span style={{ color: '#64748b', fontWeight: 600 }}>Order ID</span>
                                                <span style={{ color: '#0f172a', fontWeight: 700 }}>{payment.external_id}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                                                <span style={{ color: '#64748b', fontWeight: 600 }}>Amount</span>
                                                <span style={{ color: '#0060af', fontWeight: 800, fontSize: 15 }}>{fmt(payment.amount)}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                                                <span style={{ color: '#64748b', fontWeight: 600 }}>Customer Name</span>
                                                <span style={{ color: '#0f172a', fontWeight: 700 }}>{payment.order.user_name}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                                                <span style={{ color: '#64748b', fontWeight: 600 }}>Payment Status</span>
                                                <span style={{ background: '#fef3c7', color: '#d97706', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 10 }}>
                                                    PENDING
                                                </span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: 12 }}>
                                            <button 
                                                onClick={() => runBackendSubmission('paid')}
                                                style={{
                                                    flex: 2,
                                                    background: '#10b981',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: 4,
                                                    padding: '12px 0',
                                                    fontSize: 14,
                                                    fontWeight: 800,
                                                    cursor: 'pointer',
                                                    textAlign: 'center',
                                                    boxShadow: '0 2px 6px rgba(16,185,129,0.2)'
                                                }}
                                            >
                                                Pay (Simulasikan Lunas)
                                            </button>

                                            <button 
                                                onClick={() => setIsSearched(false)}
                                                style={{
                                                    flex: 1,
                                                    background: '#94a3b8',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: 4,
                                                    padding: '12px 0',
                                                    fontSize: 13,
                                                    fontWeight: 700,
                                                    cursor: 'pointer',
                                                    textAlign: 'center'
                                                }}
                                            >
                                                Back
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Panel: Sandbox Guide & Credentials */}
                    <div style={{ width: 300, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20, alignSelf: 'flex-start', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: 13, fontWeight: 800, color: '#0b1a30', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            🔑 Sandbox Credentials
                        </h4>

                        {/* Active tab credential preview */}
                        {activeMenu !== 'introduction' && (
                            <div style={{ background: '#e0f2fe', border: '1.5px solid #0284c7', borderRadius: 8, padding: '12px 14px', marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <span style={{ fontSize: 9, fontWeight: 800, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.8px' }}>👉 KREDENSIAL METODE AKTIF</span>
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>{currentConfig.title} ({currentConfig.label})</span>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                                    <code style={{ fontSize: 14, color: '#0369a1', fontWeight: 900, background: '#fff', padding: '2px 6px', borderRadius: 4, border: '1px solid #bae6fd' }}>{currentConfig.expectedValue}</code>
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(currentConfig.expectedValue);
                                            alert('Kredensial aktif disalin!');
                                        }}
                                        style={{ fontSize: 11, background: '#0284c7', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontWeight: 700 }}
                                    >
                                        Salin
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5, marginBottom: 14 }}>
                            Daftar seluruh alternatif kode pembayaran sandbox yang valid untuk pesanan saat ini:
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {/* BCA Card */}
                            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <span style={{ fontSize: 10, fontWeight: 700, color: '#0060af' }}>BCA VIRTUAL ACCOUNT</span>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <code style={{ fontSize: 13, color: '#0b1a30', fontWeight: 700 }}>98123{orderIdPadded}</code>
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(`98123${orderIdPadded}`);
                                            alert('BCA VA disalin!');
                                        }}
                                        style={{ fontSize: 10, background: '#f1f5f9', border: 'none', padding: '2px 6px', borderRadius: 4, cursor: 'pointer' }}
                                    >
                                        Salin
                                    </button>
                                </div>
                            </div>

                            {/* Mandiri Card */}
                            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <span style={{ fontSize: 10, fontWeight: 700, color: '#1c3f94' }}>MANDIRI BILL (BILL KEY)</span>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <code style={{ fontSize: 13, color: '#0b1a30', fontWeight: 700 }}>88012{orderIdPadded}</code>
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(`88012${orderIdPadded}`);
                                            alert('Mandiri Bill Key disalin!');
                                        }}
                                        style={{ fontSize: 10, background: '#f1f5f9', border: 'none', padding: '2px 6px', borderRadius: 4, cursor: 'pointer' }}
                                    >
                                        Salin
                                    </button>
                                </div>
                                <span style={{ fontSize: 9, color: '#94a3b8' }}>Company Code: 70012</span>
                            </div>

                            {/* QRIS Card */}
                            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <span style={{ fontSize: 10, fontWeight: 700, color: '#334155' }}>QRIS REFERENCE ID</span>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <code style={{ fontSize: 13, color: '#0b1a30', fontWeight: 700 }}>REF-{orderIdPadded}</code>
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(`REF-${orderIdPadded}`);
                                            alert('QRIS Ref ID disalin!');
                                        }}
                                        style={{ fontSize: 10, background: '#f1f5f9', border: 'none', padding: '2px 6px', borderRadius: 4, cursor: 'pointer' }}
                                    >
                                        Salin
                                    </button>
                                </div>
                            </div>

                            {/* Alfamart Card */}
                            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <span style={{ fontSize: 10, fontWeight: 700, color: '#d9251c' }}>ALFAMART PAYMENT CODE</span>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <code style={{ fontSize: 13, color: '#0b1a30', fontWeight: 700 }}>11103{orderIdPadded}</code>
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(`11103${orderIdPadded}`);
                                            alert('Alfamart Code disalin!');
                                        }}
                                        style={{ fontSize: 10, background: '#f1f5f9', border: 'none', padding: '2px 6px', borderRadius: 4, cursor: 'pointer' }}
                                    >
                                        Salin
                                    </button>
                                </div>
                            </div>

                            {/* Indomaret Card */}
                            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <span style={{ fontSize: 10, fontWeight: 700, color: '#0055a5' }}>INDOMARET PAYMENT CODE</span>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <code style={{ fontSize: 13, color: '#0b1a30', fontWeight: 700 }}>22203{orderIdPadded}</code>
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(`22203${orderIdPadded}`);
                                            alert('Indomaret Code disalin!');
                                        }}
                                        style={{ fontSize: 10, background: '#f1f5f9', border: 'none', padding: '2px 6px', borderRadius: 4, cursor: 'pointer' }}
                                    >
                                        Salin
                                    </button>
                                </div>
                            </div>

                            {/* Kredivo Card */}
                            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <span style={{ fontSize: 10, fontWeight: 700, color: '#ff5a00' }}>KREDIVO PHONE / TRANSACTION ID</span>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <code style={{ fontSize: 13, color: '#0b1a30', fontWeight: 700 }}>33303{orderIdPadded}</code>
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(`33303${orderIdPadded}`);
                                            alert('Kredivo Code disalin!');
                                        }}
                                        style={{ fontSize: 10, background: '#f1f5f9', border: 'none', padding: '2px 6px', borderRadius: 4, cursor: 'pointer' }}
                                    >
                                        Salin
                                    </button>
                                </div>
                            </div>

                            {/* Akulaku Card */}
                            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <span style={{ fontSize: 10, fontWeight: 700, color: '#e60012' }}>AKULAKU PHONE / TRANSACTION ID</span>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <code style={{ fontSize: 13, color: '#0b1a30', fontWeight: 700 }}>44403{orderIdPadded}</code>
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(`44403${orderIdPadded}`);
                                            alert('Akulaku Code disalin!');
                                        }}
                                        style={{ fontSize: 10, background: '#f1f5f9', border: 'none', padding: '2px 6px', borderRadius: 4, cursor: 'pointer' }}
                                    >
                                        Salin
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px dashed #cbd5e1', marginTop: 16, paddingTop: 16, fontSize: 11, color: '#64748b', lineHeight: 1.4 }}>
                            💡 <strong>Tip Keamanan:</strong> Lingkungan sandbox ini mensimulasikan API resmi Midtrans dan sepenuhnya aman untuk pengujian database dinamis Anda.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
