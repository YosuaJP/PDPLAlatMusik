import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

const navItems = [
    {
        label: 'Dashboard',
        href: '/dashboard',
        routeName: 'dashboard',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
        ),
    },
    {
        label: 'Produk',
        href: '/products',
        routeName: 'products.*',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        ),
    },
    {
        label: 'Kategori',
        href: '/categories',
        routeName: 'categories.*',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
        ),
    },
    {
        label: 'Pencatatan Stok',
        href: '/stocks',
        routeName: 'stocks.*',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
        ),
    },
    {
        label: 'Performa Produk',
        href: '/performance',
        routeName: 'performance.*',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
        ),
    },
    {
        label: 'Promo & Diskon',
        href: '/promos',
        routeName: 'promos.*',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
        ),
    },
    {
        label: 'Laporan',
        href: '/reports',
        routeName: 'reports.*',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        adminOnly: true,
    },
    {
        label: 'Pesanan',
        href: '/orders',
        routeName: 'orders.*',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
        ),
    },
    {
        label: 'Refund',
        href: '/refunds',
        routeName: 'refunds.*',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
            </svg>
        ),
    },
    {
        label: 'Daftar User',
        href: '/users',
        routeName: 'users.*',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
        adminOnly: true,
    },
];

function SidebarItem({ item, collapsed, currentUrl }) {
    const isActive = currentUrl.startsWith(item.href) && item.href !== '/' || currentUrl === item.href;

    return (
        <Link
            href={item.href}
            className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 group relative mb-1
                ${isActive
                    ? 'bg-[#6BCB77] text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }
                ${collapsed ? 'justify-center' : ''}
            `}
        >
            <span className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-500'}`}>
                {item.icon}
            </span>

            {!collapsed && (
                <span className="truncate">{item.label}</span>
            )}

            {collapsed && (
                <div className="absolute left-full ml-3 px-2 py-1 bg-white text-slate-700 text-xs rounded-md
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none
                    whitespace-nowrap z-50 shadow-lg border border-slate-200">
                    {item.label}
                </div>
            )}
        </Link>
    );
}

export default function POSLayout({ children, title }) {
    const { auth, ziggy } = usePage().props;
    const user = auth?.user;
    const currentUrl = ziggy?.location ?? window.location.pathname;

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const handleLogout = () => {
        router.post(route('logout'));
    };

    const visibleNavItems = navItems.filter(item => {
        if (item.adminOnly && user?.role !== 'admin') return false;
        return true;
    });

    const sidebarContent = (
        <div className="flex flex-col h-full bg-white">
            {/* Logo */}
            <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-100 ${sidebarCollapsed ? 'justify-center px-2' : ''}`}>
                <div className="flex-shrink-0 w-10 h-10 bg-[#6BCB77] rounded-full flex items-center justify-center shadow-md shadow-[#6BCB77]/20">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 3v2a7 7 0 00-7 7 1 1 0 01-2 0 9 9 0 019-9zm0 18v-2a7 7 0 007-7 1 1 0 012 0 9 9 0 01-9 9zm4.95-15.536l-1.414 1.414A7 7 0 0012 5V3a9 9 0 014.95 4.464zM3.464 16.95l1.414-1.414A7 7 0 0012 19v2a9 9 0 01-8.536-4.05z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                </div>
                {!sidebarCollapsed && (
                    <div>
                        <p className="text-slate-800 font-bold text-base leading-none">NadaKito</p>
                        <p className="text-slate-500 text-xs mt-1">Admin Panel</p>
                    </div>
                )}
            </div>

            {/* Nav Items */}
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
                {visibleNavItems.map((item) => (
                    <SidebarItem
                        key={item.href}
                        item={item}
                        collapsed={sidebarCollapsed}
                        currentUrl={currentUrl}
                    />
                ))}
            </nav>

            {/* User Info Bottom */}
            <div className={`mt-auto p-4 border-t border-slate-100`}>
                <button
                    onClick={handleLogout}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all duration-200 w-full ${sidebarCollapsed ? 'justify-center' : ''}`}
                >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {!sidebarCollapsed && <span>Logout</span>}
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-[#F4F7F5] overflow-hidden">

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-20 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar — Desktop */}
            <aside
                className={`
                    hidden lg:flex flex-col bg-white shadow-[2px_0_8px_-2px_rgba(0,0,0,0.05)] z-20
                    transition-all duration-300 ease-in-out flex-shrink-0 border-r border-slate-100
                    ${sidebarCollapsed ? 'w-20' : 'w-64'}
                `}
            >
                {sidebarContent}
            </aside>

            {/* Sidebar — Mobile drawer */}
            <aside
                className={`
                    fixed top-0 left-0 h-full w-64 bg-white z-40 shadow-2xl border-r border-slate-100
                    transition-transform duration-300 lg:hidden
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {sidebarContent}
            </aside>

            {/* Main area */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">

                {/* Top Navbar */}
                <header className="bg-white h-[68px] flex items-center justify-between px-6 flex-shrink-0 shadow-sm z-10">
                    <div className="flex items-center gap-4">
                        {/* Toggle sidebar */}
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <h1 className="text-slate-800 font-bold text-lg">Overview</h1>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-4">
                        {/* Notification bell */}
                        <button className="relative flex items-center justify-center w-9 h-9 rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </button>

                        {/* User dropdown */}
                        <div className="relative z-50">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-3 hover:bg-slate-50 px-2 py-1 rounded-lg transition-colors"
                            >
                                <div className="hidden sm:block text-right">
                                    <p className="text-slate-800 text-sm font-bold leading-none">{user?.name ?? 'Admin'}</p>
                                    <p className="text-slate-500 text-xs mt-1 capitalize">{user?.role ?? 'Owner'}</p>
                                </div>
                                <div className="w-9 h-9 rounded-full bg-[#6BCB77] flex items-center justify-center text-white text-sm font-bold shadow-sm border-2 border-white">
                                    {user?.name?.charAt(0).toUpperCase() ?? 'A'}
                                </div>
                            </button>

                            {userMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden">
                                        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                                            <p className="text-slate-800 text-sm font-bold">{user?.name}</p>
                                            <p className="text-slate-500 text-xs truncate">{user?.email}</p>
                                        </div>
                                        <Link
                                            href={route('profile.edit')}
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Profil Saya
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Keluar
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto bg-[#F4F7F5] p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
