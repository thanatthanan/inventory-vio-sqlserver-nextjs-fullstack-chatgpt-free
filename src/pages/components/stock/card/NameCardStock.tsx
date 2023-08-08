// pages/stock/depart/components/NameCardStock.tsx
import React, { useState, useEffect } from "react";

type Props = {
  id: string; 
};

export type StockData = {
  id: string;
  item_code: string;
  item_name: string;
  remaining: number;
  unit: string;
};

function NameCardStock() {
  // const NameCardStock: React.FC<Props> = ({ id }) => {
  const [stockData, setStockData] = useState<StockData | null>(null);

  // useEffect(() => {
  //   // Function to fetch data from the API
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(`/api/stock/${id}`);
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       const data: StockData = await response.json();
  //       setStockData(data);
  //     } catch (error) {
  //       console.error("Error fetching stock data:", error);
  //     }
  //   };

  //   fetchData();
  // }, [id]);

  // if (!stockData) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div>
      <div
        className="w-full max-w-sm p-2 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700"
      >
        <div>
        <p className="text-xs text-gray-700 dark:text-gray-400 mb-2">รหัสสินค้า :</p>
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            11155/15
          </h5>
          <hr className="mb-4"/>
          <p className="text-xs text-gray-700 dark:text-gray-400 mb-2">ชื่อสินค้า :</p>
          <p className="font-normal text-gray-700 dark:text-white">
            ตัวอย่างสินค้า
          </p>
        </div>
        <div className="flex items-baseline text-gray-900 dark:text-white mt-2">
          <span className="text-xl font-normal text-gray-500 dark:text-gray-400">
            คงเหลือ
          </span>
          <span className="text-5xl font-extrabold tracking-tight mx-2">
            12
          </span>
          <span className="text-3xl font-semibold">/อัน</span>
        </div>
      </div>
      {/* <div
        className="w-full max-w-sm p-2 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700"
      >
        <div>
        <p className="text-xs text-gray-700 dark:text-gray-400 mb-2">รหัสสินค้า :</p>
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {stockData.item_code}
          </h5>
          <hr className="mb-4"/>
          <p className="text-xs text-gray-700 dark:text-gray-400 mb-2">ชื่อสินค้า :</p>
          <p className="font-normal text-gray-700 dark:text-white">
            {stockData.item_name}
          </p>
        </div>
        <div className="flex items-baseline text-gray-900 dark:text-white mt-2">
          <span className="text-xl font-normal text-gray-500 dark:text-gray-400">
            คงเหลือ
          </span>
          <span className="text-5xl font-extrabold tracking-tight mx-2">
            {stockData.remaining}
          </span>
          <span className="text-3xl font-semibold">/{stockData.unit}</span>
        </div>
      </div> */}
    </div>
  );
}

export default NameCardStock;