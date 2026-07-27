/// <reference types="chrome"/>

declare module '*.css' {
  const value: string;
  export default value;
}

declare module '*.html' {
  import { ViteDevServer } from 'vite';
  const value: string;
  export default value;
}