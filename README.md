# be-observant [TODO]

Observe properties of peer elements or the host.

[![NPM version](https://badge.fury.io/js/be-observant.png)](http://badge.fury.io/js/be-observant)
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-observant?style=for-the-badge)](https://bundlephobia.com/result?p=be-observant)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-observant?compression=gzip">
[![Playwright Tests](https://github.com/bahrus/be-observant/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/be-observant/actions/workflows/CI.yml)


> [!Note]
> An extra thin layer can be applied on top of be-observant, so that the original HTML that is streamed from the server can provide the initial values of the property that *be-observant* observes, and then once that initial handshake is established, lean exclusively on *be-observant* for all subsequent updates.  This is handled by [be-entrusting](https://github.com/bahrus/be-entrusting).




## The most quintessential example [TODO]

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

The assumption be-observant is making is that the name of the input element will match with the name of the host property from which we would want to bind it.  Why adopt confusing mappings if we can possibly avoid it?  

> [!Note]
> *be-observant* is a rather lengthy word to have to type over and over again, and this element enhancement would likely be sprinkled around quite a bit in a web application.  The name is registered in the optional file [behivior.js](https://github.com/bahrus/be-observant/blob/baseline/behivior.js) so to use whatever name makes sense to you (be-o, be-obs?) within your application, just don't reference that file, and instead create and reference your own registration file.  Names can also be overridden within a [Shadow scope](https://github.com/bahrus/be-hive) as well.  Throughout the rest of this document, we will use be-o instead of be-observant, and ask that you make a "mental map" of "o" to observant.  

If you only use this enhancement once in a large application, spelling out the full name (and referencing the canonical behivior.js file) would probably make the most sense, for locality of behavior reasons, and also tapping into google searches.  But I would strongly consider using a shortcut in any application that intends to rely on this enhancement in a heavy way.

## Back to our quintessential example

As we already discussed, in the example above, we made the assumption that if the user gives the input element name "isVegetarian", that the choice of name will most likely match the identical property name coming from the host web component container.

If this assumption doesn't hold in some cases, then we can specify the name of the property we want to observe from the host:

## Specifying the host property to observe [TODO]

```html
<mood-stone>
    #shadow
    <input 
        type=checkbox 
        disabled 
        be-o='of / is happy.'
    >
</mood-stone>
```

Slash indicates get value from host.  If omitted, it is assumed:

## Reducing cryptic syntax [TODO]

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

## Reducing number of spaces at expense of readability? [TODO]

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

## Special Symbols

In the example above, we mentioned using the / symbol to indicate to observe a property from the host.  But be-observant can also observe peer elements within the ShadowRoot (or outside any shadow root *be-observant* adorns an element sitting outside any ShadowRoot).

What follows is a listing of other special symbols we can use to be able to observe other peer elements within the ShadowRoot realm.  We stick to single character symbols in order to keep the statements small:


| Symbol       | Meaning                        | Notes                                                                                |
|--------------|--------------------------------|--------------------------------------------------------------------------------------|
| /propName    |"Hostish"                       | Binds to a "propagator" EventTarget.                                                 |
| @propName    |Name attribute                  | Listens for input events by default.                                                            |
| |propName    |Itemprop attribute              | If contenteditible, listens for input events.  Otherwise, uses be-value-added.       |
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

## By name attribute [TODO]

```html
<input name=search type=search>

<div be-o='of @search.'></div>
```

As the user types in the input field, the div's text content reflects the value that was typed.

## By id [TODO]

```html
<input id=searchString type=search>

<div be-o='of # search string.'></div>
```

## By markers [TODO]

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

This observes the my-peer-element's someBoolProp property for changes.

## By itemprop [TODO]

```html
<link itemprop=isHappy>
...
<input 
    type=checkbox 
    be-o='of | is happy.'
>
```

# Specifying the property to assign the observed value to.

## Single mapping from observed "signal" to single property of the adorned element. [TODO]

```html
<mood-stone> 
    #shadow
    
    <input name=someCheckbox type=checkbox>

    <my-peer-element be-o='
        Of @ someCheckbox.
        Set someBoolProp.
        '></my-peer-element>
</mood-stone>
```

This watches the input element for input events and passes the checked property to someBoolProp of oMyPeerElement.

## Negation [TODO]

```html
<mood-stone>
    #shadow
    
    <input name=someCheckbox type=checkbox>

    <my-peer-element be-o='
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

    <my-peer-element be-o='
        Of @someCheckbox.
        Toggle someBoolProp.
        '></my-peer-element>
</mood-stone>
```

## PlusEq, MinusEq, TimeEq, DivEq [TODO]

## Increment, Decrement [TODO]

## Attaching and setting other enhancement values

```html
<input name=search type=search>

<div be-o='
    of @search.
    Set to $0+beSearching:forText
'>
    supercalifragilisticexpialidocious
</div>
```

The plus symbol:  $0+ is indicating to tap into a [custom enhancement](https://github.com/WICG/webcomponents/issues/1000).

The example above happens to refer to this [enhancement](https://github.com/bahrus/be-searching).

## Observing multiple "signals" [TODO]


```html
<mood-stone>
    #shadow
    
    <input name=yourCheckbox type=checkbox>
    <input name=myCheckbox type=checkbox>

    <my-peer-element be-o='
        Of @yourCheckbox and @myCheckbox.
        Set myFirstProp to $1.
        Set mySecondProp to $2.
        '></my-peer-element>
</mood-stone>
```

1 and 2 refer to the 1-based index of observed values from the "Of" statement(s).

## Interpolating

```html
<mood-stone>
    #shadow
    
    <input name=name>
    <input name=food>

    <my-peer-element be-o='
        Of @name and @food.
        //Set myFirstProp to `${name} eats ${food}`  Is this worth supporting?
        Set mySecondProp to `$1 eats $2`.
        '></my-peer-element>
</mood-stone>
```

## Scripting bravely

*be-observant* empowers the developer to tap into the full power of the JavaScript run time engine by adding script to the onload event.


If we know that this enhancement is the only enhancement affecting the adorned element that leverages the onload event, we can skip some defensive maneuvers that avoid collisions with other enhancements, resulting in a fairly compact script:

```html
<mood-stone>
    #shadow
    
    <input name=name>
    <input name=food>

    <my-peer-element 
        be-o='Of @name and @food.'
        onload="
            const {o} = event;
            o.setProps = {
                myFirstProp: `${o.factors.name} eats ${o.factors.food}`,
                mySecondProp: `${o.factors[0]} eats ${o.factors[1]}`
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
        be-o='Of @name and @food.'
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

## Adding / removing css classes / styles / parts declaratively [TODO]

```html
<mood-stone>
    #shadow
    
    <input name=yourCheckbox type=checkbox>
    <input name=myCheckbox type=checkbox>

    <my-peer-element be-o='
        Of @yourCheckbox and @myCheckbox.
        SetClass my-class to $1.
        SetClass my-second-class to $2.
        '></my-peer-element>
</mood-stone>
```

Since we are binding to booleans, adds class if true, otherwise removes.

If we bind to a string, simply sets the class to the value of the string.

Same with SetPart, SetStyle

## Observing a specified property

```html
<my-peer-element></my-peer-element>

<your-peer-element be-o="
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
> *be-observant* overlaps in functionality with [be-sharing](https://github.com/bahrus/be-sharing).  The preference should be to use be-sharing when it is appropriate, especially when it can reduce busy work.  *be-sharing* provides "wildcard" binding while sticking with attributes which are built in to the platform, attributes that serve other purposes in addition to binding (namely microdata).  *be-sharing* works following an approach of "distribute data down" from the host or non-visible "brain" components, whereas be-observant works more on a "pull data in" to the adorned element.  

> [!Note]
> *be-observant* also provides similar functionality to [be-bound](https://github.com/bahrus/be-bound).  The difference is *be-bound* provides *two-way binding* between the adorned element and an upstream element, whereas be-observant is strictly one-way.  Because it is one way, be-observant can apply some declarative adjustments to the value it is observing before applying to the adorned element.

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

