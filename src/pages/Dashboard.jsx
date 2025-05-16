import React, { useEffect, useState } from "react";
import supabase from "../helper/supabaseClient";
import { useNavigate } from "react-router-dom";
import "./admin.css";

function Dashboard() {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const [adminData, setAdminData] = useState([]);
  const [clubAppData, setClubAppData] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setAdminEmail(data.user.email);
      }
    };

    fetchUser();
  }, []);

  const fetchAdminData = async () => {
    const { data, error } = await supabase.from("admin").select("*");
    if (error) {
      console.error("Admin fetch error:", error.message);
    } else {
      setAdminData(data);
    }
  };

  const fetchClubAppData = async () => {
    const { data, error } = await supabase.from("club_applications").select("*");
    if (error) {
      console.error("Club Applications fetch error:", error.message);
    } else {
      // Initialize status as 'pending' if not set
      const dataWithStatus = data.map(item => ({
        ...item,
        status: item.status || 'pending'
      }));
      setClubAppData(dataWithStatus);
    }
  };

  const handleTableSelect = (tableName) => {
    setSelectedTable(tableName);
    if (tableName === "admin") fetchAdminData();
    if (tableName === "club_applications") fetchClubAppData();
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigate("/login");
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    console.log(`Application ID: ${applicationId}, Status: ${newStatus}`)
    try {
      const { data, error } = await supabase
        .from('club_applications')
        .update({ status: newStatus })
        .eq('application_id', applicationId);
      
      if (error) throw error;
      
      // Update local state
      setClubAppData(clubAppData.map(item => 
        item.application_id === applicationId 
          ? { ...item, status: newStatus } 
          : item
      ));
      
    } catch (error) {
      console.error('Error updating status:', error.message);
    }
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'status-accepted';
      case 'rejected':
        return 'status-declined';
      default:
        return 'status-pending';
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-sidebar">
        <h2>Admin Panel</h2>
        <p>{adminEmail}</p>
        <button className="sidebar-btn" onClick={() => handleTableSelect("admin")}>
          Admin Table
        </button>
        <button className="sidebar-btn" onClick={() => handleTableSelect("club_applications")}>
          View Club Application
        </button>
        <button className="sign-out-btn" onClick={signOut}>
          Sign Out
        </button>
      </div>

      <div className="dashboard-main">
        <div className="dashboard-topbar">
          <span className="admin-name">Admin: {adminEmail}</span>
        </div>

        <div className="dashboard-content">
          <h1>Welcome to the Admin Dashboard</h1>
          <p>This is your control panel.</p>

          {/* Admin Table */}
          {selectedTable === "admin" && (
            <div className="table-container">
              <h2>Admin Table</h2>
              <table className="request-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Password</th>
                  </tr>
                </thead>
                <tbody>
                  {adminData.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.email}</td>
                      <td>{item.password}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Club Applications Table */}
          {selectedTable === "club_applications" && (
            <div className="table-container">
              <h2>Club Applications</h2>
              <table className="request-table">
                <thead>
                  <tr>
                    <th>Application ID</th>
                    <th>Name</th>
                    <th>Establishment</th>
                    <th>BIR Registration</th>
                    <th>Business Permit</th>
                    <th>Created Date</th>
                    <th>Filer ID</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clubAppData.map((item) => (
                    <tr key={item.application_id}>
                      <td>{item.application_id}</td>
                      <td>{item.name}</td>
                      <td>{item.establishment}</td>
                      <td>{item.bir_registration}</td>
                      <td>{item.business_permit}</td>
                      <td>{item.created_at?.slice(0, 10)}</td>
                      <td>{item.filer_id}</td>
                      <td>{item.location}</td>
                      <td>
                        <span className={`status-badge ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="action-buttons">
                        {
                          item.status == "pending" && (
                            <>
                          <button 
                          className="accept-btn"
                          onClick={() => updateApplicationStatus(item.application_id, 'accepted')}
                        >
                          Accept
                        </button>
                       

                        <button 
                          className="decline-btn"
                          onClick={() => updateApplicationStatus(item.application_id, 'rejected')}
                        >
                          Decline
                        </button>
                         </>
                          )
                          }
                        
                        
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;