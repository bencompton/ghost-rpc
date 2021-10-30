import { initMock } from './mock-setup';
import { initFull } from './full-setup';

// import.meta is evaluated during build time, so tree-shaking should remove any extraneous resources from the unused mode
if (import.meta.env.MODE === 'mock') {
  initMock();
} else {
  initFull();
}
