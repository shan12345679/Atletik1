import React, { useEffect, useState } from "react";
import supabase from "../helper/supabaseClient";
import { useNavigate } from "react-router-dom";
import "./admin.css";

function Dashboard() {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setAdminEmail(data.user.email);
      }
    };

    fetchUser();
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigate("/login");
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-topbar">
        <span className="admin-name">Admin: {adminEmail}</span>
        <button className="sign-out-btn" onClick={signOut}>Sign Out</button>
      </div>

      <div className="dashboard-content">
        <h1>Welcome to the Admin Dashboard</h1>
        <p>This is your control panel.</p>
      </div>
    </div>
  );
}

export default Dashboard;
