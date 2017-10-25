/* eslint-disable global-require */
// https://github.com/postcss/postcss-import/issues/190#issuecomment-298078092
const { NodeJsInputFileSystem, ResolverFactory } = require('enhanced-resolve');
const webpackConfig = require('./webpack.config');

const resolver = ResolverFactory.createResolver({
  alias: webpackConfig.resolve.alias,
  extensions: ['.css'],
  modules: ['src', 'node_modules'],
  useSyncFileSystemCalls: true,
  fileSystem: new NodeJsInputFileSystem()
});

module.exports = {
  plugins: {
    'postcss-import': {
      resolve(id, basedir) {
        return resolver.resolveSync({}, basedir, id);
      }
    },
    'postcss-cssnext': { browsers: ['last 2 versions', 'ie 10-11', 'Safari >= 8'] },
    'precss': {},
  },
};
