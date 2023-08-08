import React from "react";
import Link from "next/link";

type Props = {};

export default function HeadCardStock({}: Props) {
  return (
    <div className="flex justify-between">
      <div>
        <h1 className="flex items-center text-3xl font-extrabold dark:text-white">
          รายละเอียดการรับจ่ายสินค้า
          {/* <span className="bg-blue-100 text-blue-800 text-1xl font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-2">
            คลัง
          </span> */}
        </h1>
      </div>
      <div>
        <Link href="/stock">
          <button className="w-full text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
            กลับหน้าเดิม
          </button>
        </Link>
      </div>
    </div>
  );
}
