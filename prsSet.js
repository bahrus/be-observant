import { tryParse } from 'trans-render/lib/prs/tryParse.js';
const localPropToSet = String.raw `(?<localPropToSet>[\w\-\:\|]+)`;
const toDest = String.raw `(?<!\\)To(?<to>.*)`;
const reSetStatements = [
    {
        regExp: new RegExp(String.raw `^${localPropToSet}${toDest}`),
        defaultVals: {}
    },
    {
        regExp: new RegExp(String.raw `^${localPropToSet}`),
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
        console.log({ setS, test });
        if (test === null)
            throw 'PE';
        setRules.push(test);
    }
    return {
        setRules
    };
}
