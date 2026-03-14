// Variáveis de controle
let mesSelecionadoIndex = new Date().getMonth();
const nomesMeses = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

// Dropdown customizado
const dropdown = document.getElementById('mes-dropdown');
const trigger = dropdown.querySelector('.select-trigger');
const labelMes = document.getElementById('mes-selecionado');
const options = dropdown.querySelectorAll('.option');

labelMes.innerText = nomesMeses[mesSelecionadoIndex];
marcarOpcaoSelecionada(mesSelecionadoIndex);

trigger.addEventListener('click', () => dropdown.classList.toggle('open'));

window.addEventListener('click', (e) => {
  if (!dropdown.contains(e.target)) dropdown.classList.remove('open');
});

options.forEach(opt => {
  opt.addEventListener('click', () => {
    mesSelecionadoIndex = parseInt(opt.dataset.value);
    labelMes.innerText = nomesMeses[mesSelecionadoIndex];
    dropdown.classList.remove('open');
    marcarOpcaoSelecionada(mesSelecionadoIndex);
    renderizarListas();
    limparResumo();
  });
});

function marcarOpcaoSelecionada(index) {
  options.forEach(opt => opt.classList.toggle('selected', parseInt(opt.dataset.value) === index));
}

// Dados
let todosDados = JSON.parse(localStorage.getItem('meuFinanceTracker')) || {};

function getMes() {
  const mes = mesSelecionadoIndex;
  if (!todosDados[mes]) todosDados[mes] = { gastos: [], cartao: [], investimentos: [], entradas: [] };
  return todosDados[mes];
}

function salvarDados() {
  localStorage.setItem('meuFinanceTracker', JSON.stringify(todosDados));
  renderizarListas();
}

function limparInputs(ids) {
  ids.forEach(id => { if (document.getElementById(id)) document.getElementById(id).value = ''; });
}

function removerItem(categoria, id) {
  getMes()[categoria] = getMes()[categoria].filter(item => item.id !== id);
  salvarDados();
}

// Abas
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// ===== ENTER PARA ADICIONAR =====
function configurarEnter(ids, funcao, focoApos) {
  ids.forEach((id, index) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        // Se não é o último campo, vai pro próximo
        if (index < ids.length - 1) {
          document.getElementById(ids[index + 1])?.focus();
        } else {
          // É o último campo: executa a função e volta pro primeiro
          funcao();
          document.getElementById(focoApos)?.focus();
        }
      }
    });
  });
}

// Configurar Enter em cada aba
configurarEnter(['gasto-nome', 'gasto-real', 'gasto-data'], adicionarGasto, 'gasto-nome');
configurarEnter(['cartao-item', 'cartao-valor'], adicionarCartao, 'cartao-item');
configurarEnter(['invest-valor'], adicionarInvest, 'invest-valor');
configurarEnter(['entrada-nome', 'entrada-valor'], adicionarEntrada, 'entrada-nome');

// Adicionar itens
function adicionarGasto() {
  const nome = document.getElementById('gasto-nome').value.trim();
  const real = parseFloat(document.getElementById('gasto-real').value) || 0;
  const data = document.getElementById('gasto-data').value;
  if (!nome || !real) return alert('Preencha os campos!');
  getMes().gastos.push({ nome, real, data, id: Date.now() });
  limparInputs(['gasto-nome', 'gasto-real', 'gasto-data']);
  salvarDados();
}

function adicionarCartao() {
  const item = document.getElementById('cartao-item').value.trim();
  const valor = parseFloat(document.getElementById('cartao-valor').value) || 0;
  const data = new Date().toISOString().split('T')[0]; // data automática, sem mostrar
  if (!item || !valor) return alert('Preencha os campos!');
  getMes().cartao.push({ item, valor, data, id: Date.now() });
  limparInputs(['cartao-item', 'cartao-valor']);
  salvarDados();
}

function adicionarInvest() {
  const tipo = document.getElementById('invest-tipo').value;
  const valor = parseFloat(document.getElementById('invest-valor').value) || 0;
  if (!valor) return alert('Informe o valor!');
  getMes().investimentos.push({ tipo, valor, id: Date.now() });
  limparInputs(['invest-valor']);
  salvarDados();
}

function adicionarEntrada() {
  const nome = document.getElementById('entrada-nome').value.trim();
  const valor = parseFloat(document.getElementById('entrada-valor').value) || 0;
  if (!nome || !valor) return alert('Preencha os campos!');
  getMes().entradas.push({ nome, valor, id: Date.now() });
  limparInputs(['entrada-nome', 'entrada-valor']);
  salvarDados();
}

