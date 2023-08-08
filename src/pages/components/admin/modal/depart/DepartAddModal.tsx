// DepartAddModal.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import router from "next/router";

interface DepartAddModalProps {
  isModalOpenAddDepart: boolean;
  setIsModalOpenAddDepart: (isOpen: boolean) => void;
}

function DepartAddModal({
  isModalOpenAddDepart,
  setIsModalOpenAddDepart,
}: DepartAddModalProps) {
  const closeModal = () => {
    setIsModalOpenAddDepart(false);
  };

  const [formData, setFormData] = useState({
    depart: 0,
    depart_name: "",
    div: 0,
    div_name: "",
  });

  const [duplicateError, setDuplicateError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setDuplicateError(false); // Reset the duplicateError state when the input value changes
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Check if the depart already exists in the database
      const response = await axios.post("/api/admin/depart/check", {
        depart: formData.depart,
      });

      if (response.data.exists) {
        setDuplicateError(true);
        return;
      }

      // If the depart is not a duplicate, proceed with adding it to the database
      await axios.post("/api/admin/depart/add", formData);
      console.log("Department added successfully!");
      closeModal();
      router.push("/components/link/loadingAdmin");
    } catch (error) {
      console.error("Error adding department:", error);
    }
  };

  return (
    <div>
      {isModalOpenAddDepart && (
        <div
          id="useradd-modal"
          className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto h-screen 
          ${isModalOpenAddDepart ? "block" : "hidden"} ${
            isModalOpenAddDepart ? "bg-black bg-opacity-50" : ""
          }`}
        >
          <div className="relative w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="useradd-modal"
                onClick={closeModal}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="px-6 py-6 lg:px-8">
                <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
                  เพิ่มหน่วยงาน
                </h3>
                <form onSubmit={handleSubmit}>
                  <div>
                    <label
                      htmlFor="depart"
                      className="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      รหัสหน่วยงาน
                    </label>
                    <input
                      type="number"
                      name="depart"
                      id="depart"
                      value={formData.depart}
                      onChange={handleChange}
                      className={`my-2 bg-gray-50 border ${
                        duplicateError ? "border-red-500" : "border-gray-300"
                      } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white`}
                      required
                    />
                    {duplicateError && (
                      <p className="text-red-500 text-sm mt-1 mb-2">
                        รหัสหน่วยงานนี้มีอยู่ในระบบแล้ว
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="depart_name"
                      className="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      ชื่อหน่วยงาน
                    </label>
                    <input
                      type="text"
                      name="depart_name"
                      id="depart_name"
                      value={formData.depart_name}
                      onChange={handleChange}
                      className="my-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="div"
                      className="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      รหัสสังกัด
                    </label>
                    <input
                      type="number"
                      name="div"
                      id="div"
                      value={formData.div}
                      onChange={handleChange}
                      className="my-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="div_name"
                      className="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      ชื่อสังกัด
                    </label>
                    <input
                      type="text"
                      name="div_name"
                      id="div_name"
                      value={formData.div_name}
                      onChange={handleChange}
                      className="my-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="mt-4 w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    บันทึก
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DepartAddModal;
