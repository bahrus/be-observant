import { tryParse } from 'be-enhanced/cpu.js';
export const strType = String.raw `\$|\#|\@|\/|\-`;
const remoteType = String.raw `(?<remoteType>${strType})`;
const remoteProp = String.raw `(?<remoteProp>[\w\-]+)`;
const reOfObserveStatement = [
    {
        regExp: new RegExp(String.raw `^${remoteType}${remoteProp}`),
        defaultVals: {}
    },
    {
        regExp: new RegExp(String.raw `^${remoteProp}`),
        defaultVals: {
            remoteType: '/'
        }
    }
];
export function prsOf(self) {
    const { Of, of } = self;
    const both = [...(Of || []), ...(of || [])];
    const observeRules = [];
    for (const ofStatement of both) {
        const test = tryParse(ofStatement, reOfObserveStatement);
        if (test === null)
            throw 'PE';
        observeRules.push(test);
    }
    return observeRules;
}
