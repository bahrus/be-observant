import { AP, PAP, ParsedSetStatement } from './types';
import { tryParse } from 'trans-render/lib/prs/tryParse.js';
import {RegExpOrRegExpExt} from 'trans-render/lib/prs/types';

const prop = String.raw `(?<localPropToSet>[\w\-\:\|]+)`;

const reSetStatements: RegExpOrRegExpExt<ParsedSetStatement>[] = [
    {
        regExp: new RegExp(String.raw `^${prop}`),
        defaultVals:{
            to: '$1'
        }
    }
]

export function prsSet(self: AP) : PAP {
    const {Set} = self;
    const setRules: Array<ParsedSetStatement> = [];
    for(const setS of Set!){
        const test = tryParse(setS, reSetStatements) as ParsedSetStatement
        if(test === null) throw 'PE';
        setRules.push(test);
    }
    return {
        setRules
    };
}