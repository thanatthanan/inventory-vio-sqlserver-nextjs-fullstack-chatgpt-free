import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

type StockItem = {
  id: number;
  item_code: string;
  item_name: string;
  note: string;
  unit: string;
};

const StockEditPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [stockItem, setStockItem] = useState<StockItem | null>(null);
  const [item_code, setItemCode] = useState<string>("");
  const [item_name, setItemName] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [unit, setUnit] = useState<string>("");
  const [depart, setDepart] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/stock/${id}`);
        setStockItem(response.data);
        setItemCode(response.data.item_code);
        setItemName(response.data.item_name);
        setNote(response.data.note);
        setUnit(response.data.unit);

        // Get the value of 'depart' from the cookie
        const cookies = document.cookie.split("; ");
        const departCookie = cookies.find((cookie) => cookie.startsWith("depart="));
        if (departCookie) {
          const departValue = departCookie.split("=")[1];
          setDepart(departValue);
        }

      } catch (error) {
        console.error("Error fetching stock item:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/stock/edit", {
        id: stockItem?.id,
        item_code: item_code,
        item_name: item_name,
        note: note,
        unit: unit,
        depart: depart,
      });

      console.log(response.data); // Log the response from the API

      // Redirect to stock page
      router.push("/stock");
    } catch (error) {
      console.error("Error updating stock item:", error);
    }
  };

  if (!stockItem) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <Head>
        <title>แก้ไขข้อมูลสินค้า | ระบบคลังสินค้า</title>
      </Head>
      <div className="max-w-md mx-auto bg-white p-8 rounded shadow text-black">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold mb-6">แก้ไขข้อมูลสินค้า</h2>
          <Link href="/stock/">
            <button className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded">
              กลับ
            </button>
          </Link>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              รหัสสินค้า
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded-md py-2 px-4 w-full"
              value={item_code}
              onChange={(e) => setItemCode(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              ชื่อสินค้า
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded-md py-2 px-4 w-full"
              value={item_name}
              onChange={(e) => setItemName(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              หน่วยสินค้า
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded-md py-2 px-4 w-full"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              หมายเหตุ
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded-md py-2 px-4 w-full"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="flex justify-between mt-4">
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded w-full"
              type="submit"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default StockEditPage;
