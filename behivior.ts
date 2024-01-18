import {register} from 'be-hive/register.js';
import {tagName } from './be-observant.js';
import './be-observant.js';

const ifWantsToBe = 'observant';
const upgrade = '*';

register(ifWantsToBe, upgrade, tagName);