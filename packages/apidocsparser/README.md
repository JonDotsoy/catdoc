## Definitions

### TOC (Acronym of Table of content)

This is a definition of the content in the repository, used to create the menus and read markdown documentations or api definition.

A TOC file use elements (Item, Group, Divider) to describe the content.

- Item: Describe the element to referrer. A markdownd documentation or API Definition
- Group: Used to group elements into a title.
- Divider: Elemento used to divider the content.

> On the JSON below content the property `$schema`, this is used to describe the schema in this file. Also the IDE can interpret easily and helper with the autocomplete.

**Example TOC**

```json
{
  "$schema": "https://unpkg.com/sculltoc@0.0.1/schema.json#",
  "items": [
    {
      "type": "item",
      "title": "Overview",
      "uri": "./docs/overview.md"
    },
    {
      "type": "group",
      "title": "Documentation",
      "items": [
        {
          "type": "item",
          "title": "Connection",
          "uri": "./docs/connection.md"
        },
        {
          "type": "item",
          "title": "Deploy service local",
          "uri": "./docs/local-deploy.md"
        }
      ]
    },
    {
      "type": "item",
      "title": "API",
      "uri": "./reference/api.yaml"
    }
  ]
}
```

### Item

This element describe the item into menu.

Properties:

| Parameter | Describe                                              |
| :-------- | :---------------------------------------------------- |
| type      | Define type of element. Use value `item`              |
| title     | Describe element on menu                              |
| uri       | Describe location to load documentation or reference. |

**URI**

The uri describe the location to load the documentation or reference to API. This may be a relative path or url location.

**Ex.**

```json
{
  "type": "item",
  "title": "API",
  "uri": "./reference/api.yaml"
}
```

```json
{
  "type": "item",
  "title": "API",
  "uri": "https://example.com/reference/api.yaml"
}
```

### Group

This element describe a group de elements.

Properties:

| Parameter | Describe                               |
| :-------- | :------------------------------------- |
| type      | Value `group` describe type of element |
| title     | Describe the title of group            |
| items     | Elements in the group                  |

### Divide

Element use to divide the content in the menu

Properties:

| Parameter | Describe             |
| :-------- | :------------------- |
| type      | Value `divide`       |
| title     | title to this divide |
