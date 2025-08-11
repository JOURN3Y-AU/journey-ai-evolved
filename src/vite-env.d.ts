/// <reference types="vite/client" />

declare global {
  function gtag(command: 'config' | 'event', targetId: string, config?: any): void;
}
