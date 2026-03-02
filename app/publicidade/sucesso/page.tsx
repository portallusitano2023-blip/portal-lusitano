import { Suspense } from "react";
import { getNonce } from "@/lib/nonce";
import PublicidadeSucessoContent from "./content";

async function PublicidadeSucessoPage() {
  const nonce = await getNonce();

  return (
    <Suspense>
      <PublicidadeSucessoContent nonce={nonce} />
    </Suspense>
  );
}

export default PublicidadeSucessoPage;
