import { useState } from 'react';
import { createFileRoute, Link, redirect, useNavigate } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { loginWithDni } from '@/lib/portal/auth.functions';
import { portalHead, validDni, normalizeDni } from '@/lib/portal/rules';
import cover from '@/assets/hero-adassa.jpg';
export const Route = createFileRoute('/auth')({
  head: () => portalHead('Acceso alumnos', 'Inicia sesión con tu DNI en el portal privado de Autoescuela Adassa.'),
  ssr: false,
  beforeLoad: async () => { const { data } = await supabase.auth.getUser(); if (data.user) throw redirect({ to: '/alumnos/tienda' }); },
  component: Login,
});
function Login() {
  const [dni, setDni] = useState(''); const [password, setPassword] = useState(''); const [visible, setVisible] = useState(false); const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const [forgot, setForgot] = useState(false); const [email, setEmail] = useState(''); const [sent, setSent] = useState(false);
  const login = useServerFn(loginWithDni); const navigate = useNavigate(); const queries = useQueryClient();
  return <main className="grid min-h-screen lg:grid-cols-2"><section className="flex flex-col px-6 py-7 sm:px-12"><Button asChild variant="ghost" className="w-fit"><Link to="/"><ArrowLeft />Volver a la web</Link></Button><div className="mx-auto my-auto w-full max-w-sm py-12"><img src="/logo-adassa.png" alt="Autoescuela Adassa" className="mb-7 size-16 object-contain" /><p className="mb-3 text-sm font-semibold text-primary-dark">AUTOESCUELA ADASSA</p><h1 className="text-3xl font-bold tracking-normal">{forgot ? 'Recupera tu acceso' : 'Tu camino empieza aquí.'}</h1><p className="mb-8 mt-3 text-sm text-muted-foreground">{forgot ? 'Introduce el email registrado en la autoescuela.' : 'Bienvenido a tu área de alumno.'}</p>
    <form className="space-y-5" onSubmit={async e => { e.preventDefault(); setError(''); setBusy(true); try {
      if (forgot) { const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` }); if (resetError) throw new Error('No se pudo solicitar el correo. Inténtalo de nuevo.'); setSent(true); }
      else { if (!validDni(dni)) throw new Error('Introduce un DNI válido, con su letra.'); const result = await login({ data: { dni, password } }); if ('error' in result) throw new Error(result.error); const { error: sessionError } = await supabase.auth.setSession(result); if (sessionError) throw sessionError; queries.clear(); await navigate({ to: '/alumnos/tienda', replace: true }); }
    } catch (err) { setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión.'); } finally { setBusy(false); } }}>
      {forgot ? <label className="block space-y-2 text-sm font-semibold"><span>Email</span><Input className="h-12 bg-card" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></label> : <><label className="block space-y-2 text-sm font-semibold"><span>DNI</span><Input className="h-12 bg-card" name="dni" autoComplete="username" placeholder="12345678Z" required maxLength={20} value={dni} onChange={e => setDni(normalizeDni(e.target.value))} /></label><label className="block space-y-2 text-sm font-semibold"><span>Contraseña</span><div className="relative"><Input className="h-12 bg-card pr-12" type={visible ? 'text' : 'password'} name="password" autoComplete="current-password" required maxLength={128} value={password} onChange={e => setPassword(e.target.value)} /><Button type="button" size="icon" variant="ghost" className="absolute right-1 top-1.5" aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'} onClick={() => setVisible(v => !v)}>{visible ? <EyeOff /> : <Eye />}</Button></div></label></>}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}{sent && <p role="status" className="text-sm text-primary-dark">Si el email está registrado, recibirás un enlace para recuperar tu contraseña.</p>}
      <Button className="min-h-12 w-full" disabled={busy || sent} type="submit">{busy ? <LoaderCircle className="animate-spin" /> : <ArrowRight />}{forgot ? 'Enviar enlace' : 'Entrar a mi cuenta'}</Button>
    </form><Button variant="link" className="mt-3 px-0" onClick={() => { setForgot(v => !v); setError(''); setSent(false); }}>{forgot ? 'Volver a iniciar sesión' : '¿Has olvidado tu contraseña?'}</Button><div className="mt-8 border-t pt-6"><p className="text-xs leading-relaxed text-muted-foreground">{forgot ? '¿No recuerdas tu email? Contacta con la autoescuela.' : 'La autoescuela crea tu cuenta y te envía una invitación por email. ¿Todavía no la tienes? Contacta con nosotros.'}</p></div></div><p className="flex items-center justify-center gap-2 text-xs text-muted-foreground"><LockKeyhole className="size-3" />Área privada de alumnos</p></section><section className="relative hidden min-h-screen overflow-hidden lg:block"><img src={cover} alt="Formación de conducción en Autoescuela Adassa" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-x-0 bottom-0 bg-graphite/95 p-10 text-graphite-foreground"><p className="text-sm font-semibold">NOS VEMOS EN LA CARRETERA</p><h2 className="mt-3 text-3xl font-bold tracking-normal">Cada práctica,<br />un paso más cerca.</h2></div></section></main>;
}
