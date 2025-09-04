import React from "react";
import RegisterForm from "../components/RegisterForm";

const RegisterPage: React.FC = () => {
  const handleRegister = (data: { username: string; email: string; password: string }) => {
    console.log("User registered:", data);
    // 🚀 Ở đây bạn gọi API đăng ký, ví dụ:
    // await axios.post("/api/register", data)
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <RegisterForm onSubmit={handleRegister} />
    </div>
  );
};

export default RegisterPage;
