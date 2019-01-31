# React Apollo Multiple Clients

## Motivation and Idea
Inspired by Rafael Nunes (see [Medium Article: Apollo Multiple Clients with React](https://medium.com/open-graphql/apollo-multiple-clients-with-react-b34b571210a5)), we needed a more generic solution.

## Install

```js
yarn @titelmedia/react-apollo-multiple-clients
```

## Usage
You can get rid of the original `<ApolloProvider>` and use `<ApolloMultipleClientsProvider>` instead. Use the Higher Order Component 'withClient' to set a namespace.

```js
import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { Query, Mutation } from 'react-apollo';

import { ApolloMultipleClientsProvider, withClient } from '@titelmedia/react-apollo-multiple-clients';

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

const Component = ({ ...rest }) => (
  <Query query={FETCH_TEST} variables={{ foo: 'bar' }}>
    <InnerComponent {...rest} />
  </Query>
  <Mutation query={FETCH_TEST} variables={{ foo: 'bar' }}>
    <InnerComponent {...rest} />
  </Mutation>
);

const ClientQueryContainer = withClient('clientName1')(Component);
const ClientQuery1 = withClient('clientName1')(Component);
const ClientQuery2 = withClient('clientName2')(Component);

const App = () => (
  <ApolloMultipleClientsProvider clients={clientList}>
    <ClientQuery1 />
    <ClientQueryContainer>
      <ClientQuery1 />
      <ClientQuery2 />
    </ClientQueryContainer>
    <ClientQuery2 />
  </ApolloMultipleClientsProvider>,
);

/* Output will be something like
  <ApolloProvider client={client1}>
    <ClientQuery1 /> // context is client1
    <ClientQueryContainer>
      <ApolloProvider client={client2}>
        <ClientQuery2 /> // context is client2
      </ApolloProvider>
      <ClientQuery1 /> // context is client1 and is not extra wrapped inside a provider
    </ClientQueryContainer>
    <ApolloProvider client={client2}>
      <ClientQuery2 /> // context is client2 and will be wrapped inside a new container
    </ApolloProvider>
  </ApolloProvider>

*/

ReactDOM.render(<App />, document.getElementById('root'));
```