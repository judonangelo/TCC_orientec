-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           10.4.32-MariaDB - mariadb.org binary distribution
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              12.11.0.7065
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
  `resumo` varchar(200) NOT NULL,
  `mercado` varchar(150) NOT NULL,
  `perfil` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- Copiando dados para a tabela tcc.cursos: ~5 rows (aproximadamente)
DELETE FROM `cursos`;
INSERT INTO `cursos` (`id`, `nome`, `vagas`, `status`, `duracao`, `descricao`, `area`, `carga_horaria`, `salario`, `resumo`, `mercado`, `perfil`) VALUES
	(1, 'Desenvolvimento de sistemas', 64, 'ativo', 4, 'Mergulhe no universo da programação e crie sites, aplicativos e softwares que transformam o dia a dia das pessoas. Você aprenderá lógica de programação, linguagens como JavaScript, Python, bancos de dados e metodologias ágeis. O curso estimula o raciocínio lógico e a resolução criativa de problemas, capacitando você a desenvolver sistemas completos, do front-end ao back-end. Prepare-se para o mercado de tecnologia, um dos que mais crescem no mundo.', 'Crie sistemas web, mobile e desktop. Aprenda programação, banco de dados e desenvolvimento ágil.', 1200, 'R$ 2.500 a R$ 6.000', 'Crie sistemas web, mobile e desktop. Aprenda programação, banco de dados e desenvolvimento ágil.', 'O setor de tecnologia está em plena expansão. Profissionais formados podem atuar em empresas de software, startups, fintechs, e-commerce, agências dig', 'Ideal para quem gosta de resolver problemas, tem raciocínio lógico, gosta de tecnologia, inovação e'),
	(2, 'Química', 32, 'ativo', 4, 'Explore o fascinante mundo das transformações químicas e suas aplicações industriais e científicas. Você aprenderá técnicas de análise laboratorial, controle de qualidade, química orgânica e inorgânica, além de boas práticas de laboratório. O curso une teoria e experimentação, desenvolvendo sua capacidade de observação, precisão e pensamento crítico. Com essa formação, poderá atuar em indústrias farmacêuticas, alimentícias, cosméticas e institutos de pesquisa.', 'Técnico Químico, Laboratorista, Controle de Qualidade', 1200, 'R$ 2.200 a R$ 4.500', 'Atue em laboratórios, indústrias e controle de qualidade. Análises químicas e processos industriais.', 'O técnico em Química é essencial em indústrias químicas, petroquímicas, farmacêuticas, alimentícias, de cosméticos, laboratórios de análises clínicas ', 'Pessoas com curiosidade científica, atenção a detalhes, responsabilidade, organização e interesse po'),
	(3, 'Administração', 32, 'ativo', 4, 'Desenvolva uma visão estratégica de negócios e aprenda a gerenciar recursos, pessoas e processos com eficiência. O curso aborda finanças, marketing, recursos humanos, logística e empreendedorismo, sempre com foco na tomada de decisão. Por meio de estudos de caso e projetos práticos, você exercitará liderança, comunicação e planejamento. Ao final, estará pronto para atuar em empresas de qualquer porte ou abrir seu próprio negócio com confiança.', 'Assistente Administrativo, Supervisor, Empreendedor', 1200, 'R$ 2.000 a R$ 4.000', 'Gestão de empresas, finanças, marketing e recursos humanos. Torne-se um gestor de sucesso.', 'O administrador técnico pode atuar em qualquer tipo de empresa: indústria, comércio, serviços, organizações do terceiro setor, concursos públicos (age', 'Pessoas com habilidades de liderança, comunicação, organização, visão sistêmica e que gostam de reso'),
	(4, 'Logística', 32, 'ativo', 4, 'Descubra como os produtos chegam até você e torne-se um especialista em planejar, executar e controlar cadeias de suprimentos. Você aprenderá sobre gestão de estoques, modais de transporte, distribuição, compras e custos logísticos. O curso enfatiza a organização, a visão sistêmica e a resolução de problemas reais do mercado. Com essa formação, você estará apto a atuar em transportadoras, centros de distribuição, indústrias e comércio eletrônico.', 'Coordenador de Logística, Analista de Supply Chain, Transportes', 1200, 'R$ 2.200 a R$ 4.800', 'Gerencie cadeias de suprimentos, transportes e armazenagem. Otimize processos logísticos.', 'Com o crescimento do e-commerce e das operações globais, a logística tornou-se estratégica. O profissional pode atuar em transportadoras, empresas de ', 'Pessoas organizadas, que gostam de planejamento, têm raciocínio analítico e sabem lidar com prazos.'),
	(5, 'Eletroeletrônica', 32, 'ativo', 4, 'Aprenda a dominar circuitos elétricos, eletrônica analógica e digital, máquinas elétricas e sistemas de automação. Você desenvolverá habilidades para instalar, manter e reparar equipamentos industriais, painéis de comando e sistemas de energia. O curso une teoria e prática em laboratórios equipados, preparando você para atuar em indústrias, concessionárias de energia e empresas de manutenção. Com foco em tecnologia limpa e eficiência energética, você sairá apto a projetar soluções inteligentes p', 'Técnico em Eletrônica, Automação, Manutenção Industrial', 1200, 'R$ 2.500 a R$ 5.500', 'Projete e mantenha circuitos elétricos, sistemas eletrônicos e automação industrial.', 'A indústria 4.0 torna o técnico em eletroeletrônica indispensável. Atua em manutenção industrial, automação predial, empresas de energia renovável (so', 'Pessoas que gostam de entender como as coisas funcionam, têm habilidade manual, raciocínio lógico e ');

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
  `email` varchar(50) NOT NULL,
  `senha` varchar(256) NOT NULL,
  `nivel` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- Copiando dados para a tabela tcc.usuarios: ~2 rows (aproximadamente)
DELETE FROM `usuarios`;
INSERT INTO `usuarios` (`id`, `email`, `senha`, `nivel`) VALUES
	(7, 'natalia@gmail.com', '$2b$10$pXTsTNMM6hcHFxmEqTK4EeUXrOw754it/IKCpO7XOxoLpIWs8EVMK', ''),
	(8, 'joaovictor@gmail.com', '$2b$10$jx6yx4ocX.W1R8zjgBo.u.YY652xaG9bCK7gzlIlVCy0T6CAcd/qa', '');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
