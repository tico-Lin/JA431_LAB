import { useState } from 'react';

const TOKEN_KEY = 'github_pat_token';

export const useGitHubAuth = () => {
  const [token, setTokenState] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY);
  });

  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem(TOKEN_KEY, newToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    setTokenState(newToken);
  };

  return { token, setToken };
};
