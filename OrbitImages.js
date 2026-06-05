// Component inspired by Dominik Koch's OrbitImages
// Translated to Vanilla JS for integration in the AccuraOne site

function generateEllipsePath(cx, cy, rx, ry) {
  return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`;
}

function generateCirclePath(cx, cy, r) {
  return generateEllipsePath(cx, cy, r, r);
}

function generateSquarePath(cx, cy, size) {
  const h = size / 2;
  return `M ${cx - h} ${cy - h} L ${cx + h} ${cy - h} L ${cx + h} ${cy + h} L ${cx - h} ${cy + h} Z`;
}

function generateRectanglePath(cx, cy, w, h) {
  const hw = w / 2;
  const hh = h / 2;
  return `M ${cx - hw} ${cy - hh} L ${cx + hw} ${cy - hh} L ${cx + hw} ${cy + hh} L ${cx - hw} ${cy + hh} Z`;
}

function generateTrianglePath(cx, cy, size) {
  const height = (size * Math.sqrt(3)) / 2;
  const hs = size / 2;
  return `M ${cx} ${cy - height / 1.5} L ${cx + hs} ${cy + height / 3} L ${cx - hs} ${cy + height / 3} Z`;
}

function generateStarPath(cx, cy, outerR, innerR, points) {
  const step = Math.PI / points;
  let path = '';
  for (let i = 0; i < 2 * points; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = i * step - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }
  return path + ' Z';
}

function generateHeartPath(cx, cy, size) {
  const s = size / 30;
  return `M ${cx} ${cy + 12 * s} C ${cx - 20 * s} ${cy - 5 * s}, ${cx - 12 * s} ${cy - 18 * s}, ${cx} ${cy - 8 * s} C ${cx + 12 * s} ${cy - 18 * s}, ${cx + 20 * s} ${cy - 5 * s}, ${cx} ${cy + 12 * s}`;
}

function generateInfinityPath(cx, cy, w, h) {
  const hw = w / 2;
  const hh = h / 2;
  return `M ${cx} ${cy} C ${cx + hw * 0.5} ${cy - hh}, ${cx + hw} ${cy - hh}, ${cx + hw} ${cy} C ${cx + hw} ${cy + hh}, ${cx + hw * 0.5} ${cy + hh}, ${cx} ${cy} C ${cx - hw * 0.5} ${cy + hh}, ${cx - hw} ${cy + hh}, ${cx - hw} ${cy} C ${cx - hw} ${cy - hh}, ${cx - hw * 0.5} ${cy - hh}, ${cx} ${cy}`;
}

function generateWavePath(cx, cy, w, amplitude, waves) {
  const pts = [];
  const segs = waves * 20;
  const hw = w / 2;
  for (let i = 0; i <= segs; i++) {
    const x = cx - hw + (w * i) / segs;
    const y = cy + Math.sin((i / segs) * waves * 2 * Math.PI) * amplitude;
    pts.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
  }
  for (let i = segs; i >= 0; i--) {
    const x = cx - hw + (w * i) / segs;
    const y = cy - Math.sin((i / segs) * waves * 2 * Math.PI) * amplitude;
    pts.push(`L ${x} ${y}`);
  }
  return pts.join(' ') + ' Z';
}

class OrbitImages {
  constructor(container, options = {}) {
    if (!container) throw new Error('OrbitImages requires a valid container element.');
    
    this.container = container;
    this.options = Object.assign({
      images: [],
      altPrefix: 'Orbiting image',
      shape: 'ellipse',
      customPath: undefined,
      baseWidth: 1400,
      radiusX: 700,
      radiusY: 170,
      radius: 300,
      starPoints: 5,
      starInnerRatio: 0.5,
      rotation: -8,
      duration: 40,
      itemSize: 64,
      itemWidth: undefined,
      itemHeight: undefined,
      direction: 'normal',
      fill: true,
      width: '100%',
      height: 'auto',
      className: '',
      showPath: false,
      pathColor: 'rgba(255, 255, 255, 0.05)',
      pathWidth: 2,
      easing: 'linear',
      paused: false,
      pauseOnHover: true,
      centerContent: undefined,
      responsive: false
    }, options);

    this.scale = 1;
    this.lastWidth = null;
    this.progress = 0;
    this.paused = this.options.paused;
    this.animationFrameId = null;
    this.lastTime = null;
    this.resizeObserver = null;
    this.pathString = '';

    this.init();
  }

  init() {
    // Clear container
    this.container.innerHTML = '';
    
    // Create base path
    const designCenterX = this.options.baseWidth / 2;
    const designCenterY = this.options.baseWidth / 2;
    
    switch (this.options.shape) {
      case 'circle':
        this.pathString = generateCirclePath(designCenterX, designCenterY, this.options.radius);
        break;
      case 'ellipse':
        this.pathString = generateEllipsePath(designCenterX, designCenterY, this.options.radiusX, this.options.radiusY);
        break;
      case 'square':
        this.pathString = generateSquarePath(designCenterX, designCenterY, this.options.radius * 2);
        break;
      case 'rectangle':
        this.pathString = generateRectanglePath(designCenterX, designCenterY, this.options.radiusX * 2, this.options.radiusY * 2);
        break;
      case 'triangle':
        this.pathString = generateTrianglePath(designCenterX, designCenterY, this.options.radius * 2);
        break;
      case 'star':
        this.pathString = generateStarPath(designCenterX, designCenterY, this.options.radius, this.options.radius * this.options.starInnerRatio, this.options.starPoints);
        break;
      case 'heart':
        this.pathString = generateHeartPath(designCenterX, designCenterY, this.options.radius * 2);
        break;
      case 'infinity':
        this.pathString = generateInfinityPath(designCenterX, designCenterY, this.options.radiusX * 2, this.options.radiusY * 2);
        break;
      case 'wave':
        this.pathString = generateWavePath(designCenterX, designCenterY, this.options.radiusX * 2, this.options.radiusY, 3);
        break;
      case 'custom':
        this.pathString = this.options.customPath || generateCirclePath(designCenterX, designCenterY, this.options.radius);
        break;
      default:
        this.pathString = generateEllipsePath(designCenterX, designCenterY, this.options.radiusX, this.options.radiusY);
    }

    // Build DOM
    this.container.classList.add('orbit-container');
    if (this.options.className) {
      this.container.classList.add(this.options.className);
    }
    
    this.container.style.width = this.options.responsive ? '100%' : (typeof this.options.width === 'number' ? `${this.options.width}px` : this.options.width);
    
    if (this.options.responsive && (!this.options.height || this.options.height === 'auto')) {
      this.container.style.height = 'auto';
      this.container.style.aspectRatio = '1 / 1';
    } else {
      if (!this.options.responsive) {
        this.container.style.height = typeof this.options.height === 'number' ? `${this.options.height}px` : this.options.height;
      }
    }

    // Scaling container
    const scalingContainer = document.createElement('div');
    scalingContainer.className = 'orbit-scaling-container' + (this.options.responsive ? ' orbit-scaling-container--responsive' : '');
    this.container.appendChild(scalingContainer);

    // Rotation wrapper
    const rotationWrapper = document.createElement('div');
    rotationWrapper.className = 'orbit-rotation-wrapper';
    rotationWrapper.style.transform = `rotate(${this.options.rotation}deg)`;
    scalingContainer.appendChild(rotationWrapper);

    // SVG Path
    if (this.options.showPath) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'orbit-path-svg');
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.setAttribute('viewBox', `0 0 ${this.options.baseWidth} ${this.options.baseWidth}`);
      
      const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      pathEl.setAttribute('d', this.pathString);
      pathEl.setAttribute('fill', 'none');
      pathEl.setAttribute('stroke', this.options.pathColor);
      pathEl.setAttribute('stroke-width', this.options.pathWidth);
      
      svg.appendChild(pathEl);
      rotationWrapper.appendChild(svg);
    }

    // Orbiting Items
    this.itemsElements = [];
    const itemWidth = this.options.itemWidth || this.options.itemSize;
    const itemHeight = this.options.itemHeight || this.options.itemSize;
    this.options.images.forEach((src, index) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'orbit-item';
      itemEl.style.width = `${itemWidth}px`;
      itemEl.style.height = `${itemHeight}px`;
      itemEl.style.offsetPath = `path("${this.pathString}")`;
      itemEl.style.offsetRotate = '0deg';
      itemEl.style.offsetAnchor = 'center center';
      
      const innerRotator = document.createElement('div');
      innerRotator.className = 'orbit-item-inner';
      innerRotator.style.transform = `rotate(${-this.options.rotation}deg)`;
      innerRotator.style.width = '100%';
      innerRotator.style.height = '100%';
      
      const img = document.createElement('img');
      img.src = src;
      img.alt = `${this.options.altPrefix} ${index + 1}`;
      img.draggable = false;
      img.className = 'orbit-image';
      
      innerRotator.appendChild(img);
      itemEl.appendChild(innerRotator);
      rotationWrapper.appendChild(itemEl);
      
      this.itemsElements.push(itemEl);
    });

    // Center Content
    if (this.options.centerContent) {
      const centerContentEl = document.createElement('div');
      centerContentEl.className = 'orbit-center-content';
      
      if (typeof this.options.centerContent === 'string') {
        centerContentEl.innerHTML = this.options.centerContent;
      } else {
        centerContentEl.appendChild(this.options.centerContent);
      }
      scalingContainer.appendChild(centerContentEl);
    }

    // Event Listeners for hover pause on individual items
    if (this.options.pauseOnHover) {
      this.itemsElements.forEach(itemEl => {
        itemEl.addEventListener('mouseenter', () => {
          this.paused = true;
        });
        itemEl.addEventListener('mouseleave', () => {
          this.paused = false;
        });
      });
    }

    // Resize Handling
    if (this.options.responsive) {
      this.resizeObserver = new ResizeObserver(() => this.updateScale());
      this.resizeObserver.observe(this.container);
      this.updateScale();
    }

    // Start Loop
    this.lastTime = performance.now();
    const loop = (timestamp) => {
      const elapsed = (timestamp - this.lastTime) / 1000;
      this.lastTime = timestamp;

      if (!this.paused) {
        const delta = (elapsed / this.options.duration) * 100;
        if (this.options.direction === 'reverse') {
          this.progress = (this.progress - delta) % 100;
        } else {
          this.progress = (this.progress + delta) % 100;
        }
        this.updateItems();
      }
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  updateScale() {
    if (!this.container) return;
    const width = this.container.clientWidth;
    if (width === this.lastWidth) return;
    this.lastWidth = width;

    this.scale = width / this.options.baseWidth;
    
    const scalingContainer = this.container.querySelector('.orbit-scaling-container');
    if (scalingContainer) {
      scalingContainer.style.width = `${this.options.baseWidth}px`;
      scalingContainer.style.height = `${this.options.baseWidth}px`;
      scalingContainer.style.transform = `translate(-50%, -50%) scale(${this.scale})`;
    }

    if (this.options.responsive && typeof this.options.height === 'number') {
      this.container.style.height = `${this.options.height * this.scale}px`;
    }

    const pathEl = this.container.querySelector('.orbit-path-svg path');
    if (pathEl) {
      pathEl.setAttribute('stroke-width', this.options.pathWidth / this.scale);
    }
  }

  updateItems() {
    const total = this.itemsElements.length;
    this.itemsElements.forEach((item, index) => {
      const itemOffset = this.options.fill ? (index / total) * 100 : 0;
      const offset = (((this.progress + itemOffset) % 100) + 100) % 100;
      item.style.offsetDistance = `${offset}%`;
    });
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}

window.OrbitImages = OrbitImages;
