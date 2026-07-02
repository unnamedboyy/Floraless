import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function main() {
  try {
    console.clear();

    console.log("==========================================");
    console.log("         RESEND EMAIL TEST");
    console.log("==========================================");

    console.log("API KEY :", process.env.RESEND_API_KEY ? "✅ OK" : "❌ TIDAK ADA");
    console.log("FROM    :", process.env.EMAIL_FROM);
    console.log("TO      :", "kaisarsimaa22@gmail.com");
    console.log("------------------------------------------");

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: ["kaisarsimaa22@gmail.com"],
      subject: "Testing Email FLORALESS 🚀",
      html: `
        <div style="font-family:Arial;padding:30px">
            <h2>🎉 Testing Berhasil</h2>

            <p>
                Email ini berhasil dikirim menggunakan
                <b>Resend API</b>.
            </p>

            <hr>

            <p>
                Jika email ini masuk, berarti konfigurasi
                domain, Railway, dan Resend sudah benar.
            </p>

            <p>
                Selanjutnya sistem FLORALESS sudah siap
                mengirim email kepada pelanggan.
            </p>

            <br>

            <small>
                Generated at :
                ${new Date().toLocaleString("id-ID")}
            </small>

        </div>
      `,
    });

    if (error) {
      console.log("\n❌ GAGAL MENGIRIM EMAIL");
      console.log(error);
      return;
    }

    console.log("\n✅ EMAIL BERHASIL DIKIRIM");
    console.log("Email ID :", data.id);

  } catch (err) {

    console.log("\n❌ ERROR");

    console.error(err);

  }
}

main();