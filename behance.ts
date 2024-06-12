import {BeObservant} from './be-observant.js';
export {BeObservant} from './be-observant.js';
import {def} from 'trans-render/lib/def.js';

await BeObservant.bootUp();

def('be-bound', BeObservant);