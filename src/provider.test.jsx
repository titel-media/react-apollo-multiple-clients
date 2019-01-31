import React, { Component } from 'react';
import renderer from 'react-test-renderer';
import { objectOf, any } from 'prop-types';
import { Query as ApolloQuery, Mutation as ApolloMutation } from 'react-apollo';

import { ApolloMultipleClientsProvider, withClient } from '.';

/* eslint-disable react/prop-types */
jest.mock('react-apollo', () => ({
  Query: ({ client, ...rest }) => <div className="query" {...rest}>{client}</div>,
  Mutation: ({ client, ...rest }) => <div className="mutation" {...rest}>{client}</div>,
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

  it('should throw error when client cannot be found', () => {
    try {
      const Enriched = withClient()(ApolloMutation);
      renderer.create(
        <ApolloMultipleClientsProvider clients={clientList}>
          <Enriched />
        </ApolloMultipleClientsProvider>,
      );
    } catch (err) {
      expect(err).toMatchSnapshot();
    }
  });

  it('should provide correct client', () => {
    const EnrichedQuery = withClient('test')(ApolloQuery);
    const EnrichedMutation = withClient('test')(ApolloMutation);

    const app = renderer.create(
      <ApolloMultipleClientsProvider clients={{ test: 'clientos' }}>
        <EnrichedQuery />
        <EnrichedMutation />
      </ApolloMultipleClientsProvider>,
    );

    expect(app.toJSON()).toMatchSnapshot();
  });

  it('should not override client outside provider', () => {
    const Enriched = withClient('test')(ApolloQuery);

    const app = renderer.create(
      <div>
        <Enriched client="foobar-NOT-overridden" />
      </div>,
    );

    expect(app.toJSON()).toMatchSnapshot();
  });

  it('should override client inside provider', () => {
    const Enriched = withClient('test')(ApolloMutation);

    const app = renderer.create(
      <div>
        <ApolloMultipleClientsProvider clients={{ test: 'clientos' }}>
          <Enriched client="foobar-overridden" />
        </ApolloMultipleClientsProvider>
      </div>,
    );

    expect(app.toJSON()).toMatchSnapshot();
  });

  it('should work with class as well', () => {
    class Foo extends Component {
      constructor(props) {
        super(props);
        this.state = {};
      }

      render() {
        const { client } = this.props;
        return <div>{client}</div>;
      }
    }
    Foo.propTypes = {
      client: objectOf(any).isRequired,
    };

    const Enriched = withClient('test')(Foo);

    const app = renderer.create(
      <ApolloMultipleClientsProvider clients={{ test: 'clientos' }}>
        <Enriched />
      </ApolloMultipleClientsProvider>,
    );

    expect(app.toJSON()).toMatchSnapshot();
  });
});
