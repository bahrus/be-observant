export class MyCustomElement extends HTMLElement {
    #isVegetarian;
    get isVegetarian() {
        return this.#isVegetarian;
    }
    set isVegetarian(nv) {
        this.#isVegetarian = nv;
        const div = this.shadowRoot?.querySelector('#isVegetarian');
        if (div !== null && div !== undefined)
            div.textContent = '' + nv;
    }
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.shadowRoot.innerHTML = String.raw `
        <div itemscope>
            <div id=someStringPropVal></div>
            <div id=isVegetarian></div>
            <h3>Example 1a</h3>
            <input name=isVegetarian type=checkbox onclick="return false;" be-observant>
            <h3>Example 1b</h3>
            <input type=checkbox onclick="return false;" be-observant='of /is vegetarian.'>
        </div>
        <be-hive></be-hive>
        `;
    }
}
customElements.define('my-custom-element', MyCustomElement);
