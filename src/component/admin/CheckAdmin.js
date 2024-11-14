import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {getJWT, useMyContext} from "../security/AuthProvider";


export function useCheckAdmin() {
    const navigate = useNavigate();
    useMyContext()
    useEffect(() => {
        const checkRoles = async () => {
            const token = getJWT("token");
            const response = await fetch('http://localhost:9090/api/user/checkShop', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
            });
            const roles = await response.text()
            if (roles) {
                if (!roles.includes('ROLE_ADMIN')) {
                    navigate("/login")
                }
            } else {
                navigate("/login")
            }

        };

        checkRoles();
    }, [navigate]);

}