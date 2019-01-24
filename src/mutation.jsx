import React from 'react';
import { string } from 'prop-types';
import { Mutation as ApolloMutation } from 'react-apollo';

import { ApolloMultipleClientsConsumer } from './provider';

const Mutation = ({ clientName, ...rest }) => (
  <ApolloMultipleClientsConsumer>
    {({ getClient }) => <ApolloMutation client={getClient(clientName)} {...rest} />}
  </ApolloMultipleClientsConsumer>
);

Mutation.propTypes = {
  clientName: string.isRequired,
};

export default Mutation;
