import Image from "next/image"
import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/login-form" 
import BgLogo from "@/assets/bg-login.png"

export default function LoginPage() {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10 overflow-hidden">
      
      <Image
        src={BgLogo}
        alt="Department of Agriculture background"
        fill
        quality={100}
        priority
        className="object-cover"
      />
      
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      <div className="relative z-10 flex w-full max-w-md flex-col gap-8"> 
        
        <div className="flex items-center gap-3 self-center font-bold text-2xl text-white drop-shadow-md">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMVJJK1z4PWdaWJG9ArC6U45RvjxMJsEZVKQ&s" 
          alt="Logo"  className="flex size-10 items-center justify-center rounded-full  text-white shadow-lg border border-emerald-500/50">
          </img>
          Department of Agriculture
        </div>
        
        <LoginForm />

        <div className="text-center text-xs text-white/80">
          By clicking continue, you agree to our <a href="#" className="underline hover:text-white">Terms of Service</a>{" "}
          and <a href="#" className="underline hover:text-white">Privacy Policy</a>.
        </div>
      </div>
      
    </div>
  )
}