import { log } from 'meteor/unchained:core-logger';
import { Products } from 'meteor/unchained:core-products';
import { ProductNotFoundError, InvalidIdError } from '../../errors';

export default function addProductMedia(
  root,
  { media, productId, href, name, meta, tags },
  { userId }
) {
  log(`mutation addProductMedia ${productId}`, { userId });
  if (!productId) throw new InvalidIdError({ productId });
  const product = Products.findOne({ _id: productId });
  if (!product) throw new ProductNotFoundError({ productId });
  const productMedia = product.addMedia({
    rawFile: media,
    authorId: userId,
    href,
    name,
    meta,
    tags,
  });
  return productMedia;
}
