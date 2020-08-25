import { GraphQLClient, gql } from '../';
import { suite } from 'uvu';
import { is, ok, type } from 'uvu/assert';
import fetch from 'node-fetch';

// @ts-ignore
globalThis.fetch = fetch;

const graphqlClient = suite('graphql-client');

graphqlClient('gql function should return a minified string', () => {
  const query = gql`
    query {
      getAllMovies {
        title
      }
    }
  `;

  is(query, `query { getAllMovies { title } }`);
});

graphqlClient('client should be able to send a graphql query', async () => {
  const url = 'https://countries.trevorblades.com/';
  const client = GraphQLClient(url);
  const query = gql`
    query getAllCountries {
      countries {
        code
        name
      }
    }
  `;
  const { countries } = await client.request<{
    countries: { code: string; name: string }[];
  }>(query);

  ok(Array.isArray(countries));
});

graphqlClient('client should be able to send a graphql query with variables', async () => {
  const url = 'https://countries.trevorblades.com/';
  const client = GraphQLClient(url);
  const query = gql`
    query getAllCountries($code: ID!) {
      country(code: $code) {
        code
        name
      }
    }
  `;
  const variables = { code: 'SE' };
  const { country } = await client.request<{
    country: { code: string; name: string };
  }>(query, variables);

  type(country, 'object');
});

graphqlClient.run();
