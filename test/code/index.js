const evo = require('../../src');
const dna = {
  currentValue: 'a'
};

const { Mutation } = evo(dna);

function someFucntion() {
  const buttonText = Mutation('button-text')
    .gene('a', 'BUY NOW!')
    .gene('b', 'Buy now')
    .gene('c', 'Buy')
    .value();

  const buttonClass = Mutation('button-class')
    .gene('empty', '')
    .gene('normal', 'normal')
    .value();

  function extenalFunc() {
    console.log('declarative function');
  }

  Mutation('run-code')
    .gene('declarative', function declar() {
      console.log('declarative function');
    })
    .gene('extenalFunc', extenalFunc)
    .gene('expression', () => {
      console.log('function expression');
    })
    .run();

  return `<button class="${buttonClass}">${buttonText}</button>`
}

console.log(someFucntion());
