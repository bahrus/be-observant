export async function getProxy(observedElement, fromProxy) {
    const beProxy = 'be-' + fromProxy;
    const decorator = observedElement.getRootNode().querySelector(`[if-wants-to-be="${beProxy}"],${beProxy}`);
    if (decorator === null) {
        return await waitForProxy(observedElement, fromProxy);
    }
    const map = decorator.targetToController;
    if (map === undefined) {
        return await waitForProxy(observedElement, fromProxy);
    }
    if (!map.has(observedElement)) {
        return await waitForProxy(observedElement, fromProxy);
    }
    return map.get(observedElement).proxy;
}
function waitForProxy(observedElement, fromProxy) {
    return new Promise((resolve, reject) => {
        const beProxy = 'be-' + fromProxy;
        observedElement.addEventListener(`${fromProxy}::is-${fromProxy}`, e => {
            resolve(e.detail.proxy);
        }, { once: true });
    });
}
