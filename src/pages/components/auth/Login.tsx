import { useRouter } from "next/router";
import React, { useState } from "react";

function Login() {
    
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        console.log("Login successful");
        // const { username, fname, lname, level, depart } = await response.json();
        router.push("/components/link/loadingIndex");
      } else {
        console.log("Login failed");
        setLoginError(true);
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className={`left-0 right-0 z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto mt-5`}>
      <div className="relative w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="px-6 py-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
              กรุณาเข้าสู่ระบบ เพื่อเข้าใช้งาน
            </h3>
            <form className="space-y-6" action="#" onSubmit={handleLogin}>
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  รหัสพนักงาน (ตัวเลข 5 ตัว)
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  name="username"
                  id="username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  รหัสผ่าน
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  name="password"
                  id="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>
              {loginError && (
                <p className="mt-4 text-center text-red-500">
                  Invalid username or password
                </p>
              )}
              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                เข้าสู่ระบบ
              </button>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-300 text-center">
                <p>
                  ต้องการขอรหัสเข้าใช้งานระบบ <br /> กรุณาติดต่อเจ้าหน้าที่ IT
                  โทร
                  <span className="text-blue-700 dark:text-blue-500">
                    {" "}
                    4322,4323
                  </span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
