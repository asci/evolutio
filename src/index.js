function Evolutio(DNA) {

  function Mutation(mutationName) {
    let result;

    const instance = {
      gene(gene, val) {
        if (DNA.hasOwnProperty(mutationName) && DNA[mutationName] === gene) {
          result = val;
        }
        return instance;
      },

      value() {
        return result;
      },

      run() {
        return result();
      }
    }

    return instance;
  }

  return {
    Mutation
  };
}

module.exports = Evolutio;
