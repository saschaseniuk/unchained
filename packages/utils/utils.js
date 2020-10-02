import Address from './address-schema';
import Contact from './contact-schema';
import * as schemaFields from './common-schema-fields';

export objectInvert from './object-invert';
export findPreservingIds from './find-preserving-ids';
export findUnusedSlug from './find-unused-slug';
export slugify from './slugify';

const Schemas = {
  ...schemaFields,
  Address,
  Contact,
};

export { Schemas };
