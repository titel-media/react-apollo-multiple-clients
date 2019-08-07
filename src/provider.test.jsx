import React, { Component } from 'react';
import renderer from 'react-test-renderer';
import { objectOf, any } from 'prop-types';

import { ApolloMultipleClientsProvider, withClient } from '.';

const { Provider, Consumer } = React.createContext();

const ClientNamePrinter = ({ children, ...rest }) => (
  <Consumer>
    {({ client }) => (
      <div className="query" {...rest}>
        <span>{client}</span>
        {children}
      </div>
    )}
  </Consumer>
);

const ProviderWrapper = ({ children, client }) => <Provider value={{ client }}><div className={`provider ${client}`}>{children}</div></Provider>;

const client1 = 'client1';
const client2 = 'client2';

const clientList = {
  clientName1: client1,
  clientName2: client2,
};

describe('React Apollo Multiple Clients', () => {
  beforeAll(() => {
    global.consoleError = console.error;
    console.error = () => null;
  });
  afterAll(() => {
    console.error = global.consoleError;
  });

  it('should throw error when provider has no clients', () => {
    try {
      renderer.create(<ApolloMultipleClientsProvider clients={null} />);
    } catch (err) {
      expect(err).toMatchSnapshot();
    }
  });

  it('should throw error when client no client is given', () => {
    try {
      const Enriched = withClient()(ClientNamePrinter);
      renderer.create(<ApolloMultipleClientsProvider clients={clientList}>
        <Enriched />
      </ApolloMultipleClientsProvider>);
    } catch (err) {
      expect(err).toMatchSnapshot();
    }
  });

  it('should throw error when client cannot be found', () => {
    try {
      const Enriched = withClient('not-available', ProviderWrapper, Consumer)(ClientNamePrinter);
      renderer.create(<ApolloMultipleClientsProvider clients={clientList}>
        <Enriched />
      </ApolloMultipleClientsProvider>);
    } catch (err) {
      expect(err).toMatchSnapshot();
    }
  });

  it('should provide correct client', () => {
    const ClientQuery1 = withClient('clientName1', ProviderWrapper, Consumer)(ClientNamePrinter);
    const ClientQuery2 = withClient('clientName2', ProviderWrapper, Consumer)(ClientNamePrinter);

    const app = renderer.create(<ApolloMultipleClientsProvider clients={clientList}>
      <ClientQuery1 />
      <ClientQuery2 />
    </ApolloMultipleClientsProvider>);

    expect(app.toJSON()).toMatchSnapshot();
  });

  it('should provide correct client within nested provider', () => {
    const ClientQueryContainer = withClient('clientName1', ProviderWrapper, Consumer)(ClientNamePrinter);
    const ClientQuery1 = withClient('clientName1', ProviderWrapper, Consumer)(ClientNamePrinter);
    const ClientQuery2 = withClient('clientName2', ProviderWrapper, Consumer)(ClientNamePrinter);

    const app = renderer.create(<ApolloMultipleClientsProvider clients={clientList}>
      <ClientQuery1 />
      <ClientQueryContainer>
        <ClientQuery1 />
        <ClientQuery2 />
      </ClientQueryContainer>
      <ClientQuery2 />
    </ApolloMultipleClientsProvider>);

    expect(app.toJSON()).toMatchSnapshot();
  });

  it('should not override client outside provider', () => {
    const Enriched = withClient('test', ProviderWrapper, Consumer)(ClientNamePrinter);

    const app = renderer.create(<div>
      <Enriched client="foobar-NOT-overridden" />
    </div>);

    expect(app.toJSON()).toMatchSnapshot();
  });

  it('should override client inside provider', () => {
    const Enriched = withClient('test', ProviderWrapper, Consumer)(ClientNamePrinter);

    const app = renderer.create(<div>
      <ApolloMultipleClientsProvider clients={{ test: 'clientos' }}>
        <Enriched client="foobar-overridden" />
      </ApolloMultipleClientsProvider>
    </div>);

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

    const Enriched = withClient('test', ProviderWrapper, Consumer)(Foo);

    const app = renderer.create(<ApolloMultipleClientsProvider clients={{ test: 'clientos' }}>
      <Enriched />
    </ApolloMultipleClientsProvider>);

    expect(app.toJSON()).toMatchSnapshot();
  });
});
