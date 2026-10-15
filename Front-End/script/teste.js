var API_BASE = window.API_BASE || ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:3000'
  : 'https://orientec-api.loca.lt');

let perguntaAtual = 0;
let perguntas = [];
let cursos = [];
let respostasSelecionadas = [];

// Elementos do DOM
const introContainer = document.getElementById('intro-container');
const quizContainer = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result-container');

const startBtn = document.getElementById('start-btn');
const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const progressText = document.getElementById('progress-text');
const progressBar = document.getElementById('progress-bar');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');

async function iniciarQuiz() {
  perguntaAtual = 0;
  respostasSelecionadas = [];

  if (introContainer) introContainer.style.display = 'none';
  quizContainer.style.display = 'block';
  resultContainer.style.display = 'none';

  questionElement.textContent = 'Carregando perguntas...';
  answersElement.innerHTML = '';

  try {
    const [respPerguntas, respCursos] = await Promise.all([
      fetch(`${API_BASE}/perguntas`),
      fetch(`${API_BASE}/cursos`)
    ]);

    if (!respPerguntas.ok || !respCursos.ok) throw new Error('Falha ao buscar dados');

    perguntas = await respPerguntas.json();
    cursos = await respCursos.json();

    if (perguntas.length === 0) {
      questionElement.textContent = 'Nenhuma pergunta cadastrada no momento.';
      return;
    }
    if (cursos.length === 0) {
      questionElement.textContent = 'Nenhum curso cadastrado no momento.';
      return;
    }

    respostasSelecionadas = new Array(perguntas.length).fill(null);
    mostrarPergunta();
  } catch (error) {
    console.error(error);
    questionElement.textContent = 'Erro ao carregar o teste. Tente novamente mais tarde.';
  }
}

function mostrarPergunta() {
  answersElement.innerHTML = '';
  const q = perguntas[perguntaAtual];

  questionElement.textContent = `${perguntaAtual + 1}. ${q.pergunta}`;
  if (progressText) progressText.textContent = `Pergunta ${perguntaAtual + 1} de ${perguntas.length}`;
  if (progressBar) progressBar.style.width = `${((perguntaAtual + 1) / perguntas.length) * 100}%`;

  q.respostas.forEach((resp, index) => {
    const button = document.createElement('button');
    button.className = 'answer-btn';

    if (respostasSelecionadas[perguntaAtual] === index) {
      button.classList.add('selected');
    }

    button.textContent = resp.texto;
    button.onclick = () => selecionarOpcao(index);
    answersElement.appendChild(button);
  });

  if (prevBtn) {
    prevBtn.style.display = perguntaAtual === 0 ? 'none' : 'inline-block';
  }
  if (nextBtn) {
    nextBtn.innerHTML = perguntaAtual === perguntas.length - 1 ? 'Finalizar' : 'Próxima';
  }
}

function selecionarOpcao(index) {
  respostasSelecionadas[perguntaAtual] = index;

  const botoes = answersElement.querySelectorAll('.answer-btn');
  botoes.forEach((btn, idx) => {
    if (idx === index) btn.classList.add('selected');
    else btn.classList.remove('selected');
  });
}

function proximaPergunta() {
  if (respostasSelecionadas[perguntaAtual] === null) {
    alert('Por favor, selecione uma resposta antes de continuar.');
    return;
  }

  if (perguntaAtual < perguntas.length - 1) {
    perguntaAtual++;
    mostrarPergunta();
  } else {
    finalizarQuiz();
  }
}

function anteriorPergunta() {
  if (perguntaAtual > 0) {
    perguntaAtual--;
    mostrarPergunta();
  }
}

