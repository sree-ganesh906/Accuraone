/**
 * ScrollVelocity Component - Vanilla JS implementation matching React Bits ScrollVelocity logic.
 * Dynamically scrolls text horizontally rightward with acceleration based on page scroll speed.
 */
function initScrollVelocity(containerId, text, baseVelocity = 100) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const scroller = container.querySelector('.scroller') || container;
    scroller.innerHTML = '';
    
    const numCopies = 12;
    for (let i = 0; i < numCopies; i++) {
        const item = document.createElement('div');
        item.className = 'scroller-item';
        if (i === 0) {
            item.id = 'scroller-first-item';
        }
        
        const span = document.createElement('span');
        span.textContent = text;
        item.appendChild(span);
        
        const img = document.createElement('img');
        img.src = 'logo_icon_white.png';
        img.className = 'marquee-icon-img';
        img.alt = 'Logo Icon';
        item.appendChild(img);
        
        scroller.appendChild(item);
    }
    
    let currentX = 0;
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let lastTime = performance.now();
    
    // Track page scroll velocity dynamically
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        scrollVelocity = Math.abs(currentScrollY - lastScrollY);
        lastScrollY = currentScrollY;
    }, { passive: true });
    
    let isInView = true;
    let isLoopRunning = true;
    const observer = new IntersectionObserver((entries) => {
        isInView = entries[0].isIntersecting;
        if (isInView && !isLoopRunning) {
            isLoopRunning = true;
            lastTime = performance.now();
            requestAnimationFrame(update);
        }
    }, { threshold: 0 });
    observer.observe(container);

    function update(time) {
        if (!isInView) {
            isLoopRunning = false;
            return;
        }
        const delta = (time - lastTime) / 1000;
        lastTime = time;
        
        // Decay the velocity multiplier smoothly
        scrollVelocity *= 0.95;
        if (scrollVelocity < 0.1) scrollVelocity = 0;
        
        // Scroll leftwards by subtracting moveBy
        const speedMultiplier = 1 + (scrollVelocity * 0.15); 
        const moveBy = baseVelocity * delta * speedMultiplier;
        
        currentX -= moveBy;
        
        const firstItem = document.getElementById('scroller-first-item');
        if (firstItem) {
            const itemWidth = firstItem.offsetWidth;
            if (itemWidth > 0) {
                // Seamless wrapping logic for leftward scroll
                if (currentX <= -itemWidth) {
                    currentX = currentX % itemWidth;
                }
            }
        }
        
        scroller.style.transform = `translate3d(${currentX}px, 0, 0)`;
        requestAnimationFrame(update);
    }
    
    requestAnimationFrame(update);
}

window.initScrollVelocity = initScrollVelocity;
