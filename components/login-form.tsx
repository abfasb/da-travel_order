"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { loginUser } from "@/app/actions/login"; 
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import BgLogin from '@/assets/bg-login.png'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const toastId = toast.loading("Verifying credentials...");

    const result = await loginUser(formData);

    if (result.success && result.user) {
      toast.success(`Welcome back, ${result.user.name}!`, { id: toastId });
      
      const userRole = result.user.role;
      let targetRoute = "/employee/dashboard";

      if (userRole === "ADMIN") {
        targetRoute = "/admin/dashboard";
      } else if (userRole === "HR") {
        targetRoute = "/hr/dashboard";
      } else if (
        userRole === "CHIEF_AGRICULTURIST" ||
        userRole === "CHIEF_ADMINISTRATIVE" ||
        userRole === "REGIONAL_EXECUTIVE" ||
        userRole === "APCO"
      ) {
        targetRoute = "/approvals"; 
      }

      router.push(targetRoute);
      
    } else {
      toast.error(result.error || "Login failed.", { id: toastId });
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden", className)} {...props}>
      
      <Image
        src= {BgLogin}
        alt="Department of Agriculture background"
        fill
        quality={100}
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      <div className="relative z-10 w-full max-w-md px-4 flex flex-col gap-6">
        <Card className="shadow-2xl border-0"> 
          <CardHeader className="text-center pt-8">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription className="text-base">
              Department of Agriculture Portal Login
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8 pt-4"> 
            <form onSubmit={handleSubmit}>
              <FieldGroup className="gap-5"> 
                
                <Field>
                  <Button variant="outline" type="button" className="w-full h-11 text-base hover:bg-emerald-50">
                    <svg className="mr-2 size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    Login with Google
                  </Button>
                </Field>

                <FieldSeparator className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest *:data-[slot=field-separator-content]:bg-card">
                  Or continue with
                </FieldSeparator>

                <Field>
                  <FieldLabel htmlFor="email" className="text-sm font-semibold">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@da.gov.ph"
                    required
                    className="h-11"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </Field>

                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password" className="text-sm font-semibold">
                      Password
                    </FieldLabel>
                    <a
                      href="#"
                      className="ml-auto text-sm font-medium text-emerald-700 underline-offset-4 hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    required 
                    className="h-11" 
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </Field>

                <Field className="pt-2">
                  <Button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full h-11 text-base font-semibold bg-emerald-700 hover:bg-emerald-800 text-white"
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                  <FieldDescription className="text-center mt-4 text-sm text-slate-500">
                    Don&apos;t have an account? <a href="/registration" className="text-emerald-700 font-medium hover:underline">Sign up</a>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
        
        <FieldDescription className="px-6 text-center text-xs text-white/80">
          By clicking continue, you agree to our <a href="#" className="underline hover:text-white">Terms of Service</a>{" "}
          and <a href="#" className="underline hover:text-white">Privacy Policy</a>.
        </FieldDescription>
      </div>
    </div>
  )
}