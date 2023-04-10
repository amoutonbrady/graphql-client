import { gql, GraphQLClient } from '..';
import { describe, it, expect, expectTypeOf } from 'vitest';

describe('graphql-client', () => {
  it('gql function should return a minified string', () => {
    const query = gql`
      query {
        # Test comment, this should be removed
        getAllMovies {
          title
        }
      }
    `;

    expect(query).toEqual(`query { getAllMovies { title } }`);
  });

  it('client should be able to send a graphql query', async () => {
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

    expectTypeOf(countries).toBeArray();
  });

  it('client should be able to send a graphql query with variables', async () => {
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

    expectTypeOf(country).toBeObject();
  });
});
