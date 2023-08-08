import React, { useEffect, useState } from "react";
import Layout from "./components/Layout";
import ListMember from "./components/admin/ListUser";
import ListDepart from "./components/admin/ListDepart";
import Cookies from "js-cookie";
import router from "next/router";

const Admin: React.FC = () => {
  // Renamed to "Admin" starting with uppercase
  const [username] = useState(Cookies.get("username") || "");
  const [level] = useState(Cookies.get("level") || "");

  // useEffect(() => {
  //   if (!level || level !== "1") {
  //     router.push("/");
  //   }
  // }, [level]);

  return (
    <div>
      <Layout>
        <p>{/* username : {username}, level : {level} */}</p>
        <div className="relative overflow-x-auto sm:rounded-lg max-w-screen-xl mx-auto p-4">
          <div className="flex gap-4">
            <div className="w-3/5 lg:w-3/4">
              <ListMember />
            </div>
            <div className="w-2/5 lg:w-1/4">
              <ListDepart />
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Admin; // Export with the updated name
