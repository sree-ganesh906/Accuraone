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

    window.addEventListener('scroll', () => {
        // Header background toggle
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active link highlighting based on scroll position
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

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
        heroSection.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;

            floatingIcons.forEach(icon => {
                // Different depth multiplier for varied effect
                const zElement = icon.getAttribute('data-z') || 100;
                const multiplier = zElement / 100;
                
                // Add the smooth translation to the existing float animation
                // Note: since CSS animations override transform sometimes, we update custom properties or transform directly carefully.
                // We use transform directly here but preserve string state.
                icon.style.transform = `translate3d(${xAxis * multiplier}px, ${yAxis * multiplier}px, 0)`;
            });
        });

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

    // 7. Parallax Scrolling on Skyline
    const skyline = document.querySelector('.hero-skyline');
    window.addEventListener('scroll', () => {
        if (skyline) {
            const scrollVal = window.scrollY;
            const speed = skyline.getAttribute('data-speed') || 0.3;
            if (scrollVal < window.innerHeight) {
                skyline.style.transform = `translateY(${scrollVal * speed}px)`;
            }
        }
    });

    // 8. Contact Form Handling (Prevent default so it feels like a modern app)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
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

    // 10. Lightbox for Gallery Images
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const galleryImages = document.querySelectorAll('.image-item img');

    if (lightbox && galleryImages.length > 0) {
        galleryImages.forEach(img => {
            img.addEventListener('click', (e) => {
                lightboxImg.src = e.target.src;
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
            if (document.fullscreenElement || document.webkitFullscreenElement) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }
        };

        // Close on X click
        lightboxClose.addEventListener('click', closeLightbox);

        // Close on clicking outside the image
        lightbox.addEventListener('click', (e) => {
            if (e.target !== lightboxImg) {
                closeLightbox();
            }
        });
    }

    // 11. Night Sky Canvas with Scrolling Stars (Zero-Dependency)
    const skyCanvas = document.getElementById('night-sky-canvas');
    if (skyCanvas) {
        const sCtx = skyCanvas.getContext('2d');
        let stars = [];
        let numStars = 300;

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

                sCtx.beginPath();
                sCtx.arc(this.x, displayY, this.size, 0, Math.PI * 2);
                sCtx.fillStyle = this.color;
                sCtx.globalAlpha = Math.abs(this.alpha);
                sCtx.fill();
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
        });

        const animateSky = () => {
            sCtx.clearRect(0, 0, skyCanvas.width, skyCanvas.height);
            stars.forEach(star => star.draw(currentScrollY));
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
});
