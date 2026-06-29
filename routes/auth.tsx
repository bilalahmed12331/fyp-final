import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, roleHome, type AppRole } from "@/lib/auth";
import { toast } from "sonner";
import { Loader2, Heart } from "lucide-react";

const searchSchema = z.object({
  tab: z.enum(["login", "register"]).optional(),
});

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in or Register — LifeLink" },
      { name: "description", content: "Sign in or register on LifeLink to donate blood, request blood, or manage your hospital network." },
    ],
  }),
  validateSearch: searchSchema,
  component: AuthPage,
});

const BLOOD_GROUPS = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];
const ROLES: { value: AppRole; label: string; desc: string }[] = [
  { value: "donor", label: "Donor", desc: "I want to donate blood" },
  { value: "patient", label: "Patient", desc: "I need to request blood" },
  { value: "hospital", label: "Hospital", desc: "I manage a hospital" },
  { value: "admin", label: "Admin", desc: "Platform administrator" },
];

function AuthPage() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" });
  const [tab, setTab] = useState<"login" | "register">(search.tab ?? "login");

  useEffect(() => {
    if (!loading && user && role) {
      navigate({ to: roleHome(role) as "/dashboard/donor", replace: true });
    }
  }, [user, role, loading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-soft flex flex-col">
      <div className="container mx-auto px-4 py-6">
        <Link to="/" className="inline-flex"><Logo size={36} /></Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-10">
        <Card className="w-full max-w-xl shadow-elegant border-border/60">
          <CardContent className="p-6 md:p-8">
            <div className="text-center mb-6">
              <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-primary shadow-elegant mb-3">
                <Heart className="size-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold">Welcome to LifeLink</h1>
              <p className="text-sm text-muted-foreground mt-1">Bridging Life, One Donation at a Time</p>
            </div>

            <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "register")}>
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="login">Log in</TabsTrigger>
                <TabsTrigger value="register">Create account</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="mt-6">
                <LoginForm />
              </TabsContent>
              <TabsContent value="register" className="mt-6">
                <RegisterForm onDone={() => setTab("login")} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back!");
    // AuthProvider + AuthPage effect will redirect to the role dashboard
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="login-email">Email</Label>
        <Input id="login-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      </div>
      <div>
        <Label htmlFor="login-password">Password</Label>
        <Input id="login-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
      </div>
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox checked={remember} onCheckedChange={(v) => setRemember(!!v)} /> Remember me
        </label>
        <button type="button" onClick={() => toast.info("Password reset email coming soon.")} className="text-primary hover:underline">
          Forgot password?
        </button>
      </div>
      <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground shadow-elegant" disabled={busy}>
        {busy ? <Loader2 className="size-4 animate-spin mr-2" /> : null} Log in
      </Button>
    </form>
  );
}

function RegisterForm({ onDone }: { onDone: () => void }) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", city: "",
    password: "", confirm: "", role: "donor" as AppRole, agree: false,
  });
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof form, v: any) => setForm((s) => ({ ...s, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error("Passwords do not match");
    if (form.password.length < 8) return toast.error("Password must be at least 8 characters");
    if (!form.agree) return toast.error("You must accept the Terms & Privacy Policy");

    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          name: form.name,
          phone: form.phone,
          role: form.role,
        },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Account created! Signing you in…");
    onDone();
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <Label>Full name</Label>
          <Input required value={form.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} />
        </div>
        <div>
          <Label>Mobile</Label>
          <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+92 300 0000000" />
        </div>
        <div className="col-span-2">
          <Label>City</Label>
          <Input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="e.g., Lahore" />
        </div>
        <div>
          <Label>Password</Label>
          <Input type="password" required value={form.password} onChange={(e) => set("password", e.target.value)} />
        </div>
        <div>
          <Label>Confirm password</Label>
          <Input type="password" required value={form.confirm} onChange={(e) => set("confirm", e.target.value)} />
        </div>
        <div className="col-span-2">
          <Label>Sign up as</Label>
          <div className="grid grid-cols-2 gap-2 mt-1.5">
            {ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => set("role", r.value)}
                className={`text-left rounded-lg border p-3 transition-all ${form.role === r.value ? "border-primary bg-accent shadow-soft" : "border-border hover:border-primary/50"}`}
              >
                <div className="text-sm font-semibold">{r.label}</div>
                <div className="text-xs text-muted-foreground">{r.desc}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="col-span-2">
          <label className="flex items-start gap-2 text-sm cursor-pointer">
            <Checkbox checked={form.agree} onCheckedChange={(v) => set("agree", !!v)} className="mt-0.5" />
            <span>I accept the <a className="text-primary underline" href="#">Terms & Conditions</a> and <a className="text-primary underline" href="#">Privacy Policy</a>.</span>
          </label>
        </div>
      </div>
      <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground shadow-elegant h-11" disabled={busy}>
        {busy ? <Loader2 className="size-4 animate-spin mr-2" /> : null} Create Account
      </Button>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-3 text-muted-foreground">OR</span></div>
      </div>
      <Button
        type="button"
        variant="outline"
        className="w-full h-11 border-border hover:bg-accent/30"
        onClick={async () => {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: `${window.location.origin}/` },
          });
          if (error) toast.error(error.message);
        }}
      >
        <svg className="size-4 mr-2" viewBox="0 0 24 24"><path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" opacity=".85"/><path fill="#fff" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" opacity=".7"/><path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" opacity=".55"/></svg>
        Continue with Google
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button type="button" onClick={onDone} className="text-primary hover:underline font-medium">Log in</button>
      </p>
    </form>
  );
}
