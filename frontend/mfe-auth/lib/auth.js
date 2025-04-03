import {gql} from '@apollo/client';
import {useRouter} from 'next/navigation';

// GraphQL Queries and Mutations
export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        username
        email
        role
        profileImage
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        username
        email
        role
        profileImage
      }
    }
  }
`;

export const CURRENT_USER_QUERY = gql`
  query GetCurrentUser {
    getCurrentUser {
      id
      username
      email
      role
      profileImage
      bio
      location
      createdAt
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      username
      email
      bio
      location
      profileImage
    }
  }
`;

// Auth helper functions
export const setAuthToken = (token) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
    }
};

export const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

export const removeAuthToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
    }
};

export const isAuthenticated = () => {
    return !!getAuthToken();
};

// Custom hook for authentication
export const useAuth = () => {
    const router = useRouter();

    const login = (token, user) => {
        setAuthToken(token);
        // Optionally store minimal user data
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify({
                id: user.id,
                username: user.username,
                role: user.role
            }));
        }
    };

    const logout = () => {
        removeAuthToken();
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
        }
        router.push('/auth/login');
    };

    const getUser = () => {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                return JSON.parse(userStr);
            }
        }
        return null;
    };

    return {login, logout, isAuthenticated, getAuthToken, getUser};
};