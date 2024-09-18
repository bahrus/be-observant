// @ts-check
import { BeHive, seed, MountObserver } from 'be-hive/be-hive.js';
import {Registry} from 'be-hive/Registry.js';
import {aggs} from 'be-hive/aggEvt.js';
/** @import {EMC, EventListenerOrFn} from './ts-refs/trans-render/be/types.d.ts' */
/** @import {Actions, PAP,  AP} from './ts-refs/be-observant/types' */;
/** @import {CSSQuery} from './ts-refs/trans-render/types.js' */

const dependencyPart = String.raw `(?<dependencyPart>.*)`;
//const ofDependencyPart = String.raw `of ${dependencyPart}`;
const ofDependencies = String.raw `^of ${dependencyPart}`;

/**
 * @type {Array<[string, string]>}
 */
const dssKeys = [['dependencyPart', 'remoteSpecifiers[]']];
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
                        defaultVals:{

                        },
                        dssKeys
                    }

                ]
            }
        }
    },
    enhPropKey: 'beObservant',
    importEnh: async () => {
        const {BeObservant} = await import('./be-observant.js');
        return BeObservant;
    }
}