// DepartEditModal.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import router from "next/router";
import DepartDeleteModal from "./DepartDeleteModal";

interface Depart {
  id: number;
  depart: number;
  depart_name: string;
  div: number;
  div_name: string;
}

type DepartItem = {
  id: number;
  depart: number;
  depart_name: string;
  div: number;
  div_name: string;
};

interface DepartEditModalProps {
  isModalOpenEditDepart: boolean;
  setIsModalOpenEditDepart: (isOpen: boolean) => void;
  departmentData: Depart;
}

function DepartEditModal({
  isModalOpenEditDepart,
  setIsModalOpenEditDepart,
  departmentData,
}: DepartEditModalProps) {
  const closeModal = () => {
    setIsModalOpenEditDepart(false);
  };

  const [departItems, setDepartItems] = useState<DepartItem[]>([]);
  const [formData, setFormData] = useState<Depart>(departmentData);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Proceed with updating the department in the database
      await axios.post("/api/admin/depart/edit", formData);
      console.log("Department updated successfully!");
      closeModal();
      router.push("/components/link/loadingAdmin");
    } catch (error) {
      console.error("Error updating department:", error);
    }
  };

  useEffect(() => {
    // When the departmentData prop changes, update the formData state
    setFormData(departmentData);
  }, [departmentData]);

  const handleDel = (id: number) => {
    setItemToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      if (itemToDeleteId !== null) {
        await axios.delete(`/api/depart/del/${itemToDeleteId}`);
        // Update the departItems state after successful deletion
        const updatedDepartItems = departItems.filter(
          (item) => item.id !== itemToDeleteId
        );
        setDepartItems(updatedDepartItems);
      }
      // Close the delete modal and the edit modal
      setIsDeleteModalOpen(false);
      closeModal();
      
    } catch (error) {
      console.error("Error deleting depart item:", error);
    }
  };

  return (
    <div>
      {isModalOpenEditDepart && (
        <div
          id="departadd-modal"
          className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto h-screen 
          ${isModalOpenEditDepart ? "block" : "hidden"} ${
            isModalOpenEditDepart ? "bg-black bg-opacity-50" : ""
          }`}
        >
          <div className="relative w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="departadd-modal"
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
                  แก้ไขหน่วยงาน
                </h3>
                <form onSubmit={handleSubmit}>
                  <div>
                    <label
                      htmlFor="depart"
                      className="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      รหัสหน่วยงาน (ไม่สามารถแก้ไขรหัสหน่วยงานได้)
                    </label>
                    <input
                      type="number"
                      name="depart"
                      id="depart"
                      value={formData.depart}
                      onChange={handleChange}
                      className={`my-2 bg-gray-50 bordertext-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white`}
                      required
                      disabled
                    />
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
                {/* ... (existing code) ... */}
                <button
                  className="mt-4 w-full text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                  onClick={() => handleDel(formData.id)}
                >
                  ลบข้อมูล
                </button>
                {/* DepartDeleteModal */}
                {isDeleteModalOpen && itemToDeleteId !== null && (
                  <DepartDeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                      setIsDeleteModalOpen(false); // Close the delete modal
                      closeModal(); // Close the edit modal
                    }}
                    onConfirm={handleDeleteConfirmed}
                    itemIdToDelete={itemToDeleteId}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DepartEditModal;
