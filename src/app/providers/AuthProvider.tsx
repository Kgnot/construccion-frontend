import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  documentType: string | null;
  documentNumber: string | null;
}

type AuthContextType = {
    user: User | null;
    isAdmin: boolean;
    isAuthenticated: boolean;
    loading: boolean;
    setUser: (user: User | null) => void;
    setIsAdmin: (isAdmin: boolean) => void;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('auth');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setUser(parsed.user || null);
                setIsAdmin(parsed.isAdmin || false);
                setIsAuthenticated(true);
            } catch {
                localStorage.removeItem('auth');
            }
        }
        setLoading(false);
    }, []);

    return(
        <AuthContext.Provider 
            value={{ user, isAdmin, isAuthenticated, loading, setUser, setIsAdmin, setIsAuthenticated }}
        >
            {children}
        </AuthContext.Provider>
    )
}


export function useApp() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}