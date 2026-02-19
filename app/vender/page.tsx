import { redirect } from "next/navigation";

// Rota antiga substituída por /vender-cavalo (com Stripe, validação e i18n)
// Redirect mantido para não quebrar bookmarks existentes
export default function VenderRedirect() {
  redirect("/vender-cavalo");
}
