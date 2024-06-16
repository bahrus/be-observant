import {BeHive, EMC, seed, MountObserver} from 'be-hive/be-hive.js';
import {ObservingParameters} from './types';

const ofDependencyPart = String.raw `of (?<dependencyPart>.*)`;
const ofDependencies = String.raw `^${ofDependencyPart}`;
const setLocalPropToSet = String.raw `^(.*)(s|S)et (?<localPropToSet>.*)`;

const andSetFrom = String.raw `${setLocalPropToSet} from (?<dependencyPart>.*)`;

const andSetFromUnionOfDependencyPart = String.raw `${setLocalPropToSet} to the union ${ofDependencyPart}`;

const andSetFromSumOfDependencyPart = String.raw `${setLocalPropToSet} to the sum of ${ofDependencyPart}`;

const andSetFromProductOfDependencyPart = String.raw `${setLocalPropToSet} to the sum of ${ofDependencyPart}`;

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
                        regExp: andSetFromUnionOfDependencyPart,
                        defaultVals: {
                            aggregateRemoteVals: 'Union'
                        } as ObservingParameters,
                        dssKeys,
                    },
                    {
                        regExp: andSetFromSumOfDependencyPart,
                        defaultVals: {
                            aggregateRemoteVals: 'Sum'
                        } as ObservingParameters,
                        dssKeys,
                    },
                    {
                        regExp: andSetFromProductOfDependencyPart,
                        defaultVals: {
                            aggregateRemoteVals: 'Product'
                        } as ObservingParameters,
                        dssKeys,
                    },
                    {
                        regExp: andSetFrom,
                        defaultVals: {
                            aggregateRemoteVals: 'Conjunction'
                        } as ObservingParameters,
                        dssKeys,
                    },
                    {
                        regExp: ofDependencies,
                        defaultVals:{
                            aggregateRemoteVals: 'Conjunction'
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
