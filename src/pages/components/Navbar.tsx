import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

import LoginModal from "./auth/modal/LoginModal";
import LogoffModal from "./auth/modal/LogoffModal";

const Navbar: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isModalOpenLogoff, setIsModalOpenLogoff] = useState(false);
  const [isModalOpenLogin, setIsModalOpenLogin] = useState(false);

  useEffect(() => {
    // Get the value of 'username' from the cookie
    const cookies = document.cookie.split("; ");
    const usernameCookie = cookies.find((cookie) =>
      cookie.startsWith("username=")
    );
    if (usernameCookie) {
      const usernameValue = usernameCookie.split("=")[1];
      setUsername(usernameValue);
    }
  }, []);

  const handleLogout = () => {
    setIsModalOpenLogoff(true);
  };

  const handleModalToggleLogoff = () => {
    setIsModalOpenLogoff(!isModalOpenLogoff);
  };

  const confirmLogout = () => {
    // Clear the 'username' and 'level' cookies
    document.cookie =
      "username=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "level=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC;";

    // Redirect to login page
    router.push("/components/link/loadingIndex");
  };

  const handleLogin = () => {
    setIsModalOpenLogin(true);
  };

  const handleModalToggleLogin = () => {
    setIsModalOpenLogin(!isModalOpenLogin);
  };

  return (
    <div>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo_vih.svg" // path to your image from the "public" folder
              alt="Sample Image"
              width={30} // Set the width of the displayed image
              height={30} // Set the height of the displayed image
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white ml-4">
              ระบบบริหารจัดการคลังสินค้า
            </span>
          </Link>
          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <Link
                  href="/"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  หน้าหลัก
                </Link>
              </li>
              {username ? (
                <React.Fragment>
                  <li>
                    <p>User ID: {username}</p>
                  </li>
                  <li>
                    <button
                      onClick={handleModalToggleLogoff}
                      className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                      data-modal-toggle="logoff-modal"
                    >
                      ออกจากระบบ
                    </button>
                  </li>
                </React.Fragment>
              ) : (
                <li>
                  <button
                    onClick={handleLogin}
                    className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                    data-modal-toggle="login-modal"
                    data-modal-target="login-modal"
                  >
                    เข้าสู่ระบบ
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <hr />
      {/* modal login*/}
      <LoginModal
        isModalOpenLogin={isModalOpenLogin}
        handleModalToggleLogin={handleModalToggleLogin}
      />
      {/* modal logoff*/}
      <LogoffModal
        isModalOpenLogoff={isModalOpenLogoff}
        handleModalToggleLogoff={handleModalToggleLogoff}
        confirmLogout={confirmLogout}
      />
    </div>
  );
};

export default Navbar;
