const React = require("react");

const { Provider, Consumer } = React.createContext({
  name: ""
});

class EvolutioProvider extends React.Component {
  render() {
    return (
      <Provider value={this.props.dna}>
        <React.Fragment>{this.props.children}</React.Fragment>
      </Provider>
    );
  }
}

class MutationConsumer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      context: { dna: this.props.dna, name: this.props.name }
    };
  }

  render() {
    return (
      <Provider value={this.state.context}>
        <React.Fragment>{this.props.children}</React.Fragment>
      </Provider>
    );
  }
}

class GeneConsumer extends React.Component {
  render() {
    if (this.props.dna[this.props.mutationName] !== this.props.name) {
      return null;
    }

    if (typeof this.props.children === "function") {
      return this.props.children();
    }

    return <React.Fragment>{this.props.children}</React.Fragment>;
  }
}

const Mutation = props => {
  return (
    <Consumer>{ctx => <MutationConsumer {...props} dna={ctx} />}</Consumer>
  );
};

const Gene = props => (
  <Consumer>
    {ctx => <GeneConsumer {...props} dna={ctx.dna} mutationName={ctx.name} />}
  </Consumer>
);

const dna = {
  buttonText: "aggressive"
};

const App = () => {
  return (
    <EvolutioProvider dna={dna}>
      <div>
        <h1>The app</h1>
        <Mutation name="buttonText">
          <Gene name="normal">buy</Gene>
          <Gene name="aggressive">BUY NOW!</Gene>
        </Mutation>
      </div>
    </EvolutioProvider>
  );
};
