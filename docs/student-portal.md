# Portal privado Adassa

## Acceso y alta
- `/auth`: DNI válido y contraseña. El email real se utiliza internamente para Auth y recuperación, nunca se resuelve públicamente.
- `/alumnos/tienda`, `/alumnos/perfil`, `/alumnos/historial`: pantallas protegidas.
- La autoescuela invita alumnos desde **Mi Perfil → Alta de alumno**. Este formulario solo aparece para administradores y su función verifica el rol en el servidor.
- El primer administrador necesita una cuenta creada/invitada desde Lovable Cloud → Usuarios, y una asignación de `admin` en `public.user_roles` mediante una operación de confianza. No hay promoción pública ni credenciales predeterminadas. Para acceso por DNI, vincular además su ficha `students` con su email Auth.
- El trigger crea `profiles` para nuevas cuentas; las cuentas anteriores a la migración necesitan una fila de perfil antes de vincular su ficha.
- El email de invitación vuelve a `/reset-password` para establecer contraseña. Configurar como destinos permitidos el dominio real + `/reset-password` y los dominios de prueba correspondientes en la configuración de Auth. La recuperación exige `type=recovery`; las invitaciones aceptan `type=invite`.
- No hay registro público en la aplicación. Email/password está habilitado; no se alteró la confirmación de email ni la configuración global de registro.

## Esquema aplicado
| Tabla | Datos | Acceso |
|---|---|---|
| profiles | id, full_name | El usuario lee/edita su nombre; trigger de alta |
| students | user_id, dni único, email, created_at | Solo lectura de su propia ficha; escrituras de confianza |
| user_roles | user_id, role | Solo lectura propia; asignación de confianza |
| products | name, description, category, price_cents, active | Lectura de activos solo para alumnos; administración de confianza |
| orders | student_id, total_cents, status, provider, provider_reference | Lectura propia; creación/actualización solo en servidor |
| order_items | order_id, product_id, product_name, quantity, unit_price_cents | Lectura de líneas de sus pedidos |
| dni_login_limits | clave SHA-256, intentos, ventana | Sin acceso cliente; límite persistente de acceso |

Todas las tablas tienen RLS y GRANT explícitos. Sin INSERT/UPDATE de pedidos para alumnos: nadie puede inventarse un pedido pagado. El DNI y email no se pueden cambiar desde el perfil. Precios en céntimos; los nombres y precios de pedido son una instantánea histórica.

## Catálogo
No se inventaron precios ni se insertaron productos comerciales. Cuando `products` esté vacío se muestran ejemplos no comprables: práctica 45 min, packs 5/10/20, tasa y renovación. Configurar productos reales y precios desde una operación de administración de confianza. `price_cents = null` significa precio pendiente y bloquea la compra.

## Checkout pendiente
`checkoutStub` prepara el contrato con IDs y cantidades sin cobros ni pedidos. Stripe y BBVA/Redsys están representados como métodos; ninguno está conectado. No se recogen datos de tarjeta.

Esta aplicación mantiene TanStack Start, no se sustituye por Vercel/Nitro. Al conectar pagos:
1. Crear un pedido pendiente en un handler autenticado, verificando la ficha del alumno y recargando precios desde products. No aceptar totales enviados por el navegador.
2. Stripe: crear Checkout Session y devolver URL HTTPS; Apple Pay/Google Pay dependen de la configuración y dispositivo.
3. Redsys: generar firma HMAC en servidor usando las credenciales BBVA y devolver formulario con parámetros firmados. Nunca exponer claves al cliente.
4. Callbacks externos en `/api/public/*`: verificar firma, importe, moneda, ID y referencia; aplicar idempotencia antes de actualizar pedidos.
5. La página de retorno no confirma pagos; hacerlo solo con el callback verificado.

No se ha comprobado un despliegue externo de Vercel.

## Imagen publicitaria del Hero
- `hero_banners` (id, storage_path, active, created_at): lectura pública solo de la activa; alta/edición solo administradores vía `has_role(auth.uid(),'admin')`.
- Bucket `web-assets` (privado por política del espacio de trabajo, lectura pública por RLS y URL firmada; escritura solo admin).
- El rol de administrador vive en `user_roles` (equivale a `is_admin`), nunca en `profiles`, para evitar escaladas de privilegios.
