const API_BASE = 'http://localhost:3000';

let perguntaAtual = 0;
let perguntas = [];
let respostasSelecionadas = [];

const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const quizContainer = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result-container');
const progressText = document.getElementById('progress-text');
const progressBar = document.getElementById('progress-bar');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');

const nomesCursos = {
  dev: 'Desenvolvimento de Sistemas',
  quimica: 'Química',
  logistica: 'Logística',
  eletronica: 'Eletrônica',
  adm: 'Administração'
};

const descricoesCursos = {
  dev: 'Você possui forte inclinação para lógica, tecnologia, desenvolvimento de software e resolução de problemas estruturados.',
  quimica: 'Seu perfil atrai interesse por processos laboratoriais, transformações da matéria e análise técnica de materiais.',
  logistica: 'Sua vocação está voltada para organização de fluxos, controle de estoque, transporte e otimização de processos.',
  eletronica: 'Você demonstra grande aptidão por circuitos, sistemas elétricos, hardware e automação tecnológica.',
  adm: 'Seu forte é a gestão de recursos, planejamento financeiro, liderança e visão estratégica de negócios.'
};

async function iniciarQuiz() {
  perguntaAtual = 0;
  respostasSelecionadas = [];
  
  quizContainer.style.display = 'block';
  resultContainer.style.display = 'none';

  questionElement.textContent = 'Carregando perguntas...';
  answersElement.innerHTML = '';

  try {
    const response = await fetch(`${API_BASE}/perguntas`);
    if (!response.ok) throw new Error();
    
    perguntas = await response.json();
    
    if (perguntas.length === 0) {
      questionElement.textContent = 'Nenhuma pergunta cadastrada no momento.';
      return;
    }

    respostasSelecionadas = new Array(perguntas.length).fill(null);
    mostrarPergunta();
  } catch (error) {
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
    
    // Marca como selecionada caso o usuário já tenha marcado essa opção antes
    if (respostasSelecionadas[perguntaAtual] === index) {
      button.classList.add('selected');
    }

    button.textContent = resp.texto;
    button.onclick = () => selecionarOpcao(index);
    answersElement.appendChild(button);
  });

  // Atualiza visibilidade e estado dos botões
  if (prevBtn) {
    prevBtn.style.display = perguntaAtual === 0 ? 'none' : 'inline-block';
  }
  
  if (nextBtn) {
    nextBtn.innerHTML = perguntaAtual === perguntas.length - 1 ? 'Finalizar' : 'Próxima';
  }
}

function selecionarOpcao(index) {
  respostasSelecionadas[perguntaAtual] = index;
  
  // Atualiza borda de seleção nos botões
  const botoes = answersElement.querySelectorAll('.answer-btn');
  botoes.forEach((btn, idx) => {
    if (idx === index) {
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
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
  let pontuacaoCursos = { dev: 0, quimica: 0, logistica: 0, eletronica: 0, adm: 0 };

  respostasSelecionadas.forEach((respostaIndex, qIndex) => {
    if (respostaIndex !== null) {
      const pesos = perguntas[qIndex].respostas[respostaIndex].pesos;
      Object.keys(pesos).forEach(curso => {
        if (pontuacaoCursos[curso] !== undefined) {
          pontuacaoCursos[curso] += pesos[curso];
        }
      });
    }
  });

  quizContainer.style.display = 'none';
  resultContainer.style.display = 'block';

  const ranking = Object.entries(pontuacaoCursos).sort((a, b) => b[1] - a[1]);
  const cursoVencedorKey = ranking[0][0];
  const maiorPontuacao = Math.max(...Object.values(pontuacaoCursos), 1);

// Renderiza o cabeçalho do curso vencedor
const resultadoPrincipal = document.getElementById('resultado-principal');
if (resultadoPrincipal) {
  resultadoPrincipal.innerHTML = `
    <div class="curso-vencedor">
      <h2>Seu Perfil Ideal É:</h2>
      <h1>${nomesCursos[cursoVencedorKey] || cursoVencedorKey.toUpperCase()}</h1>
      <p class="vencedor-descricao">
        ${descricoesCursos[cursoVencedorKey] || 'Seu perfil demonstrou maior afinidade com esta área.'}
      </p>
      <button class="btn-primary-quiz" onclick="window.location.href='cursos.html#curso-${cursoVencedorKey}'" style="margin-top: 16px;">
        Conhecer Cursos
      </button>
    </div>
  `;
}

  // Renderiza as barras de ranking
  const rankingContainer = document.getElementById('ranking-completo');
  if (rankingContainer) {
    rankingContainer.innerHTML = '';
    
    ranking.forEach(([cursoKey, pontos], idx) => {
      const porcentagem = Math.round((pontos / maiorPontuacao) * 100);
      
      const item = document.createElement('div');
      item.className = `ranking-item ${idx === 0 ? 'destaque' : ''}`;
      item.innerHTML = `
        <span class="ranking-posicao">${idx + 1}º</span>
        <div class="ranking-info">
          <div class="ranking-nome">${nomesCursos[cursoKey] || cursoKey.toUpperCase()}</div>
          <div class="ranking-bar">
            <div class="ranking-fill" style="width: ${porcentagem}%;"></div>
          </div>
        </div>
        <span class="ranking-pontos">${porcentagem}%</span>
      `;
      rankingContainer.appendChild(item);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  iniciarQuiz();
  if (nextBtn) nextBtn.addEventListener('click', proximaPergunta);
  if (prevBtn) prevBtn.addEventListener('click', anteriorPergunta);
  if (restartBtn) restartBtn.addEventListener('click', iniciarQuiz);
});