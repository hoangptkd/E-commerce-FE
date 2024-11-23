import {useState} from 'react';
import {Lock, UserIcon} from 'lucide-react';
import {useNavigate} from "react-router-dom";
import API_URL from "../../config";
const LoginShop = () => {


    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch(`${API_URL}/api/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password}),
            });
            if (!response.ok) {
                throw new Error('Login failed');
            }
            const token = await response.text();
            if (token.includes("Login failed")) {
                throw new Error('Login failed');
            } else {

                localStorage.setItem("token", token);
                navigate("/shop")
            }

        } catch (err) {
            setError('Invalid username or password');
            console.error('Login error:', err);
        }

    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Đăng nhập</h2>
                    <p className="text-gray-600 mt-2">Vui lòng đăng nhập để tiếp tục</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <div className="flex items-center border-2 rounded-lg px-3 py-2">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full pl-3 outline-none text-gray-700"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center border-2 rounded-lg px-3 py-2">
                            <Lock className="h-5 w-5 text-gray-400" />
                            <input
                                type="password"
                                placeholder="Mật khẩu"
                                className="w-full pl-3 outline-none text-gray-700"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="remember"
                                className="h-4 w-4 text-blue-600"
                            />
                            <label htmlFor="remember" className="ml-2 text-gray-600">
                                Ghi nhớ đăng nhập
                            </label>
                        </div>
                        <a href="#" className="text-blue-600 hover:underline">
                            Quên mật khẩu?
                        </a>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
                    >
                        Đăng nhập
                    </button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-gray-600">
                        <a href="#" className="text-blue-600 hover:underline">
                            Đăng ký Shop
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginShop;