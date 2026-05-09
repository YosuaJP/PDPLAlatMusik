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
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
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
        label: 'Pesanan',
        href: '/orders',
        routeName: 'orders.*',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
        ),
    },
    {
        label: 'Pembayaran',
        href: '/payments',
        routeName: 'payments.*',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
        ),
    },
    {
        label: 'Promo',
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
        label: 'Pengguna',
        href: '/users',
        routeName: 'users.*',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        adminOnly: true,
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
];

function SidebarItem({ item, collapsed, currentUrl }) {
    const isActive = currentUrl.startsWith(item.href) && item.href !== '/' || currentUrl === item.href;

    return (
        <Link
            href={item.href}
            className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 group relative
                ${isActive
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                    : 'text-slate-400 hover:bg-slate-700/60 hover:text-white'
                }
                ${collapsed ? 'justify-center' : ''}
            `}
        >
            <span className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                {item.icon}
            </span>

            {!collapsed && (
                <span className="truncate">{item.label}</span>
            )}

            {collapsed && (
                <div className="absolute left-full ml-3 px-2 py-1 bg-slate-900 text-white text-xs rounded-md
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none
                    whitespace-nowrap z-50 shadow-lg border border-slate-700">
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
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-700/50 ${sidebarCollapsed ? 'justify-center px-2' : ''}`}>
                <div className="flex-shrink-0 w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 3C6.477 3 2 7.477 2 13c0 1.89.518 3.658 1.419 5.168L2 22l3.832-1.419A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-9.5S17.523 3 12 3zm0 2c4.418 0 8 3.358 8 7.5S16.418 20 12 20a7.956 7.956 0 01-4.014-1.077l-.286-.172-2.274.842.842-2.274-.172-.286A7.956 7.956 0 014 13.5C4 9.358 7.582 6 12 6z"/>
                    </svg>
                </div>
                {!sidebarCollapsed && (
                    <div>
                        <p className="text-white font-bold text-sm leading-none">POS Alat Musik</p>
                        <p className="text-slate-400 text-xs mt-0.5">Management System</p>
                    </div>
                )}
            </div>

            {/* Nav Items */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {!sidebarCollapsed && (
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider px-3 mb-2">Menu Utama</p>
                )}
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
            <div className={`border-t border-slate-700/50 p-3 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
                {sidebarCollapsed ? (
                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
                            <p className="text-slate-400 text-xs truncate capitalize">{user?.role}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            title="Logout"
                            className="text-slate-400 hover:text-red-400 transition-colors flex-shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-slate-950 overflow-hidden">

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
                    hidden lg:flex flex-col bg-slate-800 border-r border-slate-700/50
                    transition-all duration-300 ease-in-out flex-shrink-0
                    ${sidebarCollapsed ? 'w-16' : 'w-60'}
                `}
            >
                {sidebarContent}
            </aside>

            {/* Sidebar — Mobile drawer */}
            <aside
                className={`
                    fixed top-0 left-0 h-full w-64 bg-slate-800 border-r border-slate-700/50 z-30
                    transition-transform duration-300 lg:hidden
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {sidebarContent}
            </aside>

            {/* Main area */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">

                {/* Top Navbar */}
                <header className="bg-slate-900 border-b border-slate-700/50 px-4 py-3 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        {/* Toggle sidebar (desktop) */}
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Toggle sidebar (mobile) */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Page title */}
                        {title && (
                            <h1 className="text-white font-semibold text-base">{title}</h1>
                        )}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        {/* Notification bell */}
                        <button className="relative flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            {/* Badge */}
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* User dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-700 transition-colors"
                            >
                                <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-slate-300 text-sm font-medium hidden sm:block">{user?.name}</span>
                                <svg className="w-4 h-4 text-slate-400 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {userMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                                    <div className="absolute right-0 top-full mt-1 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden">
                                        <div className="px-4 py-3 border-b border-slate-700">
                                            <p className="text-white text-sm font-medium">{user?.name}</p>
                                            <p className="text-slate-400 text-xs">{user?.email}</p>
                                        </div>
                                        <Link
                                            href={route('profile.edit')}
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
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
                <main className="flex-1 overflow-y-auto bg-slate-950 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
