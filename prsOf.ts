import {AP, ProPAP, PAP, ObserveRule} from './types';
import {ElTypes} from 'be-linked/types';
import {RegExpOrRegExpExt} from 'be-enhanced/types';
import {arr, tryParse} from 'be-enhanced/cpu.js';

export const strType = String.raw `\$|\#|\@|\/|\-`;
const remoteType = String.raw `(?<remoteType>${strType})`;
const remoteProp = String.raw `(?<remoteProp>[\w\-]+)`;

const reOfObserveStatement: Array<RegExpOrRegExpExt<Partial<ObserveRule>>> = [
    {
        regExp: new RegExp(String.raw `^${remoteType}${remoteProp}`),
        defaultVals:{}
    }
];

export function prsOf(self: AP) : Array<ObserveRule> {
    const {Of, of} = self;
    const both = [...(Of || []), ...(of || [])];
    const observeRules: Array<ObserveRule> = [];
    for(const ofStatement of both){
        const test = tryParse(ofStatement, reOfObserveStatement) as ObserveRule;
        if(test === null) throw 'PE';
        observeRules.push(test);
    }
    return observeRules;
}