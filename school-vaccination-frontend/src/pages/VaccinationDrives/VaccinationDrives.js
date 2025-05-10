import React, { useState, useEffect } from "react";
import axios from "axios";

const VaccinationDrives = () => {
  const [drives, setDrives] = useState([]);
  const [form, setForm] = useState({ vaccine: "", date: "", doses: "", classes: "" });
  const [editDrive, setEditDrive] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const minDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    axios.get("http://localhost:8080/api/drives")
      .then(res => {
        const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setDrives(sorted);
      })
      .catch(err => console.error("Failed to load drives", err));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      vaccine: form.vaccine,
      date: form.date,
      totalDoses: Number(form.doses),
      applicableClasses: form.classes.split(",").map(cls => cls.trim()),
    };

    try {
      const res = await axios.post("http://localhost:8080/api/drives", payload);
      setDrives([res.data, ...drives]);
      setForm({ vaccine: "", date: "", doses: "", classes: "" });
    } catch (err) {
      console.error("Failed to add drive", err);
    }
  };

  const handleEditClick = (drive) => {
    setEditDrive({
      _id: drive._id,
      vaccine: drive.vaccine,
      date: drive.date.split("T")[0],
      totalDoses: drive.totalDoses,
      applicableClasses: drive.applicableClasses.join(", "),
    });
  };

  const handleEditChange = (e) => {
    setEditDrive({ ...editDrive, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      vaccine: editDrive.vaccine,
      date: editDrive.date,
      totalDoses: Number(editDrive.totalDoses),
      applicableClasses: editDrive.applicableClasses.split(",").map(c => c.trim()),
    };

    try {
      const res = await axios.put(`http://localhost:8080/api/drives/${editDrive._id}`, payload);
      const updated = drives.map((d) => (d._id === res.data._id ? res.data : d));
      setDrives(updated);
      setEditDrive(null);
    } catch (err) {
      console.error("Edit failed", err);
    }
  };

  const isEditable = (driveDate) => {
    const today = new Date();
    const drive = new Date(driveDate);
    return drive.toDateString() >= today.toDateString();
  };

  const filteredDrives = drives.filter(
    d =>
      d.vaccine.toLowerCase().includes(search.toLowerCase()) ||
      d.applicableClasses.join(", ").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDrives.length / rowsPerPage);
  const paginatedDrives = filteredDrives.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-800 mb-6">💉 Manage Vaccination Drives</h2>

      {/* Add Drive Form */}
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 bg-white p-6 rounded-lg shadow mb-8">
        <input type="text" name="vaccine" value={form.vaccine} onChange={handleChange} placeholder="Vaccine Name" required className="border p-2 rounded" />
        <input type="date" name="date" min={minDate} value={form.date} onChange={handleChange} required className="border p-2 rounded" />
        <input type="number" name="doses" value={form.doses} onChange={handleChange} placeholder="Available Doses" required className="border p-2 rounded" />
        <input type="text" name="classes" value={form.classes} onChange={handleChange} placeholder="Applicable Classes (e.g., 5A, 5B)" required className="border p-2 rounded" />
        <button type="submit" className="col-span-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Add Drive</button>
      </form>

      {/* Search Filter */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-blue-700">📋 Scheduled Drives</h3>
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by vaccine or class"
          className="border p-2 rounded w-72"
        />
      </div>

      {/* Drives Table */}
      <div className="bg-white rounded-lg shadow p-6">
        {paginatedDrives.length === 0 ? (
          <p className="text-gray-500">No drives found.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Vaccine</th>
                <th className="p-3">Classes</th>
                <th className="p-3">Doses</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDrives.map((drive) => (
                <tr key={drive._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{new Date(drive.date).toLocaleDateString()}</td>
                  <td className="p-3">{drive.vaccine}</td>
                  <td className="p-3">{drive.applicableClasses.join(", ")}</td>
                  <td className="p-3">{drive.totalDoses}</td>
                  <td className="p-3 font-semibold">
                    {isEditable(drive.date) ? (
                      <span className="text-green-600">Editable</span>
                    ) : (
                      <span className="text-red-600">Expired</span>
                    )}
                  </td>
                  <td className="p-3">
                    {isEditable(drive.date) && (
                      <button onClick={() => handleEditClick(drive)} className="text-blue-600 hover:underline">✏️ Edit</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination Controls */}
        {filteredDrives.length > rowsPerPage && (
          <div className="flex justify-end items-center mt-4 text-sm text-gray-600">
            <span className="mr-4">
              Showing {(page - 1) * rowsPerPage + 1}–{Math.min(page * rowsPerPage, filteredDrives.length)} of {filteredDrives.length}
            </span>
            <div className="space-x-2">
              <button onClick={() => setPage((p) => Math.max(p - 1, 1))} className="px-3 py-1 border rounded hover:bg-gray-100">Previous</button>
              <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} className="px-3 py-1 border rounded hover:bg-gray-100">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editDrive && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-blue-800">✏️ Edit Vaccination Drive</h3>
            <form onSubmit={handleEditSubmit} className="grid gap-4">
              <input type="text" name="vaccine" value={editDrive.vaccine} onChange={handleEditChange} className="border p-2 rounded" />
              <input type="date" name="date" value={editDrive.date} onChange={handleEditChange} className="border p-2 rounded" />
              <input type="number" name="totalDoses" value={editDrive.totalDoses} onChange={handleEditChange} className="border p-2 rounded" />
              <input type="text" name="applicableClasses" value={editDrive.applicableClasses} onChange={handleEditChange} className="border p-2 rounded" />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setEditDrive(null)} className="px-4 py-2 rounded border">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccinationDrives;
