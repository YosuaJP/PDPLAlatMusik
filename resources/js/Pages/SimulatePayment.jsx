/**
 * @codecite
 * generator: Antigravity by Google DeepMind
 * project: NadaKito E-Commerce
 * frameworks: React.js 18.x, Inertia.js
 * description: Interactive mock UI for third-party payment gateway processing.
 */

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
    const [xenditStep, setXenditStep] = useState(1); // Step 1: pilih metode, Step 2: detail, Step 3: loading
    const [xenditCategory, setXenditCategory] = useState(null); // 'bank', 'ewallet', 'qris', 'minimarket'
    const [xenditMethod, setXenditMethod] = useState(null); // e.g. 'bca', 'gopay', etc.

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

    // Xendit payment methods data config
    const xenditMethods = {
        bank: {
            label: '🏦 Transfer Bank (Virtual Account)',
            color: '#1e40af',
            methods: [
                { id: 'bca', name: 'BCA', label: 'BCA Virtual Account', color: '#0060af', vaPrefix: '98123', icon: '🏦' },
                { id: 'mandiri', name: 'Mandiri', label: 'Mandiri Virtual Account', color: '#1c3f94', vaPrefix: '88012', icon: '🏛️' },
                { id: 'bni', name: 'BNI', label: 'BNI Virtual Account', color: '#f15a23', vaPrefix: '8578', icon: '🏦' },
                { id: 'bri', name: 'BRI', label: 'BRI Virtual Account', color: '#00529c', vaPrefix: '88788', icon: '🏧' },
                { id: 'permata', name: 'Permata', label: 'Permata Virtual Account', color: '#8cc63f', vaPrefix: '8778', icon: '💳' },
                { id: 'cimb', name: 'CIMB', label: 'CIMB Virtual Account', color: '#e60000', vaPrefix: '99901', icon: '🏦' },
            ]
        },
        ewallet: {
            label: '📱 E-Wallet',
            color: '#7c3aed',
            methods: [
                { id: 'gopay', name: 'GoPay', label: 'GoPay', color: '#00AA13', refPrefix: 'GPAY', icon: '🟢' },
                { id: 'ovo', name: 'OVO', label: 'OVO', color: '#4c3494', refPrefix: 'OVO', icon: '💜' },
                { id: 'dana', name: 'DANA', label: 'DANA', color: '#118EEA', refPrefix: 'DANA', icon: '🔵' },
                { id: 'shopeepay', name: 'ShopeePay', label: 'ShopeePay', color: '#ee4d2d', refPrefix: 'SPAY', icon: '🧡' },
            ]
        },
        qris: {
            label: '🔳 QRIS (Scan & Pay)',
            color: '#0f766e',
            methods: [
                { id: 'qris', name: 'QRIS', label: 'Semua Bank & E-Wallet', color: '#334155', refPrefix: 'QRIS', icon: '🔳' },
            ]
        },
        minimarket: {
            label: '🏪 Minimarket / Gerai',
            color: '#b91c1c',
            methods: [
                { id: 'alfamart', name: 'Alfamart', label: 'Alfamart / Alfamidi', color: '#d9251c', codePrefix: '11103', icon: '🏪' },
                { id: 'indomaret', name: 'Indomaret', label: 'Indomaret / Indogrosir', color: '#0055a5', codePrefix: '22203', icon: '🏬' },
            ]
        }
    };

    const getXenditMethodDetail = (method) => {
        if (!method) return null;
        const m = Object.values(xenditMethods).flatMap(c => c.methods).find(m => m.id === method);
        if (!m) return null;
        let paymentCode = '';
        let paymentLabel = '';
        let paymentType = '';
        if (['bca','mandiri','bni','bri','permata','cimb'].includes(method)) {
            paymentCode = `${m.vaPrefix}${orderIdPadded}`;
            paymentLabel = 'Nomor Virtual Account';
            paymentType = 'va';
        } else if (['gopay','ovo','dana','shopeepay'].includes(method)) {
            paymentCode = `${m.refPrefix}-${orderIdPadded}`;
            paymentLabel = 'Kode Referensi / Deep Link';
            paymentType = 'ewallet';
        } else if (method === 'qris') {
            paymentCode = `QRIS-${orderIdPadded}`;
            paymentLabel = 'ID Transaksi QRIS';
            paymentType = 'qris';
        } else {
            paymentCode = `${m.codePrefix}${orderIdPadded}`;
            paymentLabel = 'Kode Pembayaran';
            paymentType = 'minimarket';
        }
        return { ...m, paymentCode, paymentLabel, paymentType };
    };

    // Xendit Simulator — 3-Step Flow
    if (!isMidtrans) {
        const methodDetail = getXenditMethodDetail(xenditMethod);

        return (
            <div style={{ 
                minHeight: '100vh', 
                background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)', 
                color: '#f8fafc', 
                fontFamily: "'Outfit', 'Inter', 'Segoe UI', sans-serif", 
                display: 'flex',
                flexDirection: 'column',
            }}>
                <Head title="" />
                
                <style dangerouslySetInnerHTML={{__html: `
                    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
                    @keyframes spinCircle {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(16px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }
                    .xnd-method-card {
                        background: rgba(30, 41, 59, 0.6);
                        border: 1.5px solid rgba(255,255,255,0.07);
                        border-radius: 14px;
                        padding: 14px 16px;
                        cursor: pointer;
                        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        animation: fadeInUp 0.3s ease forwards;
                        backdrop-filter: blur(8px);
                    }
                    .xnd-method-card:hover {
                        border-color: rgba(99, 179, 237, 0.5);
                        background: rgba(99, 179, 237, 0.08);
                        transform: translateY(-2px);
                        box-shadow: 0 8px 24px rgba(99,179,237,0.15);
                    }
                    .xnd-cat-btn {
                        width: 100%;
                        padding: 16px 20px;
                        border-radius: 14px;
                        border: 1.5px solid rgba(255,255,255,0.08);
                        background: rgba(30, 41, 59, 0.5);
                        color: #e2e8f0;
                        cursor: pointer;
                        font-family: inherit;
                        font-size: 14px;
                        font-weight: 700;
                        text-align: left;
                        transition: all 0.2s ease;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        backdrop-filter: blur(8px);
                    }
                    .xnd-cat-btn:hover {
                        border-color: rgba(99,179,237,0.4);
                        background: rgba(99,179,237,0.08);
                        transform: translateX(4px);
                    }
                    .xnd-cat-btn.active {
                        border-color: rgba(99,179,237,0.6);
                        background: rgba(99,179,237,0.12);
                    }
                    .copy-btn {
                        background: rgba(59,130,246,0.2);
                        border: 1px solid rgba(59,130,246,0.3);
                        color: #93c5fd;
                        border-radius: 8px;
                        padding: 6px 14px;
                        font-size: 12px;
                        font-weight: 700;
                        cursor: pointer;
                        font-family: inherit;
                        transition: all 0.15s;
                    }
                    .copy-btn:hover {
                        background: rgba(59,130,246,0.35);
                    }
                    .pay-btn-green {
                        width: 100%;
                        padding: 18px;
                        background: linear-gradient(135deg, #10b981, #059669);
                        color: #fff;
                        border: none;
                        border-radius: 14px;
                        font-size: 15px;
                        font-weight: 800;
                        cursor: pointer;
                        font-family: inherit;
                        letter-spacing: 0.3px;
                        box-shadow: 0 8px 24px rgba(16,185,129,0.35);
                        transition: all 0.2s ease;
                    }
                    .pay-btn-green:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 12px 32px rgba(16,185,129,0.45);
                    }
                    .pay-btn-red {
                        width: 100%;
                        padding: 14px;
                        background: rgba(239,68,68,0.08);
                        color: #f87171;
                        border: 1.5px solid rgba(239,68,68,0.2);
                        border-radius: 12px;
                        font-size: 13px;
                        font-weight: 700;
                        cursor: pointer;
                        font-family: inherit;
                        transition: all 0.2s ease;
                    }
                    .pay-btn-red:hover {
                        background: rgba(239,68,68,0.15);
                        border-color: rgba(239,68,68,0.4);
                    }
                `}} />

                {/* Top Header Bar */}
                <div style={{ background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#3b82f6,#6366f1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>💙</div>
                        <div>
                            <span style={{ fontWeight: 900, fontSize: 15, color: '#fff', letterSpacing: '-0.3px' }}>Xendit</span>
                            <span style={{ marginLeft: 8, fontSize: 10, background: 'rgba(59,130,246,0.2)', color: '#93c5fd', padding: '2px 8px', borderRadius: 10, fontWeight: 700, border: '1px solid rgba(59,130,246,0.3)', letterSpacing: '0.5px' }}>SANDBOX</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <span style={{ fontSize: 12, color: '#64748b' }}>🔒 Transaksi Aman & Terenkripsi</span>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#10b981' }}>{payment.order.user_name}</div>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ flex: 1, display: 'flex', maxWidth: 1100, width: '100%', margin: '0 auto', padding: '32px 24px', gap: 28, alignItems: 'flex-start' }}>
                    
                    {/* LEFT: Main Payment Panel */}
                    <div style={{ flex: 1 }}>

                        {/* Step Indicator */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
                            {[
                                { n: 1, label: 'Pilih Metode' },
                                { n: 2, label: 'Detail Bayar' },
                                { n: 3, label: 'Konfirmasi' },
                            ].map((s, i) => (
                                <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <div style={{
                                            width: 28, height: 28, borderRadius: '50%',
                                            background: xenditStep >= s.n ? 'linear-gradient(135deg,#3b82f6,#6366f1)' : 'rgba(100,116,139,0.3)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 12, fontWeight: 800, color: '#fff',
                                            boxShadow: xenditStep >= s.n ? '0 4px 12px rgba(59,130,246,0.4)' : 'none',
                                            transition: 'all 0.3s ease'
                                        }}>{xenditStep > s.n ? '✓' : s.n}</div>
                                        <span style={{ fontSize: 12, fontWeight: 600, color: xenditStep >= s.n ? '#e2e8f0' : '#475569' }}>{s.label}</span>
                                    </div>
                                    {i < 2 && <div style={{ width: 32, height: 1, background: xenditStep > s.n ? '#3b82f6' : 'rgba(100,116,139,0.3)', transition: 'all 0.3s' }} />}
                                </div>
                            ))}
                        </div>

                        {/* === STEP 1: PILIH METODE PEMBAYARAN === */}
                        {xenditStep === 1 && (
                            <div style={{ animation: 'fadeInUp 0.35s ease forwards' }}>
                                <h2 style={{ margin: '0 0 6px 0', fontSize: 22, fontWeight: 900, color: '#f1f5f9' }}>Pilih Metode Pembayaran</h2>
                                <p style={{ margin: '0 0 28px 0', fontSize: 13, color: '#64748b' }}>Tagihan akan diproses oleh Xendit Payment Gateway (Sandbox Mode)</p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {Object.entries(xenditMethods).map(([catKey, cat]) => (
                                        <div key={catKey}>
                                            <button
                                                className={`xnd-cat-btn ${xenditCategory === catKey ? 'active' : ''}`}
                                                onClick={() => setXenditCategory(xenditCategory === catKey ? null : catKey)}
                                            >
                                                <span>{cat.label}</span>
                                                <span style={{ fontSize: 12, color: '#475569', fontWeight: 600, transition: 'transform 0.2s', display: 'inline-block', transform: xenditCategory === catKey ? 'rotate(90deg)' : 'rotate(0)' }}>›</span>
                                            </button>

                                            {xenditCategory === catKey && (
                                                <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: catKey === 'qris' ? '1fr' : 'repeat(2, 1fr)', gap: 8, paddingLeft: 8 }}>
                                                    {cat.methods.map((m, idx) => (
                                                        <div
                                                            key={m.id}
                                                            className="xnd-method-card"
                                                            style={{ animationDelay: `${idx * 0.04}s` }}
                                                            onClick={() => {
                                                                setXenditMethod(m.id);
                                                                setXenditStep(2);
                                                            }}
                                                        >
                                                            <div style={{ width: 40, height: 40, borderRadius: 10, background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, boxShadow: `0 4px 12px ${m.color}55` }}>
                                                                {m.icon}
                                                            </div>
                                                            <div>
                                                                <div style={{ fontWeight: 800, fontSize: 14, color: '#f1f5f9' }}>{m.name}</div>
                                                                <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{m.label}</div>
                                                            </div>
                                                            <div style={{ marginLeft: 'auto', color: '#475569', fontSize: 14 }}>›</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* === STEP 2: DETAIL PEMBAYARAN === */}
                        {xenditStep === 2 && methodDetail && (
                            <div style={{ animation: 'fadeInUp 0.35s ease forwards' }}>
                                <button
                                    onClick={() => { setXenditStep(1); setXenditMethod(null); setXenditCategory(null); }}
                                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 13, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', padding: 0 }}
                                >
                                    ‹ Ganti Metode Pembayaran
                                </button>

                                <div style={{ background: 'rgba(30,41,59,0.7)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 28, marginBottom: 20 }}>
                                    {/* Method Header */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                                        <div style={{ width: 52, height: 52, borderRadius: 14, background: methodDetail.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: `0 6px 16px ${methodDetail.color}55` }}>
                                            {methodDetail.icon}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 900, fontSize: 18, color: '#f1f5f9' }}>{methodDetail.name}</div>
                                            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{methodDetail.label} · Xendit Sandbox</div>
                                        </div>
                                        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                                            <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700, letterSpacing: '0.5px' }}>TOTAL TAGIHAN</div>
                                            <div style={{ fontSize: 22, fontWeight: 900, color: '#10b981', marginTop: 2 }}>{fmt(payment.amount)}</div>
                                        </div>
                                    </div>

                                    {/* Payment Code Display */}
                                    {methodDetail.paymentType === 'va' && (
                                        <div>
                                            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, marginBottom: 10, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{methodDetail.paymentLabel}</div>
                                            <div style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                                                <code style={{ fontSize: 22, fontWeight: 900, color: '#93c5fd', letterSpacing: '2px' }}>
                                                    {methodDetail.paymentCode.replace(/(\d{4})(?=\d)/g, '$1 ')}
                                                </code>
                                                <button className="copy-btn" onClick={() => { navigator.clipboard.writeText(methodDetail.paymentCode); }}>
                                                    📋 Salin
                                                </button>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 10, padding: '10px 14px' }}>
                                                <span style={{ fontSize: 16 }}>⏰</span>
                                                <span style={{ fontSize: 12, color: '#fbbf24', fontWeight: 600 }}>Berlaku 24 jam · Bayar sebelum expired</span>
                                            </div>
                                        </div>
                                    )}

                                    {methodDetail.paymentType === 'ewallet' && (
                                        <div>
                                            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, marginBottom: 10, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{methodDetail.paymentLabel}</div>
                                            <div style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                                                <code style={{ fontSize: 18, fontWeight: 900, color: '#a5b4fc', letterSpacing: '1px' }}>{methodDetail.paymentCode}</code>
                                                <button className="copy-btn" onClick={() => { navigator.clipboard.writeText(methodDetail.paymentCode); }}>
                                                    📋 Salin
                                                </button>
                                            </div>
                                            <div style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 10, padding: '12px 16px', fontSize: 12, color: '#c4b5fd', fontWeight: 600 }}>
                                                📱 Buka aplikasi {methodDetail.name} → Scan QR / Masukkan kode referensi di atas untuk melanjutkan pembayaran.
                                            </div>
                                        </div>
                                    )}

                                    {methodDetail.paymentType === 'qris' && (
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, marginBottom: 16, letterSpacing: '0.5px', textTransform: 'uppercase' }}>QR Code Pembayaran</div>
                                            {/* Simulated QR Code */}
                                            <div style={{ display: 'inline-block', background: '#fff', padding: 16, borderRadius: 16, marginBottom: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
                                                <div style={{ width: 160, height: 160, background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 21 21'%3E%3Cpath fill='%23000' d='M0 0h7v7H0zm8 0h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h7v7h-7zM1 1v5h5V1zm1 1h3v3H2zm12 0v5h5V1zm1 1h3v3h-3zM8 2h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zM8 4h1v2H8zm2 0h2v1h-2zm3 0h1v1h-1zM0 8h1v1H0zm2 0h2v1H2zm3 0h1v1H5zm2 0h1v1H7zm2 0h1v1H9zm2 0h1v2h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zM0 9h1v1H0zm2 0h1v1H2zm4 0h2v1H6zm4 0h1v1h-1zm2 0h1v1h-1zm4 0h1v1h-1zM0 10h1v1H0zm2 0h3v1H2zm3 0h1v1H5zm4 0h1v1H9zm2 0h1v1h-1zm4 0h1v1h-1zm2 0h2v1h-2zM0 11h2v1H0zm3 0h2v1H3zm3 0h1v1H6zm2 0h1v1H8zm4 0h3v1h-3zm2 0h1v1h-1zm2 0h1v1h-1zM0 12h1v1H0zm2 0h1v1H2zm2 0h1v1H4zm2 0h1v1H6zm2 0h2v2H8zm3 0h1v1h-1zm2 0h1v1h-1zm4 0h1v1h-1zM0 13h7v7H0zm8 0h1v2H8zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h2v1h-2zm3 0h1v1h-1zm-4 1h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zM1 14v5h5v-5zm1 1h3v3H2zm8 0h1v1h-1zm2 0h1v1h-1zm2 0h3v2h-3zM9 16h1v1H9zm4 0h2v1h-2zm3 0h1v1h-1zM8 17h1v1H8zm2 0h1v1h-1zm2 0h2v1h-2zm3 0h2v1h-2zM8 18h2v1H8zm3 0h1v1h-1zm2 0h1v1h-1zm2 0h1v2h-1zM9 19h1v1H9zm2 0h1v1h-1zm4 0h2v1h-2z'/%3E%3C/svg%3E")`, backgroundSize: 'cover', imageRendering: 'pixelated' }} />
                                            </div>
                                            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>ID Transaksi: <code style={{ color: '#93c5fd', fontWeight: 700 }}>{methodDetail.paymentCode}</code></div>
                                            <div style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>✓ Scan dengan aplikasi Bank atau E-Wallet apapun</div>
                                        </div>
                                    )}

                                    {methodDetail.paymentType === 'minimarket' && (
                                        <div>
                                            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, marginBottom: 10, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{methodDetail.paymentLabel}</div>
                                            <div style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                                                <code style={{ fontSize: 26, fontWeight: 900, color: '#fca5a5', letterSpacing: '3px' }}>{methodDetail.paymentCode}</code>
                                                <button className="copy-btn" onClick={() => { navigator.clipboard.writeText(methodDetail.paymentCode); }}>
                                                    📋 Salin
                                                </button>
                                            </div>
                                            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '12px 16px', fontSize: 12, color: '#fca5a5', fontWeight: 600 }}>
                                                🏪 Tunjukkan kode ini ke kasir {methodDetail.name}. Berlaku 24 jam.
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <button className="pay-btn-green" onClick={() => runBackendSubmission('paid')}>
                                        ✅ Konfirmasi — Simulasikan Pembayaran Lunas
                                    </button>
                                    <button className="pay-btn-red" onClick={() => runBackendSubmission('failed')}>
                                        ❌ Batalkan Transaksi & Kembalikan Stok
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* === STEP 3: PROCESSING (Webhook Loader) === */}
                        {xenditStep === 3 && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '60px 0', animation: 'fadeInUp 0.35s ease forwards' }}>
                                <div style={{ width: 90, height: 90, position: 'relative', marginBottom: 28 }}>
                                    <div style={{
                                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                        border: '5px solid rgba(59,130,246,0.1)', borderTopColor: '#38bdf8',
                                        borderRadius: '50%', animation: 'spinCircle 1s linear infinite'
                                    }} />
                                    <div style={{ fontSize: 36, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                        {isSuccessPayment ? '✅' : '❌'}
                                    </div>
                                </div>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: 20, fontWeight: 900, color: '#f1f5f9' }}>
                                    {isSuccessPayment ? 'Memproses Konfirmasi Pembayaran...' : 'Membatalkan Transaksi...'}
                                </h3>
                                <p style={{ margin: '0 0 32px 0', fontSize: 13, color: '#64748b', maxWidth: 400, lineHeight: 1.7 }}>
                                    {isSuccessPayment
                                        ? 'Xendit mengirimkan notifikasi webhook ke server NadaKito. Status pesanan sedang diperbarui secara aman.'
                                        : 'Transaksi dibatalkan. Stok produk sedang dikembalikan ke database.'}
                                </p>
                                <div style={{ width: '100%', maxWidth: 380, height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden', marginBottom: 14 }}>
                                    <div style={{ height: '100%', width: `${progressPercent}%`, background: 'linear-gradient(90deg, #3b82f6, #06b6d4)', borderRadius: 4, transition: 'width 0.2s ease-out' }} />
                                </div>
                                <p style={{ margin: 0, fontSize: 12, color: '#94a3b8', fontWeight: 600, fontStyle: 'italic' }}>{progressMessage}</p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Order Summary Panel */}
                    <div style={{ width: 320, background: 'rgba(30,41,59,0.6)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 24, position: 'sticky', top: 92 }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', letterSpacing: '0.8px', marginBottom: 16, textTransform: 'uppercase' }}>Ringkasan Pesanan</div>
                        
                        <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, marginBottom: 6 }}>INVOICE</div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#93c5fd', marginBottom: 20, wordBreak: 'break-all' }}>{payment.external_id}</div>

                        {/* Items */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            {payment.order.items.map((item, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', lineHeight: 1.4 }}>{item.product_name}</div>
                                        <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{item.quantity}x · {fmt(item.price_each)}</div>
                                    </div>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', flexShrink: 0 }}>{fmt(item.quantity * item.price_each)}</div>
                                </div>
                            ))}
                        </div>

                        {/* Price breakdown */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b' }}>
                                <span>Subtotal</span>
                                <span style={{ color: '#94a3b8' }}>{fmt(payment.order.subtotal_amount)}</span>
                            </div>
                            {payment.order.discount_amount > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#10b981' }}>
                                    <span>Diskon Promo</span>
                                    <span>-{fmt(payment.order.discount_amount)}</span>
                                </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b' }}>
                                <span>Ongkos Kirim</span>
                                <span style={{ color: '#94a3b8' }}>{fmt(payment.order.shipping_cost)}</span>
                            </div>
                        </div>

                        <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <span style={{ fontSize: 13, fontWeight: 800, color: '#e2e8f0' }}>Total Bayar</span>
                            <span style={{ fontSize: 20, fontWeight: 900, color: '#10b981' }}>{fmt(payment.amount)}</span>
                        </div>

                        <div style={{ fontSize: 11, color: '#334155', background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '10px 14px', lineHeight: 1.6 }}>
                            📦 <span style={{ color: '#475569' }}>{payment.order.shipping_address}</span>
                        </div>

                        {xenditMethod && methodDetail && (
                            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, background: `${methodDetail.color}18`, border: `1px solid ${methodDetail.color}44`, borderRadius: 10, padding: '10px 14px' }}>
                                <span style={{ fontSize: 18 }}>{methodDetail.icon}</span>
                                <div>
                                    <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8' }}>METODE TERPILIH</div>
                                    <div style={{ fontSize: 13, fontWeight: 800, color: '#e2e8f0' }}>{methodDetail.name}</div>
                                </div>
                            </div>
                        )}
                    </div>
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
            <Head title="" />

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
