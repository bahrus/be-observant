import { tryParse } from 'trans-render/lib/prs/tryParse.js';
const localPropToSet = String.raw `(?<localPropToSet>[\w\-\:\|\+]+)`;
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
        if (test === null)
            throw 'PE';
        test.localPropToSet = test.localPropToSet?.replaceAll(':', ".");
        console.log({ setS, test });
        setRules.push(test);
    }
    return {
        setRules
    };
}
