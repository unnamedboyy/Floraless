"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { apiFetch } from "@/lib/api";
import { Search, CalendarDays } from "lucide-react";
import TicketDetailModal from "@/components/TicketDetailModal";
import TestimoniModal from "@/components/TestimoniModal";

type TicketType = {
  _id: string;
  layanan?: {
    nama_layanan?: string;
    gambar?: string;
  };
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "fully_paid"
    | "selesai";
  createdAt?: string;
};

export default function UserTicketsPage() {

  const [tickets,setTickets] = useState<TicketType[]>([]);
  const [filteredTickets,setFilteredTickets] = useState<TicketType[]>([]);
  const [loading,setLoading] = useState(true);

  const [search,setSearch] = useState("");
  const [offset,setOffset] = useState(0);

  const [selectedTicket,setSelectedTicket] = useState<TicketType | null>(null);
  const [testimoniTicket,setTestimoniTicket] = useState<string | null>(null);



  async function loadTickets(){

    try{

      const data = await apiFetch("/ticket/user/my");
      setTickets(data);
      setFilteredTickets(data);

    }catch(err){

      console.error(err);

    }finally{

      setLoading(false);

    }

  }



  useEffect(()=>{

    loadTickets();

  },[]);



  useEffect(()=>{

    const handleScroll=()=>setOffset(window.scrollY);

    window.addEventListener("scroll",handleScroll);

    return ()=>window.removeEventListener("scroll",handleScroll);

  },[]);



  useEffect(()=>{

    let result=[...tickets];

    if(search){

      result=result.filter(t=>
        t.layanan?.nama_layanan
        ?.toLowerCase()
        .includes(search.toLowerCase())
      );

    }

    setFilteredTickets(result);

  },[search,tickets]);



 function getProgress(status: string) {

  switch (status) {

    case "pending":
      return { value: 10, color: "bg-[#C9AE63]" };

    case "approved":
      return { value: 25, color: "bg-[#C9AE63]" };

    case "dp1_paid":
      return { value: 40, color: "bg-[#C9AE63]" };

    case "dp2_paid":
      return { value: 60, color: "bg-[#C9AE63]" };

    case "fully_paid":
      return { value: 80, color: "bg-[#C9AE63]" };

    case "event_done":
      return { value: 95, color: "bg-[#C9AE63]" };

    case "selesai":
      return { value: 100, color: "bg-[#C9AE63]" };

    case "rejected":
      return { value: 100, color: "bg-[#C9AE63]" };

    default:
      return { value: 0, color: "bg-gray-400" };

  }

}



function statusText(status: string) {

  switch (status) {

    case "pending":
      return "Menunggu Persetujuan";

    case "approved":
      return "Disetujui";

    case "dp1_paid":
      return "DP 1 Dibayar";

    case "dp2_paid":
      return "DP 2 Dibayar";

    case "fully_paid":
      return "Pelunasan Selesai";

    case "event_done":
      return "Acara Selesai";

    case "selesai":
      return "Transaksi Selesai";

    case "rejected":
      return "Ditolak";

    default:
      return status;

  }

}



  return(

    <div className="bg-white">

      {/* HERO */}
      <section className="relative h-[520px] overflow-hidden">

        <div
          className="absolute inset-0 scale-110"
          style={{ transform:`translateY(${offset*0.35}px)` }}
        >

          <Image
            src="/hero.jpg"
            alt="Tickets"
            fill
            className="object-cover"
            priority
          />

        </div>

        <div className="absolute inset-0 bg-black/50"/>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-5xl md:text-7xl font-semibold text-white leading-tight tracking-tight">
            Transaksi Anda
          </h1>
        </div>

      </section>



      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* SEARCH */}
        <div className="relative mb-12">

          <Search size={16} className="absolute left-4 top-3 text-neutral-400"/>

          <input
            placeholder="Cari layanan..."
            className="w-full border border-neutral-200 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-neutral-400"
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />

        </div>



        {/* LIST */}
        <div className="space-y-8">

          {loading && (
            <p className="text-neutral-400 text-sm">
              Memuat data pesanan...
            </p>
          )}

          {filteredTickets.map(ticket=>{

            const progress=getProgress(ticket.status);

            return(

              <div
                key={ticket._id}
                onClick={()=>setSelectedTicket(ticket)}
                className="
                bg-white
                border
                border-neutral-200
                rounded-2xl
                p-6
                shadow-sm
                hover:shadow-lg
                transition
                cursor-pointer
                "
              >

                {/* HEADER */}
                <div className="flex justify-between items-start mb-6">

                  <div className="flex gap-4">

                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-neutral-100">

                      <Image
                        src={ticket.layanan?.gambar || "/hero.jpg"}
                        alt="layanan"
                        fill
                        className="object-cover"
                      />

                    </div>


                    <div>

                      <p className="text-sm text-neutral-400">
                        Floraless Event
                      </p>

                      <h3 className="text-lg font-semibold">

                        {ticket.layanan?.nama_layanan || "Booking Acara"}

                      </h3>

                      <p className="text-sm text-neutral-500">
                        ID #{ticket._id.slice(-6)}
                      </p>

                    </div>

                  </div>


                  <div className="text-right text-sm text-neutral-500">

                    <div className="flex items-center gap-1 justify-end">

                      <CalendarDays size={14}/>

                      {ticket.createdAt &&
                        new Date(ticket.createdAt)
                        .toLocaleDateString("id-ID")}

                    </div>

                  </div>

                </div>



                {/* STATUS */}
                <div className="flex justify-between items-center mb-2 text-sm">

                  <span className="text-neutral-500">
                    Status
                  </span>

                  <span className="font-medium">
                    {statusText(ticket.status)}
                  </span>

                </div>



                {/* PROGRESS BAR */}
                <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">

                  <div
                    className={`${progress.color} h-full transition-all duration-700`}
                    style={{ width:`${progress.value}%` }}
                  />

                </div>



                {/* FOOTER */}
                <div className="flex justify-between mt-4 text-sm text-neutral-400">

                  <span>
                    Progress
                  </span>

                  <span>
                    {progress.value}%
                  </span>

                </div>



                {/* ACTION */}
                {ticket.status==="fully_paid" &&(

                  <div className="mt-6">

                    <button
                      onClick={(e)=>{
                        e.stopPropagation();
                        setTestimoniTicket(ticket._id);
                      }}
                      className="
                      text-sm
                      px-4
                      py-2
                      bg-[#C9AE63]
                      text-white
                      rounded-full
                      hover:opacity-90
                      "
                    >
                      Berikan Testimoni
                    </button>

                  </div>

                )}

              </div>

            );

          })}

        </div>

      </div>



      {/* MODALS */}
      {selectedTicket &&(

        <TicketDetailModal
          ticket={selectedTicket}
          onClose={()=>setSelectedTicket(null)}
        />

      )}

      {testimoniTicket &&(

        <TestimoniModal
          ticketId={testimoniTicket}
          onClose={()=>setTestimoniTicket(null)}
          onSuccess={loadTickets}
        />

      )}

    </div>

  );

}