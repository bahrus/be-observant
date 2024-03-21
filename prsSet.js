import { tryParse } from 'trans-render/lib/prs/tryParse.js';
const prop = String.raw `(?<localPropToSet>[\w\-\:\|]+)`;
const reSetStatements = [
    {
        regExp: new RegExp(String.raw `^${prop}`),
        defaultVals: {
            to: '$i'
        }
    }
];
export function prsSet(self) {
    const { Set } = self;
    const setRules = [];
    for (const setS of Set) {
        const test = tryParse(setS, reSetStatements);
        if (test === null)
            throw 'PE';
        setRules.push(test);
    }
    return {
        setRules
    };
}
