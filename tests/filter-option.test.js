import {
  setupDatabase,
  createLoggedInGraphqlFetch,
  createAnonymousGraphqlFetch,
} from './helpers';
import { ADMIN_TOKEN } from './seeds/users';
import { MultiChoiceFilter } from './seeds/filters';

let connection;
let graphqlFetch;

describe('FilterOption', () => {
  beforeAll(async () => {
    [, connection] = await setupDatabase();
    graphqlFetch = await createLoggedInGraphqlFetch(ADMIN_TOKEN);
  });

  afterAll(async () => {
    await connection.close();
  });

  describe('mutation.createFilterOption for admin users should', () => {
    it('create filter option successfuly when passed valid filter ID', async () => {
      const {
        data: { createFilterOption },
      } = await graphqlFetch({
        query: /* GraphQL */ `
          mutation CreateFilterOption(
            $filterId: ID!
            $option: CreateFilterOptionInput!
          ) {
            createFilterOption(filterId: $filterId, option: $option) {
              _id
              updated
              created
              isActive
              texts {
                _id
              }
              type
              key
              options {
                _id
                texts {
                  _id
                  locale
                  title
                  subtitle
                }
                value
              }
            }
          }
        `,
        variables: {
          filterId: MultiChoiceFilter._id,
          option: {
            value: 'test-filter-option',
            title: 'test-filter-option-title',
          },
        },
      });

      expect(
        createFilterOption.options[createFilterOption.options.length - 1]._id,
      ).toEqual('multichoice-filter:test-filter-option');
    });

    it('return error when passed invalid filterId', async () => {
      const { errors } = await graphqlFetch({
        query: /* GraphQL */ `
          mutation CreateFilterOption(
            $filterId: ID!
            $option: CreateFilterOptionInput!
          ) {
            createFilterOption(filterId: $filterId, option: $option) {
              _id
            }
          }
        `,
        variables: {
          filterId: 'invalid-id',
          option: {
            value: 'test-filter-option',
            title: 'test-filter-option-title',
          },
        },
      });
      expect(errors.length).toEqual(1);
    });
  });

  describe('mutation.createFilterOption for anonymous users should', () => {
    it('return error', async () => {
      const graphqlAnonymousFetch = await createAnonymousGraphqlFetch();
      const { errors } = await graphqlAnonymousFetch({
        query: /* GraphQL */ `
          mutation CreateFilterOption(
            $filterId: ID!
            $option: CreateFilterOptionInput!
          ) {
            createFilterOption(filterId: $filterId, option: $option) {
              _id
            }
          }
        `,
        variables: {
          filterId: MultiChoiceFilter._id,
          option: {
            value: 'test-filter-option',
            title: 'test-filter-option-title',
          },
        },
      });
      expect(errors.length).toEqual(1);
    });
  });

  describe('mutation.removeFilterOption for admin users should', () => {
    it('remove filter option successfuly when passed valid filter ID', async () => {
      const {
        data: { removeFilterOption },
      } = await graphqlFetch({
        query: /* GraphQL */ `
          mutation RemoveFilterOption(
            $filterId: ID!
            $filterOptionValue: String!
          ) {
            removeFilterOption(
              filterId: $filterId
              filterOptionValue: $filterOptionValue
            ) {
              _id
              updated
              created
              isActive
              texts {
                _id
                locale
                title
                subtitle
              }
              type
              key
              options {
                _id
                value
              }
            }
          }
        `,
        variables: {
          filterId: MultiChoiceFilter._id,
          filterOptionValue: 'test-filter-option',
        },
      });
      expect(removeFilterOption.options.length).toEqual(3);
    });

    it('return error when passed invalid filter ID', async () => {
      const { errors } = await graphqlFetch({
        query: /* GraphQL */ `
          mutation RemoveFilterOption(
            $filterId: ID!
            $filterOptionValue: String!
          ) {
            removeFilterOption(
              filterId: $filterId
              filterOptionValue: $filterOptionValue
            ) {
              _id
            }
          }
        `,
        variables: {
          filterId: 'invalid-filter-id',
          filterOptionValue: 'test-filter-option',
        },
      });
      expect(errors.length).toEqual(1);
    });
  });

  describe('mutation.removeFilterOption for anonymous users should', () => {
    it('remove filter option successfuly when passed valid filter ID', async () => {
      const graphqlAnonymousFetch = await createAnonymousGraphqlFetch();
      const { errors } = await graphqlAnonymousFetch({
        query: /* GraphQL */ `
          mutation RemoveFilterOption(
            $filterId: ID!
            $filterOptionValue: String!
          ) {
            removeFilterOption(
              filterId: $filterId
              filterOptionValue: $filterOptionValue
            ) {
              _id
            }
          }
        `,
        variables: {
          filterId: MultiChoiceFilter._id,
          filterOptionValue: 'test-filter-option',
        },
      });
      expect(errors.length).toEqual(1);
    });
  });
});