import {register} from 'be-hive/register.js';
import {tagName } from './legacy/be-observant.js';
import './legacy/be-observant.js';

const ifWantsToBe = 'observant';
const upgrade = '*';

register(ifWantsToBe, upgrade, tagName);