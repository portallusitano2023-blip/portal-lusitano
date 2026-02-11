# Portal Lusitano - API Reference

> Auto-generated from source code. All endpoints are Next.js App Router API routes.

---

## Table of Contents

- [System](#system)
- [Authentication](#authentication)
- [Public - Horses (Cavalos)](#public---horses-cavalos)
- [Public - Stud Farms (Coudelarias)](#public---stud-farms-coudelarias)
- [Public - Events (Eventos)](#public---events-eventos)
- [Public - Lineages (Linhagens)](#public---lineages-linhagens)
- [Public - Reviews](#public---reviews)
- [Public - Search](#public---search)
- [Public - Favourites (Favoritos)](#public---favourites-favoritos)
- [Public - Newsletter](#public---newsletter)
- [Public - Unsubscribe](#public---unsubscribe)
- [Public - Free Ebook](#public---free-ebook)
- [Public - Sell Horse (Vender)](#public---sell-horse-vender)
- [File Upload](#file-upload)
- [Payments and Checkout](#payments-and-checkout)
- [Instagram Advertising](#instagram-advertising)
- [Cart Recovery](#cart-recovery)
- [Tools (Ferramentas)](#tools-ferramentas)
- [Stripe Webhook](#stripe-webhook)
- [Admin - Dashboard Stats](#admin---dashboard-stats)
- [Admin - Horses (Cavalos)](#admin---horses-cavalos)
- [Admin - Stud Farms (Coudelarias)](#admin---stud-farms-coudelarias)
- [Admin - Events (Eventos)](#admin---events-eventos)
- [Admin - Messages](#admin---messages)
- [Admin - CRM (Leads)](#admin---crm-leads)
- [Admin - Reviews](#admin---reviews)
- [Admin - Testimonials (Depoimentos)](#admin---testimonials-depoimentos)
- [Admin - Professionals (Profissionais)](#admin---professionals-profissionais)
- [Admin - Users](#admin---users)
- [Admin - Tasks](#admin---tasks)
- [Admin - Activity Logs](#admin---activity-logs)
- [Admin - Notifications](#admin---notifications)
- [Admin - Settings (Definicoes)](#admin---settings-definicoes)
- [Admin - AI Assistant](#admin---ai-assistant)
- [Admin - Search](#admin---search)
- [Admin - Financial](#admin---financial)
- [Admin - Analytics](#admin---analytics)
- [Admin - Automations](#admin---automations)
- [Admin - Email Campaigns](#admin---email-campaigns)
- [Admin - Instagram Management](#admin---instagram-management)
- [Admin - Diagnostics](#admin---diagnostics)
- [Admin - Forecasting](#admin---forecasting)
- [Admin - Geographic Data](#admin---geographic-data)
- [Admin - Reports](#admin---reports)

---

## System

### `GET /api/health`

Health check endpoint. Tests database connectivity.

| Field    | Value                                                                |
| -------- | -------------------------------------------------------------------- |
| Auth     | None                                                                 |
| Response | `{ status, timestamp, uptime, environment, services: { database } }` |

---

## Authentication

All admin routes use session-based authentication via `verifySession()` from `@/lib/auth`. The session is created during login and stored in cookies.

### `POST /api/auth/login`

Authenticate an admin user.

| Field      | Value                                                           |
| ---------- | --------------------------------------------------------------- |
| Auth       | None                                                            |
| Rate Limit | 5 attempts per 15 minutes per IP                                |
| Body       | `{ email: string, password: string }`                           |
| Validation | Zod `loginSchema`                                               |
| Response   | `{ success: true }`                                             |
| Errors     | 400 (validation), 401 (invalid credentials), 429 (rate limited) |

### `POST /api/auth/logout`

Destroy the current session.

| Field    | Value               |
| -------- | ------------------- |
| Auth     | None                |
| Body     | None                |
| Response | `{ success: true }` |

### `GET /api/auth/check`

Check if the current session is valid.

| Field    | Value                                        |
| -------- | -------------------------------------------- |
| Auth     | None (returns status)                        |
| Response | `{ authenticated: boolean, email?: string }` |

---

## Public - Horses (Cavalos)

### `GET /api/cavalos`

List horses for sale with filters.

| Field        | Value                                                                        |
| ------------ | ---------------------------------------------------------------------------- |
| Auth         | None                                                                         |
| Query Params | `sexo`, `regiao`, `precoMin`, `precoMax`, `nivel`, `disciplina`, `search`    |
| Response     | `{ cavalos: CavaloVenda[] }`                                                 |
| Notes        | Only returns `status=active`. Ordered by `destaque` desc, `created_at` desc. |

---

## Public - Stud Farms (Coudelarias)

### `GET /api/coudelarias`

List active stud farms.

| Field        | Value                                                                    |
| ------------ | ------------------------------------------------------------------------ |
| Auth         | None                                                                     |
| Query Params | `regiao`, `search`, `pro` (boolean)                                      |
| Response     | `{ coudelarias: Coudelaria[] }`                                          |
| Notes        | Only returns `status=active`. Ordered by destaque, ordem_destaque, nome. |

### `POST /api/coudelarias`

Register a new stud farm (submitted for review).

| Field    | Value                                                                                                              |
| -------- | ------------------------------------------------------------------------------------------------------------------ |
| Auth     | None                                                                                                               |
| Body     | `{ nome, descricao, localizacao, regiao, telefone?, email?, website?, instagram?, num_cavalos?, especialidades? }` |
| Response | `{ success: true, coudelaria, message }`                                                                           |
| Notes    | Created with `status=pending`. Auto-generates unique slug.                                                         |

### `GET /api/coudelarias/[slug]`

Get a single stud farm by slug.

| Field       | Value                                                                  |
| ----------- | ---------------------------------------------------------------------- |
| Auth        | None                                                                   |
| Path Params | `slug`                                                                 |
| Response    | `{ coudelaria: Coudelaria }`                                           |
| Notes       | Only returns `status=active`. Increments `views_count` asynchronously. |

---

## Public - Events (Eventos)

### `GET /api/eventos`

List upcoming active events.

| Field        | Value                                                                         |
| ------------ | ----------------------------------------------------------------------------- |
| Auth         | None                                                                          |
| Query Params | `tipo`, `regiao`, `mes`, `ano`                                                |
| Response     | `{ eventos: Evento[] }`                                                       |
| Notes        | Only returns `status=active` and future events. Ordered by `data_inicio` asc. |

### `GET /api/eventos/[slug]`

Get a single event by slug, with related events.

| Field       | Value                                                                      |
| ----------- | -------------------------------------------------------------------------- |
| Auth        | None                                                                       |
| Path Params | `slug`                                                                     |
| Response    | `{ evento: Evento, relacionados: Evento[] }`                               |
| Notes       | Increments `views_count`. Returns up to 3 related events of the same type. |

---

## Public - Lineages (Linhagens)

### `GET /api/linhagens`

List all lineages.

| Field    | Value                           |
| -------- | ------------------------------- |
| Auth     | None                            |
| Response | `{ linhagens: Linhagem[] }`     |
| Notes    | Ordered alphabetically by nome. |

---

## Public - Reviews

### `GET /api/reviews`

List approved reviews for a stud farm or tool.

| Field        | Value                                                                                                |
| ------------ | ---------------------------------------------------------------------------------------------------- |
| Auth         | None                                                                                                 |
| Query Params | `coudelaria_id` or `ferramenta_slug` (one required). `ferramenta_slug=all` returns all tool reviews. |
| Response     | `{ reviews: Review[], stats: { total, media } }`                                                     |

### `POST /api/reviews`

Submit a new review (coudelaria or tool).

| Field             | Value                                                                                                                                                                                                    |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth              | None                                                                                                                                                                                                     |
| Rate Limit        | 5 per minute per IP                                                                                                                                                                                      |
| Body (coudelaria) | `{ coudelaria_id, autor_nome, autor_email, autor_localizacao, avaliacao, titulo, comentario, data_visita, tipo_visita, recomenda }`                                                                      |
| Body (tool)       | `{ ferramenta_slug, autor_nome, avaliacao, comentario, recomenda }`                                                                                                                                      |
| Validation        | Zod `reviewSchema` or `toolReviewSchema`                                                                                                                                                                 |
| Response          | `{ success: true, review, message }`                                                                                                                                                                     |
| Notes             | Coudelaria reviews created as `status=pending`. Tool reviews created as `status=approved`. Valid tool slugs: `calculadora-valor`, `comparador-cavalos`, `verificador-compatibilidade`, `analise-perfil`. |

---

## Public - Search

### `GET /api/search`

Global search across horses, events, stud farms, and static pages.

| Field        | Value                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------- |
| Auth         | None                                                                                        |
| Query Params | `q` (min 2 chars, required), `limit` (max 30, default 12), `type` (horse/event/stud/page)   |
| Response     | `{ results: SearchResult[] }`                                                               |
| Notes        | Searches Supabase tables in parallel. Returns results typed as horse, event, stud, or page. |

---

## Public - Favourites (Favoritos)

### `GET /api/favoritos`

List favourites for the current user (identified by `user_email` cookie).

| Field    | Value                                                |
| -------- | ---------------------------------------------------- |
| Auth     | Cookie `user_email` (returns empty if missing)       |
| Response | `{ favoritos: Favorito[] }`                          |
| Notes    | Joins with `cavalos_venda` and `coudelarias` tables. |

### `POST /api/favoritos`

Add a favourite.

| Field    | Value                                    |
| -------- | ---------------------------------------- |
| Auth     | Cookie `user_email` (401 if missing)     |
| Body     | `{ item_id: string, item_type: string }` |
| Response | `{ success: true }`                      |
| Notes    | Prevents duplicates.                     |

### `DELETE /api/favoritos`

Remove a favourite.

| Field        | Value                                |
| ------------ | ------------------------------------ |
| Auth         | Cookie `user_email` (401 if missing) |
| Query Params | `item_id`, `item_type`               |
| Response     | `{ success: true }`                  |

---

## Public - Newsletter

### `POST /api/newsletter`

Subscribe to the newsletter.

| Field      | Value                                          |
| ---------- | ---------------------------------------------- |
| Auth       | None                                           |
| Rate Limit | 10 per minute per IP                           |
| Body       | `{ email: string }`                            |
| Validation | Zod `newsletterSchema`                         |
| Response   | `{ message: "Subscricao concluida" }`          |
| Notes      | Creates a `subscritor` document in Sanity CMS. |

---

## Public - Unsubscribe

### `POST /api/unsubscribe`

Unsubscribe an email from communications.

| Field    | Value                                              |
| -------- | -------------------------------------------------- |
| Auth     | None                                               |
| Body     | `{ email: string }`                                |
| Response | `{ success: true, message }`                       |
| Notes    | Updates lead status to `unsubscribed` in Supabase. |

---

## Public - Free Ebook

### `POST /api/ebook-gratis/subscribe`

Subscribe and receive a free ebook download link via email.

| Field      | Value                                                                                                     |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| Auth       | None                                                                                                      |
| Rate Limit | 5 per minute per IP                                                                                       |
| Body       | `{ email: string, nome: string }`                                                                         |
| Response   | `{ success: true, message }`                                                                              |
| Notes      | Saves lead to Supabase with UTM params. Sends download email via Resend. Blocks disposable email domains. |

---

## Public - Sell Horse (Vender)

### `POST /api/vender`

Submit a horse for sale (legacy/simplified).

| Field    | Value                                                |
| -------- | ---------------------------------------------------- |
| Auth     | None                                                 |
| Body     | `{ nomeCavalo, linhagem, preco, imageUrl }`          |
| Response | `{ success: true }`                                  |
| Notes    | Inserts into `cavalos_venda` with `status=pendente`. |

---

## File Upload

### `POST /api/upload`

Upload an image to Supabase Storage.

| Field    | Value                                                                        |
| -------- | ---------------------------------------------------------------------------- |
| Auth     | None                                                                         |
| Body     | `FormData` with `file` (required) and `folder` (optional, default "uploads") |
| Response | `{ success: true, url, path }`                                               |
| Limits   | Max 5MB. Allowed types: JPEG, PNG, WebP, GIF.                                |

### `DELETE /api/upload`

Delete an image from Supabase Storage.

| Field        | Value               |
| ------------ | ------------------- |
| Auth         | None                |
| Query Params | `path`              |
| Response     | `{ success: true }` |

---

## Payments and Checkout

### `POST /api/checkout`

Create a Shopify cart and checkout session for shop products.

| Field    | Value                                                                       |
| -------- | --------------------------------------------------------------------------- |
| Auth     | None                                                                        |
| Body     | `{ variantId: string }`                                                     |
| Response | `{ checkoutUrl: string }`                                                   |
| Notes    | Creates a new Shopify cart, adds the variant, and returns the checkout URL. |

### `POST /api/vender-cavalo/checkout`

Create a Stripe checkout session for horse listing ads.

| Field    | Value                                                                                                                                 |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Auth     | None                                                                                                                                  |
| Body     | `{ anuncio: object, destaque: boolean, formData: object }`                                                                            |
| Response | `{ url: string }`                                                                                                                     |
| Notes    | Base price: EUR 49 (ad). Optional: EUR 29 (premium highlight). Saves contact to `contact_submissions` before creating Stripe session. |

### `POST /api/publicidade/checkout`

Create a Stripe checkout session for advertising packages.

| Field    | Value                                                                                                                                        |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------------------------------------- |
| Auth     | None                                                                                                                                         |
| Body     | `{ package: "lateral"                                                                                                                        | "premium" | "anual", email, company, telefone? }` |
| Response | `{ url: string }`                                                                                                                            |
| Notes    | Packages: lateral (EUR 25/mo, recurring), premium (EUR 75/mo, recurring), anual (EUR 600, one-time). Saves contact to `contact_submissions`. |

---

## Instagram Advertising

### `POST /api/instagram-inquiry`

Submit an Instagram promotion inquiry (email-based, no payment).

| Field    | Value                                                                    |
| -------- | ------------------------------------------------------------------------ |
| Auth     | None                                                                     |
| Body     | `{ nome, empresa?, email, instagram?, pacote, preco, mensagem }`         |
| Response | `{ success: true, message }`                                             |
| Notes    | Sends notification email to admin and confirmation to client via Resend. |

### `POST /api/instagram/checkout`

Create a Stripe checkout session for Instagram ad packages.

| Field    | Value                                                                                                 |
| -------- | ----------------------------------------------------------------------------------------------------- | ------ | ------- | ------------------------------------------------------ |
| Auth     | None                                                                                                  |
| Body     | `{ packageId: "story"                                                                                 | "post" | "reels" | "pack", nome, empresa?, email, instagram?, mensagem }` |
| Response | `{ url: string }`                                                                                     |
| Notes    | Prices: story EUR 10, post EUR 30, reels EUR 50, pack EUR 75. Saves contact to `contact_submissions`. |

### `POST /api/instagram/upload`

Upload media files for an Instagram ad (post-payment).

| Field    | Value                                                                                                                    |
| -------- | ------------------------------------------------------------------------------------------------------------------------ |
| Auth     | None                                                                                                                     |
| Body     | `FormData` with `sessionId`, `caption`, `hashtags?`, `link?`, `observacoes?`, `file0..fileN`                             |
| Response | `{ success: true, message, filesCount }`                                                                                 |
| Notes    | Uploads to Supabase Storage. Saves record in `instagram_uploads` table. Sends email to admin with all files and details. |

---

## Cart Recovery

### `GET /api/cart/recover`

Recover an abandoned cart via recovery token.

| Field        | Value                                                              |
| ------------ | ------------------------------------------------------------------ |
| Auth         | None                                                               |
| Query Params | `token` (required)                                                 |
| Response     | `{ recovered: true, cart: { items, total, quantity }, discount? }` |
| Notes        | Returns 10% discount if 2+ emails were sent. Tracks email click.   |

### `POST /api/cart/recover`

Mark a cart as recovered after checkout.

| Field    | Value                                 |
| -------- | ------------------------------------- |
| Auth     | None                                  |
| Body     | `{ token: string, orderId?: string }` |
| Response | `{ success: true, message }`          |

### `POST /api/cart/track-abandonment`

Track an abandoned cart for recovery email flow.

| Field    | Value                                                                                       |
| -------- | ------------------------------------------------------------------------------------------- |
| Auth     | None                                                                                        |
| Body     | `{ email?, sessionId, cartItems, cartTotal, cartQuantity, utm? }`                           |
| Response | `{ tracked: boolean, cartId?, recoveryToken? }`                                             |
| Notes    | Updates existing cart for same session if found. Generates recovery token via Supabase RPC. |

### `POST /api/cart/send-recovery-email`

Send cart recovery emails (intended for cron job).

| Field    | Value                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------- |
| Auth     | Bearer token (`CRON_SECRET` env var)                                                                    |
| Body     | `{ cartId?: string }`                                                                                   |
| Response | `{ sent, failed, results }`                                                                             |
| Notes    | Processes up to 50 carts per run. Max 3 emails per cart, 24h between emails. Uses React email template. |

---

## Tools (Ferramentas)

### `POST /api/tools/create-checkout`

Create a Stripe checkout session for tools PRO subscription.

| Field    | Value                                              |
| -------- | -------------------------------------------------- |
| Auth     | Supabase Auth (user must be logged in)             |
| Body     | None                                               |
| Response | `{ url: string }`                                  |
| Notes    | Creates/reuses Stripe customer. Subscription mode. |

### `POST /api/tools/customer-portal`

Create a Stripe billing portal session for managing subscription.

| Field    | Value                                  |
| -------- | -------------------------------------- |
| Auth     | Supabase Auth (user must be logged in) |
| Body     | None                                   |
| Response | `{ url: string }`                      |
| Notes    | Requires existing Stripe customer ID.  |

---

## Stripe Webhook

### `POST /api/stripe/webhook`

Handle Stripe webhook events.

| Field          | Value                                                                                                                                                                                                                                                                                                                                                                                                 |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth           | Stripe signature verification                                                                                                                                                                                                                                                                                                                                                                         |
| Events Handled | `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted`                                                                                                                                                                                                                                                                                                            |
| Notes          | Handles multiple product types via `metadata.type`: `cavalo_anuncio` (creates horse listing, records payment, sends emails), `instagram_ad` (records payment, sends emails), `publicidade` (records payment, notifies admin), `profissional` (creates professional profile), `tools_subscription` (activates PRO tools). Subscription cancellation deactivates professionals and tools subscriptions. |

---

## Admin - Dashboard Stats

### `GET /api/admin/stats`

Get aggregated dashboard statistics.

| Field    | Value                                                                                                                                                                                                                                                      |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth     | Admin session required                                                                                                                                                                                                                                     |
| Response | `{ totalLeads, convertedLeads, conversionRate, totalCavalos, activeCavalos, soldCavalos, cavalosViews, totalEventos, featuredEventos, futureEventos, eventosViews, totalCoudelarias, featuredCoudelarias, totalReviews, pendingReviews, approvedReviews }` |

---

## Admin - Horses (Cavalos)

### `GET /api/admin/cavalos`

List all horses (all statuses).

| Field    | Value                        |
| -------- | ---------------------------- |
| Auth     | Admin session required       |
| Response | `{ cavalos: CavaloVenda[] }` |

### `POST /api/admin/cavalos`

Create a new horse listing.

| Field    | Value                             |
| -------- | --------------------------------- |
| Auth     | Admin session required            |
| Body     | Horse fields (spread into insert) |
| Response | `{ cavalo: CavaloVenda }`         |

### `PUT /api/admin/cavalos/[id]`

Update a horse listing.

| Field       | Value                     |
| ----------- | ------------------------- |
| Auth        | Admin session required    |
| Path Params | `id`                      |
| Body        | Horse fields to update    |
| Response    | `{ cavalo: CavaloVenda }` |

### `PATCH /api/admin/cavalos/[id]`

Update horse status only.

| Field       | Value                     |
| ----------- | ------------------------- |
| Auth        | Admin session required    |
| Path Params | `id`                      |
| Body        | `{ status: string }`      |
| Response    | `{ cavalo: CavaloVenda }` |

### `DELETE /api/admin/cavalos/[id]`

Delete a horse listing (hard delete).

| Field       | Value                  |
| ----------- | ---------------------- |
| Auth        | Admin session required |
| Path Params | `id`                   |
| Response    | `{ success: true }`    |

---

## Admin - Stud Farms (Coudelarias)

### `GET /api/admin/coudelarias`

List stud farms with filters and stats.

| Field        | Value                                                                               |
| ------------ | ----------------------------------------------------------------------------------- |
| Auth         | Admin session required                                                              |
| Query Params | `status`, `search`, `distrito`                                                      |
| Response     | `{ coudelarias, stats: { total, pendente, aprovado, rejeitado, destaque }, count }` |
| Notes        | Excludes soft-deleted records.                                                      |

### `POST /api/admin/coudelarias`

Create a new stud farm.

| Field    | Value                                  |
| -------- | -------------------------------------- |
| Auth     | Admin session required                 |
| Body     | Full coudelaria fields (nome required) |
| Response | `{ coudelaria }` (201)                 |

### `GET /api/admin/coudelarias/[id]`

Get a single stud farm with plan history.

| Field       | Value                             |
| ----------- | --------------------------------- |
| Auth        | Admin session required            |
| Path Params | `id`                              |
| Response    | `{ coudelaria, plano_historico }` |

### `PATCH /api/admin/coudelarias/[id]`

Update a stud farm (partial update, many fields supported).

| Field       | Value                                                                                                          |
| ----------- | -------------------------------------------------------------------------------------------------------------- |
| Auth        | Admin session required                                                                                         |
| Path Params | `id`                                                                                                           |
| Body        | Any coudelaria fields (nome, descricao, plano, status, destaque, SEO fields, etc.)                             |
| Response    | `{ coudelaria }`                                                                                               |
| Notes       | Creates plan history record when plan changes. Sets approved_at/approved_by when status changes to "aprovado". |

### `DELETE /api/admin/coudelarias/[id]`

Soft-delete a stud farm.

| Field       | Value                  |
| ----------- | ---------------------- |
| Auth        | Admin session required |
| Path Params | `id`                   |
| Response    | `{ message }`          |

---

## Admin - Events (Eventos)

### `GET /api/admin/eventos`

List all events (all statuses).

| Field    | Value                   |
| -------- | ----------------------- |
| Auth     | Admin session required  |
| Response | `{ eventos: Evento[] }` |

### `POST /api/admin/eventos`

Create a new event.

| Field    | Value                  |
| -------- | ---------------------- |
| Auth     | Admin session required |
| Body     | Event fields           |
| Response | `{ evento: Evento }`   |

### `PUT /api/admin/eventos/[id]`

Update an event.

| Field       | Value                  |
| ----------- | ---------------------- |
| Auth        | Admin session required |
| Path Params | `id`                   |
| Body        | Event fields to update |
| Response    | `{ evento: Evento }`   |

### `DELETE /api/admin/eventos/[id]`

Delete an event (hard delete).

| Field       | Value                  |
| ----------- | ---------------------- |
| Auth        | Admin session required |
| Path Params | `id`                   |
| Response    | `{ success: true }`    |

### `GET /api/admin/eventos/seed`

Preview events that will be seeded.

| Field    | Value                                          |
| -------- | ---------------------------------------------- |
| Auth     | Admin session required                         |
| Response | `{ message, count, eventos: EventoPreview[] }` |

### `POST /api/admin/eventos/seed`

Seed real Lusitano horse events into the database.

| Field    | Value                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------- |
| Auth     | Admin session required                                                                                  |
| Response | `{ message, added, total, eventos }`                                                                    |
| Notes    | Skips events whose slug already exists. Contains hardcoded verified events from APSL and other sources. |

### `GET /api/admin/eventos/update-confirmacao`

View event confirmation status.

| Field    | Value                                                             |
| -------- | ----------------------------------------------------------------- |
| Auth     | Admin session required                                            |
| Response | `{ total, eventos: { titulo, slug, data_inicio, confirmado }[] }` |

### `POST /api/admin/eventos/update-confirmacao`

Update event confirmation status: delete unconfirmed 2026 events and mark confirmed ones.

| Field    | Value                                                                |
| -------- | -------------------------------------------------------------------- |
| Auth     | Admin session required                                               |
| Response | `{ success, message, results: { confirmados, eliminados, errors } }` |

---

## Admin - Messages

### `GET /api/admin/messages`

List contact submissions with filters and pagination.

| Field        | Value                                                          |
| ------------ | -------------------------------------------------------------- |
| Auth         | Admin session required                                         |
| Query Params | `form_type`, `status`, `priority`, `search`, `page`, `limit`   |
| Response     | `{ messages, pagination: { page, limit, total, totalPages } }` |

### `GET /api/admin/messages/[id]`

Get a single message. Marks as read if status is "novo".

| Field       | Value                  |
| ----------- | ---------------------- |
| Auth        | Admin session required |
| Path Params | `id`                   |
| Response    | `{ message }`          |

### `PATCH /api/admin/messages/[id]`

Update message fields (status, priority, notes, tags, assignment).

| Field       | Value                                                                        |
| ----------- | ---------------------------------------------------------------------------- |
| Auth        | Admin session required                                                       |
| Path Params | `id`                                                                         |
| Body        | `{ status?, priority?, admin_notes?, admin_response?, tags?, assigned_to? }` |
| Response    | `{ message }`                                                                |

### `DELETE /api/admin/messages/[id]`

Archive a message (soft delete).

| Field       | Value                  |
| ----------- | ---------------------- |
| Auth        | Admin session required |
| Path Params | `id`                   |
| Response    | `{ success: true }`    |

### `POST /api/admin/messages/[id]/reply`

Send an email reply to a contact submission.

| Field       | Value                                                              |
| ----------- | ------------------------------------------------------------------ |
| Auth        | Admin session required                                             |
| Path Params | `id`                                                               |
| Body        | `{ subject: string, message: string }`                             |
| Response    | `{ success: true, message }`                                       |
| Notes       | Sends email via Resend. Updates submission status to "respondido". |

### `POST /api/admin/messages/bulk`

Perform bulk operations on multiple messages.

| Field    | Value                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------- |
| Auth     | Admin session required                                                                                  |
| Body     | `{ action: string, ids: string[], data?: object }`                                                      |
| Actions  | `mark_read`, `mark_responded`, `archive`, `set_priority`, `add_tag`, `remove_tag`, `assign`, `unassign` |
| Response | `{ success: true, updated: number }`                                                                    |

### `GET /api/admin/messages/stats`

Get message statistics (by status, form type, priority, response rate, etc.).

| Field    | Value                                                                                                 |
| -------- | ----------------------------------------------------------------------------------------------------- |
| Auth     | Admin session required                                                                                |
| Response | `{ total, unread, last24h, lastWeek, responseRate, byStatus, byFormType, byPriority, latestMessage }` |

---

## Admin - CRM (Leads)

### `GET /api/admin/crm`

List CRM leads with filters and pipeline statistics.

| Field        | Value                                                                                                                       |
| ------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Auth         | Admin session required                                                                                                      |
| Query Params | `stage`, `search`                                                                                                           |
| Response     | `{ leads, stats: { total, novo, contactado, qualificado, proposta, negociacao, ganho, perdido }, pipelineValue, wonValue }` |

### `POST /api/admin/crm`

Create a new CRM lead.

| Field    | Value                                                                                                                                                       |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth     | Admin session required                                                                                                                                      |
| Body     | `{ name, email, telefone?, company?, stage?, estimated_value?, probability?, source_type?, interests?, notes?, budget_min?, budget_max?, next_follow_up? }` |
| Response | `{ lead }` (201)                                                                                                                                            |

### `GET /api/admin/crm/[id]`

Get a single lead.

| Field       | Value                  |
| ----------- | ---------------------- |
| Auth        | Admin session required |
| Path Params | `id`                   |
| Response    | `{ lead }`             |

### `PATCH /api/admin/crm/[id]`

Update a lead (move stage, edit fields). Increments contact_count when notes or stage change.

| Field       | Value                  |
| ----------- | ---------------------- |
| Auth        | Admin session required |
| Path Params | `id`                   |
| Body        | Any lead fields        |
| Response    | `{ lead }`             |

### `DELETE /api/admin/crm/[id]`

Delete a lead (hard delete).

| Field       | Value                  |
| ----------- | ---------------------- |
| Auth        | Admin session required |
| Path Params | `id`                   |
| Response    | `{ message }`          |

---

## Admin - Reviews

### `GET /api/admin/reviews`

List all reviews with optional status filter.

| Field        | Value                         |
| ------------ | ----------------------------- |
| Auth         | Admin session required        |
| Query Params | `status`                      |
| Response     | `{ reviews: Review[] }`       |
| Notes        | Joins with coudelarias table. |

### `PATCH /api/admin/reviews/[id]`

Update review status (approve/reject).

| Field       | Value                                                                      |
| ----------- | -------------------------------------------------------------------------- | ---------- | ------------ |
| Auth        | Admin session required                                                     |
| Path Params | `id`                                                                       |
| Body        | `{ status: "approved"                                                      | "rejected" | "pending" }` |
| Response    | `{ review }`                                                               |
| Notes       | If approved and has coudelaria_id, recalculates coudelaria average rating. |

### `DELETE /api/admin/reviews/[id]`

Delete a review (hard delete).

| Field       | Value                  |
| ----------- | ---------------------- |
| Auth        | Admin session required |
| Path Params | `id`                   |
| Response    | `{ success: true }`    |

---

## Admin - Testimonials (Depoimentos)

### `GET /api/admin/depoimentos`

List pending horse testimonials.

| Field    | Value                         |
| -------- | ----------------------------- |
| Auth     | Admin session required        |
| Response | `{ pendentes: Depoimento[] }` |

### `PATCH /api/admin/depoimentos/[id]`

Approve or reject a testimonial.

| Field       | Value                  |
| ----------- | ---------------------- | -------------- |
| Auth        | Admin session required |
| Path Params | `id`                   |
| Body        | `{ status: "aprovado"  | "rejeitado" }` |
| Response    | `{ depoimento }`       |

---

## Admin - Professionals (Profissionais)

### `GET /api/admin/profissionais`

List professionals with filters and subscription stats.

| Field        | Value                                                            |
| ------------ | ---------------------------------------------------------------- |
| Auth         | Admin session required                                           |
| Query Params | `tipo`, `status`, `plano`, `search`                              |
| Response     | `{ profissionais, stats, mrr, count }`                           |
| Notes        | Excludes soft-deleted records. Calculates MRR from active plans. |

### `POST /api/admin/profissionais`

Create a new professional.

| Field    | Value                                        |
| -------- | -------------------------------------------- |
| Auth     | Admin session required                       |
| Body     | Professional fields (nome and tipo required) |
| Response | `{ profissional }` (201)                     |

### `GET /api/admin/profissionais/[id]`

Get a single professional with subscription history.

| Field       | Value                                      |
| ----------- | ------------------------------------------ |
| Auth        | Admin session required                     |
| Path Params | `id`                                       |
| Response    | `{ profissional, subscription_historico }` |

### `PATCH /api/admin/profissionais/[id]`

Update a professional.

| Field       | Value                   |
| ----------- | ----------------------- |
| Auth        | Admin session required  |
| Path Params | `id`                    |
| Body        | Any professional fields |
| Response    | `{ profissional }`      |

### `DELETE /api/admin/profissionais/[id]`

Soft-delete a professional.

| Field       | Value                  |
| ----------- | ---------------------- |
| Auth        | Admin session required |
| Path Params | `id`                   |
| Response    | `{ message }`          |

---

## Admin - Users

### `GET /api/admin/users`

List admin users.

| Field        | Value                  |
| ------------ | ---------------------- |
| Auth         | Admin session required |
| Query Params | `role`, `ativo`        |
| Response     | `{ users, total }`     |

### `POST /api/admin/users`

Create a new admin user.

| Field    | Value                                |
| -------- | ------------------------------------ |
| Auth     | Admin session required               |
| Body     | `{ email, nome?, role? }`            |
| Response | `{ user, message }`                  |
| Notes    | Logs action in `admin_activity_log`. |

### `GET /api/admin/users/[id]`

Get a single admin user.

| Field       | Value                  |
| ----------- | ---------------------- |
| Auth        | Admin session required |
| Path Params | `id`                   |
| Response    | `{ user }`             |

### `PUT /api/admin/users/[id]`

Update an admin user.

| Field       | Value                                                                      |
| ----------- | -------------------------------------------------------------------------- |
| Auth        | Admin session required                                                     |
| Path Params | `id`                                                                       |
| Body        | `{ nome?, role?, ativo? }`                                                 |
| Response    | `{ user, message }`                                                        |
| Notes       | Cannot deactivate own account or remove own super_admin role. Logs action. |

### `DELETE /api/admin/users/[id]`

Delete an admin user.

| Field       | Value                                   |
| ----------- | --------------------------------------- |
| Auth        | Admin session required                  |
| Path Params | `id`                                    |
| Response    | `{ message }`                           |
| Notes       | Cannot delete own account. Logs action. |

---

## Admin - Tasks

### `GET /api/admin/tasks`

List tasks with filters.

| Field        | Value                                                                            |
| ------------ | -------------------------------------------------------------------------------- |
| Auth         | Admin session required                                                           |
| Query Params | `status`, `priority`, `task_type`, `assigned_to`, `month` (YYYY-MM), `search`    |
| Response     | `{ tasks, stats: { total, pendente, em_andamento, concluida, vencidas, hoje } }` |

### `POST /api/admin/tasks`

Create a new task.

| Field    | Value                                                                                            |
| -------- | ------------------------------------------------------------------------------------------------ |
| Auth     | Admin session required                                                                           |
| Body     | `{ title, due_date, description?, task_type?, priority?, assigned_to?, related_email?, notes? }` |
| Response | `{ task }` (201)                                                                                 |

### `GET /api/admin/tasks/[id]`

Get a single task.

| Field       | Value                  |
| ----------- | ---------------------- |
| Auth        | Admin session required |
| Path Params | `id`                   |
| Response    | `{ task }`             |

### `PATCH /api/admin/tasks/[id]`

Update a task.

| Field       | Value                                                   |
| ----------- | ------------------------------------------------------- |
| Auth        | Admin session required                                  |
| Path Params | `id`                                                    |
| Body        | Any task fields                                         |
| Response    | `{ task }`                                              |
| Notes       | Sets `completed_at` when status changes to "concluida". |

### `DELETE /api/admin/tasks/[id]`

Delete a task (hard delete).

| Field       | Value                  |
| ----------- | ---------------------- |
| Auth        | Admin session required |
| Path Params | `id`                   |
| Response    | `{ message }`          |

---

## Admin - Activity Logs

### `GET /api/admin/logs`

List admin activity logs with filters and pagination.

| Field        | Value                                                        |
| ------------ | ------------------------------------------------------------ |
| Auth         | Admin session required                                       |
| Query Params | `action_type`, `entity_type`, `admin_email`, `limit`, `page` |
| Response     | `{ logs, pagination, filters: { admins } }`                  |

### `POST /api/admin/logs`

Create an activity log entry.

| Field    | Value                                                             |
| -------- | ----------------------------------------------------------------- |
| Auth     | Admin session required                                            |
| Body     | `{ action_type, entity_type, entity_id?, changes?, ip_address? }` |
| Response | `{ log }`                                                         |

---

## Admin - Notifications

### `GET /api/admin/notifications`

Get aggregated notifications from multiple sources (messages, payments, reviews, horses, Instagram).

| Field        | Value                                                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Auth         | Admin session required                                                                                                         |
| Query Params | `limit` (default 20), `unread`                                                                                                 |
| Response     | `{ notifications, unreadCount, total }`                                                                                        |
| Notes        | Aggregates: new messages (24h), new payments (24h), pending reviews (7d), pending horses (7d), pending Instagram uploads (7d). |

---

## Admin - Settings (Definicoes)

### `GET /api/admin/definicoes`

List all site settings, optionally grouped by category.

| Field        | Value                               |
| ------------ | ----------------------------------- |
| Auth         | Admin session required              |
| Query Params | `category`                          |
| Response     | `{ settings, grouped, categories }` |

### `POST /api/admin/definicoes`

Create a new site setting.

| Field    | Value                                                                                                  |
| -------- | ------------------------------------------------------------------------------------------------------ |
| Auth     | Admin session required                                                                                 |
| Body     | `{ key, value, category, label, input_type, description?, options?, is_required?, validation_regex? }` |
| Response | `{ setting }`                                                                                          |

### `GET /api/admin/definicoes/[key]`

Get a single setting by key.

| Field       | Value                  |
| ----------- | ---------------------- |
| Auth        | Admin session required |
| Path Params | `key`                  |
| Response    | `{ setting }`          |

### `PATCH /api/admin/definicoes/[key]`

Update a setting.

| Field       | Value                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------ |
| Auth        | Admin session required                                                                     |
| Path Params | `key`                                                                                      |
| Body        | `{ value?, label?, description?, input_type?, options?, is_required?, validation_regex? }` |
| Response    | `{ setting }`                                                                              |

### `DELETE /api/admin/definicoes/[key]`

Delete a setting (protected keys cannot be deleted).

| Field       | Value                                                                                                                                                                 |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth        | Admin session required                                                                                                                                                |
| Path Params | `key`                                                                                                                                                                 |
| Response    | `{ success: true }`                                                                                                                                                   |
| Notes       | Protected keys: `email_template_welcome`, `email_template_anuncio_aprovado`, `email_template_payment_received`, `notifications_admin_email`, `site_name`, `site_url`. |

---

## Admin - AI Assistant

### `POST /api/admin/ai`

AI-powered assistant for content generation and analysis (mock implementation).

| Field    | Value                                                                                                                                                                                    |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth     | Admin session required                                                                                                                                                                   |
| Body     | `{ task: string, input: object }`                                                                                                                                                        |
| Tasks    | `generate_description` (horse descriptions), `suggest_subject` (email subjects), `analyze_sentiment` (review analysis), `best_time` (email send time), `improve_text` (text improvement) |
| Response | Varies by task                                                                                                                                                                           |
| Notes    | Currently uses mock responses. Designed to be replaced with OpenAI/Anthropic API calls.                                                                                                  |

---

## Admin - Search

### `GET /api/admin/search`

Search across all admin data (cavalos, eventos, mensagens, coudelarias, profissionais, reviews).

| Field        | Value                                               |
| ------------ | --------------------------------------------------- |
| Auth         | Admin session required                              |
| Query Params | `q` (min 2 chars), `limit` (default 5 per category) |
| Response     | `{ results: CategoryResult[], total, query }`       |

---

## Admin - Financial

### `GET /api/admin/financeiro/overview`

Get financial overview (total revenue, monthly revenue, MRR, average ticket, revenue by product).

| Field    | Value                                                                                                                                           |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth     | Admin session required                                                                                                                          |
| Response | `{ overview: { totalRevenue, thisMonthRevenue, lastMonthRevenue, growthPercentage, mrr, averageTicket, totalTransactions }, revenueByProduct }` |
| Notes    | All amounts in euros (converted from Stripe centavos).                                                                                          |

### `GET /api/admin/financeiro/transactions`

List payment transactions with filters and pagination.

| Field        | Value                                                                         |
| ------------ | ----------------------------------------------------------------------------- |
| Auth         | Admin session required                                                        |
| Query Params | `product_type`, `status`, `start_date`, `end_date`, `search`, `page`, `limit` |
| Response     | `{ transactions, pagination }`                                                |

### `GET /api/admin/financeiro/charts`

Get chart data for financial dashboards (daily/monthly revenue, revenue by product, MRR evolution).

| Field    | Value                                                                     |
| -------- | ------------------------------------------------------------------------- |
| Auth     | Admin session required                                                    |
| Response | `{ dailyRevenue, monthlyRevenue, revenueByProduct, mrrEvolution, stats }` |

### `GET /api/admin/financeiro/mrr`

Get detailed MRR analytics (current MRR, ARR, growth rate, by package, evolution over 12 months).

| Field    | Value                                                                           |
| -------- | ------------------------------------------------------------------------------- |
| Auth     | Admin session required                                                          |
| Response | `{ currentMRR, arr, mrrGrowthRate, activeSubscriptions, byPackage, evolution }` |

### `GET /api/admin/financeiro/export`

Export transactions as CSV file.

| Field        | Value                                                        |
| ------------ | ------------------------------------------------------------ |
| Auth         | Admin session required                                       |
| Query Params | `product_type`, `status`, `start_date`, `end_date`, `search` |
| Response     | CSV file download                                            |
| Content-Type | `text/csv; charset=utf-8`                                    |

---

## Admin - Analytics

### `GET /api/admin/analytics/traffic`

Get traffic analytics (views, top content, traffic sources, lead growth).

| Field    | Value                                                                        |
| -------- | ---------------------------------------------------------------------------- |
| Auth     | Admin session required                                                       |
| Response | `{ overview, topCavalos, topEventos, trafficSources, contentTypeBreakdown }` |

### `GET /api/admin/analytics/conversions`

Get conversion funnel analytics (visitors to leads to customers).

| Field    | Value                                      |
| -------- | ------------------------------------------ |
| Auth     | Admin session required                     |
| Response | `{ overview, funnel, monthlyConversions }` |

### `GET /api/admin/analytics/sources`

Get traffic source analytics with ROI by channel and monthly trends.

| Field    | Value                                                                                  |
| -------- | -------------------------------------------------------------------------------------- |
| Auth     | Admin session required                                                                 |
| Response | `{ trafficSources, roiByChannel, trendsChart, bestChannel, totalLeads, totalRevenue }` |

---

## Admin - Automations

### `GET /api/admin/automations`

List all automations with filters and stats.

| Field        | Value                                                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------------------------- |
| Auth         | Admin session required                                                                                           |
| Query Params | `enabled`, `trigger_type`, `action_type`                                                                         |
| Response     | `{ automations, stats: { total, enabled, disabled, total_runs, total_successful, total_failed, success_rate } }` |

### `POST /api/admin/automations`

Create a new automation.

| Field         | Value                                                                                                             |
| ------------- | ----------------------------------------------------------------------------------------------------------------- |
| Auth          | Admin session required                                                                                            |
| Body          | `{ name, trigger_type, action_type, action_config, description?, trigger_conditions?, delay_minutes?, enabled? }` |
| Trigger Types | `lead_created`, `payment_succeeded`, `review_submitted`, `cavalo_created`, `time_based`                           |
| Action Types  | `send_email`, `create_task`, `update_field`, `approve_review`, `send_notification`                                |
| Response      | `{ automation }` (201)                                                                                            |

### `PUT /api/admin/automations`

Update an automation.

| Field    | Value                  |
| -------- | ---------------------- |
| Auth     | Admin session required |
| Body     | `{ id, ...fields }`    |
| Response | `{ automation }`       |

### `DELETE /api/admin/automations`

Delete an automation.

| Field        | Value                  |
| ------------ | ---------------------- |
| Auth         | Admin session required |
| Query Params | `id`                   |
| Response     | `{ success: true }`    |

### `POST /api/admin/automations/execute`

Execute an automation manually.

| Field    | Value                                                                                            |
| -------- | ------------------------------------------------------------------------------------------------ |
| Auth     | Admin session required                                                                           |
| Body     | `{ automation_id, trigger_data? }`                                                               |
| Response | `{ success, log_id, result, error? }`                                                            |
| Notes    | Creates execution log. Updates automation statistics (total_runs, successful_runs, failed_runs). |

### `GET /api/admin/automations/logs`

List execution logs for a specific automation.

| Field        | Value                                            |
| ------------ | ------------------------------------------------ |
| Auth         | Admin session required                           |
| Query Params | `automation_id` (required), `limit` (default 10) |
| Response     | `{ logs }`                                       |

---

## Admin - Email Campaigns

### `GET /api/admin/campaigns`

List email campaigns.

| Field    | Value                  |
| -------- | ---------------------- |
| Auth     | Admin session required |
| Response | `{ campaigns }`        |

### `POST /api/admin/campaigns`

Create and optionally send an email campaign.

| Field    | Value                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------- | ----------- | ----------------------------------------- |
| Auth     | Admin session required                                                                            |
| Body     | `{ name, subject, html_content, recipient_type: "all_leads"                                       | "customers" | "custom", custom_emails?, schedule_at? }` |
| Response | `{ campaign, message }`                                                                           |
| Notes    | Sends in batches of 10 via Resend. If `schedule_at` provided, saves as scheduled without sending. |

### `DELETE /api/admin/campaigns`

Delete a campaign.

| Field        | Value                  |
| ------------ | ---------------------- |
| Auth         | Admin session required |
| Query Params | `id`                   |
| Response     | `{ message }`          |

---

## Admin - Instagram Management

### `GET /api/admin/instagram/list`

List Instagram uploads with optional status filter.

| Field        | Value                            |
| ------------ | -------------------------------- |
| Auth         | Admin session required           |
| Query Params | `filter` (status value or "all") |
| Response     | `{ uploads }`                    |

### `POST /api/admin/instagram/update-status`

Update Instagram upload status and optionally notify client.

| Field    | Value                                                            |
| -------- | ---------------------------------------------------------------- | -------------- |
| Auth     | Admin session required                                           |
| Body     | `{ id: string, status: "published"                               | "cancelled" }` |
| Response | `{ success: true, message }`                                     |
| Notes    | Sends notification email to customer when status is "published". |

---

## Admin - Diagnostics

### `GET /api/admin/diagnostico`

Run system diagnostics (auth, database, tables, env vars).

| Field    | Value                                                                                                                                              |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth     | Admin session required                                                                                                                             |
| Response | `{ timestamp, checks: { autenticacao, supabase_conexao, tabela_payments, tabela_contact_submissions, tabela_leads, variaveis_ambiente }, resumo }` |

---

## Admin - Forecasting

### `GET /api/admin/forecasting`

Get forecasting data with linear regression predictions.

| Field        | Value                                                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Auth         | Admin session required                                                                                                               |
| Query Params | `metric` ("revenue", "leads", "customers"), `days_back` (default 30), `days_ahead` (default 7)                                       |
| Response     | `{ metric, historical, forecast, metrics: { growth_rate, current_trend, total_historical, total_forecast, avg_daily, confidence } }` |
| Notes        | Uses simple linear regression for forecasting. Confidence based on data volatility.                                                  |

---

## Admin - Geographic Data

### `GET /api/admin/geo`

Get geographic data aggregated by Portuguese district.

| Field        | Value                                                              |
| ------------ | ------------------------------------------------------------------ |
| Auth         | Admin session required                                             |
| Query Params | `metric` ("leads", "payments", "customers", "cavalos")             |
| Response     | `{ metric, data: { name, value }[], total }`                       |
| Notes        | Maps cities/locations to districts using an internal lookup table. |

---

## Admin - Reports

### `GET /api/admin/reports/generate`

Generate a monthly PDF report with financial data, top horses, leads, and ROI by channel.

| Field        | Value                                       |
| ------------ | ------------------------------------------- |
| Auth         | Admin session required                      |
| Query Params | `month`, `year` (defaults to current month) |
| Response     | PDF file download                           |
| Content-Type | `application/pdf`                           |

---

## Error Response Format

All endpoints follow a consistent error format:

```json
{
  "error": "Human-readable error message"
}
```

Common HTTP status codes:

- **400** - Bad Request (missing/invalid parameters)
- **401** - Unauthorized (missing or invalid session)
- **403** - Forbidden (protected resource)
- **404** - Not Found
- **429** - Too Many Requests (rate limited)
- **500** - Internal Server Error

---

## Authentication Summary

| Type             | Mechanism                                          | Used By                         |
| ---------------- | -------------------------------------------------- | ------------------------------- |
| Admin Session    | `verifySession()` from `@/lib/auth` (cookie-based) | All `/api/admin/*` routes       |
| Supabase Auth    | `supabase.auth.getUser()`                          | `/api/tools/*` routes           |
| Stripe Signature | `stripe.webhooks.constructEvent()`                 | `/api/stripe/webhook`           |
| Bearer Token     | `Authorization: Bearer CRON_SECRET`                | `/api/cart/send-recovery-email` |
| User Cookie      | `user_email` cookie                                | `/api/favoritos`                |
| None             | Public access                                      | All other public routes         |

---

## Rate Limiting

| Route                              | Limit       | Window            |
| ---------------------------------- | ----------- | ----------------- |
| `POST /api/auth/login`             | 5 requests  | 15 minutes per IP |
| `POST /api/newsletter`             | 10 requests | 1 minute per IP   |
| `POST /api/reviews`                | 5 requests  | 1 minute per IP   |
| `POST /api/ebook-gratis/subscribe` | 5 requests  | 1 minute per IP   |

---

## External Services

| Service      | Usage                                                           |
| ------------ | --------------------------------------------------------------- |
| **Supabase** | Primary database (PostgreSQL) and file storage                  |
| **Stripe**   | Payment processing (checkout sessions, subscriptions, webhooks) |
| **Resend**   | Transactional and marketing email delivery                      |
| **Shopify**  | E-commerce checkout for shop products                           |
| **Sanity**   | CMS for newsletter subscribers                                  |
