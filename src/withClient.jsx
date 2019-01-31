import React from 'react';

import { ApolloMultipleClientsConsumer } from './provider';

export default (clientNamespace) => {
  if (!clientNamespace) {
    throw new Error('Please provide a client namespace');
  }
  return WrappedComponent => props => (
    <ApolloMultipleClientsConsumer>
      {(consumer) => {
        let client = null;
        if (consumer) {
          const { getClient } = consumer;
          client = getClient(clientNamespace);
        }
        return <WrappedComponent {...props} client={client} />;
      }}
    </ApolloMultipleClientsConsumer>
  );
};
