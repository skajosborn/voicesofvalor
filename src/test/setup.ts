import '@testing-library/jest-dom';

// Polyfill window.scrollTo
window.scrollTo = () => {};

// Polyfill ResizeObserver for Radix UI
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserverMock;

// Polyfill HTMLCanvasElement.prototype.getContext
HTMLCanvasElement.prototype.getContext = (() => {
  return {
    fillRect: () => {},
    clearRect: () => {},
    getImageData: () => ({ data: [] }),
    putImageData: () => {},
    createImageData: () => [],
    setTransform: () => {},
    drawImage: () => {},
    save: () => {},
    fillText: () => {},
    restore: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    stroke: () => {},
    translate: () => {},
    scale: () => {},
    rotate: () => {},
    arc: () => {},
    fill: () => {},
    roundRect: () => {},
    createLinearGradient: () => ({
      addColorStop: () => {},
    }),
  } as unknown as RenderingContext;
}) as unknown as typeof HTMLCanvasElement.prototype.getContext;

// Polyfill requestAnimationFrame / cancelAnimationFrame
window.requestAnimationFrame = (callback: FrameRequestCallback) => {
  return setTimeout(callback, 16) as unknown as number;
};
window.cancelAnimationFrame = (handle: number) => {
  clearTimeout(handle);
};

// Mock Web Audio API for testing environment
class AudioContextMock {
  state = 'running';
  sampleRate = 44100;
  currentTime = 0;
  destination = {};

  createGain() {
    return {
      gain: {
        value: 1,
        setValueAtTime: () => {},
        linearRampToValueAtTime: () => {},
        exponentialRampToValueAtTime: () => {},
        setTargetAtTime: () => {},
      },
      connect: () => {},
      disconnect: () => {},
    };
  }

  createOscillator() {
    return {
      type: 'sine',
      frequency: {
        value: 440,
        setValueAtTime: () => {},
        linearRampToValueAtTime: () => {},
      },
      connect: () => {},
      disconnect: () => {},
      start: () => {},
      stop: () => {},
    };
  }

  createMediaElementSource() {
    return {
      connect: () => {},
      disconnect: () => {},
    };
  }

  createAnalyser() {
    return {
      fftSize: 512,
      frequencyBinCount: 256,
      smoothingTimeConstant: 0.85,
      getByteFrequencyData: (array: Uint8Array) => {
        for (let i = 0; i < array.length; i++) {
          array[i] = Math.floor(Math.random() * 255);
        }
      },
      getByteTimeDomainData: (array: Uint8Array) => {
        for (let i = 0; i < array.length; i++) {
          array[i] = 128;
        }
      },
      connect: () => {},
      disconnect: () => {},
    };
  }

  createBiquadFilter() {
    return {
      type: 'lowpass',
      frequency: { value: 1000, setValueAtTime: () => {} },
      Q: { value: 1 },
      connect: () => {},
      disconnect: () => {},
    };
  }

  createBufferSource() {
    return {
      buffer: null,
      connect: () => {},
      disconnect: () => {},
      start: () => {},
      stop: () => {},
    };
  }

  resume() {
    this.state = 'running';
    return Promise.resolve();
  }

  suspend() {
    this.state = 'suspended';
    return Promise.resolve();
  }

  close() {
    this.state = 'closed';
    return Promise.resolve();
  }
}

// @ts-expect-error Mock AudioContext globally
window.AudioContext = AudioContextMock;
// @ts-expect-error Mock webkitAudioContext globally
window.webkitAudioContext = AudioContextMock;

// Mock HTMLMediaElement prototype methods
window.HTMLMediaElement.prototype.play = () => Promise.resolve();
window.HTMLMediaElement.prototype.pause = () => {};
window.HTMLMediaElement.prototype.load = () => {};
