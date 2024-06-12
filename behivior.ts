import {BeHive, EMC, seed, MountObserver} from 'be-hive/be-hive.js';

const onDependencies = String.raw `^of (?<dependencyPart>.*)`;

export const emc: EMC = {
    base: 'be-observant',
    map: {
        '0.0': {
            instanceOf: 'Object$entences',
            objValMapsTo: '.',
            regExpExts: {
                observedFactors: [
                    {
                        regExp: onDependencies,
                        defaultVals:[],
                        dssKeys: [['dependencyPart', 'dependencies[]']]
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
