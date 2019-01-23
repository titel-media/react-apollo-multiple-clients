import React from 'react';
import renderer from 'react-test-renderer';

import ApolloMultipleClientsProvider from './provider';
import Query from './query';

jest.mock('react-apollo', () => ({
  Query: ({ client }) => client,
}));

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
        <Query clientName="clientName2">{props => props.client}</Query>
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
});
