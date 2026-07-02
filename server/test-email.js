import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function main() {
  try {
    console.log("=================================");
    console.log("RESEND EMAIL TEST");
    console.log("=================================\n");

    console.log("API KEY:",
      process.env.RESEND_API_KEY
        ? "✅ TERDETEKSI"
        : "❌ TIDAK ADA"
    );

    const { data, error } = await resend.emails.send({
      from: "FLORALESS <onboarding@resend.dev>",
      to: "kaisarsimaa22@gmail.com",
      subject: "Testing Email Resend",
      html: `
        <h2>Halo 👋</h2>
        <p>Email ini berhasil dikirim menggunakan <b>Resend</b>.</p>
        <p>Jika email ini masuk berarti konfigurasi Railway/Node sudah benar.</p>
      `,
    });

    if (error) {
      console.error("\n❌ Gagal mengirim email");
      console.error(error);
      return;
    }

    console.log("\n✅ Email berhasil dikirim!");
    console.log(data);
  } catch (err) {
    console.error("\n❌ ERROR");
    console.error(err);
  }
}

main();