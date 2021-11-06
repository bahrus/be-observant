export async function getProxy(observedElement: Element, fromProxy: string): Promise<Element>{
        const beProxy = 'be-' + fromProxy;
        const decorator = (observedElement.getRootNode() as DocumentFragment).querySelector(`[if-wants-to-be="${beProxy}"],${beProxy}`);
        if(decorator === null) {
            return await waitForProxy(observedElement, fromProxy);
        }
        const map = (<any>decorator).targetToController as WeakMap<Element, any>;
        if(map === undefined) {
            return await waitForProxy(observedElement, fromProxy);
        }
        if(!map.has(observedElement)) {
            return await waitForProxy(observedElement, fromProxy);
        }
        return map.get(observedElement).proxy;
}

function waitForProxy(observedElement: Element, fromProxy: string): Promise<Element>{
    return new Promise((resolve, reject) => {
        const beProxy = 'be-' + fromProxy;
        observedElement.addEventListener(`${fromProxy}::is-${fromProxy}`, e => {
            resolve((<any>e).detail.proxy);
        }, {once: true});
    });
}