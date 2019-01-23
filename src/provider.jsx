import React, { Component } from 'react';
import { any, objectOf, node } from 'prop-types';

export const { Provider, Consumer } = React.createContext();

export const ApolloMultipleClientsConsumer = Consumer;

class ApolloMultipleClientsProvider extends Component {
  constructor(props) {
    super(props);

    if (!props.clients || !Object.keys(props.clients) === 0) {
      throw new Error('You need to define at least one client');
    }

    this.getClient = this.getClient.bind(this);
  }

  getClient(name) {
    const { clients } = this.props;
    const selectedClient = clients[name];
    if (!selectedClient) {
      throw new Error(`Could not find client ${name}`);
    }
    return clients[name];
  }

  render() {
    const { children } = this.props;
    return <Provider value={{ getClient: this.getClient }}>{children}</Provider>;
  }
}

ApolloMultipleClientsProvider.propTypes = {
  children: node.isRequired,
  clients: objectOf(any),
};

ApolloMultipleClientsProvider.defaultProps = {
  clients: {},
};

export default ApolloMultipleClientsProvider;
