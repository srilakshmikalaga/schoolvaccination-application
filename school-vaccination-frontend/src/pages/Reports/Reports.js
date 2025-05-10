import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Reports = () => {
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({ name: "", roll: "", vaccine: "" });
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const rowsPerPage = 5;

  useEffect(() => {
    axios
      .get("http://localhost:8080/students/v2")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error("Failed to fetch report data", err));
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setPage(1);
  };

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(filters.name.toLowerCase()) &&
    s.rollNumber.toLowerCase().includes(filters.roll.toLowerCase()) &&
    s.vaccinations.some((v) =>
      v.vaccine.toLowerCase().includes(filters.vaccine.toLowerCase())
    )
  );

  const sorted = [...filtered].sort((a, b) => {
    return sortOrder === "asc"
      ? a.class.localeCompare(b.class)
      : b.class.localeCompare(a.class);
  });

  const totalPages = Math.ceil(sorted.length / rowsPerPage);
  const paginated = sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const downloadExcel = () => {
    const exportData = filtered.map((s) => ({
      Name: s.name,
      RollNumber: s.rollNumber,
      Class: s.class,
      Vaccines: s.vaccinations.map((v) => v.vaccine).join(", "),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, "vaccination_report.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Name", "Roll No", "Class", "Vaccines"]],
      body: filtered.map((s) => [
        s.name,
        s.rollNumber,
        s.class,
        s.vaccinations.map((v) => v.vaccine).join(", "),
      ]),
    });
    doc.save("vaccination_report.pdf");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">📊 Vaccination Reports</h2>

      {/* Filter Panel */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Filter Reports</h3>
        <div className="grid gap-4 sm:grid-cols-3 mb-4">
          <input
            type="text"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            placeholder="Search by Student Name"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="roll"
            value={filters.roll}
            onChange={handleFilterChange}
            placeholder="Search by Roll Number"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="vaccine"
            value={filters.vaccine}
            onChange={handleFilterChange}
            placeholder="Search by Vaccine"
            className="border p-2 rounded"
          />
        </div>

        <div className="flex gap-3 items-center justify-between flex-wrap">
          <div className="flex gap-3">
            <button
              onClick={downloadExcel}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Export Excel
            </button>
            <button
              onClick={downloadPDF}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Export PDF
            </button>
          </div>
          <div>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="asc">Sort by Class (A–Z)</option>
              <option value="desc">Sort by Class (Z–A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Report Table</h3>

        {paginated.length === 0 ? (
          <p className="text-gray-500">No matching records found.</p>
        ) : (
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Roll No</th>
                <th className="p-3">Class</th>
                <th className="p-3">Vaccines</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((s) => (
                <tr key={s._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.rollNumber}</td>
                  <td className="p-3">{s.class}</td>
                  <td className="p-3">
                    {s.vaccinations.length > 0
                      ? s.vaccinations.map((v) => v.vaccine).join(", ")
                      : "Not Vaccinated"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {filtered.length > rowsPerPage && (
          <div className="flex justify-end items-center mt-4 text-sm text-gray-600">
            <span className="mr-4">
              Showing {(page - 1) * rowsPerPage + 1}–{Math.min(page * rowsPerPage, filtered.length)} of {filtered.length}
            </span>
            <div className="space-x-2">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-1 border rounded hover:bg-gray-100"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                className="px-3 py-1 border rounded hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
