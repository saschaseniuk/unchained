Package.describe({
  name: 'unchained:core-files',
  version: '0.60.0',
  summary: 'Unchained Engine Core: Files',
  git: 'https://github.com/unchainedshop/unchained',
  documentation: 'README.md',
});

Npm.depends({
  'fs-extra': '9.0.1',
  'isomorphic-unfetch': '3.1.0',
  'file-type': '16.2.0',
  mongodb: '3.6.3',
  '@reactioncommerce/random': '1.0.2',
});

Package.onUse((api) => {
  api.versionsFrom('1.12');
  api.use('webapp', 'server');
  api.use(['mongo', 'ecmascript'], ['client', 'server']);
  api.use('typescript');

  api.mainModule('core-files.ts');
  api.export('FilesCollection');
  api.use('unchained:core-settings@0.60.0');
});

Package.onTest((api) => {
  api.use('ecmascript');
  api.use('unchained:core-files');
  api.mainModule('core-files-tests.js');
});
