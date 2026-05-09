import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
            <Head title="Login — Melodi POS" />

            <div className="w-full max-w-[400px]">
                <div className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-sm border border-gray-100 relative">
                    
                    {/* Top Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
                            <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-extrabold text-gray-900">Login</h1>
                        <p className="text-sm text-gray-500 mt-1">Masuk untuk berbelanja.</p>
                    </div>

                    {status && (
                        <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-600 text-sm font-medium text-center">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        
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
                                autoFocus
                            />
                            <InputError message={errors.email} className="mt-1" />
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label htmlFor="password" className="block text-sm font-bold text-gray-700">Password</label>
                                {canResetPassword && (
                                    <Link href={route('password.request')} className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                                        Lupa Password?
                                    </Link>
                                )}
                            </div>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors bg-white"
                                placeholder="••••••••"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-1" />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full mt-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl transition-all flex justify-center items-center gap-2 disabled:opacity-70"
                        >
                            {processing ? 'Memproses...' : 'Masuk Sekarang'}
                            {!processing && (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            Belum punya akun?{' '}
                            <Link href={route('register')} className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                                Daftar Disini
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
