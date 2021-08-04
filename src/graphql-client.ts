import type nodeFetch from 'node-fetch';

interface Options {
  fetch?: typeof window.fetch | typeof nodeFetch;
  auth?: string;
}

/**
 * Create a new GraphQL client that hold the URL of the instance
 * and the authorization header if set later on.
 *
 * @param {string} url - Url of the graphql endpoint
 * @param {Options} options - Optional authorization header & fetch instance
 *
 * @example
 * ```ts
 * const client = GraphQLClient('https://localhost:4000/graphql');
 * const query = getQuery();
 *
 * client.request(query).then(console.log)
 * ```
 */
export function GraphQLClient(url: string, options: Options) {
  let authorization = options.auth || '';
  let headers = {};

  // This is from the awesome redaxios lib: https://github.com/developit/redaxios/blob/master/src/index.js#L196
  const fetchFunc = options.fetch || fetch;

  /**
   * Set headers. This merges the previous headers with the new one by default.
   *
   * @param {Record<string, string> newHeaders - The headers to set
   * @param {boolean} override - Whether to merge or override the previous headers
   *
   * @example
   * ```ts
   * const client = GraphQLClient('https://localhost:4000/graphql');
   * const query = getQuery();
   *
   * client.setHeaders({ Token: 'my-shiny-token' });
   *
   * client.request(query).then(console.log)
   * ```
   */
  const setHeaders = (newHeaders: Record<string, string>, override: boolean = false) => {
    headers = override ? newHeaders : { ...headers, ...newHeaders };
  };

  /**
   * Set the token to send to each request within the authorization header.
   *
   * @param {string} token - The token string
   *
   * @example
   * ```ts
   * const client = GraphQLClient(
   *   'https://localhost:4000/graphql',
   *   { auth: 'Bearer blabla', fetch: window.fetch }
   * );
   * const token = getTokenSomehow();
   * const query = getQuery();
   *
   * client.setAuth(`Bearer ${token}`);
   *
   * client.request(query).then(console.log)
   */
  const setAuth = (token: string) => (authorization = token);

  /**
   * Send a POST request with `fetch` and attach the authorization header if provided.
   *
   * @param {string} query - The query to send
   * @param {Record<string, any>} [variables] - Variables that goes with the query
   *
   * @returns {any} - The data from the graphql request
   * @throws {any} - The errors from the graphql request if any
   *
   * @example
   * ```ts
   * const client = GraphQLClient('https://jurassic.park/graphql');
   *
   * const query = gql`
   *  query getDinosaur($name: String!) {
   *   getDinosaur({ where: { name: $name } }) {
   *     name
   *     height
   *     speed
   *   }
   *  }
   * `;
   *
   * const variables = { name: 'Velociraptor' };
   *
   * client.request(query, variables).then(console.log)
   * // => { getDinosaur: { name: 'Velociraptor', height: 150, speed: 70 } }
   * ```
   */
  const request = <T = any>(query: string, variables?: Record<string, any>): Promise<T> => {
    return (fetchFunc as typeof fetch)(url, {
      method: 'POST',
      body: JSON.stringify({ query, variables }),
      headers: { authorization, 'content-type': 'application/json', ...headers },
    })
      .then((r) => r.json())
      .then(({ data, errors }) => {
        if (errors) throw errors;
        return data;
      });
  };

  return {
    request,
    setAuth,
    setHeaders,
  };
}

/**
 * This is a passthrough template literal function that helps with formatting
 * and also minify the query to reduce the request payload size.
 *
 * @param {TemplateStringsArray} query - The query
 *
 * @example
 * ```ts
 * const query = gql`
 *  query {
 *    getAllMovies {
 *      title
 *    }
 *  }
 * `;
 *
 * console.log(query) // query { getAllMovies { title } }
 * ```
 */
export const gql = (query: TemplateStringsArray) =>
  query
    .join(' ')
    .replace(/#.+\r?\n|\r/g, '')
    .replace(/\r?\n|\r/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
