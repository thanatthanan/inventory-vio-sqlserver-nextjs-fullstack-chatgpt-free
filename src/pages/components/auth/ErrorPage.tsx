import Link from "next/link";
import React, { useState } from "react";

import LoginModal from "./modal/LoginModal";

type Props = {};

export default function ErrorPage({}: Props) {
  const [isModalOpenLogin, setIsModalOpenLogin] = useState(false);

  const handleLogin = () => {
    setIsModalOpenLogin(true);
  };

  const handleModalToggleLogin = () => {
    setIsModalOpenLogin(!isModalOpenLogin);
  };

  return (
    <div>
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
            404
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
            ไม่สามารถเข้าถึงข้อมูลได้
          </p>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            หากต้องการใช้งาน ระบบจัดการคลังสินค้า
          </p>
          <button
            onClick={handleLogin}
            className="inline-flex text-blue bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-bold rounded-lg text-lg px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
          >
            กรุณาเข้าสู่ระบบ
          </button>
        </div>
      </div>
      <div className="">
        <LoginModal
          isModalOpenLogin={isModalOpenLogin}
          handleModalToggleLogin={handleModalToggleLogin}
        />
      </div>
    </div>
  );
}
