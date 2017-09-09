import arrayFrom from 'array-from';
import cssProxy from 'css-proxy';

const props = (()=>{
    const props = {
        parent: {
            get(){ return this.element.parentNode; }
        },
        first:{
            get(){
                return this.element.firstChild;
            }
        },
        last: {
            get(){
                return this.element.lastChild;
            }
        },
        children: {
            get(){
                return arrayFrom(this.element.children);
            },
            set(children){
                this.element.innerHTML = '';
                arrayFrom(children).forEach(child=>{
                    this.element.appendChild(child);
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
                    if(isElement(el)){
                        this._style = cssProxy(el);
                    }else if(el === window || el === document){
                        this._style = cssProxy();
                    }
                }
                return this._style;
            }
        }
    };


    //Define simpler getters, and setters
    ['value', 'innerHTML']
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
    ['nodeName']
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
    return mix(dest);
}

export { props };
