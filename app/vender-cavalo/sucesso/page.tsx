import { Suspense } from "react";
import { getNonce } from "@/lib/nonce";
import VenderCavaloSucessoContent from "./content";

async function VenderCavaloSucessoPage() {
  const nonce = await getNonce();

  return (
    <Suspense>
      <VenderCavaloSucessoContent nonce={nonce} />
    </Suspense>
  );
}

export default VenderCavaloSucessoPage;
