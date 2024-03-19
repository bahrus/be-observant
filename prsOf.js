export function prsOf(self) {
    const { Of, of } = self;
    const both = [...(Of || []), ...(of || [])];
    let refSArr = [];
    for (const ofS of both) {
        const split = ofS.split(reAnd);
        refSArr = refSArr.concat(...split);
        console.log({ split });
    }
    console.log({ refSArr });
    return {};
}
//TODO:  move and use in trans-render
const reAnd = new RegExp(String.raw `(?<!\\)And`);
