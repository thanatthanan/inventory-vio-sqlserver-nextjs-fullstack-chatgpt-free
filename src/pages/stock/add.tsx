import { NextApiRequest, NextApiResponse } from "next";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Head from "next/head";

const StockAdd: React.FC = () => {
  const [item_code, setitem_code] = useState("");
  const [item_name, setitem_name] = useState("");
  const [note, setNote] = useState("");
  const [item_codeExists, setitem_codeExists] = useState(false);
  const [unit, setUnit] = useState("");
  const [remaining, setRemaining] = useState(0);
  const router = useRouter();
  const [level, setLevel] = useState<number | null>(null);
  const [departname, setDepartName] = useState("");
  const [depart, setDepart] = useState("");

  useEffect(() => {
    // Get the value of 'level' from the cookie
    const cookies = document.cookie.split("; ");
    // Get the value of 'depart' from the cookie
    const departCookie = cookies.find((cookie) => cookie.startsWith("depart="));
    if (departCookie) {
      const departValue = departCookie.split("=")[1];
      setDepart(departValue);
    }

    // Get the value of 'departname' from the cookie
    const departNameCookie = cookies.find((cookie) =>
      cookie.startsWith("departname=")
    );
    if (departNameCookie) {
      const departNameValue = decodeURIComponent(
        departNameCookie.split("=")[1]
      );
      setDepartName(departNameValue);
    }

    const levelCookie = cookies.find((cookie) => cookie.startsWith("level="));
    if (levelCookie) {
      const levelValue = parseInt(levelCookie.split("=")[1]);
      setLevel(levelValue);
    }
  }, []);

  const MAX_ITEM_CODE_LENGTH = 50;
  const MAX_ITEM_NAME_LENGTH = 50;
  const MAX_NOTE_LENGTH = 50;
  const MAX_UNIT_LENGTH = 50;

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if item_code exceeds maximum length
    if (item_code.length > MAX_ITEM_CODE_LENGTH) {
      console.log("Item code exceeds maximum length");
      return;
    }

    // Check if item_name exceeds maximum length
    if (item_name.length > MAX_ITEM_NAME_LENGTH) {
      console.log("Item name exceeds maximum length");
      return;
    }

    // Check if note exceeds maximum length
    if (note.length > MAX_NOTE_LENGTH) {
      console.log("Note exceeds maximum length");
      return;
    }

    // Check if unit exceeds maximum length
    if (unit.length > MAX_UNIT_LENGTH) {
      console.log("Unit exceeds maximum length");
      return;
    }

    try {
      const checkitem_codeResponse = await fetch("/api/stock/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item_code: item_code,
        }),
      });

      const data = await checkitem_codeResponse.json();

      if (data.exists) {
        console.log("Item code already exists");
        setitem_codeExists(true);
        setitem_code("");
        return;
      }
    } catch (error) {
      console.error("Error checking item code:", error);
    }

    try {
      const response = await fetch("/api/stock/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item_code: item_code,
          item_name: item_name,
          note: note,
          unit: unit,
          remaining: remaining,
          depart: depart,
        }),
      });

      if (response.ok) {
        console.log("Stock item added successfully");
        setitem_code("");
        setitem_name("");
        setNote("");
        setUnit("");
        // setStore('1');
        setRemaining(0); // Reset the remaining field to 0
        setTimeout(() => {
        }, 3000);
        router.push("/stock");
      } else {
        console.log("Failed to add stock item");
      }
    } catch (error) {
      console.error("Error adding stock item:", error);
    }
  };

  return (
    <Layout>
      <Head>
        <title>เพิ่มข้อมูลสินค้า | ระบบคลังสินค้า</title>
      </Head>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-4 max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4 mt-4">
          <h1 className="text-2xl font-bold">เพิ่มสินค้า</h1>
          <Link href="/stock">
            <button className="w-full text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              กลับ
            </button>
          </Link>
        </div>
        <form onSubmit={handleAddStock}>
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="text"
              name="item_code"
              id="item_code"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              value={item_code}
              onChange={(e) => {
                setitem_code(e.target.value);
                setitem_codeExists(false);
              }}
              placeholder=" "
              required
            />
            <label
              htmlFor="item_code"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transhtmlForm -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              รหัสสินค้า
            </label>
            {item_code.length > MAX_ITEM_CODE_LENGTH && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                ขนาดเกิน {MAX_ITEM_CODE_LENGTH} ตัวอักษร
              </p>
            )}
            {item_codeExists && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                <span className="font-medium">ขออภัย !</span>{" "}
                รหัสสินค้านี้มีอยู่แล้ว!
              </p>
            )}
          </div>
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="text"
              name="item_name"
              id="item_name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              value={item_name}
              onChange={(e) => setitem_name(e.target.value)}
              placeholder=" "
              required
            />
            <label
              htmlFor="item_name"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transhtmlForm -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              ชื่อสินค้า
            </label>
            {item_name.length > MAX_ITEM_NAME_LENGTH && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                ขนาดเกิน {MAX_ITEM_NAME_LENGTH} ตัวอักษร
              </p>
            )}
          </div>
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="text"
              name="item_name"
              id="item_name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder=" "
              required
            />
            <label
              htmlFor="item_name"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transhtmlForm -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              หน่วยสินค้า
            </label>
            {unit.length > MAX_UNIT_LENGTH && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                ขนาดเกิน {MAX_UNIT_LENGTH} ตัวอักษร
              </p>
            )}
          </div>
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="text"
              name="unit"
              id="unit"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <label
              htmlFor="unit"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transhtmlForm -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              หมายเหตุ
            </label>
            {note.length > MAX_NOTE_LENGTH && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                ขนาดเกิน {MAX_NOTE_LENGTH} ตัวอักษร
              </p>
            )}
          </div>
          <input
            type="hidden"
            id="remaining"
            value="0"
            onChange={(e) => setRemaining(Number(e.target.value))}
          />
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            บันทึกข้อมูล
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default StockAdd;
