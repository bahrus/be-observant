export async function substValPath(vps, valFromTarget, self) {
    let newValFromTarget = valFromTarget;
    for (const vp of vps) {
        const { localProp, name } = vp;
        if (localProp !== undefined) {
            const { getVal } = await import('trans-render/lib/getVal.js');
            const val = await getVal({ host: self }, localProp);
            newValFromTarget = newValFromTarget.replace('{' + name + '}', val);
        }
    }
    return newValFromTarget;
}
