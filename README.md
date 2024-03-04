# be-observant [WIP]

Observe properties of peer elements or the host.

[![NPM version](https://badge.fury.io/js/be-observant.png)](http://badge.fury.io/js/be-observant)
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-observant?style=for-the-badge)](https://bundlephobia.com/result?p=be-observant)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-observant?compression=gzip">
[![Playwright Tests](https://github.com/bahrus/be-observant/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/be-observant/actions/workflows/CI.yml)

> [!Note]
> *be-observant* overlaps in functionality with [be-sharing](https://github.com/bahrus/be-sharing).  The preference should be to use be-sharing when it is appropriate, especially when it can reduce busy work.  *be-sharing* provides "wildcard" binding while sticking with attributes which are built in to the platform, attributes that serve other purposes in addition to binding (namely microdata).  *be-sharing* works following an approach of "distribute data down" from the host or non-visible "brain" components, whereas be-observant works more on a "pull data in" to the adorned element.  

> [!Note]
> *be-observant* also provides similar functionality to [be-bound](https://github.com/bahrus/be-bound).  The difference is *be-bound* provides *two-way binding* between the adorned element and an upstream element, whereas be-observant is strictly one-way.  Because it is one way, be-observant can apply some declarative adjustments to the value it is observing before applying to the adorned element.

> [!Note]
> Although *be-observant* can declaratively adjust the value it is observing, it does *not* provide unfettered access to the JavaScript runtime though.  It is a purely declarative element enhancement.  For full access to the JavaScript runtime, use [be-computed](https://github.com/bahrus/be-computed).

> [!Note]
> An extra thin layer can be applied on top of be-observant, so that the original HTML that is streamed from the server can provide the initial values of the property that *be-observant* observes, and then once that initial handshake is established, lean exclusively on *be-observant* for all subsequent updates.  This is handled by [be-entrusting](https://github.com/bahrus/be-entrusting).

## Example 1a (Hemingway Notation)

```html
<my-custom-element>
    #shadow
    <input name=isVegetarian type=checkbox onclick="return false" be-observant>
</my-custom-element>
```

What this does:  Binds my-custom-element's isVegetarian value to the input element's checked property.

So we are making the assumption here that if the user gives the input element name "isVegetatarian", that the choice of name will most likely match the identical property name coming from the host web component container.

If this assumption doesn't hold in some cases, then we can specify the name of the property we want to observe from the host.

## Example 1b

```html
<my-custom-element>
    #shadow
    <input type=checkbox onclick="return false" be-observant='of / is vegetarian.'>
</my-custom-element>
```

Slash indicates get value from host.  If omitted, it is assumed:



## Example 1c

```html
<my-custom-element>
    #shadow
    <input type=checkbox onclick="return false" be-observant='of is vegetarian.'>
</my-custom-element>
```

The space between is and vegetarian can also be omitted, if case is specified:  isVegetarian.

## Special Symbols

In the examples below, we will encounter special symbols used in order to keep the statements small:

| Symbol       | Meaning                        | Notes                                                                                |
|--------------|--------------------------------|--------------------------------------------------------------------------------------|
| /propName    |"Hostish"                       | Attaches listeners to getters/setters.                                               |
| @propName    |Name attribute                  | Listens for input events.                                                            |
| |propName    |Itemprop attribute              | If contenteditible, listens for input events.  Otherwise, uses be-value-added.       |
| #propName    |Id attribute                    | Listens for input events.                                                            |
| %propName    |match based on part attribute   | Listens for input events.                                                            |
| -prop-name   |Marker indicates prop           | Attaches listeners to getters/setters.                                               | 
| ~elementName |match based on element name     | Listens for input events.                                                            |


"Hostish" means:

1.  First, do a "closest" for an element with attribute itemscope, where the tag name has a dash in it.  Do that search recursively.  
2.  If no match found, use getRootNode().host.

## Example 1d  Negation

```html
<my-custom-element>
    #shadow
    <input type=checkbox onclick="return false" be-observant='of not is vegetarian.'>
</my-custom-element>
```

## Example 1e Translation 

```html
<my-custom-element>
    #shadow
    <input type=readonly be-observant='of age - 20.'>
</my-custom-element>
```

Can also use addition (+), multiplication (*), division (/) [Untested].

## Binding to peer elements

## Example 2a

```html
<input name=search type=search>

<div be-observant='of @search.'></div>
```

As the user types in the input field, the div's text content reflects the value that was typed.

## Example 2b

```html
<input id=searchString type=search>

<div be-observant='of # search string.'></div>
```

## Example 2c Markers 

```html
<my-custom-element>
    #shadow
    <my-peer-element -some-bool-prop></my-peer-element>
    <input type=checkbox onclick="return false" be-observant='of -some-bool-prop'>
</my-custom-element>
```

This observes the my-peer-element's someBoolProp property for changes.

## Example 2d Microdata

```html
<link itemprop=isHappy>
...
<input type=checkbox be-observant='of | is happy.'>
```

## Example 3a

```html
<my-custom-element>
    #shadow
    
    <input name=someCheckbox type=checkbox>

    <my-peer-element be-observant='of @ some checkbox and assign to some bool prop'></my-peer-element>
</my-custom-element>
```

This watches the input element for input events and passes the checked property to someBoolProp of oMyPeerElement.

## Example 3b [TODO]

```html
<input name=search type=search>

<div be-observant='of @search and assign to $0+beSearching:forText.'>
    supercalifragilisticexpialidocious
</div>
```

## Example 4a (JavaScriptObjectNotation)

In some scenarios, it may be more effective to utilize the underlying binding model that the Hemingway statements above get transpiled to.  This can be done as follows:

```TypeScript
const oInput.beEnhanced.beObservant.observeRules = [
    {
        "remoteType": "/",
        "remoteProp": "isVegetarian",
        "localProp": "checked",
        "localSignal": {},
        "remoteSignal": {}
    }
]
```


<!-->


## Example 5 Mapping [TODO]

## Example 6

<-->



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

