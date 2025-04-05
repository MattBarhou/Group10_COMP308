'use client';

import { ApolloProvider } from '@apollo/client';
import { Inter } from 'next/font/google';
import apolloClient from '@/lib/apollo-client';
import { AuthProvider } from './context/AuthContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloProvider client={apolloClient}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
