# be-observant

[![Actions Status](https://github.com/bahrus/be-observant/workflows/CI/badge.svg)](https://github.com/bahrus/be-observant/actions?query=workflow%3ACI)

be-observant is a member of the [may-it-be](https://github.com/bahrus/may-it-be) family of web components.  It allows one DOM element to observe another element,  where that element came "before it".  It is much like how Javascript closures can access variables defined outside the closure, as long as it came before.

It strives to accomplish the same thing as the [pass-down](https://github.com/bahrus/pass-down) custom element, but in a possibly more performant way in many circumstances.  It uses attributes rather than elements to bind things together.  So instead of:

```html
<ways-of-science>
    <largest-scale>
        <woman-with-carrot-attached-to-nose></woman-with-carrot-attached-to-nose>
    </largest-scale>
    <p-d vft to=[-lhs] m=1></p-d>
    <largest-scale>
        <a-duck></a-duck>
    </largest-scale>
    <p-d vft to=[-rhs] m=1 ></p-d>
    <iff-diff iff -lhs not-equals -rhs set-attr=hidden></iff-diff>
    <div hidden>A witch!</div>
</ways-of-science>
```

We have 

<!--

```html
<ways-of-science>
    <largest-scale -lhs>
        <woman-with-carrot-attached-to-nose></woman-with-carrot-attached-to-nose>
    </largest-scale>
    <largest-scale -rhs>
        <a-duck></a-duck>
    </largest-scale>
    <iff-diff iff -lhs=largest-scale[-lhs] not-equals -rhs=largest-scale[-rhs] set-attr=hidden be-observant></iff-diff>
    <div hidden>A witch!</div>
</ways-of-science>
```

which is a shorthand / more readable version (based on overridable assumptions) of:

-->

```html
<ways-of-science>
    <largest-scale -lhs>
        <woman-with-carrot-attached-to-nose></woman-with-carrot-attached-to-nose>
    </largest-scale>
    <largest-scale -rhs>
        <a-duck></a-duck>
    </largest-scale>
    <iff-diff iff not-equals set-attr=hidden be-observant='{
        "lhs": {"observe": "[-lhs]", "on":"value-changed", "value-from-target": "value"}, 
        "rhs": {"observe": "[-rhs]", "on":"value-changed", "value-from-target": "value"} 
    }'></iff-diff>
    <div hidden>A witch!</div>
</ways-of-science>
```

## Assumptions, shortcuts

Whereas the pass-down component may be more fitting for a 30,000 ft above the ground environment outside any web component (rather, as part of a "web composition" of Native DOM and custom DOM elements), be-observant is more tailored for markup within a web component.  The overlap between them, functionally, is considerable though.

For example, the preceding example does not yet assume King Arthur has fully established his kingdom -- it works regardless of a containing component managing state.

But with be-observant, the shortcuts we provide are based on the assumption that there is such a component container.

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

To specify a different source to observe other than the host, we use "observe", or "observe-closest" as we saw in the previous example.

"observe" does an "up-search" -- previous siblings, parent, previous siblings of parent, etc, until an element "css matching" the value of "observe" is found.

"observe-closest" uses the native function call "closest" for this purpose.

These searches all stop at any Shadow DOM boundary.

## NB's

**NB I:** Editing large JSON attributes like this is quite error-prone, if you are like me.  The [json-in-html](https://marketplace.visualstudio.com/items?itemName=andersonbruceb.json-in-html) VSCode extension can help with this issue.  That extension is compatible with [pressing "." on the github page](https://github.dev/bahrus/be-observant) and with the [web version of vs-code](https://vscode.dev/). 

**NB II:** Whilst the first example involves more tags, and may often impose a slightly higher performance penalty, it is (subjectively) a bit more pleasant to type, and to reason about, add comments to, and to debug.  Perhaps starting with the former approach, and then moving to this approach when it is close to being ready for production may be the way to reconcile this.  Other approaches could be to transform one into the other during build time, or sometime during template processing (pre- or post- cloning).

To make debugging easier, set JSON key "debug" to true.

**NB III:**  The attribute name "be-observant" is configurable.  "data-be-observant" also works, with the default configuration.  The only limitation as far as naming is the attribute must start with be- (which also guarenttes data-be as well).

**NB IV:** The syntax, and the core code behind be-observant is also used by a fair number of other web components in the may-it-be family of web components, so it is worthwhile expounding on exactly what that syntax means.

## Syntax in depth

First we need to choose *what* to observe.  This is done via a number of alternative keys:

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
            <td>Do an "up-search" -- previous siblings, parent, previous siblings of parent, etc, until an element "css matching" the value of "observe" is found</td>
        </tr>
        <tr>
            <td>observeClosest</td>
            <td>Use the native function call "closest" to find the elemnt to observe.</td>
        </tr>
        <tr>
            <td>observeWindow [TODO]</td>
            <td>The rhs of this key is interpreted like the [target](https://www.w3schools.com/tags/att_a_target.asp) attribute of hyperlinks or forms.  Event listener added to that window</td> 
    </tbody>
</table>

Once we find the element to observe, next we need to specify what property or event to listen to on that element.

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
    </tbody>
</table>

Next we specify what to pass from the element we are observing and possibly from the vent.

<table>
    <caption>Getting the value</caption>
    <thead>
        <th>Key</th>
        <th>Meaning</th>
        <th>Notes</th>
    </thead>
    <tbody>
        <tr>
            <td>valFromTarget</td>
            <td>Specify a path from the target to "pull" when the event is raised or the property changes, using "." notation.</td>
            <td>Aliased by "vft".  Can also be used to auto-set the "on" value as described above.</td>
        </tr>
        <tr>
            <td>vft</td>
            <td>Abbrev. for valFromTarget</td>
            <td></td>
        </tr>
        <tr>
            <td>valFromEvent</td>
            <td>Specify a path from the event to "pull" when the event fires</td>
            <td></td>
        </tr>
        <tr>
            <td>fromProxy</td>
            <td>Specify the name of a proxy ("ifWantsToBe") from another may-it-be decorator</td>
            <td></td>
        </tr>
    </tbody>
</table>

## [Configuration Parameters](types.d.ts)

## Observe another proxy

```html
<list-sorter  upgrade=* if-wants-to-be=sorted with-binding></list-sorter>

...

<button be-toggled></button>

...

<ul be-sorted='{"nodeSelectorToSortOn":"span"}' be-sorted-with-binding='{
    "direction": {"observe": "button", "from-proxy":"toggled", "vft": "on", "valIfTrue": "asc", "valIfFalse": "desc", "to-proxy": "sorted"}
}'>
    <li>
        <span>Zorse</span>
    </li>
    <li>
        <span>Aardvark</span>
    </li>
</ul>

```

## Pass to another proxy on the same element[TODO]

use to-proxy



 

