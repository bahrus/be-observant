import { AP, PAP, ParsedSetStatement } from './types';
import { tryParse } from 'trans-render/lib/prs/tryParse.js';
import {RegExpOrRegExpExt} from 'trans-render/lib/prs/types';

const localPropToSet = String.raw `(?<localPropToSet>[\w\-\:\|\+]+)`;
const toDest = String.raw `(?<!\\)To(?<to>.*)`;

const reSetStatements: RegExpOrRegExpExt<ParsedSetStatement>[] = [
    {
        regExp: new RegExp(String.raw `^${localPropToSet}${toDest}`),
        defaultVals:{}
    },
    {
        regExp: new RegExp(String.raw `^${localPropToSet}`),
        defaultVals:{
            to: '$i'
        }
    }
]

export function prsSet(self: AP) : PAP {
    const {Set} = self;
    const setRules: Array<ParsedSetStatement> = [];
    for(const setS of Set!){
        const test = tryParse(setS, reSetStatements) as ParsedSetStatement;
        
        if(test === null) throw 'PE';
        test.localPropToSet = test.localPropToSet?.replaceAll(':', ".");
        console.log({setS, test});
        setRules.push(test);
    }
    return {
        setRules
    };
}