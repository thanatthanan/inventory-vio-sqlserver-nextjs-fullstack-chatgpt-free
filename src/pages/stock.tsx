// pages/stock/depart.tsx
import { useEffect, useState } from "react";
import Layout from "./components/Layout";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Head from "next/head";
import ErrorPage from "./components/auth/ErrorPage";
import StockDeleteModal from "./components/stock/modal/StockDeleteModal";
import * as XLSX from "xlsx";

type StockItem = {
  id: number;
  item_code: string;
  item_name: string;
  remaining: number;
  depart: number;
  unit: string;
  type: string;
  note: string;
  date: string;
};

const StockPage: React.FC = () => {
  
  const router = useRouter();
  const [stockItems, setStockItems] = useState<StockItem[]>([]);

  const [level, setLevel] = useState<number | null>(null);
  const [username, setUsername] = useState("");
  const [depart, setDepart] = useState("");
  const [departname, setDepartName] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [itemsPerPage] = useState(6);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const exportToExcel = () => {
    // Filtered items based on the search term and date range
    const filteredItems = stockItems.filter(
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
  
    // Transform the data to export into the desired format
    const dataToExport = filteredByDate.map((item) => ({
      "รหัสสินค้า": item.item_code,
      "ชื่อสินค้า": item.item_name,
      "คงเหลือ": item.remaining,
      "หน่วย": item.unit,
      "หมายเหตุ": item.note,
    }));
  
    // Create a new workbook and add a worksheet with the data
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "StockData");
  
    // Generate the Excel file in binary form
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
  
    // Convert the binary data to a Blob and create a URL for download
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
  
    // Create a temporary anchor element to trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = "stock_data.xlsx";
    a.click();
  
    // Release the URL object
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    // Get the value of 'level' from the cookie
    const cookies = document.cookie.split("; ");
    const levelCookie = cookies.find((cookie) => cookie.startsWith("level="));
    if (levelCookie) {
      const levelValue = parseInt(levelCookie.split("=")[1]);
      setLevel(levelValue);
    
      if (![1, 2, 3].includes(levelValue)) {
        router.push("/");
      }
    }
    

    // check username
    // const usernameCookie = cookies.find((cookie) =>
    //   cookie.startsWith("username=")
    // );
    // if (usernameCookie) {
    //   const usernameValue = usernameCookie.split("=")[1];
    //   setUsername(usernameValue);
    // }else {
    //   router.push("/");
    // }
    

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
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/stock/depart");
        setStockItems(response.data);
      } catch (error) {
        console.error("Error fetching stock items:", error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (id: number) => {
    router.push(`/stock/edit?id=${id}`);
  };

  const handleTransaction = (id: number) => {
    router.push(`/stock/${id}`);
  };

  const handleDel = (id: number) => {
    setItemToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      if (itemToDeleteId !== null) {
        await axios.delete(`/api/stock/del/${itemToDeleteId}`);
        // Update the stockItems state after successful deletion
        const updatedStockItems = stockItems.filter(
          (item) => item.id !== itemToDeleteId
        );
        setStockItems(updatedStockItems);
      }
      // Close the delete modal
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting stock item:", error);
    }
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

  const filteredItems = stockItems.filter(
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
            {(currentPage - 1) * 6 + 1} -{" "}
            {Math.min(currentPage * 6, filteredItems.length)}
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
        <title>ตารางสินค้า | ระบบคลังสินค้า</title>
      </Head>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-w-screen-xl mx-auto p-4">
          <div className="flex justify-between items-center mb-4 mt-4">
            <h1 className="text-2xl font-bold">
              คลัง{departname === "" ? "รวม" : departname}
            </h1>
            <div className="flex justify-around">
              <div className="flex mr-2">
                <label htmlFor="table-search" className="sr-only">
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="table-search"
                    className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="ค้นหา รหัสสินค้า , ชื่อสินค้า"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
              {/* {level !== null && level < 3 && ( */}
                <div className="flex mr-2">
                  <Link href="/stock/add">
                    <button className="w-full text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                      เพิ่มสินค้า
                    </button>
                  </Link>
                </div>
              {/* )} */}
              <div className="flex mr-2">
                  <button className="w-full text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  onClick={exportToExcel}
                  >
                    export
                  </button>
              </div>
              <div className="flex">
                <Link href="/">
                  <button className="w-full text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    กลับหน้าเดิม
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-md text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  รหัสสินค้า
                </th>
                <th scope="col" className="px-6 py-3">
                  ชื่อสินค้า
                </th>
                <th scope="col" className="px-6 py-3">
                  คงเหลือ
                </th>
                <th scope="col" className="px-6 py-3">
                  หน่วย
                </th>
                <th scope="col" className="px-6 py-3">
                  หมายเหตุ
                </th>
                {/* {level !== null && level < 3 && ( */}
                  <th scope="col" className="px-6 py-3">
                    การจัดการ
                  </th>
                {/* )} */}
              </tr>
            </thead>
            <tbody>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td
                    scope="row"
                    className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <Link href="/stock/id"
                      className="font-bold rounded py-2 px-4 text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      1100555/44
                    </Link>
                  </td>
                  <td scope="col" className="px-2 py-4">
                    <Link href="/stock/id"
                      className="rounded py-2 px-4 text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      สินค้าตัวอย่าง
                    </Link>
                  </td>
                  <td scope="col" className="px-6 py-4">
                    10
                  </td>
                  <td scope="col" className="px-6 py-4">
                    อัน
                  </td>
                  <td scope="col" className="px-6 py-4">
                    ยอดยกมา
                  </td>
                    <td scope="col" className="px-6 py-4">
                      <div className="flex">
                        <button
                          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                        >
                          <span>
                            <FontAwesomeIcon icon={faEdit} className="fa-sm" />
                          </span>
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
                        >
                          <span>
                            <FontAwesomeIcon icon={faTrash} className="fa-sm" />
                          </span>
                        </button>
                      </div>
                    </td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td
                    scope="row"
                    className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <Link href="/stock/id"
                      className="font-bold rounded py-2 px-4 text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      1100555/44
                    </Link>
                  </td>
                  <td scope="col" className="px-2 py-4">
                    <Link href="/stock/id"
                      className="rounded py-2 px-4 text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      สินค้าตัวอย่าง
                    </Link>
                  </td>
                  <td scope="col" className="px-6 py-4">
                    10
                  </td>
                  <td scope="col" className="px-6 py-4">
                    อัน
                  </td>
                  <td scope="col" className="px-6 py-4">
                    ยอดยกมา
                  </td>
                    <td scope="col" className="px-6 py-4">
                      <div className="flex">
                        <button
                          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                        >
                          <span>
                            <FontAwesomeIcon icon={faEdit} className="fa-sm" />
                          </span>
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
                        >
                          <span>
                            <FontAwesomeIcon icon={faTrash} className="fa-sm" />
                          </span>
                        </button>
                      </div>
                    </td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td
                    scope="row"
                    className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <Link href="/stock/id"
                      className="font-bold rounded py-2 px-4 text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      1100555/44
                    </Link>
                  </td>
                  <td scope="col" className="px-2 py-4">
                    <Link href="/stock/id"
                      className="rounded py-2 px-4 text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      สินค้าตัวอย่าง
                    </Link>
                  </td>
                  <td scope="col" className="px-6 py-4">
                    10
                  </td>
                  <td scope="col" className="px-6 py-4">
                    อัน
                  </td>
                  <td scope="col" className="px-6 py-4">
                    ยอดยกมา
                  </td>
                    <td scope="col" className="px-6 py-4">
                      <div className="flex">
                        <button
                          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                        >
                          <span>
                            <FontAwesomeIcon icon={faEdit} className="fa-sm" />
                          </span>
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
                        >
                          <span>
                            <FontAwesomeIcon icon={faTrash} className="fa-sm" />
                          </span>
                        </button>
                      </div>
                    </td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td
                    scope="row"
                    className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <Link href="/stock/id"
                      className="font-bold rounded py-2 px-4 text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      1100555/44
                    </Link>
                  </td>
                  <td scope="col" className="px-2 py-4">
                    <Link href="/stock/id"
                      className="rounded py-2 px-4 text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      สินค้าตัวอย่าง
                    </Link>
                  </td>
                  <td scope="col" className="px-6 py-4">
                    10
                  </td>
                  <td scope="col" className="px-6 py-4">
                    อัน
                  </td>
                  <td scope="col" className="px-6 py-4">
                    ยอดยกมา
                  </td>
                    <td scope="col" className="px-6 py-4">
                      <div className="flex">
                        <button
                          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                        >
                          <span>
                            <FontAwesomeIcon icon={faEdit} className="fa-sm" />
                          </span>
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
                        >
                          <span>
                            <FontAwesomeIcon icon={faTrash} className="fa-sm" />
                          </span>
                        </button>
                      </div>
                    </td>
                </tr>
            </tbody>
            {/* <tbody>
              {currentItems.map((stockItem) => (
                <tr
                  key={stockItem.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td
                    scope="row"
                    className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <button
                      className="font-bold rounded py-2 px-4 text-blue-600 dark:text-blue-500 hover:underline"
                      onClick={() => handleTransaction(stockItem.id)}
                    >
                      {stockItem.item_code}
                    </button>
                  </td>
                  <td scope="col" className="px-2 py-4">
                    <button
                      className="rounded py-2 px-4 text-blue-600 dark:text-blue-500 hover:underline"
                      onClick={() => handleTransaction(stockItem.id)}
                    >
                      {stockItem.item_name}
                    </button>
                  </td>
                  <td scope="col" className="px-6 py-4">
                    {stockItem.remaining}
                  </td>
                  <td scope="col" className="px-6 py-4">
                    {stockItem.unit}
                  </td>
                  <td scope="col" className="px-6 py-4">
                    {stockItem.note}
                  </td>
                  {/* {level !== null && level < 3 && ( */}
                    {/* <td scope="col" className="px-6 py-4">
                      <div className="flex">
                        <button
                          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                          onClick={() => handleEdit(stockItem.id)}
                        >
                          <span>
                            <FontAwesomeIcon icon={faEdit} className="fa-sm" />
                          </span>
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
                          onClick={() => handleDel(stockItem.id)}
                        >
                          <span>
                            <FontAwesomeIcon icon={faTrash} className="fa-sm" />
                          </span>
                        </button>
                      </div>
                    </td> */}
                  {/* )} */}
                {/* </tr>
              ))}
            </tbody>} */}
          </table>
          <div className="relative overflow-x-auto sm:rounded-lg">
            <PageNavigation
              currentPage={currentPage}
              totalPages={totalPages}
              onNextPage={handleNextPage}
              onPrevPage={handlePrevPage}
            />
          </div>
        </div>
      {isDeleteModalOpen && itemToDeleteId !== null && (
        <StockDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirmed}
          itemIdToDelete={itemToDeleteId}
        />
      )}
    </Layout>
  );
};

export default StockPage;
