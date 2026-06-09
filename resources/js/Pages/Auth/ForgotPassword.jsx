import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
            <Head title="" />

            <div className="w-full max-w-[400px]">
                <div className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-sm border border-gray-100 relative">
                    
                    {/* Top Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
                            <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-extrabold text-gray-900">Lupa Password?</h1>
                        <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                            Tenang saja! Masukkan emailmu di bawah ini dan kami akan mengirimkan link untuk mereset passwordmu.
                        </p>
                    </div>

                    {status && (
                        <div className="mb-6 p-3 rounded-xl bg-emerald-50 text-emerald-600 text-sm font-medium text-center border border-emerald-100">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit}>
                        
                        {/* Email Field */}
                        <div className="mb-6">
                            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1.5">Email Terdaftar</label>
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

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl transition-all flex justify-center items-center gap-2 disabled:opacity-70"
                        >
                            {processing ? 'Memproses...' : 'Kirim Link Reset'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <Link href={route('login')} className="inline-flex items-center text-sm font-bold text-gray-600 hover:text-emerald-600 transition-colors">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Kembali ke Login
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
