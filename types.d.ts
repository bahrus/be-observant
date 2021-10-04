export interface IObserve{
    observe: string,
    //observeHost: boolean,
    observeClosest: string,
    on: string,
    valFromTarget: string,
    vft: string,
    valFromEvent: string,
    vfe: string,
    clone: boolean,
    skipInit: boolean,
    parseValAs: string,
    onSet: string,
    as: 'str-attr' | 'bool-attr' | 'obj-attr',
    trueVal: any,
    falseVal: any,
}