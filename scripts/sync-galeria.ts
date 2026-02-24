/**
 * Sincroniza as imagens locais em public/images/coudelarias/
 * com o campo `galeria` e `foto_capa` na base de dados Supabase.
 *
 * Aceita QUALQUER nome de ficheiro (ex: "Captura de ecrã 2026-02-23.png").
 * - Se existir um ficheiro com nome "capa.*" → foto_capa
 * - Caso contrário, o 1º ficheiro alfabeticamente → foto_capa
 * - Todos os restantes → galeria[]
 *
 * Executar: npx tsx scripts/sync-galeria.ts
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";
import { readdirSync, existsSync } from "fs";

config({ path: resolve(process.cwd(), ".env.local") });

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BASE_DIR = resolve(process.cwd(), "public/images/coudelarias");

async function sync() {
  // Buscar todas as coudelarias activas
  const { data: coudelarias, error } = await sb
    .from("coudelarias")
    .select("id, slug, foto_capa, galeria")
    .eq("status", "active");

  if (error || !coudelarias) {
    console.error("Erro:", error?.message);
    return;
  }

  let updated = 0;

  for (const c of coudelarias) {
    const dir = resolve(BASE_DIR, c.slug);
    if (!existsSync(dir)) continue;

    const files = readdirSync(dir)
      .filter((f) => /\.(jpg|jpeg|png|webp|avif)$/i.test(f))
      .sort();

    if (files.length === 0) continue;

    // Se existir "capa.*", usa como capa; senão usa o 1º ficheiro
    const capaFile = files.find((f) => /^capa\./i.test(f)) || files[0];
    const galeriaFiles = files.filter((f) => f !== capaFile);

    const basePath = `/images/coudelarias/${c.slug}`;
    const newCapa = `${basePath}/${capaFile}`;
    const newGaleria = galeriaFiles.map((f) => `${basePath}/${f}`);

    // Verificar se precisa de atualização
    const capaChanged = c.foto_capa !== newCapa;
    const galeriaChanged = JSON.stringify(c.galeria || []) !== JSON.stringify(newGaleria);

    if (!capaChanged && !galeriaChanged) continue;

    const updateData: Record<string, unknown> = {};
    if (capaChanged) updateData.foto_capa = newCapa;
    if (galeriaChanged) updateData.galeria = newGaleria;

    const { error: updateErr } = await sb.from("coudelarias").update(updateData).eq("id", c.id);

    if (updateErr) {
      console.error(`❌ ${c.slug}: ${updateErr.message}`);
      continue;
    }

    const changes = [];
    if (capaChanged) changes.push(`capa: ${capaFile}`);
    if (galeriaChanged) changes.push(`galeria: ${newGaleria.length} imagens`);
    console.log(`✅ ${c.slug} — ${changes.join(", ")}`);
    updated++;
  }

  if (updated === 0) {
    console.log("Nenhuma alteração necessária — tudo sincronizado.");
  } else {
    console.log(`\n📊 ${updated} coudelaria(s) atualizada(s)`);
  }
}

sync();
