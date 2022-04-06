import { getHost } from 'trans-render/lib/getHost.js';
export async function getElementWithProp(self, propKey) {
    let host = getHost(self);
    while (host) {
        const { localName } = host;
        if (localName.includes('-')) {
            await customElements.whenDefined(localName);
        }
        if (propKey in host) {
            return host;
        }
        host = getHost(host);
    }
    return host;
}
