import { Products } from 'meteor/unchained:core-products';

export default {
  _id({ product, assignment }) {
    return `${product._id}:${Object.values(assignment.vector).join('-')}`;
  },
  vectors({ assignment, product }) {
    return Object.keys(assignment.vector || {}).map((key) => ({
      key,
      value: assignment.vector[key],
      product,
    }));
  },
  async product({ assignment }) {
    return Products.findProduct({ productId: assignment.productId });
  },
};
