// pages/stock/depart/components/InputCardStock.tsx
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { StockData } from "./NameCardStock";
import axios from "axios";

export type InputCardStockProps = {
  username: string;
  remaining: number;
};

const InputCardStock: React.FC<InputCardStockProps> = ({
  username,
  remaining,
}) => {
  const router = useRouter();
  const { id } = router.query;
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [ref, setRef] = useState("");
  const [note, setNote] = useState("");

  const MAX_REF_LENGTH = 50;
  const MAX_NOTE_LENGTH = 50;
  const MAX_QUANTITY = 9999;

  const handleRefChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_REF_LENGTH) {
      setRef(value);
    }
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_NOTE_LENGTH) {
      setNote(value);
    }
  };

  // useEffect(() => {
  //   if (!username) {
  //     router.push("/");
  //   }
  // }, [router, username]);

  useEffect(() => {
    if (typeof id !== "string") {
      return;
    }

    // Fetch stock data from the API
    const fetchData = async () => {
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
    };

    fetchData();
  }, [id]);

  // if (!stockData) {
  //   return <div>Loading...</div>;
  // }

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setTimeout(() => {
      setAlertMessage(null);
    }, 3000); // Display the alert for 3 seconds (adjust as needed)
  };

  const handleReceiveSubmit = async () => {
    // Ensure quantity is not negative
    if (quantity < 1 || quantity > MAX_QUANTITY) {
      showAlert("Error: Quantity cannot be negative");
      return;
    }

    try {
      const response = await axios.post("/api/stock/rec", {
        id: stockData?.id,
        quantity: quantity,
        date: date,
        username: username,
        ref: ref,
        note: note,
        remaining: stockData?.remaining,
      });

      showAlert("Stock received successfully!"); // Show success message

      // Redirect to stock page
      router.push(`/stock/${id}`);
    } catch (error) {
      console.error("Error receiving stock:", error);
      showAlert("Error receiving stock. Please try again later."); // Show error message
    }
  };

  const handlePaySubmit = async () => {
    // Ensure quantity is not negative
    if (quantity < 1 || quantity > MAX_QUANTITY) {
      showAlert("Error: Quantity cannot be negative");
      return;
    }

    try {
      const response = await axios.post("/api/stock/pay", {
        id: stockData?.id,
        quantity: quantity,
        date: date,
        username: username,
        ref: ref,
        note: note,
        remaining: stockData?.remaining,
      });

      showAlert("Stock received successfully!"); // Show success message

      // Redirect to stock page
      router.push(`/stock/${id}`);
    } catch (error) {
      console.error("Error receiving stock:", error);
      showAlert("Error receiving stock. Please try again later."); // Show error message
    }
  };

  const isQuantityNegative = quantity <= 0;
  const isQuantityExceedMax = quantity > MAX_QUANTITY;

  return (
    <div>
      <div className="w-full max-w-sm p-2 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <form className="space-y-6" action="#">
          <h5 className="text-xl font-medium text-gray-900 dark:text-white">
            ลงบันทึก รับเข้า/จ่ายออก
          </h5>
          <div>
            <label
              htmlFor="quantity"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              ระบุจำนวนที่ต้องการ รับเข้าหรือจ่ายออก
            </label>
            <input
              type="number"
              name="quantity"
              required
              className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white ${
                isQuantityExceedMax ? "border-red-500" : ""
              }`}
            />
            {isQuantityNegative && (
              <p className="text-red-500 text-sm mt-1">
                กรุณาระบุจำนวนที่ต้องการ
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="ref"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              เอกสารอ้างอิง
            </label>
            <input
              type="text"
              name="ref"
              placeholder="ระบุเลขที่เอกสารอ้างอิง"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            />
          </div>
          <div>
            <label
              htmlFor="note"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              หมายเหตุ
            </label>
            <input
              type="text"
              name="note"
              placeholder="รายละเอียดเพิ่มเติม(ถ้ามี)"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            />
          </div>
          <div className="flex">
            <div className="flex-1 mr-2">
              <button
                className="w-full text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                รับเข้า
              </button>
            </div>
            <div className="flex-1">
              <button
                className="w-full text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                จ่ายออก
              </button>
            </div>
          </div>
        </form>
        {/* <form className="space-y-6" action="#">
          <h5 className="text-xl font-medium text-gray-900 dark:text-white">
            ลงบันทึก รับเข้า/จ่ายออก
          </h5>
          <div>
            <label
              htmlFor="quantity"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              ระบุจำนวนที่ต้องการ รับเข้าหรือจ่ายออก
            </label>
            <input
              type="number"
              name="quantity"
              value={quantity}
              required
              onChange={(e) => setQuantity(Number(e.target.value))}
              className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white ${
                isQuantityExceedMax ? "border-red-500" : ""
              }`}
            />
            {isQuantityExceedMax && (
              <p className="text-red-500 text-sm mt-1">
                จำนวนเกินกว่า {MAX_QUANTITY}
              </p>
            )}
            {isQuantityNegative && (
              <p className="text-red-500 text-sm mt-1">
                กรุณาระบุจำนวนที่ต้องการ
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="ref"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              เอกสารอ้างอิง
            </label>
            <input
              type="text"
              name="ref"
              value={ref}
              onChange={handleRefChange} // Use the custom handler
              placeholder="ระบุเลขที่เอกสารอ้างอิง"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            />
            {ref.length > MAX_REF_LENGTH && (
              <p className="text-red-500 text-sm mt-1">
                ความยาวเกินกว่า {MAX_REF_LENGTH} ตัวอักษร
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="note"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              หมายเหตุ
            </label>
            <input
              type="text"
              name="note"
              value={note}
              onChange={handleNoteChange} // Use the custom handler
              placeholder="รายละเอียดเพิ่มเติม(ถ้ามี)"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            />
            {note.length > MAX_NOTE_LENGTH && (
              <p className="text-red-500 text-sm mt-1">
                ความยาวเกินกว่า {MAX_NOTE_LENGTH} ตัวอักษร
              </p>
            )}
          </div>
          <div className="flex">
            <div className="flex-1 mr-2">
              <button
                onClick={handleReceiveSubmit}
                disabled={isQuantityNegative || isQuantityExceedMax} // Disable the button if quantity is negative or exceed max
                className="w-full text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                รับเข้า
              </button>
            </div>
            <div className="flex-1">
              <button
                onClick={handlePaySubmit}
                disabled={isQuantityNegative || isQuantityExceedMax} // Disable the button if quantity is negative or exceed max
                className="w-full text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                จ่ายออก
              </button>
            </div>
          </div>
        </form> */}
      </div>
    </div>
  );
};

export default InputCardStock;
