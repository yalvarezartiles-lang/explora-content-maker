import { createContext, useContext, useState, type ReactNode } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { Car, Package, ReceiptText, ShoppingBag, UserRound, LogOut, Minus, Plus, ArrowRight, CreditCard, ShieldCheck, Trash2, Mail, UserPlus, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { studentQuery, productsQuery, ordersQuery } from '@/lib/portal/queries';
import { checkoutStub, cartTotal, money, exampleProducts, type Product, type CartItem } from '@/lib/portal/rules';
import { inviteStudent } from '@/lib/portal/auth.functions';
import { toast } from 'sonner';

const CartContext = createContext<{ items: CartItem[]; add: (p: Product) => void; change: (id: string, delta: number) => void } | null>(null);
function useCart() { const cart = useContext(CartContext); if (!cart) throw new Error('Carrito no disponible.'); return cart; }
export function PortalShell({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { data } = useSuspenseQuery(studentQuery);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const add = (product: Product) => setItems(previous => {
    const found = previous.find(i => i.product.id === product.id);
    return found ? previous.map(i => i.product.id === product.id ? { ...i, quantity: Math.min(20, i.quantity + 1) } : i) : [...previous, { product, quantity: 1 }];
  });
  const change = (id: string, delta: number) => setItems(previous => previous.map(i => i.product.id === id ? { ...i, quantity: Math.min(20, i.quantity + delta) } : i).filter(i => i.quantity > 0));
  async function logout() {
    await queryClient.cancelQueries(); queryClient.clear(); setItems([]);
    await supabase.auth.signOut(); await navigate({ to: '/auth', replace: true });
  }
  const links = [{ to: '/alumnos/tienda', label: 'Tienda', Icon: ShoppingBag }, { to: '/alumnos/perfil', label: 'Mi Perfil', Icon: UserRound }, { to: '/alumnos/historial', label: 'Historial de Compras', Icon: ReceiptText }] as const;
  return <CartContext.Provider value={{ items, add, change }}>
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card"><div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-4"><Link to="/" className="flex items-center gap-3"><img src="/logo-adassa.png" alt="Autoescuela Adassa" className="size-11 object-contain" /><div><span className="font-display text-lg font-bold">ADASSA</span><p className="text-xs text-muted-foreground">Área del alumno</p></div></Link><div className="flex items-center gap-3"><span className="hidden text-sm sm:block">{data.profile?.full_name || 'Mi cuenta'}</span><Button variant="outline" size="icon" aria-label="Cerrar sesión" title="Cerrar sesión" onClick={logout}><LogOut /></Button></div></div></header>
      <div className="mx-auto grid max-w-7xl md:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="border-b bg-card px-3 py-4 md:min-h-[calc(100vh-77px)] md:border-b-0 md:border-r md:px-5 md:py-8"><nav className="flex gap-1 md:flex-col md:gap-2" aria-label="Portal del alumno">{links.map(({ to, label, Icon }) => <Button asChild variant="ghost" key={to} className="h-auto min-h-12 flex-1 whitespace-normal px-2 md:justify-start md:px-3"><Link to={to} activeProps={{ className: 'bg-accent text-accent-foreground font-bold' }}><Icon /><span className="text-xs md:text-sm">{label}</span></Link></Button>)}</nav><div className="mt-12 hidden border-t pt-6 md:block"><ShieldCheck className="mb-2 size-5 text-primary-dark" /><p className="text-xs text-muted-foreground">Tu espacio privado<br />Autoescuela Adassa</p></div></aside>
        <main className="min-w-0 px-5 py-8 md:px-9 md:py-10">{children}</main>
      </div>
    </div>
  </CartContext.Provider>;
}

export function StudentShop() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const { data: account } = useSuspenseQuery(studentQuery);
  const { items, add, change } = useCart();
  const [category, setCategory] = useState('all');
  const [checkout, setCheckout] = useState(false);
  const [provider, setProvider] = useState<'stripe' | 'redsys'>('stripe');
  const total = cartTotal(items);
  const examples = products.length === 0;
  const catalog = examples ? exampleProducts : products;
  return <>
    <p className="mb-2 text-sm font-semibold text-primary-dark">SIGUIENTE PARADA: TU CARNÉ</p>
    <div className="mb-7 flex items-start justify-between gap-4"><div><h1 className="font-display text-3xl font-bold tracking-normal">Tienda de la autoescuela</h1><p className="mt-2 text-sm text-muted-foreground">Hola, {account.profile?.full_name?.split(' ')[0] || 'alumno'}. Sigue avanzando a tu ritmo.</p></div><ShoppingBag className="hidden size-8 text-primary-dark sm:block" /></div>
    {!account.student && <p role="status" className="mb-5 rounded-md border border-amber bg-amber/10 p-4 text-sm">Tu ficha de alumno todavía no está vinculada. Contacta con la autoescuela.</p>}
    {examples && <p className="mb-5 border-l-4 border-amber pl-3 text-sm text-muted-foreground">Catálogo de ejemplo · Tarifas pendientes de confirmar. No disponible para compra.</p>}
    <div className="mb-6 flex flex-wrap gap-2">{[{ id: 'all', text: 'Todo' }, { id: 'practice', text: 'Prácticas' }, { id: 'pack', text: 'Packs' }, { id: 'fee', text: 'Tasas y renovaciones' }].map(c => <Button key={c.id} variant={category === c.id ? 'secondary' : 'ghost'} aria-pressed={category === c.id} onClick={() => setCategory(c.id)}>{c.text}</Button>)}</div>
    <div className="grid items-start gap-7 xl:grid-cols-[minmax(0,1fr)_280px]">
      <div className="grid gap-4 sm:grid-cols-2">{catalog.filter(p => category === 'all' || p.category === category).map(p => {
        const Icon = p.category === 'practice' ? Car : p.category === 'pack' ? Package : ReceiptText;
        return <article key={p.id} className="overflow-hidden rounded-md border bg-card shadow-soft"><div className="relative flex h-36 items-center justify-center bg-secondary"><Icon className="size-16 text-primary-dark" strokeWidth={1.4} /><span className="absolute left-4 top-3 text-xs font-semibold uppercase text-muted-foreground">{p.category === 'practice' ? 'Al volante' : p.category === 'pack' ? 'Más kilómetros' : 'Tu expediente'}</span></div><div className="p-5"><h2 className="text-lg font-bold tracking-normal">{p.name}</h2><p className="mt-2 min-h-10 text-sm text-muted-foreground">{p.description}</p><div className="mt-5 flex items-center justify-between gap-2"><span className="text-xl font-extrabold">{p.price_cents === null ? <span className="text-sm text-muted-foreground">Precio por confirmar</span> : money(p.price_cents)}</span><Button size="icon" title={`Añadir ${p.name}`} aria-label={`Añadir ${p.name}`} disabled={examples || p.price_cents === null || !account.student} onClick={() => add(p)}><Plus /></Button></div></div></article>;
      })}</div>
      <section aria-label="Carrito" className="rounded-md border bg-card p-5 xl:sticky xl:top-6"><div className="flex items-center justify-between border-b pb-4"><h2 className="text-lg font-bold">Tu carrito</h2><span className="text-sm text-muted-foreground">{items.reduce((n, i) => n + i.quantity, 0)}</span></div>
        {items.length === 0 ? <div className="py-9 text-center"><ShoppingBag className="mx-auto mb-3 size-8 text-muted-foreground" /><p className="text-sm text-muted-foreground">Tu carrito está vacío</p></div> : <ul className="divide-y">{items.map(i => <li key={i.product.id} className="py-4"><p className="text-sm font-semibold">{i.product.name}</p><div className="mt-3 flex items-center justify-between"><div className="flex items-center gap-2"><Button variant="outline" size="icon" aria-label={`Reducir ${i.product.name}`} onClick={() => change(i.product.id, -1)}>{i.quantity === 1 ? <Trash2 /> : <Minus />}</Button><span className="w-5 text-center text-sm">{i.quantity}</span><Button variant="outline" size="icon" aria-label={`Aumentar ${i.product.name}`} disabled={i.quantity >= 20} onClick={() => change(i.product.id, 1)}><Plus /></Button></div><span className="text-sm font-bold">{money((i.product.price_cents ?? 0) * i.quantity)}</span></div></li>)}</ul>}
        <div className="flex justify-between border-t pt-4 font-bold"><span>Total</span><span>{total === null ? 'Por confirmar' : money(total)}</span></div><Button className="mt-5 min-h-11 w-full" disabled={!items.length || total === null} onClick={() => setCheckout(true)}>Continuar <ArrowRight /></Button><p className="mt-3 text-center text-xs text-muted-foreground">Pagos todavía no habilitados</p>
      </section>
    </div>
    <Dialog open={checkout} onOpenChange={setCheckout}><DialogContent className="max-h-[90vh] overflow-y-auto"><DialogTitle>Completa tu pedido</DialogTitle><DialogDescription>Elige un método de pago. Los cobros aún no están habilitados.</DialogDescription><div className="divide-y">{items.map(i => <div key={i.product.id} className="flex justify-between gap-4 py-3 text-sm"><span>{i.quantity} × {i.product.name}</span><strong>{money((i.product.price_cents ?? 0) * i.quantity)}</strong></div>)}</div><fieldset><legend className="mb-3 text-sm font-bold">Método de pago</legend>{[{ value: 'stripe', title: 'Tarjeta · Stripe', note: 'Tarjetas, Apple Pay y Google Pay' }, { value: 'redsys', title: 'TPV Virtual BBVA', note: 'Pago con tarjeta mediante Redsys' }].map(p => <label key={p.value} className={`mb-3 flex cursor-pointer items-center gap-3 rounded-md border p-4 ${provider === p.value ? 'border-primary bg-accent' : ''}`}><input type="radio" name="provider" checked={provider === p.value} onChange={() => setProvider(p.value === 'stripe' ? 'stripe' : 'redsys')} /><CreditCard className="size-5" /><span><strong className="text-sm">{p.title}</strong><span className="block text-xs text-muted-foreground">{p.note}</span></span></label>)}</fieldset><div className="flex justify-between text-lg font-bold"><span>Total</span><span>{money(total ?? 0)}</span></div><Button className="min-h-11" onClick={() => { checkoutStub(provider, items); toast.info('Este método aún no está conectado. No se ha realizado ningún cobro ni creado un pedido.'); }}>Comprobar disponibilidad <ShieldCheck /></Button></DialogContent></Dialog>
  </>;
}

export function StudentProfile() {
  const { data } = useSuspenseQuery(studentQuery);
  const queryClient = useQueryClient();
  const [name, setName] = useState(data.profile?.full_name ?? '');
  const [busy, setBusy] = useState(false);
  const invite = useServerFn(inviteStudent);
  const [inviting, setInviting] = useState(false);
  return <><h1 className="text-3xl font-bold tracking-normal">Mi Perfil</h1><p className="mt-2 text-sm text-muted-foreground">Tus datos en Autoescuela Adassa</p><form className="mt-8 max-w-xl space-y-5" onSubmit={async e => { e.preventDefault(); if (!data.profile) return; setBusy(true); const { error } = await supabase.from('profiles').update({ full_name: name.trim() }).eq('id', data.profile.id); setBusy(false); if (error) toast.error('No se pudieron guardar los cambios.'); else { await queryClient.invalidateQueries({ queryKey: ['portal', 'student'] }); toast.success('Perfil actualizado.'); } }}>
    <label className="block space-y-2 text-sm font-semibold"><span>Nombre y apellidos</span><Input required minLength={2} maxLength={120} value={name} onChange={e => setName(e.target.value)} className="h-12 bg-card" /></label><label className="block space-y-2 text-sm font-semibold"><span>DNI</span><Input readOnly value={data.student?.dni ?? 'Pendiente de vincular'} className="h-12" /></label><label className="block space-y-2 text-sm font-semibold"><span>Email</span><Input readOnly value={data.student?.email ?? 'Gestionado por la autoescuela'} className="h-12" /></label><Button disabled={busy || !data.profile} type="submit" className="min-h-11">{busy && <LoaderCircle className="animate-spin" />}Guardar cambios</Button><p className="text-xs text-muted-foreground">Para modificar tu DNI o email, contacta con la autoescuela.</p>
  </form>{data.isAdmin && <section className="mt-12 max-w-xl border-t pt-8"><h2 className="mb-5 flex items-center gap-2 text-xl font-bold"><UserPlus />Alta de alumno</h2><form className="space-y-4" onSubmit={async e => { e.preventDefault(); const form = e.currentTarget; const fields = new FormData(form); setInviting(true); try { await invite({ data: { fullName: String(fields.get('name')), dni: String(fields.get('dni')), email: String(fields.get('email')), redirectTo: `${window.location.origin}/reset-password` } }); toast.success('Invitación enviada al alumno.'); form.reset(); } catch (error) { toast.error(error instanceof Error ? error.message : 'No se pudo crear el alumno.'); } finally { setInviting(false); } }}><Input name="name" aria-label="Nombre del nuevo alumno" placeholder="Nombre y apellidos" required /><Input name="dni" aria-label="DNI del nuevo alumno" placeholder="DNI" required /><Input name="email" type="email" aria-label="Email del nuevo alumno" placeholder="Email" required /><Button disabled={inviting} type="submit"><Mail />Enviar invitación</Button></form></section>}</>;
}
const statuses: Record<string, string> = { pending: 'Pendiente', paid: 'Pagado', failed: 'Fallido', cancelled: 'Cancelado', refunded: 'Reembolsado' };
export function StudentHistory() {
  const { data: orders } = useSuspenseQuery(ordersQuery);
  return <><h1 className="text-3xl font-bold tracking-normal">Historial de Compras</h1><p className="mt-2 text-sm text-muted-foreground">Todos tus pedidos, en un mismo lugar.</p>{orders.length === 0 ? <div className="py-20 text-center"><ReceiptText className="mx-auto mb-4 size-12 text-muted-foreground" /><h2 className="text-xl font-bold">Todavía no tienes pedidos</h2><Button asChild variant="outline" className="mt-6"><Link to="/alumnos/tienda">Ir a la tienda <ArrowRight /></Link></Button></div> : <div className="mt-8 overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm"><thead className="border-b bg-secondary"><tr>{['Fecha', 'Artículo', 'Cantidad', 'Precio total', 'Estado del pago'].map(t => <th key={t} className="p-4 font-semibold">{t}</th>)}</tr></thead><tbody>{orders.map(o => <tr key={o.id} className="border-b"><td className="p-4">{new Date(o.created_at).toLocaleDateString('es-ES')}</td><td className="p-4">{o.order_items.map(i => <div key={i.product_name}>{i.product_name}</div>)}</td><td className="p-4">{o.order_items.reduce((n, i) => n + i.quantity, 0)}</td><td className="p-4 font-bold">{money(o.total_cents)}</td><td className="p-4"><span className={`rounded-md px-2 py-1 text-xs font-semibold ${o.status === 'paid' ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground'}`}>{statuses[o.status] ?? o.status}</span></td></tr>)}</tbody></table></div>}</>;
}
