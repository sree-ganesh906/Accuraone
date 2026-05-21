document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined') {
        console.error("GSAP is required for MagicBento animations.");
        return;
    }

    const GLOW_COLOR = '132, 0, 255';
    const SPOTLIGHT_RADIUS = 300;
    const PARTICLE_COUNT = 12;

    // 1. Global Spotlight
    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${GLOW_COLOR}, 0.15) 0%,
        rgba(${GLOW_COLOR}, 0.08) 15%,
        rgba(${GLOW_COLOR}, 0.04) 25%,
        rgba(${GLOW_COLOR}, 0.02) 40%,
        rgba(${GLOW_COLOR}, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
    document.body.appendChild(spotlight);

    const cards = document.querySelectorAll('.magic-bento-card');
    const sections = document.querySelectorAll('.bento-section');

    document.addEventListener('mousemove', (e) => {
        let mouseInside = false;
        for (const section of sections) {
            const rect = section.getBoundingClientRect();
            if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
                mouseInside = true;
                break;
            }
        }

        if (!mouseInside) {
            gsap.to(spotlight, { opacity: 0, duration: 0.3, ease: 'power2.out' });
            cards.forEach(card => card.style.setProperty('--glow-intensity', '0'));
            return;
        }

        const proximity = SPOTLIGHT_RADIUS * 0.5;
        const fadeDistance = SPOTLIGHT_RADIUS * 0.75;
        let minDistance = Infinity;

        cards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            const centerX = cardRect.left + cardRect.width / 2;
            const centerY = cardRect.top + cardRect.height / 2;
            const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
            const effectiveDistance = Math.max(0, distance);

            minDistance = Math.min(minDistance, effectiveDistance);

            let glowIntensity = 0;
            if (effectiveDistance <= proximity) {
                glowIntensity = 1;
            } else if (effectiveDistance <= fadeDistance) {
                glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
            }

            const relativeX = ((e.clientX - cardRect.left) / cardRect.width) * 100;
            const relativeY = ((e.clientY - cardRect.top) / cardRect.height) * 100;

            card.style.setProperty('--glow-x', `${relativeX}%`);
            card.style.setProperty('--glow-y', `${relativeY}%`);
            card.style.setProperty('--glow-intensity', glowIntensity.toString());
            card.style.setProperty('--glow-radius', `${SPOTLIGHT_RADIUS}px`);
        });

        gsap.to(spotlight, { left: e.clientX, top: e.clientY, duration: 0.1, ease: 'power2.out' });

        const targetOpacity = minDistance <= proximity ? 0.8 : minDistance <= fadeDistance ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8 : 0;
        gsap.to(spotlight, { opacity: targetOpacity, duration: targetOpacity > 0 ? 0.2 : 0.5, ease: 'power2.out' });
    });

    document.addEventListener('mouseleave', () => {
        cards.forEach(card => card.style.setProperty('--glow-intensity', '0'));
        gsap.to(spotlight, { opacity: 0, duration: 0.3, ease: 'power2.out' });
    });

    // 2. Card Interactions
    cards.forEach(card => {
        let isHovered = false;
        let particles = [];
        let timeouts = [];
        let magnetismAnimation = null;
        let particlesInitialized = false;
        let memoizedParticles = [];

        card.classList.add('particle-container', 'magic-bento-card--border-glow');

        const createParticleElement = (x, y) => {
            const el = document.createElement('div');
            el.className = 'particle';
            el.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background: rgba(${GLOW_COLOR}, 1);
                box-shadow: 0 0 6px rgba(${GLOW_COLOR}, 0.6);
                pointer-events: none;
                z-index: 100;
                left: ${x}px;
                top: ${y}px;
            `;
            return el;
        };

        const initializeParticles = () => {
            if (particlesInitialized) return;
            const rect = card.getBoundingClientRect();
            memoizedParticles = Array.from({ length: PARTICLE_COUNT }, () =>
                createParticleElement(Math.random() * rect.width, Math.random() * rect.height)
            );
            particlesInitialized = true;
        };

        const clearAllParticles = () => {
            timeouts.forEach(clearTimeout);
            timeouts = [];
            if (magnetismAnimation) magnetismAnimation.kill();

            particles.forEach(p => {
                gsap.to(p, {
                    scale: 0, opacity: 0, duration: 0.3, ease: 'back.in(1.7)',
                    onComplete: () => p.remove()
                });
            });
            particles = [];
        };

        const animateParticles = () => {
            if (!isHovered) return;
            if (!particlesInitialized) initializeParticles();

            memoizedParticles.forEach((particle, index) => {
                const timeoutId = setTimeout(() => {
                    if (!isHovered) return;
                    const clone = particle.cloneNode(true);
                    card.appendChild(clone);
                    particles.push(clone);

                    gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });
                    gsap.to(clone, {
                        x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 100, rotation: Math.random() * 360,
                        duration: 2 + Math.random() * 2, ease: 'none', repeat: -1, yoyo: true
                    });
                    gsap.to(clone, { opacity: 0.3, duration: 1.5, ease: 'power2.inOut', repeat: -1, yoyo: true });
                }, index * 100);
                timeouts.push(timeoutId);
            });
        };

        card.addEventListener('mouseenter', () => {
            if (window.innerWidth <= 768) return;
            isHovered = true;
            animateParticles();
            gsap.to(card, { rotateX: 2, rotateY: 2, duration: 0.3, ease: 'power2.out', transformPerspective: 1000 });
        });

        card.addEventListener('mouseleave', () => {
            if (window.innerWidth <= 768) return;
            isHovered = false;
            clearAllParticles();
            gsap.to(card, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.3, ease: 'power2.out' });
        });

        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;
            gsap.to(card, { rotateX, rotateY, duration: 0.1, ease: 'power2.out', transformPerspective: 1000 });

            const magnetX = (x - centerX) * 0.05;
            const magnetY = (y - centerY) * 0.05;
            magnetismAnimation = gsap.to(card, { x: magnetX, y: magnetY, duration: 0.3, ease: 'power2.out' });
        });

        card.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const maxDistance = Math.max(Math.hypot(x, y), Math.hypot(x - rect.width, y), Math.hypot(x, y - rect.height), Math.hypot(x - rect.width, y - rect.height));

            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                width: ${maxDistance * 2}px;
                height: ${maxDistance * 2}px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(${GLOW_COLOR}, 0.4) 0%, rgba(${GLOW_COLOR}, 0.2) 30%, transparent 70%);
                left: ${x - maxDistance}px;
                top: ${y - maxDistance}px;
                pointer-events: none;
                z-index: 1000;
            `;
            card.appendChild(ripple);

            gsap.fromTo(ripple, { scale: 0, opacity: 1 }, { scale: 1, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => ripple.remove() });
        });
    });
});
