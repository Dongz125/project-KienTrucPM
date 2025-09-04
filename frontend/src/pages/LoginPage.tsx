import React, { useState } from "react";

interface LoginForm {
  email: string;
  password: string;
}
interface Props {
  onGoRegister: () => void;
  onLoginSuccess: () => void;
}

const Login: React.FC<Props> = ({onGoRegister,onLoginSuccess}) => {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Giả lập gọi API login
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (form.email === "admin@example.com" && form.password === "123456") {
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
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? "Đang đăng nhập..." : "Login"}
        </button>
      </form>
      <button onClick={onGoRegister} className="text-blue-500 underline mt-2">
        Chưa có tài khoản? Đăng ký
      </button>
    </div>
  );
};

export default Login;
