import React from "react";
import RegisterForm from "../components/RegisterForm";

interface Props {
  onGoLogin: () => void;
  onRegisterSuccess: () => void;
}

const RegisterPage: React.FC<Props> = ({ onGoLogin, onRegisterSuccess }) => {
  const handleRegister = (data: { username: string; email: string; password: string }) => {
    console.log("User registered:", data);
    // 🚀 Gọi API đăng ký ở đây, ví dụ:
    // await axios.post("/api/register", data)
    onRegisterSuccess(); // 👉 Sau khi đăng ký thành công thì chuyển sang HomePage
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <RegisterForm onSubmit={handleRegister} />
      <button onClick={onGoLogin} className="text-blue-500 underline mt-4">
        Đã có tài khoản? Đăng nhập
      </button>
    </div>
  );
};

export default RegisterPage;
