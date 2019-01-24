import React from 'react';
import renderer from 'react-test-renderer';
import { ApolloProvider } from 'react-apollo';

import { ApolloMultipleClientsProvider, Query, Mutation } from '.';

/* eslint-disable react/prop-types */
jest.mock('react-apollo', () => ({
  Query: ({ client, ...rest }) => <div className="query" {...rest}>{client}</div>,
  Mutation: ({ client, ...rest }) => <div className="mutation" {...rest}>{client}</div>,
  ApolloProvider: ({ children }) => children,
}));
/* eslint-enable react/prop-types */

const client1 = 'client1';
const client2 = 'client2';

const clientList = {
  clientName1: client1,
  clientName2: client2,
};

describe('React Apollo Multiple Clients', () => {
  /* eslint-disable no-console */
  beforeAll(() => {
    global.consoleError = console.error;
    console.error = () => {};
  });
  afterAll(() => {
    console.error = global.consoleError;
  });
  /* eslint-enable no-console */
  it('should use client1', () => {
    const app = renderer.create(
      <ApolloMultipleClientsProvider clients={clientList}>
        <Query clientName="clientName1">{props => props.client}</Query>
      </ApolloMultipleClientsProvider>,
    );
    expect(app.toJSON()).toMatchSnapshot();
  });

  it('should use client2', () => {
    const app = renderer.create(
      <ApolloMultipleClientsProvider clients={clientList}>
        <Mutation clientName="clientName2">{props => props.client}</Mutation>
      </ApolloMultipleClientsProvider>,
    );
    expect(app.toJSON()).toMatchSnapshot();
  });

  it('should throw error when no client is provided', () => {
    try {
      renderer.create(
        <ApolloMultipleClientsProvider clients={null}>
          <div />
        </ApolloMultipleClientsProvider>,
      );
    } catch (err) {
      expect(err).toMatchSnapshot();
    }
  });

  it('should throw error when client cannot be found', () => {
    try {
      renderer.create(
        <ApolloMultipleClientsProvider clients={clientList}>
          <Query clientName="undefinedClient">{props => props.client}</Query>
        </ApolloMultipleClientsProvider>,
      );
    } catch (err) {
      expect(err).toMatchSnapshot();
    }
  });

  it('should work with without provider', () => {
    const app = renderer.create(
      <ApolloProvider>
        <Query clientName="clientName">{props => props.client}</Query>
        <Mutation clientName="clientName">{props => props.client}</Mutation>
      </ApolloProvider>,
    );
    expect(app.toJSON()).toMatchSnapshot();
  });
});
