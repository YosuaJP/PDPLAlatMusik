import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

function formatRp(val) {
    return 'Rp ' + Number(val || 0).toLocaleString('id-ID');
}

const statusConfig = {
    pending:  { label: 'Pending',  cls: 'bg-yellow-100 text-yellow-700' },
    approved: { label: 'Disetujui', cls: 'bg-emerald-100 text-emerald-700' },
    rejected: { label: 'Ditolak',   cls: 'bg-red-100 text-red-600' },
};

const tabs = [
    { key: 'all',      label: 'Semua' },
    { key: 'pending',  label: 'Pending' },
    { key: 'approved', label: 'Disetujui' },
    { key: 'rejected', label: 'Ditolak' },
];

export default function AdminRefund({ refunds, filters }) {
    const [activeTab, setActiveTab] = useState(filters?.status || 'all');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRefund, setSelectedRefund] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        action: 'approve',
        reason: '',
    });

    const switchTab = (key) => {
        setActiveTab(key);
        router.get(route('admin.refunds.index'), { status: key }, { preserveState: true, replace: true });
    };

    const openModal = (refund, action) => {
        reset();
        setSelectedRefund(refund);
        setData('action', action);
        setModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.refunds.process', selectedRefund.refund_id), {
            onSuccess: () => { setModalOpen(false); reset(); },
        });
    };

    const refundList = refunds?.data ?? [];

    return (
        <AdminLayout pageTitle="Admin Panel">
            <Head title="" />

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Manajemen Refund</h2>
                        <p className="text-gray-400 text-xs mt-1">Kelola permintaan refund dari pelanggan.</p>
                    </div>
                    <div className="flex gap-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => switchTab(tab.key)}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                                    activeTab === tab.key
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto border border-gray-100 rounded-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                                <th className="px-5 py-3.5">Refund ID</th>
                                <th className="px-5 py-3.5">Order ID</th>
                                <th className="px-5 py-3.5">Customer</th>
                                <th className="px-5 py-3.5 text-center">Bukti</th>
                                <th className="px-5 py-3.5">Total</th>
                                <th className="px-5 py-3.5">Alasan</th>
                                <th className="px-5 py-3.5 text-center">Status</th>
                                <th className="px-5 py-3.5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            {refundList.length > 0 ? refundList.map(r => {
                                const sc = statusConfig[r.status] ?? { label: r.status, cls: 'bg-gray-100 text-gray-600' };
                                return (
                                    <tr key={r.refund_id} className="hover:bg-gray-50/60 transition-colors">
                                        <td className="px-5 py-4 font-mono text-gray-500 text-xs">
                                            REF-{String(r.refund_id).padStart(3, '0')}
                                        </td>
                                        <td className="px-5 py-4 font-mono text-gray-500 text-xs">
                                            ORD-{String(r.order_id).padStart(8, '0')}
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-gray-800">{r.customer_name}</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">{r.customer_email}</p>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            {r.evidence_urls && r.evidence_urls.length > 0 ? (
                                                <div className="flex gap-1 justify-center">
                                                    {r.evidence_urls.map((url, i) => (
                                                        <a key={i} href={url} target="_blank" rel="noreferrer" className="inline-flex w-8 h-8 rounded-lg overflow-hidden border border-gray-200">
                                                            <img src={url} alt="Bukti" className="w-full h-full object-cover hover:opacity-80 transition-opacity" />
                                                        </a>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-300">—</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 font-bold text-gray-800">{formatRp(r.total)}</td>
                                        <td className="px-5 py-4 text-xs text-gray-500 max-w-xs">
                                            <p className="truncate">{r.reason || '—'}</p>
                                            {r.status === 'rejected' && r.rejection_reason && (
                                                <div className="mt-1.5 p-2 bg-red-50 border border-red-100 rounded-lg">
                                                    <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-0.5">Alasan Penolakan Admin:</p>
                                                    <p className="text-xs text-red-700">{r.rejection_reason}</p>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${sc.cls}`}>
                                                {sc.label}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            {r.status === 'pending' ? (
                                                <div className="inline-flex items-center gap-2">
                                                    <button
                                                        onClick={() => openModal(r, 'approve')}
                                                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-colors"
                                                    >
                                                        Setuju
                                                    </button>
                                                    <button
                                                        onClick={() => openModal(r, 'reject')}
                                                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[11px] font-bold transition-colors"
                                                    >
                                                        Tolak
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">—</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={8} className="px-6 py-10 text-center text-gray-400 text-sm">
                                        Tidak ada data permintaan refund.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Konfirmasi */}
            {modalOpen && selectedRefund && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className={`font-bold text-base ${data.action === 'approve' ? 'text-emerald-700' : 'text-red-600'}`}>
                                {data.action === 'approve' ? 'Setujui Refund' : 'Tolak Refund'}
                            </h3>
                            <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="p-6 space-y-4">
                                <p className="text-sm text-gray-600">
                                    Anda yakin ingin {data.action === 'approve' ? 'menyetujui' : 'menolak'} refund untuk pesanan 
                                    <span className="font-bold font-mono ml-1 text-gray-800">ORD-{String(selectedRefund.order_id).padStart(8, '0')}</span>?
                                </p>

                                {data.action === 'reject' && (
                                    <div>
                                        <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Alasan Penolakan</label>
                                        <textarea
                                            value={data.reason}
                                            onChange={e => setData('reason', e.target.value)}
                                            rows="3"
                                            placeholder="Tulis alasan menolak refund..."
                                            className={`w-full px-3.5 py-2.5 rounded-xl border ${errors.reason ? 'border-red-400' : 'border-gray-200'} focus:ring-4 focus:ring-red-100 focus:outline-none text-sm resize-none`}
                                            required
                                        ></textarea>
                                        {errors.reason && <span className="text-red-500 text-xs mt-1 block">{errors.reason}</span>}
                                    </div>
                                )}
                            </div>
                            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
                                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors">Batal</button>
                                <button type="submit" disabled={processing} className={`px-5 py-2 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 ${data.action === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}>
                                    {processing ? 'Memproses...' : 'Konfirmasi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
