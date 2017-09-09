import arrayFrom from 'array-from';

var props = (function (){
    var props = {
        parent: {
            get: function get(){ return this.element.parentNode; }
        },
        first:{
            get: function get(){
                return this.element.firstChild;
            }
        },
        last: {
            get: function get(){
                return this.element.lastChild;
            }
        },
        nodeName: {
            get: function get(){
                return this.element.nodeName;
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
                    this$1.element.appendChild(child);
                });
            }
        },
        childNodes: {
            get: function get(){
                return arrayFrom(this.element.childNodes);
            }
        },
        /*value: {
            set(value){
                this.element.value = value;
            },
            get(){
                return this.element.value;
            }
        },
        innerHTML: {
            set(html){
                this.element.innerHTML = html;
            },
            get(){
                return this.element.innerHTML;
            }
        },*/
        style: {
            get: function get(){
                if(!this._style){
                    if(Proxy === void 0) { return this.element.style; }
                    if(isElement(el)){
                        this._style = cssProxy(el);
                    }else if(el === window || el === document){
                        this._style = cssProxy();
                    }
                }
                return this._style;
            }
        },
    };

    ['value', 'innerHTML']
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

    Object.keys(props).forEach(function (key){ return props[key].enumerable = true; });
    return props;
})();


function mixin(dest){
    Object.defineProperties(dest, props);
    return dest;
}

function mixinDOMProperties(dest){
    return mix(dest);
}

export { mixin, mixinDOMProperties, props };
//# sourceMappingURL=bundle.es.js.map
