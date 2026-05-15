import POSLayout from '@/Layouts/POSLayout';
import { Head, usePage } from '@inertiajs/react';

export default function UserDashboard() {
    const { auth } = usePage().props;

    return (
        <POSLayout title="Dashboard">
            <Head title="Dashboard" />

            <div className="mb-8">
                <h2 className="text-white text-2xl font-bold flex items-center gap-2">
                    Halo, {auth?.user?.name?.split(' ')[0] ?? 'User'}! 👋
                </h2>
                <p className="text-[#A0B9A8] text-sm mt-1">
                    Selamat datang di dashboard pelanggan.
                </p>
            </div>

            <div className="bg-[#182A20] border border-[#2A4333] rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px]">
                <svg className="w-16 h-16 text-[#A0B9A8] mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <p className="text-[#A0B9A8] text-center">
                    Halaman ini masih kosong.<br />
                    Fitur untuk user akan segera hadir.
                </p>
            </div>
        </POSLayout>
    );
}
