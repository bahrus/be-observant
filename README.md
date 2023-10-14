# be-observant [TODO]

Observe properties of peer elements or the host.

> [!Note]
> be-observant overlaps in functionality with [be-sharing](https://github.com/bahrus/be-sharing).  The preference should be to use be-sharing when it is appropriate, as it involves less work, as it provides "wildcard" binding while sticking with attributes which are built in to the platform, attributes that serves other purposes in addition to binding (mainly microdata).  be-sharing works n a "distribute data down" from the host or non-visible "brain" component, whereas be-observant works more on a "pull data in" to the adorned element.  This overlap can get confusing when both element enhancements are used within the same DOM realm.  To tell be-sharing to ignore binding to the adorned element, add an attribute consisting of two dashes to the element, as will be shown in the examples below where applicable. [TODO]:  Document where it is better to use be-observant.

## Example 1a [TODO]

```html
<host-element>
    #shadow
    <input type=checkbox be-observant='of / is read only.'>
</host-element>
```

Slash indicates get value from host.  If omitted, it is assumed:

## Example 1b [TODO]

```html
<host-element>
    #shadow
    <input type=checkbox be-observant='of is read only.'>
</host-element>
```

## Example 2a [TODO]

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
<host-element>
    #shadow
    <input type=checkbox be-observant='of is read only negated.'>
</host-element>
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