// Renderização
function formatarData(data) {
  if (!data) return 'Não informado';
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

function renderizarListas() {
  const d = getMes();
  const vazio = (m) => `<p style="color:#666;text-align:center;padding:20px;">${m}</p>`;

  document.getElementById('lista-gastos').innerHTML = d.gastos.length === 0
    ? vazio('Nenhum gasto registrado.')
    : d.gastos.map(g => `
      <li class="item-card">
        <div class="item-info">
          <h5>${g.nome}</h5>
          <p><i class="fas fa-check-circle"></i> Pago dia: ${formatarData(g.data)}</p>
        </div>
        <div class="item-values"><span class="val-real">R$ ${g.real.toFixed(2)}</span></div>
        <button class="btn-del" onclick="removerItem('gastos', ${g.id})"><i class="fas fa-trash-alt"></i></button>
      </li>`).join('');

  // Cartão — sem data visível, só o nome e valor
  document.getElementById('lista-cartao').innerHTML = d.cartao.length === 0
    ? vazio('Nenhum lançamento no cartão.')
    : d.cartao.map(c => `
      <li class="item-card" style="border-left-color:#ff5252;">
        <div class="item-info">
          <h5>${c.item}</h5>
          <p><i class="fas fa-credit-card"></i> Crédito</p>
        </div>
        <div class="item-values"><span class="val-real" style="color:#ff5252;">R$ ${c.valor.toFixed(2)}</span></div>
        <button class="btn-del" onclick="removerItem('cartao', ${c.id})"><i class="fas fa-trash-alt"></i></button>
      </li>`).join('');

  document.getElementById('lista-invest').innerHTML = d.investimentos.length === 0
    ? vazio('Nenhum investimento registrado.')
    : d.investimentos.map(i => `
      <li class="item-card" style="border-left-color:#ffab40;">
        <div class="item-info"><h5>${i.tipo}</h5></div>
        <div class="item-values"><span class="val-real" style="color:#ffab40;">R$ ${i.valor.toFixed(2)}</span></div>
        <button class="btn-del" onclick="removerItem('investimentos', ${i.id})"><i class="fas fa-trash-alt"></i></button>
      </li>`).join('');

  document.getElementById('lista-entradas').innerHTML = d.entradas.length === 0
    ? vazio('Nenhuma entrada registrada.')
    : d.entradas.map(e => `
      <li class="item-card" style="border-left-color:#00e676;">
        <div class="item-info"><h5>${e.nome}</h5></div>
        <div class="item-values"><span class="val-real" style="color:#00e676;">R$ ${e.valor.toFixed(2)}</span></div>
        <button class="btn-del" onclick="removerItem('entradas', ${e.id})"><i class="fas fa-trash-alt"></i></button>
      </li>`).join('');
}

function limparResumo() {
  const el = document.getElementById('resultado-final');
  el.innerText = 'R$ 0,00';
  el.style.color = '#00e676';
  document.getElementById('detalhes-resumo').innerHTML = '';
}

function calcularTudo() {
  const d = getMes();
  const tG = d.gastos.reduce((acc, g) => acc + g.real, 0);
  const tC = d.cartao.reduce((acc, c) => acc + c.valor, 0);
  const tI = d.investimentos.reduce((acc, i) => acc + i.valor, 0);
  const tE = d.entradas.reduce((acc, e) => acc + e.valor, 0);
  const saldo = tE - (tG + tC + tI);

  const el = document.getElementById('resultado-final');
  el.innerText = `R$ ${saldo.toFixed(2)}`;
  el.style.color = saldo >= 0 ? '#00e676' : '#ff5252';

  let html = `
    <div class="resumo-linha"><span>💰 Entradas</span><span style="color:#00e676;">+ R$ ${tE.toFixed(2)}</span></div>
    <div class="resumo-linha"><span>💸 Gastos</span><span style="color:#ff5252;">- R$ ${tG.toFixed(2)}</span></div>
    <div class="resumo-linha"><span>💳 Cartão</span><span style="color:#ff5252;">- R$ ${tC.toFixed(2)}</span></div>
    <div class="resumo-linha"><span>📈 Investimentos</span><span style="color:#ffab40;">- R$ ${tI.toFixed(2)}</span></div>
    <div class="resumo-detalhado">
      <p class="resumo-detalhado-titulo">📋 Extrato Detalhado</p>
  `;

  d.gastos.forEach(g => { html += `<div class="resumo-item-pequeno"><span>💸 ${g.nome}</span><span>R$ ${g.real.toFixed(2)}</span></div>`; });
  d.cartao.forEach(c => { html += `<div class="resumo-item-pequeno"><span>💳 ${c.item}</span><span>R$ ${c.valor.toFixed(2)}</span></div>`; });
  d.investimentos.forEach(i => { html += `<div class="resumo-item-pequeno"><span>📈 ${i.tipo}</span><span>R$ ${i.valor.toFixed(2)}</span></div>`; });
  d.entradas.forEach(e => { html += `<div class="resumo-item-pequeno"><span>💰 ${e.nome}</span><span style="color:#00e676;">+ R$ ${e.valor.toFixed(2)}</span></div>`; });

  html += `</div>`;
  document.getElementById('detalhes-resumo').innerHTML = html;

  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelector('[data-tab="resumo"]').classList.add('active');
  document.getElementById('resumo').classList.add('active');
}

function resetarTudo() {
  const opcao = confirm('🗑️ Resetar TODOS os meses?\n\nOK = apaga tudo\nCancelar = apaga só o mês atual');
  if (opcao) {
    localStorage.removeItem('meuFinanceTracker');
    todosDados = {};
  } else {
    todosDados[mesSelecionadoIndex] = { gastos: [], cartao: [], investimentos: [], entradas: [] };
    localStorage.setItem('meuFinanceTracker', JSON.stringify(todosDados));
  }
  renderizarListas();
  limparResumo();
  alert('✅ Dados apagados!');
}

// Init
limparResumo();
renderizarListas();

// Configurar Enter (após funções estarem definidas)
configurarEnter(['gasto-nome', 'gasto-real', 'gasto-data'], adicionarGasto, 'gasto-nome');
configurarEnter(['cartao-item', 'cartao-valor'], adicionarCartao, 'cartao-item');
configurarEnter(['invest-valor'], adicionarInvest, 'invest-valor');
configurarEnter(['entrada-nome', 'entrada-valor'], adicionarEntrada, 'entrada-nome');