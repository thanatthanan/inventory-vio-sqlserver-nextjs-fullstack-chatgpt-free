// index.tsx
import React, { useEffect, useState } from "react";
import { FaUser, FaThLarge, FaHistory, FaWarehouse } from "react-icons/fa";
import Link from "next/link";
import Head from "next/head";
import Layout from "./components/Layout";
import Login from "./components/auth/Login";

const IndexPage: React.FC = () => {
  const [level, setLevel] = useState<number>(0);
  const [username, setUsername] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [departname, setDepartName] = useState("");
  const [isModalOpenLogin, setIsModalOpenLogin] = useState(false);

  useEffect(() => {
    // Get the value of 'level' from the cookie
    const cookies = document.cookie.split("; ");
    const levelCookie = cookies.find((cookie) => cookie.startsWith("level="));
    if (levelCookie) {
      const levelValue = parseInt(levelCookie.split("=")[1]);
      setLevel(levelValue);
    }

    // Get the value of 'username' from the cookie
    const usernameCookie = cookies.find((cookie) =>
      cookie.startsWith("username=")
    );
    if (usernameCookie) {
      const usernameValue = usernameCookie.split("=")[1];
      setUsername(usernameValue);
    }

    // Get the value of 'fname' from the cookie
    const fnameCookie = cookies.find((cookie) => cookie.startsWith("fname="));
    if (fnameCookie) {
      const fnameValue = decodeURIComponent(fnameCookie.split("=")[1]);
      setFname(fnameValue);
    }

    // Get the value of 'lname' from the cookie
    const lnameCookie = cookies.find((cookie) => cookie.startsWith("lname="));
    if (lnameCookie) {
      const lnameValue = decodeURIComponent(lnameCookie.split("=")[1]);
      setLname(lnameValue);
    }

    // Get the value of 'depart' from the cookie
    const departNameCookie = cookies.find((cookie) =>
      cookie.startsWith("departname=")
    );
    if (departNameCookie) {
      const departNameValue = decodeURIComponent(
        departNameCookie.split("=")[1]
      );
      setDepartName(departNameValue);
    }
  }, []);

  const handleLogin = () => {
    setIsModalOpenLogin(true);
  };

  const handleModalToggleLogin = () => {
    setIsModalOpenLogin(!isModalOpenLogin);
  };

  return (
    <Layout>
      <Head>
        <title>หน้าแรก | ระบบคลังสินค้า</title>
      </Head>
      <div className="">
        <h1 className="text-2xl font-bold mb-4 text-center">
          ยินดีต้อนรับสู่ระบบบริหารจัดการคลังสินค้า
        </h1>
        {/* {username ? ( */}
          <div className="text-center">
            <p className="mb-4">
              {/* Lv.{level},  */}
              {/* คุณ {fname} {lname} หน่วยงาน {departname} */}
            </p>
          </div>
        {/* ) : ( */}
          <>
            {/* <Login /> */}
          </>
        {/* )} */}
        <div className="flex flex-wrap justify-center items-center">
          {/* {level === 1 && ( */}
            <Link href="/admin">
              <button className="menu-card-button bg-red-500 text-white rounded-lg p-4 m-2 w-64 h-64">
                <div className="flex flex-col items-center justify-center">
                  <FaUser size={32} />
                  <h2 className="text-xl">แอดมิน</h2>
                </div>
              </button>
            </Link>
          {/* )}
          {[1, 2, 3].includes(level) && ( */}
            <Link href="/stock">
              <button className="menu-card-button bg-green-500 text-white rounded-lg p-4 m-2 w-64 h-64">
                <div className="flex flex-col items-center justify-center">
                  <FaWarehouse size={32} />
                  <h2 className="text-xl">ลงบันทึกรับ-จ่ายสินค้าแยกคลัง</h2>
                </div>
              </button>
            </Link>
          {/* )}
          {[1, 2, 3, 4].includes(level) && ( */}
            <Link href="/history">
              <button className="menu-card-button bg-blue-500 text-white rounded-lg p-4 m-2 w-64 h-64">
                <div className="flex flex-col items-center justify-center">
                  <FaHistory size={32} />
                  <h2 className="text-xl">ประวัติการรับ-จ่ายสินค้าแยกคลัง</h2>
                </div>
              </button>
            </Link>
          {/* )} */}
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;
