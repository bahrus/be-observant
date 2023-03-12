# be-observant

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/be-observant)
[![Playwright Tests](https://github.com/bahrus/be-observant/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/be-observant/actions/workflows/CI.yml)
[![NPM version](https://badge.fury.io/js/be-observant.png)](http://badge.fury.io/js/be-observant)
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-observant?style=for-the-badge)](https://bundlephobia.com/result?p=be-observant)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-observant?compression=gzip">

be-observant is a key member of the [may-it-be](https://github.com/bahrus/may-it-be) family of web components.  It allows one DOM element to observe another element,  where that element typically comes "before it".  It is much like how Javascript closures can access variables defined outside the closure, as long as it came before.

It serves a similar purpose to [be-sharing](https://github.com/bahrus/be-sharing) but be-observant has more of an "inline binding" flavor, whereas be-sharing follows more of a "binding from a distance" approach.

be-observant is also a trend-setting member of the family -- many of the other may-it-be components piggy-back both on the code as well as the syntax for adding "environment-aware" bindings to their configuration properties.

be-observant also provides an experimental declarative [trans-render plugin](https://github.com/bahrus/be-decorated#isomorphic-logic----baton-passing), so the binding can be done while instantiating a template, rather than after the DOM has been added to the live DOM tree.

## Hemingway Notation [TODO]

```html
<ways-of-science>
    <largest-scale>
        <woman-with-carrot-attached-to-nose></woman-with-carrot-attached-to-nose>
    </largest-scale>
    <largest-scale>
        <a-duck></a-duck>
    </largest-scale>
    <if-diff iff -lhs not-equals -rhs set-attr=hidden be-observant='
        On value-changed event of previous largest scale element having inner woman with carrot attached to nose element do share value to my lhs property.
        On value-changed event of previous largest scale element having inner a-duck element do share value to my rhs property.
    '>
        <template>
            <div hidden>A witch!</div>
        </template>
    </if-diff>
</ways-of-science>
```

## Hemingway Notation in Detail [TODO]

Please expand section below.

<details>
    <summary>Hemingway notation for different scenarios</summary>

```html
<my-element be-observant='
    Share value property as number of previous largest scale element to my very important \and unusual property.
    Nudge previous largest scale element.
    Share update of value property as float of previous largest scale element to my very important \and unusual property.//SkipInit.
    On value-changed event of previous largest scale element having inner a-duck element  
        do stop propagation
        and debug 
        and share value as string to my rhs property
        and fire event my custom event name.
    
'>
</my-element>
```
</details>

## Sample syntax

```html
<ways-of-science>
    <largest-scale>
        <woman-with-carrot-attached-to-nose></woman-with-carrot-attached-to-nose>
    </largest-scale>
    <largest-scale>
        <a-duck></a-duck>
    </largest-scale>
    <if-diff iff not-equals set-attr=hidden be-observant='{
        "lhs": {"observe": "largest-scale:has(> woman-with-carrot-attached-to-nose", "on":"value-changed", "valueFromTarget": "value"}, 
        "rhs": {"observe": "largest-scale:has(> a-duck)", "on":"value-changed", "valueFromTarget": "value"} 
    }'>
        <template>
            <div hidden>A witch!</div>
        </template>
    </if-diff>
</ways-of-science>
```


## Now hold on just a minute... 

<details>
    <summary>A personal statement</summary>

Have I learned nothing, you may be asking?  "Don't you know props are passed down, events passed up?"  Yes, the approach be-observant follows has been declared an "anti-pattern" by many.  However, this anti-pattern is somewhat forced on us, when we use custom attributes, and when in addition we want to adhere to the principle of not attaching unrecognized properties on the element adorned by the attribute.  Yes, [there is an approach](https://github.com/bahrus/be-decorated#setting-properties-of-the-proxy-externally), which theoretically the host could use to pass props down.  But the intention of these custom attribute / decorators / behaviors is that they be usable within any framework, but especially within any web component library (without having to modify / extend the code), avoiding tight-coupling as much as possible.  Requiring this approach for "passing props down,"  and insisting on allowing no alternative, would get in the way of achieving that goal.  

Anyway, be-observant encourages uni-directional data flow, which to me is the more important goal, if these goals are designed to make reasoning about the code easier. (Of course what makes things easier to reason about is quite subjective).  

Another benefit of this "anti-pattern" is that it works quite nicely when lazy loading content.  The hosting element doesn't need to be micro-managing internal elements coming and going.  It is a less "planned" component economic model :-).  Underlying this idea is the concept that web components and custom decorators / attributes / behaviors, have a sense of "identity", capable of reacting spontaneously to user events, and able to "think independently" when interacting with peer components, even able to spawn children when the conditions are right, without bogging the host element down in minutia.  Reasoning about them may be easier if we can relate to the way they work together to how human organizations function -- or at least non-North Korean Military organizations :-).  This approach also seems to be more natural when striving for more declarative, markup-centric, less code-centric environments.  be-observant is closely "observing" whether there are any [signs of life as far as HTML Modules](https://bugs.chromium.org/p/chromium/issues/detail?id=990978).  Oh, and JQuery, still the most popular framework out there, doesn't follow such a strict hierarchy either, am I right?

Just as custom elements becoming activated relies on css features of the markup (registered tag names), here we also rely on CSS recognizing the attribute, without permission from any host component (though the host has to "opt-in" in a rather light-touch way if using Shadow DOM - by plopping a be-hive element somewhere inside the Shadow DOM realm). 

</details>

## Use Cases

### Web Components as a Democratic Organism

*be-observant* works well with web components that are designed like an organism - with an internal non visual "component as a service" acting as the "brain", and *be-observant* aids peripheral elements (both built-in and custom) in reading the "thoughts" from this "brain".

### Progressively Enhancing Server Rendered/Generated content

Because [this](https://blog.webpagetest.org/posts/will-html-content-make-site-faster/).


## Assumptions, shortcuts

be-observant is an attribute based alternative to the [pass-down](https://github.com/bahrus/pass-down) web component.  A lengthy discussion comparing them is found [here](https://github.com/bahrus/be-observant#alternatives).

As mentioned there, one subtle difference in emphasis between pass-down and be-observant: 

Whereas the pass-down component may be more fitting for a 30,000 ft above the ground environment outside any web component (rather, as part of a "web composition" of Native DOM and custom DOM elements), be-observant is more tailored for markup within a (SSR/SSG rendered) web component.  

In particular, with be-observant, the shortcuts we provide are based on the assumption that more often than not, there is a component container managing (some amount of) state.

So, for example:  

```html
 <xtal-editor be-observant='{
    "open": "expandAll",
    "expandAll": "expandAll",
    "readOnly": "readOnly"
}'></xtal-editor>
```

is interpreted to mean: "any time the host's expandAll property changes (communicated via expand-all-changed event), set this instance's "open" property to the same value.  Likewise with the other two lhs/rhs pairs.

The host is obtained by calling the native function el.getRootNode().  If that is a miss, it searches for the closest parent containing a dash.

To specify a different source to observe other than the host, there are numerous other options, which are catalogued below.

## Notes

> **Note**: Editing large JSON attributes like this is quite error-prone, if you are like me.  The [json-in-html](https://marketplace.visualstudio.com/items?itemName=andersonbruceb.json-in-html) VSCode extension can help with this issue.  That extension is compatible with [pressing "." on the github page](https://github.dev/bahrus/be-observant) and with the [web version of vs-code](https://vscode.dev/). An even better editing experience can be had by using *.mts/*.mjs files to define the html, with the help of a transpiler such as the [may-it-be](https://github.com/bahrus/may-it-be) transpiler.


> **Note**:   The attribute name "be-observant" is configurable.  "data-be-observant" also works, with the default configuration.  The only limitation as far as naming is the attribute must start with be-* (which also guarantees data-be-* as well).

> **Note**: The syntax, and the core code behind be-observant, is also used by a fair number of other web components in the may-it-be family of web components, so it is worthwhile expounding on / understanding exactly what that syntax means, if we wish to be fluent in be-speak.

> **Note**:  The be-observant attribute can also be an array, allowing for grouping of observers, and observing duplicate events or properties.

> **Note**:  If a property key (lhs) starts with ^, then the previous key that didn't start with a ^ is substituted. This provides for a more compact way to avoid use of arrays.

> **Note**:  As we will see, *be-observant* provides quite a bit of functionality.  As much as possible, *be-observant* attempts to keep it scalable by only loading code on demand -- so if features aren't used, it won't add to the payload.

## Syntax in depth

### What

First we need to choose *what* to observe.  

be-observant supports no less than two alternative schemes for deciding this:  One that reuses common functionality used by many be-decorated elements, with a reduced set of options.

The other is more powerful, with more options and has lots of intricate cross-logic fallbacks from one option to another (should one fail to produce the desired element), which is both a blessing and a curse.

The beautiful thing about dynamic imports is if you choose to use one scheme across the board, there's no penalty from the fact that another supporting another scheme which you never use is present (i.e. it shouldn't show up as unused code by dev tools).

#### First option: of

First, the simpler common approach: 

Simple example of the syntax:

```html
<my-custom-element be-observant='{
    "myProp": {"on": "click", "of": "parent"}
}>
```

The full list of options for the "of" values is shown below:

```TypeScript
/**
 * E = element
 * P = part
 * C = class
 * I = itemscope
 * A = attribute
 * N = name
 */
export type camelQry = `${string}E` | `${string}P` | `${string}C` | `${string}Id` | `${string}I` | `${string}A` | `${string}N`;
/**
 * Target selector in upward direction.
 */
export type Target = 
/**
* Use the parent element as the target
*/ 
'parent' | 
/**
* abbrev for parent
*/
'p' |
/**
 * Use the parent.  If no parent, use root node
 */
'parentOrRootNode' |
/**
 * abbrev for parent or root node
 */
'porn' |
/**
 * Use the element itself as the target
 */ 
'self' | 
/**
 * abbrev for self
 */ 
's' |
`closest${camelQry}` |
/**
 * Use the native .closest() function to get the target
 */
['closest', string] |
/**
 * abbrev for closet
 */
['c', string] | 
/**
 * Find nearest previous sibling, parent, previous sibling of parent, etc that matches this string.
 */
`upSearchFor${camelQry}` |
/**
 * Find nearest previous sibling, parent, previous sibling of parent, etc that matches this string.
 */
['upSearch', string] |
/**
 * abbrev for upSearch
 */
['us', string] |

/**
 * Tries .closest matching string.  If that's null, does .getRootNode().host
 */
`closest${camelQry}OrHost` |

//'closestOrHost' |
/**
 * Tries .closest([string value]).
 * If that comes out to null, do .getRootNode().host
 */
['closestOrHost', string] |
/**
 * abbrev for closestOrHost
 */
['coh', string] |
/**
 * get host
 */
'host' |
/**
 * abbrev for host
 */
'h'
;
```

#### Option 2:  multi-key (deprecated)

This is done via a number of alternative keys:

<table>
    <caption>What to observe</caption>
    <thead>
        <th>Key</th>
        <th>Meaning</th>
    </thead>
    <tbody>
        <tr>
            <td><i>unspecified</i></td>
            <td>Observe the host element via the native function el.getRootNode().  If that is a miss, it searches for the closest parent containing a dash.</td>
        </tr>
        <tr>
            <td>observe</td>
            <td>Do an "up-search" -- previous siblings, parent, previous siblings of parent, etc, until an element "css matching" the value of "observe" is found.  Stop at any ShadowDOM boundary.</td>
        </tr>
        <tr>
            <td>observeClosest</td>
            <td>Use the native function call "closest" to find the element to observe.</td>
        </tr>
        <tr>
            <td>observeClosestOrHost (abbrev ocoho)</td>
            <td>Use the native function call "closest".  If that's null, do el.getRootNode()</td>
        </tr>
        <tr>
            <td>observeName (abbrev ona)</td>
            <td>
                Finds the closest containing form using .closest('form') and searches for an element within that form with matching name.  If not found, does an "upSearch" for it, as described above, stopping at any ShadowDOM boundary.
            </td>
        <tr>
            <td>observeSelf (abbrev os)</td>
            <td>Observe self</td>
        </tr>
        <tr>
            <td>observeInward (abbrev oi)</td>
            <td>
                Uses the native function call "querySelector" to find the first matching element to observe within the adorned element.
                If a matching element is not found, it expects a <a href=https://github.com/bahrus/be-a-beacon>be-a-beacon</a> element to announce that parsing has completed.
            </td>
        </tr>
        <tr>
            <td>observeAtLarge [TODO] (abbrev oal)</td>
            <td>Do a querySelector from the root host.  If element not found, expect a be-a-beacon, verify instance of be-a-beacon.  Awaiting a strong use case before implementing.</td>
        </tr>
        <tr>
            <td>observeWinObj (abbrev owo)</td>
            <td>Observe window object.  Example:  observeWinObj:'navigation'</td>
        </tr>
    </tbody>
</table>

#### Homing in

Having selected a DOM element to observe, we may optionally want to observe a sub object as our "container" to observe from.  These sub objects might extend EventTarget, meaning they have events we can subscribe to.  The assumption here is that unlike other typical properties of the DOM element, which might be transient, properties we would want to home in on are "stable, permanent" properties that may, for example, point to a store (MobX, for example).

This is done via parameter homeInOn, which specifies a "dot" delimited path from the element to observe found above.

### When to act

Once we find the element (or Event Target) to observe, next we need to specify what property or event to listen to on that element / Event Target.

<table>
    <caption>When to react</caption>
    <thead>
        <th>Key</th>
        <th>Meaning</th>
        <th>Notes</th>
    </thead>
    <tbody>
        <tr>
            <td>on</td>
            <td>Name (or "type") of event to listen for.  Uses the standard el.addEventListener([on])</td>
            <td>If not specified, will be set to the value of valFromTarget, after turning it into lisp case and appending with -changed.</td> 
        </tr>
        <tr>
            <td>onSet</td>
            <td>Watches for property changes made via invoking the setter of the property.</td>
            <td></td>
        </tr>
        <tr>
            <td>skipInit</td>
            <td>Do not pass in the initial value prior to any events being fired.</td>
            <td>Needed when it doesn't make sense to do anything until the user has directly interacted with the observed element.</td>
        </tr>
        <tr>
            <td>eventListenerOptions</td>
            <td>Specify whether to only listen once.  Or to capture events that don't bubble.</td>
            <td></td>
        </tr>
        <tr>
            <td>eventFilter</td>
            <td>Filter out events if they don't match this object (things like keyCode can be specified here).</td>
            <td></td>
        </tr>
        <tr>
            <td>eval</td>
            <td>portmanteau of "event" and "val".  There is a growing number of use cases where the name of the event matches the path to extract from the target, after translating camel to lisp case</td>
            <td></td>
    </tbody>
</table>

### What to pass

Next we specify what to pass to the adorned element from the element we are observing and possibly from the event.

<table>
    <caption>Getting the value</caption>
    <thead>
        <th>Key</th>
        <th>Meaning</th>
        <th>Notes</th>
    </thead>
    <tbody>
        <tr>
            <td>valFromTarget (abbrev vft)</td>
            <td>
                <ol>
                    <li>If a string is specified: Specify a path from the target to "pull" when the event is raised or the property changes, using "." notation.
                        Use | for limited support for method invocation.  E.g. "current.getState|" will invoke the getState method on the current object.
                        Common use case:  querySelector|selector.
                    </li>
                </ol>
            </td>
            <td>Can also be used to auto-set the "on" value as described above.</td>
        </tr>
        <tr>
            <td>valFromEvent (abbrev vfe)</td>
            <td>Specify a path from the event to "pull" when the event fires</td>
            <td></td>
        </tr>
        <tr>
            <td>valPathSubstitutions (abbrev vps)</td>
            <td>(Advanced) -- substitute parts of the path with local props from the target element.  For example, if vft="options{index}.value" means "get the value from the host's options property, and from that, get the index from the local index prop.  Then get the value from that."</td>
        </tr>
    </tbody>
</table>

### Adjusting the value

There are some frequent requirements when it comes to adjusting the value obtained from the target / event, prior to passing the value.  The options to do this are listed below:

<table>
    <caption>Value Adjustments
        <thead>
        <th>Key</th>
        <th>Meaning</th>
        <th>Notes</th>
    </thead>
    <tbody>
        <tr>
            <td>clone</td>
            <td>Do a structuredClone of the value before passing it</td>
            <td>Makes it almost impossible to experience unexpected side effects from passing an object from one component to another</td>
        </tr>
        <tr>
            <td>parseValAs</td>
            <td>If the value extracted from the target / event is of type string, often we want to parse the string before passing the value.
            Options:  'int' | 'float' | 'bool' | 'date' | 'truthy' | 'falsy' | '' | 'string' | 'object' | 'regExp'.  The option 'string' is actually the opposite, taking an object and JSON.stringify'ing it.
            </td>
            <td></td>  
        </tr>
        <tr>
            <td>trueVal</td>
            <td>If val is true, set property to the trueVal specified</td>
            <td></td>  
        </tr>   
        <tr>
            <td>falseVal</td>
            <td>If val is false, set property to the falseVal specified</td>
            <td></td>  
        </tr> 
        <tr>
            <td>translate</td>
            <td>If val is a number add the translate value to it before setting the property</td>
            <td></td>  
        </tr> 
        <tr>
            <td>asWeakRef</td>
            <td>Some values of valueFromTarget (vft) can resolve to a DOM element.  For example, setting vft = '.' resolves to the target element itself. This option allows the property to be set to a weak reference to the DOM element, so that garbage collection can release it more effectively when the element goes out of scope.</td>
            <td></td>  
        </tr> 
    </tbody>
</table>

### Alternative End Point

By default, the lhs of each be-observant setting specifies the name of the property to set.

But we can instead opt to set an attribute.

Possible values are shown below

```TypeScript
export interface AlternateEndPoint {
    /** Set attribute rather than property. */
    as?: 'str-attr' | 'bool-attr' | 'obj-attr' | 'class' | 'part',
}
```

### Side Effects

We can apply some "side effects":

<table>
    <caption>Side Effects</caption>
    <thead>
        <th>Key</th>
        <th>Meaning</th>
        <th>Notes</th>
    </thead>
    <tbody>
    <tr>
        <td>debug</td>
        <td>Pause JS execution when be-observant is invoked</td>
        <td></td>
    </tr>
    <tr>
        <td>fire</td>
        <td>Emit a custom event after setting the property on the element.</td>
        <td>Most common use case:   Setting the value of an input element, and want downstream elements to see it as if a user entered the value</td>
    </td>
    <tr>
        <td>nudge</td>
        <td>Slowly "awaken" a disabled element after be-observant has latched on.  If the disabled attribute is not set to a number, or is set to "1", removes the disabled attribute.  If it is a larger number, decrements the number by 1. 
        </td>
        <td>Useful for avoiding elements to appear interactive, but don't function properly until the component is properly hydrated. 
        </td>
    </tr>
    <tr>
        <td>stopPropagation</td>
        <td>Prevent event from continuing to bubble.</td>
        <td></td>
    </tr>
    </tbody>
</table>

## Alternatives

be-observant shares similar syntax / concepts to [be-noticed](https://github.com/bahrus/be-noticed) and to [pass-down](https://github.com/bahrus/pass-down) and [pass-up](https://github.com/bahrus/pass-down).

However, there are some subtle differences in spirit between what these three components are trying to achieve.  In many cases, more than one of these components can solve the same problem, so it becomes a matter of "taste" which one solves it better. 

What all these components share in common is they do not assume that there is a host component managing state.

For example, the preceding example does not yet assume King Arthur has fully established his kingdom -- it works regardless of a containing component managing state.

The overlap between these four components, functionally, is considerable.

The general guidelines for choosing between these four elements:

<table>
    <caption>General guidelines</caption>
    <thead>
        <tr>
            <th>Element</th>
            <th>Basic Purpose</th>
            <th>Current Limitations</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>be-observant</td>
            <td>Pulls down values from previously defined elements (typically) as they change, to the element be-observant adorns.</td>
            <td>
                <ul>
                    <li>Can't attach to non-viewable elements.</li>
                    <li>Can only pass values to a single (adorned) element.</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>pass-down</td>
            <td>Acts as a mediator between an observed element and one or more downstream elements (usually).</td>
            <td>
                <ul>
                    <li>Because it becomes active regardless of visibility, doesn't provide built-in "lazy loading" support.</li>
                    <li>Some HTML markup syntax isn't amenable to custom or unknown elements being placed in the mix (for example, tables are quite finicky about allowed child elements)</li>
                    <li>Perfect match scenario:  A markup centric, declarative(ish) web component, where the "brains" of the web component is not in the main web component itself, but in a reusable "ViewModel" component.  The ViewModel component isn't visible, and as the view model changes, it needs to be passed down to multiple downstream components.</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>be-noticed</td>
            <td>Push up values to previously defined elements as the element be-noticed adorns changes.</td>
            <td>
                <ul>
                    <li>Can't attach to non-viewable elements</li>
                    <li>Can only pass values to one element per event subscription.</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>pass-up</td>
            <td>Push-up values up the DOM hierarchy</td>
            <td>
                <ul>
                    <li>Because it becomes active regardless of visibility, doesn't provide built-in "lazy loading" support.</li>
                     <li>Some HTML markup syntax isn't amenable to custom or unknown elements being placed in the mix (for example, tables are quite finicky about allowed child elements)</li>
                     <li>Can only pass values to a single element.</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>


## Big time short cuts.

When working with be-observant, we will likely encounter the following patterns rather frequently:

```html
<my-element be-observant='{
    "typicalProp1": {"vft": "myHostProp1"},
    "typicalProp2": {"onSet": "myHostProp2", "vft": "myHostProp2"}
}'>
```

These are already shortcuts for a number of configurable atomic operations, but even these shortcuts get to feeling rather repetitive in many circumstances.

The shortcut for these two scenarios is shown below:

```html
<my-element be-observant='{
    "typicalProp1": "myHostProp1",
    "typicalProp2": ".myHostProp2"
}'>
```

## Being host-ish

Sometimes there are scenarios where we would like to benefit from the shortcuts above, but don't want to use Shadow DOM on a containing component just for the benefit of the shortcut.

An element can declare itself to be a host for these purposes by adding global attribute "itemscope". Be-observant searches for such an element before doing the getRootNode() call. 

Under the hood, this scenario will use another option:  observeClosestOrHost (ocoho for short), which tries using the native "closest" query first, and if that fails, does getRootNode()

## [Configuration Parameters / API](types.d.ts)






## Viewing Locally

1.  Install git.
2.  Fork/clone this repo.
3.  Install node.
4.  Open command window to folder where you cloned this repo.
5.  > npm install
6.  > npm run serve
7.  Open http://localhost:3030/demo/dev in a modern browser.

## Importing in ES Modules:

```JavaScript
import 'be-observant/be-observant.js';
```

## Using from CDN:

```html
<script type=module crossorigin=anonymous>
    import 'https://esm.run/be-observant';
</script>
```






 

