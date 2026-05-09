import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
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
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <Head title="Daftar — POS Alat Musik" />

            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-600/5 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md relative">

                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500 rounded-2xl shadow-2xl shadow-amber-500/30 mb-4">
                        <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 3C6.477 3 2 7.477 2 13c0 1.89.518 3.658 1.419 5.168L2 22l3.832-1.419A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-9.5S17.523 3 12 3z"/>
                        </svg>
                    </div>
                    <h1 className="text-white text-2xl font-bold">Buat Akun Baru</h1>
                    <p className="text-slate-400 text-sm mt-1">Daftarkan diri Anda ke POS Alat Musik</p>
                </div>

                {/* Card */}
                <div className="bg-slate-800/80 backdrop-blur border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={submit} className="space-y-5">

                        {/* Name */}
                        <div>
                            <InputLabel htmlFor="name" value="Nama Lengkap" className="text-slate-300 text-sm font-medium" />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="mt-1.5 block w-full bg-slate-900 border-slate-600 text-white rounded-xl focus:border-amber-500 focus:ring-amber-500/20"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Nama lengkap Anda"
                                required
                            />
                            <InputError message={errors.name} className="mt-1.5" />
                        </div>

                        {/* Email */}
                        <div>
                            <InputLabel htmlFor="email" value="Alamat Email" className="text-slate-300 text-sm font-medium" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1.5 block w-full bg-slate-900 border-slate-600 text-white rounded-xl focus:border-amber-500 focus:ring-amber-500/20"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="email@contoh.com"
                                required
                            />
                            <InputError message={errors.email} className="mt-1.5" />
                        </div>

                        {/* Password */}
                        <div>
                            <InputLabel htmlFor="password" value="Password" className="text-slate-300 text-sm font-medium" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1.5 block w-full bg-slate-900 border-slate-600 text-white rounded-xl focus:border-amber-500 focus:ring-amber-500/20"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Min. 8 karakter"
                                required
                            />
                            <InputError message={errors.password} className="mt-1.5" />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password" className="text-slate-300 text-sm font-medium" />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1.5 block w-full bg-slate-900 border-slate-600 text-white rounded-xl focus:border-amber-500 focus:ring-amber-500/20"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Ulangi password"
                                required
                            />
                            <InputError message={errors.password_confirmation} className="mt-1.5" />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed
                                text-white font-semibold rounded-xl transition-all duration-200
                                shadow-lg shadow-amber-500/30 hover:shadow-amber-500/40 hover:-translate-y-0.5
                                focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                        >
                            {processing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                    </svg>
                                    Mendaftarkan...
                                </span>
                            ) : 'Buat Akun'}
                        </button>
                    </form>

                    <p className="text-center text-slate-400 text-sm mt-6">
                        Sudah punya akun?{' '}
                        <Link href={route('login')} className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
                            Masuk di sini
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
