export function setAttr(target, propKey, as, val) {
    switch (as) {
        case 'str-attr':
            target.setAttribute(propKey, val.toString());
            break;
        case 'obj-attr':
            target.setAttribute(propKey, JSON.stringify(val));
            break;
        case 'bool-attr':
            if (val) {
                target.setAttribute(propKey, '');
            }
            else {
                target.removeAttribute(propKey);
            }
            break;
        case 'class':
            if (val) {
                target.classList.add(propKey);
            }
            else {
                target.classList.remove(propKey);
            }
            break;
        case 'part':
            if (val) {
                target.part.add(propKey);
            }
            else {
                target.part.remove(propKey);
            }
            break;
    }
}
