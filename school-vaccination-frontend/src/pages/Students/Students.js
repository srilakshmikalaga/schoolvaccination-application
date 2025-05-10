import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ rollNumber: "", name: "", class: "", vaccine: "" });
  const [uploadFile, setUploadFile] = useState(null);
  const fileInputRef = useRef(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ _id: "", rollNumber: "", name: "", class: "", vaccinations: "" });

  const [filters, setFilters] = useState({ name: "", rollNumber: "", class: "", status: "all" });
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    axios.get("http://localhost:8080/students/v2").then((res) => {
      const sorted = res.data.sort((a, b) => a.class.localeCompare(b.class));
      setStudents(sorted);
    });
  };

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleEditFormChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      rollNumber: form.rollNumber,
      name: form.name,
      class: form.class,
      vaccinations: form.vaccine ? [{ vaccine: form.vaccine }] : []
    };
    await axios.post("http://localhost:8080/students", payload);
    setForm({ rollNumber: "", name: "", class: "", vaccine: "" });
    fetchStudents();
  };

  const handleUploadSubmit = async () => {
    if (!uploadFile) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const workbook = XLSX.read(evt.target.result, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);
      const studentList = rows.map(row => ({
        rollNumber: row.rollNumber,
        name: row.name,
        class: row.class,
        vaccinations: Object.keys(row).filter(k => k.toLowerCase().startsWith("vaccine"))
          .map(k => row[k]).filter(Boolean).map(v => ({ vaccine: v }))
      }));
      await axios.post("http://localhost:8080/students/bulk", studentList);
      fetchStudents();
      setUploadFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsArrayBuffer(uploadFile);
  };

  const handleClearUpload = () => {
    setUploadFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const downloadTemplate = () => {
    const sheet = XLSX.utils.json_to_sheet([{ rollNumber: "STU001", name: "Student", class: "6A", "Vaccine 1": "Polio", "Vaccine 2": "MMR" }]);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Template");
    XLSX.writeFile(book, "student_template.xlsx");
  };

  const openEditModal = (student) => {
    setEditForm({
      _id: student._id,
      rollNumber: student.rollNumber,
      name: student.name,
      class: student.class,
      vaccinations: student.vaccinations.map(v => v.vaccine).join(", ")
    });
    setEditModalOpen(true);
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      rollNumber: editForm.rollNumber,
      name: editForm.name,
      class: editForm.class,
      vaccinations: editForm.vaccinations.split(",").map(v => ({ vaccine: v.trim() }))
    };
    await axios.put(`http://localhost:8080/students/${editForm._id}`, payload);
    setEditModalOpen(false);
    fetchStudents();
  };

  const filteredStudents = students.filter((s) => {
    const matchesName = s.name.toLowerCase().includes(filters.name.toLowerCase());
    const matchesRoll = s.rollNumber.toLowerCase().includes(filters.rollNumber.toLowerCase());
    const matchesClass = s.class.toLowerCase().includes(filters.class.toLowerCase());
    const isVaccinated = s.vaccinations.some(v => v.vaccine && v.vaccine.trim() !== "");

    const matchesStatus =
      filters.status === "all" ||
      (filters.status === "vaccinated" && isVaccinated) ||
      (filters.status === "unvaccinated" && !isVaccinated);

    return matchesName && matchesRoll && matchesClass && matchesStatus;
  });

  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
  const paginatedStudents = filteredStudents.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-800 mb-6">🎓 Manage Students</h2>

      {/* Add Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Add Student</h3>
        <form onSubmit={handleFormSubmit} className="grid gap-4 sm:grid-cols-2">
          <input type="text" name="rollNumber" placeholder="Roll Number" value={form.rollNumber} onChange={handleFormChange} required className="border p-2 rounded w-full" />
          <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleFormChange} required className="border p-2 rounded w-full" />
          <input type="text" name="class" placeholder="Class" value={form.class} onChange={handleFormChange} required className="border p-2 rounded w-full" />
          <input type="text" name="vaccine" placeholder="Vaccine (optional)" value={form.vaccine} onChange={handleFormChange} className="border p-2 rounded w-full" />
          <button type="submit" className="sm:col-span-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Student</button>
        </form>
      </div>

      {/* Bulk Upload */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">📂 Bulk Upload via Excel</h3>
          <button onClick={downloadTemplate} className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900">Download Template</button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={(e) => setUploadFile(e.target.files[0])} className="border p-2 rounded w-full sm:w-auto" />
          <button onClick={handleUploadSubmit} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Upload</button>
          <button onClick={handleClearUpload} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Clear</button>
        </div>
        {uploadFile && <p className="mt-2 text-sm text-gray-600">📎 Selected: {uploadFile.name}</p>}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
        <input name="name" placeholder="Search by Name" value={filters.name} onChange={handleFilterChange} className="border p-2 rounded" />
        <input name="rollNumber" placeholder="Search by Roll Number" value={filters.rollNumber} onChange={handleFilterChange} className="border p-2 rounded" />
        <input name="class" placeholder="Search by Class" value={filters.class} onChange={handleFilterChange} className="border p-2 rounded" />
        <select name="status" value={filters.status} onChange={handleFilterChange} className="border p-2 rounded">
          <option value="all">All</option>
          <option value="vaccinated">Vaccinated</option>
          <option value="unvaccinated">Not Vaccinated</option>
        </select>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">📋 Student List</h3>
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Class</th>
              <th className="p-3">Roll</th>
              <th className="p-3">Name</th>
              <th className="p-3">Vaccines</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.map((s) => (
              <tr key={s._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{s.class}</td>
                <td className="p-3">{s.rollNumber}</td>
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.vaccinations.map(v => v.vaccine).join(", ") || "None"}</td>
                <td className="p-3">
                  <button onClick={() => openEditModal(s)} className="text-blue-600 hover:underline">✏️ Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {filteredStudents.length > rowsPerPage && (
          <div className="flex justify-end items-center mt-4 text-sm text-gray-600">
            <span className="mr-4">
              Showing {(page - 1) * rowsPerPage + 1}–{Math.min(page * rowsPerPage, filteredStudents.length)} of {filteredStudents.length}
            </span>
            <div className="space-x-2">
              <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} className="px-3 py-1 border rounded hover:bg-gray-100">Previous</button>
              <button onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} className="px-3 py-1 border rounded hover:bg-gray-100">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">✏️ Edit Student</h3>
            <form onSubmit={handleEditFormSubmit} className="grid gap-4">
              <input type="text" name="rollNumber" value={editForm.rollNumber} onChange={handleEditFormChange} className="border p-2 rounded" />
              <input type="text" name="name" value={editForm.name} onChange={handleEditFormChange} className="border p-2 rounded" />
              <input type="text" name="class" value={editForm.class} onChange={handleEditFormChange} className="border p-2 rounded" />
              <input type="text" name="vaccinations" value={editForm.vaccinations} onChange={handleEditFormChange} placeholder="Comma-separated vaccines" className="border p-2 rounded" />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setEditModalOpen(false)} className="px-4 py-2 rounded border">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
