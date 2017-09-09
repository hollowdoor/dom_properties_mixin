dom-properties-mixin
==================

Install
-----

`npm install dom-properties-mixin`

Usage
----

**Note: In order for the mixin to work the receiving object must have an element property.**

```javascript
import { mixin } from 'dom-properties-mixin';

class MyElement {
    constructor(){
        mixin(this);
        this.element = document.querySelector('.full-name');
    }
}
//Now use the properties.
//Here we get the element value.
console.log(new MyElement().value);
```

Properties that come from the mixin
----------------------------------

`el` refers to the constructed element that received this mixin.

`element` refers to an actual DOM element.

```javascript
const el = new MyElement();
```

### el.parent

The `parent` property of `el` is equal to `element.parentNode`.

### el.first, el.last

`first`, and `last` properties are equal to `element.firstChild`, and `element.lastChild` respectively.
