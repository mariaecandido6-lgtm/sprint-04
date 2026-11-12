//SPRINT 04-persistência JSON
import { mkdir, readFile, writeFile } from "node:fs/promises";

const PASTA = new URL("./data/", import.meta.url);
const ARQUIVO = new URL("./data/mensagens.json", import.meta.url);

export async function lerMensagens() {
  try {
    const conteudo = await readFile(ARQUIVO, "utf8");
    const dados = JSON.parse(conteudo);
    if (!Array.isArray(dados)) throw new Error("O JSON precisa conter um array.");
    return dados;
  } catch (erro) {
    if (erro.code === "ENOENT") return [];
    throw erro; // outros erros não podem ser silenciados
  }
}


export async function salvarMensagens(mensagens) {
  await mkdir(PASTA, { recursive: true });
  await writeFile(ARQUIVO, JSON.stringify(mensagens, null, 2), "utf8");
}