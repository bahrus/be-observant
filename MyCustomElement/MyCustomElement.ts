export class MyCustomElement extends HTMLElement{
    #someBoolProp: boolean | undefined;
    get someBoolProp(){
        return this.#someBoolProp;
    }
    set someBoolProp(nv){
        this.#someBoolProp = nv;
        const div = this.shadowRoot?.querySelector('#someBoolPropVal');
        if(div !== null && div !== undefined) div.textContent = '' + nv;
    }

    constructor(){
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback(){
        this.shadowRoot!.innerHTML = String.raw `
        <div itemscope>
            <div id=someStringPropVal></div>
            <div id=someBoolPropVal></div>
            <h3>Example 1a</h3>
            <input type=checkbox be-observant='of / is read only.'>
        </div>
        <be-hive></be-hive>
        `;
    }
}

customElements.define('my-custom-element', MyCustomElement);