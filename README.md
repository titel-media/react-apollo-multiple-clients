# React Apollo Multiple Clients

## Motivation and Idea
Inspired by Rafael Nunes (see [Medium Article: Apollo Multiple Clients with React](https://medium.com/open-graphql/apollo-multiple-clients-with-react-b34b571210a5)), we needed a more generic solution.

## Install

```js
yarn @titelmedia/react-apollo-multiple-clients
```

## Usage
You can get rid of the original `<ApolloProvider>` and use `<ApolloMultipleClientsProvider>` instead. Use the Higher Order Component 'withMultipleClients' to set a namespace.

```js
import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { Query, Mutation } from 'react-apollo';

import { ApolloMultipleClientsProvider, withMultipleClients } from '@titelmedia/react-apollo-multiple-clients';

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

const InnerComponent = ({error, load, data: { test }}) => (loading || error) ? null : test;


const Component = ({ client, ...rest }) => (
  <Query client={client} query={FETCH_TEST} variables={{ foo: 'bar' }}>
    <InnerComponent {...rest} />
  </Query>
  <Mutation client={client} query={FETCH_TEST} variables={{ foo: 'bar' }}>
    <InnerComponent {...rest} />
  </Mutation>
);

const WrapperComponentClient1 = withMultipleClients('firstNamespace')(Component);
const WrapperComponentClient2 = withMultipleClients('secondNamespace')(Component);

const App = () => (
  <ApolloMultipleClientsProvider clients={clientList}>
    <WrapperComponentClient1 />
    <WrapperComponentClient2 />
  </ApolloMultipleClientsProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
```