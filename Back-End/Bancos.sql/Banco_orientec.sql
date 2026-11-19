-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           12.3.3-MariaDB - MariaDB Server
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              12.20.0.7320
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para tcc
DROP DATABASE IF EXISTS `tcc`;
CREATE DATABASE IF NOT EXISTS `tcc` /*!40100 DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_bin */;
USE `tcc`;

-- Copiando estrutura para tabela tcc.cursos
DROP TABLE IF EXISTS `cursos`;
CREATE TABLE IF NOT EXISTS `cursos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `vagas` int(11) NOT NULL DEFAULT 0,
  `status` varchar(50) NOT NULL,
  `duracao` int(11) NOT NULL,
  `descricao` text NOT NULL DEFAULT '',
  `area` varchar(200) NOT NULL DEFAULT '',
  `carga_horaria` int(11) NOT NULL,
  `salario` varchar(50) NOT NULL DEFAULT '',
  `resumo` varchar(250) NOT NULL,
  `mercado` varchar(250) NOT NULL,
  `perfil` varchar(250) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Copiando dados para a tabela tcc.cursos: ~5 rows (aproximadamente)
DELETE FROM `cursos`;
INSERT INTO `cursos` (`id`, `nome`, `vagas`, `status`, `duracao`, `descricao`, `area`, `carga_horaria`, `salario`, `resumo`, `mercado`, `perfil`) VALUES
	(1, 'Desenvolvimento de Sistemas', 64, 'ativo', 4, 'Mergulhe no universo da programação e crie sites, aplicativos e softwares que transformam o dia a dia das pessoas. Você aprenderá lógica de programação, linguagens como JavaScript, Python, bancos de dados e metodologias ágeis. O curso estimula o raciocínio lógico e a resolução criativa de problemas, capacitando você a desenvolver sistemas completos, do front-end ao back-end. Prepare-se para o mercado de tecnologia, um dos que mais crescem no mundo.', 'Desenvolvedor Web, Mobile, Backend, Analista de Sistemas, Suporte Técnico.', 1200, 'R$ 2.500 a R$ 6.000', 'Crie sistemas web, mobile e desktop. Aprenda programação, banco de dados e desenvolvimento ágil.', 'Alta demanda em empresas de tecnologia, startups e setores digitais. Pode atuar como desenvolvedor web, mobile, backend ou analista de sistemas, com boas oportunidades de crescimento.', 'Pessoa com interesse em tecnologia, lógica e resolução de problemas. Gosta de aprender coisas novas, trabalhar com computadores e criar soluções digitais.'),
	(2, 'Química', 32, 'ativo', 4, 'Adentre no universo da química prática e industrial. Você aprenderá a realizar análises físico-químicas, operar equipamentos de laboratório, manipular reagentes com segurança e aplicar normas de biossegurança. O curso estimula o pensamento científico e a precisão técnica, capacitando você para atuar no controle de qualidade e na transformação de matérias-primas em diversos setores. Prepare-se para um mercado essencial e em constante evolução.', 'Analista de Controle de Qualidade, Laboratorista, Operador de Processos Industriais', 1200, 'R$ 2.500 a R$ 5.500', 'Realize análises laboratoriais, controle de qualidade e processos químicos.', 'Alta demanda nas indústrias farmacêuticas, de alimentos e bebidas, cosméticos, petroquímica e gestão ambiental. Pode atuar como analista de laboratório, técnico de processos ou no controle de qualidade, com boas oportunidades de crescimento.', 'Pessoa curiosa, analítica e atenta aos detalhes. Gosta de ciências da natureza, experimentos práticos, resolução de problemas e de entender como as substâncias e materiais se transformam.'),
	(3, 'Administração', 32, 'ativo', 4, 'Desenvolva uma visão estratégica de negócios e aprenda a gerenciar recursos, pessoas e processos com eficiência. O curso aborda finanças, marketing, recursos humanos, logística e empreendedorismo, sempre com foco na tomada de decisão. Por meio de estudos de caso e projetos práticos, você exercitará liderança, comunicação e planejamento. Ao final, estará pronto para atuar em empresas de qualquer porte ou abrir seu próprio negócio com confiança.', 'Assistente Administrativo, Supervisor, Empreendedor', 1200, 'R$ 2.000 a R$ 4.000', 'Gestão de empresas, finanças, marketing e recursos humanos. Torne-se um gestor de sucesso.', 'Amplo mercado em empresas de todos os setores. Pode atuar em áreas como financeiro, recursos humanos, marketing e gestão empresarial.', 'Pessoa comunicativa, organizada e com interesse em gestão e negócios. Gosta de liderar, tomar decisões e trabalhar com pessoas.'),
	(4, 'Logística', 32, 'ativo', 4, 'Descubra como os produtos chegam até você e torne-se um especialista em planejar, executar e controlar cadeias de suprimentos. Você aprenderá sobre gestão de estoques, modais de transporte, distribuição, compras e custos logísticos. O curso enfatiza a organização, a visão sistêmica e a resolução de problemas reais do mercado. Com essa formação, você estará apto a atuar em transportadoras, centros de distribuição, indústrias e comércio eletrônico.', 'Coordenador de Logística, Analista de Supply Chain, Transportes', 1200, 'R$ 2.200 a R$ 4.800', 'Gerencie cadeias de suprimentos, transportes e armazenagem. Otimize processos logísticos.', 'Alta demanda em centros de distribuição, transportadoras e indústrias. Atua no controle de estoque, transporte, cadeia de suprimentos e planejamento logístico.', 'Pessoa organizada, prática e que gosta de planejamento. Tem interesse em processos, transporte e organização de sistemas.'),
	(5, 'Eletroeletrônica', 32, 'ativo', 4, 'Prepare-se para atuar no mundo da tecnologia e da indústria aprendendo sobre instalações elétricas, eletrônica, automação e sistemas de controle. Durante o curso, você desenvolverá conhecimentos para montar, testar, instalar e realizar a manutenção de equipamentos, circuitos e painéis elétricos. A formação combina conhecimentos teóricos com atividades práticas, proporcionando experiência para solucionar problemas e trabalhar com segurança e eficiência. Ao concluir o curso, você estará preparado para buscar oportunidades em indústrias, empresas de manutenção, automação e instalações elétricas, acompanhando as novas tecnologias e as demandas do mercado.', 'Técnico em Eletrônica, Automação, Manutenção Industrial', 1200, 'R$ 2.500 a R$ 5.500', 'Projete e mantenha circuitos elétricos, sistemas eletrônicos e automação industrial.', 'Atuação em indústrias, manutenção industrial e automação. Pode trabalhar com instalação, manutenção de equipamentos e sistemas elétricos.', 'Pessoa prática, técnica e interessada em eletricidade e equipamentos. Gosta de montar, consertar e entender sistemas eletrônicos.');

-- Copiando estrutura para tabela tcc.cursos_tags
DROP TABLE IF EXISTS `cursos_tags`;
CREATE TABLE IF NOT EXISTS `cursos_tags` (
  `curso_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  `peso` tinyint(4) NOT NULL DEFAULT 1,
  PRIMARY KEY (`curso_id`,`tag_id`),
  KEY `tag_id` (`tag_id`),
  CONSTRAINT `FK_cursos_tags_curso` FOREIGN KEY (`curso_id`) REFERENCES `cursos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_cursos_tags_tag` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Copiando dados para a tabela tcc.cursos_tags: ~40 rows (aproximadamente)
