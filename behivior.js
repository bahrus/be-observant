import { BeHive, seed, MountObserver } from 'be-hive/be-hive.js';
const ofDependencyPart = String.raw `of (?<dependencyPart>.*)`;
const ofDependencies = String.raw `^${ofDependencyPart}`;
const setLocalPropToSet = String.raw `^(.*)(s|S)et (?<localPropToSet>.*)`;
const andSetFrom = String.raw `${setLocalPropToSet} from (?<dependencyPart>.*)`;
const andSetFromUnionOfDependencyParty = String.raw `${setLocalPropToSet} to the union ${ofDependencyPart}`;
const dssKeys = [['dependencyPart', 'remoteSpecifiers[]']];
export const emc = {
    base: 'be-observant',
    map: {
        '0.0': {
            instanceOf: 'Object$entences',
            objValMapsTo: '.',
            regExpExts: {
                parsedStatements: [
                    {
                        regExp: andSetFromUnionOfDependencyParty,
                        defaultVals: {
                            aggregateRemoteVals: 'Union'
                        },
                        dssKeys,
                    },
                    {
                        regExp: andSetFrom,
                        defaultVals: {
                            aggregateRemoteVals: 'Conjunction'
                        },
                        dssKeys,
                    },
                    {
                        regExp: ofDependencies,
                        defaultVals: {
                            aggregateRemoteVals: 'Conjunction'
                        },
                        dssKeys
                    }
                ]
            }
        }
    },
    enhPropKey: 'beObservant',
    importEnh: async () => {
        const { BeObservant } = await import('./be-observant.js');
        return BeObservant;
    }
};
const mose = seed(emc);
MountObserver.synthesize(document, BeHive, mose);
