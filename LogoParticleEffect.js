class LogoParticle {
  constructor() {
    this.pos = { x: 0, y: 0 };
    this.vel = { x: 0, y: 0 };
    this.acc = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };

    this.closeEnoughTarget = 60; // Tighter alignment close to the target
    this.maxSpeed = 5.0; // Responsive speed
    this.maxForce = 0.25; // Steer force
    this.particleSize = 1.3; // Sleek premium look
    this.isKilled = false;

    this.startColor = { r: 255, g: 255, b: 255 };
    this.targetColor = { r: 255, g: 255, b: 255 };
    this.colorWeight = 0;
    this.colorBlendRate = 0.01;

    // Persistent random scatter coordinates
    this.scatterAngle = Math.random() * Math.PI * 2;
    this.scatterDistance = 40 + Math.random() * 50; // tight nearby distance
  }

  move(mx, my, isHovered, isScattered, forceRadius = 140, strength = 1.2, canvasWidth = 0, canvasHeight = 0, screenBounds = null) {
    // Determine active speed and force based on state
    const activeScattered = isScattered || isHovered;
    
    // Scale speed and force based on randomized particle parameters for dynamic flow
    const baseSpeed = this.maxSpeed || 8.5;
    const baseForce = this.maxForce || 0.60;
    
    const maxSpeed = activeScattered ? baseSpeed * 0.6 : baseSpeed * 1.5;
    const maxForce = activeScattered ? baseForce * 0.5 : baseForce * 2.0;
    const closeEnoughTarget = activeScattered ? 60 : 15;

    // 1. Calculate steer force towards active target
    let proximityMult = 1;
    const distance = Math.sqrt(Math.pow(this.pos.x - this.target.x, 2) + Math.pow(this.pos.y - this.target.y, 2));

    if (distance < closeEnoughTarget) {
      proximityMult = distance / closeEnoughTarget;
    }

    const towardsTarget = {
      x: this.target.x - this.pos.x,
      y: this.target.y - this.pos.y,
    };

    const magnitude = Math.sqrt(towardsTarget.x * towardsTarget.x + towardsTarget.y * towardsTarget.y);
    if (magnitude > 0) {
      towardsTarget.x = (towardsTarget.x / magnitude) * maxSpeed * proximityMult;
      towardsTarget.y = (towardsTarget.y / magnitude) * maxSpeed * proximityMult;
    }

    const steerX = towardsTarget.x - this.vel.x;
    const steerY = towardsTarget.y - this.vel.y;

    const steerMagnitude = Math.sqrt(steerX * steerX + steerY * steerY);
    if (steerMagnitude > 0) {
      const limitedForceX = (steerX / steerMagnitude) * maxForce;
      const limitedForceY = (steerY / steerMagnitude) * maxForce;
      this.acc.x += limitedForceX;
      this.acc.y += limitedForceY;
    }

    // 2. Mouse cursor repulsion force when hovered
    if (isHovered && mx !== undefined && my !== undefined) {
      const mouseDX = this.pos.x - mx;
      const mouseDY = this.pos.y - my;
      const mouseDist = Math.sqrt(mouseDX * mouseDX + mouseDY * mouseDY);
      
      const activeRadius = forceRadius > 0 ? forceRadius : 140;
      const pushStrength = strength > 0 ? strength : 1.5;

      if (mouseDist < activeRadius && mouseDist > 0) {
        const forceFactor = (activeRadius - mouseDist) / activeRadius;
        
        // Repel directly away from cursor
        const forceX = (mouseDX / mouseDist) * forceFactor * pushStrength * 5;
        const forceY = (mouseDY / mouseDist) * forceFactor * pushStrength * 5;
        
        this.acc.x += forceX;
        this.acc.y += forceY;
      }
    }

    // 3. Galaxy drift & shimmer when activeScattered
    if (activeScattered) {
      // Ambient galaxy/star orbital drift around active target
      const angle = (this.target.x * 0.005) + (this.target.y * 0.005) + (Date.now() * 0.001);
      this.acc.x += Math.cos(angle) * 0.04;
      this.acc.y += Math.sin(angle) * 0.04;
      
      // Gentle jitter/noise
      this.acc.x += (Math.random() - 0.5) * 0.08;
      this.acc.y += (Math.random() - 0.5) * 0.08;
    }

    // Apply acceleration to velocity
    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;

    // Apply damping: high friction (0.93) for smooth flow, snap-back damping (0.84) when forming logo
    const damping = activeScattered ? 0.93 : 0.84;
    this.vel.x *= damping;
    this.vel.y *= damping;

    // Update position
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    // Clamp displacement to keep particles within a tight nearby logo area when activeScattered
    if (activeScattered) {
      const distFromHome = Math.sqrt(Math.pow(this.pos.x - this.target.x, 2) + Math.pow(this.pos.y - this.target.y, 2));
      
      // Scale max displacement with screen width (default to 225px if screenBounds is missing)
      const screenW = screenBounds ? screenBounds.w : 225;
      const maxDisplacement = isHovered ? (screenW * 0.22) : (screenW * 0.12);
      
      if (distFromHome > maxDisplacement && distFromHome > 0) {
        const homeDX = this.target.x - this.pos.x;
        const homeDY = this.target.y - this.pos.y;
        this.pos.x = this.target.x - (homeDX / distFromHome) * maxDisplacement;
        this.pos.y = this.target.y - (homeDY / distFromHome) * maxDisplacement;
        this.vel.x *= 0.5;
        this.vel.y *= 0.5;
      }
    }

    // Boundary containment (contain particles inside screen quadrilateral bezel)
    if (screenBounds && screenBounds.tl) {
      const q = screenBounds;
      const p = this.pos;
      const c1 = (q.tr.x - q.tl.x) * (p.y - q.tl.y) - (q.tr.y - q.tl.y) * (p.x - q.tl.x);
      const c2 = (q.br.x - q.tr.x) * (p.y - q.tr.y) - (q.br.y - q.tr.y) * (p.x - q.tr.x);
      const c3 = (q.bl.x - q.br.x) * (p.y - q.br.y) - (q.bl.y - q.br.y) * (p.x - q.br.x);
      const c4 = (q.tl.x - q.bl.x) * (p.y - q.bl.y) - (q.tl.y - q.bl.y) * (p.x - q.bl.x);
      
      const isInside = (c1 >= 0 && c2 >= 0 && c3 >= 0 && c4 >= 0) || (c1 <= 0 && c2 <= 0 && c3 <= 0 && c4 <= 0);
      if (!isInside) {
        // Push back towards target inside the screen
        this.pos.x = this.pos.x * 0.85 + this.target.x * 0.15;
        this.pos.y = this.pos.y * 0.85 + this.target.y * 0.15;
        this.vel.x *= -0.3;
        this.vel.y *= -0.3;
      }
    } else {
      // Fallback containment to viewport edges
      const pad = 15;
      if (canvasWidth > 0 && canvasHeight > 0) {
        if (this.pos.x < pad) {
          this.pos.x = pad;
          this.vel.x *= -0.3;
        } else if (this.pos.x > canvasWidth - pad) {
          this.pos.x = canvasWidth - pad;
          this.vel.x *= -0.3;
        }
        
        if (this.pos.y < pad) {
          this.pos.y = pad;
          this.vel.y *= -0.3;
        } else if (this.pos.y > canvasHeight - pad) {
          this.pos.y = canvasHeight - pad;
          this.vel.y *= -0.3;
        }
      }
    }

    this.acc.x = 0;
    this.acc.y = 0;
  }

  draw(ctx) {
    if (this.colorWeight < 1.0) {
      this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0);
    }

    const currentColor = {
      r: Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight),
      g: Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight),
      b: Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight),
    };

    ctx.fillStyle = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`;
    if (this.particleSize <= 1.5) {
      const size = this.particleSize * 2;
      ctx.fillRect(this.pos.x - this.particleSize, this.pos.y - this.particleSize, size, size);
    } else {
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.particleSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  kill(width, height) {
    if (!this.isKilled) {
      this.target.x = Math.random() * width;
      this.target.y = Math.random() * height;
      this.targetColor = { r: 0, g: 0, b: 0 };
      this.isKilled = true;
    }
  }
}

class LogoParticleEffectApp {
  constructor(containerId, imageUrl, placeholderId) {
    this.container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!this.container) return;

    this.imageUrl = imageUrl;
    this.placeholderId = placeholderId;
    
    // Create full screen overlay canvas
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.zIndex = '15'; // Below overlay text but above background city faders
    this.canvas.style.pointerEvents = 'none'; // Click through to elements below
    
    this.container.appendChild(this.canvas);
    
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    
    this.particles = [];
    this.mouse = { x: -9999, y: -9999, isHovered: false };
    this.tick = 0;

    // Timer control logic for auto scattered-to-formed repetition
    this.stateTimer = 0;
    this.currentAnimState = "scattered";
    
    this.isMobileViewport = window.innerWidth <= 768;
    this.pixelSteps = this.isMobileViewport ? 5 : 4; // Step size reduces particle counts on desktop/mobile
    
    // Maintain computed screen boundaries
    this.screenBounds = { x: 0, y: 0, w: 0, h: 0 };

    this.isInView = true;
    this.isLoopRunning = true;
    this.observer = new IntersectionObserver((entries) => {
      this.isInView = entries[0].isIntersecting;
      if (this.isInView && !this.isLoopRunning) {
        this.isLoopRunning = true;
        this.animate();
      }
    }, { threshold: 0 });
    this.observer.observe(this.container);

    this.init();
  }

  init() {
    this.img = new Image();
    this.img.crossOrigin = "Anonymous";
    this.img.src = this.imageUrl;
    this.img.onload = () => {
      // Size canvas to home container client dimensions
      this.canvas.width = this.container.clientWidth;
      this.canvas.height = this.container.clientHeight;
      this.startEffect();
      this.animate();
    };

    this.setupEvents();
  }

  startEffect() {
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = this.img.width;
    offscreenCanvas.height = this.img.height;
    const offscreenCtx = offscreenCanvas.getContext("2d", { willReadFrequently: true });

    offscreenCtx.drawImage(this.img, 0, 0, this.img.width, this.img.height);

    const imageData = offscreenCtx.getImageData(0, 0, this.img.width, this.img.height);
    const pixels = imageData.data;

    let particleIndex = 0;
    const coordsIndexes = [];

    // Use step based on viewport mode
    const step = this.isMobileViewport ? 5 : 4; 

    for (let y = 0; y < this.img.height; y += step) {
      for (let x = 0; x < this.img.width; x += step) {
        const pixelIndex = (y * this.img.width + x) * 4;
        if (pixelIndex < pixels.length) {
          const alpha = pixels[pixelIndex + 3];
          if (alpha > 50) {
            coordsIndexes.push(pixelIndex);
          }
        }
      }
    }

    // Shuffle points for organic loading join effect
    for (let i = coordsIndexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [coordsIndexes[i], coordsIndexes[j]] = [coordsIndexes[j], coordsIndexes[i]];
    }

    for (const pixelIndex of coordsIndexes) {
      const x = (pixelIndex / 4) % this.img.width;
      const y = Math.floor((pixelIndex / 4) / this.img.width);

      let particle;
      if (particleIndex < this.particles.length) {
        particle = this.particles[particleIndex];
        particle.isKilled = false;
      } else {
        particle = new LogoParticle();
        this.particles.push(particle);
      }
      particleIndex++;

      particle.maxSpeed = Math.random() * 4 + 7.5; // snappier: 7.5 to 11.5
      particle.maxForce = particle.maxSpeed * 0.06; // stronger steering force: 0.45 to 0.69
      
      if (this.isMobileViewport) {
        if (y >= 565) {
          // Tagline: use tiny, super-sharp dots so close-together letters do not merge
          particle.particleSize = Math.random() * 0.25 + 0.65;
        } else {
          // Main logo and emblem: standard size
          particle.particleSize = Math.random() * 0.5 + 0.95;
        }
      } else {
        particle.particleSize = Math.random() * 1.1 + 0.9; // sleek stars on desktop
      }
      
      particle.colorBlendRate = Math.random() * 0.0275 + 0.0025;
      particle.scatterAngle = Math.random() * Math.PI * 2;
      particle.scatterDistance = 40 + Math.random() * 50;

      // Keep original image coordinate markers
      particle.imgX = x;
      particle.imgY = y;
      
      let r = pixels[pixelIndex];
      let g = pixels[pixelIndex+1];
      let b = pixels[pixelIndex+2];
      
      particle.startColor = { r, g, b };
      particle.targetColor = { r, g, b };
      particle.colorWeight = 0;
    }

    for (let i = particleIndex; i < this.particles.length; i++) {
      this.particles[i].kill(this.canvas.width, this.canvas.height);
    }
    
    // Crop the particles array to free memory and avoid rendering deactivated/killed particles
    this.particles.length = particleIndex;

    this.updateTargetPositions();

    // Position all particles close to their targets initially
    this.particles.forEach(p => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 60; // 50px to 110px nearby offset
      p.pos.x = p.target.x + Math.cos(angle) * distance;
      p.pos.y = p.target.y + Math.sin(angle) * distance;
      p.vel.x = (Math.random() - 0.5) * 10;
      p.vel.y = (Math.random() - 0.5) * 10;
    });
  }

  updateTargetPositions() {
    if (!this.img || !this.img.complete) return;
    
    const W = this.canvas.width;
    const H = this.canvas.height;
    const ImgW = 1024;
    const ImgH = 1024;

    // Coordinates of the monitor screen display area in the 1024x1024 image
    const screenImgX = 349;
    const screenImgY = 454;
    const screenImgW = 225;
    const screenImgH = 151;

    let scale, offsetX, offsetY;
    const R = W / H;
    const ImgR = ImgW / ImgH; // 1.0

    if (R > ImgR) {
      // Case 1: Viewport is wider than image (W > H)
      scale = W / ImgW;
      offsetX = 0;
      offsetY = -(W - H) / 2;
    } else {
      // Case 2: Viewport is taller than image (W <= H)
      scale = H / ImgH;
      offsetX = -(H - W) / 2;
      offsetY = 0;
    }

    const scalePoint = (pt) => {
      return {
        x: offsetX + pt.x * scale,
        y: offsetY + pt.y * scale
      };
    };

    // exact corner mappings to skew/tilt the screen boundaries
    this.screenQuad = {
      tl: scalePoint({ x: 255, y: 420 }),
      tr: scalePoint({ x: 595, y: 435 }),
      bl: scalePoint({ x: 255, y: 648 }),
      br: scalePoint({ x: 594, y: 600 })
    };

    // exact corners of the logo within the image to match pre-rendered layout skew
    this.logoQuad = {
      tl: scalePoint({ x: 349, y: 454 }),
      tr: scalePoint({ x: 564, y: 460 }),
      bl: scalePoint({ x: 382, y: 602 }),
      br: scalePoint({ x: 573, y: 582 })
    };

    // Store compatible simple box structure
    this.screenBounds = {
      x: offsetX + screenImgX * scale,
      y: offsetY + screenImgY * scale,
      w: screenImgW * scale,
      h: screenImgH * scale,
      tl: this.screenQuad.tl,
      tr: this.screenQuad.tr,
      bl: this.screenQuad.bl,
      br: this.screenQuad.br
    };

    const isFormed = (this.currentAnimState === "formed");

    this.particles.forEach(p => {
      if (p.imgX !== undefined && p.imgY !== undefined) {
        // Map flat 1024x724 coordinates to skewed quad corners using bilinear interpolation
        const u = p.imgX / 1024;
        const v = p.imgY / 724;

        const homeX = (1 - u) * (1 - v) * this.logoQuad.tl.x +
                      u * (1 - v) * this.logoQuad.tr.x +
                      (1 - u) * v * this.logoQuad.bl.x +
                      u * v * this.logoQuad.br.x;

        const homeY = (1 - u) * (1 - v) * this.logoQuad.tl.y +
                      u * (1 - v) * this.logoQuad.tr.y +
                      (1 - u) * v * this.logoQuad.bl.y +
                      u * v * this.logoQuad.br.y;

        if (isFormed) {
          p.target.x = homeX;
          p.target.y = homeY;
        } else {
          // Scattered target position nearby (scaled to screen size)
          const scatterDistance = p.scatterDistance * scale * 0.45;
          p.target.x = homeX + Math.cos(p.scatterAngle) * scatterDistance;
          p.target.y = homeY + Math.sin(p.scatterAngle) * scatterDistance;
        }
      } else {
        p.target.x = this.logoQuad.tl.x;
        p.target.y = this.logoQuad.tl.y;
      }
    });
  }

  assemble() {
    this.stateTimer = 0;
    this.currentAnimState = "formed";
    this.updateTargetPositions();

    this.particles.forEach(particle => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 60; // nearby space
      
      particle.pos.x = particle.target.x + Math.cos(angle) * distance;
      particle.pos.y = particle.target.y + Math.sin(angle) * distance;

      particle.vel.x = (Math.random() - 0.5) * 14;
      particle.vel.y = (Math.random() - 0.5) * 14;
      particle.colorWeight = 0;
    });
  }

  animate = () => {
    if (!this.isInView) {
      this.isLoopRunning = false;
      return;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const mx = this.mouse.x;
    const my = this.mouse.y;
    const isHovered = this.mouse.isHovered;

    // Smoothly track layout and animation timers
    this.tick++;
    // Determine animation state based solely on hover; no automatic scattering cycle
    this.currentAnimState = isHovered ? "scattered" : "formed";

    const prevState = this.currentAnimState;

    // Update targets on state change or periodically for layout responsiveness
    if (this.currentAnimState !== prevState || this.tick % 10 === 0) {
      this.updateTargetPositions();
    }

    const isScattered = (this.currentAnimState === "scattered");
    
    // Scale pointer repulsion radius based on computed screen size (around 22% of screen width)
    const forceRadius = this.screenBounds.w * 0.22; 
    const strength = 1.0;

    // Draw the particles (clean round dots, let the background image's reflections work naturally)
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.move(mx, my, isHovered, isScattered, forceRadius, strength, this.canvas.width, this.canvas.height, this.screenBounds);
      particle.draw(this.ctx);

      if (particle.isKilled) {
        if (
          particle.pos.x < 0 ||
          particle.pos.x > this.canvas.width ||
          particle.pos.y < 0 ||
          particle.pos.y > this.canvas.height
        ) {
          this.particles.splice(i, 1);
        }
      }
    }

    this.animationReq = requestAnimationFrame(this.animate);
  }

  isPointInQuad(p, q) {
    if (!q || !q.tl || !q.tr || !q.bl || !q.br) return false;
    const c1 = (q.tr.x - q.tl.x) * (p.y - q.tl.y) - (q.tr.y - q.tl.y) * (p.x - q.tl.x);
    const c2 = (q.br.x - q.tr.x) * (p.y - q.tr.y) - (q.br.y - q.tr.y) * (p.x - q.tr.x);
    const c3 = (q.bl.x - q.br.x) * (p.y - q.br.y) - (q.bl.y - q.br.y) * (p.x - q.br.x);
    const c4 = (q.tl.x - q.bl.x) * (p.y - q.bl.y) - (q.tl.y - q.bl.y) * (p.x - q.bl.x);
    
    return (c1 >= 0 && c2 >= 0 && c3 >= 0 && c4 >= 0) || (c1 <= 0 && c2 <= 0 && c3 <= 0 && c4 <= 0);
  }

  setupEvents() {
    const handlePointerMove = (e) => {
      const cRect = this.container.getBoundingClientRect();

      const clientX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY);

      if (clientX !== undefined && clientY !== undefined) {
        const mx = clientX - cRect.left;
        const my = clientY - cRect.top;
        this.mouse.x = mx;
        this.mouse.y = my;

        // Check if mouse coordinates are inside the mathematically calculated screen quad
        if (this.isPointInQuad(this.mouse, this.screenQuad)) {
          this.mouse.isHovered = true;
        } else {
          this.mouse.isHovered = false;
        }
      }
    };

    const handlePointerLeave = () => {
      this.mouse.isHovered = false;
      this.mouse.x = -9999;
      this.mouse.y = -9999;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);
    
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("touchend", handlePointerLeave, { passive: true });
    
    window.addEventListener("resize", this.handleResize);
  }

  handleResize = () => {
    if (!this.container || !this.canvas) return;
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
    
    const wasMobile = this.isMobileViewport;
    const isMobileNow = window.innerWidth <= 768;
    
    if (wasMobile !== isMobileNow) {
      this.isMobileViewport = isMobileNow;
      this.startEffect();
    } else {
      this.updateTargetPositions();
    }
  };
}

window.LogoParticleEffectApp = LogoParticleEffectApp;
