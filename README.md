# be-observant

Observe properties of peer elements or the host.

*be-observant* takes less of a "top-down" approach to binding than traditional frameworks.  It places less emphasis (but certainly not none) on binding exclusively from the (custom element) host container.  Yes, it can do that, but it can also provide for "Democratic Web Component Organisms" where the host container acts as a very thin "Skin Layer" which can be passed a small number of "stimuli" values into.  Inside the body of the web component, we might have a non visible "brain" component that dispatches events.  *be-observant* allows other peer elements within the "body" to receive messages that the brain component emits, without forcing the outer "skin" layer to have to micromanage this all.

[![NPM version](https://badge.fury.io/js/be-observant.png)](http://badge.fury.io/js/be-observant)
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-observant?style=for-the-badge)](https://bundlephobia.com/result?p=be-observant)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-observant?compression=gzip">
[![Playwright Tests](https://github.com/bahrus/be-observant/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/be-observant/actions/workflows/CI.yml)


> [!Note]
> An extra thin layer can be applied on top of be-observant, so that the original HTML that is streamed from the server can provide the initial values of the property that *be-observant* observes, and then once that initial handshake is established, lean exclusively on *be-observant* for all subsequent updates.  This is handled by [be-entrusting](https://github.com/bahrus/be-entrusting).


## The most quintessential example

The example below follows the traditional "pass props down" from the host approach, only really it is "pulling props in". You say tomāto, I say tomäto kind of thing.

```html
<mood-stone>
    #shadow
    <input 
        name=isHappy 
        disabled 
        type=checkbox  
        be-observant>
</mood-stone>
```

What this does:  Observes and one-way passes *mood-stone*'s isHappy property value to the input element's checked property.

be-observant is making a few inferences:  

1.  The name of the input element will match with the name of the host property from which we would want to bind it.  Why adopt confusing mappings if we can possibly avoid it? 
2.  Since the type of input element is a checkbox, set the "checked" property from the host. 



> [!Note]
> *be-observant* is a rather lengthy word to have to type over and over again, and this element enhancement would likely be sprinkled around quite a bit in a web application.  The name is registered in the optional file [behivior.js](https://github.com/bahrus/be-observant/blob/baseline/behivior.js) so to use whatever name makes sense to you (be-o, be-obs?) within your application, just don't reference that file, and instead create and reference your own registration file.  Names can also be overridden within a [Shadow scope](https://github.com/bahrus/be-hive) as well.  Throughout the rest of this document, we will use be-o instead of be-observant, and ask that you make a "mental map" of "o" to observant.  In fact, this package does provide an alternative registration file, be-o.js, that registers the enhancement via attribute "be-o".

If you only use this enhancement once in a large application, spelling out the full name (and referencing the canonical behivior.js file) would probably make the most sense, for locality of behavior reasons, and also tapping into google searches.  But I would strongly consider using a shortcut in any application that intends to rely on this enhancement in a heavy way.

## Back to our quintessential example

As we already discussed, in the example above, we made the assumption that if the user gives the input element name "isHappy", that the choice of name will most likely match the identical property name coming from the host web component container.

If this assumption doesn't hold in some cases, then we can specify the name of the property we want to observe from the host:

## Specifying the host property to observe

```html
<mood-stone>
    #shadow
    <input 
        type=checkbox 
        disabled 
        be-observant='of / is happy.'
    >
</mood-stone>
```

Now that we've spelled out the full word twice (*be-observant*), from now on, we will use "be-o" as our shortcut for be-observant, but please apply the mental mapping from be-o to the full name, for the statements to make the most sense.  This package even contains a registration file ('be-o') that utilizes this abbreviation.

The slash ("/") symbol indicates to get the value from the host.  If omitted, it is assumed:

## Reducing cryptic syntax

```html
<mood-stone>
    #shadow
    <input 
        type=checkbox 
        disabled 
        be-o='of is happy.'
    >
</mood-stone>
```

The space between is and happy can also be omitted, if case is specified:

## Reducing number of spaces at expense of readability?

```html
<mood-stone>
    #shadow
    <input 
        type=checkbox 
        disabled 
        be-o='of isHappy.'
    >
</mood-stone>
```

Okay, now that I've thoroughly bored you to tears...

## Binding based on microdata attribute.

```html
<mood-stone>
    <template shadowrootmode=open>
        <div itemscope>
            <span itemprop=isHappy be-o></span>
        </div>

        <xtal-element
            prop-defaults='{
                "isHappy": true
            }'

        ></xtal-element>
        <be-hive></be-hive>
    </template>
</mood-stone>
```

This sets the span's textContent to the .toString value of moon-stone's isHappy property, and monitors for changes, i.e. one-way binds.

## By Id also works:

```html
<mood-stone>
    <template shadowrootmode=open>
        <div itemscope>
            <span itemprop=isHappy></span>
        </div>
        <input 
            id=isHappy 
            disabled 
            type=checkbox  
            be-o
        >
        <xtal-element
            prop-defaults='{
                "isHappy": true
            }'
            xform='{
                "| isHappy": 0
            }'
        ></xtal-element>
        <be-hive></be-hive>
    </template>
</mood-stone>
```

Note that the itemprop attribute takes precedence over the name attribute, which takes precedence over the id attribute.

## Special Symbols

In the example above, we mentioned using the / symbol to indicate to observe a property from the host.  But be-observant can also observe peer elements within the ShadowRoot (or outside any shadow root *be-observant* adorns an element sitting outside any ShadowRoot).

What follows is a listing of other special symbols we can use to be able to observe other peer elements within the ShadowRoot realm.  We stick to single character symbols in order to keep the statements small:


| Symbol       | Meaning                        | Notes                                                                                |
|--------------|--------------------------------|--------------------------------------------------------------------------------------|
| /propName    |"Hostish"                       | Binds to a "propagator" EventTarget.                                                 |
| @propName    |Name attribute                  | Listens for input events by default.                                                            |
| \|propName    |Itemprop attribute              | If contenteditible, listens for input events.  Otherwise, uses be-value-added.       |
| #propName    |Id attribute                    | Listens for input events by default.                                                            |
| %propName    |match based on part attribute   | Listens for input events by default.                                                            |
| -prop-name   |Marker indicates prop           | Binds to a "propagator" EventTarget.                                               | 
| ~elementName |match based on element name     | Listens for input events. [TODO]                                                           |


"Hostish" means:

1.  First, do a "closest" for an element with attribute itemscope, where the tag name has a dash in it.  Do that search recursively.  
2.  If no match found, use getRootNode().host.

<!--

## Example 1d  Negation

```html
<mood-stone>
    #shadow
    <input type=checkbox disabled be-observant='of not is vegetarian.'>
</mood-stone>
```

## Example 1e Translation 

```html
<mood-stone>
    #shadow
    <input type=readonly be-observant='of age - 20.'>
</mood-stone>
```

Can also use addition (+), multiplication (*), division (/) [Untested].

-->

## Binding to peer elements

Now we will start to see how be-observant provides for more "grass-roots" democratic organism (web component) support.

## By name attribute

```html
<input name=search type=search>

<div be-o='of @search.'></div>
```

As the user types in the input field, the div's text content reflects the value that was typed.

The search for the element with name=search is done within the closest form element, and if not found, within the (shadow)root node.

## By id

This also works:

```html
<input id=searchString type=search>

<div be-o='of # search string.'></div>
```

The search for element with id=searchString is done within the (shadow)root node, since id's are supposed to be unique with a (shadow)root node.

## By markers

```html
<mood-stone>
    #shadow
    <my-peer-element -some-bool-prop></my-peer-element>
    <input 
        type=checkbox 
        disabled 
        be-o='of -some-bool-prop'
    >
</mood-stone>
```

This observes the my-peer-element's someBoolProp property for changes and sets the adorned element's checked property based on the current value.

## By itemprop

```html
<link itemprop=isHappy href=https://schema.org/True>

...

<input 
    type=checkbox 
    be-o='of | is happy.'
>
```

What this does:  If necessary, auto attaches the [be-value-added](https://github.com/bahrus/be-value-added) enhancement to the link element, which recognizes the True/False values of schema.org as far as the href attribute, and provides a property oHTMLLinkElement.beValueAdded.value through which updated properties can be passed / listened to.  Essentially it provides a hidden boolean "signal" we can bind to and also use for styling purposes.

The editable checkbox element can observe changes to this "signal".

We saw earlier that we can adorn elements with the itemprop attribute with be-o attribute, and it will automatically pull in values from the host.  This allows us to create a code-free "chain" of bindings from the host to Shadow Children, and from the Shadow children to peer elements.

# Specifying the property to assign the observed value to.

What we've seen above is a lot of mind reading about what your intentions are, based on context.  But sometimes we need to be more explicit because it isn't always transparent what we intend.

## Single mapping from observed "signal" to observe, specified property of the adorned element.

```html
<input name=someCheckbox type=checkbox>

<my-peer-element enh-be-o='
    Of @ someCheckbox.
    Set someBoolProp.
    '></my-peer-element>

```

This watches the input element for input events and passes the checked property to someBoolProp of oMyPeerElement.

## Observing multiple "signals"


```html
<input name=yourCheckbox type=checkbox>
<input name=myCheckbox type=checkbox>

<my-peer-element enh-be-o='
    Of @yourCheckbox and @myCheckbox.
    Set myFirstProp to $1.
    Set mySecondProp to $2.
'></my-peer-element>
```

1 and 2 refer to the 1-based index of observed values from the "Of" statement(s).

The enh- prefix is there to avoid possible conflicts with attributes recognized by my-peer-element.

## For the power hungry JS-firsters

As our HTML markup becomes more complex, I suspect many readers will begin asking themselves:

>  This is all great, but what if I just want to do some coding?  Why learn all this contrived syntax?

Fair enough. 

We now provide an interlude where we indicate how to inject JavaScript into the picture, and set properties, and derive properties as we need, with full, unfettered access to the JavaScript run time.

## Scripting bravely

*be-observant* empowers the developer to tap into the full power of the JavaScript run time engine by adding script to the onload event.


If we know that this enhancement is the only enhancement affecting the adorned element that leverages the onload event, we can skip some defensive maneuvers that avoid collisions with other enhancements (discussed in the next example), resulting in a fairly compact script:

```html
<mood-stone>
    #shadow
    
    <input name=name>
    <input name=food>

    <my-peer-element 
        enh-be-o='of @name and @food.'
        onload="
            const {o} = event;
            o.setProps = {
                myFirstProp: `${o.factors.name} eats ${o.factors.food}`,
            } 
        "
    ></my-peer-element>
</mood-stone>
```

## Scripting defensively

```html
<mood-stone>
    #shadow
    
    <input name=name>
    <input name=food>

    <my-peer-element 
        enh-be-o='Of @name and @food.'
        onload="
            const {enh} = event; //enh = 'o' 
            const e = event[enh];
            switch(enh){
                'o':{
                    e.setProps = {
                        myFirstProp: `${e.factors.name} eats ${e.factors.food}`,
                        mySecondProp: `${e.factors[0]} eats ${e.factors[1]}
                    }
                }
            }
        "
    ></my-peer-element>
</mood-stone>
```

## Attaching and setting other enhancement values

```html
<input name=search type=search>

<div be-o='
    of @search.
    Set +beSearching:forText.
'>
    supercalifragilisticexpialidocious
</div>
```

The plus symbol:  + is indicating to tap into a [custom enhancement](https://github.com/WICG/webcomponents/issues/1000).

The example above happens to refer to this [enhancement](https://github.com/bahrus/be-searching).

## Observing a specified property or a peer custom element

```html
<tr itemscope>
    <td>
        <my-item-view-model></my-item-view-model>
        <div be-o="of ~myItemViewModel:myProp1.">My First column information</div>
    </td>
    <td>
        <div be-o="of ~myItemViewModel:myProp2."></div>
    </td>
</tr>
```

The search for the my-item-view-model custom element is done within the closest "itemscope" attribute.

This can be useful for scenarios where we want to display repeated data, and can't use a custom element to host each repeated element (for example, rows of an HTML table), but we want to provide a custom element as the "view model" for each row.

This will one-way synchronize *my-item-view-model*'s myProp 1/2 values to the adorned element's textContent property.

## Inferring the property to observe from a peer custom element

This also works:

```html
<tr itemscope>
    <td>
        <my-item-view-model></my-item-view-model>
        <div itemprop=myProp1 be-o="of ~myItemViewModel.">My First column information</div>
    </td>
    <td>
        <div itemprop=myProp2 be-o="of ~myItemViewModel."></div>
    </td>
</tr>
```

We can specify what prop to bind to by using an additional "Set" statement.

## Negation [TODO]

```html
<mood-stone>
    #shadow
    
    <input name=someCheckbox type=checkbox>

    <my-peer-element enh-be-o='
        Of @ someCheckbox.
        Negate to someBoolProp.
        '></my-peer-element>
</mood-stone>
```

## Toggle [TODO]

To simply toggle a property anytime the observed element changes:

```html
<mood-stone>
    #shadow
    
    <input name=someCheckbox type=checkbox>

    <my-peer-element enh-be-o='
        Of @someCheckbox.
        Toggle someBoolProp.
        '></my-peer-element>
</mood-stone>
```

## PlusEq, MinusEq, TimeEq, DivEq [TODO]

## Increment, Decrement [TODO]



## Interpolating [TODO]

```html
<mood-stone>
    #shadow
    
    <input name=name>
    <input name=food>

    <my-peer-element enh-be-o='
        Of @name and @food.
        //Set myFirstProp to `${name} eats ${food}`  Is this worth supporting?
        Set mySecondProp to `$1 eats $2`.
        '></my-peer-element>
</mood-stone>
```


## Adding / removing css classes / styles / parts declaratively [TODO]

```html
<mood-stone>
    #shadow
    
    <input name=yourCheckbox type=checkbox>
    <input name=myCheckbox type=checkbox>

    <my-peer-element enh-be-o='
        Of @yourCheckbox and @myCheckbox.
        Set my-class to $1.
        SetClass my-second-class to $2.
        '></my-peer-element>
</mood-stone>
```

Since we are binding to booleans, adds class if true, otherwise removes.

If we bind to a string, simply sets the class to the value of the string.

Same with SetPart, SetStyle

## Observing a specified property [TODO]

```html
<my-peer-element></my-peer-element>

<your-peer-element enh-be-o="
    of ~myPeerElement:myProp.
    Set yourProp.
">
```

This will one-way synchronize *my-peer-element*'s myProp value to the adorned element's yourProp property.

<!-->


## Example 5 Mapping [TODO]

## Example 6

<-->



> [!Note]
> *be-observant* provides similar functionality to [be-bound](https://github.com/bahrus/be-bound).  The difference is *be-bound* provides *two-way binding* between the adorned element and an upstream element, whereas be-observant is strictly one-way.  Because it is one way, be-observant can apply some declarative adjustments to the value it is observing before applying to the adorned element.

## Viewing Demos Locally

Any web server that can serve static files will do, but...

1.  Install git.
2.  Fork/clone this repo.
3.  Install node.js.
4.  Open command window to folder where you cloned this repo.
5.  > npm install
6.  > npm run serve
7.  Open http://localhost:3030/demo/ in a modern browser.

## Running Tests

```
> npm run test
```

## Using from ESM Module:

```JavaScript
import 'be-observant/be-observant.js';
```

## Using from CDN:

```html
<script type=module crossorigin=anonymous>
    import 'https://esm.run/be-observant';
</script>
```

