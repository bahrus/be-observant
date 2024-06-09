//import {prsElO} from 'trans-render/lib/prs/prsElO.js';
import { parse } from 'trans-render/dss/parse.js';
export async function prsOf(self) {
    const { Of, of } = self;
    const both = [...(Of || []), ...(of || [])];
    let refSArr = [];
    for (const ofS of both) {
        const split = ofS.split(reAnd);
        refSArr = refSArr.concat(...split);
    }
    refSArr = refSArr.map(s => {
        const head = s[0];
        if ('A' <= head && head <= 'z') {
            return '/' + s;
        }
        return s;
    });
    const observedFactors = await Promise.all(refSArr.map(async (s) => await parse(s)));
    //console.log({observedFactors, refSArr});
    return {
        observedFactors
    };
}
//TODO:  use in be-switched also
const reAnd = new RegExp(String.raw `(?<!\\)And`);
