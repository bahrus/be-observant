export function getProxy(observedElement, fromProxy) {
    const beProxy = 'be-' + fromProxy;
    const decorator = observedElement.getRootNode().querySelector(`[if-wants-to-be="${beProxy}"],${beProxy}`);
    if (decorator === null)
        return;
    const map = decorator.targetToController;
    if (map === undefined)
        return;
    if (!map.has(observedElement))
        return;
    return map.get(observedElement).proxy;
}
