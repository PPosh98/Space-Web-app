import { initControls } from './controls.js';
import { loadModels } from './loader.js';
import { animation } from './animation.js';
import { setupResizeHandler } from './resizeHandler.js';
import { setupEventListeners } from './events.js';

setupResizeHandler();
initControls();
loadModels();
animation();
setupEventListeners();