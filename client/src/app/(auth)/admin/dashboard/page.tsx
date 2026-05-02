"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import { useTickets } from "../../../../hooks/useTickets";
import { formatRupiah, formatTanggal } from "../../../../lib/format";
import { TICKET_STATUS_LABEL, TICKET_STATUS_COLOR } from "../../../../lib/constants";
import type { TicketStatus } from "../../../../services/ticket.service";

const STAT_COLORS = ["#8b5a2b","#c9956e","#2d6a4f","#a33030"];

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { tickets, isLoading, fetchAll } = useTickets();
  const [now] = useState(new Date());

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Derived stats
  const byStatus = (s: TicketStatus) => tickets.filter(t => t.status === s).length;
  const stats = [
    { label:"Total Ticket",    value: tickets.length,         icon:"📋", color: STAT_COLORS[0] },
    { label:"Menunggu",        value: byStatus("pending"),    icon:"⏳", color: STAT_COLORS[1] },
    { label:"Disetujui",       value: byStatus("approved") + byStatus("in_progress"), icon:"✓", color: STAT_COLORS[2] },
    { label:"Selesai",         value: byStatus("done"),       icon:"🌸", color: STAT_COLORS[3] },
  ];

  const recent = [...tickets].sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime()).slice(0,5);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');
        .db{font-family:'DM Sans',sans-serif;color:#1a1208}
        .dbhead{margin-bottom:28px}
        .dbtitle{font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:400;color:#1a1208;letter-spacing:-.01em;margin-bottom:4px}
        .dbsub{font-size:13.5px;color:#9a8878;font-weight:300}
        .dbsub span{color:#c9956e;font-weight:500}
        /* Stats */
        .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px}
        .stat{background:#fff;border-radius:14px;border:1px solid #e8ddd4;padding:20px 22px;display:flex;align-items:center;gap:16px;transition:box-shadow .2s}
        .stat:hover{box-shadow:0 4px 16px rgba(139,90,43,.1)}
        .stat-icon{width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
        .stat-val{font-size:28px;font-weight:500;line-height:1;margin-bottom:2px}
        .stat-label{font-size:12px;color:#9a8878;font-weight:400}
        /* Recent tickets */
        .section{background:#fff;border-radius:16px;border:1px solid #e8ddd4;overflow:hidden}
        .section-head{padding:18px 22px;border-bottom:1px solid #f0ebe4;display:flex;align-items:center;justify-content:space-between}
        .section-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:400;color:#1a1208}
        .section-link{font-size:12.5px;color:#8b5a2b;text-decoration:none;font-weight:500}
        .section-link:hover{text-decoration:underline}
        .tbl{width:100%;border-collapse:collapse}
        .tbl th{text-align:left;padding:10px 20px;font-size:11px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:#9a8878;border-bottom:1px solid #f0ebe4;background:#fdfcfb}
        .tbl td{padding:13px 20px;border-bottom:1px solid #f7f3ef;font-size:13.5px;vertical-align:middle}
        .tbl tr:last-child td{border-bottom:none}
        .tbl tr:hover td{background:#faf8f5}
        .badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:11.5px;font-weight:500}
        .tname{font-weight:500;color:#1a1208;display:block;margin-bottom:2px}
        .tdate{font-size:12px;color:#9a8878}
        /* Empty */
        .empty{padding:48px;text-align:center;color:#9a8878;font-size:14px}
        /* Loading */
        .loading{padding:48px;text-align:center;color:#c4b8ac;font-size:13px}
        /* Grid 2 col */
        .grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px}
        /* Quick actions */
        .qa{background:#fff;border-radius:16px;border:1px solid #e8ddd4;padding:20px 22px}
        .qa-title{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:400;margin-bottom:16px;color:#1a1208}
        .qa-btn{display:flex;align-items:center;gap:10px;padding:11px 14px;border-radius:10px;border:1.5px solid #e2d8ce;background:#fdfcfb;font-size:13px;font-family:'DM Sans',sans-serif;color:#1a1208;cursor:pointer;transition:all .15s;width:100%;margin-bottom:8px;text-decoration:none}
        .qa-btn:hover{border-color:#c9956e;background:rgba(201,149,110,.05)}
        .qa-btn:last-child{margin-bottom:0}
        .qa-icon{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
        /* Status summary */
        .ss{background:#fff;border-radius:16px;border:1px solid #e8ddd4;padding:20px 22px}
        .ss-title{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:400;margin-bottom:16px;color:#1a1208}
        .ss-row{display:flex;align-items:center;justify-content:space-between;padding:9px 0;border-bottom:1px solid #f0ebe4}
        .ss-row:last-child{border-bottom:none}
        .ss-label{font-size:13px;color:#5a4a3a}
        .ss-count{font-weight:500;font-size:14px;color:#1a1208}
        .ss-bar-wrap{width:80px;height:6px;background:#f0ebe4;border-radius:3px;overflow:hidden;margin:0 12px}
        .ss-bar{height:100%;border-radius:3px;background:linear-gradient(90deg,#8b5a2b,#c9956e)}
        @media(max-width:900px){.stats{grid-template-columns:repeat(2,1fr)}.grid2{grid-template-columns:1fr}}
        @media(max-width:600px){.stats{grid-template-columns:1fr}}
      `}</style>

      <div className="db">
        <div className="dbhead">
          <h1 className="dbtitle">Dashboard Admin</h1>
          <p className="dbsub">
            Selamat datang, <span>{user?.username ?? "Admin"}</span> — {formatTanggal(now.toISOString())}
          </p>
        </div>

        {/* Stats */}
        <div className="stats">
          {stats.map((s, i) => (
            <div className="stat" key={i}>
              <div className="stat-icon" style={{ background: s.color + "18" }}>
                <span>{s.icon}</span>
              </div>
              <div>
                <div className="stat-val" style={{ color: s.color }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Tickets */}
        <div className="section">
          <div className="section-head">
            <span className="section-title">Ticket Terbaru</span>
            <a href="/admin/ticket" className="section-link">Lihat semua →</a>
          </div>
          {isLoading ? (
            <div className="loading">Memuat data ticket...</div>
          ) : recent.length === 0 ? (
            <div className="empty">Belum ada ticket masuk</div>
          ) : (
            <table className="tbl">
              <thead>
                <tr>
                  <th>Pelanggan</th>
                  <th>Layanan</th>
                  <th>Tgl Acara</th>
                  <th>Status</th>
                  <th>PIC</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(t => (
                  <tr key={t._id} style={{ cursor:"pointer" }} onClick={() => window.location.href=`/admin/ticket/${t._id}`}>
                    <td>
                      <span className="tname">{(t as any).pelangkanId?.nama ?? "-"}</span>
                      <span className="tdate">{formatTanggal(t.createdAt)}</span>
                    </td>
                    <td style={{ fontSize:13, color:"#5a4a3a" }}>{(t as any).layananId?.nama ?? "-"}</td>
                    <td style={{ fontSize:13, color:"#5a4a3a" }}>
                      {(t as any).detail?.tanggal_acara ? formatTanggal((t as any).detail.tanggal_acara) : "-"}
                    </td>
                    <td>
                      <span className={`badge ${TICKET_STATUS_COLOR[t.status as TicketStatus]}`}>
                        {TICKET_STATUS_LABEL[t.status as TicketStatus]}
                      </span>
                    </td>
                    <td style={{ fontSize:13, color:"#5a4a3a" }}>{(t as any).pegawaiId?.nama ?? <span style={{color:"#c4b8ac"}}>Belum ditugaskan</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Bottom grid */}
        <div className="grid2">
          {/* Status summary */}
          <div className="ss">
            <div className="ss-title">Rekap Status Ticket</div>
            {(["pending","approved","in_progress","done","rejected"] as TicketStatus[]).map(s => {
              const count = byStatus(s);
              const pct = tickets.length ? Math.round(count/tickets.length*100) : 0;
              return (
                <div className="ss-row" key={s}>
                  <span className="ss-label">{TICKET_STATUS_LABEL[s]}</span>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div className="ss-bar-wrap"><div className="ss-bar" style={{width:pct+"%"}}/></div>
                    <span className="ss-count">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick actions */}
          <div className="qa">
            <div className="qa-title">Aksi Cepat</div>
            {[
              { href:"/admin/ticket/buat",  icon:"➕", label:"Buat Ticket Baru",       bg:"#f0faf4", color:"#2d6a4f" },
              { href:"/admin/pelanggan",    icon:"👥", label:"Kelola Pelanggan",        bg:"#eff6ff", color:"#1e40af" },
              { href:"/admin/pegawai",      icon:"👤", label:"Kelola Pegawai",          bg:"#faf5ff", color:"#6b21a8" },
              { href:"/admin/layanan",      icon:"🌸", label:"Kelola Layanan",          bg:"#fff7ed", color:"#92400e" },
              { href:"/admin/kalender",     icon:"📅", label:"Lihat Kalender",          bg:"#f0faf4", color:"#2d6a4f" },
              { href:"/admin/cashback",     icon:"💰", label:"Proses Cashback",         bg:"#fef9f0", color:"#92400e" },
            ].map(a => (
              <a key={a.href} href={a.href} className="qa-btn">
                <div className="qa-icon" style={{background:a.bg}}>{a.icon}</div>
                <span style={{color:a.color,fontWeight:500}}>{a.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}