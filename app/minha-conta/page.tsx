import { getCustomer } from "@/lib/shopify";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import MinhaContaContent from "@/components/minha-conta/MinhaContaContent";

export const dynamic = "force-dynamic";

export default async function MinhaContaPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("shopify_customer_token")?.value;

  if (!token) redirect("/login");

  const customer = await getCustomer(token);

  if (!customer) redirect("/login");

  return (
    <>
      {/* getCustomer returns Shopify API data, cast to local Customer interface */}
      <MinhaContaContent
        customer={customer as unknown as Parameters<typeof MinhaContaContent>[0]["customer"]}
      />
    </>
  );
}
