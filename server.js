// — [SPRINT 01 – BASE: Express e ES Modules – mantido da primeira aula] —
import express from "express";

// — [SPRINT 04 – NOVO] —
// Módulo que lê e grava as mensagens em arquivo JSON.
import { lerMensagens, salvarMensagens } from "./store.js";


const app = express();
const PORT = 3000;


// — [SPRINT 01 – ROTAS HERDADAS: /, /status, /sobre] —
// Rotas da Sprint 01 – continuam disponíveis.
app.get("/", (req, res) => res.send("Servidor rodando! 🚀"));
app.get("/status", (req, res) => res.json({ status: "online", sprint: 4 }));
app.get("/sobre", (req, res) => res.send("Mensageiro Local com Node.js, Express e ES Modules."));


// — [SPRINT 04 – ROTAS ALTERADAS PARA USAR ARQUIVOS] —
app.get("/mensagens", async (req, res) => {
  try { res.json(await lerMensagens()); }
  catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Não foi possível ler as mensagens." });
  }
});

app.get("/mensagens/:id", async (req, res) => {
  try {
    const lista = await lerMensagens();
    const mensagem = lista.find(m => m.id === Number(req.params.id));
    if (!mensagem) return res.status(404).json({ erro: "Mensagem não encontrada." });
    res.json(mensagem);
  } catch (erro) {
    console.error(erro);

res.status(500).json({ erro: "Falha ao consultar mensagem." });
  }
});

app.get("/total-mensagens", async (req, res) => {
  try { res.json({ total: (await lerMensagens()).length }); }
  catch (erro) { res.status(500).json({ erro: "Falha na contagem." }); }
});

// Rota temporária com erro planejado para demonstração.
app.get("/exemplo-salvar", async (req, res) => {
  try {
    throw new Error("Falha planejada na gravação.");
  } catch (erro) {
    console.error("Erro planejado em /exemplo-salvar:", erro.message);
    res.status(500).json({
      erro: "Erro planejado em /exemplo-salvar",
      detalhes: erro.message,
      dica: "Use /gravar-mensagem-correta para gravar uma mensagem."
    });
  }
});

// GET modifica dados somente para esta demonstração; em uma API real, use POST.
let filaGravacoes = Promise.resolve();
app.get("/gravar-mensagem-correta", (req, res) => {
  const tarefa = filaGravacoes.then(async () => {
    const lista = await lerMensagens();
    const id = lista.reduce((maior, mensagem) => Math.max(maior, Number(mensagem.id) || 0), 0) + 1;
    const mensagem = { id, usuario: "Exemplo", texto: "Gravado em arquivo!" };
    await salvarMensagens([...lista, mensagem]);
    return { aviso: "Mensagem gravada com sucesso!", mensagem, total: lista.length + 1 };
  });
  filaGravacoes = tarefa.catch(() => {});
  tarefa.then(resultado => res.json(resultado)).catch(erro => {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao gravar arquivo." });
  });
});


// — [SPRINT 01 – SERVIDOR: iniciado na porta 3000; mantido ao longo das aulas] —
app.listen(PORT, () => { console.log(`Servidor em http://localhost:${PORT}`);
});