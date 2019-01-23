# React Apollo Multiple Clients

## Motivation and Idea
Inspired by Rafael Nunes (see [Medium Article: Apollo Multiple Clients with React](https://medium.com/open-graphql/apollo-multiple-clients-with-react-b34b571210a5)), we needed a more generic solution.

## Install

```js
yarn @titelmedia/react-apollo-multiple-clients
```

## Usage
You can get rid of the original `<ApolloProvider>` and use `<ApolloMultipleClientsProvider>` instead.

```js
import React from 'react';
import ApolloClient from 'apollo-boost';

import { ApolloMultipleClientsProvider, Query } from '@titelmedia/react-apollo-multiple-clients';

const client1 = new ApolloClient({
  uri: 'https://graphql.client1.com'
});

const client2 = new ApolloClient({
  uri: 'https://graphql.client2.com'
});

const clients = {
  firstNamespace: client1,
  secondNamespace: client2,
};

const FETCH_TEST = gql`
  query fetch($foo: String!) {
    test: post(foo: $foo) {
      foo
    }
  }
`;

const TestComponent = ({error, load, data: { test }}) => (loading || error) ? null : test;

const QueryComponent = ({ clientName }) => (
  <Query clientName={clientName} query={FETCH_TEST} variables={{ foo: 'bar' }}>
    <TestComponent />
  </Query>
);

const App = () => (
  <ApolloMultipleClientsProvider clients={clientList}>
    <QueryComponent clientName="firstNamespace" />
    <QueryComponent clientName="secondNamespace" />
  </ApolloMultipleClientsProvider>
);

<App />
```