import React, { Suspense, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Points, PointMaterial } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

// 3D Moving Price Line
const MarketLine = ({ color, dashSize = 0.5, speed = 1, yOffset = 0 }) => {
  const lineRef = useRef();
  
  const points = useMemo(() => {
    const tempPoints = [];
    for (let i = 0; i < 50; i++) {
      tempPoints.push(new THREE.Vector3(i - 25, Math.sin(i * 0.5) * 1.5 + yOffset, (Math.random() - 0.5) * 2));
    }
    return tempPoints;
  }, [yOffset]);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);

  useFrame((state) => {
    if (lineRef.current) {
        lineRef.current.position.x -= 0.05 * speed;
        if (lineRef.current.position.x < -20) lineRef.current.position.x = 20;
    }
  });

  return (
    <mesh ref={lineRef}>
        <tubeGeometry args={[curve, 64, 0.02, 8, false]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.6} />
    </mesh>
  );
};

// 3D Floating Candlesticks
const FloatingCandle = ({ position, color, height = 1 }) => {
    const meshRef = useRef();
    
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.position.y += Math.sin(time + position[0]) * 0.005;
            meshRef.current.rotation.y += 0.01;
        }
    });

    return (
        <group position={position} ref={meshRef}>
            {/* Box Body */}
            <mesh>
                <boxGeometry args={[0.3, height, 0.3]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} transparent opacity={0.8} />
            </mesh>
            {/* Wick */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.02, height * 1.5, 0.02]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
            </mesh>
        </group>
    );
};

const Finance3DScene = ({ mouseX, mouseY, isDiving }) => {
    const sceneRef = useRef();
    const zoomRef = useRef(0);

    useFrame((state) => {
        if (sceneRef.current) {
            // Mouse parallax effect for the whole 3D scene
            const targetRotY = isDiving ? 0 : mouseX * 0.1;
            const targetRotX = isDiving ? 0 : -mouseY * 0.1;
            
            sceneRef.current.rotation.y = THREE.MathUtils.lerp(sceneRef.current.rotation.y, targetRotY, 0.05);
            sceneRef.current.rotation.x = THREE.MathUtils.lerp(sceneRef.current.rotation.x, targetRotX, 0.05);
            
            // Diving Effect: Move scene toward camera
            if (isDiving) {
                zoomRef.current = THREE.MathUtils.lerp(zoomRef.current, 1, 0.03);
                // Accelerate forward movement
                sceneRef.current.position.z += zoomRef.current * 2;
                // Add extreme scale up to feel like elements are rushing past
                const scaleVal = 1 + zoomRef.current * 10;
                sceneRef.current.scale.set(scaleVal, scaleVal, scaleVal);
            }
        }
    });

    // Generate balanced candlestick data using a jittered grid
    const candles = useMemo(() => {
        const temp = [];
        const columns = 8;
        const rows = 6;
        const width = 60;
        const height = 30;
        
        for (let c = 0; c < columns; c++) {
            for (let r = 0; r < rows; r++) {
                // Base grid position
                const x = (c / columns - 0.5) * width;
                const y = (r / rows - 0.5) * height;
                
                // Add jitter (randomness within the grid cell)
                const jitterX = (Math.random() - 0.5) * (width / columns);
                const jitterY = (Math.random() - 0.5) * (height / rows);
                
                temp.push({
                    position: [x + jitterX, y + jitterY, (Math.random() - 1.2) * 15],
                    color: Math.random() > 0.5 ? '#10b981' : '#ef4444',
                    height: 0.5 + Math.random() * 2
                });
            }
        }
        return temp;
    }, []);

    // Generate particles for market data
    const particles = useMemo(() => {
        const positions = new Float32Array(2000 * 3);
        for (let i = 0; i < 2000; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
        }
        return positions;
    }, []);

    return (
        <group ref={sceneRef}>
            <Points positions={particles}>
                <PointMaterial transparent color="var(--primary)" size={0.05} sizeAttenuation={true} depthWrite={false} opacity={0.4} />
            </Points>
            {candles.map((c, i) => (
                <FloatingCandle key={i} {...c} />
            ))}
            <MarketLine color="var(--primary)" speed={1} yOffset={2} />
            <MarketLine color="var(--chart2)" speed={0.8} yOffset={-3} />
            <MarketLine color="var(--primary)" speed={1.2} yOffset={0} />
        </group>
    );
};

