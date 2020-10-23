import { buildLocaleContext } from 'meteor/unchained:core';
import getUserContext from './user-context';
import createGraphQLServer from './createGraphQLServer';
import createBulkImportServer from './createBulkImportServer';
import { configureRoles } from './roles';

export callMethod from './callMethod';
export hashPassword from './hashPassword';
export getConnection from './getConnection';
export getCart from './getCart';
export * as roles from './roles';
export * as acl from './acl';
export * as errors from './errors';

global._UnchainedAPIVersion = '0.54.0'; // eslint-disable-line

const defaultContext = (req) => {
  const remoteAddress =
    req.headers['x-real-ip'] ||
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  return { remoteAddress };
};

export const createContextResolver = (context) => async ({ req }) => {
  const userContext = await getUserContext(req);
  return {
    ...userContext,
    ...buildLocaleContext(req),
    ...context(req),
  };
};

const startUnchainedServer = (options) => {
  const { context = defaultContext, rolesOptions, ...apolloServerOptions } =
    options || {};

  configureRoles(rolesOptions);

  const apolloGraphQLServer = createGraphQLServer({
    ...apolloServerOptions,
    contextResolver: createContextResolver(context),
  });

  const bulkImportServer = createBulkImportServer({
    contextResolver: createContextResolver(context),
  });

  return {
    apolloGraphQLServer,
    bulkImportServer,
  };
};

export default startUnchainedServer;
