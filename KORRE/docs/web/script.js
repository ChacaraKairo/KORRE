const docs = [
  ["00-indice-geral.md", "Índice geral"],
  ["01-visao-geral-do-korre.md", "Visão geral"],
  ["02-arquitetura-geral.md", "Arquitetura"],
  ["03-app-mobile.md", "App mobile"],
  ["04-rotas-e-navegacao.md", "Rotas"],
  ["05-banco-de-dados-sqlite.md", "Banco SQLite"],
  ["06-migracoes-do-banco.md", "Migrações"],
  ["07-backup-e-restauracao.md", "Backup"],
  ["08-autenticacao-e-seguranca.md", "Segurança"],
  ["09-garagem-e-veiculos.md", "Garagem"],
  ["10-financeiro.md", "Financeiro"],
  ["11-oficina-e-manutencao.md", "Oficina"],
  ["12-auditoria-korre-indices.md", "Auditoria KORRE"],
  ["13-analise-manual-de-corrida.md", "Análise de corrida"],
  ["14-calculadora-flex-e-abastecimentos.md", "Calculadora Flex"],
  ["15-notificacoes.md", "Notificações"],
  ["16-privacidade-consentimento-e-dados.md", "Privacidade"],
  ["17-sincronizacao-com-servidor.md", "Sincronização"],
  ["18-servidor-korre-platform.md", "Servidor"],
  ["19-painel-admin-web.md", "Painel web"],
  ["20-painel-electron.md", "Electron"],
  ["21-relatorios-e-dados-veiculares.md", "Relatórios"],
  ["22-internacionalizacao-i18n.md", "i18n"],
  ["23-testes-e-validacao.md", "Testes"],
  ["24-build-e-publicacao.md", "Build"],
  ["25-checklist-de-producao.md", "Checklist"],
  ["26-roadmap-tecnico.md", "Roadmap"],
  ["27-glossario.md", "Glossário"]
];

const menu = document.getElementById("menu");
const cards = document.getElementById("cards");
const search = document.getElementById("search");

function render(filter = "") {
  const list = docs.filter(([, label]) => label.toLowerCase().includes(filter.toLowerCase()));
  menu.innerHTML = list.map(([file, label]) => `<a href="../${file}" target="_blank">${label}</a>`).join("");
  cards.innerHTML = list.map(([file, label]) => `<article class="card"><h4>${label}</h4><a href="../${file}" target="_blank">Abrir documento</a></article>`).join("");
}

search.addEventListener("input", (e) => render(e.target.value));
render();
