<img alt="preview badge" src="https://img.shields.io/bundlephobia/min/@amoutonbrady/graphql-client">

# Graphql Client

The most minimal graphql client you'll ever find

Features:

- Typescript ready: written in Typescript
- Fully tested: literally 3 functions
- Minimal footprint: 30 loc, [~800 bytes minified](https://bundlephobia.com/result?p=@amoutonbrady/graphql-client@0.0.2)
- No BS cache or w/e, ask data and you shall receive

## Installation

```bash
$ npm i @amoutonbrady/graphql-client
```

## Usage

```ts
import { GraphQLClient, gql } from '@amoutonbrady/graphql-client';

// A function that creates a client
// You can pass a token a second parameter
const client = GraphQLClient('https://jurassic.park/graphql');

// You can also provide your own fetch if you want to
// const client = GraphQLClient('https://jurassic.park/graphql', { fetch: require('node-fetch') });
const token = getToken();

// You can set a bearer token after wards
client.setAuth(`Bearer ${token}`);

// You can set abitrary headers
client.setHeaders({ Token: token });

// gql is just a pass through that minify the string for leaner payload
const query = gql`
 query getDinosaur($name: String!) {
  getDinosaur({ where: { name: $name } }) {
    name
    height
    speed
  }
 }
`;

// This needs to mimic what you send to the query above
const variables = { name: 'Velociraptor' };

// This will return the `data` property of the graphql response or throw if `errors` is present
client.request(query, variables).then(console.log).catch(console.error);
// => { getDinosaur: { name: 'Velociraptor', height: 150, speed: 70 } }
```
