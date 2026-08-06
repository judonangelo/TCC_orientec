const quizConfig = {
    cursos: {
        dev: {
            nome: "Desenvolvimento de Sistemas",
            icone: "fas fa-code",
            descricao: "Para mentes lógicas que amam resolver problemas com tecnologia.",
            idCurso: 1
        },
        quimica: {
            nome: "Química",
            icone: "fas fa-flask",
            descricao: "Para curiosos científicos que gostam de experimentos e análises.",
            idCurso: 2
        },
        logistica: {
            nome: "Logística",
            icone: "fas fa-truck-loading",
            descricao: "Para organizadores natos que pensam em processos e eficiência.",
            idCurso: 3
        },
        eletronica: {
            nome: "Eletroeletrônica",
            icone: "fas fa-bolt",
            descricao: "Para mãos hábeis que entendem como as coisas funcionam.",
            idCurso: 4
        },
        adm: {
            nome: "Administração",
            icone: "fas fa-chart-line",
            descricao: "Para comunicadores que gostam de liderar e organizar.",
            idCurso: 5
        }
    },
    
    perguntas: [
        {
            id: 1,
            pergunta: "Como você prefere resolver problemas?",
            respostas: [
                { texto: "Com lógica e algoritmos", pesos: { dev: 3, quimica: 1, logistica: 2, eletronica: 2, adm: 1 } },
                { texto: "Com experimentos e testes", pesos: { dev: 1, quimica: 3, logistica: 1, eletronica: 2, adm: 1 } },
                { texto: "Organizando processos passo a passo", pesos: { dev: 1, quimica: 1, logistica: 3, eletronica: 1, adm: 2 } },
                { texto: "Montando ou consertando coisas", pesos: { dev: 2, quimica: 2, logistica: 1, eletronica: 3, adm: 1 } },
                { texto: "Conversando e negociando com pessoas", pesos: { dev: 1, quimica: 1, logistica: 2, eletronica: 1, adm: 3 } }
            ]
        },
        {
            id: 2,
            pergunta: "Qual tipo de ambiente de trabalho te atrai mais?",
            respostas: [
                { texto: "Escritório com computadores modernos", pesos: { dev: 3, quimica: 1, logistica: 2, eletronica: 1, adm: 2 } },
                { texto: "Laboratório com equipamentos científicos", pesos: { dev: 1, quimica: 3, logistica: 1, eletronica: 2, adm: 1 } },
                { texto: "Armazém ou centro de distribuição organizado", pesos: { dev: 1, quimica: 1, logistica: 3, eletronica: 1, adm: 2 } },
                { texto: "Oficina ou fábrica com máquinas", pesos: { dev: 1, quimica: 2, logistica: 1, eletronica: 3, adm: 1 } },
                { texto: "Ambiente corporativo com reuniões", pesos: { dev: 1, quimica: 1, logistica: 2, eletronica: 1, adm: 3 } }
            ]
        },
        {
            id: 3,
            pergunta: "Qual destas matérias você mais gostava na escola?",
            respostas: [
                { texto: "Matemática", pesos: { dev: 3, quimica: 2, logistica: 2, eletronica: 2, adm: 1 } },
                { texto: "Química/Ciências", pesos: { dev: 1, quimica: 3, logistica: 1, eletronica: 2, adm: 1 } },
                { texto: "Geografia/História", pesos: { dev: 1, quimica: 1, logistica: 3, eletronica: 1, adm: 2 } },
                { texto: "Física", pesos: { dev: 2, quimica: 2, logistica: 1, eletronica: 3, adm: 1 } },
                { texto: "Português/Redação", pesos: { dev: 1, quimica: 1, logistica: 2, eletronica: 1, adm: 3 } }
            ]
        },
        {
            id: 4,
            pergunta: "Como você descreveria sua personalidade?",
            respostas: [
                { texto: "Analítico e detalhista", pesos: { dev: 3, quimica: 2, logistica: 2, eletronica: 2, adm: 1 } },
                { texto: "Curioso e paciente", pesos: { dev: 1, quimica: 3, logistica: 1, eletronica: 2, adm: 1 } },
                { texto: "Organizado e prático", pesos: { dev: 1, quimica: 1, logistica: 3, eletronica: 1, adm: 2 } },
                { texto: "Habilidoso e técnico", pesos: { dev: 2, quimica: 2, logistica: 1, eletronica: 3, adm: 1 } },
                { texto: "Comunicativo e persuasivo", pesos: { dev: 1, quimica: 1, logistica: 2, eletronica: 1, adm: 3 } }
            ]
        },
        {
            id: 5,
            pergunta: "O que você gosta de fazer no tempo livre?",
            respostas: [
                { texto: "Programar ou jogar videogames", pesos: { dev: 3, quimica: 1, logistica: 1, eletronica: 2, adm: 1 } },
                { texto: "Fazer experimentos ou cozinhar", pesos: { dev: 1, quimica: 3, logistica: 1, eletronica: 1, adm: 1 } },
                { texto: "Organizar coisas ou planejar rotas", pesos: { dev: 1, quimica: 1, logistica: 3, eletronica: 1, adm: 2 } },
                { texto: "Consertar eletrônicos ou montar coisas", pesos: { dev: 2, quimica: 2, logistica: 1, eletronica: 3, adm: 1 } },
                { texto: "Liderar grupos ou fazer networking", pesos: { dev: 1, quimica: 1, logistica: 2, eletronica: 1, adm: 3 } }
            ]
        }
    ]
};

