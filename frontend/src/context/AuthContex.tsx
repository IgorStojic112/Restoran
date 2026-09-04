import { User } from "lucide-react";
import {createContext, useContext, useEffect, useState, type ReactNode} from "react"

export interface User {
    id: number;
    username: string;
    email: string;
    // profileImage: string;
}

interface AuthResponse {
    token: string;
    message: string;
}

interface ErrorResponse{
    error: string | string[]
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<AuthResponse>;
    register: (
        username: string,
        email: string,
        password: string
    ) => Promise<AuthResponse>;
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE = "http://localhost:8000/accounts";


export function AuthProvider({ children } : { children: ReactNode }) {
    const [user, setUser] = useState<User | null> (null);
    const [token, setToken] = useState<string | null> (() => 
        localStorage.getItem("authToken")    
    );

    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        console.log("useEffect ran, token is:", token); // sss
        
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }
    

    fetch(`${API_BASE}/userinfo/`,{
        headers: {Authorization: `Token ${token}`},
    })
        .then((res) => {
            console.log("user_info response status:", res.status); // sss
            if (!res.ok) throw new Error("Invaled token");
            return res.json() as Promise<User>
        })
        .then((data) => {
            console.log("user_info data:", data); 
            setUser(data)
        })
        .catch((err) => {
            console.log("user_info fetch failed:", err);
            setUser(null);
            setToken(null);
            localStorage.removeItem("authToken");
        })
        .finally(() => setLoading(false));
    }, [token]);


    const login = async (
        username: string,
        password: string
    ): Promise<AuthResponse> => {
        const res = await fetch(`${API_BASE}/login/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
    const data: AuthResponse | ErrorResponse = await res.json();
    
    if(!res.ok){
        const err = data as ErrorResponse;
        throw new Error(
            Array.isArray(err.error) ? err.error.join(", ") : err.error
        );
    }
    
    const success = data as AuthResponse;
    localStorage.setItem("authToken", success.token);
    setToken(success.token);
    return success;

    }

    const register = async(
        username:string,
        email: string,
        password: string
    ) : Promise<AuthResponse> => {
        const res = await fetch(`${API_BASE}/register/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        const data: AuthResponse | ErrorResponse = await res.json();
        if(!res.ok) {
            const err = data as ErrorResponse;
            throw new Error(
                Array.isArray(err.error) ? err.error.join(", "): err.error
            );
        }

        const success = data as AuthResponse;
        localStorage.setItem("authToken", success.token);
        setToken(success.token);
        return success;
    };

    const logout = async(): Promise<void> => {
        if(token){
            await fetch(`${API_BASE}/logout/`, {
                method: "POST",
                headers: { Authorization: `Token ${token}` },
            }).catch(() => {});
        }
        localStorage.removeItem("authToken");
        setToken(null);
        setUser(null);
    }

    return (
    
        <AuthContext.Provider
            value={{ user, token, loading, login, register, logout }}
        >
            {children}
        </AuthContext.Provider>
        
        );
        

}

export function useAuth(): AuthContextType{
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
