import { BeHive, seed, MountObserver } from 'be-hive/be-hive.js';
const ofDependencies = String.raw `^of (?<dependencyPart>.*)`;
const andSetFrom = String.raw `^and set (?<localPropToSet>.^) from (?<dependencyPart>.*)`;
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
                        regExp: andSetFrom,
                        defaultVals: {
                            aggregateRemoteVals: 'Union'
                        },
                        dssKeys,
                    },
                    {
                        regExp: ofDependencies,
                        defaultVals: {
                            aggregateRemoteVals: 'Union'
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
