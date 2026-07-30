-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           10.4.32-MariaDB - mariadb.org binary distribution
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
CREATE DATABASE IF NOT EXISTS `tcc` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_bin */;
USE `tcc`;

-- Copiando estrutura para tabela tcc.cursos
DROP TABLE IF EXISTS `cursos`;
CREATE TABLE IF NOT EXISTS `cursos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `vagas` int(11) NOT NULL DEFAULT 0,
  `status` varchar(50) NOT NULL,
  `duracao` int(11) NOT NULL,
  `descricao` varchar(500) NOT NULL DEFAULT '',
  `area` varchar(200) NOT NULL DEFAULT '',
  `carga_horaria` int(11) NOT NULL,
  `salario` varchar(50) NOT NULL DEFAULT '',
  `resumo` varchar(250) NOT NULL,
  `mercado` varchar(250) NOT NULL,
  `perfil` varchar(250) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- Copiando dados para a tabela tcc.cursos: ~5 rows (aproximadamente)
DELETE FROM `cursos`;
INSERT INTO `cursos` (`id`, `nome`, `vagas`, `status`, `duracao`, `descricao`, `area`, `carga_horaria`, `salario`, `resumo`, `mercado`, `perfil`) VALUES
	(1, 'Desenvolvimento de Sistemas', 64, 'ativo', 4, 'Mergulhe no universo da programação e crie sites, aplicativos e softwares que transformam o dia a dia das pessoas. Você aprenderá lógica de programação, linguagens como JavaScript, Python, bancos de dados e metodologias ágeis. O curso estimula o raciocínio lógico e a resolução criativa de problemas, capacitando você a desenvolver sistemas completos, do front-end ao back-end. Prepare-se para o mercado de tecnologia, um dos que mais crescem no mundo.', 'Desenvolvedor Web, Mobile, Backend, Analista de Sistemas, Suporte Técnico.', 1200, 'R$ 2.500 a R$ 6.000', 'Crie sistemas web, mobile e desktop. Aprenda programação, banco de dados e desenvolvimento ágil.', 'Alta demanda em empresas de tecnologia, startups e setores digitais. Pode atuar como desenvolvedor web, mobile, backend ou analista de sistemas, com boas oportunidades de crescimento.', 'Pessoa com interesse em tecnologia, lógica e resolução de problemas. Gosta de aprender coisas novas, trabalhar com computadores e criar soluções digitais.'),
	(2, 'Química', 32, 'ativo', 4, 'Explore o fascinante mundo das transformações químicas e suas aplicações industriais e científicas. Você aprenderá técnicas de análise laboratorial, controle de qualidade, química orgânica e inorgânica, além de boas práticas de laboratório. O curso une teoria e experimentação, desenvolvendo sua capacidade de observação, precisão e pensamento crítico. Com essa formação, poderá atuar em indústrias farmacêuticas, alimentícias, cosméticas e institutos de pesquisa.', 'Técnico Químico, Laboratorista, Controle de Qualidade', 1200, 'R$ 2.200 a R$ 4.500', 'Atue em laboratórios, indústrias e controle de qualidade. Análises químicas e processos industriais.', 'Atuação em indústrias químicas, farmacêuticas, alimentícias e laboratórios. Pode trabalhar com controle de qualidade, análises químicas e processos industriais.', 'Pessoa curiosa, detalhista e interessada em experimentos e ciência. Tem paciência para análises e gosta de entender como as coisas funcionam.'),
	(3, 'Administração', 32, 'ativo', 4, 'Desenvolva uma visão estratégica de negócios e aprenda a gerenciar recursos, pessoas e processos com eficiência. O curso aborda finanças, marketing, recursos humanos, logística e empreendedorismo, sempre com foco na tomada de decisão. Por meio de estudos de caso e projetos práticos, você exercitará liderança, comunicação e planejamento. Ao final, estará pronto para atuar em empresas de qualquer porte ou abrir seu próprio negócio com confiança.', 'Assistente Administrativo, Supervisor, Empreendedor', 1200, 'R$ 2.000 a R$ 4.000', 'Gestão de empresas, finanças, marketing e recursos humanos. Torne-se um gestor de sucesso.', 'Amplo mercado em empresas de todos os setores. Pode atuar em áreas como financeiro, recursos humanos, marketing e gestão empresarial.', 'Pessoa comunicativa, organizada e com interesse em gestão e negócios. Gosta de liderar, tomar decisões e trabalhar com pessoas.'),
	(4, 'Logística', 32, 'ativo', 4, 'Descubra como os produtos chegam até você e torne-se um especialista em planejar, executar e controlar cadeias de suprimentos. Você aprenderá sobre gestão de estoques, modais de transporte, distribuição, compras e custos logísticos. O curso enfatiza a organização, a visão sistêmica e a resolução de problemas reais do mercado. Com essa formação, você estará apto a atuar em transportadoras, centros de distribuição, indústrias e comércio eletrônico.', 'Coordenador de Logística, Analista de Supply Chain, Transportes', 1200, 'R$ 2.200 a R$ 4.800', 'Gerencie cadeias de suprimentos, transportes e armazenagem. Otimize processos logísticos.', 'Alta demanda em centros de distribuição, transportadoras e indústrias. Atua no controle de estoque, transporte, cadeia de suprimentos e planejamento logístico.', 'Pessoa organizada, prática e que gosta de planejamento. Tem interesse em processos, transporte e organização de sistemas.'),
	(5, 'Eletroeletrônica', 32, 'ativo', 4, 'Aprenda a dominar circuitos elétricos, eletrônica analógica e digital, máquinas elétricas e sistemas de automação. Você desenvolverá habilidades para instalar, manter e reparar equipamentos industriais, painéis de comando e sistemas de energia. O curso une teoria e prática em laboratórios equipados, preparando você para atuar em indústrias, concessionárias de energia e empresas de manutenção. Com foco em tecnologia limpa e eficiência energética, você sairá apto a projetar soluções inteligentes p', 'Técnico em Eletrônica, Automação, Manutenção Industrial', 1200, 'R$ 2.500 a R$ 5.500', 'Projete e mantenha circuitos elétricos, sistemas eletrônicos e automação industrial.', 'Atuação em indústrias, manutenção industrial e automação. Pode trabalhar com instalação, manutenção de equipamentos e sistemas elétricos.', 'Pessoa prática, técnica e interessada em eletricidade e equipamentos. Gosta de montar, consertar e entender sistemas eletrônicos.');

-- Copiando estrutura para tabela tcc.respostas
DROP TABLE IF EXISTS `respostas`;
CREATE TABLE IF NOT EXISTS `respostas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `data` datetime NOT NULL,
  `pontos` int(11) NOT NULL,
  `curso` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK__usuarios` (`id_usuario`),
  CONSTRAINT `FK__usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- Copiando dados para a tabela tcc.respostas: ~0 rows (aproximadamente)
