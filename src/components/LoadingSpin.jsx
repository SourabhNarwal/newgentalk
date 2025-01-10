import React from 'react'

const LoadingSpin = () => {
    const loadingSplashStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(to right, #98fb98, #ffa07a, #ffffe0, #ffb6c1)',
    };
    const spinnerStyle = {
        border: '16px solid #f3f3f3',
        borderTop: '16px solid #3498db',
        borderRadius: '50%', width: '120px',
        height: '120px', animation: 'spin 2s linear infinite',
    };
    const textStyle = {
        marginTop: '20px',
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333',
    };
    return (
        <div style={loadingSplashStyle}>
            <div style={spinnerStyle} />
            <p style={textStyle}>Loading, please wait...</p>
        </div>
    );
}

export default LoadingSpin