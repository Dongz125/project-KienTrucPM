import React, { useState } from "react";
import LoginForm from "../components/LoginForm";

interface Props {
  onGoRegister: () => void;
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<Props> = ({ onGoRegister, onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (data: { email: string; password: string }) => {
    setLoading(true);
    setError(null);

    try {
      // Giả lập gọi API login
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (data.email === "admin@example.com" && data.password === "123456") {
        alert("Login thành công");
        onLoginSuccess();
      } else {
        setError("Sai email hoặc password");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Có lỗi xảy ra, vui lòng thử lại");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
      <button onClick={onGoRegister} className="text-blue-500 underline mt-2">
        Chưa có tài khoản? Đăng ký
      </button>
    </div>
  );
};

export default LoginPage;
