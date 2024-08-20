import { initControls } from './controls.js';
import { loadModels } from './loader.js';
import { animation } from './animation.js';
import { setupResizeHandler } from './resizeHandler.js';

setupResizeHandler();
initControls();
loadModels();
animation();