import React, { useRef, useState } from 'react';

/**
 * A wrapper component that adds a 3D tilt effect to its children on mouse move.
 * Uses CSS transforms for high performance.
 */
const TiltCard = ({ children, className = '', style = {}, intensity = 10 }) => {
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();

        // Calculate mouse position relative to card center (from -1 to 1)
        const x = (e.clientX - rect.left) / rect.width * 2 - 1;
        const y = (e.clientY - rect.top) / rect.height * 2 - 1;

        // Apply tilt (X-axis rotation is based on Y-mouse, Y-axis on X-mouse)
        const tiltX = -y * intensity;
        const tiltY = x * intensity;

        cardRef.current.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        cardRef.current.style.transition = 'none'; // Instant tracking

        // Dynamic glow following the cursor
        const glowX = (e.clientX - rect.left) / rect.width * 100;
        const glowY = (e.clientY - rect.top) / rect.height * 100;
        cardRef.current.style.backgroundImage = `radial-gradient(circle at ${glowX}% ${glowY}%, var(--primary-dim) 0%, transparent 80%)`;
    };

    const handleMouseLeave = () => {
        if (!cardRef.current) return;
        cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        cardRef.current.style.transition = 'transform 0.5s ease-out, background-image 0.5s ease-out';
        cardRef.current.style.backgroundImage = 'none';
    };

    return (
        <div
            ref={cardRef}
            className={`card ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                ...style,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <div style={{ transform: 'translateZ(20px)', height: '100%' }}>
                {children}
            </div>
        </div>
    );
};

export default TiltCard;
