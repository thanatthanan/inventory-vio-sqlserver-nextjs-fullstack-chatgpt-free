import React, { useEffect, useState } from "react";

import UserAddModal from "./modal/user/UserAddModal";
import UserEditModal from "./modal/user/UserEditModal";

interface User {
  id: number;
  username: string;
  password: string;
  fname: string;
  lname: string;
  level: string;
  avatar: string;
  depart: number;
  depart_name: string;
  div_name: string;
  date: string;
}

const ListUser: React.FC = () => {
  const [user, setUsers] = useState<User[]>([]);

  const [itemToDeleteId, setItemToDeleteId] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage] = useState(6);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [isModalOpenAddUser, setIsModalOpenAddUser] = useState(false);
  const [isModalOpenEditUser, setIsModalOpenEditUser] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState<User | null>(null);

  // edit
  const handleEditUser = (user: User) => {
    setSelectedUserData(user);
    setIsModalOpenEditUser(true);
  };

  // add
  const handleAddUser = () => {
    setIsModalOpenAddUser(true);
  };

  const handleModalToggleAddUser = () => {
    setIsModalOpenAddUser(!isModalOpenAddUser);
  };

  useEffect(() => {
    fetch("api/admin/user")
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
        setUsers(data);
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

  const filteredItems = user.filter(
    (item) =>
      item.username.includes(searchTerm) ||
      item.fname.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex items-center justify-between pb-4 bg-white dark:bg-gray-900 p-2">
        <div className="flex">
          <button
            id="dropdownActionButton"
            data-dropdown-toggle="dropdownAction"
            className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            type="button"
            onClick={handleAddUser}
            data-modal-toggle="AddUser-modal"
            data-modal-target="AddUser-modal"
          >
            Add User
          </button>
        </div>
        <label htmlFor="table-search" className="sr-only">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="table-search-users"
            value={searchTerm}
            onChange={handleSearchChange}
            className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search for Name or User"
          />
        </div>
      </div>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="checkbox-all-search" className="sr-only">
                  checkbox
                </label>
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              department
            </th>
            <th scope="col" className="px-6 py-3">
              Level
            </th>
          </tr>
        </thead>
        <tbody>
            <tr
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td className="w-4 p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-table-search-1"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checkbox-table-search-1" className="sr-only">
                    checkbox
                  </label>
                </div>
              </td>
              <th
                scope="row"
                className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
              >
                  {
                    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
                  <img
                  className="w-10 h-10 rounded-full"
                  src="/img/avatar/blank.png"
                />
                  }
                <div className="pl-3">
                  <div className="text-base font-semibold">
                    <a
                      href="#"
                      className="text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      55136
                    </a>
                  </div>
                  <div className="font-normal text-gray-500">
                    สมชาย ใจดี
                  </div>
                </div>
              </th>
              <td className="px-6 py-4">
                <div className="text-base font-semibold">
                  <a
                    href="#"
                    className="text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    พัฒนาระบบ
                  </a>
                </div>
                <div className="font-normal text-gray-500">สำนักเทคโนโลยีสารสนเทศ</div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>
                    Level 1
                </div>
              </td>
            </tr>
            <tr
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td className="w-4 p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-table-search-1"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checkbox-table-search-1" className="sr-only">
                    checkbox
                  </label>
                </div>
              </td>
              <th
                scope="row"
                className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
              >
                  {
                    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
                  <img
                  className="w-10 h-10 rounded-full"
                  src="/img/avatar/blank.png"
                />
                  }
                <div className="pl-3">
                  <div className="text-base font-semibold">
                    <a
                      href="#"
                      className="text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      55136
                    </a>
                  </div>
                  <div className="font-normal text-gray-500">
                    สมชาย ใจดี
                  </div>
                </div>
              </th>
              <td className="px-6 py-4">
                <div className="text-base font-semibold">
                  <a
                    href="#"
                    className="text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    พัฒนาระบบ
                  </a>
                </div>
                <div className="font-normal text-gray-500">สำนักเทคโนโลยีสารสนเทศ</div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>
                    Level 1
                </div>
              </td>
            </tr>
            <tr
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td className="w-4 p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-table-search-1"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checkbox-table-search-1" className="sr-only">
                    checkbox
                  </label>
                </div>
              </td>
              <th
                scope="row"
                className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
              >
                  {
                    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
                  <img
                  className="w-10 h-10 rounded-full"
                  src="/img/avatar/blank.png"
                />
                  }
                <div className="pl-3">
                  <div className="text-base font-semibold">
                    <a
                      href="#"
                      className="text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      55136
                    </a>
                  </div>
                  <div className="font-normal text-gray-500">
                    สมชาย ใจดี
                  </div>
                </div>
              </th>
              <td className="px-6 py-4">
                <div className="text-base font-semibold">
                  <a
                    href="#"
                    className="text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    พัฒนาระบบ
                  </a>
                </div>
                <div className="font-normal text-gray-500">สำนักเทคโนโลยีสารสนเทศ</div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>
                    Level 1
                </div>
              </td>
            </tr>
            <tr
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td className="w-4 p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-table-search-1"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checkbox-table-search-1" className="sr-only">
                    checkbox
                  </label>
                </div>
              </td>
              <th
                scope="row"
                className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
              >
                  {
                    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
                  <img
                  className="w-10 h-10 rounded-full"
                  src="/img/avatar/blank.png"
                />
                  }
                <div className="pl-3">
                  <div className="text-base font-semibold">
                    <a
                      href="#"
                      className="text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      55136
                    </a>
                  </div>
                  <div className="font-normal text-gray-500">
                    สมชาย ใจดี
                  </div>
                </div>
              </th>
              <td className="px-6 py-4">
                <div className="text-base font-semibold">
                  <a
                    href="#"
                    className="text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    พัฒนาระบบ
                  </a>
                </div>
                <div className="font-normal text-gray-500">สำนักเทคโนโลยีสารสนเทศ</div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>
                    Level 1
                </div>
              </td>
            </tr>
        </tbody>
        {/* <tbody>
          {currentItems.map((user) => (
            <tr
              key={user.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td className="w-4 p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-table-search-1"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checkbox-table-search-1" className="sr-only">
                    checkbox
                  </label>
                </div>
              </td>
              <th
                scope="row"
                className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
              >
                {user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="w-10 h-10 rounded-full"
                    src=""
                    alt={`${user.username} image`}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="w-10 h-10 rounded-full"
                    src="/img/avatar/blank.png"
                    alt={`${user.username} image`}
                  />
                )}
                <div className="pl-3">
                  <div className="text-base font-semibold">
                    <a
                      href="#"
                      className="text-blue-600 dark:text-blue-500 hover:underline"
                      onClick={() => handleEditUser(user)}
                    >
                      {user.username}
                    </a>
                  </div>
                  <div className="font-normal text-gray-500">
                    {user.fname} {user.lname}
                  </div>
                </div>
              </th>
              <td className="px-6 py-4">
                <div className="text-base font-semibold">
                  <a
                    href="#"
                    className="text-blue-600 dark:text-blue-500 hover:underline"
                    onClick={() => handleEditUser(user)}
                  >
                    {user.depart_name}
                  </a>
                </div>
                <div className="font-normal text-gray-500">{user.div_name}</div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  {user.level == "1" && (
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>
                  )}
                  {user.level == "2" && (
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-500 mr-2"></div>
                  )}
                  {user.level == "3" && (
                    <div className="h-2.5 w-2.5 rounded-full bg-blue-500 mr-2"></div>
                  )}
                  {user.level == "4" && (
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                  )}
                  {user.level}
                </div>
              </td>
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
      <UserAddModal
        isModalOpenAddUser={isModalOpenAddUser}
        setIsModalOpenAddUser={setIsModalOpenAddUser}
      />
      {/* useredit modal */}
      {selectedUserData && (
        <UserEditModal
          isModalOpenEditUser={isModalOpenEditUser}
          setIsModalOpenEditUser={setIsModalOpenEditUser}
          userData={selectedUserData}
        />
      )}
    </div>
  );
};

export default ListUser;
