# Evolutio
*Frontend A\B testing framework with automated code removing of finished tests*

## Install
```
npm i evolutio -S
```

## How to use
### Terms
- **Mutation** - single A\B test or a feature. Contains different genes
- **Gene** - single test case or option. Contains a value or piece of code to run
- **DNA** - current configuration for A\B test (Mutations). Could be generated dynamically for each runtime
- **Winners DNA** - configuration with winner Genes. Used to remove outdated mutations

### Example
For example we need to generate 2 different texts for selling button:


Generate our DNA. This could be done by external service. Let's put it into `./src/dna.js` file:
```js
export default {
  'sell-button-text': Math.random() > 0.5 ? 'aggressive' : 'normal'
};
```
Then we use this DNA in `src/button.js` file:
```js
import evolutio from 'evolutio';
import dna from './dna';
const { Mutation } = evolutio(dna);

function button() {
  const buttonText = Mutation('sell-button-text')
    .gene('aggressive', 'BUY NOW!')
    .gene('normal', 'Buy')
    .value();

  return `<button>${buttonText}</button>`;
}

export default button;
```
### Removing outdated tests
add a script to your `package.json`:

```
"clean:abtest": "evolutio -w ./winners.json -s ./src --no-dry"
```
Here `./src` is the directory with your source code (please commit your changes before running this command). And `winners.json` is a file with winner genes, for example like this:
```json
{
  "sell-button-text": "normal"
}
```

Then, if you run this command it will modify the code of `src/button.js` to be like this:
```js
import evolutio from 'evolutio';
import dna from './dna';
const { Mutation } = evolutio(dna);

function button() {
  const buttonText = 'Buy'

  return `<button>${buttonText}</button>`;
}

export default button;
```

## API
### DNA
`Object`
Key-value object. Represend a config for current runtime or winners config for removing.

### Evolutio
`Function`
Main package function. Expect to receive `DNA` and returns an object with `Mutation` function
```
evolutio(dna:DNA) -> {Mutation: Mutation}
```

### Mutation
`Function`
Mutation function expect to receive test name. Creates new MutationInstance:
```
Mutation(mutationName:String) -> MutationInstance
```
### MutationInstance
`Object` with mutation methods:

#### gene
Add new gene to mutation. Expect gene name and gene value. Value could be any variable or function:
```
gene(geneName:String, geneValue:mixed) -> MutationInstance
```
#### value
Immediately returns a value of active gene according to DNA
```
value() -> mixed
```
#### run
Immediately invoke a function of active gene according to DNA. Like `value`, but calling a function and returns it's result
```
run() -> mixed
```

## CLI
```
Options:
   -d, --dry       Dry run  [true]
   -p, --print     Print output
   -s, --src       path to directory to remove outdated mutations  [./src]
   -w, --winners   Winners DNA: a JSON file with winner mutations, key is a mutation name and value is a winner gene  []
   --version       print version and exit
```
