-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Client :  127.0.0.1
-- Généré le :  Dim 10 Avril 2016 à 15:36
-- Version du serveur :  5.6.17
-- Version de PHP :  5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données :  `goproject`
--

-- --------------------------------------------------------

--
-- Structure de la table `login`
--

CREATE TABLE IF NOT EXISTS `login` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `identifiant` varchar(20) NOT NULL,
  `password` varchar(6) NOT NULL,
  `prenom` varchar(15) NOT NULL,
  `pseudo` varchar(15) NOT NULL,
  `rang` varchar(3) NOT NULL,
  `serveur` varchar(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pseudo` (`pseudo`),
  KEY `identifiant` (`identifiant`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=8 ;

--
-- Contenu de la table `login`
--

INSERT INTO `login` (`id`, `identifiant`, `password`, `prenom`, `pseudo`, `rang`, `serveur`) VALUES
(7, 'fulgurogo@gmail.com', 'admin', 'Christopher', 'Hiso', '3D', 'KGS');

-- --------------------------------------------------------

--
-- Structure de la table `parties`
--

CREATE TABLE IF NOT EXISTS `parties` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `joueurBlanc` varchar(20) NOT NULL,
  `joueurNoir` varchar(20) NOT NULL,
  `nom_Partie` varchar(20) NOT NULL,
  `etat` tinyint(1) NOT NULL,
  `savePartie` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `etat` (`etat`),
  KEY `etat_2` (`etat`),
  KEY `etat_3` (`etat`),
  KEY `joueurBlanc` (`joueurBlanc`),
  KEY `joueurNoir` (`joueurNoir`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Contenu de la table `parties`
--

INSERT INTO `parties` (`id`, `joueurBlanc`, `joueurNoir`, `nom_Partie`, `etat`, `savePartie`) VALUES
(1, '', '', '', 0, '["3,4","2,4","2,3","3,3","3,5","2,5","2,6","3,6","3,7","2,7","2,2","3,2"]'),
(2, '', '', '', 0, '["1,3","2,3","2,5","1,5"]');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
