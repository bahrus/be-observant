import { BE } from 'be-enhanced/BE.js';
import { getRemoteProp } from 'be-linked/defaults.js';
class BeObservant extends BE {
    static config = {};
    async noAttrs(self) {
        const { enhancedElement } = self;
        const observedFactor = {
            s: '/',
            elS: '*',
            dss: '^',
            scopeS: '[itemscope]',
            rec: true,
            rnf: true,
            prop: getRemoteProp(enhancedElement),
            host: true
        };
        return {
            observedFactors: [observedFactor],
        };
    }
}
await BeObservant.bootUp();
export { BeObservant };
