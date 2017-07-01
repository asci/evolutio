const util = require('util');
const VALUE = 'value';
const RUN = 'run';
const MUTATION = 'Mutation';
const GENE = 'gene';
const DNA = require(process.env.DNA);

module.exports = function(fileInfo, api, options) {
  const j = api.jscodeshift;
  const result = j(fileInfo.source)
    .find(j.CallExpression)
    .filter(function filterMutations(node) {
      try {
        if (
          node.value.callee.property.name !== VALUE
          && node.value.callee.property.name !== RUN
        ) return false;

        let mutationName;
        const genes = [];
        let currentNode = node.value;
        while (currentNode) {
          try {
            if (currentNode.callee.name === MUTATION) {
              mutationName = currentNode.arguments[0].rawValue;
            }
          } catch (e) {
            //ignore
          }

          try {
            if (currentNode.callee.object.callee.property.name === GENE) {
              genes.push(currentNode.callee.object.arguments[0].rawValue);
            }
          } catch (e) {
            //ignore
          }

          currentNode = currentNode.callee.object;
        }

        return DNA.hasOwnProperty(mutationName) && genes.includes(DNA[mutationName]);
      } catch (e) {
        return false;
      }
      return false;
    })
    .replaceWith(function replaceMutations(node) {
      let mutationName;
      const genes = {};
      const isRun = node.value.callee.property.name === RUN;

      let currentNode = node.value;
      while (currentNode) {
        try {
          if (currentNode.callee.name === MUTATION) {
            mutationName = currentNode.arguments[0].rawValue;
          }
        } catch (e) {
          //ignore
        }

        try {
          if (currentNode.callee.object.callee.property.name === GENE
            && currentNode.callee.object.arguments[0].type === 'Literal'
          ) {
            if (isRun) {
              if (currentNode.callee.object.arguments[1].type === 'Identifier') {
                genes[currentNode.callee.object.arguments[0].rawValue] = j.expressionStatement(
                  j.callExpression(
                    currentNode.callee.object.arguments[1], []
                  )
                )
              } else if (
                currentNode.callee.object.arguments[1].type === 'ArrowFunctionExpression'
                || currentNode.callee.object.arguments[1].type === 'FunctionExpression'
              ) {
                genes[currentNode.callee.object.arguments[0].rawValue] = currentNode.callee.object.arguments[1].body.body;
              }
            } else {
              genes[currentNode.callee.object.arguments[0].rawValue] = currentNode.callee.object.arguments[1];
            }
          }
        } catch (e) {
          //ignore
        }

        currentNode = currentNode.callee.object;
      }

      return genes[DNA[mutationName]];
    })
    .toSource();

  return result.replace(';;', ';');
};
