# Application de Chat en temps réel

### Jules RABUS - 5IW3

## Fonctionnalités

* **Authentification utilisateur** avec JWT pour les routes REST et les connexions SSE.
* **Gestion des conversations**

    * Création, modification du titre et suppression de conversations.
    * Suppression en cascade des messages lorsqu’une conversation est supprimée.
    * Multiple conversation
* **Messagerie en temps réel**

    * Streaming des messages via Server-Sent Events (SSE).
    * Envoi de fichiers (images, PDF) vers un stockage compatible S3 (MinIO ou AWS S3).
* **Accusés de lecture**

    * Marquage des messages comme lus par les participants.
    * Affichage du nombre de lectures sur le nombre total de participants.
* **Édition de messages**

    * Édition inline possible durant les 5 premières minutes après envoi.
* **Affichage des participants**

    * Affichage des avatars des participants dans la barre latérale et l’en-tête du chat.
    * Affichage du statut en ligne des participants.

## Possibilité d'amélioration en lien avec le sujet
* **Notifications** : Ajouter des notifications pour les nouveaux messages.
* **Chat** : Afficher la suppression ou l'édition des messages en temps réel.
* **Statut en ligne** : Indiquer qu'un user est en ligne depuis le back, c'est à dire quand son token est utlisé alors on le considère en ligne. Pas fait dans ce cas pour utiliser les websockets et non du SSE.

## Technologies utilisées

* **Frontend** : Next.js, Tailwind CSS, ShaCdn, Typescript
* **Backend** : NestJS, Prisma ORM, PostgreSQL
* **Temps réel** : Server-Sent Events (SSE)
* **Stockage** : Compatibilité S3 (MinIO ou AWS S3)
* **Authentification** : JWT

## Installation

### Lancement de l’application

```bash
# Backend
cd back && docker compose up
cd back && npm run start:dev

# Frontend
cd front && npm run dev
```

Renommer les fichiers .env.example en .env

Pour que les médias fonctionnent, il faut se connecter à minio via http://localhost:9001/ et créer un bucket nommé `media`

```bash
npx prisma migrate dev --name init
```