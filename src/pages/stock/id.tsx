// pages/stock/depart/[id].tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Cookies from "js-cookie";

import Layout from "@/pages/components/Layout";
import HeadCardStock from "../components/stock/card/HeadCardStock";
import ListCardStock from "../components/stock/card/ListCardStock";
import NameCardStock, { StockData } from "../components/stock/card/NameCardStock";
import InputCardStock, { InputCardStockProps } from "../components/stock/card/InputCardStock";

type Props = {};

const DepartId: React.FC<Props> = (props) => {
  const router = useRouter();
  const { id } = router.query;
  const [username, setUsername] = useState(Cookies.get("username") || "");
  const [stockData, setStockData] = useState<StockData | null>(null);

  useEffect(() => {
    fetchData(); // Always fetch the data, regardless of the condition

    async function fetchData() {
      if (typeof id !== "string") {
        // Handle the case when the id is not a string (e.g., undefined or an array)
        return;
      }

      try {
        const response = await fetch(`/api/stock/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: StockData = await response.json();
        setStockData(data);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    }
  }, [id]);

  // if (typeof id !== "string") {
  //   return <div>Loading...</div>;
  // }

  const inputCardStockProps: InputCardStockProps = {
    username,
    remaining: stockData?.remaining || 0,
  };

  return (
    <Layout>
      <Head>
        <title>รายละเอียดสินค้า | ระบบคลังสินค้า</title>
      </Head>
      <div className="relative overflow-x-auto sm:rounded-lg max-w-screen-xl mx-auto p-4">
        <div className="mb-4">
          <HeadCardStock />
        </div>
        {/* <p>ผู้บันทึกข้อมูล : {username}, id : {id}, คงเหลือ : {stockData?.remaining}</p> */}
        <div className="flex">
          <div className="flex-1 mr-4">
            <ListCardStock />
            {/* <ListCardStock id={id} /> */}
          </div>
          <div className="flex-2">
            <div>
              <NameCardStock />
              {/* <NameCardStock id={id} /> */}
            </div>
            <div className="mt-4">
              <InputCardStock {...inputCardStockProps} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DepartId;
