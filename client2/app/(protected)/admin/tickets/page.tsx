"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

type Ticket = {
  _id: string;
  status: string;
  info_acara?: string;
  createdAt: string;

  pelanggan?: {
    _id: string;
    username?: string;
  } | null;

  layanan?: {
    _id: string;
    nama_layanan?: string;
    harga?: number;
  } | null;
};

export default function AdminTicketsPage() {

  const API = process.env.NEXT_PUBLIC_API_URL;

  const [tickets,setTickets] = useState<Ticket[]>([]);
  const [loading,setLoading] = useState(true);

  const [search,setSearch] = useState("");
  const [filter,setFilter] = useState("all");

  const [selected,setSelected] = useState<any>(null);
  const [detail,setDetail] = useState<any>(null);



  async function load(){

    setLoading(true);

    const res = await fetch(`${API}/ticket`,{
      credentials:"include"
    });

    const data = await res.json();

    setTickets(data);
    setLoading(false);

  }

  useEffect(()=>{
    load();
  },[]);



  /* SEARCH + FILTER */

  const filtered = useMemo(()=>{

    return tickets.filter((t)=>{

      const username =
        t.pelanggan?.username?.toLowerCase() || "";

      const layanan =
        t.layanan?.nama_layanan?.toLowerCase() || "";

      const matchSearch =
        username.includes(search.toLowerCase()) ||
        layanan.includes(search.toLowerCase());

      const matchFilter =
        filter==="all" ? true : t.status===filter;

      return matchSearch && matchFilter;

    });

  },[tickets,search,filter]);



  /* METRICS */

  const metrics = {

    pending: tickets.filter(t=>t.status==="pending").length,
    approved: tickets.filter(t=>t.status==="approved").length,
    rejected: tickets.filter(t=>t.status==="rejected").length,

  };



  /* STATUS PROGRESS */

  function getProgress(status:string){

    switch(status){

      case "pending": return 10;
      case "approved": return 25;
      case "dp1_paid": return 40;
      case "dp2_paid": return 60;
      case "fully_paid": return 80;
      case "event_done": return 95;
      case "selesai": return 100;
      case "rejected": return 100;

      default: return 0;

    }

  }



  /* UPDATE STATUS */

  async function updateStatus(id:string,status:string){

    await fetch(`${API}/ticket/${id}/status`,{
      method:"PATCH",
      credentials:"include",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ status }),
    });

    load();

  }



  /* OPEN DETAIL */

  async function openDetail(ticket:Ticket){

    setSelected(ticket);

    const res = await fetch(`${API}/ticket/${ticket._id}`,{
      credentials:"include"
    });

    const data = await res.json();

    setDetail(data);

  }



  function badge(status:string){

    switch(status){

      case "approved":
        return "bg-emerald-50 text-emerald-600";

      case "pending":
        return "bg-amber-50 text-amber-600";

      case "rejected":
        return "bg-red-50 text-red-600";

      default:
        return "bg-neutral-100 text-neutral-600";

    }

  }



  return(

    <div className="bg-neutral-100 min-h-screen">

      <div className="p-10 space-y-10">


        {/* HEADER */}

        <div>

          <h1 className="text-3xl font-semibold">
            Ticket Management
          </h1>

          <p className="text-sm text-neutral-500 mt-2">
            Monitor dan kelola semua pemesanan pelanggan
          </p>

        </div>



        {/* METRICS */}

        <div className="grid grid-cols-3 gap-6">

          <Metric title="Pending Booking" value={metrics.pending}/>
          <Metric title="Approved Booking" value={metrics.approved}/>
          <Metric title="Rejected Booking" value={metrics.rejected}/>

        </div>



        {/* SEARCH + FILTER */}

        <div className="flex items-center gap-4">

          <div className="relative flex-1">

            <Search
              size={16}
              className="absolute left-3 top-3 text-neutral-400"
            />

            <input
              placeholder="Search username atau layanan..."
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              className="w-full border border-neutral-200 rounded-lg pl-9 pr-4 py-2 text-sm"
            />

          </div>

          <select
            value={filter}
            onChange={(e)=>setFilter(e.target.value)}
            className="border border-neutral-200 rounded-lg px-4 py-2 text-sm"
          >

            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>

          </select>

        </div>



        {/* CARD LIST */}

        {loading ? (

          <p className="text-neutral-500">
            Loading tickets...
          </p>

        ) : (

          <div className="grid gap-6">

            {filtered.map((t)=>{

              const progress = getProgress(t.status);

              return(

                <div
                  key={t._id}
                  className="
                  bg-white
                  border border-neutral-200
                  rounded-2xl
                  p-6
                  hover:shadow-lg
                  transition
                  "
                >

                  {/* HEADER */}

                  <div className="flex justify-between items-start">

                    <div>

                      <p className="font-medium">
                        {t.pelanggan?.username || "Unknown"}
                      </p>

                      <p className="text-sm text-neutral-500">
                        {t.layanan?.nama_layanan}
                      </p>

                      <p className="text-sm text-neutral-500">
                        Rp {t.layanan?.harga?.toLocaleString() || "-"}
                      </p>

                    </div>

                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${badge(t.status)}`}
                    >
                      {t.status}
                    </span>

                  </div>



                  {/* PROGRESS */}

                  <div className="mt-6">

                    <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">

                      <div
                        className="bg-[#C9AE63] h-full transition-all duration-700"
                        style={{ width:`${progress}%` }}
                      />

                    </div>

                    <div className="flex justify-between mt-2 text-xs text-neutral-400">

                      <span>Progress</span>
                      <span>{progress}%</span>

                    </div>

                  </div>



                  {/* ACTION */}
                  <div className="flex justify-end gap-3 mt-6">

                    {t.status==="pending" &&(

                      <>
                        <button
                          onClick={()=>updateStatus(t._id,"approved")}
                          className="
                          text-xs
                          px-4 py-2
                          rounded-lg
                          bg-[#C9AE63]
                          text-white
                          hover:bg-[#bda35c]
                          transition
                          "
                        >
                          Approve
                        </button>

                        <button
                          onClick={()=>updateStatus(t._id,"rejected")}
                          className="
                          text-xs
                          px-4 py-2
                          rounded-lg
                          border
                          border-neutral-300
                          text-neutral-600
                          hover:bg-neutral-100
                          transition
                          "
                        >
                          Reject
                        </button>
                      </>

                    )}

                    <button
                      onClick={()=>openDetail(t)}
                      className="
                      text-xs
                      px-4 py-2
                      rounded-lg
                      border
                      border-neutral-300
                      text-neutral-700
                      hover:bg-neutral-50
                      transition
                      "
                    >
                      Detail
                    </button>

                  </div>

                </div>

              );

            })}

          </div>

        )}

      </div>



      {/* MODAL */}

      {selected && detail && (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white rounded-3xl p-10 w-full max-w-2xl shadow-2xl">

            {/* HEADER */}
            <div className="flex items-start justify-between mb-8">

              <div>

                <h2 className="text-2xl font-semibold text-neutral-800">
                  Ticket Detail
                </h2>

                <p className="text-sm text-neutral-400 mt-1">
                  Informasi lengkap pemesanan pelanggan
                </p>

              </div>
            </div>


            {/* CONTENT GRID */}
            <div className="grid grid-cols-2 gap-x-10 gap-y-6 text-sm">

              <div>
                <p className="text-neutral-400 text-xs mb-1">
                  User
                </p>

                <p className="text-neutral-800 font-medium">
                  {detail.ticket.pelanggan?.username}
                </p>
              </div>


              <div>
                <p className="text-neutral-400 text-xs mb-1">
                  Status
                </p>

                <span className="
                inline-flex
                items-center
                px-3
                py-1
                rounded-full
                text-xs
                font-medium
                bg-neutral-100
                text-neutral-700
                ">
                  {detail.ticket.status}
                </span>
              </div>


              <div>
                <p className="text-neutral-400 text-xs mb-1">
                  Layanan
                </p>

                <p className="text-neutral-800 font-medium">
                  {detail.ticket.layanan?.nama_layanan}
                </p>
              </div>


              <div>
                <p className="text-neutral-400 text-xs mb-1">
                  Ticket ID
                </p>

                <p className="text-neutral-700 font-mono">
                  #{detail.ticket._id.slice(-6)}
                </p>
              </div>


              <div className="col-span-2">

                <p className="text-neutral-400 text-xs mb-1">
                  Info Acara
                </p>

                <div className="
                border
                border-neutral-200
                rounded-xl
                p-4
                text-neutral-700
                bg-neutral-50
                ">
                  {detail.ticket.info_acara || "-"}
                </div>

              </div>

            </div>


            {/* FOOTER */}
            <div className="flex justify-end mt-10">

              <button
                onClick={()=>{
                  setSelected(null);
                  setDetail(null);
                }}
                className="
                px-5
                py-2
                rounded-lg
                border
                border-neutral-300
                text-sm
                text-neutral-700
                hover:bg-neutral-100
                transition
                "
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}



/* METRIC CARD */

function Metric({title,value}:{title:string,value:number}){

  return(

    <div className="bg-white p-6 rounded-2xl shadow-sm">

      <p className="text-sm text-neutral-500">
        {title}
      </p>

      <p className="text-2xl font-semibold mt-2">
        {value}
      </p>

    </div>

  );

}