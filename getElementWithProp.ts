import {getHost} from 'trans-render/lib/getHost.js';
export async function getElementWithProp(self: Element, propKey: string){
    let host = getHost(self);
    while(host){
        const {localName} = host;
        if(localName.includes('-')){
            await customElements.whenDefined(localName);
        }
        if(propKey in host){
            return host;
        }
        host = getHost(host);
    }
    return host;
}