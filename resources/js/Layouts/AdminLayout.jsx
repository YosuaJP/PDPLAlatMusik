import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

const navItems = [
    {
        label: 'Dashboard',
        href: '/dashboard',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ),
    },
    {
        label: 'Kategori',
        href: '/categories',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h8M4 18h8" />
                <circle cx="18" cy="16" r="3" strokeWidth={2}/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 19l-1.5-1.5"/>
            </svg>
        ),
    },
    {
        label: 'Produk',
        href: '/products',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
        ),
    },
    {
        label: 'Pencatatan Stok',
        href: '/stock',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    {
        label: 'Promo & Diskon',
        href: '/promos',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
        ),
    },
    {
        label: 'Performa Produk',
        href: '/performance',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
    },
    {
        label: 'Laporan',
        href: '/reports',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
    },
    {
        label: 'Pesanan',
        href: '/orders',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 13h2m14 0h2" />
            </svg>
        ),
    },
    {
        label: 'Refund',
        href: '/refunds',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
        ),
    },
    {
        label: 'Daftar User',
        href: '/users',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
];

function SidebarItem({ item, currentUrl }) {
    const path = window.location.pathname;
    const isActive = item.href === '/dashboard'
        ? path === '/dashboard'
        : path === item.href || path.startsWith(item.href + '/');
    return (
        <Link
            href={item.href}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 14px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.15s',
                marginBottom: 2,
                background: isActive ? '#16a34a' : 'transparent',
                color: isActive ? '#fff' : '#374151',
            }}
            onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.color = '#16a34a'; } }}
            onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#374151'; } }}
        >
            <span style={{ opacity: isActive ? 1 : 0.65 }}>{item.icon}</span>
            {item.label}
        </Link>
    );
}

export default function AdminLayout({ children, pageTitle }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const currentUrl = window.location.pathname;
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => router.post(route('logout'));

    const sidebarContent = (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Logo */}
            <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 42, height: 42,
                        background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 10px rgba(22,163,74,0.4)',
                        flexShrink: 0,
                    }}>
                        <svg width="22" height="22" fill="none" stroke="#fff" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                    </div>
                    <div>
                        <p style={{ fontWeight: 800, fontSize: 14, color: '#111827', margin: 0, lineHeight: 1 }}>Melodi POS</p>
                        <p style={{ fontSize: 11, color: '#6b7280', margin: '3px 0 0', lineHeight: 1 }}>Admin Panel</p>
                    </div>
                </div>
            </div>

            {/* Nav items */}
            <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
                {navItems.map(item => (
                    <SidebarItem key={item.href} item={item} currentUrl={currentUrl} />
                ))}
            </nav>

            {/* Logout */}
            <div style={{ padding: '12px 10px', borderTop: '1px solid #e5e7eb' }}>
                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        width: '100%', padding: '9px 14px',
                        background: 'transparent', border: 'none',
                        borderRadius: 8, fontSize: 13, fontWeight: 500,
                        color: '#dc2626', cursor: 'pointer', transition: 'all 0.15s',
                        textAlign: 'left',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </button>
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', height: '100vh', background: '#f3f4f6', overflow: 'hidden', fontFamily: "'Inter','Segoe UI',sans-serif" }}>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 20 }}
                    onClick={() => setMobileOpen(false)} />
            )}

            {/* Sidebar Desktop */}
            <aside style={{
                width: 220,
                background: '#fff',
                borderRight: '1px solid #e5e7eb',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
                zIndex: 10,
            }}>
                {sidebarContent}
            </aside>

            {/* Sidebar Mobile Drawer */}
            <aside style={{
                position: 'fixed', top: 0, left: 0, height: '100%',
                width: 220, background: '#fff',
                borderRight: '1px solid #e5e7eb',
                zIndex: 30,
                transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.25s ease',
            }}>
                {sidebarContent}
            </aside>

            {/* Main area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

                {/* Top Header */}
                <header style={{
                    background: '#fff',
                    borderBottom: '1px solid #e5e7eb',
                    padding: '0 24px',
                    height: 56,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexShrink: 0,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: 32, height: 32, borderRadius: 6,
                                border: 'none', background: 'transparent',
                                color: '#374151', cursor: 'pointer',
                            }}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        {pageTitle && (
                            <h1 style={{ fontSize: 15, fontWeight: 600, color: '#111827', margin: 0 }}>{pageTitle}</h1>
                        )}
                    </div>

                    {/* User info */}
                    {user && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0 }}>{user.name}</p>
                                <p style={{ fontSize: 11, color: '#6b7280', margin: 0, textTransform: 'capitalize' }}>{user.role}</p>
                            </div>
                            <div style={{
                                width: 34, height: 34,
                                background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                                borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff', fontWeight: 700, fontSize: 14,
                                flexShrink: 0,
                            }}>
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    )}
                </header>

                {/* Page content */}
                <main style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
