import React, { useEffect, useState } from "react";
import axios from "axios";
import DepartAddModal from "./modal/depart/DepartAddModal";
import DepartEditModal from "./modal/depart/DepartEditModal";

interface Depart {
  id: number;
  depart: number;
  depart_name: string;
  div: number;
  div_name: string;
  date: string;
}

const ListDepart: React.FC = () => {

  const [depart, setDepart] = useState<Depart[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [isModalOpenAddDepart, setIsModalOpenAddDepart] = useState(false);
  const [isModalOpenEditDepart, setIsModalOpenEditDepart] = useState(false);
  const [selectedDepartData, setSelectedDepartData] = useState<Depart | null>(null);

  // edit
  const handleEditDepart = (department: Depart) => {
    setSelectedDepartData(department);
    setIsModalOpenEditDepart(true);
  };

  // add
  const handleAddDepart = () => {
    setIsModalOpenAddDepart(true);
  };

  const handleModalToggleAddDepart = () => {
    setIsModalOpenAddDepart(!isModalOpenAddDepart);
  };

  useEffect(() => {
    fetch("/api/admin/depart")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("API response is not an array");
        }
        setDepart(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

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

  const filteredItems = depart.filter(
    (item) =>
      item.depart.toString().includes(searchTerm) || // Convert the number to a string for search
      item.depart_name.toLowerCase().includes(searchTerm.toLowerCase())
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
      const maxPageLinks = 3; // Maximum number of displayed page links

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
          Show{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
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
              {"<"}
            </button>
          </li>
          {generatePageLinks()}
          <li>
            <button
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={onNextPage}
              disabled={currentPage === totalPages}
            >
              {">"}
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="items-center justify-between pb-4 bg-white dark:bg-gray-900 p-2">
          <div className="flex justify-end">
            <button
              id="dropdownActionButton"
              data-dropdown-toggle="dropdownAction"
              className="mb-2 inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              type="button"
              onClick={handleAddDepart}
              data-modal-toggle="AddDepart-modal"
              data-modal-target="AddDepart-modal"
            >
              Add Depart
            </button>
          </div>
        </div>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Department
              </th>
            </tr>
          </thead>
          <tbody>
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <th
                  scope="row"
                  className="flex items-center px-3 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <div className="pl-3">
                    <div className="text-base font-semibold">
                      <button
                        className="text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        พัฒนาระบบ
                      </button>
                    </div>
                    <div className="font-normal text-gray-500">
                      สำนักเทคโนโลยีสารสนเทศ
                    </div>
                  </div>
                </th>
              </tr>
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <th
                  scope="row"
                  className="flex items-center px-3 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <div className="pl-3">
                    <div className="text-base font-semibold">
                      <button
                        className="text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        พัฒนาระบบ
                      </button>
                    </div>
                    <div className="font-normal text-gray-500">
                      สำนักเทคโนโลยีสารสนเทศ
                    </div>
                  </div>
                </th>
              </tr>
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <th
                  scope="row"
                  className="flex items-center px-3 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <div className="pl-3">
                    <div className="text-base font-semibold">
                      <button
                        className="text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        พัฒนาระบบ
                      </button>
                    </div>
                    <div className="font-normal text-gray-500">
                      สำนักเทคโนโลยีสารสนเทศ
                    </div>
                  </div>
                </th>
              </tr>
          </tbody>
          {/* <tbody>
            {currentItems.map((item) => (
              <tr
                key={item.depart} // Assuming each depart object has a unique depart
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <th
                  scope="row"
                  className="flex items-center px-3 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <div className="pl-3">
                    <div className="text-base font-semibold">
                      <a
                        href="#"
                        className="text-blue-600 dark:text-blue-500 hover:underline"
                        onClick={() => handleEditDepart(item)}
                      >
                        {item.depart_name}
                      </a>
                    </div>
                    <div className="font-normal text-gray-500">
                      {item.div_name}
                    </div>
                  </div>
                </th>
              </tr>
            ))}
          </tbody> */}
        </table>
        <div className="relative overflow-x-auto sm:rounded-lg px-2">
          {/* ... (existing code) */}
          <PageNavigation
            currentPage={currentPage}
            totalPages={totalPages}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
          />
        </div>
        {/* useradd modal*/}
        <DepartAddModal
          isModalOpenAddDepart={isModalOpenAddDepart}
          setIsModalOpenAddDepart={setIsModalOpenAddDepart}
        />
        {/* useredit modal */}
        {selectedDepartData && (
          <DepartEditModal
            isModalOpenEditDepart={isModalOpenEditDepart}
            setIsModalOpenEditDepart={setIsModalOpenEditDepart}
            departmentData={selectedDepartData}
          />
        )}
      </div>
    </>
  );
};

export default ListDepart;
