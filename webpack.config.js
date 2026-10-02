const path = require('path');
const defaultConfig = require('@wordpress/scripts/config/webpack.config');

const rootNodeModules = path.resolve(__dirname, 'node_modules');

module.exports = {
    ...defaultConfig,
    entry: {
        'mega-menu': './assets/blocks/mega-menu/index.tsx',
        'mega-menu-item': './assets/blocks/mega-menu-item/index.tsx',
        'mega-menu-submenu': './assets/blocks/mega-menu-submenu/index.tsx',
        'menu-builder': './assets/blocks/menu-builder/index.tsx',
    },
    output: {
        path: path.resolve(__dirname, 'assets/dist'),
        filename: '[name]/index.js',
    },
    resolve: {
        ...defaultConfig.resolve,
        modules: [
            rootNodeModules,
            'node_modules'
        ]
    }
};
