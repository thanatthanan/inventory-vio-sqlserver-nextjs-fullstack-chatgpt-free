// stock/HistoryPage.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "@/pages/components/Layout";
import Head from "next/head";
import Link from "next/link";
import * as XLSX from "xlsx";

interface HistoryItem {
  rec_id: number;
  stock_id: number;
  quantity: number;
  remaining: number;
  type: string;
  username: string;
  date: string;
  datesave: string;
  item_name: string;
  item_code: string;
  ref: string;
  note: string;
  depart: number;
}

const HistoryPage = () => {
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [level, setLevel] = useState<number | null>(null);
  const [username, setUsername] = useState("");
  const [depart, setDepart] = useState("");
  const [departname, setDepartName] = useState("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const exportToExcel = () => {
    const dataToExport = filteredByDate.map((item) => ({
      รหัสสินค้า: item.item_code,
      ชื่อสินค้า: item.item_name,
      รับเข้า: item.type == "1" ? item.quantity : "-",
      จ่ายออก: item.type == "2" ? item.quantity : "-",
      คงเหลือ: item.remaining,
      ผู้บันทึก: item.username,
      เอกสารอ้างอิง: item.ref,
      หมายเหตุ: item.note,
      วันที่บันทึก: formatDate(item.datesave),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "History");

    // Create a buffer containing the Excel file
    const excelBuffer = XLSX.write(workbook, {
      type: "array",
      bookType: "xlsx",
    });

    // Save the buffer to a file and trigger the download
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stockhistory.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  };

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
  }, []);

  useEffect(() => {
    // Fetch data from the API
    const fetchHistory = async () => {
      try {
        const response = await axios.get("/api/stock/history");
        setHistoryList(response.data);
      } catch (error) {
        console.error("Error fetching history data:", error);
      }
    };
    fetchHistory();
  }, []);

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

  const handleDateRangeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    if (name === "startDate") {
      setStartDate(value);
    } else if (name === "endDate") {
      setEndDate(value);
    }
    setCurrentPage(1); // Reset pagination to the first page when changing the date range
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset pagination to the first page when searching
  };

  const filteredItems = historyList.filter(
    (item) =>
      item.item_code.includes(searchTerm) ||
      item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Apply date range filter if startDate and endDate are set
  const filteredByDate =
    startDate && endDate
      ? filteredItems.filter(
          (item) => item.date >= startDate && item.date <= endDate
        )
      : filteredItems;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredByDate.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination
  const totalPages = Math.ceil(filteredByDate.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  type PageNavigationProps = {
    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPrevPage: () => void;
  };

  const PageNavigation: React.FC<PageNavigationProps> = ({
    currentPage,
    totalPages,
    onNextPage,
    onPrevPage,
  }) => {
    const generatePageLinks = () => {
      const pageLinks = [];
      const maxPageLinks = 5; // Maximum number of displayed page links

      let startPage = Math.max(1, currentPage - Math.floor(maxPageLinks / 2));
      let endPage = Math.min(totalPages, startPage + maxPageLinks - 1);

      if (endPage - startPage + 1 < maxPageLinks) {
        startPage = Math.max(1, endPage - maxPageLinks + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageLinks.push(
          <li key={i}>
            <button
              className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 ${
                currentPage === i
                  ? "text-white bg-blue-600 hover:bg-blue-700"
                  : "bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              }`}
              onClick={() => setCurrentPage(i)}
            >
              {i}
            </button>
          </li>
        );
      }

      return pageLinks;
    };

    return (
      <nav
        className="flex items-center justify-between pt-4 py-2"
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          Showing{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {(currentPage - 1) * 10 + 1} -{" "}
            {Math.min(currentPage * 10, filteredItems.length)}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {filteredItems.length}
          </span>
        </span>
        <ul className="inline-flex -space-x-px text-sm h-8">
          <li>
            <button
              className="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={onPrevPage}
              disabled={currentPage === 1}
            >
              {"Previous"}
            </button>
          </li>
          {generatePageLinks()}
          <li>
            <button
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={onNextPage}
              disabled={currentPage === totalPages}
            >
              {"Next"}
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <Layout>
      <Head>
        <title>รายการรับ-จ่าย | ระบบคลังสินค้า</title>
      </Head>
      <div className="max-w-screen-xl mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">
          ประวัติการรับ-เบิกสินค้า คลัง{departname === "" ? "รวม" : departname}
        </h1>
        <div className="flex mb-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="ค้นหาจากรหัสสินค้าหรือชื่อสินค้า"
              className="p-2 border border-gray-300 rounded w-full text-black"
            />
          </div>
          <div className="flex-none ml-4">
            <label className="mr-2">ตั้งแต่:</label>
            <input
              type="date"
              name="startDate"
              value={startDate || ""}
              onChange={handleDateRangeChange}
              className="p-2 border border-gray-300 rounded text-black"
            />
            <label className="mx-2">ถึง:</label>
            <input
              type="date"
              name="endDate"
              value={endDate || ""}
              onChange={handleDateRangeChange}
              className="p-2 border border-gray-300 rounded text-black"
            />
          </div>
          <div className="flex-none ml-4">
            <button
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              onClick={exportToExcel}
            >
              export
            </button>
          </div>
          <div className="flex-none ml-4">
            <Link href="/">
              <button className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-md px-5 py-2.5 dark:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">
                กลับหน้าเดิม
              </button>
            </Link>
          </div>
        </div>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">รหัสสินค้า</th>
              <th className="border border-gray-300 p-2">ชื่อสินค้า</th>
              <th className="border border-gray-300 p-2">รับเข้า</th>
              <th className="border border-gray-300 p-2">จ่ายออก</th>
              <th className="border border-gray-300 p-2">คงเหลือ</th>
              <th className="border border-gray-300 p-2">ผู้บันทึก</th>
              <th className="border border-gray-300 p-2">เอกสารอ้างอิง</th>
              <th className="border border-gray-300 p-2">หมายเหตุ</th>
              <th className="border border-gray-300 p-2">วันที่บันทึก</th>
            </tr>
          </thead>
          <tbody>
              <tr>
                <td className="border border-gray-300 p-2 text-sm">
                  110011/11
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  ตัวอย่างสินค้า
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  10
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  -
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  10
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  เจ้าหน้าที่
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  4455/4
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  รับเข้าคลัง
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  8/8/66
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 text-sm">
                  110011/11
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  ตัวอย่างสินค้า
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  -
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  1
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  9
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  เจ้าหน้าที่
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  4455/4
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  รับเข้าคลัง
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  8/8/66
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 text-sm">
                  110011/11
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  ตัวอย่างสินค้า
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  -
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  2
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  7
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  เจ้าหน้าที่
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  4455/4
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  รับเข้าคลัง
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  8/8/66
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 text-sm">
                  110011/11
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  ตัวอย่างสินค้า
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  5
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  -
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  12
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  เจ้าหน้าที่
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  4455/4
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  รับเข้าคลัง
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  8/8/66
                </td>
              </tr>
          </tbody>
          {/* <tbody>
            {currentItems.map((item) => (
              <tr key={item.rec_id}>
                <td className="border border-gray-300 p-2 text-sm">
                  {item.item_code}
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  {item.item_name}
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  {item.type == "1" ? item.quantity : "-"}
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  {item.type == "2" ? item.quantity : "-"}
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  {item.remaining}
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  {item.username}
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  {item.ref}
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  {item.note}
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  {formatDate(item.datesave)}
                </td>
              </tr>
            ))}
          </tbody> */}
        </table>
        <div className="relative overflow-x-auto sm:rounded-lg">
          {/* ... (existing code) */}
          <PageNavigation
            currentPage={currentPage}
            totalPages={totalPages}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
          />
        </div>
      </div>
    </Layout>
  );
};

export default HistoryPage;
