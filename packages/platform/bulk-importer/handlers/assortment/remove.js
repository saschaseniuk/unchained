import { Assortments } from 'meteor/unchained:core-filters';

export default async function removeAssortment(payload, { logger }) {
  const { _id } = payload;
  logger.debug('remove assortment');
  Assortments.remove({ _id });
}