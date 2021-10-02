export interface IObserve{
    observe: string,
    observeHost: boolean,
    observeClosest: string,
    on: string,
    valFromTarget: string,
    vft: string,
    valFromEvent: string,
    vfe: string,
    clone: boolean,
    skipInit: boolean,
    parseValAs: string,
    onProp: string,
    as: 'str-attr' | 'bool-attr' | 'obj-attr'
}