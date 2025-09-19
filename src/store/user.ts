import { useCallback, useMemo, useState } from "react"
import * as authSrevice from '@/services/auth'

const AUTH_KEY = 'token';

export const useUserStore = () => {
  const [user, setUser] = useState<User | null>(null);

  const getUser = useCallback(() => {
    authSrevice.getUser().then(({ success, data }) => {
      if (!success) return;
      setUser(data);
    })
  }, [])

  const login = useCallback((email: string, password: string) => {
    return authSrevice.login({
      email,
      password
    }).then((res) => {
      if (!res.success) return;
      localStorage.setItem(AUTH_KEY, res.data.token);
      return res;
    })
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  }, []);

  const results = useMemo(() => ({
    user,
    login,
    logout,
    getUser
  }), [user, login, getUser, logout]);

  return results;
}


