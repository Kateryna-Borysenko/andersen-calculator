const CALCULATOR_CONFIG = {
  'c': {
    type: 'clear',
    value: 'c',
    title: 'C',
    position: 1,
    handler: function (firstValue, secondValue) {
      return 0;
    },
  },
  'del': {
    type: 'del',
    value: 'del',
    title: '←',
    position: 2,
    handler: function (firstValue, secondValue) {
      return parseFloat(firstValue) / parseFloat(secondValue);
    },
  },
  'opposite': {
    type: 'opposite',
    value: 'opposite',
    title: '+/-',
    position: 3,
    handler: function (firstValue) {
      return parseFloat(firstValue) * -1;
    },
  },
  'divide': {
    type: 'operator',
    value: 'divide',
    title: '/',
    position: 4,
    handler: function (firstValue, secondValue) {
      return parseFloat(firstValue) / parseFloat(secondValue);
    },
  },
  7: { type: 'number', value: 7, title: '7', position: 5 },
  8: { type: 'number', value: 8, title: '8', position: 6 },
  9: { type: 'number', value: 9, title: '9', position: 7 },
  'multiply': {
    type: 'operator',
    value: 'multiply',
    title: '*',
    position: 8,
    handler: function (firstValue, secondValue) {
      return parseFloat(firstValue) * parseFloat(secondValue);
    },
  },
  4: { type: 'number', value: 4, title: '4', position: 9 },
  5: { type: 'number', value: 5, title: '5', position: 10 },
  6: { type: 'number', value: 6, title: '6', position: 11 },
  'minus': {
    type: 'operator',
    value: 'minus',
    title: '-',
    position: 12,
    handler: function (firstValue, secondValue) {
      return parseFloat(firstValue) - parseFloat(secondValue);
    },
  },
  1: { type: 'number', value: 1, title: '1', position: 13 }, 
  2: { type: 'number', value: 2, title: '2', position: 14 },
  3: { type: 'number', value: 3, title: '3', position: 15 },
  'plus': {
    type: 'operator',
    value: 'plus',
    title: '+',
    position: 16,
    handler: function (firstValue, secondValue) {
      return parseFloat(firstValue) + parseFloat(secondValue);
    },
  },
  0: { type: 'number', value: 0, title: '0', position: 17 },
  'dot': {
    type: 'operator',
    value: 'dot',
    title: '.',
    position: 18,
    handler: function (firstValue, secondValue) {
      return parseFloat(firstValue) / parseFloat(secondValue);
    },
  },
  'equal': { type: 'result', value: 'equal', title: '=', position: 19 }
}

class Button {
  constructor({ type, value, title }) {
    this.title = title;
    this.value = value;
    this.type = type;

    return this.render();
  }

  render() {
    const button = document.createElement('button');
    button.innerText = this.title;
    button.classList.add('calculator__btn');

    button.setAttribute('data-value', this.value);
    button.setAttribute('data-type', this.type);

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

class Screen {
  constructor() {
    this.value = 0;
    this.input;
  }

  render = () => {
    this.input = document.createElement('input');
    this.input.setAttribute('type', 'text');
    this.input.setAttribute('readonly', true);
    this.input.setAttribute('value', this.value);
    this.input.classList.add('calculator__input');

    return this.input;
  }

  setValue = (newValue) => {
    this.input.setAttribute('value', newValue);
  }

  getValue(){
    return this.input.getAttribute('value');
  }
}

class Calculator {
  constructor(config) {
    this.root = document.querySelector('#calculator');
    this.numPad;
    this.config = config;

    this.screen = new Screen();

    this.firstOperand = '';
    this.secondOperand = '';
    this.operation = null;

    this.init();
  }

  init = () => {
    this.root.appendChild(this.screen.render());
    this.numPad = document.createElement('div');
    this.numPad.classList.add('calculator__btns');

    Object.entries(this.config).map(currentItem => currentItem[1]).sort((a, b) => a.position - b.position)
    .forEach((key) => {
      const className = key.type[0].toUpperCase() + key.type.slice(1) + "Button";
      this.numPad.appendChild(eval(`new ${className}(this.config[key.value])`));
    });

    this.root.appendChild(this.numPad);

    this.numPad.addEventListener('click', event => {
      const currentEventTarget = event.target;
      if (currentEventTarget.hasAttribute('data-value')) {
        const type = currentEventTarget.getAttribute('data-type');
        const value = currentEventTarget.getAttribute('data-value');
        switch (type) { 
          case 'number':
              if (!this.operation || this.operation == 'c') {
                this.setOperand(value, 'firstOperand');
              } 
              else {
                this.setOperand(value, 'secondOperand');
              } 
 
            break;
          case 'operator':
            if (this.firstOperand) {
              this.operation = value;
            }
            break;
          case 'result':
            this.makeResult(this.firstOperand, this.secondOperand, this.operation);
            // this.firstOperand = this.screen.getValue();
            console.log(this.firstOperand, this.secondOperand);
            break;  
          case 'opposite':
              this.operation = value;
              this.secondOperand = -1;
              this.makeResult(this.firstOperand, this.secondOperand, this.operation);
              this.secondOperand = '';
              this.firstOperand = this.screen.getValue();
              break; 
          case 'clear':
              this.operation = value;
              this.screen.setValue('');
              this.firstOperand = '';
              break;       
          default:
            return;
        }
      }
    });
  }

  setOperand = (anotherValue, properyName) => {
    console.log(properyName, anotherValue);
    this[properyName] += anotherValue;
    this.screen.setValue(this[properyName]);
  }

  makeResult = (firstValue, secondValue, operation) => {
    const handler = this.config[operation].handler;

    if (handler) {
      this.screen.setValue(handler(firstValue, secondValue));
    }
  }
}

new Calculator(CALCULATOR_CONFIG);