// pages/stock/depart/components/ListCardStock.tsx
import React, { useEffect, useState } from "react";

type StockHistory = {
  id: number;
  quantity: number;
  type: string;
  username: string;
  datesave: string;
  remaining: number;
  ref: string;
};

type Props = {
  id: string; // Add the prop for the stock ID
};

const formatDate = (date: string) => {
  // Parse the original date and add 7 hours to it
  const parsedDate = new Date(date);
  parsedDate.setHours(parsedDate.getHours() - 7);

  // Format the adjusted date and time
  const options: Intl.DateTimeFormatOptions = {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  return parsedDate.toLocaleDateString("th-TH", options);
};

function ListCardStock() {
  // export default function ListCardStock({ id }: Props) {
  const [stockHistory, setStockHistory] = useState<StockHistory[]>([]);

  // useEffect(() => {
  //   const fetchStockHistory = async () => {
  //     try {
  //       const response = await fetch(`/api/stock/history/${id}`);
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       const data = await response.json();
  //       setStockHistory(data);
  //     } catch (error) {
  //       console.error("Error fetching stock history:", error);
  //     }
  //   };
  //   fetchStockHistory();
  // }, [id]);

  const limitedStockHistory = stockHistory.slice(0, 12); // Slice the first 10 items

  return (
    <div>
      <div className="w-full max-w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 dark:bg-gray-800 dark:border-gray-700">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                วันที่บันทึก
              </th>
              <th scope="col" className="px-6 py-3">
                รับเข้า
              </th>
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                จ่ายออก
              </th>
              <th scope="col" className="px-6 py-3">
                คงเหลือ
              </th>
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                ผู้บันทึก
              </th>
              <th scope="col" className="px-6 py-3">
                เอกสารอ้างอิง
              </th>
            </tr>
          </thead>
          <tbody>
              <tr
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                >
                  8/8/66
                </th>
                <td className="px-6 py-4">
                  7
                </td>
                <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                  -
                </td>
                <td className="px-6 py-4">
                  15
                </td>
                <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                  เจ้าหน้าที่
                </td>
                <td className="px-6 py-4">555/41</td>
              </tr>
              <tr
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                >
                  8/8/66
                </th>
                <td className="px-6 py-4">
                  -
                </td>
                <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                  2
                </td>
                <td className="px-6 py-4">
                  8
                </td>
                <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                  เจ้าหน้าที่
                </td>
                <td className="px-6 py-4">555/41</td>
              </tr>
              <tr
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                >
                  8/8/66
                </th>
                <td className="px-6 py-4">
                  -
                </td>
                <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                  3
                </td>
                <td className="px-6 py-4">
                  10
                </td>
                <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                  เจ้าหน้าที่
                </td>
                <td className="px-6 py-4">555/41</td>
              </tr>
              <tr
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                >
                  8/8/66
                </th>
                <td className="px-6 py-4">
                  2
                </td>
                <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                  -
                </td>
                <td className="px-6 py-4">
                  13
                </td>
                <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                  เจ้าหน้าที่
                </td>
                <td className="px-6 py-4">555/41</td>
              </tr>
              <tr
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                >
                  8/8/66
                </th>
                <td className="px-6 py-4">
                  1
                </td>
                <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                  -
                </td>
                <td className="px-6 py-4">
                  11
                </td>
                <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                  เจ้าหน้าที่
                </td>
                <td className="px-6 py-4">555/41</td>
              </tr>
          </tbody>
          {/* <tbody>
            {limitedStockHistory.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                >
                  {formatDate(item.datesave)}
                </th>
                <td className="px-6 py-4">
                  {item.type == "1" ? item.quantity : "-"}
                </td>
                <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                  {item.type == "2" ? item.quantity : "-"}
                </td>
                <td className="px-6 py-4">
                  {item.remaining}
                </td>
                <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                  {item.username}
                </td>
                <td className="px-6 py-4">{item.ref}</td>
              </tr>
            ))}
          </tbody> */}
        </table>
      </div>
    </div>
  );
}

export default ListCardStock;