const LandingPage = () => {
    const navigate = useNavigate();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [showLearnMore, setShowLearnMore] = useState(false);
    const [isDiving, setIsDiving] = useState(false);
    const cardRef = useRef();

    const handleMouseMove = (e) => {
        if (isDiving) return;
        // Calculate mouse position from -1 to 1
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = (e.clientY / window.innerHeight) * 2 - 1;
        setMousePos({ x, y });

        // Calculate card tilt (max 10 degrees)
        if (cardRef.current && !showLearnMore) {
            const tiltX = -y * 10;
            const tiltY = x * 10;
            cardRef.current.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            cardRef.current.style.transition = 'none'; // smooth tracking
        }
    };

    const handleMouseLeave = () => {
        if (cardRef.current && !isDiving) {
            cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
            cardRef.current.style.transition = 'transform 0.5s ease-out'; // smooth return
        }
    };

    const handleEnterPlatform = (e) => {
        // Step 1: Button slight press
        const btn = e.currentTarget;
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => { btn.style.transform = 'scale(1)'; }, 100);

        // Step 2-4: Dive Sequence
        setIsDiving(true);
        if (cardRef.current) {
            cardRef.current.style.transition = 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.8s ease-out 0.2s, filter 0.8s ease-out 0.2s';
            cardRef.current.style.transform = 'perspective(1000px) translateZ(400px) rotateX(-20deg) scale(1.25)';
            cardRef.current.style.opacity = '0';
            cardRef.current.style.filter = 'blur(10px)';
        }

        // Step 5: Smooth Crossfade into dashboard
        setTimeout(() => {
            navigate('/dashboard');
        }, 1200);
    };

    return (
        <div 
            onMouseMove={handleMouseMove} 
            onMouseLeave={handleMouseLeave}
            style={{
                width: '100vw',
                height: '100vh',
                background: 'var(--bg-deep)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                color: 'var(--text-primary)'
            }}
        >
            {/* Immersive 3D Fintech Scene */}
            <div style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%', 
                zIndex: 1 
            }}>
                <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
                    <ambientLight intensity={0.2} />
                    <pointLight position={[10, 10, 10]} intensity={1} color="var(--primary)" />
                    <Suspense fallback={null}>
                        <Finance3DScene mouseX={mousePos.x} mouseY={mousePos.y} isDiving={isDiving} />
                    </Suspense>
                </Canvas>
            </div>

            {/* Content Overlay with 3D Tilt */}
            <div 
                ref={cardRef}
                style={{ 
                    zIndex: 10, 
                    textAlign: 'center', 
                    padding: 'var(--space-2xl)',
                    maxWidth: '800px',
                    background: 'rgba(5, 5, 7, 0.4)',
                    backdropFilter: 'blur(30px) saturate(180%)',
                    borderRadius: '24px',
                    border: '1px solid var(--border)',
                    boxShadow: `0 0 100px rgba(6, 182, 212, ${Math.abs(mousePos.x) * 0.15 + 0.05})`,
                    transformStyle: 'preserve-3d',
                    willChange: 'transform',
                    display: showLearnMore ? 'none' : 'block'
                }} 
                className="animate-in"
            >
                <div style={{ transform: 'translateZ(50px)' }}>
                    <h4 className="label" style={{ color: 'var(--primary)', marginBottom: '16px' }}>Terminal v2.0</h4>
                    <h1 style={{ fontSize: '64px', marginBottom: '24px', letterSpacing: '-2px' }}>
                        AlgoBacktest <span style={{ color: 'var(--primary)' }}>Terminal</span>
                    </h1>
                    <p style={{ 
                        fontSize: '18px', 
                        color: 'var(--text-secondary)', 
                        marginBottom: '40px', 
                        lineHeight: 1.6,
                        maxWidth: '600px',
                        margin: '0 auto 40px'
                    }}>
                        Instant institutional analytics. High-fidelity visualization. 
                        Interactive market strategy simulation at scale.
                    </p>
                    
                    <div className="flex items-center justify-center gap-lg">
                        <button 
                            className="btn btn-primary btn-lg btn-glow" 
                            style={{ padding: '20px 40px', fontSize: '18px', transition: 'transform 0.1s ease' }}
                            onClick={handleEnterPlatform}
                            disabled={isDiving}
                        >
                            ENTER PLATFORM
                        </button>
                        <button 
                            className="btn btn-ghost btn-lg hover-scale" 
                            style={{ padding: '20px 40px', fontSize: '18px' }}
                            onClick={() => setShowLearnMore(true)}
                            disabled={isDiving}
                        >
                            LEARN MORE
                        </button>
                    </div>
                </div>
                
                {/* Subtle dynamic data pattern behind the card */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: -1,
                    opacity: 0.1,
                    backgroundImage: 'repeating-linear-gradient(45deg, var(--border) 0px, var(--border) 1px, transparent 1px, transparent 10px)',
                    animation: 'pulse 4s infinite'
                }} />
            </div>

            {/* Transition Fade Overlay */}
            {isDiving && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 1000,
                    background: 'var(--bg-deep)',
                    opacity: 0,
                    pointerEvents: 'none',
                    animation: 'fadeIn 0.4s ease-out 0.8s forwards'
                }} />
            )}

            {/* Onboarding Terminal (Learn More) */}
            {showLearnMore && (
                <div style={{
                    position: 'absolute',
                    zIndex: 100,
                    width: '95%',
                    maxWidth: '900px',
                    maxHeight: '90vh',
                    background: 'rgba(5, 5, 8, 0.85)',
                    backdropFilter: 'blur(50px) saturate(200%)',
                    borderRadius: '40px',
                    border: '1px solid var(--border)',
                    padding: 'var(--space-2xl)',
                    overflowY: 'auto',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 20px rgba(6, 182, 212, 0.1)',
                    transform: 'perspective(1000px) translate3d(0,0,100px)',
                    animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) both'
                }}>
                    <div className="flex justify-between items-start" style={{ marginBottom: 'var(--space-2xl)' }}>
                        <div>
                            <h4 className="label mb-sm" style={{ color: 'var(--primary)', letterSpacing: '2px' }}>SYSTEM ONBOARDING</h4>
                            <h2 style={{ fontSize: '42px', margin: 0, letterSpacing: '-1.5px' }}>Terminal Orientation</h2>
                        </div>
                        <button 
                            className="btn btn-ghost btn-sm btn-active" 
                            style={{ borderRadius: '50%', width: '44px', height: '44px', padding: 0, fontSize: '20px' }}
                            onClick={() => setShowLearnMore(false)}
                        >
                            ✕
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 'var(--space-2xl)', textAlign: 'left' }}>
                        {/* Core Concept */}
                        <div className="card-hover" style={{ padding: 'var(--space-xl)', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid var(--border)' }}>
                            <div className="flex items-center gap-md mb-lg">
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                </div>
                                <h3 style={{ margin: 0 }}>Strategic Simulation</h3>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '15px' }}>
                                AlgoBacktest transforms historical market data into a high-fidelity laboratory. Validate quantitative hypotheses against real-world volatility without capital exposure.
                            </p>
                        </div>

                        {/* How to use Step-by-Step */}
                        <div style={{ padding: 'var(--space-xl)' }}>
                            <h3 style={{ marginBottom: 'var(--space-xl)', fontSize: '20px' }}>Operational Steps</h3>
                            <div className="flex-col gap-xl">
                                <div className="flex gap-lg items-start">
                                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary)', width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--primary)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>01</div>
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '16px' }}>Configure Asset Class</h4>
                                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>Select technical tickers and define historical lookback window.</p>
                                    </div>
                                </div>
                                <div className="flex gap-lg items-start">
                                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary)', width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--primary)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>02</div>
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '16px' }}>Inject Logic & Params</h4>
                                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>Deploy indicators like RSI or MACD and tune sensitivity thresholds.</p>
                                    </div>
                                </div>
                                <div className="flex gap-lg items-start">
                                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary)', width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--primary)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>03</div>
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '16px' }}>Review Analytics</h4>
                                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>Analyze Sharpe Ratio, drawdown, and win-rate curves instantly.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ marginTop: 'var(--space-2xl)', background: 'var(--bg-deep)', border: '1px dashed var(--primary-dim)', padding: 'var(--space-xl)', borderRadius: '20px' }}>
                        <div className="flex items-start gap-lg">
                            <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--primary-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 8px' }}>Institutional Grade Metric: Sharpe Ratio</h4>
                                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                                    Standard analysis focuses on profit. Our terminal prioritizes the <strong>risk-adjusted return</strong>. 
                                    A high Sharpe Ratio confirms a strategy built on robust logic rather than variance.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button 
                        className="btn btn-primary btn-lg w-full btn-glow btn-active" 
                        style={{ marginTop: 'var(--space-2xl)', padding: '24px', fontSize: '18px', borderRadius: '20px' }}
                        onClick={handleEnterPlatform}
                    >
                        INITIALIZE TERMINAL SESSION
                    </button>
                </div>
            )}
            <div style={{
                position: 'absolute',
                bottom: '-20%',
                left: 0,
                width: '100%',
                height: '60%',
                backgroundImage: 'linear-gradient(to top, var(--bg-deep), transparent), radial-gradient(var(--primary-dim) 1px, transparent 1px)',
                backgroundSize: '100% 100%, 50px 50px',
                zIndex: 2,
                opacity: 0.2,
                transform: `perspective(500px) rotateX(60deg) translateY(${mousePos.y * 10}px)`,
                pointerEvents: 'none'
            }} />
        </div>
    );
};

export default LandingPage;