DELETE FROM `cursos_tags`;
INSERT INTO `cursos_tags` (`curso_id`, `tag_id`, `peso`) VALUES
	(1, 1, 3),
	(1, 2, 3),
	(1, 3, 2),
	(1, 4, 1),
	(1, 5, 0),
	(1, 6, 2),
	(1, 7, 2),
	(1, 8, 3),
	(2, 1, 3),
	(2, 2, 2),
	(2, 3, 1),
	(2, 4, 1),
	(2, 5, 0),
	(2, 6, 2),
	(2, 7, 3),
	(2, 8, 2),
	(3, 1, 2),
	(3, 2, 2),
	(3, 3, 1),
	(3, 4, 3),
	(3, 5, 3),
	(3, 6, 3),
	(3, 7, 1),
	(3, 8, 2),
	(4, 1, 2),
	(4, 2, 3),
	(4, 3, 1),
	(4, 4, 1),
	(4, 5, 1),
	(4, 6, 3),
	(4, 7, 2),
	(4, 8, 2),
	(5, 1, 3),
	(5, 2, 3),
	(5, 3, 2),
	(5, 4, 0),
	(5, 5, 0),
	(5, 6, 2),
	(5, 7, 3),
	(5, 8, 2);

-- Copiando estrutura para tabela tcc.perguntas
DROP TABLE IF EXISTS `perguntas`;
CREATE TABLE IF NOT EXISTS `perguntas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `texto` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Copiando dados para a tabela tcc.perguntas: ~15 rows (aproximadamente)
DELETE FROM `perguntas`;
INSERT INTO `perguntas` (`id`, `texto`) VALUES
	(1, 'Quando algo não funciona como deveria, qual caminho você tende a seguir primeiro?'),
	(2, 'Pensando em uma rotina que dificilmente ficaria entediante para você, qual cenário parece mais interessante?'),
	(3, 'Qual tipo de desafio escolar provavelmente faria você perder a noção do tempo?'),
	(4, 'Quando você recebe uma tarefa nova e ninguém explica exatamente como fazê-la, qual comportamento mais combina com você?'),
	(5, 'Você tem algumas horas livres e começa algo apenas por curiosidade. Qual situação provavelmente despertaria mais seu interesse?'),
	(6, 'Quando você precisa aprender algo completamente novo, qual abordagem costuma funcionar melhor para você?'),
	(7, 'Se uma atividade precisa ser realizada várias vezes durante o dia, o que mais chamaria sua atenção?'),
	(8, 'Imagine que você recebeu informações de várias fontes e precisa chegar a uma conclusão. Como você agiria?'),
	(9, 'Em uma situação em que várias coisas precisam acontecer ao mesmo tempo, qual aspecto você observaria primeiro?'),
	(10, 'Quando você percebe que algo poderia funcionar melhor, qual seria sua tendência?'),
	(11, 'Ao trabalhar em um projeto em grupo, qual papel você costuma assumir naturalmente?'),
	(12, 'Se você pudesse escolher uma tarefa para realizar sozinho, qual escolheria?'),
	(13, 'Como você reage quando um plano que você montou não dá certo?'),
	(14, 'Qual característica você mais valoriza em um ambiente de trabalho?'),
	(15, 'Quando você precisa tomar uma decisão importante, o que pesa mais na sua escolha?');

-- Copiando estrutura para tabela tcc.respostas
DROP TABLE IF EXISTS `respostas`;
CREATE TABLE IF NOT EXISTS `respostas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pergunta_id` int(11) NOT NULL,
  `texto` text NOT NULL,
  `pesos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`pesos`)),
  PRIMARY KEY (`id`),
  KEY `pergunta_id` (`pergunta_id`),
  CONSTRAINT `FK_respostas_perguntas` FOREIGN KEY (`pergunta_id`) REFERENCES `perguntas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Copiando dados para a tabela tcc.respostas: ~75 rows (aproximadamente)
DELETE FROM `respostas`;
INSERT INTO `respostas` (`id`, `pergunta_id`, `texto`, `pesos`) VALUES
	(1, 1, 'Tentar entender o que mudou até encontrar a causa', '{"raciocinio_logico":3,"resolucao_problemas":2,"precisao":1}'),
	(2, 1, 'Observar o que aconteceu e testar possibilidades diferentes', '{"resolucao_problemas":3,"adaptabilidade":2,"criatividade":1}'),
	(3, 1, 'Reunir as pessoas envolvidas e tentar chegar a um acordo', '{"comunicacao":3,"lideranca":2,"organizacao":1}'),
	(4, 1, 'Verificar cada etapa até descobrir onde está o problema', '{"organizacao":3,"precisao":2,"raciocinio_logico":1}'),
	(5, 1, 'Abrir, observar e tentar entender como as partes trabalham juntas', '{"precisao":3,"raciocinio_logico":2,"adaptabilidade":1}'),
	(6, 2, 'Um lugar onde diferentes situações precisam ser analisadas antes de tomar decisões', '{"raciocinio_logico":3,"precisao":2,"organizacao":1}'),
	(7, 2, 'Um ambiente movimentado, onde várias coisas precisam acontecer na ordem certa', '{"organizacao":3,"adaptabilidade":2,"precisao":1}'),
	(8, 2, 'Um espaço em que ideias são discutidas e decisões são tomadas em conjunto', '{"comunicacao":3,"lideranca":2,"criatividade":1}'),
	(9, 2, 'Um local em que você possa observar, modificar e testar diferentes possibilidades', '{"criatividade":3,"adaptabilidade":2,"resolucao_problemas":1}'),
	(10, 2, 'Um ambiente tranquilo para se concentrar em desafios que exigem raciocínio', '{"precisao":3,"raciocinio_logico":2,"resolucao_problemas":1}'),
	(11, 3, 'Encontrar uma explicação para algo que inicialmente parece não fazer sentido', '{"raciocinio_logico":3,"resolucao_problemas":2,"precisao":1}'),
	(12, 3, 'Descobrir uma sequência ou estratégia para chegar a uma resposta', '{"resolucao_problemas":3,"raciocinio_logico":2,"organizacao":1}'),
	(13, 3, 'Analisar acontecimentos e entender como eles se relacionam', '{"precisao":3,"raciocinio_logico":2,"organizacao":1}'),
	(14, 3, 'Defender uma ideia de forma que outras pessoas entendam seu ponto de vista', '{"comunicacao":3,"lideranca":2,"criatividade":1}'),
	(15, 3, 'Entender por que determinado fenômeno acontece na prática', '{"precisao":3,"adaptabilidade":2,"raciocinio_logico":1}'),
	(16, 4, 'Faço perguntas, comparo informações e tento entender o contexto', '{"comunicacao":3,"raciocinio_logico":2,"organizacao":1}'),
	(17, 4, 'Vou testando possibilidades até descobrir o que funciona', '{"resolucao_problemas":3,"adaptabilidade":2,"criatividade":1}'),
	(18, 4, 'Organizo as etapas antes de começar para evitar retrabalho', '{"organizacao":3,"precisao":2,"lideranca":1}'),
	(19, 4, 'Tento descobrir como as diferentes partes da tarefa se conectam', '{"raciocinio_logico":3,"precisao":2,"adaptabilidade":1}'),
	(20, 4, 'Analiso as informações disponíveis e procuro uma maneira mais eficiente de fazer', '{"resolucao_problemas":3,"raciocinio_logico":2,"precisao":1}'),
	(21, 5, 'Tentar descobrir uma maneira melhor de organizar alguma coisa do cotidiano', '{"organizacao":3,"criatividade":2,"precisao":1}'),
	(22, 5, 'Explorar uma ideia até conseguir entender como ela funciona', '{"raciocinio_logico":3,"precisao":2,"adaptabilidade":1}'),
	(23, 5, 'Encontrar uma solução para um desafio usando diferentes estratégias', '{"resolucao_problemas":3,"criatividade":2,"adaptabilidade":1}'),
	(24, 5, 'Tentar descobrir por que algo apresenta determinado comportamento', '{"precisao":3,"raciocinio_logico":2,"resolucao_problemas":1}'),
	(25, 5, 'Conversar com pessoas, trocar ideias e tentar aproximar opiniões diferentes', '{"comunicacao":3,"lideranca":2,"criatividade":1}'),
	(26, 6, 'Testar diferentes formas de aprender até encontrar aquela que facilita a compreensão', '{"adaptabilidade":3,"criatividade":2,"resolucao_problemas":1}'),
	(27, 6, 'Relacionar o conteúdo novo com situações e exemplos que já conheço', '{"raciocinio_logico":3,"adaptabilidade":2,"comunicacao":1}'),
	(28, 6, 'Organizar o assunto em etapas para entender como cada parte funciona', '{"organizacao":3,"precisao":2,"raciocinio_logico":1}'),
	(29, 6, 'Conversar sobre o assunto e comparar diferentes formas de interpretar o conteúdo', '{"comunicacao":3,"lideranca":2,"adaptabilidade":1}'),
	(30, 6, 'Praticar o conteúdo em uma situação concreta para perceber como ele funciona', '{"precisao":3,"resolucao_problemas":2,"adaptabilidade":1}'),
	(31, 7, 'Perceber detalhes que mudam conforme a atividade vai sendo realizada', '{"precisao":3,"raciocinio_logico":2,"organizacao":1}'),
	(32, 7, 'Acompanhar os resultados e pensar no que poderia tornar a execução mais eficiente', '{"resolucao_problemas":3,"organizacao":2,"criatividade":1}'),
	(33, 7, 'Observar se as pessoas estão conseguindo manter um bom ritmo durante a atividade', '{"lideranca":3,"comunicacao":2,"organizacao":1}'),
	(34, 7, 'Investigar se existe algum padrão ou comportamento que explique o que está acontecendo', '{"raciocinio_logico":3,"precisao":2,"resolucao_problemas":1}'),
	(35, 7, 'Identificar quais ferramentas ou recursos podem facilitar a realização da atividade', '{"organizacao":3,"criatividade":2,"adaptabilidade":1}'),
	(36, 8, 'Compararia as informações e procuraria evidências antes de tomar uma decisão', '{"precisao":3,"raciocinio_logico":2,"resolucao_problemas":1}'),
	(37, 8, 'Tentaria organizar as informações para descobrir como elas se relacionam', '{"organizacao":3,"raciocinio_logico":2,"precisao":1}'),
	(38, 8, 'Conversaria com quem possui mais conhecimento sobre o assunto para avaliar as possibilidades', '{"comunicacao":3,"lideranca":2,"adaptabilidade":1}'),
	(39, 8, 'Analisaria a situação passo a passo até encontrar uma explicação que faça sentido', '{"raciocinio_logico":3,"resolucao_problemas":2,"precisao":1}'),
	(40, 8, 'Observaria os recursos disponíveis e pensaria na maneira mais prática de resolver', '{"adaptabilidade":3,"organizacao":2,"resolucao_problemas":1}'),
	(41, 9, 'Qual informação pode indicar que alguma etapa precisa ser ajustada', '{"organizacao":3,"precisao":2,"resolucao_problemas":1}'),
	(42, 9, 'Como os diferentes elementos envolvidos podem estar influenciando uns aos outros', '{"raciocinio_logico":3,"precisao":2,"adaptabilidade":1}'),
	(43, 9, 'O comportamento das pessoas e a forma como elas estão lidando com a situação', '{"lideranca":3,"comunicacao":2,"adaptabilidade":1}'),
	(44, 9, 'Quais dados ou características podem ajudar a explicar o que está acontecendo', '{"precisao":3,"raciocinio_logico":2,"organizacao":1}'),
	(45, 9, 'Qual parte do problema pode ser analisada ou modificada para encontrar uma solução', '{"resolucao_problemas":3,"criatividade":2,"raciocinio_logico":1}'),
	(46, 10, 'Tentaria descobrir a causa do problema antes de decidir qual mudança fazer', '{"raciocinio_logico":3,"precisao":2,"resolucao_problemas":1}'),
	(47, 10, 'Organizaria as informações disponíveis para definir uma sequência de ações', '{"organizacao":3,"precisao":2,"lideranca":1}'),
	(48, 10, 'Conversaria com outras pessoas para conhecer diferentes possibilidades de melhoria', '{"comunicacao":3,"lideranca":2,"criatividade":1}'),
	(49, 10, 'Faria testes e compararia os resultados para descobrir qual alternativa funciona melhor', '{"resolucao_problemas":3,"adaptabilidade":2,"precisao":1}'),
	(50, 10, 'Analisaria o funcionamento do problema e procuraria uma solução prática', '{"precisao":3,"resolucao_problemas":2,"adaptabilidade":1}'),
	(51, 11, 'O de quem organiza as etapas e distribui as tarefas', '{"lideranca":3,"organizacao":2,"comunicacao":1}'),
	(52, 11, 'O de quem propõe ideias novas e alternativas criativas', '{"criatividade":3,"adaptabilidade":2,"comunicacao":1}'),
	(53, 11, 'O de quem revisa o trabalho procurando erros e detalhes', '{"precisao":3,"raciocinio_logico":2,"organizacao":1}'),
	(54, 11, 'O de quem resolve os problemas técnicos que aparecem no caminho', '{"resolucao_problemas":3,"raciocinio_logico":2,"adaptabilidade":1}'),
	(55, 11, 'O de quem integra as pessoas e mantém o grupo alinhado', '{"comunicacao":3,"lideranca":2,"adaptabilidade":1}'),
	(56, 12, 'Montar um equipamento seguindo um manual técnico detalhado', '{"precisao":3,"organizacao":2,"raciocinio_logico":1}'),
	(57, 12, 'Escrever um pequeno programa ou script para automatizar algo', '{"raciocinio_logico":3,"resolucao_problemas":2,"adaptabilidade":1}'),
	(58, 12, 'Planejar uma viagem ou evento com várias etapas e recursos', '{"organizacao":3,"criatividade":2,"lideranca":1}'),
	(59, 12, 'Criar uma apresentação ou material para convencer alguém de uma ideia', '{"comunicacao":3,"criatividade":2,"lideranca":1}'),
	(60, 12, 'Investigar um fenômeno ou problema que ninguém ainda explicou', '{"resolucao_problemas":3,"raciocinio_logico":2,"precisao":1}'),
	(61, 13, 'Analiso friamente o que falhou e refaço o plano com ajustes pontuais', '{"raciocinio_logico":3,"organizacao":2,"precisao":1}'),
	(62, 13, 'Busco caminhos alternativos e tento uma abordagem diferente', '{"adaptabilidade":3,"criatividade":2,"resolucao_problemas":1}'),
	(63, 13, 'Reúno as pessoas envolvidas para discutir o que pode ser melhorado', '{"comunicacao":3,"lideranca":2,"organizacao":1}'),
	(64, 13, 'Testo cada etapa separadamente para isolar o ponto que causou o problema', '{"precisao":3,"resolucao_problemas":2,"raciocinio_logico":1}'),
	(65, 13, 'Aceito o resultado, aprendo com ele e sigo em frente rapidamente', '{"adaptabilidade":3,"lideranca":2,"comunicacao":1}'),
	(66, 14, 'Clareza nas regras e processos bem definidos', '{"organizacao":3,"precisao":2,"lideranca":1}'),
	(67, 14, 'Liberdade para propor ideias e experimentar soluções', '{"criatividade":3,"adaptabilidade":2,"comunicacao":1}'),
	(68, 14, 'Oportunidade de liderar e influenciar decisões', '{"lideranca":3,"comunicacao":2,"organizacao":1}'),
	(69, 14, 'Desafios técnicos que exijam raciocínio e precisão', '{"raciocinio_logico":3,"precisao":2,"resolucao_problemas":1}'),
	(70, 14, 'Contato constante com pessoas e troca de conhecimentos', '{"comunicacao":3,"adaptabilidade":2,"lideranca":1}'),
	(71, 15, 'As informações concretas e os dados disponíveis', '{"precisao":3,"raciocinio_logico":2,"organizacao":1}'),
	(72, 15, 'As possibilidades e o que pode dar certo no futuro', '{"criatividade":3,"adaptabilidade":2,"lideranca":1}'),
	(73, 15, 'O impacto da decisão nas pessoas envolvidas', '{"comunicacao":3,"lideranca":2,"adaptabilidade":1}'),
	(74, 15, 'O que faz mais sentido do ponto de vista lógico', '{"raciocinio_logico":3,"resolucao_problemas":2,"precisao":1}'),
	(75, 15, 'A praticidade e a rapidez com que a decisão pode ser executada', '{"resolucao_problemas":3,"organizacao":2,"adaptabilidade":1}');

-- Copiando estrutura para tabela tcc.tags
DROP TABLE IF EXISTS `tags`;
CREATE TABLE IF NOT EXISTS `tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chave` varchar(30) NOT NULL,
  `nome` varchar(80) NOT NULL,
  `descricao` text DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `chave` (`chave`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Copiando dados para a tabela tcc.tags: ~8 rows (aproximadamente)
DELETE FROM `tags`;
INSERT INTO `tags` (`id`, `chave`, `nome`, `descricao`, `ativo`) VALUES
	(1, 'raciocinio_logico', 'Raciocínio Lógico e Analítico', 'Capacidade de interpretar dados, identificar padrões, seguir sequências lógicas e resolver problemas de forma estruturada.', 1),
	(2, 'resolucao_problemas', 'Resolução de Problemas', 'Habilidade de diagnosticar situações, levantar hipóteses, testar possibilidades e propor soluções eficazes.', 1),
	(3, 'criatividade', 'Criatividade e Inovação', 'Capacidade de gerar ideias novas, pensar fora da caixa, adaptar soluções e propor melhorias em processos ou produtos.', 1),
	(4, 'comunicacao', 'Comunicação e Expressão', 'Habilidade de se expressar com clareza, ouvir ativamente, transmitir informações e interagir com diferentes públicos.', 1),
	(5, 'lideranca', 'Liderança e Trabalho em Equipe', 'Capacidade de coordenar pessoas, colaborar em grupo, motivar a equipe e alcançar objetivos coletivos.', 1),
	(6, 'organizacao', 'Organização e Planejamento', 'Habilidade de estruturar tarefas, gerir tempo e recursos, seguir etapas e manter o foco em metas e prazos.', 1),
	(7, 'precisao', 'Precisão e Atenção aos Detalhes', 'Cuidado com detalhes, foco na qualidade, execução minuciosa e consistência em tarefas que exigem exatidão.', 1),
	(8, 'adaptabilidade', 'Aprendizado Contínuo e Adaptabilidade', 'Disposição para aprender coisas novas, lidar com mudanças, adaptar-se a novos contextos e buscar desenvolvimento constante.', 1);

-- Copiando estrutura para tabela tcc.usuarios
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(200) NOT NULL,
  `cpf` varchar(11) NOT NULL DEFAULT '',
  `email` varchar(200) NOT NULL,
  `senha` varchar(256) NOT NULL,
  `nivel` varchar(50) NOT NULL DEFAULT '',
  `data` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `foto` longtext DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cpf` (`cpf`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Copiando dados para a tabela tcc.usuarios: ~24 rows (aproximadamente)
DELETE FROM `usuarios`;
INSERT INTO `usuarios` (`id`, `nome`, `cpf`, `email`, `senha`, `nivel`, `data`, `foto`) VALUES
	(15, 'João Victor Piacenza de Oliveira Andrade', '12648976000', 'joaoandrade@gmail.com', '$2b$10$ty5H/Da9hN83hq75cnxdnuh1ru5LKuhIf.Ds1BzROEioE2jdN5R.K', 'admin', '2026-09-29 19:05:19', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCADmASwDASIAAhEBAxEB/8QAGwABAAMBAQEBAAAAAAAAAAAAAAEDBAIHBQb/xABBEAABBAECAgUJBgQFBQEBAAABAAIDEQQSIQUxExRBUaEXIlRhY3GRotEGFTIzgbFCU2LBIyRScvAHksLh8UOC/8QAGgEBAQEBAAMAAAAAAAAAAAAAAAECAwQFBv/EACERAQADAAICAwADAAAAAAAAAAABAhEDEiExBBNBMlHw/9oADAMBAAIRAxEAPwD1OTXh40UeFiCRrCG9G3YNYO5dzzPikaGQukafxEdncvNfKjxT0LF+b6p5UeKehYvzfVXfCPReuyWf8pNVX+E/BScqUteRA8aa5sO/O6+A+K858qPFPQsX5vqnlR4p6Fi/N9VFei9ceQ0DGlDjzthoLp2U8MY8Y8hBu26Ta848qPFPQsX5vqnlR4p6Fi/N9UHoozXW1rsaVpc6vwlQcudsjg7GfpaSLAJvuped+VHinoOL831Tyo8U9Cxfm+qD0ZuW9zgBjSi3AW5p7+a1Ly/yo8U9Cxfm+qeVHinoWL831QeoIvL/ACo8U9Cxfm+qeVHinoWL831QeoIvL/KjxT0LF+b6p5UeKehYvzfVB6gi8v8AKjxT0LF+b6p5UeKehYvzfVB6gi8v8qPFPQsX5vqnlR4p6Fi/N9UHqCLy/wAqPFPQsX5vqnlR4p6Fi/N9UHqCLy/yo8U9Cxfm+qeVHinoWL831QeoIvL/ACo8U9Cxfm+qeVHinoWL831QeoIvL/KjxT0LF+b6p5UeKehYvzfVB6gi8v8AKjxT0LF+b6p5UeKehYvzfVB6gi8v8qPFPQsX5vqnlR4p6Fi/N9UHqCLy/wAqPFPQsX5vqnlR4p6Fi/N9UHpzS4k22v1XS8v8qPFPQsX5vqnlR4p6Fi/N9UHpIkl6xorzLr8s8q56uXNXry/yo8U9Cxfm+qeVHinoWL831Qelyvka9oYzUDzNcvqrV5f5UeKehYvzfVPKjxT0LF+b6oPxK/Z8A/6bZ/FsRmXmT9RjefNY6Ml5b31YpfG+x/D4uJfanBx5pAxnSa/92nztP60vV/tJxqPFw8vBYZGZT4gIjVatRrY+pb4+O3JbrVm1orGy/HZn/TFs+M7L4JxMZERaTHHI3dxHMahtzHcvwc+PNizvgyInxSsNOY8UQfcvWPs/xSfhHFJ+C5scNPmBidANMbAWjYCz2jv5kr5H/UbhGPL9peGTGUtOaRDIxvOgQNQ/Q1+iXr1t1/3lKXi0eHnSL6g4ZBkwDJxpHQwt19KZzq0adO+w3suA5KT9nsrQ97JI5GtY54c0nzgADtt2tcD7lht8pF9YcAeB52VEXecejF2Q12lxBqv/AIuJeDOa6QMnZqBeWRkHU5jXFpOwrsO3qQfMRfVn4DJjuDpcmNkOjX0pY4fxaaoi+fqVk3AWNdkFuS1kWMX6pH2baHMaKAF83hB8ZF9OXgUsBmZLkRNliEh6Pc6gwkEg1XYaVcGLiMwI8rLMzunldGwQkebpDbJsb/iG2yDAi+rFwCWYtazIiEha2R0brBYxxAa47V2t2G+4UxcAdkSQxwZsMjpizTs4UHO0gmx3oPkovpfc1RifrsHVi2+mp1Xq06aq77fcujwDIsxiaI5FuAhF2afoO9VzQfLRfXm+z0mOS6XKibEAbeWu5hwBFVf8Q3XJ4HvDGMpnTSSSsc3SaGgXt333IPlIrMiE4+RJCXaixxF0Rf6EAqtAREQEREBERAREQEREBERAREQEREBERBt4LxN/BuMY3EWRtkMD9Wh3IiqP7r2OXGxftWMDLZKx+E1pe9rXWS41TTXLtv3Lw9a+H8Vz+EzOlwMqTHe4aXFh5hbpe1J7V9s2rFoyXsrPs1h8L4nj8QwQIWMLunD3kggj8Vk7UvO/tv8Aaf70+0UcmFoDOHuIhlFO1mwdXcRYXxM/7QcX4njjHzeITTxA6tDnbWvnK35LXybTpWla+m48ZzTM2TXENLS0RtgYI6PO2AaT8OxI+N8SikMjMotcZRN+EVqAoGqqq2rl8FhRc2mlnEsuPTpmI0Nc0eaDs42fFWN4xnsYWtmAJcXaxG3WCTqNOqwL3q6WJEH0H8cz3yB7nwmmlujq8eiibPm6a578lVLxXNmZM2SexPfSDSBqtzXHs72N+CyIg+qOPznFyI5W9JLPr1SHTtq515tj3AgepZMTieVhRujgezSTqp8TX6T3jUDR9YWVEG1vGc9kTI2zgBlU7Q3UQDYBdVkA9hNKcDi+Tg5mPODrbA5h0UBYa7UBdd6wog3/AH3n9KH64qDNGjoGaKu/w1V3vdWqTxLML9fTu1kEaqF7u1Hf37rMiDXkcUy8nV0j2DUKcGRNYDvdmgN7HNSOK5gcHF7HkPc/z4mO3cKPMcj3cljRBZkZEuXkPnnfrkebcaA8ByVaIgIiICIiAiIgIiICIiAiIgIiICIiAiIgx9f9n4p1/wBn4rGiqNnX/Z+Kdf8AZ+Kxog2df9n4p1/2fisaINnX/Z+Kdf8AZ+Kxog2df9n4p1/2fisSWg29f9n4p1/2fisVpaDb1/2finX/AGfisVpaDb1/2finX/Z+Kw2loN3X/Z+Kdf8AZ+Kw2loN3X/Z+Kdf9n4rDaWg3df9n4p1/wBn4rDaWg3df9n4p1/2fisNpaDd1/2finX/AGfisVpaDb1/2finX/Z+KxWloNvX/Z+Kdf8AZ+KxWpQbOv8As/FOv+z8VjRBs6/7PxTr/s/FY0QbOv8As/FOv+z8VjRBs6/7PxTr/s/FY0QERFR9KTh2IT/h5rGbPP8AiPaeQFcu/dcnAxNwM5nOgSRvu7w2HxXQ4TDJktgizY3GSUxsO1fiABO/bZP6Kr7tAMZ6xG8OskMdZaBudvdugs+7ImZHRTZTGDSDZI7b9fqHr3UN4djlgc7iELbcG6SQSNxZ2PZY8e5JMCIY8spyml7KAYXCybo/t8KSXhBhJDsuA1Z2dzru9/Z3oJbw3FeIq4hE3UDqLiPN3P8Abf8A4FTlYccOgRZEcxI84h7aHir28GBjLjm47d6BL6BoAmj+o8VnZg64i85ELSGk6S7fY8kGMrvlsAPgtruFNsgZkDhqLdQdtYF9veOXuWWQGDIcA5rix2zhuDSg4sjsHwCkte0AmOg4WLbzHeup8iXJk6SVwc6qugP2WocYygxjKiqNpY3zANiKr1/qiRueWQskDg0x0TW2lS2KV5DWxEkiwAzmFrPGcovDyI/N00KPYKHb3BV/eU/SxyENuNmgDeiPWL8OSqs2l+rT0fnd2ndSI5DJ0Yj8+606d1rHF8gfwR330b533964l4lPLIx7g0OY5zgW23c8+RQZix7SQY608/N5KDY5tH/at8nGsmRrWmOANbY0tjDQb53XuVGZnPzNOpjWhoHL3UgzX6m/AJfqb8AiIF+pvwCX6m/AIiBfqb8Al+pvwCIgm/U34BNXqHwChEE6vUPgFIDncmA+5q5WjDzJMKR0kQaXOGnzt9u3/wC9nMb0UGd3I2KINcqUBS82Caq3fVQEEoiICIiAiIgIiICIoPJB0J8dpBBkBHIgp02L/WuIMeKSNpkeY7fWpxoV6lDoIeic5swLg0EC+0nl8FNdPrnNWdNi/wBa6fkwSO1PfK53K3GyqGRQCMOfIS4tds0jYjkkkcJbUZ8621qeO0b/AAKanSc1e7JheGtc+VwYKaCboepc9Njf1rhkOO5gGs6y0HmKB1AV8FBihZk052uIDscAeV1/ZNX65dGXG/rXbWmSQNjBJcaaO9VMgx3AOdIQ0aAdx281ox5m42XHMwEtjcHAHtCmnTM30+jP9m8+DE6y4NIonSOe3P3r5PMr9fk/ajCPDmtic90rQSI3N2BNer+6/Ic1jjm0/wAnkfK4+Gkx9U6umwsiAgPj58i0hw7+xc9Xl6IS6DocSAfdV7fqvqti4ziyExSttrR5wc0bUB21y2BK5dicVgkmj1x7GQOIc03z1V29niO9dXhvmSY08Tyx8Tw5poilBglBA6NxvlQtfZEnF2zzE5cTZYmtvZp1arIAIFcyUiPGMbIjdJoe0U8DUxwOkbcr7D4oPlR4WRLGJGRjSb3LgPV2+vZcyYs8Lg2SJzXHcAjdfRGJxXGgDB0OkguLbY4003v8fD1LLPnZrcl/TSh0rQWOJDXbXdfEIM3Qyn/8n/8AaVHRS/y3/wDaVrj4xmsnbL0oJDiSNIANkE9nbS5dxTMcK6UAUBswDYGwOXegztglcQGxPJPKmlQI3kWGOI7wFqfxfPkc0vyC4t2FtH0XMPE8zHhbDFNpY02BpGx+CDP0Ul1odfdSkQSmj0bgCQ0EihZ9avk4pmSydI+a3VV6QNrB7u8BQ/iOU8tLpBbXiQeaPxDt5etBSIJiaETyQCfwnkBZ8FJxphH0hidpJq67f+EK88VzSHAzWHXdsbvdg9nrKs+/OJed/mSNQ0mmt3G3q/pHwQYnxPj062FuoWLHNcq3IypspwdM4OIvk0DmbPL1qpALmNZcl1Y5IJsb+tVZH5X/APQ/uqAg29Njf1p02L/WsSINvTYv9adNi/1rEiDb02L/AFoZccima9XZaxLqP8we9BqREQFB5KVB5IJhxceaBjnZLY3udRDnDbuK4GPj1ZyeWmxpHad637FmWpuKx4BbKBQbqsdpKz6/XauWjxVLcSJ483IF046aBOxoDn+qqijjdkMZI/Sw0XOsbCrKubiHoxJHOKc111tsDXf2qieJsbyI3F7AB5xFcxaQtq5ET1dSwxscwMmD7NOPYOXr5b+BXbsbHa6jlfqGg7V7+fqWVFclz7V/pbLDEyPUJw52kENA7Tdjn2UrRZaAOeyyFbYnmIse0NJaQRqaCPgUZmYn1Drq+QQT0bqF35p2rn8EEU4kDQ066sANN99qx+ZkyMDHTOLRYA9/NSc/KdP05mcZbvV28q/YqoCTPgdbZpWFgDvNcfNBIN89t6/VdGTiPTy4/TTOkc6pGBxJcQSN99+Z+KhvEMtocBMfOFHYbi7/AHT7wy+nM/THpHEkuoWbFH4oOhlcUb0swyckdI0NleHO84VsHG9xXeuRPxAQ0MmXo5Bu0PNEN23F9i6dxLLfD0Lpbb5v8IvbkLq6XLM/KjaGtlOkNc0CgdibIQaJBxx8bnySZbg57o3anOJLqBIIvnQHw9SxnFy3P3ieXE1uw2Tz/wDa0v4zxB8hkOSQ4vL/ADWhtEiiRQ2/RVt4jlteHiayO9oPbfagodBO2g5pBIJA070p6rk6dXRPrbfQe00PFX/eWZ0plExDiSbAG1ijsuOvZRjMZmdoIAI9Q5KDiLFyJnyMYy3RtLniqIANFcyQTxC5GFm5HnNo2Oa6iyZoS8xyFhkFOI7RzUyZU8zS2SUuBIJB9SDgY+Q5upsbi3TqsMNVvv4H4FTHjTSAFumjysgf3Vo4hliJsQmdoa0tAobA3t4n4qIc3Jx2hsUzmtBsAd9UqK+rTljnho0tAJPcDy/ZQ2Cd7A9rdQPcL7vqFY/Lnkj6N8hLKa2vU26/co3NyWRNibKQxoIAHZfNBDsLMbGZHY8gYKtxjNCxY3926rkilidpkGl3cRutX3tn7/5l+/Pl3V+yzzZEs9GV5eRdE+vdQcGOOSJwfJoII08tzaqfDC2tM+okXVDlXv5/83TI/JH+4f3WcI3ExmY048EMsL3PmDHtIoEjcE0VzPFFG1vRyl7rcHbCtjtW6pRDtGZjRNBCyMvjn1G6DSBdUN+fr8F30OK2EPc8ucWXTZADq27K9fh+iyImL3jfENOTHisDuhc4uDyBbw4Fv6D/AJaoj/MHvXK6j/MHvSGbTs7jUiIqyKDyUqDyQZEWyLhxmx2yieJpcfwvNUN9/D9LCn7ryNGq2nZhoWT5xobV3oMSLY7h0kZIfLG1wa92myT5pIPZ6j8EyeGT4rHvkdGQx2k6TzIq/hYQY0WuHCZOxxZkN1NYHFuk7EuDa8QrPumUOp8sbG/6zqI/DqHIdo/VQfOK+hjRCeWOIyNjDiBrfyHvVRwXNa10jwzUGuHmnkSRfgtGPjCbKZjPlZEC7SXvIDR6zao0ScLe0v05GO5rdZB6UecGmuXrvZdfc82tzesYlNJGrpxR80n39le8qt2LiNbYz2ONONCN3ZyHLt3V7eHYMuT0cXFYg1ztLS9rm7VdkkAAXsoKcnhk2IwPlfEA6PpGU69YsDbbfcn4FWY/CHZGJHO3KxmF7qLJJWtIBNA877+zuWc4+OJ4mDLYWPI1v0n/AA++9t/0ta3YXCusDTxQdCXNNGN2oNN2L08xQ7O1UY8fEfkXpkiZTg063gczXwVh4c9rdRnx+TjXSD+E0f8A13qTiYYcB94xnZu/Rurfn2dm6rngx44mGLKbK8vcHANcAB2HcdqA/CezM6qZYS6vxCQaeV1fL1Lv7ufV9Yx6q76Ts/8Au3/rdaJ8DhQe/oeLtLQ4hmqJ5sVsSaHb6lU7EwQGEcRjPm28Bj7Js7Dze7T8SoH3TN5t5GKCb26YbU2//XvCrOA4QPlM0PmsDw0PBJs1Xv7V0zExCSHcRjbuQD0biORrs7dgqY44DkxMkmqJxb0j6I0jt70F0HDnTwGXrEDPMLg10gBNOAquznak8Kma11ywag5rQBMw3YJ7+zYe8rmTHwhrMeZf4tALSOR2vbtC4x8fHlhc+XMZC4GgwscSdib2Fc6H6qiYOHzZDJ3sLNEBAe4uob3W/wCiuZwbIkmfHHLA8xk2WyWKAsn3V2qmKHFMsrZMgaWHzHbjWN+Wx9XNXOxeHh5rOaWhxG2qyA0EH8HabHw96gr+7ZdOrpsfcNIHTC/OND/33K5vBMl9hkuO9zWucWsk1EBpIPL3X7llgix5GyGXIERBbpBBJIJ35DsHuWiPCwHNJk4qxhp1AQvPI7dnbzQcYnDxlwPk6xFG5p0hj3AFxqxzP/Nv05zcNmIGFuQybV/pI29+/P8A5fcmxcVlCPOjkOoAu0uAo9vLs7fC1kKoryPyR/uH7FZwr8j8kf7h/dUBQSiIqCIiAuo/zB71yuo/zB70GpERAUHkpUHkgmLh+TPjslhc1+t2nQHURzrntvR7VaMLiDWBkj+ijOhxc5+wBPmnazV9yyR5WRC0NjnkYAbAa4iitBi4g9rblLg4MDR0wNgk6e3vB9yDgYeY8awC4EOOrXzAO/itDsPiDYXwOfGQXjWwvbquidz2AaTe6yOycuFzonTytLbaW6z2ncfFcuy8l5cXzyOLvxEuJvmP7n4oO3YmTA9jHDQZTpHnDntzrlzBV54dmimumjbZIAdO0cm3fPlR2KzS5c0zYw95Jjsg3vfff6D4Lg5E5omV5rl53qr9tkHcuNltj1vvSGNP4wfNPLtVhutzZ7TdqiXLyJBTpX1pDavahyV9lwskknck9qglFCKiUUIglFCIJRQiCUUIglFCIJRQiCUUIglQiIOZYnyY7i0WGU479i5gwcidjXsZbXEhpvmR2ft8R3rqWR8UYLHV5wvuOxXAzckO1MmdHvdR+YB7gNgoJOHK2WKN1NMoBBPIWa3VzeGudHr6zCPNedPnXbTVfh5nn7udLKZpSWOMjiWCmkn8Pbsu+t5OnT08lURWo8ibPxKo1v4NMzU05EHSMcGlgLrqrvlVDft7CqxwyXo3vkljiLGF+l+qzXZsCL5c+8Kg5eSZDIciXWebtZs7EfsT8VD8nIkBD55HAijbibG30HwCCpdR/mD3rldR/mD3oNSIiAoPJSoPJBXHjZLmCWOJzmuJaCBdmt9vcrGyZkLhMWOpml3nN2oHb6K3FkzsaCOXFhcPPLhIG6rI9XqUdNxJ8Zi6N7myBjaMXMX5vZ2n4oKBj5WSXSiJ77Be51cwOZUTYk8DNcrA0AgEahYJFixzGytL84xtj6J2hrXgAR7VfndnZ4LlkuVLMyJsYc97maWFgNkCm7H1H9UHAwsl0XSiF+jSHaq5iwNu/chQzEnkyOrhmmX/AEvcGevtpWjJyoDGXR0CwBocyg5oN7fqF1I7OkmL3Y7te7Pyv6QK5dgCgzjCyXua1sLiXaa7vO/Dv2Wryx0ZLHVqbsaNrkZOZDCdMZaBoOvRyAvT/wA9SkHUAT27oJREVBERAREQEREBERB93hODjy4jXyRhxdvuL7SP7L7MH2abk4wnhxY3guI0hu/v5Uvz3D+KMxsZsRa22/6iR2k9gPevoRfaiWAARShgHY2V4/8AFfQcPL8aOGsbG5+vW3pyzeZ843u+zgYCThNoc6ANbA/sQvnZvD8VuJI5sTWkC7ACsH2qlAeDI12tpaSZHnY1f8PqCxZPGY5cd7NLbcK81xP7tC3bm+LNJiZrrMU5u0e3xtgwGtyStAwMh9dHF0ji0OLWbloIsWPcVQC0tpxIo3sLV7MyaMUzKmaAK2H6d/dsvnHtEDBy3XpxZDQs008u9VujMcz4ntGplg79oVozJWihlzAVXLs7BzVTntLnPL3vc67JHMn9UGbJ/KH+4f3WcLXLDLLA50cbnhhBcWi6HrVBx52DzoZBRI3aeY5/BQcIrI8eaWN0kcbnNaQCQLonkpkx54Y2SSwvYx96XOaQHVsaVFSK2TGnhsyQvYGmiS07Grr3rpuHkObqEe2nXu4DbvQULqP8we9WzYeRjtLpYy0B2gmwaPcqo/zB70GpERAUHkpUHkg6x+K5WLFHFGWFkb9bQ5gNHffxUHKzGNp4dpkDSA5pogGxXqsLMyGWStEb3Xy0tJWqPic7AQGtcToq720kV+yDuHiU8Yc18Zcwse0NG1Wb7u9ZmyzYuQJA3RI0UA5vqrkVrj4rlmHo+ibLoY4FxaSRqIs/871lyJZp5yJY3GYlrd71bCqr1oEubNNI17yLY7UKHbQH/iF0/iWU92rpNO38O1bUswBPIWgBcaAJPqQWzZk0sYjc7zdLW0BVgXX7lcNzJWRiMBlAULaL52uAxziAGkl3IAc1DmOa8tc0hwNEEbhQWnOmIOzBd8mBcjLmbe7TYrdoXBje1+hzCHXWkjdc0gu67N0vSeZf+nSK5VyUdbmIrzeQF6VVS6dE9oBcxzbFixzHeg6flzPAFtFdzQF0/NldJqaGtFkhukKnSautl10Mn8t3Z/D38kFpz5qoNjGxB80fFcDMmHa073u1cCNziQ1pJAsgDkEbE9/4WOd7haC2TMe7oy0BpYADyOo/BOvTf0f9gVIaTyCUgtZmysZpAaTd24AqTnTOJPmC75MHaqaSkGn7wk0HzGay670igKqqpVszJ47otNm92gqqkpBacyYs0+byqw0Wp67N3M7P4QqaSkFvW5tTnW3zuzTsPcujnTHsj53swKikpBoGfOCD5goAbN7iD/YKX5cstBxGkN0hvZyIH7rOAukGnGzp8WJ8cRAbIWlwIvcGwq5siTINyVeou2HebKqRUaJM6aWHoTpDLugPUB/4hdP4hPJAIXEFgaGjbsFfQfBZUQXz5k2RYe7zXOLy0bAkkm/E/FVR/mD3rldR/mD3oNSIiAoPJSoPJBXDlPippLnRgOpmqgCRRK0/e8waNLA1zQwBzSQRpNg/2Xz0QbpOJOlYGujs/wCJbi4ku1d6qjzXRZjMprBrYBVntAq/7rMiD6TeNStJ/wAFlUWgWdgRVe7trvXA4tKW1IwOJcSXA0TbS2vgd++gsCKDW/Pe7JxZtAvGa0NHYdJtW/ez+gEJgjLQCB6rcD2e5fPRUb4eLSQEOjjpwLTqDiPwgD9h4lcScSlfB0QAFgguJskHmP7+8krGiC0ZH+WEBY0tD9V9p25K05t4xhMLD5jW6jzFEn+6yogvfksfAyLoGAM1URzN32/r4BWScRke0hupriWODtZsFrdN/qsiKCyKd0fSbB3SCjYvttaZeJGWTWYq8/VpDjX4QD8aWJEG13EnHHdCImgOjbHYPYL/AHu/esTqLiQKBOw7kRBFJSlEEUlKUQRSUpRUQilEBERAREQEREBbMeNhw3SFo1B1A/BY1rglYMR0Rd55dYFe5BKIiAiIgih3BKHcFKIIodwSh3BSiCKHcEodwUogih3BKHcFKIIodwSh3BSiCKHcEodwUogih3BKHcFKIIodwSh3BSiCKHcEodwUogih3BKHcFKIIodwSh3BSiCKHcEodwUogih3BKHcFKIIodwSh3BSiCKHcEodwUogih3BKHcFKIIodwSh3BSiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIO1EHb60EtbqNAE/qmk/6SpaS26dV7LrpX1+NBXsDVKdtN+tDvzI+CbBtXe6AaHYpDC4WGkhQaPaumSOj/AAvpBGh1E6DtzXO3crHSveCHPBv1Lih3oAAt19i7iidM4tjYSQLO9LkEW6zVhW404xnl2mOQOFFrwSO9BHVZ9v8ALy7mh5p3UOgkjZrfC9rbAtwrndfsVpfxbLeGh0zdLWlgbp20nmFXkZ+RlRNimm1MaGgCuWkEDwKDNtpsDtQ0DVIaDau7KGibtBOkkWGndNB/0FA4gVq2ql0ZHH+Mc75IK9u5CKJHcpod6gm3E95QYxnGt4xfvTrx/l+KIop14/y/FOvH+X4oiB14/wAvxTrx/l+KIgde9n4p172fiiIHXvZ+Kde9n4oiB172finXvZ+KIgde9n4p172fiiIHXvZ+Kde9n4oiB172finXvZ+KIgde9n4p172fiiIHXvZ+Kde9n4oiB172finXvZ+KIgde9n4p172fiiIHXvZ+Kde9n4oiB172finXvZ+KIgde9n4p14/y/FEQOvH+X4p14/y/FEQOvH+X4p14/wAvxREDrx/l+Kde9n4oiD//2Q=='),
	(19, 'João Silva', '12345678901', 'joao.silva@email.com', '123456', 'aluno', '2026-08-27 18:14:17', NULL),
	(20, 'Maria Oliveira', '12345678902', 'maria.oliveira@email.com', '123456', 'aluno', '2026-05-12 16:49:05', NULL),
	(21, 'Pedro Santos', '12345678903', 'pedro.santos@email.com', '123456', 'aluno', '2026-05-12 16:49:05', NULL),
	(22, 'Ana Costa', '12345678904', 'ana.costa@email.com', '123456', 'aluno', '2026-08-06 12:05:59', NULL),
	(23, 'Lucas Ferreira', '12345678905', 'lucas.ferreira@email.com', '123456', 'aluno', '2026-05-12 16:49:05', NULL),
	(24, 'Juliana Lima', '12345678906', 'juliana.lima@email.com', '123456', 'aluno', '2026-05-12 16:49:05', NULL),
	(25, 'Carlos Souza', '12345678907', 'carlos.souza@email.com', '123456', 'aluno', '2026-08-27 18:12:48', NULL),
	(26, 'Fernanda Alves', '12345678908', 'fernanda.alves@email.com', '123456', 'aluno', '2026-05-12 16:49:05', NULL),
	(27, 'Rafael Gomes', '12345678909', 'rafael.gomes@email.com', '123456', 'aluno', '2026-05-12 16:49:05', NULL),
	(29, 'Bruno Martins', '12345678911', 'bruno.martins@email.com', '123456', 'aluno', '2026-05-12 16:49:05', NULL),
	(30, 'Camila Ribeiro', '12345678912', 'camila.ribeiro@email.com', '123456', 'aluno', '2026-05-12 16:49:05', NULL),
	(31, 'Diego Carvalho', '12345678913', 'diego.carvalho@email.com', '123456', 'aluno', '2026-08-27 18:14:09', NULL),
	(32, 'Larissa Mendes', '12345678914', 'larissa.mendes@email.com', '123456', 'aluno', '2026-05-12 16:49:05', NULL),
	(33, 'Felipe Barbosa', '12345678915', 'felipe.barbosa@email.com', '123456', 'aluno', '2026-05-12 16:49:05', NULL),
	(35, 'Gustavo Araújo', '12345678917', 'gustavo.araujo@email.com', '123456', 'aluno', '2026-05-12 16:49:05', NULL),
	(36, 'Beatriz Fernandes', '12345678918', 'beatriz.fernandes@email.com', '123456', 'aluno', '2026-05-12 16:49:05', NULL),
	(37, 'Thiago Moreira', '12345678919', 'thiago.moreira@email.com', '123456', 'aluno', '2026-08-27 18:12:40', NULL),
	(38, 'Renata Teixeira', '12345678920', 'renata.teixeira@email.com', '123456', 'aluno', '2026-05-12 16:49:05', NULL),
	(39, 'Julia Donangelo Alves Carneiro', '80092198007', 'julia@gmail.com', '$2b$10$0LDEdC2z2gCWbVr0EjJFueR1cnkWFIBSBAEFBu4TcvIFgzRwUg0Sa', 'admin', '2026-08-27 18:11:46', 'data:image/jpeg;base64,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1zNTWynMr42blaxgGS0erJjGTgZB48g3oCUBbVLLDNSQy0zmuhexroy3kWkcMexdq170Xtgr9M0MdruNEK6jh9GMtduSxjPLucPDh5rI6o25VVwopqKw0L6HtRu/K5JMyAdd0Dg0+OT4YPFAXmig2ye+X++aX375TvxC4Mp6x5w6pb1yOpGMb3XzBJnKAIiIAiIgCIiAIiIAiIgI/ctC6busr5ai2Rtlfzkiyw+fDhn2LoodnWl6FzHttrZnsdvB0zi74cj7lJ0U/qXrWyPRO96OLGMijbHG0MY0ANa0YAHcAvPcrZR3ejdR18AngfjeYSRn3L1Io713JGLs+m7PYHSutdE2mMwAkLXOO9jOOZ8SsoiI229s8SS8Hmr6ClulDLRVsImp5QA9hJGeOeniF4rTpay2KofPbKBlPI9m45zXOORnOOJ8FlkTqaWtjS3sKP3PQ2m7tI+WptkYleMGSPLD58OGfYpAiKnPdMNJ+SKUezTS1Jg/N5nIOQZnk492FKIYYqeJsMETIo2DDWMaAB5ALmi9q6rywpS8Ixd301Z786J10om1LoQQwuc4Yzz5Feu3W6ktNFHRUMIhp487rAScZOeq9KLzqetbGlvZwmiZPC+GVu8yRpa5veDzWGt2jNPWmuZW0NtZDUR53Xh7iRkYPM9xWcRFTS0mGkwsPfdKWPUgZ87W+KodGCGPOQ5o8wswi8PSGW/ZNo+3y9qLe+dwcHNM0pO6R3YwpmiICNXjZ5pa+SyT1lpiE8gwZYssd58OGfHC8dt2U6Ptrg8WsVD2u3g6oeXY9nI+0KYogOEUUcETYoY2xxsGGsYMADwC5oiAi952caUvksk1Vao2TyetLCSx3nw4Z8cLotey3SFqeyRlrbUSMOWvqHF/w5H2hS9EB8ADQA0AAcAB0X1EQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREB//2Q=='),
	(48, 'Testador da Silva', '12345678910', 'testador@gmail.com', '$2b$10$h4683ePPmvoVtV2I.fB8x.lkmeREiJjWmFzWLjrMxZP6saFXxd1q2', 'aluno', '2026-11-19 14:15:40', NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
