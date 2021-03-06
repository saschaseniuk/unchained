import { Users } from 'meteor/unchained:core-users';
import { Orders } from 'meteor/unchained:core-orders';
import { Countries } from 'meteor/unchained:core-countries';
import {
  UserNotFoundError,
  OrderNotFoundError,
  OrderWrongStatusError,
} from './errors';

export default async ({
  orderId,
  userId,
  user: userObject,
  countryContext,
}) => {
  if (orderId) {
    const order = Orders.findOrder({ orderId });
    if (!order) throw new OrderNotFoundError({ orderId });
    if (!order.isCart()) {
      throw new OrderWrongStatusError({ status: order.status });
    }
    return order;
  }
  const user = userObject || Users.findUser({ userId });
  if (!user) throw new UserNotFoundError({ userId });
  const cart = await user.cart({ countryContext });
  if (cart) return cart;

  return Orders.createOrder({
    user,
    currency: Countries.resolveDefaultCurrencyCode({
      isoCode: countryContext,
    }),
    countryCode: countryContext,
  });
};
