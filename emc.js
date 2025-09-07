// @ts-check
import { BeHive, seed, MountObserver } from 'be-hive/be-hive.js';
import {Registry} from 'be-hive/Registry.js';
import {aggs} from 'be-hive/aggEvt.js';
import { w as bw } from 'be-hive/w.js';
/** @import {EMC, EventListenerOrFn} from './ts-refs/trans-render/be/types' */
/** @import {Actions, PAP,  AP} from './ts-refs/be-observant/types' */;
/** @import {CSSQuery} from './ts-refs/trans-render/types.js' */

const dependencyPart = String.raw `(?<dependencyPart>.*)`;
const ofDependencies = String.raw `^(o|O)f ${dependencyPart}`;


/**
 * @type {Array<[string, string]>}
 */
const dssArrayKeys = [['dependencyPart', 'remoteSpecifiers']];
/**
 * @type {Partial<EMC<any, AP>>}
 */
export const emc = {
    base: 'be-observant',
    map: {
        '0.0': {
            instanceOf: 'Object$entences',
            objValMapsTo: '.',
            regExpExts: {
                parsedStatements: [
                    {
                        regExp: ofDependencies,
                        defaultVals:{},
                        dssArrayKeys
                    }

                ]
            }
        }
    },
    enhPropKey: 'beObservant',
    importEnh: async () => {
        const {BeObservant} = await import('./be-observant.js');
        return BeObservant;
    },
    
}

const mose = seed(emc);
MountObserver.synthesize(document, BeHive, mose);

