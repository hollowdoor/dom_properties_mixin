import arrayFrom from 'array-from';
import cssProxy from 'css-proxy';

const props = (()=>{
    //Renamed properties, and properties with unique behaviors
    //are assigned directly to the original props object
    const props = {
        parent: {
            get(){ return this.element.parentNode; }
        },
        first:{
            get(){
                return this.element.firstChild;
            },
            set(value){
                if(this.element.firstChild !== void 0){
                    return this.element.replaceChild(
                        get(value), this.element.firstChild
                    );
                }
                this.element.appendChild(get(value));
            }
        },
        last: {
            get(){
                return this.element.lastChild;
            },
            set(value){
                if(this.element.lastChild !== void 0){
                    return this.element.replaceChild(
                        get(value), this.element.lastChild
                    );
                }
                this.element.appendChild(get(value));
            }
        },
        children: {
            get(){
                return arrayFrom(this.element.children);
            },
            set(children){
                this.element.innerHTML = '';
                arrayFrom(children).forEach(child=>{
                    this.element.appendChild(get(child));
                });
            }
        },
        childNodes: {
            get(){
                return arrayFrom(this.element.childNodes);
            }
        },
        style: {
            get(){
                if(this._style === void 0){
                    if(Proxy === void 0) return this.element.style;
                    this._style = cssProxy(this.element);
                }
                return this._style;
            }
        },
        root: {
            get(){
                return this.element.rootNode;
            }
        }
    };


    //Define simpler getters, and setters
    ['value', 'innerHTML', 'outerHTML', 'textContent',
    'className', 'classList']
    .forEach(prop=>{
        props[prop] = {
            get(){
                return this.element[prop];
            },
            set(value){
                this.element[prop] = value;
            }
        };
    });

    //Define simpler getters
    ['nodeName', 'nextSibling', 'nodeType', 'nodeName']
    .forEach(prop=>{
        props[prop] = {
            get(){
                return this.element[prop];
            }
        };
    });

    //Enumerable properties are easier to debug
    Object.keys(props).forEach(key=>props[key].enumerable = true);
    return props;
})();


export function mixin(dest){
    Object.defineProperties(dest, props);
    return dest;
}

export function mixinDOMProperties(dest){
    return mixin(dest);
}

export { props };

function get(e){
    if(e.element !== void 0) return e.element;
    return e;
}
