Package.describe({
  name: 'unchained:core-documents',
  version: '0.55.4',
  summary: 'Unchained Engine Core: Documents',
  git: 'https://github.com/unchainedshop/unchained',
  documentation: 'README.md',
});

Package.onUse((api) => {
  api.versionsFrom('1.11.1');
  api.use('ecmascript');
  api.use('http');
  api.use('unchained:utils@0.55.4');
  api.use('unchained:core-logger@0.55.4');

  api.mainModule('documents.js', 'server');
});

Package.onTest((api) => {
  api.use('ecmascript');
  api.use('unchained:core-documents');
  api.mainModule('documents-tests.js');
});
