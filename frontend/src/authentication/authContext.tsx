import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface AuthContextProps {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
    children: ReactNode;
  }

const AuthContext = createContext<AuthContextProps | undefined>(undefined); //creating context

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const sessionTimeout = 3600000; //1 hour
  let timeout: NodeJS.Timeout;

  useEffect(() => {
    const token = localStorage.getItem('token');
    // const expiration = localStorage.getItem('sessionExpiration');
    console.log('useEffect called, token:', token);
    if (token) {
      const decoded = jwtDecode(token);
      console.log('Decoded token:', decoded);

      if (!isTokenExpired(token)) {
        setIsAuthenticated(true);
        console.log('Token is valid, set isAuthenticated to true');
    } 
      else {
      console.log('Token is expired');
      setIsAuthenticated(false);
      navigate('/login');
    }
  } 
    else {
    console.log('No token found');
    setIsAuthenticated(false);
    navigate('/login');
  }
}, [navigate, isAuthenticated]);

  const isTokenExpired = (token: string) => { //checks if token expired
    try{
    const decoded: any = jwtDecode(token);
    console.log('Token decoded:', decoded);
    console.log('Token decoded, exp:', decoded.exp);
    return decoded.exp * 1000 < Date.now();
    }
    catch(error){
      console.error('error decoding token: ', token);
      return true; // Assume token is expired if there's an error decoding it
    }
  };

  const login = (token: string) => {
    console.log('Login function called, token:', token);
    localStorage.setItem('token', token);   //temporary store token
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };


  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


