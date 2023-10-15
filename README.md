# be-observant [WIP]

Observe properties of peer elements or the host.

> [!Note]
> *be-observant* overlaps in functionality with [be-sharing](https://github.com/bahrus/be-sharing).  The preference should be to use be-sharing when it is appropriate, especially when it can reduce busy work.  *be-sharing* provides "wildcard" binding while sticking with attributes which are built in to the platform, attributes that serve other purposes in addition to binding (namely microdata).  *be-sharing* works following an approach of "distribute data down" from the host or non-visible "brain" components, whereas be-observant works more on a "pull data in" to the adorned element.  This overlap can get confusing when both element enhancements are used within the same DOM realm.  To tell be-sharing to ignore binding to the adorned element, add an attribute consisting of two dashes to the adorned element, as will be shown in the examples below where applicable. [TODO]:  Document where it is better to use be-observant.

> [!Note]
> *be-observant* also provides similar functionality to [be-bound](https://github.com/bahrus/be-bound).  The difference is *be-bound* provides *two-way binding* between the adorned element and an upstream element, whereas be-observant is strictly one-way.  Because it is one way, be-observant can apply some declarative adjustments to the value it is observing before applying to the adorned element.

> [!Note]
> Although *be-observant* can declaratively adjust the value it is observing, it does *not* provide unfettered access to the JavaScript runtime though.  It is a purely declarative element enhancement.  For full access to the JavaScript runtime, use [be-computed](https://github.com/bahrus/be-computed).

## Example 1a

```html
<my-custom-element>
    #shadow
    <input name=isVegetarian type=checkbox onclick="return false" be-observant>
</my-custom-element>
```

What this does:  Passes my-custom-element's isVegetarian value to the input element's checked property.

This is shorthand for:

## Example 1b

```html
<my-custom-element>
    #shadow
    <input type=checkbox be-observant='of / is vegetarian.'>
</my-custom-element>
```

Slash indicates get value from host.  If omitted, it is assumed:

## Example 1c

```html
<my-custom-element>
    #shadow
    <input type=checkbox be-observant='of is vegetarian.'>
</my-custom-element>
```

## Binding to peer elements


## Example 2a

```html
<input name=search type=search>

<div be-observant='of @search.'></div>
```

As the user types in the input field, the div's text content reflects the value that was typed.

## Example 2b [TODO]

```html
<input name=search type=search>

<div be-observant='of @search and pass value to $0-enh-by-be-searching : for text.'>
    supercalifragilisticexpialidocious
</div>
```

## Example 3  Negation [TODO]

```html
<my-custom-element>
    #shadow
    <input type=checkbox be-observant='of is read only negated.'>
</my-custom-element>
```

## Example 4 Translation [TODO]

```html
<paul-mccartney age=64>
    #shadow
    <daughter-heather be-observant='of age and pass value - 20 to $0:age.
    '></daughter-heather>
</paul-mccartney>
```

## Example 5 Mapping [TODO]

## Example 6