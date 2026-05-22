class Particle {
  constructor() {
    this.pos = { x: 0, y: 0 };
    this.vel = { x: 0, y: 0 };
    this.acc = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };
    
    this.closeEnoughTarget = 100;
    this.maxSpeed = 1.0;
    this.maxForce = 0.1;
    this.particleSize = 10;
    this.isKilled = false;
    
    this.startColor = { r: 0, g: 0, b: 0 };
    this.targetColor = { r: 0, g: 0, b: 0 };
    this.colorWeight = 0;
    this.colorBlendRate = 0.01;
  }

  move() {
    let proximityMult = 1;
    const distance = Math.sqrt(Math.pow(this.pos.x - this.target.x, 2) + Math.pow(this.pos.y - this.target.y, 2));

    if (distance < this.closeEnoughTarget) {
      proximityMult = distance / this.closeEnoughTarget;
    }

    const towardsTarget = {
      x: this.target.x - this.pos.x,
      y: this.target.y - this.pos.y,
    };

    const magnitude = Math.sqrt(towardsTarget.x * towardsTarget.x + towardsTarget.y * towardsTarget.y);
    if (magnitude > 0) {
      towardsTarget.x = (towardsTarget.x / magnitude) * this.maxSpeed * proximityMult;
      towardsTarget.y = (towardsTarget.y / magnitude) * this.maxSpeed * proximityMult;
    }

    const steer = {
      x: towardsTarget.x - this.vel.x,
      y: towardsTarget.y - this.vel.y,
    };

    const steerMagnitude = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
    if (steerMagnitude > 0) {
      steer.x = (steer.x / steerMagnitude) * this.maxForce;
      steer.y = (steer.y / steerMagnitude) * this.maxForce;
    }

    this.acc.x += steer.x;
    this.acc.y += steer.y;

    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.acc.x = 0;
    this.acc.y = 0;
  }

  draw(ctx, drawAsPoints) {
    if (this.colorWeight < 1.0) {
      this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0);
    }

    const currentColor = {
      r: Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight),
      g: Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight),
      b: Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight),
    };

    if (drawAsPoints) {
      ctx.fillStyle = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`;
      ctx.fillRect(this.pos.x, this.pos.y, 2, 2);
    } else {
      ctx.fillStyle = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`;
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.particleSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  kill(width, height) {
    if (!this.isKilled) {
      const randomPos = this.generateRandomPos(width / 2, height / 2, (width + height) / 2);
      this.target.x = randomPos.x;
      this.target.y = randomPos.y;

      this.startColor = {
        r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
        g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
        b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
      };
      this.targetColor = { r: 0, g: 0, b: 0 };
      this.colorWeight = 0;

      this.isKilled = true;
    }
  }

  generateRandomPos(x, y, mag) {
    const randomX = Math.random() * 1000;
    const randomY = Math.random() * 500;

    const direction = {
      x: randomX - x,
      y: randomY - y,
    };

    const magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
    if (magnitude > 0) {
      direction.x = (direction.x / magnitude) * mag;
      direction.y = (direction.y / magnitude) * mag;
    }

    return {
      x: x + direction.x,
      y: y + direction.y,
    };
  }
}

class ParticleTextEffectApp {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.words = options.words || ["accuraOne", "accuracy in every solution"];
    this.wordIndex = 0;
    
    this.canvas = document.createElement('canvas');
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.display = 'block';
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    
    this.particles = [];
    this.frameCount = 0;
    this.mouse = { x: 0, y: 0, isPressed: false, isRightClick: false };
    
    this.pixelSteps = 6;
    this.drawAsPoints = true;

    this.onResize();
    window.addEventListener('resize', () => this.onResize());

    this.initEvents();
    
