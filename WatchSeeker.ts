import {AP} from './types.js';
import {Seeker} from 'be-linked/Seeker.js';

export class WatchSeeker<TSelf = AP, TCtx = any> extends Seeker<TSelf, TCtx>{

    async callback<TSelf, TCtx>(self: TSelf, signalRef: HTMLInputElement, eventSuggestion: string, onOrOff: TCtx){
        
    }


}