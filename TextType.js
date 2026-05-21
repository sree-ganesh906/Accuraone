class TextType {
  constructor(containerId, options = {}) {
    this.container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!this.container) return;

    this.textArray = Array.isArray(options.text) ? options.text : [options.text || ''];
    this.typingSpeed = options.typingSpeed || 50;
    this.initialDelay = options.initialDelay || 0;
    this.pauseDuration = options.pauseDuration || 2000;
    this.deletingSpeed = options.deletingSpeed || 30;
    this.loop = options.loop !== undefined ? options.loop : true;
    this.showCursor = options.showCursor !== undefined ? options.showCursor : true;
    this.hideCursorWhileTyping = options.hideCursorWhileTyping || false;
    this.cursorCharacter = options.cursorCharacter || '|';
    this.cursorBlinkDuration = options.cursorBlinkDuration || 0.5;
    this.textColors = options.textColors || [];
    this.variableSpeed = options.variableSpeed;
    this.onSentenceComplete = options.onSentenceComplete;
    this.startOnVisible = options.startOnVisible || false;
    this.reverseMode = options.reverseMode || false;

    this.displayedText = '';
    this.currentCharIndex = 0;
    this.isDeleting = false;
    this.currentTextIndex = 0;
    this.isVisible = !this.startOnVisible;
    this.timeout = null;
    
    this.initDOM();
    this.initObserver();
    this.initCursorAnimation();
    
    if (this.isVisible) {
      this.startTyping();
    }
  }

  initDOM() {
    this.container.classList.add('text-type');
    if (this.options?.className) this.container.classList.add(this.options.className);
    
    this.contentSpan = document.createElement('span');
    this.contentSpan.className = 'text-type__content';
    this.container.appendChild(this.contentSpan);

    if (this.showCursor) {
      this.cursorSpan = document.createElement('span');
      this.cursorSpan.className = 'text-type__cursor';
      if (this.options?.cursorClassName) this.cursorSpan.classList.add(this.options.cursorClassName);
      this.cursorSpan.innerHTML = this.cursorCharacter;
      this.container.appendChild(this.cursorSpan);
    }
    
    this.updateTextColor();
  }

  updateTextColor() {
    if (this.textColors.length > 0) {
      this.contentSpan.style.color = this.textColors[this.currentTextIndex % this.textColors.length];
    } else {
      this.contentSpan.style.color = 'inherit';
    }
  }

  initObserver() {
    if (!this.startOnVisible) return;
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.isVisible = true;
          this.startTyping();
          this.observer.disconnect();
        }
      });
    }, { threshold: 0.1 });
    this.observer.observe(this.container);
  }

  initCursorAnimation() {
    if (this.showCursor && this.cursorSpan && window.gsap) {
      gsap.set(this.cursorSpan, { opacity: 1 });
      this.cursorAnim = gsap.to(this.cursorSpan, {
        opacity: 0,
        duration: this.cursorBlinkDuration,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      });
    }
  }

  getRandomSpeed() {
    if (!this.variableSpeed) return this.typingSpeed;
    const { min, max } = this.variableSpeed;
    return Math.random() * (max - min) + min;
  }

  startTyping() {
    if (this.currentCharIndex === 0 && !this.isDeleting && this.displayedText === '') {
      this.timeout = setTimeout(() => this.executeTypingAnimation(), this.initialDelay);
    } else {
      this.executeTypingAnimation();
    }
  }

  executeTypingAnimation() {
    if (!this.isVisible) return;

    const currentText = this.textArray[this.currentTextIndex];
    const processedText = this.reverseMode ? currentText.split('').reverse().join('') : currentText;

    if (this.isDeleting) {
      if (this.displayedText === '') {
        this.isDeleting = false;
        if (this.currentTextIndex === this.textArray.length - 1 && !this.loop) {
          return;
        }

        if (this.onSentenceComplete) {
          this.onSentenceComplete(this.textArray[this.currentTextIndex], this.currentTextIndex);
        }

        this.currentTextIndex = (this.currentTextIndex + 1) % this.textArray.length;
        this.currentCharIndex = 0;
        this.updateTextColor();
        this.timeout = setTimeout(() => this.executeTypingAnimation(), this.pauseDuration);
      } else {
        this.timeout = setTimeout(() => {
          this.displayedText = this.displayedText.slice(0, -1);
          this.updateDisplay();
          this.executeTypingAnimation();
        }, this.deletingSpeed);
      }
    } else {
      if (this.currentCharIndex < processedText.length) {
        this.timeout = setTimeout(() => {
          this.displayedText += processedText[this.currentCharIndex];
          this.currentCharIndex++;
          this.updateDisplay();
          this.executeTypingAnimation();
        }, this.variableSpeed ? this.getRandomSpeed() : this.typingSpeed);
      } else if (this.textArray.length >= 1) {
        if (!this.loop && this.currentTextIndex === this.textArray.length - 1) return;
        this.timeout = setTimeout(() => {
          this.isDeleting = true;
          this.executeTypingAnimation();
        }, this.pauseDuration);
      }
    }
  }

  updateDisplay() {
    let html = this.displayedText
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br>");
      
    // Apply special styling to specific words
    html = html.replace(/BUSINESS/g, '<span class="text-type-business">BUSINESS</span>');
    html = html.replace(/SOLUTIONS/g, '<span class="text-type-solutions">SOLUTIONS</span>');

    this.contentSpan.innerHTML = html;

    if (this.showCursor && this.cursorSpan) {
      const shouldHideCursor = this.hideCursorWhileTyping && 
        (this.currentCharIndex < this.textArray[this.currentTextIndex].length || this.isDeleting);
      if (shouldHideCursor) {
        this.cursorSpan.classList.add('text-type__cursor--hidden');
      } else {
        this.cursorSpan.classList.remove('text-type__cursor--hidden');
      }
    }
  }
}

window.TextType = TextType;
