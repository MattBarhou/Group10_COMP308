/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;

// const { withModuleFederation } = require('@module-federation/nextjs-mf');
//
// module.exports = withModuleFederation({
//     name: 'host-app',
//     remotes: {
//         mfeAuth: 'mfe-auth@http://localhost:3001/_next/static/chunks/remoteEntry.js',
//         mfeBusinessEvents: 'mfe-business-events@http://localhost:3002/_next/static/chunks/remoteEntry.js',
//         mfeCommunity: 'mfe-comunity@http://localhost:3003/_next/static/chunks/remoteEntry.js'
//     },
//     shared: {
//         react: {
//             singleton: true,
//             requiredVersion: '^18.0.0',
//         },
//         'react-dom': {
//             singleton: true,
//             requiredVersion: '^18.0.0',
//         },
//         // Add other shared dependencies if we need
//     },
//     webpack(config) {
//         return config;
//     },
// });


