import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { normalizeDni, validDni } from './rules';

export const loginWithDni = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => z.object({ dni: z.string().max(20), password: z.string().min(1).max(128) }).parse(input))
  .handler(async ({ data }) => {
    const failure = { error: 'DNI o contraseña incorrectos. Si necesitas ayuda, contacta con la autoescuela.' };
    const dni = normalizeDni(data.dni);
    if (!validDni(dni)) return failure;
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const request = getRequest();
    // CF supplies this header in production. Never trust caller-controlled X-Forwarded-For.
    const ip = request.headers.get('cf-connecting-ip') ?? 'local';
    const digest = async (key: string) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(key)))).map(b => b.toString(16).padStart(2, '0')).join('');
    const [identityLimit, networkLimit] = await Promise.all([supabaseAdmin.rpc('consume_dni_login_attempt', { attempt_key: await digest(`dni:${dni}`) }), supabaseAdmin.rpc('consume_dni_login_attempt', { attempt_key: await digest(`ip:${ip}`) })]);
    if (identityLimit.error || networkLimit.error || !identityLimit.data || !networkLimit.data) return failure;
    const { data: student } = await supabaseAdmin.from('students').select('email').eq('dni', dni).maybeSingle();
    const url = process.env['SUPABASE_URL'];
    const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
    if (!url || !key) throw new Error('Servicio de acceso no disponible.');
    const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    // Same Auth call and same error for missing DNI and incorrect password.
    const { data: auth, error } = await client.auth.signInWithPassword({ email: student?.email ?? 'unregistered@example.invalid', password: data.password });
    if (!student || error || !auth.session) return failure;
    return { access_token: auth.session.access_token, refresh_token: auth.session.refresh_token };
  });

export const inviteStudent = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ fullName: z.string().trim().min(2).max(120), dni: z.string().refine(validDni), email: z.string().email(), redirectTo: z.string().url() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: role } = await context.supabase.from('user_roles').select('role').eq('user_id', context.userId).eq('role', 'admin').maybeSingle();
    if (!role) throw new Error('Solo la autoescuela puede crear alumnos.');
    if (new URL(data.redirectTo).origin !== new URL(getRequest().url).origin || new URL(data.redirectTo).pathname !== '/reset-password') throw new Error('Destino de invitación no válido.');
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data: existing } = await supabaseAdmin.from('students').select('user_id').eq('dni', normalizeDni(data.dni)).maybeSingle();
    if (existing) throw new Error('Este DNI ya está registrado.');
    const { data: invited, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(data.email, { data: { full_name: data.fullName }, redirectTo: data.redirectTo });
    if (error || !invited.user) throw new Error('No se pudo enviar la invitación.');
    const { error: studentError } = await supabaseAdmin.from('students').insert({ user_id: invited.user.id, dni: normalizeDni(data.dni), email: data.email });
    if (studentError) { await supabaseAdmin.auth.admin.deleteUser(invited.user.id); throw new Error('No se pudo registrar el alumno.'); }
    const { error: roleError } = await supabaseAdmin.from('user_roles').insert({ user_id: invited.user.id, role: 'student' });
    if (roleError) { await supabaseAdmin.auth.admin.deleteUser(invited.user.id); throw new Error('No se pudo completar el alta.'); }
    return { success: true };
  });
