# AREA

## Table des Matières
1. [Description du Projet](#description-du-projet)
2. [Architecture Globale](#architecture-globale)
3. [Technologies Utilisées](#technologies-utilisées)
4. [Installation](#installation)
    - [Back-end](#installation-du-back-end)
    - [Front-end](#installation-du-front-end)
    - [Mobile](#installation-du-mobile)
5. [Utilisation](#utilisation)
6. [Annexes](#annexes)
7. [Contributeurs](#contributeurs)

---

### 1. Description du Projet
Le projet AREA consiste à lier plusieurs services entre eux à travers des combos de action / réactions (d'où il tire son nom) à travers un serveur backend et une application frontend sur web ou sur application mobile.

![Schéma d'une action-réaction](https://media.canva.com/v2/image-resize/format:PNG/height:301/quality:100/uri:s3%3A%2F%2Fmedia-private.canva.com%2F87-Lw%2FMAGRv-87-Lw%2F1%2Fp.png/watermark:F/width:436?csig=AAAAAAAAAAAAAAAAAAAAAMRirWtEOJQePe_e-HcK2EufTKAbCQpPGV7CijGokSaQ&exp=1730421821&osig=AAAAAAAAAAAAAAAAAAAAALydzZdShyfxiOjX-F5P8ecWSDN2L8vM8caKFyIZ3pcx&signer=media-rpc&x-canva-quality=screen)

### 2. Architecture Globale
![Schéma de l'architecture](https://media.discordapp.net/attachments/616321200645210116/1301647771207598152/architecture_area.png?ex=67253d74&is=6723ebf4&hm=44821ea5ff979783aeee67bd78b26d0f82a66e6272a083b70d71a3c9943f3bbf&=&format=webp&quality=lossless)

### 3. Technologies Utilisées
Détaillez les technologies pour chaque partie :
- **Back-end** : Node.js, Express, MongoDB.
- **Front-end** : React, NextJs.
- **Mobile** : React Native, Expo, Tamagui.

### 4. Installation
#### Installation du Back-end
1. Node.js & dépendances (npm i)
2. MongoDB
3. .env dans le dossier backend

#### Installation du Front-end
1. Node.js & dépendances (npm i)

#### Installation du Mobile
1. APK

#### Autres
1. Docker

### 5. Utilisation
#### Avec Docker
1. docker-compose up #executer l'image
2. docker-compose down #retirer l'image

#### Sans Docker
1. pnpm run (dans le dossier backend) #port 8080
2. sudo pnpm run (dans le dossier frontend) #port 8081

### 6. Annexes
[Documentation + Collection Postman (& tests d'intégration) du Backend](https://documenter.getpostman.com/view/30174469/2sAXxY3TqC)

### 7. Contributeurs
<div style="display: flex; justify-content: center;">
  <div style="margin-right: 20px;">
    <a href="https://github.com/Ghost8-0-8" style="text-decoration: none; display: block; text-align: center;">
      <img src="https://github.com/Ghost8-0-8.png?size=85" width="85" style="display: block; margin: 0 auto; margin-bottom: 10px;">
      <sub style="display: block;">Elisa HUANG</sub>
    </a>
  </div>
  <div style="margin-right: 20px;">
    <a href="https://github.com/Gappy777" style="text-decoration: none; display: block; text-align: center;">
      <img src="https://github.com/Gappy777.png?size=85" width="85" style="display: block; margin: 0 auto; margin-bottom: 10px;">
      <sub style="display: block;">Anthony Girard</sub>
    </a>
  </div>
  <div style="margin-right: 20px;">
    <a href="https://github.com/Sonny-Rameaux" style="text-decoration: none; display: block; text-align: center;">
      <img src="https://github.com/Sonny-Rameaux.png?size=85" width="85" style="display: block; margin: 0 auto; margin-bottom: 10px;">
      <sub style="display: block;">Sonny RAMEAUX</sub>
    </a>
  </div>
  <div>
    <a href="https://github.com/celestingm" style="text-decoration: none; display: block; text-align: center;">
      <img src="https://github.com/celestingm.png?size=85" width="85" style="display: block; margin: 0 auto; margin-bottom: 10px;">
      <sub style="display: block;">Celestin GODEFROY-MOURIER</sub>
    </a>
  </div>
  <div>
    <a href="https://github.com/quidam213" style="text-decoration: none; display: block; text-align: center;">
      <img src="https://github.com/quidam213.png?size=85" width="85" style="display: block; margin: 0 auto; margin-bottom: 10px;">
      <sub style="display: block;">dam</sub>
    </a>
  </div>
</div>
