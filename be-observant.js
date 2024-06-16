import { config as beCnfg } from 'be-enhanced/config.js';
import { BE } from 'be-enhanced/BE.js';
import { getRemoteProp } from 'be-linked/defaults.js';
import { Seeker } from 'be-linked/Seeker.js';
import { getObsVal } from 'be-linked/getObsVal.js';
class BeObservant extends BE {
    static config = {
        propDefaults: {},
        propInfo: {
            ...beCnfg.propInfo,
            parsedStatements: {},
            bindings: {},
            rawStatements: {},
        },
        actions: {
            noAttrs: {
                ifNoneOf: ['parsedStatements']
            },
            seek: {
                ifAtLeastOneOf: ['parsedStatements']
            },
            hydrate: {
                ifAllOf: ['bindings']
            },
        },
        positractions: [
            {
                do: 'warn',
                ifAllOf: ['rawStatements'],
                pass: ['`The following statements could not be parsed.`', 'rawStatements']
            }
        ]
    };
    #emc;
    #hasOnload;
    #localSignal;
    warn = console.warn;
    async #getLocalSignal() {
        if (this.#localSignal !== undefined)
            return this.#localSignal;
        const { getLocalSignal } = await import('be-linked/defaults.js');
        this.#localSignal = await getLocalSignal(this.enhancedElement);
        return this.#localSignal;
    }
    async attach(el, enhancementInfo) {
        const { mountCnfg } = enhancementInfo;
        this.#emc = mountCnfg;
        this.#hasOnload = !!el.onload;
        super.attach(el, enhancementInfo);
    }
    async noAttrs(self) {
        const { enhancedElement } = self;
        const specifier = {
            s: '/',
            elS: '*',
            dss: '^',
            scopeS: '[itemscope]',
            rec: true,
            rnf: true,
            prop: getRemoteProp(enhancedElement),
            host: true
        };
        const parsedStatement = {
            remoteSpecifiers: [specifier],
            aggregateRemoteVals: this.#hasOnload ? 'ObjectAssign' : 'Conjunction'
        };
        return {
            parsedStatements: [parsedStatement]
        };
    }
    async seek(self) {
        const { parsedStatements, enhancedElement } = self;
        const bindings = [];
        for (const ps of parsedStatements) {
            if (ps.aggregateRemoteVals === 'Conjunction' && this.#hasOnload) {
                ps.aggregateRemoteVals = 'ObjectAssign';
            }
            const { localPropToSet, remoteSpecifiers } = ps;
            let localSignal;
            if (localPropToSet) {
                localSignal = {
                    signal: enhancedElement,
                    prop: localPropToSet,
                    type: 'na'
                };
            }
            else if (!this.#hasOnload) {
                localSignal = await this.#getLocalSignal();
            }
            //undefined ? 
            const remoteSignalAndEvents = [];
            for (const remoteSpecifier of remoteSpecifiers) {
                const seeker = new Seeker(remoteSpecifier, false);
                const res = await seeker.do(self, undefined, enhancedElement);
                remoteSignalAndEvents.push(res);
            }
            const endPoints = {
                ...ps,
                remoteSignalAndEvents,
                localSignal
            };
            bindings.push(endPoints);
        }
        return {
            bindings
        };
    }
    async hydrate(self) {
        const { bindings } = self;
        for (const endPoints of bindings) {
            await this.#pullInValue(self, endPoints);
            this.#scheduleUpdates(self, endPoints);
        }
        return {
            resolved: true
        };
    }
    async #pullInValue(self, endPoints) {
        const { enhancedElement } = this;
        const { remoteSignalAndEvents, remoteSpecifiers, localSignal, aggregateRemoteVals } = endPoints;
        let i = 0;
        let accumulator;
        switch (aggregateRemoteVals) {
            case 'Sum':
                accumulator = 0;
                break;
            case 'Product':
                accumulator = 1;
                break;
            case 'ObjectAssign':
                accumulator = {};
                break;
            case 'Conjunction':
                accumulator = true;
                break;
            case 'ArrayPush':
                accumulator = [];
        }
        for (const rse of remoteSignalAndEvents) {
            const { signal } = rse;
            const hardRef = signal?.deref();
            if (hardRef === undefined) {
                rse.isStale = true;
                i++;
                continue;
            }
            const remoteSpecifier = remoteSpecifiers[i];
            const remoteVal = await getObsVal(hardRef, remoteSpecifier, enhancedElement);
            switch (aggregateRemoteVals) {
                case 'Union':
                    accumulator = accumulator || remoteVal;
                    break;
                case 'Conjunction':
                    accumulator = accumulator && remoteVal;
                    break;
                case 'Sum':
                    accumulator += remoteVal;
                    break;
                case 'Product':
                    accumulator *= remoteVal;
                    break;
                case 'ObjectAssign':
                    accumulator[remoteSpecifier.prop] = remoteVal;
                    accumulator[i] = remoteVal;
                    break;
                case 'ArrayPush':
                    accumulator.push(remoteVal);
                    break;
            }
            i++;
        }
        endPoints.remoteSignalAndEvents = endPoints.remoteSignalAndEvents.filter(x => !x.isStale);
        if (this.#hasOnload) {
            const setProps = {};
            const loadEvent = new LoadEvent(accumulator, setProps, this.#emc.enhPropKey);
            enhancedElement.dispatchEvent(loadEvent);
            Object.assign(enhancedElement, loadEvent.setProps);
        }
        else {
            const { prop, signal: localHardRef } = localSignal;
            localHardRef[prop] = accumulator;
        }
        //TODO remove
    }
    #ac = [];
    async #scheduleUpdates(self, endPoints) {
        const { remoteSignalAndEvents, remoteSpecifiers } = endPoints;
        let i = 0;
        for (const rse of remoteSignalAndEvents) {
            const { signal, propagator } = rse;
            const hardRef = signal?.deref();
            if (hardRef === undefined) {
                rse.isStale = true;
                i++;
                continue;
            }
            const remoteSpecifier = remoteSpecifiers[i];
            const eventName = remoteSpecifier.evt || rse.eventSuggestion;
            const ac = new AbortController();
            (propagator || hardRef).addEventListener(eventName, e => {
                this.#pullInValue(self, endPoints);
            }, { signal: ac.signal });
            i++;
        }
    }
}
export class LoadEvent extends Event {
    factors;
    setProps;
    enh;
    static EventName = 'load';
    constructor(factors, setProps, enh) {
        super(LoadEvent.EventName);
        this.factors = factors;
        this.setProps = setProps;
        this.enh = enh;
    }
}
await BeObservant.bootUp();
export { BeObservant };
