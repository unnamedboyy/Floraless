// "use client";

// import { useState } from "react";
// import { useUsers } from "@/hooks/useUsers";
// import DataTable from "@/components/table/DataTable";
// import Pagination from "@/components/table/Pagination";
// import UserFormModal from "@/components/form/UserFormModal";
// import DetailUserModal from "@/components/modal/DetailUserModal";

// import {
//   createUser,
//   updateUser,
//   softDeleteUser,
// } from "@/services/user.service";

// export default function PelangganPage() {
//   const [query, setQuery] = useState({
//     page: 1,
//     limit: 5,
//     search: "",
//   });

//   const { data, total, reload, loading } = useUsers("pelanggan", query);

//   const [openForm, setOpenForm] = useState(false);
//   const [selected, setSelected] = useState<any>(null);

//   const handleSubmit = async (form: any) => {
//     try {
//       if (selected) {
//         await updateUser("pelanggan", selected._id, form);
//       } else {
//         await createUser("pelanggan", form);
//       }

//       setOpenForm(false);
//       setSelected(null);
//       reload();
//     } catch (err) {
//       console.error(err);
//       alert("Gagal menyimpan data");
//     }
//   };

//   const handleDelete = async (row: any) => {
//     if (!confirm("Yakin hapus?")) return;

//     try {
//       await softDeleteUser("pelanggan", row._id);      reload();
//     } catch (err) {
//       console.error(err);
//       alert("Gagal menghapus");
//     }
//   };

//   const handleSearch = (value: string) => {
//     setQuery((prev) => ({
//       ...prev,
//       search: value,
//       page: 1,
//     }));
//   };

//   return (
//     <div className="space-y-4">
//       <h1 className="text-xl font-bold">Pelanggan</h1>

//       <div className="flex gap-2">
//         <input
//           placeholder="Search..."
//           className="border p-2"
//           onChange={(e) => handleSearch(e.target.value)}
//         />

//         <button
//           onClick={() => {
//             setSelected(null);
//             setOpenForm(true);
//           }}
//           className="bg-black text-white px-4"
//         >
//           + Tambah
//         </button>
//       </div>

//       <DataTable
//         columns={[
//           { label: "Nama", key: "nama" },
//           { label: "Username", key: "userId.username" },
//         ]}
//         data={data}
//         onView={(row) => setSelected(row)}
//         onEdit={(row) => {
//           setSelected(row);
//           setOpenForm(true);
//         }}
//         onDelete={handleDelete}
//       />

//       {loading && <p className="text-sm text-gray-500">Loading...</p>}

//       <Pagination
//         page={query.page}
//         total={total}
//         limit={query.limit}
//         onChange={(p) => setQuery({ ...query, page: p })}
//       />

//       <UserFormModal
//         open={openForm}
//         onClose={() => {
//           setOpenForm(false);
//           setSelected(null);
//         }}
//         onSubmit={handleSubmit}
//         initialData={selected}
//         role="pelanggan"
//       />

//       <DetailUserModal
//         open={!!selected && !openForm}
//         data={selected}
//         onClose={() => setSelected(null)}
//         title="Detail Pelanggan"
//       />
//     </div>
//   );
// }