// Meanwhile there is not reproducible environment skip tests with admin permissions

import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export const maybeIt = Cypress.env('e2eUsername') && Cypress.env('e2ePassword') ? it : it.skip;

export const conditionalIt = (condition, ...rest) =>
  condition ? it.call(null, ...rest) : it.skip.call(null, ...rest);

conditionalIt.only = (condition, ...rest) =>
  condition ? it.only.call(null, ...rest) : it.skip.call(null, ...rest);

conditionalIt.skip = (condition, ...rest) => it.skip.call(null, ...rest);

export const getApolloClient = () => {
  const email = Cypress.env('e2eUsername');

  const password = Cypress.env('e2ePassword');

  const realmAppId = Cypress.env('realmAppId');

  const client = new ApolloClient({
    link: new HttpLink({
      uri: `https://services.cloud.mongodb.com/api/client/v2.0/app/${realmAppId}/graphql`,

      fetch: async (uri, options) => {
        options.headers.email = email;
        options.headers.password = password;

        return fetch(uri, options);
      },
    }),
    cache: new InMemoryCache(),
  });

  return client;
};