    this.nextWord(this.words[0]);
    this.animate();
  }

  onResize() {
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
  }

  generateRandomPos(x, y, mag) {
    const randomX = Math.random() * 1000;
    const randomY = Math.random() * 500;

    const direction = {
      x: randomX - x,
      y: randomY - y,
    };

    const magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
    if (magnitude > 0) {
      direction.x = (direction.x / magnitude) * mag;
      direction.y = (direction.y / magnitude) * mag;
    }

    return {
      x: x + direction.x,
      y: y + direction.y,
    };
  }

  nextWord(word) {
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = this.canvas.width;
    offscreenCanvas.height = this.canvas.height;
    const offscreenCtx = offscreenCanvas.getContext("2d", { willReadFrequently: true });

    offscreenCtx.fillStyle = "white";
    offscreenCtx.font = "bold 40px 'Golgols', Arial";
    // For left-aligned text to match layout:
    offscreenCtx.textAlign = "left";
    offscreenCtx.textBaseline = "middle";
    
    // Split long strings onto multiple lines if needed
    const lines = word.split('\\n');
    const lineHeight = 40;
    const startY = (this.canvas.height / 2) - ((lines.length - 1) * lineHeight) / 2;
    
    lines.forEach((line, i) => {
        // Adjust font size for the slogan
        if (line === "accuracy in every solution") {
            offscreenCtx.font = "18px 'Golgols', Arial";
        } else {
            offscreenCtx.font = "bold 45px 'Golgols', Arial";
        }
        // Draw starting from x=10 for left alignment
        offscreenCtx.fillText(line, 10, startY + (i * lineHeight));
    });

    const imageData = offscreenCtx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const pixels = imageData.data;

    // Use white color instead of random to match logo
    const newColor = { r: 255, g: 255, b: 255 };

    let particleIndex = 0;
    const coordsIndexes = [];
    for (let i = 0; i < pixels.length; i += this.pixelSteps * 4) {
      coordsIndexes.push(i);
    }

    for (let i = coordsIndexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [coordsIndexes[i], coordsIndexes[j]] = [coordsIndexes[j], coordsIndexes[i]];
    }

    for (const coordIndex of coordsIndexes) {
      const pixelIndex = coordIndex;
      const alpha = pixels[pixelIndex + 3];

      if (alpha > 0) {
        const x = (pixelIndex / 4) % this.canvas.width;
        const y = Math.floor(pixelIndex / 4 / this.canvas.width);

        let particle;

        if (particleIndex < this.particles.length) {
          particle = this.particles[particleIndex];
          particle.isKilled = false;
          particleIndex++;
        } else {
          particle = new Particle();
          const randomPos = this.generateRandomPos(this.canvas.width / 2, this.canvas.height / 2, (this.canvas.width + this.canvas.height) / 2);
          particle.pos.x = randomPos.x;
          particle.pos.y = randomPos.y;

          particle.maxSpeed = Math.random() * 6 + 4;
          particle.maxForce = particle.maxSpeed * 0.05;
          particle.particleSize = Math.random() * 6 + 6;
          particle.colorBlendRate = Math.random() * 0.0275 + 0.0025;

          this.particles.push(particle);
        }

        particle.startColor = {
          r: particle.startColor.r + (particle.targetColor.r - particle.startColor.r) * particle.colorWeight,
          g: particle.startColor.g + (particle.targetColor.g - particle.startColor.g) * particle.colorWeight,
          b: particle.startColor.b + (particle.targetColor.b - particle.startColor.b) * particle.colorWeight,
        };
        particle.targetColor = newColor;
        particle.colorWeight = 0;

        particle.target.x = x;
        particle.target.y = y;
      }
    }

    for (let i = particleIndex; i < this.particles.length; i++) {
      this.particles[i].kill(this.canvas.width, this.canvas.height);
    }
  }

  animate() {
    // Transparent background for dark neon theme
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.move();
      particle.draw(this.ctx, this.drawAsPoints);

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

    if (this.mouse.isPressed && this.mouse.isRightClick) {
      this.particles.forEach((particle) => {
        const distance = Math.sqrt(
          Math.pow(particle.pos.x - this.mouse.x, 2) + Math.pow(particle.pos.y - this.mouse.y, 2),
        );
        if (distance < 50) {
          particle.kill(this.canvas.width, this.canvas.height);
        }
      });
    }

    this.frameCount++;
    if (this.frameCount % 240 === 0) {
      this.wordIndex = (this.wordIndex + 1) % this.words.length;
      this.nextWord(this.words[this.wordIndex]);
    }

    this.animationRef = requestAnimationFrame(() => this.animate());
  }

  initEvents() {
    const handleMouseDown = (e) => {
      this.mouse.isPressed = true;
      this.mouse.isRightClick = e.button === 2;
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    };

    const handleMouseUp = () => {
      this.mouse.isPressed = false;
      this.mouse.isRightClick = false;
    };

    const handleMouseMove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    this.canvas.addEventListener("mousedown", handleMouseDown);
    this.canvas.addEventListener("mouseup", handleMouseUp);
    this.canvas.addEventListener("mousemove", handleMouseMove);
    this.canvas.addEventListener("contextmenu", handleContextMenu);
  }
}

window.ParticleTextEffectApp = ParticleTextEffectApp;
