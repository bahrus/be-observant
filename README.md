# be-observant [TODO]

Rests heavily on be-linked

## Example 1

```html
<host-element>
    #shadow
    <input type=checkbox be-observant='of / is read only.'>
</host-element>
```



Slash indicates get value from host.  If omitted, it is assumed:

## Example 1a

```html
<host-element>
    #shadow
    <input type=checkbox be-observant='of is read only.'>
</host-element>
```

## Example 2a

```html
<input name=search type=search>

<div be-observant='of @search.'></div>
```

## Example 2b

```html
<input name=search type=search>

<div be-observant='of @search and pass value to $0-enh-by-be-searching : for text.'>
    supercalifragilisticexpialidocious
</div>
```

