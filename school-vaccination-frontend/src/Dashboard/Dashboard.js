import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import VaccinationDrives from "../pages/VaccinationDrives/VaccinationDrives";
import Students from "../pages/Students/Students";
import Reports from "../pages/Reports/Reports";
import VaccinationChart from "../components/VaccinationChart";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Dashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    totalStudents: 0,
    vaccinated: 0,
    unvaccinated: 0,
    upcomingDrives: 0,
  });

  const [todaysDrives, setTodaysDrives] = useState([]);
  const [allDrives, setAllDrives] = useState([]);

  const handleMenuChange = (menu) => {
    if (menu === "logout") {
      navigate("/");
    } else {
      setSelectedMenu(menu);
    }
  };

  useEffect(() => {
    axios.get("http://localhost:8080/api/dashboard/summary")
      .then((res) => setSummary(res.data))
      .catch((err) => console.error("Dashboard summary fetch error:", err));

    axios.get("http://localhost:8080/api/drives/today")
      .then((res) => setTodaysDrives(res.data))
      .catch((err) => console.error("Today's drives fetch error:", err));

    axios.get("http://localhost:8080/api/drives")
      .then((res) => setAllDrives(res.data))
      .catch((err) => console.error("All drives fetch error:", err));
  }, []);

  const vaccinatedPercentage =
    summary.totalStudents > 0
      ? Math.round((summary.vaccinated / summary.totalStudents) * 100)
      : 0;

  const completedDrives = allDrives.filter(d => new Date(d.date) < new Date()).length;
  const pendingDrives = allDrives.length - completedDrives;

  const driveBarData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        label: "Vaccination Drives",
        data: [completedDrives, pendingDrives],
        backgroundColor: ["#3b82f6", "#facc15"],
        borderRadius: 6
      }
    ]
  };

  const summaryCards = [
    { title: "Total Students", value: summary.totalStudents },
    {
      title: "Vaccinated Students",
      value: `${summary.vaccinated} (${vaccinatedPercentage}%)`,
    },
    { title: "Unvaccinated Students", value: summary.unvaccinated },
    { title: "Upcoming Drives", value: summary.upcomingDrives },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onMenuChange={handleMenuChange} />
      <main className="flex-1 p-6 overflow-y-auto">
        {selectedMenu === "dashboard" && (
          <>
            <h2 className="text-3xl font-bold text-indigo-700 mb-6">📊 Dashboard Overview</h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {summaryCards.map((card, i) => (
                <div
                  key={i}
                  className="bg-white shadow-md rounded-lg p-5 border-l-4 border-blue-500"
                >
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <p className="text-2xl font-bold text-blue-700">{card.value}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Vaccination Status</h3>
                <VaccinationChart
                  vaccinated={summary.vaccinated}
                  unvaccinated={summary.unvaccinated}
                />
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Drive Completion</h3>
                <Bar data={driveBarData} />
              </div>
            </div>

            {/* Today's Sessions */}
            <section className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">🗓️ Today's Sessions</h3>
              {todaysDrives.length > 0 ? (
                todaysDrives.map((drive, index) => (
                  <div
                    key={index}
                    className="mb-4 border-b pb-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">{drive.vaccine}</p>
                        <p className="text-sm text-gray-500">Classes: {drive.applicableClasses.join(", ")}</p>
                        <p className="text-sm text-gray-500">Date: {new Date(drive.date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex flex-col items-end text-sm">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">Ongoing</span>
                        <p className="text-sm text-gray-600 mt-2">Total Doses: {drive.totalDoses}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No sessions scheduled for today.</p>
              )}
            </section>
          </>
        )}

        {selectedMenu === "drives" && <VaccinationDrives />}
        {selectedMenu === "students" && <Students />}
        {selectedMenu === "reports" && <Reports />}
      </main>
    </div>
  );
};

export default Dashboard;
