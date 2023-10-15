import {AP, ProPAP, PAP, ObserveRule} from './types';
import {ElTypes} from 'be-linked/types';
import {RegExpOrRegExpExt} from 'be-enhanced/types';
import {arr, tryParse} from 'be-enhanced/cpu.js';

export const strType = String.raw `\$|\#|\@|\/|\-`;
const remoteType = String.raw `(?<remoteType>${strType})`;
const remoteProp = String.raw `(?<remoteProp>[\w\-\+\*\/]+)`;
const arithmeticExpr = new RegExp(String.raw `^(?<remoteProp>[\w]+)(?<mathOp>\-|\+|\*\|\\)(?<mathEnd>(([0-9]*)|(([0-9]*)\.([0-9]*)))$)`);

const reOfObserveStatement: Array<RegExpOrRegExpExt<Partial<ObserveRule>>> = [
    {
        regExp: new RegExp(String.raw `^not${remoteType}${remoteProp}`),
        defaultVals:{
            negate: true
        }
    },
    {
        regExp: new RegExp(String.raw `^${remoteType}${remoteProp}`),
        defaultVals:{}
    },
    {
        regExp: new RegExp(String.raw `^not${remoteProp}`),
        defaultVals:{
            remoteType: '/',
            negate: true,
        }
    },
    {
        regExp: new RegExp(String.raw `^${remoteProp}`),
        defaultVals:{
            remoteType: '/'
        }
    },


];

export function prsOf(self: AP) : Array<ObserveRule> {
    const {Of, of} = self;
    const both = [...(Of || []), ...(of || [])];
    const observeRules: Array<ObserveRule> = [];
    for(const ofStatement of both){
        const test = tryParse(ofStatement, reOfObserveStatement) as ObserveRule;
        if(test === null) throw 'PE';
        const {remoteProp} = test;
        const test2 = arithmeticExpr.exec(remoteProp!);
        if(test2 !== null){
            Object.assign(test, test2.groups);
            test.mathEnd = Number(test.mathEnd);
        }
        //console.log({test, test2});
        observeRules.push(test);
    }
    return observeRules;
}