import App from "@/App";
import logoTicketIdeal from "@/assets/logo-ticket-ideal.png";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AppInput } from "@/components/ui/appInput";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { LoginFormData, loginSchema } from "@/schemas/loginSchema";
import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from "@/schemas/resetPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Mail } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);

  const { signIn, resetPassword, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const formLogin = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const formReset = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const { error } = await resetPassword(resetEmail);
    
    if (error) {
      setError("Erro ao enviar email de recuperação");
    } else {
      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir a senha",
      });
      setShowResetForm(false);
      setResetEmail("");
    }
    
    setLoading(false);
  };
  
  const onSubmitLogin = async (data: LoginFormData) => {
    setLoading(true);
    setError("");
    
    const { error } = await signIn(data.email, data.password);
    
    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        setError("Email ou senha incorretos");
      } else if (error.message.includes("Email not confirmed")) {
        setError("Confirme seu email antes de fazer login");
      } else {
        setError("Erro ao fazer login. Tente novamente.");
      }
    } else {
      toast({
        title: "Login realizado!",
        description: "Bem-vindo ao Ticket Ideal",
      });
    }
  };

  const onSubmitReset = (data: ResetPasswordFormData) => {
    console.log(data);
  };

  if (showResetForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
        <Card className="w-full max-w-md shadow-large">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Recuperar Senha
            </CardTitle>
            <CardDescription>
              Digite seu email para receber o link de recuperação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormProvider {...formReset}>
              <form
                onSubmit={formReset.handleSubmit(onSubmitReset)}
                className="space-y-4"
              >
                {error && (
                  <Alert className="border-destructive bg-destructive/10">
                    <AlertDescription className="text-destructive">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <AppInput
                  id="reset-email"
                  name="resetEmail"
                  label="Email"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar Link de Recuperação"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setShowResetForm(false)}
                >
                  Voltar ao Login
                </Button>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md shadow-large">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-24 h-24 flex items-center justify-center">
            <img
              src={logoTicketIdeal}
              alt="Ticket Ideal"
              className="w-full h-full object-contain"
            />
          </div>
          <CardDescription>Faça login para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <FormProvider {...formLogin}>
              <form
                onSubmit={formLogin.handleSubmit(onSubmitLogin)}
                className="space-y-4"
              >
                {error && (
                  <Alert className="border-destructive bg-destructive/10">
                    <AlertDescription className="text-destructive">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <AppInput
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  register={formLogin.register}
                  error={formLogin.formState.errors.email}
                />

                <AppInput
                  id="password"
                  name="password"
                  label="Senha"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  register={formLogin.register}
                  error={formLogin.formState.errors.password}
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm text-muted-foreground hover:text-primary"
                    onClick={() => setShowResetForm(true)}
                  >
                    Esqueceu sua senha?
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>

          <Separator className="my-6" />

          <div className="text-center text-sm text-muted-foreground">
            <Link
              to="/"
              className="text-primary hover:text-primary-dark transition-colors"
            >
              ← Voltar ao início
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
