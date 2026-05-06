"use client";

import { useState } from "react";

import { useJadwal } from "@/hooks/useJadwal";

import JadwalCalendar from "@/components/jadwal/JadwalCalendar";
import DetailJadwalModal from "@/components/modal/DetailJadwalModal";
export default function PegawaiJadwalPage() {

  const today =
    new Date().toISOString().split("T")[0];

  const [query, setQuery] = useState({
    start: today,
    end: today
  });

  const [selected, setSelected] =
    useState<any>(null);

  const [open, setOpen] =
    useState(false);

  const {
    data,
    loading,
    refetch
  } = useJadwal(query);

  const handleSelect = (event: any) => {
    setSelected(event);
    setOpen(true);
  };

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <h1 className="text-xl font-semibold">
        Jadwal Saya
      </h1>

      {/* FILTER */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4">

        <input
          type="date"
          value={query.start}
          onChange={(e) =>
            setQuery({
              ...query,
              start: e.target.value
            })
          }
          className="border rounded-xl px-3 py-2 text-sm"
        />

        <input
          type="date"
          value={query.end}
          onChange={(e) =>
            setQuery({
              ...query,
              end: e.target.value
            })
          }
          className="border rounded-xl px-3 py-2 text-sm"
        />
      </div>

      {/* CALENDAR */}
      <JadwalCalendar
        data={data}
        onSelect={handleSelect}
      />

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

        <div className="px-4 py-3 border-b text-sm font-medium">
          List Jadwal
        </div>

        {loading ? (
          <div className="p-4 text-sm">
            Loading...
          </div>
        ) : data.length === 0 ? (
          <div className="p-4 text-sm">
            Tidak ada data
          </div>
        ) : (
          <table className="w-full text-sm">

            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">
                  Tanggal
                </th>

                <th className="p-3 text-left">
                  Title
                </th>

                <th className="p-3 text-left">
                  Lokasi
                </th>

                <th className="p-3 text-left">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {data.map((row: any) => (
                <tr
                  key={row._id}
                  className="border-t"
                >

                  <td className="p-3">
                    {new Date(
                      row.tanggal_acara
                    ).toLocaleDateString()}
                  </td>

                  <td className="p-3">
                    {row.title || "-"}
                  </td>

                  <td className="p-3">
                    {row.lokasi || "-"}
                  </td>

                  <td className="p-3">
                    {row.status || "-"}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>

      {/* MODAL */}
      <DetailJadwalModal
        open={open}
        data={selected}
        onClose={() => setOpen(false)}
      />

    </div>
  );
}