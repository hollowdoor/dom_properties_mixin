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
//You can import a more name space safe function instead
//mixinDOMProperties() is an alias to the mixin function
//import { mixinDOMProperties } from 'dom-properties-mixin';

class MyElement {
    constructor(){
        mixin(this);
        //or do this
        //mixinDOMProperties(this)

        //Assuming in some html document there is an
        //element with the full-name css class
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

You can also set these properties with a new element which will replace the current child element at that position.

### el.children

Use `el.children` to get, or set children elements to `element.children`.

When getting from `el.children` you will receive an array instead of the usual node list.

When setting `el.children` you can pass an array of DOM elements, or a DOM list like `element.children`, and the entire contents of `element.children` will be replaced by the new children.

The properties the same as on a reqular element.

* el.childNodes
* el.textContent
* el.className
* el.classList
* el.nextSibling

### el.style

`el.style` works similarly to the style property of DOM elements. Ideally a special Proxy object is returned. When the Proxy constructor is not available `element.style` is returned.

See [css-proxy](https://github.com/hollowdoor/css_proxy) to find out more about what returns from `el.style`.

About
----

`dom-properties-mixin` is for non-method properties only. Use it to facilitate adding common properties of DOM element data properties to arbitrary objects.

Properties created from `dom-properties-mixin` are not configurable so there is some safety benefits. This also constrains how you can use it. In other ways you might find it a benefit.
