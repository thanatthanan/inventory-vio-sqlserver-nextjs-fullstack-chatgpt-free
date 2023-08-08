import React, { useEffect, useState } from "react";
import axios from "axios";
import router from "next/router";

interface Depart {
  depart: string;
  depart_name: string;
  div: string;
  div_name: string;
}

interface UserAddModalProps {
  isModalOpenAddUser: boolean;
  setIsModalOpenAddUser: (isOpen: boolean) => void;
}

function UserAddModal({
  isModalOpenAddUser,
  setIsModalOpenAddUser,
}: UserAddModalProps) {
  const closeModal = () => {
    setIsModalOpenAddUser(false);
  };

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fname: "",
    lname: "",
    level: "",
    depart: "",
  });

  const [duplicateError, setDuplicateError] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [departOptions, setDepartOptions] = useState<Depart[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // check password
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    setConfirmPassword(value);
    setPasswordMismatch(formData.password !== value && value !== "");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (confirmPassword === "") {
      setPasswordMismatch(true);
      return;
    }
  
    if (passwordMismatch) {
      return; // Prevent form submission if passwords don't match
    }

    try {
      // Check if the depart already exists in the database
      const response = await axios.post("/api/admin/user/check", {
        username: formData.username,
      });

      if (response.data.exists) {
        setDuplicateError(true);
        return;
      }

      // add data
      await axios.post("/api/admin/user/add", formData);
      console.log("User added successfully!");
      closeModal();
      router.push("/components/link/loadingAdmin");
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  useEffect(() => {
    const fetchDepartOptions = async () => {
      try {
        const response = await axios.get("/api/admin/depart");
        setDepartOptions(response.data);
      } catch (error) {
        console.error("Error fetching depart options:", error);
      }
    };

    fetchDepartOptions();
  }, []);

  return (
    <div>
      {isModalOpenAddUser && (
        <div
          id="useradd-modal"
          className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto h-screen 
          ${isModalOpenAddUser ? "block" : "hidden"} ${
            isModalOpenAddUser ? "bg-black bg-opacity-50" : ""
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
                  เพิ่มผู้ใช้งาน
                </h3>
                <form onSubmit={handleSubmit}>
                <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                รหัสพนักงาน
              </label>
              <input
                type="text"
                name="username"
                id="username"
                className={`my-2 bg-gray-50 border ${
                  duplicateError ? "border-red-500" : "border-gray-300"
                } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white`}
                value={formData.username}
                onChange={handleChange}
                required
              />
              {duplicateError && (
                <p className="text-red-500 mt-2">รหัสพนักงานซ้ำในระบบแล้ว</p>
              )}
            </div>
                  <div>
                    <label
                      htmlFor="fname"
                      className="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      ชื่อ
                    </label>
                    <input
                      type="text"
                      name="fname"
                      id="fname"
                      className="my-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      value={formData.fname}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lname"
                      className="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      นามสกุล
                    </label>
                    <input
                      type="text"
                      name="lname"
                      id="lname"
                      className="my-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      value={formData.lname}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      รหัสผ่าน
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className="my-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      ยืนยันรหัสผ่าน
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      className={`my-2 bg-gray-50 border ${
                        passwordMismatch ? "border-red-500" : "border-gray-300"
                      } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white`}
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}                      
                    />
                    {passwordMismatch && (
                      <p className="text-red-500 mt-2">รหัสผ่านไม่ตรงกัน</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="depart"
                      className="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      หน่วยงาน
                    </label>
                    <select
                      id="depart"
                      name="depart"
                      className="my-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      value={formData.depart}
                      onChange={
                        handleLevelChange as React.ChangeEventHandler<HTMLSelectElement>
                      }
                      required
                    >
                      <option value="">-- เลือกหน่วยงาน --</option>
                      {departOptions.map((departOption) => (
                        <option
                          key={departOption.depart}
                          value={departOption.depart}
                        >
                          {departOption.depart_name} | ({departOption.div_name})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="level"
                      className="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      ระดับ
                    </label>
                    <select
                      id="level"
                      name="level"
                      className="my-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      value={formData.level}
                      onChange={
                        handleLevelChange as React.ChangeEventHandler<HTMLSelectElement>
                      } // Use type assertion here
                      required
                    >
                      <option value="">-- เลือกระดับ --</option>
                      <option value="1">ระดับ 1 แอดมินระบบ</option>
                      <option value="2">
                        ระดับ 2 ดูรายงาน รับ-จ่ายสินค้า แก้ไขสินค้า
                      </option>
                      <option value="3">ระดับ 3 ดูรายงาน รับ-จ่ายสินค้า</option>
                      <option value="4">ระดับ 4 ดูรายงาน เท่านั้น</option>
                    </select>
                  </div>
                  <button
  type="submit"
  className="mt-4 w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
  disabled={passwordMismatch} // Disable the button when passwords don't match
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

export default UserAddModal;
