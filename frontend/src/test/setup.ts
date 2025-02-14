import "@testing-library/jest-dom"; // Ensures jest matchers are available

// Properly define a mock ResizeObserver with prototype
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
} as unknown as typeof ResizeObserver;