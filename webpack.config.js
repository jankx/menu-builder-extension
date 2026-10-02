const path = require('path');
const webpack = require('webpack');
const defaultConfig = require('@wordpress/scripts/config/webpack.config');

const rootNodeModules = path.resolve(__dirname, 'node_modules');

module.exports = {
    ...defaultConfig,
    resolve: {
        ...defaultConfig.resolve,
        alias: {
            '@wordpress/icons': path.join(rootNodeModules, '@wordpress/icons'),
            '@wordpress/components': path.join(rootNodeModules, '@wordpress/components'),
            '@wordpress/element': path.join(rootNodeModules, '@wordpress/element'),
            '@wordpress/i18n': path.join(rootNodeModules, '@wordpress/i18n'),
            '@wordpress/block-editor': path.join(rootNodeModules, '@wordpress/block-editor'),
            '@wordpress/blocks': path.join(rootNodeModules, '@wordpress/blocks'),
            '@wordpress/data': path.join(rootNodeModules, '@wordpress/data'),
        }
    }
};
