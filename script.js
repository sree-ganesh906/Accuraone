document.addEventListener('DOMContentLoaded', () => {
    // 1. Preloader Assembly Logic
    const preloader = document.getElementById('preloader');
    
    // Ensure smooth load out after animation
    setTimeout(() => {
        preloader.style.opacity = '0';
        if (window.logoEffectInstance && typeof window.logoEffectInstance.assemble === 'function') {
            window.logoEffectInstance.assemble();
        }
        setTimeout(() => {
            preloader.style.visibility = 'hidden';
            preloader.style.display = 'none';
        }, 1000);
    }, 3000); // 3 seconds matching the CSS animations duration + buffer

    // 2. Header Scroll Effect & Active Nav Link updating
    const header = document.getElementById('main-header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-item');
    const skyline = document.querySelector('.hero-skyline');

    let sectionDimensions = [];
    function updateSectionDimensions() {
        sectionDimensions = Array.from(sections).map(section => ({
            id: section.getAttribute('id'),
            top: section.offsetTop,
            height: section.clientHeight
        }));
    }

    let isScrollTicking = false;
    let cachedScrollY = 0;

    function onScroll() {
        cachedScrollY = window.scrollY;
        if (!isScrollTicking) {
            window.requestAnimationFrame(updateScrollElements);
            isScrollTicking = true;
        }
    }

    function updateScrollElements() {
        // Header background toggle
        if (cachedScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active link highlighting based on cached offsets
        let current = '';
        sectionDimensions.forEach(dim => {
            if (cachedScrollY >= (dim.top - 200)) {
                current = dim.id;
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.includes(current)) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Parallax Scrolling on Skyline
        if (skyline && cachedScrollY < window.innerHeight) {
            const speed = skyline.getAttribute('data-speed') || 0.3;
            skyline.style.transform = `translate3d(0, ${cachedScrollY * speed}px, 0)`;
        }

        isScrollTicking = false;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateSectionDimensions);
    window.addEventListener('load', updateSectionDimensions);
    updateSectionDimensions();

    // 3. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-links');
    const toggleIcon = menuToggle.querySelector('i');

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('nav-active');
        if (navMenu.classList.contains('nav-active')) {
            toggleIcon.classList.remove('fa-bars');
            toggleIcon.classList.add('fa-times');
        } else {
            toggleIcon.classList.remove('fa-times');
            toggleIcon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('nav-active');
            toggleIcon.classList.remove('fa-times');
            toggleIcon.classList.add('fa-bars');
        });
    });

    // 4. Hero Background Fading (Evolving Partnership)
    const faders = document.querySelectorAll('.hero-fader');
    let currentFader = 0;

    if(faders.length > 0) {
        // start first
        faders[0].classList.add('active');
        
        setInterval(() => {
            faders[currentFader].classList.remove('active');
            currentFader = (currentFader + 1) % faders.length;
            faders[currentFader].classList.add('active');
        }, 5000); // Crossfade every 5 seconds
    }

    // 5. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    
    // Failsafe: force active class on all reveal elements on mobile/tablet viewports to ensure they are visible
    if (window.innerWidth <= 1024) {
        revealElements.forEach(el => {
            el.classList.add('active');
        });
    }
    
    const revealOptions = {
        threshold: 0.05,
        rootMargin: "0px 0px -20px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 6. Anti-Gravity Floating Icons (Mouse Move 3D Effect)
    const heroSection = document.querySelector('.hero');
    const floatingIcons = document.querySelectorAll('.float-icon');

    if (heroSection && floatingIcons.length > 0) {
        let mouseX = 0;
        let mouseY = 0;
        let isMouseTicking = false;

        heroSection.addEventListener('mousemove', (e) => {
            mouseX = e.pageX;
            mouseY = e.pageY;
            if (!isMouseTicking) {
                window.requestAnimationFrame(updateFloatingIcons);
                isMouseTicking = true;
            }
        });

        function updateFloatingIcons() {
            const xAxis = (window.innerWidth / 2 - mouseX) / 25;
            const yAxis = (window.innerHeight / 2 - mouseY) / 25;

            floatingIcons.forEach(icon => {
                // Different depth multiplier for varied effect
                const zElement = icon.getAttribute('data-z') || 100;
                const multiplier = zElement / 100;
                
                // Add the smooth translation to the existing float animation
                icon.style.transform = `translate3d(${xAxis * multiplier}px, ${yAxis * multiplier}px, 0)`;
            });
            isMouseTicking = false;
        }

        // Reset when mouse leaves
        heroSection.addEventListener('mouseleave', () => {
            floatingIcons.forEach(icon => {
                icon.style.transform = `translate3d(0px, 0px, 0px)`;
                icon.style.transition = `transform 0.5s ease`;
            });
        });
        
        // Remove transition on enter to make it snappy with cursor
        heroSection.addEventListener('mouseenter', () => {
            floatingIcons.forEach(icon => {
                icon.style.transition = `none`;
            });
        });
    }

    // 7. Parallax Scrolling on Skyline (Merged into Section 2 Scroll Ticker)

    // 8. Contact Form Handling (Submit to WhatsApp + custom animations)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const msg = document.getElementById('message').value;
            
            const whatsappText = `Hello AccuraOne,

I would like to contact you regarding the following:
*Name:* ${name}
*Email:* ${email}
*Project Requirements:* ${msg}`;

            const encodedText = encodeURIComponent(whatsappText);
            const whatsappUrl = `https://wa.me/966540415103?text=${encodedText}`;
            
            // Open WhatsApp in a new tab
            window.open(whatsappUrl, '_blank');
            
            const btn = contactForm.querySelector('.btn-3d-flip .front');
            const originalText = btn.textContent;
            
            btn.textContent = "Synthesizing...";
            setTimeout(() => {
                btn.textContent = "Message Transmitted!";
                btn.style.backgroundColor = 'var(--clr-magenta)';
                contactForm.reset();
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = 'var(--clr-purple)';
                }, 3000);
            }, 1500);
        });
    }

    // 9. Interactive Particle Network Background
    const canvas = document.getElementById('network-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray;

        // Setup resize
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let mouse = {
            x: null,
            y: null,
            radius: (canvas.height/80) * (canvas.width/80)
        };

        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            mouse.radius = (canvas.height/80) * (canvas.width/80);
            initParticles();
        });

        // Create Particle
        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = '#DC0BAA'; // Magenta particles
                ctx.fill();
                
                // Outer glow
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2, false);
                ctx.fillStyle = 'rgba(220, 11, 170, 0.2)';
                ctx.fill();
            }

            update() {
                // Check if particle is still within canvas
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }

                // Check collision detection - mouse position / particle position
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx*dx + dy*dy);
                
                if (distance < mouse.radius + this.size){
                    if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                        this.x += 2;
                    }
                    if (mouse.x > this.x && this.x > this.size * 10) {
                        this.x -= 2;
                    }
                    if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                        this.y += 2;
                    }
                    if (mouse.y > this.y && this.y > this.size * 10) {
                        this.y -= 2;
                    }
                }
                
                // Move particle
                this.x += this.directionX;
                this.y += this.directionY;
                
                // Draw particle
                this.draw();
            }
        }

        function initParticles() {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 12000;
            // Less particles for better performance and elegant look
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * 0.4) - 0.2;
                let directionY = (Math.random() * 0.4) - 0.2;
                let color = '#DC0BAA';

                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        // Animation Loop
        function animateParticles() {
            requestAnimationFrame(animateParticles);
            ctx.clearRect(0,0,innerWidth, innerHeight);

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connectParticles();
        }

        // Check if particles are close enough to draw line
        function connectParticles() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                                   ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    
                    if (distance < (canvas.width/10) * (canvas.height/10)) {
                        opacityValue = 1 - (distance/15000); // 15000 for line visibility
                        ctx.strokeStyle = `rgba(99, 2, 96, ${opacityValue})`; // Purple lines
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        initParticles();
        animateParticles();
    }

    // 10. Lightbox for Gallery Images and Videos
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxVideo = document.getElementById('lightbox-video');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const galleryItems = document.querySelectorAll('.image-item img, .video-item video');
    let currentMediaIndex = -1;

    if (lightbox && galleryItems.length > 0) {
        const showMedia = (index) => {
            if (index < 0 || index >= galleryItems.length) return;
            const item = galleryItems[index];
            if (item.tagName.toLowerCase() === 'img') {
                lightboxImg.src = item.src;
                lightboxImg.style.display = 'block';
                if (lightboxVideo) {
                    lightboxVideo.style.display = 'none';
                    lightboxVideo.pause();
                    lightboxVideo.src = '';
                }
            } else if (item.tagName.toLowerCase() === 'video') {
                if (lightboxVideo) {
                    lightboxVideo.src = item.src;
                    lightboxVideo.style.display = 'block';
                    // Auto play the video in lightbox modal
                    lightboxVideo.play().catch(err => console.log('Video play interrupted:', err));
                }
                lightboxImg.style.display = 'none';
                lightboxImg.src = '';
            }
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                currentMediaIndex = index;
                showMedia(index);
                lightbox.classList.add('active');
                // Request native fullscreen
                if (lightbox.requestFullscreen) {
                    lightbox.requestFullscreen();
                } else if (lightbox.webkitRequestFullscreen) {
                    lightbox.webkitRequestFullscreen();
                }
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            currentMediaIndex = -1;
            if (lightboxVideo) {
                lightboxVideo.pause();
                lightboxVideo.src = '';
                lightboxVideo.style.display = 'none';
            }
            lightboxImg.src = '';
            lightboxImg.style.display = 'none';
            if (document.fullscreenElement || document.webkitFullscreenElement) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }
        };

        const navigateLightbox = (direction) => {
            if (currentMediaIndex === -1) return;
            if (direction === 'next') {
                currentMediaIndex = (currentMediaIndex + 1) % galleryItems.length;
            } else if (direction === 'prev') {
                currentMediaIndex = (currentMediaIndex - 1 + galleryItems.length) % galleryItems.length;
            }
            showMedia(currentMediaIndex);
        };

        // Close on X click
        lightboxClose.addEventListener('click', closeLightbox);

        // Navigation buttons click listeners
        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                navigateLightbox('prev');
            });
        }
        if (lightboxNext) {
            lightboxNext.addEventListener('click', (e) => {
                e.stopPropagation();
                navigateLightbox('next');
            });
        }

        // Close on clicking outside the media and navigation buttons
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'ArrowRight') {
                navigateLightbox('next');
            } else if (e.key === 'ArrowLeft') {
                navigateLightbox('prev');
            } else if (e.key === 'Escape') {
                closeLightbox();
            }
        });

        // Listen for native fullscreen exit to close lightbox
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
        document.addEventListener('webkitfullscreenchange', () => {
            if (!document.webkitFullscreenElement && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    // 11. Night Sky Canvas with Scrolling Stars (Zero-Dependency)
    const skyCanvas = document.getElementById('night-sky-canvas');
    if (skyCanvas) {
        const sCtx = skyCanvas.getContext('2d');
        let stars = [];
        let numStars = 100; // Reduced from 300 for optimization

        const resizeSky = () => {
            skyCanvas.width = window.innerWidth;
            skyCanvas.height = window.innerHeight;
            initStars();
        };

        class Star {
            constructor() {
                this.x = Math.random() * skyCanvas.width;
                this.y = Math.random() * skyCanvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.baseAlpha = Math.random() * 0.5 + 0.3;
                this.alpha = this.baseAlpha;
                this.blinkSpeed = Math.random() * 0.03 + 0.01;
                const colors = ['#914BC7', '#DC0BAA', '#8A2BE2', '#9400D3'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.parallaxFactor = Math.random() * 0.6 + 0.1;
            }

            draw(scrollY) {
                let displayY = (this.y - scrollY * this.parallaxFactor) % skyCanvas.height;
                if (displayY < 0) displayY += skyCanvas.height;

                this.alpha += this.blinkSpeed;
                if (this.alpha > 1 || this.alpha < 0.1) {
                    this.blinkSpeed = -this.blinkSpeed;
                }

                sCtx.globalAlpha = Math.abs(this.alpha);
                sCtx.fillStyle = this.color;
                // Fast rect rendering replaces slow circular arc path drawing
                sCtx.fillRect(this.x - this.size / 2, displayY - this.size / 2, this.size, this.size);
                sCtx.globalAlpha = 1.0;
            }
        }

        const initStars = () => {
            stars = [];
            for (let i = 0; i < numStars; i++) {
                stars.push(new Star());
            }
        };

        window.addEventListener('resize', resizeSky);
        resizeSky();

        let currentScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            currentScrollY = window.scrollY;
        }, { passive: true });

        let isTabActive = true;
        document.addEventListener('visibilitychange', () => {
            isTabActive = !document.hidden;
        });

        const animateSky = () => {
            if (isTabActive) {
                sCtx.clearRect(0, 0, skyCanvas.width, skyCanvas.height);
                stars.forEach(star => star.draw(currentScrollY));
            }
            requestAnimationFrame(animateSky);
        };

        animateSky();
    }

    // 12. Lightning WebGL Animation for Hero
    function initLightningBackground() {
        const canvas = document.getElementById('hero-lightning-canvas');
        if (!canvas) return;

        const hue = 230; // Matches Lightning component default
        const xOffset = 0;
        const speed = 1;
        const intensity = 1;
        const size = 1;

        const resizeCanvas = () => {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
        if (!gl) {
            console.error('WebGL not supported');
            return;
        }

        const vertexShaderSource = `
            attribute vec2 aPosition;
            void main() {
                gl_Position = vec4(aPosition, 0.0, 1.0);
            }
        `;

        const fragmentShaderSource = `
            precision mediump float;
            uniform vec2 iResolution;
            uniform float iTime;
            uniform float uHue;
            uniform float uXOffset;
            uniform float uSpeed;
            uniform float uIntensity;
            uniform float uSize;
            
            #define OCTAVE_COUNT 10

            vec3 hsv2rgb(vec3 c) {
                vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
                return c.z * mix(vec3(1.0), rgb, c.y);
            }

            float hash11(float p) {
                p = fract(p * .1031);
                p *= p + 33.33;
                p *= p + p;
                return fract(p);
            }

            float hash12(vec2 p) {
                vec3 p3 = fract(vec3(p.xyx) * .1031);
                p3 += dot(p3, p3.yzx + 33.33);
                return fract((p3.x + p3.y) * p3.z);
            }

            mat2 rotate2d(float theta) {
                float c = cos(theta);
                float s = sin(theta);
                return mat2(c, -s, s, c);
            }

            float noise(vec2 p) {
                vec2 ip = floor(p);
                vec2 fp = fract(p);
                float a = hash12(ip);
                float b = hash12(ip + vec2(1.0, 0.0));
                float c = hash12(ip + vec2(0.0, 1.0));
                float d = hash12(ip + vec2(1.0, 1.0));
                
                vec2 t = smoothstep(0.0, 1.0, fp);
                return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
            }

            float fbm(vec2 p) {
                float value = 0.0;
                float amplitude = 0.5;
                for (int i = 0; i < OCTAVE_COUNT; ++i) {
                    value += amplitude * noise(p);
                    p *= rotate2d(0.45);
                    p *= 2.0;
                    amplitude *= 0.5;
                }
                return value;
            }

            void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
                vec2 uv = fragCoord / iResolution.xy;
                uv = 2.0 * uv - 1.0;
                uv.x *= iResolution.x / iResolution.y;
                uv.x += uXOffset;
                
                uv += 2.0 * fbm(uv * uSize + 0.8 * iTime * uSpeed) - 1.0;
                
                float dist = abs(uv.x);
                vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, 0.7, 0.8));
                vec3 col = baseColor * pow(mix(0.0, 0.07, hash11(iTime * uSpeed)) / dist, 1.0) * uIntensity;
                col = pow(col, vec3(1.0));
                float a = clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0);
                fragColor = vec4(col, a);
            }

            void main() {
                mainImage(gl_FragColor, gl_FragCoord.xy);
            }
        `;

        const compileShader = (source, type) => {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Shader compile error:', gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
        const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
        if (!vertexShader || !fragmentShader) return;

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program linking error:', gl.getProgramInfoLog(program));
            return;
        }
        gl.useProgram(program);

        const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const aPosition = gl.getAttribLocation(program, 'aPosition');
        gl.enableVertexAttribArray(aPosition);
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

        const iResolutionLocation = gl.getUniformLocation(program, 'iResolution');
        const iTimeLocation = gl.getUniformLocation(program, 'iTime');
        const uHueLocation = gl.getUniformLocation(program, 'uHue');
        const uXOffsetLocation = gl.getUniformLocation(program, 'uXOffset');
        const uSpeedLocation = gl.getUniformLocation(program, 'uSpeed');
        const uIntensityLocation = gl.getUniformLocation(program, 'uIntensity');
        const uSizeLocation = gl.getUniformLocation(program, 'uSize');

        const startTime = performance.now();
        const render = () => {
            resizeCanvas();
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.uniform2f(iResolutionLocation, canvas.width, canvas.height);
            const currentTime = performance.now();
            gl.uniform1f(iTimeLocation, (currentTime - startTime) / 1000.0);
            gl.uniform1f(uHueLocation, hue);
            gl.uniform1f(uXOffsetLocation, xOffset);
            gl.uniform1f(uSpeedLocation, speed);
            gl.uniform1f(uIntensityLocation, intensity);
            gl.uniform1f(uSizeLocation, size);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
    }

    initLightningBackground();

    // 13. Service Card Click Glow & Color-Transition Animation
    const splitText = (el) => {
        if (!el || el.querySelector('.glow-char')) return;
        const text = el.textContent.trim().replace(/\s+/g, ' ');
        el.innerHTML = '';
        
        // Split by whitespace to keep words together so they wrap properly
        const parts = text.split(/(\s+)/);
        
        parts.forEach(part => {
            if (part.trim() === '') {
                // It's whitespace, wrap it in a space span
                const spaceSpan = document.createElement('span');
                spaceSpan.className = 'glow-space';
                spaceSpan.innerHTML = part.replace(/ /g, '&nbsp;');
                el.appendChild(spaceSpan);
            } else {
                // It's a word, wrap each character inside a word span
                const wordSpan = document.createElement('span');
                wordSpan.className = 'glow-word';
                wordSpan.style.display = 'inline-block';
                wordSpan.style.whiteSpace = 'nowrap';
                
                for (let i = 0; i < part.length; i++) {
                    const char = part[i];
                    const charSpan = document.createElement('span');
                    charSpan.className = 'glow-char';
                    charSpan.style.display = 'inline-block';
                    charSpan.textContent = char;
                    wordSpan.appendChild(charSpan);
                }
                el.appendChild(wordSpan);
            }
        });
    };

    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        const h3 = card.querySelector('h3');
        const p = card.querySelector('p');
        const icon = card.querySelector('.service-icon');
        
        card.addEventListener('click', () => {
            // Split text on first click
            if (h3) splitText(h3);
            if (p) splitText(p);
            
            const isGlowing = card.classList.contains('active-glow');
            const chars = card.querySelectorAll('.glow-char');
            
            if (!isGlowing) {
                card.classList.add('active-glow');
                
                // Animate card container to active glowing state
                gsap.to(card, {
                    borderColor: 'rgba(145, 75, 199, 0.8)',
                    boxShadow: '0 0 30px rgba(145, 75, 199, 0.5), 0 0 15px rgba(145, 75, 199, 0.25) inset',
                    y: -15,
                    duration: 0.5,
                    ease: 'power2.out'
                });
                
                // Make the icon pulse/glow stronger
                if (icon) {
                    gsap.to(icon, {
                        scale: 1.15,
                        filter: 'drop-shadow(0 0 25px #DC0BAA) drop-shadow(0 0 50px #6402B1)',
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                }
                
                // Staggered animation of characters turning glowing purple
                gsap.killTweensOf(chars);
                gsap.fromTo(chars, 
                    {
                        color: (index, target) => {
                            return target.closest('h3') ? '#ffffff' : '#b0a8ba';
                        },
                        textShadow: 'none'
                    },
                    {
                        color: '#d8b4fe', // Light violet/purple text color
                        textShadow: '0 0 8px rgba(145, 75, 199, 0.8), 0 0 15px rgba(100, 2, 177, 0.6)',
                        duration: 0.8,
                        stagger: 0.015, // Smooth flow character-by-character
                        ease: 'power2.out'
                    }
                );
            } else {
                card.classList.remove('active-glow');
                
                // Animate card container back to normal
                gsap.to(card, {
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    boxShadow: 'none',
                    y: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                });
                
                // Reset icon
                if (icon) {
                    gsap.to(icon, {
                        scale: 1.0,
                        filter: 'drop-shadow(0 0 10px var(--clr-magenta))',
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                }
                
                // Reset characters back to their original state
                gsap.killTweensOf(chars);
                
                const h3Chars = card.querySelectorAll('h3 .glow-char');
                const pChars = card.querySelectorAll('p .glow-char');
                
                if (h3Chars.length > 0) {
                    gsap.to(h3Chars, {
                        color: '#ffffff',
                        textShadow: 'none',
                        duration: 0.4,
                        stagger: 0.005,
                        ease: 'power2.out'
                    });
                }
                
                if (pChars.length > 0) {
                    gsap.to(pChars, {
                        color: '#b0a8ba',
                        textShadow: 'none',
                        duration: 0.4,
                        stagger: 0.005,
                        ease: 'power2.out'
                    });
                }
            }
        });
    });

    // 14. CEO Photo Click Glow & Color-Transition Animation
    const ceoPhoto = document.getElementById('ceo-photo');
    if (ceoPhoto) {
        const wrapper = ceoPhoto.closest('.ceo-wrapper');
        const h4 = wrapper ? wrapper.querySelector('.ceo-photo-container h4') : null;
        const span = wrapper ? wrapper.querySelector('.ceo-photo-container span') : null;
        const p = wrapper ? wrapper.querySelector('.ceo-text-container p') : null;
        
        ceoPhoto.addEventListener('click', () => {
            if (h4) splitText(h4);
            if (span) splitText(span);
            if (p) splitText(p);
            
            const isGlowing = ceoPhoto.classList.contains('active-glow');
            const chars = wrapper ? wrapper.querySelectorAll('.glow-char') : [];
            
            if (!isGlowing) {
                ceoPhoto.classList.add('active-glow');
                
                // Animate CEO photo itself to have a nice purple/violet shadow glow
                gsap.to(ceoPhoto, {
                    boxShadow: '0 0 35px rgba(145, 75, 199, 0.9), 0 0 15px rgba(145, 75, 199, 0.4)',
                    scale: 1.05,
                    duration: 0.5,
                    ease: 'power2.out'
                });
                
                // Staggered animation of characters turning glowing purple
                gsap.killTweensOf(chars);
                gsap.fromTo(chars, 
                    {
                        color: (index, target) => {
                            return target.closest('span') ? '#e0e0e0' : '#ffffff';
                        },
                        textShadow: 'none'
                    },
                    {
                        color: '#d8b4fe',
                        textShadow: '0 0 8px rgba(145, 75, 199, 0.8), 0 0 15px rgba(100, 2, 177, 0.6)',
                        duration: 0.8,
                        stagger: 0.008, // Faster stagger since paragraph text is longer
                        ease: 'power2.out'
                    }
                );
            } else {
                ceoPhoto.classList.remove('active-glow');
                
                // Animate CEO photo back to normal
                gsap.to(ceoPhoto, {
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    scale: 1.0,
                    duration: 0.5,
                    ease: 'power2.out'
                });
                
                // Reset characters back to their original state
                gsap.killTweensOf(chars);
                
                const h4Chars = wrapper ? wrapper.querySelectorAll('h4 .glow-char') : [];
                const spanChars = wrapper ? wrapper.querySelectorAll('span .glow-char') : [];
                const pChars = wrapper ? wrapper.querySelectorAll('p .glow-char') : [];
                
                if (h4Chars.length > 0) {
                    gsap.to(h4Chars, {
                        color: '#ffffff',
                        textShadow: 'none',
                        duration: 0.4,
                        stagger: 0.003,
                        ease: 'power2.out'
                    });
                }
                
                if (spanChars.length > 0) {
                    gsap.to(spanChars, {
                        color: '#e0e0e0',
                        textShadow: 'none',
                        duration: 0.4,
                        stagger: 0.003,
                        ease: 'power2.out'
                    });
                }
                
                if (pChars.length > 0) {
                    gsap.to(pChars, {
                        color: '#ffffff',
                        textShadow: 'none',
                        duration: 0.4,
                        stagger: 0.003,
                        ease: 'power2.out'
                    });
                }
            }
        });
    }

    // 15. Vendor & Certification Cards Click Glow & Color-Transition Animation
    const credentialCards = document.querySelectorAll('.vendor-card, .cert-card');
    credentialCards.forEach(card => {
        const isVendor = card.classList.contains('vendor-card');
        const header = isVendor ? card.querySelector('.vendor-text-wrapper h3') : card.querySelector('.bento-card-text h4');
        const p = isVendor ? card.querySelector('.vendor-text-wrapper p') : card.querySelector('.bento-card-text p');
        const badge = isVendor ? card.querySelector('.vendor-badge') : card.querySelector('.cert-badge');
        
        // Add cursor pointer style
        card.style.cursor = 'pointer';
        
        card.addEventListener('click', () => {
            // Split text on first click
            if (header) splitText(header);
            if (p) splitText(p);
            
            const isGlowing = card.classList.contains('active-glow');
            const chars = card.querySelectorAll('.glow-char');
            
            if (!isGlowing) {
                card.classList.add('active-glow');
                
                // Animate card container to active glowing state (blue glow)
                gsap.to(card, {
                    borderColor: 'rgba(142, 208, 235, 0.8)',
                    boxShadow: '0 0 35px rgba(142, 208, 235, 0.6), 0 0 15px rgba(142, 208, 235, 0.25) inset',
                    duration: 0.5,
                    ease: 'power2.out'
                });
                
                if (badge) {
                    gsap.to(badge, {
                        boxShadow: '0 0 20px rgba(142, 208, 235, 0.7)',
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                }
                
                // Staggered animation of characters turning glowing blue
                gsap.killTweensOf(chars);
                gsap.fromTo(chars, 
                    {
                        color: (index, target) => {
                            if (target.closest('h3') || target.closest('h4')) {
                                return '#8ED0EB';
                            }
                            return '#ffffff';
                        },
                        textShadow: 'none'
                    },
                    {
                        color: '#8ED0EB', // Exact blue header color
                        textShadow: '0 0 8px rgba(142, 208, 235, 0.8), 0 0 15px rgba(142, 208, 235, 0.5)',
                        duration: 0.8,
                        stagger: 0.012,
                        ease: 'power2.out'
                    }
                );
            } else {
                card.classList.remove('active-glow');
                
                // Animate card container back to normal
                gsap.to(card, {
                    borderColor: 'var(--clr-glass-border)',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
                    duration: 0.5,
                    ease: 'power2.out'
                });
                
                if (badge) {
                    gsap.to(badge, {
                        boxShadow: 'none',
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                }
                
                // Reset characters back to their original state
                gsap.killTweensOf(chars);
                
                const headerChars = card.querySelectorAll('h3 .glow-char, h4 .glow-char');
                const pChars = card.querySelectorAll('p .glow-char');
                
                if (headerChars.length > 0) {
                    gsap.to(headerChars, {
                        color: '#8ED0EB',
                        textShadow: 'none',
                        duration: 0.4,
                        stagger: 0.005,
                        ease: 'power2.out'
                    });
                }
                
                if (pChars.length > 0) {
                    gsap.to(pChars, {
                        color: '#ffffff',
                        textShadow: 'none',
                        duration: 0.4,
                        stagger: 0.005,
                        ease: 'power2.out'
                    });
                }
            }
        });
    });
});
