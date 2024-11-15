import React, {createContext, useState, useEffect, useContext} from 'react';

export const AuthContext = createContext();
export const getJWT = (name)=> {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

export const setJWT = ()=> {
    const token = localStorage.getItem('token');
    if (!token) return;
    document.cookie = `token=${token}; path=/;`;
}
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Thêm loading state
    useEffect(() => {
        try {
            const token = getJWT("token")
            if (!token) {
                setLoading(false);
                return;
            }
            const checkToken = async () => {
                const response = await fetch('http://localhost:9090/api/user/check', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                });
                if (!response.ok ) {
                    return null;
                } else {
                    const responseText = await response.text();
                    if (responseText !== "") {
                        const user = JSON.parse(responseText);
                        setUser(user)
                        setIsAuthenticated(true)
                        setLoading(false);
                    }
                }
            };
            if (token) {
                checkToken();
            }
        } catch (error) {
            console.error(error);
        }

    }, [isAuthenticated]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated,user, setUser,loading}}>
            {children}
        </AuthContext.Provider>
    );
};
export const useMyContext = () => {
    return useContext(AuthContext);
}