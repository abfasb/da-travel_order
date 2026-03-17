import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="shadow-lg"> {/* Added a bit of shadow for depth */}
        <CardHeader className="text-center pt-8">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription className="text-base">
            Login with your Google account or email
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-8 pt-4"> {/* Increased padding here */}
          <form>
            <FieldGroup className="gap-5"> {/* Increased gap between fields */}
              <Field>
                <Button variant="outline" type="button" className="w-full h-11 text-base">
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
                  placeholder="m@example.com"
                  required
                  className="h-11"
                />
              </Field>

             <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" className="text-sm font-semibold">
                    Password
                  </FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input id="password" type="password" required className="h-11" />
              </Field>

              <Field className="pt-2">
                <Button type="submit" className="w-full h-11 text-base font-semibold">
                  Login
                </Button>
                <FieldDescription className="text-center mt-4 text-sm">
                  Don&apos;t have an account? <a href="/registration" className="text-primary font-medium hover:underline">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      
      <FieldDescription className="px-6 text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our <a href="#" className="underline">Terms of Service</a>{" "}
        and <a href="#" className="underline">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}