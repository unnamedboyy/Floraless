"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function AuthPage() {

  const router = useRouter();
  const { login } = useAuth();

  const [mode,setMode] = useState<"login"|"register">("login");
  const [showPassword,setShowPassword] = useState(false);

  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");

  const [nama,setNama] = useState("");
  const [email,setEmail] = useState("");
  const [noTelepon,setNoTelepon] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");

  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);

  const images = ["/gal-1.jpg","/gal-2.jpg","/gal-3.jpg"];
  const [currentImage,setCurrentImage] = useState(0);

  const [mouseX,setMouseX] = useState(0);
  const [mouseY,setMouseY] = useState(0);

  useEffect(()=>{

    const interval = setInterval(()=>{
      setCurrentImage((prev)=> (prev+1)%images.length);
    },6000);

    return ()=>clearInterval(interval);

  },[]);



  function redirectByRole(role:string){

    if(role==="admin"){
      router.replace("/admin/dashboard");
      return;
    }

    router.replace("/");

  }



  async function handleLogin(e:React.FormEvent){

    e.preventDefault();

    if(!username) return setError("Username harus diisi");
    if(!password) return setError("Password harus diisi");

    setError("");
    setLoading(true);

    try{

      const data = await apiFetch("/auth/login",{
        method:"POST",
        body:JSON.stringify({username,password})
      });

      if(!data?.user){
        setError(data?.message || "Login gagal");
        setLoading(false);
        return;
      }

      login({
        id:data.user._id,
        username:data.user.username,
        role:data.user.role
      });

      redirectByRole(data.user.role);

    }catch(err:any){
      setError(err?.message || "Terjadi kesalahan");
    }

    setLoading(false);

  }



  async function handleRegister(e:React.FormEvent){

    e.preventDefault();

    if(!nama) return setError("Nama wajib diisi");
    if(!username) return setError("Username wajib diisi");
    if(!noTelepon) return setError("Nomor telepon wajib diisi");

    if(password.length < 6)
      return setError("Password minimal 6 karakter");

    if(password!==confirmPassword)
      return setError("Password tidak sama");

    setError("");
    setLoading(true);

    try{

      const data = await apiFetch("/auth/register",{
        method:"POST",
        body:JSON.stringify({
          nama,
          email,
          no_telepon:noTelepon,
          username,
          password
        })
      });

      login({
        id:data.user._id,
        username:data.user.username,
        role:data.user.role
      });

      redirectByRole(data.user.role);

    }catch(err:any){
      setError(err?.message || "Terjadi kesalahan");
    }

    setLoading(false);

  }



  function handleMouseMove(e:any){

    const rect = e.currentTarget.getBoundingClientRect();

    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setMouseX(x - 0.5);
    setMouseY(y - 0.5);

  }



  return(

    <div className="min-h-screen flex items-center justify-center bg-neutral-100 p-6">

      <div className="relative w-full max-w-6xl h-[650px] bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">


        {/* IMAGE PANEL */}
        <div
          onMouseMove={handleMouseMove}
          className="relative hidden md:block overflow-hidden"
        >

          {/* SLIDES */}
          {images.map((img,index)=>{

            const active = index===currentImage;

            return(

              <Image
                key={img}
                src={img}
                alt="Floraless"
                fill
                priority={index===0}
                className={`
                object-cover
                transition-all
                duration-[6000ms]
                ease-[cubic-bezier(.22,.61,.36,1)]
                ${active ? "opacity-100 scale-[1.15]" : "opacity-0 scale-[1.05]"}
                `}
                style={{
                  transform:`
                  scale(${active?1.15:1.05})
                  translate(${mouseX*20}px,${mouseY*20}px)
                  `
                }}
              />

            )

          })}


          {/* VIGNETTE */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.5))]"/>


          {/* GRADIENT */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"/>


          {/* NOISE TEXTURE */}
          <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"/>



          {/* TEXT */}
          <div className="absolute bottom-12 left-10 right-10 text-white">

            <h2 className="text-4xl font-semibold leading-tight">
              Wujudkan Dekorasi Impian Anda
            </h2>

            <p className="mt-4 text-white/80">
              Floraless membantu menciptakan dekorasi acara yang elegan,
              sakral, dan tak terlupakan.
            </p>

          </div>



          {/* PROGRESS BAR */}
          <div className="absolute bottom-0 left-0 right-0 flex">

            {images.map((_,i)=>(
              <div
                key={i}
                className={`h-[3px] flex-1 transition-all duration-700
                ${i===currentImage ? "bg-[#C9AE63]" : "bg-white/30"}`}
              />
            ))}

          </div>


        </div>



        {/* FORM AREA */}
        <div className="relative flex items-center justify-center p-12 overflow-hidden">


          {/* LOGIN */}
          <form
            onSubmit={handleLogin}
            className={`absolute w-full max-w-md transition-all duration-700
            ${mode==="login"
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-20 pointer-events-none"
            }`}
          >

            <h2 className="text-3xl font-semibold mb-8 text-black">
              Login
            </h2>

            {error &&(
              <div className="mb-5 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <input
              placeholder="Username"
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-4 py-3 mb-4 outline-none focus:border-[#C9AE63]"
            />

            <div className="relative mb-4">

              <input
                type={showPassword?"text":"password"}
                placeholder="Password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-4 py-3 pr-12 outline-none focus:border-[#C9AE63]"
              />

              <button
                type="button"
                onClick={()=>setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
              >
                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>

            </div>

            <button className="w-full bg-[#C9AE63] text-white py-3 rounded-lg font-semibold hover:bg-[#bda35c] transition">
              {loading ? "Loading..." : "Login"}
            </button>

            <p className="mt-6 text-sm text-neutral-500">
              Belum punya akun?{" "}
              <span
                onClick={()=>setMode("register")}
                className="text-[#C9AE63] cursor-pointer font-medium"
              >
                Register
              </span>
            </p>

          </form>



          {/* REGISTER */}
          <form
            onSubmit={handleRegister}
            className={`absolute w-full max-w-md transition-all duration-700
            ${mode==="register"
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-20 pointer-events-none"
            }`}
          >

            <h2 className="text-3xl font-semibold mb-8 text-black">
              Register
            </h2>

            {error &&(
              <div className="mb-5 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">

              <input
                placeholder="Nama Lengkap"
                value={nama}
                onChange={(e)=>setNama(e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-4 py-3 outline-none focus:border-[#C9AE63]"
              />

              <input
                placeholder="Username"
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-4 py-3 outline-none focus:border-[#C9AE63]"
              />

              <input
                placeholder="Email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-4 py-3 outline-none focus:border-[#C9AE63]"
              />

              <input
                placeholder="No Telepon"
                value={noTelepon}
                onChange={(e)=>setNoTelepon(e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-4 py-3 outline-none focus:border-[#C9AE63]"
              />

            </div>

            <div className="relative mt-4">

              <input
                type={showPassword?"text":"password"}
                placeholder="Password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-4 py-3 pr-12 outline-none focus:border-[#C9AE63]"
              />

              <button
                type="button"
                onClick={()=>setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
              >
                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>

            </div>

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-4 py-3 mt-4 outline-none focus:border-[#C9AE63]"
            />

            <button className="w-full bg-[#C9AE63] text-white py-3 rounded-lg font-semibold mt-6 hover:bg-[#bda35c] transition">
              {loading ? "Processing..." : "Create Account"}
            </button>

            <p className="mt-6 text-sm text-neutral-500">
              Sudah punya akun?{" "}
              <span
                onClick={()=>setMode("login")}
                className="text-[#C9AE63] cursor-pointer font-medium"
              >
                Login
              </span>
            </p>

          </form>

        </div>

      </div>

    </div>

  );

}