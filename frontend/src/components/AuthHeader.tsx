import { useEffect, useState } from "react";

export default function AuthHeader() {
  const [user, setUser] = useState<
    | {
        id: number;
        email: string;
        full_name: string;
      }
    | undefined
  >(undefined);

  useEffect(() => {
    const u = window.localStorage.getItem("user");
    if (u && JSON.parse(u)) {
      setUser(JSON.parse(u));
    }
  }, []);

  return (
    <header className="px-6 py-2 flex items-center justify-center">
      {user ? (
        <p>
          Hello {user.full_name} at {user.email}
        </p>
      ) : (
        <p>Not logged in</p>
      )}
    </header>
  );
}
