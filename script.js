// Variáveis de controle
let mesSelecionadoIndex = new Date().getMonth();
const nomesMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

// Elementos do Dropdown Customizado
const dropdown = document.getElementById('mes-dropdown');
const trigger = dropdown.querySelector('.select-trigger');
const labelMes = document.getElementById('mes-selecionado');
const options = dropdown.querySelectorAll('.option');

// Inicializa o texto do mês atual
labelMes.innerText = nomesMeses[mesSelecionadoIndex];
marcarOpcaoSelecionada(mesSelecionadoIndex);

// Abrir/Fechar Dropdown
trigger.addEventListener('click', () => {
  dropdown.classList.toggle('open');
});

// Fechar ao clicar fora
window.addEventListener('click', (e) => {
  if (!dropdown.contains(e.target)) dropdown.classList.remove('open');
});

// Selecionar Mês
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
  options.forEach(opt => {
    opt.classList.toggle('selected', parseInt(opt.dataset.value) === index);
  });
}

// --- Lógica de Dados ---

let todosDados = JSON.parse(localStorage.getItem('meuFinanceTracker')) || {};

function getMes() {
  const mes = mesSelecionadoIndex;
  if (!todosDados[mes]) {
    todosDados[mes] = { gastos: [], cartao: [], investimentos: [], entradas: [] };
  }
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

// Funções de Adicionar (Gastos, Cartão, Invest, Entradas)
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
  if (!item || !valor) return alert('Preencha os campos!');
  getMes().cartao.push({ item, valor, id: Date.now() });
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
  if (!data) return '';
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

function renderizarListas() {
  const d = getMes();
  const vazio = (m) => `<p style="color:#666; text-align:center; padding:20px;">${m}</p>`;

  document.getElementById('lista-gastos').innerHTML = d.gastos.length === 0 ? vazio('Vazio') : d.gastos.map(g => `
    <li class="item-card">
      <div class="item-info"><h5>${g.nome}</h5><p><i class="fas fa-check-circle"></i> Pago dia: ${g.data ? formatarData(g.data) : 'Não informado'}</p></div>
      <div class="item-values"><span class="val-real">R$ ${g.real.toFixed(2)}</span></div>
      <button class="btn-del" onclick="removerItem('gastos', ${g.id})"><i class="fas fa-trash-alt"></i></button>
    </li>`).join('');

  document.getElementById('lista-cartao').innerHTML = d.cartao.length === 0 ? vazio('Vazio') : d.cartao.map(c => `
    <li class="item-card" style="border-left-color:#ff5252;">
      <div class="item-info"><h5>${c.item}</h5><p><i class="fas fa-credit-card"></i> Crédito</p></div>
      <div class="item-values"><span class="val-real" style="color:#ff5252;">R$ ${c.valor.toFixed(2)}</span></div>
      <button class="btn-del" onclick="removerItem('cartao', ${c.id})"><i class="fas fa-trash-alt"></i></button>
    </li>`).join('');

  document.getElementById('lista-invest').innerHTML = d.investimentos.length === 0 ? vazio('Vazio') : d.investimentos.map(i => `
    <li class="item-card" style="border-left-color:#ffab40;">
      <div class="item-info"><h5>${i.tipo}</h5></div>
      <div class="item-values"><span class="val-real" style="color:#ffab40;">R$ ${i.valor.toFixed(2)}</span></div>
      <button class="btn-del" onclick="removerItem('investimentos', ${i.id})"><i class="fas fa-trash-alt"></i></button>
    </li>`).join('');

  document.getElementById('lista-entradas').innerHTML = d.entradas.length === 0 ? vazio('Vazio') : d.entradas.map(e => `
    <li class="item-card" style="border-left-color:#00e676;">
      <div class="item-info"><h5>${e.nome}</h5></div>
      <div class="item-values"><span class="val-real" style="color:#00e676;">R$ ${e.valor.toFixed(2)}</span></div>
      <button class="btn-del" onclick="removerItem('entradas', ${e.id})"><i class="fas fa-trash-alt"></i></button>
    </li>`).join('');
}

function limparResumo() {
  document.getElementById('resultado-final').innerText = 'R$ 0,00';
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

  document.getElementById('detalhes-resumo').innerHTML = `
    <div class="resumo-linha"><span>Entradas</span><span style="color:#00e676;">+ R$ ${tE.toFixed(2)}</span></div>
    <div class="resumo-linha"><span>Saídas</span><span style="color:#ff5252;">- R$ ${(tG+tC+tI).toFixed(2)}</span></div>
  `;
}

function resetarTudo() {
  if(confirm('Resetar tudo?')) { localStorage.removeItem('meuFinanceTracker'); location.reload(); }
}

renderizarListas();