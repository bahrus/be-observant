# be-observant [TODO]

Observe properties of peer elements or the host.

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

## Example 1c

```html
<my-custom-element>
    #s
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