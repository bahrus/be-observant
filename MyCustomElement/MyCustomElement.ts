import  '../MyPeerElement/MyPeerElement.js';
export class MyCustomElement extends HTMLElement{
    #isVegetarian: boolean | undefined;
    get isVegetarian(){
        return this.#isVegetarian;
    }
    set isVegetarian(nv){
        this.#isVegetarian = nv;
        const div = this.shadowRoot?.querySelector('#isVegetarian');
        if(div !== null && div !== undefined) div.textContent = '' + nv;
    }

    #age = 64;
    get age(){
        return this.#age;
    }
    set age(nv){
        this.#age = nv;
        const div = this.shadowRoot?.querySelector('#age');
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
            <div id=isVegetarian></div>
            <div id=age></div>
            <my-peer-element -some-bool-prop></my-peer-element>
            <!-- <h3>Example 1a</h3>
            <input name=isVegetarian type=checkbox onclick="return false;" be-observant>
            <h3>Example 1b</h3>
            <input type=checkbox onclick="return false;" be-observant='of /is vegetarian.'>
            <h3>Example 1c</h3>
            <input type=checkbox onclick="return false;" be-observant='of is vegetarian.'>
            <h3>Example 1d</h3>
            <input type=checkbox onclick="return false;" be-observant='of not is vegetarian.'>
            <h3>Example 1e</h3>
            <input type=readonly be-observant='of age - 20.'>
            
            <hr>
            <h3>Example 2a</h3>
            <input name=search type=search>
            <div be-observant='of @search.'></div>
            <h3>Example 2b</h3>
            <input id=searchString type=search>
            <div be-observant='of #search string.'></div>
            <h3>Example 2c</h3>
            <input type=checkbox onclick="return false" be-observant='of -some-bool-prop'> -->
            <input name=someCheckbox type=checkbox onclick="return false">

            <my-peer-element enh-by-be-observant='of @ some checkbox and assign to some bool prop'><my-peer-element>
        </div>
        <be-hive></be-hive>
        `;
    }
}

customElements.define('my-custom-element', MyCustomElement);