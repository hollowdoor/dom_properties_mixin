import { mixin } from '../';

class MyElement {
    constructor(tag){
        mixin(this);
        if(typeof tag === 'string'){
            this.element = document.createElement(tag);
        }else{
            this.element = tag;
        }
        if(this.element !== document.body)
            document.body.appendChild(this.element);
    }
}

const el = new MyElement('input');
print(el.parent);
el.value = 'Hi!';
print(el.value);
el.style.color = 'blue';
const p = new MyElement('p');
p.innerHTML = "I'm a paragraph"
print(p.innerHTML);
p.data.thing = 'bla';
print(p.data.thing);
const body = new MyElement(document.body);
print(body.first); print(body.last);
print(body.childNodes);

function print(value){
    let div = document.createElement('div');
    try{
        div.innerHTML = 'TEST: '+JSON.stringify(value);
    }catch(e){
        div.innerHTML = 'TEST: '+value;
    }

    document.body.appendChild(div);
}
