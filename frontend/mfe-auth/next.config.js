const { NextFederationPlugin } = require('@module-federation/nextjs-mf');

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config, options) {
        config.plugins.push(
            new NextFederationPlugin({
                name: 'mfe_auth',
                filename: 'static/chunks/remoteEntry.js',
                exposes: {
                    './AuthPage': './pages/page.js',
                    './AuthProvider': './pages/context/AuthContext.js',
                    './apolloClient': './lib/apollo-client.js',
                },
                shared: {
                    react: {
                        singleton: true,
                        requiredVersion: false,
                    },
                    'react-dom': {
                        singleton: true,
                        requiredVersion: false,
                    },
                    '@apollo/client': {
                        singleton: true,
                        requiredVersion: false,
                    },
                },
            })
        );

        return config;
    },
};

module.exports = nextConfig;
