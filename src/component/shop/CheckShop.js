import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {getJWT, useMyContext} from "../security/AuthProvider";
import API_URL from "../../config";

export function useCheckShop() {
    const navigate = useNavigate();
    useMyContext()
    useEffect(() => {
        const checkRoles = async () => {
            const token = getJWT("token");
            const response = await fetch(`${API_URL}/api/user/checkShop`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
            });
            const roles = await response.text()
            if (roles) {
                if (!roles.includes('ROLE_SELLER')) {
                    navigate("/login")
                }
            } else {
                navigate("/login")
            }

        };

        checkRoles();
    }, [navigate]);

}