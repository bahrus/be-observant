import { ActionOnEventConfigs } from "trans-render/froop/types";
import {IEnhancement} from 'trans-render/be/types';
import {ElTypes, LocalSignal, SignalAndEvent, SignalRefType} from 'be-linked/types';
import { Specifier } from "trans-render/dss/types";

export interface EndUserProps extends IEnhancement{
    
} 

export interface AllProps extends EndUserProps{
    isScriptExpression: boolean,
    //observedFactors?: Array<Specifier>,
    parsedStatements?: Array<ObservingParameters>,
    bindings?: Array<EndPoints>
}




export type AP = AllProps;

export type PAP = Partial<AP>;

export type ProPAP = Promise<PAP>;

export type POA = [PAP | undefined, ActionOnEventConfigs<PAP, Actions>];

// export type LifecycleEvent = 'init' | 'update';

export interface Actions{
    noAttrs(self: this): ProPAP;
    seek(self: this): ProPAP;
    hydrate(self: this): ProPAP;
}


export interface ObservingParameters{
    localPropToSet?: string,
    remoteSpecifiers: Array<Specifier>,
    aggregateRemoteVals?: 'Union' | 'Objectifying' | 'Negating' | 'Toggling' | 'Sum'
}

export interface EndPoints extends ObservingParameters{
    localSignal?: LocalSignal,
    remoteSignalAndEvents: Array<SignalAndEvent>
}
 



// export interface ObserverOptions{
//     abortControllers: Array<AbortController>,
//     remoteEl?: Element,
// }

export type LoadEventName = 'load';

export interface EventForObserver{
    o: ObserverEventModel,
    enh: string,
}

export interface ObserverEventModel{
    factors: {[key: string] : any},
    vals: any[],
    setProps?: {[key: string]: any};
}