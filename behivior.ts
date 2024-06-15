import {BeHive, EMC, seed, MountObserver} from 'be-hive/be-hive.js';
import {ObservingParameters} from './types';

const ofDependencies = String.raw `^of (?<dependencyPart>.*)`;

const andSetFrom = String.raw `^(.*)(s|S)et (?<localPropToSet>.*) from (?<dependencyPart>.*)`;

const dssKeys = [['dependencyPart', 'remoteSpecifiers[]']] as [string, string][];

export const emc: EMC = {
    base: 'be-observant',
    map: {
        '0.0': {
            instanceOf: 'Object$entences',
            objValMapsTo: '.',
            regExpExts: {
                parsedStatements: [
                    {
                        regExp: andSetFrom,
                        defaultVals: {
                            aggregateRemoteVals: 'Union'
                        } as ObservingParameters,
                        dssKeys,
                    },
                    {
                        regExp: ofDependencies,
                        defaultVals:{
                            aggregateRemoteVals: 'Union'
                        } as ObservingParameters,
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
};

const mose = seed(emc);

MountObserver.synthesize(document, BeHive, mose);