// Variáveis de Estado
let perguntaAtual = 0;
let respostasSelecionadas = [];

// Elementos DOM
const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const nextButton = document.getElementById('next-btn');
const prevButton = document.getElementById('prev-btn');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const quizContainer = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result-container');
const restartButton = document.getElementById('restart-btn');

function iniciarQuiz() {
    perguntaAtual = 0;
    respostasSelecionadas = [];
    quizContainer.style.display = 'block';
    resultContainer.style.display = 'none';
    mostrarPergunta();
}

function mostrarPergunta() {
    const pergunta = quizConfig.perguntas[perguntaAtual];
    const total = quizConfig.perguntas.length;
    
    // Atualiza progresso
    const progresso = ((perguntaAtual + 1) / total) * 100;
    progressBar.style.width = `${progresso}%`;
    progressText.textContent = `Pergunta ${perguntaAtual + 1} de ${total}`;
    
    // Define o texto da pergunta
    questionElement.textContent = pergunta.pergunta;
    answersElement.innerHTML = '';
    
    // Cria botões das alternativas
    pergunta.respostas.forEach((resposta, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = resposta.texto;
        
        if (respostasSelecionadas[perguntaAtual] === index) {
            button.classList.add('selected');
        }
        
        button.addEventListener('click', () => selecionarResposta(index));
        answersElement.appendChild(button);
    });
    
    // Controle dos botões
    prevButton.style.display = perguntaAtual > 0 ? 'inline-flex' : 'none';
    nextButton.innerHTML = perguntaAtual === total - 1 
        ? 'Ver Resultado <i class="fas fa-check"></i>' 
        : 'Próxima <i class="fas fa-arrow-right"></i>';
}

function selecionarResposta(index) {
    respostasSelecionadas[perguntaAtual] = index;
    
    // Atualiza classes visuais
    const botoes = answersElement.querySelectorAll('.answer-btn');
    botoes.forEach((btn, i) => {
        btn.classList.toggle('selected', i === index);
    });
}

function proximaPergunta() {
    if (respostasSelecionadas[perguntaAtual] === undefined) {
        alert('Por favor, selecione uma opção para continuar.');
        return;
    }
    
    if (perguntaAtual < quizConfig.perguntas.length - 1) {
        perguntaAtual++;
        mostrarPergunta();
    } else {
        mostrarResultado();
    }
}

function perguntaAnterior() {
    if (perguntaAtual > 0) {
        perguntaAtual--;
        mostrarPergunta();
    }
}

// Lógica de Cálculo de Pontuação Pura
function calcularPontuacaoTotal() {
    const totalPontos = { dev: 0, quimica: 0, logistica: 0, eletronica: 0, adm: 0 };
    
    respostasSelecionadas.forEach((respostaIndex, perguntaIndex) => {
        if (respostaIndex !== undefined) {
            const pesos = quizConfig.perguntas[perguntaIndex].respostas[respostaIndex].pesos;
            for (let curso in pesos) {
                totalPontos[curso] += pesos[curso];
            }
        }
    });
    
    return totalPontos;
}

function mostrarResultado() {
    const pontuacaoFinal = calcularPontuacaoTotal();
    
    // Ordenar resultados
    const cursosOrdenados = Object.keys(pontuacaoFinal)
        .map(chave => ({
            chave,
            ...quizConfig.cursos[chave],
            pontos: pontuacaoFinal[chave]
        }))
        .sort((a, b) => b.pontos - a.pontos);

    const vencedor = cursosOrdenados[0];

    // Ocultar Quiz e mostrar tela final
    quizContainer.style.display = 'none';
    resultContainer.style.display = 'block';

    // Renderizar Vencedor
    document.getElementById('resultado-principal').innerHTML = `
        <div class="curso-vencedor">
            <div class="vencedor-icon"><i class="${vencedor.icone}"></i></div>
            <h2>Sua Maior Afinitade É:</h2>
            <h1>${vencedor.nome}</h1>
            <p class="vencedor-descricao">${vencedor.descricao}</p>
            <button class="btn-primary-quiz" onclick="window.location.href='cursos.html#curso-${vencedor.idCurso}'">
                Conhecer o Curso em Detalhes
            </button>
        </div>
    `;

    // Renderizar Lista Completa de Afinidade
    const maxPontos = quizConfig.perguntas.length * 3;
    const rankingElement = document.getElementById('ranking-completo');
    rankingElement.innerHTML = '';

    cursosOrdenados.forEach((curso, index) => {
        const porcentagem = Math.round((curso.pontos / maxPontos) * 100);
        rankingElement.innerHTML += `
            <div class="ranking-item ${index === 0 ? 'destaque' : ''}">
                <div class="ranking-posicao">${index + 1}º</div>
                <div class="ranking-info">
                    <div class="ranking-nome">
                        <i class="${curso.icone}"></i>
                        <span>${curso.nome}</span>
                    </div>
                    <div class="ranking-bar">
                        <div class="ranking-fill" style="width: ${porcentagem}%"></div>
                    </div>
                </div>
                <div class="ranking-pontos">${porcentagem}%</div>
            </div>
        `;
    });
}

// Event Listeners
nextButton.addEventListener('click', proximaPergunta);
prevButton.addEventListener('click', perguntaAnterior);
restartButton.addEventListener('click', iniciarQuiz);

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', iniciarQuiz);