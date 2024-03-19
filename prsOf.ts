import { AP, PAP } from './types';

export function prsOf(self: AP) : PAP {
    const {Of, of} = self;
    const both = [...(Of || []), ...(of || [])];
    let refSArr: Array<string> = [];
    for(const ofS of both){
        const split = ofS.split(reAnd);
        refSArr = refSArr.concat(...split);
        console.log({split})
    }
    console.log({refSArr});
    return {

    }
}

//TODO:  move and use in trans-render
const reAnd = new RegExp(String.raw `(?<!\\)And`);