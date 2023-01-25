import {ValPathSubstitutions} from './types';

export async function substValPath(vps: ValPathSubstitutions[], valFromTarget: string, self: Element): Promise<string>{
    let newValFromTarget = valFromTarget;
    for(const vp of vps){
        const {localProp, name} = vp;
        if(localProp !== undefined){
            const {getVal} = await import('trans-render/lib/getVal.js');
            const val = await getVal({host: self}, localProp);
            newValFromTarget = newValFromTarget.replace('{' + name + '}', val);

        }
    }
    return newValFromTarget;
}