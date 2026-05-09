import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        phone_number: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans py-12">
            <Head title="Daftar — Melodi POS" />

            <div className="w-full max-w-[440px]">
                <div className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-sm border border-gray-100 relative">
                    
                    {/* Top Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
                            <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-extrabold text-gray-900">Daftar Akun Baru</h1>
                        <p className="text-sm text-gray-500 mt-1">Gabung Melodi POS untuk mulai belanja.</p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1.5">Nama Lengkap</label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors bg-white"
                                placeholder="Contoh: Valentino Hose"
                                onChange={(e) => setData('name', e.target.value)}
                                autoFocus
                            />
                            <InputError message={errors.name} className="mt-1" />
                        </div>

                        {/* Phone Number Field */}
                        <div>
                            <label htmlFor="phone_number" className="block text-sm font-bold text-gray-700 mb-1.5">Nomor Telepon</label>
                            <input
                                id="phone_number"
                                type="text"
                                name="phone_number"
                                value={data.phone_number}
                                className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors bg-white"
                                placeholder="08xxxxxxxxxx"
                                onChange={(e) => setData('phone_number', e.target.value)}
                            />
                            <InputError message={errors.phone_number} className="mt-1" />
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors bg-white"
                                placeholder="nama@email.com"
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-1" />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors bg-white"
                                placeholder="Minimal 8 karakter"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-1" />
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-bold text-gray-700 mb-1.5">Konfirmasi Password</label>
                            <input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors bg-white"
                                placeholder="Ketik ulang password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                            />
                            <InputError message={errors.password_confirmation} className="mt-1" />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl transition-all flex justify-center items-center gap-2 disabled:opacity-70"
                        >
                            {processing ? 'Memproses...' : 'Daftar Sekarang'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            Sudah punya akun?{' '}
                            <Link href={route('login')} className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                                Login Disini
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
