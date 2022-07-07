const CALCULATOR_CONFIG = [
    {
      type: 'clear',
      value: 'c',
      title: 'C',
      position: 1,
      handler: function () {
        this.clear();
      },
    },
    {
      type: 'del',
      value: 'del',
      title: '←',
      position: 2,
      handler: function () {
        this.delDigit();
      },
    },
    {
      type: 'opposite',
      value: 'opposite',
      title: '+/-',
      position: 3,
      handler: function () {
        this.getOpposite();
      },
    },
    {
      type: 'operator',
      value: 'divide',
      title: '/',
      position: 4,
      handler: function () {
        this.addSymbol('/');
      },
    },
    { type: 'number', value: 7, title: '7', position: 5, handler: function(){ this.addSymbol(7); } },
    { type: 'number', value: 8, title: '8', position: 6, handler: function(){ this.addSymbol(8); } },
    { type: 'number', value: 9, title: '9', position: 7, handler: function(){ this.addSymbol(9); } },
    {
      type: 'operator',
      value: 'multiply',
      title: '*',
      position: 8,
      handler: function () {
        this.addSymbol('*');
      },
    },
    { type: 'number', value: 4, title: '4', position: 9, handler: function(){ this.addSymbol(4); } },
    { type: 'number', value: 5, title: '5', position: 10, handler: function(){ this.addSymbol(5); } },
    { type: 'number', value: 6, title: '6', position: 11, handler: function(){ this.addSymbol(6); } },
    {
      type: 'operator',
      value: 'minus',
      title: '-',
      position: 12,
      handler: function () {
        this.addSymbol('-');
      },
    },
    { type: 'number', value: 1, title: '1', position: 13, handler: function(){ this.addSymbol(1); } }, 
    { type: 'number', value: 2, title: '2', position: 14, handler: function(){ this.addSymbol(2); } },
    { type: 'number', value: 3, title: '3', position: 15, handler: function(){ this.addSymbol(3); } },
    {
      type: 'operator',
      value: 'plus',
      title: '+',
      position: 16,
      handler: function () {
        this.addSymbol('+');
      },
    },
    { type: 'number', value: 0, title: '0', position: 17, handler: function(){ this.addSymbol(0); } },
    {
      type: 'operator',
      value: 'dot',
      title: '.',
      position: 18,
      handler: function () {
        this.addSymbol('.');
      },
    },
    { type: 'result', value: 'equal', title: '=', position: 19, handler: function(){
        this.getResult();
    } }
];

const RE_EXPRESSION = /^(\-?[0-9]{1,11}(\.[0-9]{1,8})?)([\+\-*\/])(\-?[0-9]{1,11}(\.[0-9]{1,8})?)$/;

class Calculator{
    constructor(config){
        this.root = document.querySelector('#calculator');
        this.config = config;
        this.screen = new Screen();

        this.init();
    }
    init(config){
        this.root.appendChild(this.screen.render());
        this.numPad = document.createElement('div');
        this.numPad.classList.add('calculator__btns');

        this.config.sort((a, b) => a.position - b.position);
        this.config.forEach((currentBtnData, index) => {
            const btnClassName = currentBtnData.type[0].toUpperCase() + currentBtnData.type.slice(1) + "Button";
            this.numPad.appendChild(eval(`new ${btnClassName}(this.config[index], index)`));
        });
        this.root.appendChild(this.numPad);
    }
}

class Screen {
    constructor() {
      this.value = 0;
      this.numfield = null;

      this.init();
    }

    init(){
        this.numfield = document.querySelector('.calculator__input');
    }
  
    render(){
      this.input = document.createElement('input');
      this.input.setAttribute('type', 'text');
      this.input.setAttribute('readonly', true);
      this.input.setAttribute('value', this.value);
      this.input.classList.add('calculator__input');
  
      return this.input;
    }
  
    setValue(newValue){
        this.numfield.setAttribute('value', newValue);
    }
  
    getValue(){
      return this.numfield.getAttribute('value') !== '0' ? this.numfield.getAttribute('value') : '';
    }

    clear(){
        this.setValue('');
    }

    addSymbol(value){
        const newValue = this.getValue() + value;
        newValue[0].match(/^[+*\/]/) || newValue.match(/(\-\-)/) ? '' : this.numfield.setAttribute('value', newValue);
    }

    delDigit(){
        const value = this.getValue();
        const newValue = value.slice(0, value.length-1);
        this.setValue(newValue);
    } 
    
    getOpposite(){
        const newValue = this.getValue() * -1;
        this.setValue(newValue);
    }

    getResult(){
        const data = this.getValue().match(RE_EXPRESSION);
            if(data !== null){
                const [expression, num1, fraction, operator, num2] = data;
                let result = '';
                let isError = false;
                    if(operator == '+'){
                        result = parseFloat(num1) + parseFloat(num2);
                    }
                    else if(operator == '-'){
                        result = parseFloat(num1) - parseFloat(num2);
                    }
                    else if(operator == '*'){
                        result = parseFloat(num1) * parseFloat(num2);
                    }
                    else if(operator == '/'){
                        if(parseFloat(num2)){
                            result = parseFloat(num1) / parseFloat(num2);
                        }
                        else{
                            result = `Error ${expression}`;
                            isError = true;
                        }
                    }
                    this.setValue(!isError ? result.toFixed(8).replace(/\.?0{1,8}$/, '') : result);
            }
    }
}

class Button {
    constructor({type, value, title, position, handler}, index) {
        
      this.title = title;
      this.value = value;
      this.type = type;
      this.position = position;
      this.handler = handler;
      this.index = index;
      this.screen = new Screen();
  
      return this.render();
    }
  
    render() {
      const button = document.createElement('button');
      button.innerText = this.title;
      button.classList.add('calculator__btn');
  
      button.setAttribute('data-value', this.value);
      button.setAttribute('data-type', this.type);
      button.setAttribute('data-position', this.position);

      button.addEventListener('click', this.handler.bind(this.screen));
  
      return button;
    }
  }
  
  class NumberButton extends Button{
    constructor(data){
      super(data);
    }
  
    render(){
      const button = super.render();
      button.classList.add('calculator__btn_num');
        if(this.value === 0)
          button.classList.add('calculator__btn_num-0');
  
      return button;
    }
  }
  
  class OperatorButton extends Button{
    constructor(data){
      super(data);
    }
  
    render(){
      const button = super.render();
      return button;
    }
  }
  
  class ResultButton extends Button{
    constructor(data){
      super(data);
    }
  
    render(){
      const button = super.render();
        if(this.value === "equal")
          button.classList.add('calculator__btn_result');
      return button;
    }
  }
  
  class ClearButton extends Button{
    constructor(data){
      super(data);
    }
  
    render(){
      const button = super.render();
      return button;
    }
  }
  
  class DelButton extends Button{
    constructor(data){
      super(data);
    }
  
    render(){
      const button = super.render();
      return button;
    }
  }
  
  class OppositeButton extends Button{
    constructor(data){
      super(data);
    }
  
    render(){
      const button = super.render();
      return button;
    }
  }

new Calculator(CALCULATOR_CONFIG);


  