export function getProxy(observedElement: Element, fromProxy: string){
    const beProxy = 'be-' + fromProxy;
    const decorator = (observedElement.getRootNode() as DocumentFragment).querySelector(`[if-wants-to-be="${beProxy}"],${beProxy}`);
    if(decorator === null) return;
    const map = (<any>decorator).targetToController as WeakMap<Element, any>;
    if(map === undefined) return;
    if(!map.has(observedElement)) return;
    return map.get(observedElement).proxy;
}