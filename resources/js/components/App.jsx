import React, { useState } from 'react';

export default function App() {
    const [count, setCount] = useState(0);

    return (
        <div style={{ textAlign: 'center', marginTop: '4rem', fontFamily: 'sans-serif' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                🎸 Laravel + React Siap Digunakan!
            </h1>
            <p style={{ color: '#555', marginBottom: '2rem' }}>
                Selamat datang di project <strong>PDPLAlatMusik</strong>
            </p>
            <button
                onClick={() => setCount(count + 1)}
                style={{
                    padding: '0.6rem 1.4rem',
                    fontSize: '1rem',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                }}
            >
                Klik saya: {count}
            </button>
        </div>
    );
}
