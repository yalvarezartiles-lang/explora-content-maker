import { queryOptions } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
export const studentQuery = queryOptions({ queryKey: ['portal', 'student'], queryFn: async () => {
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) throw new Error('No se pudo comprobar la sesión.');
  const [student, profile, roles] = await Promise.all([
    supabase.from('students').select('*').eq('user_id', auth.user.id).maybeSingle(),
    supabase.from('profiles').select('*').eq('id', auth.user.id).maybeSingle(),
    supabase.from('user_roles').select('role').eq('user_id', auth.user.id),
  ]);
  if (student.error || profile.error || roles.error) throw new Error('No se pudo cargar tu perfil.');
  return { student: student.data, profile: profile.data, isAdmin: roles.data?.some(r => r.role === 'admin') ?? false };
} });
export const productsQuery = queryOptions({ queryKey: ['portal', 'products'], queryFn: async () => {
  const { data, error } = await supabase.from('products').select('id,name,description,category,price_cents').eq('active', true).order('created_at');
  if (error) throw new Error('No se pudo cargar la tienda.');
  return data;
} });
export const ordersQuery = queryOptions({ queryKey: ['portal', 'orders'], queryFn: async () => {
  const { data, error } = await supabase.from('orders').select('id,created_at,total_cents,status,order_items(product_name,quantity)').order('created_at', { ascending: false });
  if (error) throw new Error('No se pudo cargar el historial.');
  return data;
} });
