import { BeHive, seed, MountObserver } from 'be-hive/be-hive.js';
export const emc = {
    base: 'be-observant',
    map: {
        '0.0': {
            mapsTo: 'eventName',
            valIfFalsy: 'i-am-here'
        }
    },
    enhPropKey: 'beObservant',
    importEnh: async () => {
        const { BeObservant } = await import('./behance.js');
        return BeObservant;
    }
};
const mose = seed(emc);
MountObserver.synthesize(document, BeHive, mose);
