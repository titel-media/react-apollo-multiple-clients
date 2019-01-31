import React from 'react';
import { ApolloProvider, ApolloConsumer } from 'react-apollo';

import { ApolloMultipleClientsConsumer } from './provider';

export default (clientNamespace, Provider = ApolloProvider, Consumer = ApolloConsumer) => {
  if (!clientNamespace) {
    throw new Error('Please provide a client namespace');
  }
  return WrappedComponent => props => (
    <Consumer>
      {context => (
        <ApolloMultipleClientsConsumer>
          {({ getClient }) => {
            const client = getClient(clientNamespace);
            let result = <WrappedComponent {...props} />;
            if (!context || context.client !== client) {
              result = (<Provider client={client}>{result}</Provider>);
            }
            return result;
          }}
        </ApolloMultipleClientsConsumer>
      )}
    </Consumer>
  );
};
