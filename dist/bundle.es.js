import arrayFrom from 'array-from';
import cssProxy from 'css-proxy';

var props = (function (){
    //Renamed properties, and properties with unique behaviors
    //are assigned directly to the original props object
    var props = {
        parent: {
            get: function get(){ return this.element.parentNode; }
        },
        first:{
            get: function get(){
                return this.element.firstChild;
            },
            set: function set(value){
                if(this.element.firstChild !== void 0){
                    return this.element.replaceChild(
                        get(value), this.element.firstChild
                    );
                }
                this.element.appendChild(get(value));
            }
        },
        last: {
            get: function get(){
                return this.element.lastChild;
            },
            set: function set(value){
                if(this.element.lastChild !== void 0){
                    return this.element.replaceChild(
                        get(value), this.element.lastChild
                    );
                }
                this.element.appendChild(get(value));
            }
        },
        children: {
            get: function get(){
                return arrayFrom(this.element.children);
            },
            set: function set(children){
                var this$1 = this;

                this.element.innerHTML = '';
                arrayFrom(children).forEach(function (child){
                    this$1.element.appendChild(get(child));
                });
            }
        },
        childNodes: {
            get: function get(){
                return arrayFrom(this.element.childNodes);
            }
        },
        style: {
            get: function get(){
                if(this._style === void 0){
                    if(Proxy === void 0) { return this.element.style; }
                    this._style = cssProxy(this.element);
                }
                return this._style;
            }
        },
        root: {
            get: function get(){
                return this.element.rootNode;
            }
        }
    };


    //Define simpler getters, and setters
    ['value', 'innerHTML', 'outerHTML', 'textContent',
    'className', 'classList']
    .forEach(function (prop){
        props[prop] = {
            get: function get(){
                return this.element[prop];
            },
            set: function set(value){
                this.element[prop] = value;
            }
        };
    });

    //Define simpler getters
    ['nodeName', 'nextSibling', 'nodeType', 'nodeName']
    .forEach(function (prop){
        props[prop] = {
            get: function get(){
                return this.element[prop];
            }
        };
    });

    //Enumerable properties are easier to debug
    Object.keys(props).forEach(function (key){ return props[key].enumerable = true; });
    return props;
})();


function mixin(dest){
    Object.defineProperties(dest, props);
    return dest;
}

function mixinDOMProperties(dest){
    return mixin(dest);
}

function get(e){
    if(e.element !== void 0) { return e.element; }
    return e;
}

export { mixin, mixinDOMProperties, props };
//# sourceMappingURL=bundle.es.js.map
