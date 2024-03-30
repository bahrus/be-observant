import { AP, PAP } from './types';
//import {prsElO} from 'trans-render/lib/prs/prsElO.js';
import {parse} from 'trans-render/dss/parse.js';

export async function prsOf(self: AP) : Promise<PAP> {
    const {Of, of} = self;
    const both = [...(Of || []), ...(of || [])];
    let refSArr: Array<string> = [];
    for(const ofS of both){
        const split = ofS.split(reAnd);
        refSArr = refSArr.concat(...split);
    }
    
    const observedFactors = await Promise.all( refSArr.map(async s => await parse(s)));
    //console.log({observedFactors, refSArr});
    return {
        observedFactors
    };
}

//TODO:  use in be-switched also
const reAnd = new RegExp(String.raw `(?<!\\)And`);