DELETE FROM `respostas`;

-- Copiando estrutura para tabela tcc.usuarios
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(200) NOT NULL,
  `cpf` varchar(11) NOT NULL DEFAULT '',
  `email` varchar(50) NOT NULL,
  `senha` varchar(256) NOT NULL,
  `nivel` varchar(50) NOT NULL DEFAULT '',
  `data` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `cpf` (`cpf`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- Copiando dados para a tabela tcc.usuarios: ~23 rows (aproximadamente)
DELETE FROM `usuarios`;
INSERT INTO `usuarios` (`id`, `nome`, `cpf`, `email`, `senha`, `nivel`, `data`) VALUES
	(15, 'João Victor Piacenza de Oliveira Andrade', '12648976000', 'joaoandrade@gmail.com', '$2b$10$ty5H/Da9hN83hq75cnxdnuh1ru5LKuhIf.Ds1BzROEioE2jdN5R.K', 'admin', '2026-05-12 16:30:34'),
	(19, 'João Silva', '12345678901', 'joao.silva@email.com', '123456', 'admin', '2026-05-12 16:49:05'),
	(20, 'Maria Oliveira', '12345678902', 'maria.oliveira@email.com', '123456', 'aluno', '2026-05-12 16:49:05'),
	(21, 'Pedro Santos', '12345678903', 'pedro.santos@email.com', '123456', 'aluno', '2026-05-12 16:49:05'),
	(22, 'Ana Costa', '12345678904', 'ana.costa@email.com', '123456', 'aluno', '2026-05-12 16:49:05'),
	(23, 'Lucas Ferreira', '12345678905', 'lucas.ferreira@email.com', '123456', 'aluno', '2026-05-12 16:49:05'),
	(24, 'Juliana Lima', '12345678906', 'juliana.lima@email.com', '123456', 'aluno', '2026-05-12 16:49:05'),
	(25, 'Carlos Souza', '12345678907', 'carlos.souza@email.com', '123456', 'admin', '2026-05-12 16:49:05'),
	(26, 'Fernanda Alves', '12345678908', 'fernanda.alves@email.com', '123456', 'aluno', '2026-05-12 16:49:05'),
	(27, 'Rafael Gomes', '12345678909', 'rafael.gomes@email.com', '123456', 'aluno', '2026-05-12 16:49:05'),
	(28, 'Patricia Rocha', '12345678910', 'patricia.rocha@email.com', '123456', 'aluno', '2026-05-12 16:49:05'),
	(29, 'Bruno Martins', '12345678911', 'bruno.martins@email.com', '123456', 'aluno', '2026-05-12 16:49:05'),
	(30, 'Camila Ribeiro', '12345678912', 'camila.ribeiro@email.com', '123456', 'aluno', '2026-05-12 16:49:05'),
	(31, 'Diego Carvalho', '12345678913', 'diego.carvalho@email.com', '123456', 'admin', '2026-05-12 16:49:05'),
	(32, 'Larissa Mendes', '12345678914', 'larissa.mendes@email.com', '123456', 'aluno', '2026-05-12 16:49:05'),
	(33, 'Felipe Barbosa', '12345678915', 'felipe.barbosa@email.com', '123456', 'aluno', '2026-05-12 16:49:05'),
	(34, 'Amanda Nunes', '12345678916', 'amanda.nunes@email.com', '123456', 'aluno', '2026-05-12 16:49:05'),
	(35, 'Gustavo Araújo', '12345678917', 'gustavo.araujo@email.com', '123456', 'aluno', '2026-05-12 16:49:05'),
	(36, 'Beatriz Fernandes', '12345678918', 'beatriz.fernandes@email.com', '123456', 'aluno', '2026-05-12 16:49:05'),
	(37, 'Thiago Moreira', '12345678919', 'thiago.moreira@email.com', '123456', 'admin', '2026-05-12 16:49:05'),
	(38, 'Renata Teixeira', '12345678920', 'renata.teixeira@email.com', '123456', 'aluno', '2026-05-12 16:49:05'),
	(39, 'Julia Donangelo Alves Carneiro', '80092198007', 'julia@gmail.com', '$2b$10$0LDEdC2z2gCWbVr0EjJFueR1cnkWFIBSBAEFBu4TcvIFgzRwUg0Sa', 'aluno', '2026-05-12 18:10:19'),
	(43, 'Testador', '31941556019', 'testador@gmail.com', '$2b$10$C1dJtJUnbQXoxfQxDugpUOUf11mRzih1JtUtzrdNHFrkr9SNEaBwG', 'admin', '2026-07-30 11:44:49');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
