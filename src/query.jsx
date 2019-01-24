import React from 'react';
import { string } from 'prop-types';
import { Query as ApolloQuery } from 'react-apollo';

import { ApolloMultipleClientsConsumer } from './provider';

const Query = ({ clientName, ...rest }) => (
  <ApolloMultipleClientsConsumer>
    {({ getClient }) => <ApolloQuery {...(getClient ? { client: getClient(clientName) } : {})} {...rest} />}
  </ApolloMultipleClientsConsumer>
);

Query.propTypes = {
  clientName: string.isRequired,
};

export default Query;