function finalizarQuiz() {
  // ── 1. Acumula pontuação por tag global ─────────────────────────────
  const pontuacaoTags = {};

  respostasSelecionadas.forEach((respostaIndex, qIndex) => {
    if (respostaIndex === null) return;
    const pesos = perguntas[qIndex].respostas[respostaIndex].pesos || {};
    Object.keys(pesos).forEach(tag => {
      if (pontuacaoTags[tag] === undefined) pontuacaoTags[tag] = 0;
      pontuacaoTags[tag] += Number(pesos[tag]) || 0;
    });
  });

  // ── 2. Percentual por tag (0–100) ───────────────────────────────────
  // Máximo teórico por tag: 3 pontos em cada pergunta
  const maxPorTag = perguntas.length * 3;
  const percentualTags = {};
  Object.keys(pontuacaoTags).forEach(tag => {
    percentualTags[tag] = maxPorTag > 0
      ? (pontuacaoTags[tag] / maxPorTag) * 100
      : 0;
  });

  // ── 3. Score de cada curso = média ponderada dos percentuais das suas tags
  const pontuacaoCursos = cursos.map(curso => {
    const tagsDoCurso = (curso.tags || []).filter(t => Number(t.peso) > 0);

    if (tagsDoCurso.length === 0) {
      return { curso, score: 0 };
    }

    let numerador = 0;
    let denominador = 0;

    tagsDoCurso.forEach(t => {
      const perc = percentualTags[t.chave] || 0;
      numerador += perc * Number(t.peso);
      denominador += Number(t.peso);
    });

    const score = denominador > 0 ? numerador / denominador : 0;
    return { curso, score };
  });

  // ── 4. Ordena e define vencedor ─────────────────────────────────────
  pontuacaoCursos.sort((a, b) => b.score - a.score);
  const vencedor = pontuacaoCursos[0];
  const maiorScore = Math.max(...pontuacaoCursos.map(p => p.score), 0.0001);

  quizContainer.style.display = 'none';
  resultContainer.style.display = 'block';

  // ── 5. Renderiza vencedor ───────────────────────────────────────────
  const resultadoPrincipal = document.getElementById('resultado-principal');
  if (resultadoPrincipal) {
    resultadoPrincipal.innerHTML = `
      <div class="curso-vencedor">
        <h2>Seu Perfil Ideal É:</h2>
        <h1>${vencedor.curso.nome}</h1>
        <p class="vencedor-descricao">
          ${vencedor.curso.resumo || 'Seu perfil demonstrou maior afinidade com esta área.'}
        </p>
        <button class="btn-primary-quiz"
          onclick="window.location.href='cursos.html#curso-${vencedor.curso.id}'"
          style="margin-top: 16px;">
          Conhecer Cursos
        </button>
      </div>
    `;
  }

  const rankingContainer = document.getElementById('ranking-completo');
  if (rankingContainer) {
    rankingContainer.innerHTML = '';

    // Descobre o pior e o melhor score para normalizar as barras
    const scores = pontuacaoCursos.map(p => p.score);
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    const range = Math.max(maxScore - minScore, 0.001); // evita divisão por zero

    // Barra vai de 30% (pior) até 100% (melhor)
    const PISO = 30;

    pontuacaoCursos.forEach((item, idx) => {
      const afinidadeReal = (Math.round(item.score * 10) / 10).toFixed(1).replace('.', ',');
      const larguraBarra = PISO + ((item.score - minScore) / range) * (100 - PISO);

      const div = document.createElement('div');
      div.className = `ranking-item ${idx === 0 ? 'destaque' : ''}`;
      div.innerHTML = `
            <span class="ranking-posicao">${idx + 1}º</span>
            <div class="ranking-info">
                <div class="ranking-nome">${item.curso.nome}</div>
                <div class="ranking-bar">
                    <div class="ranking-fill" style="width: ${larguraBarra}%;"></div>
                </div>
            </div>
            <span class="ranking-pontos">${afinidadeReal}%</span>
        `;
      rankingContainer.appendChild(div);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (startBtn) startBtn.addEventListener('click', iniciarQuiz);
  if (nextBtn) nextBtn.addEventListener('click', proximaPergunta);
  if (prevBtn) prevBtn.addEventListener('click', anteriorPergunta);
  if (restartBtn) restartBtn.addEventListener('click', iniciarQuiz);
});