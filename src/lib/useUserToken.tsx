import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  role: string;
  // Add other properties as needed
}

const useUserToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const user = Cookies.get('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      setToken(parsedUser.token);

      try {
        const decoded: DecodedToken = jwtDecode(parsedUser.token);
        setRole(decoded.role);
      } catch (error) {
        console.error('Failed to decode token', error);
      }
    }
  }, []);

  return { token, role };
};

export default useUserToken;
