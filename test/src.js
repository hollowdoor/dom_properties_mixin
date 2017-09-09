import { mixin } from '../';

class MyElement {
    constructor(tag){
        mixin(this);
        this.element = document.createElement(tag);
        document.body.appendChild(this.element);
    }
}

const el = new MyElement('input');
el.value = 'Hi!';
print(el.value);
const p = new MyElement('p');
p.innerHTML = "I'm a paragraph"
print(p.innerHTML);

function print(value){
    let div = document.createElement('div');
    div.innerHTML = 'TEST: '+value;
    document.body.appendChild(div);
}
