-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Client :  127.0.0.1
-- Généré le :  Lun 16 Mai 2016 à 16:27
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
  `pseudo` varchar(20) NOT NULL,
  `rang` varchar(3) NOT NULL,
  `serveur` varchar(3) NOT NULL,
  `partie_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pseudo` (`pseudo`),
  UNIQUE KEY `identifiant_2` (`identifiant`),
  KEY `identifiant` (`identifiant`),
  KEY `identifiant_3` (`identifiant`),
  KEY `partie_id` (`partie_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Contenu de la table `login`
--

INSERT INTO `login` (`id`, `identifiant`, `password`, `prenom`, `pseudo`, `rang`, `serveur`, `partie_id`) VALUES
(1, 'hiso@gmail.com', 'admin', 'Chris', 'Hiso', '3D', 'KGS', 0),
(2, 'couette@gmail.com', 'admin', 'Alex', 'Couette', '30k', 'KGS', 0),
(3, 'alfred@gmail.com', 'admin', 'Alfred', 'JeTest', '30k', 'OGS', 0),
(4, 'dehenau@gmail.com', 'admin', 'De Henau', 'DH', '30k', 'KGS', 0);

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
  `QuiGagne` varchar(6) NOT NULL,
  `datePartie` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `etat` (`etat`),
  KEY `etat_2` (`etat`),
  KEY `etat_3` (`etat`),
  KEY `joueurBlanc` (`joueurBlanc`),
  KEY `joueurNoir` (`joueurNoir`),
  KEY `joueurBlanc_2` (`joueurBlanc`),
  KEY `joueurNoir_2` (`joueurNoir`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Contenu de la table `parties`
--

INSERT INTO `parties` (`id`, `joueurBlanc`, `joueurNoir`, `nom_Partie`, `etat`, `savePartie`, `QuiGagne`, `datePartie`) VALUES
(1, 'hiso@gmail.com', 'noir', 'fgame_5739d7d9ded71', 1, '["1,6","6,2","6,6","2,2","4,5","2,4","6,4"]', 'Vide', '2016-05-16'),
(2, 'hiso@gmail.com', 'noir', 'fgame_5739d7f6a1b4e', 1, '["0,0","0,1","0,2","0,3","0,4","0,5","1,3","1,0"]', 'Vide', '2016-05-16'),
(3, 'hiso@gmail.com', 'noir', 'fgame_5739d802a6f6e', 1, '["0,8","1,8","0,7","0,6","1,7","2,7","1,6","1,5"]', 'Vide', '2016-05-16'),
(4, 'hiso@gmail.com', 'noir', 'fgame_5739d80ea555c', 1, '["0,5","8,4","1,4","7,5","4,4"]', 'Vide', '2016-05-16');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
