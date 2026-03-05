# EnTrain - Site Web

Site web premium pour EnTrain, une plateforme de coaching scientifique pour gagner des années de vie en forme.

## 🎨 Design

- **Arrière-plan** : Beige clair (#F5F1EB)
- **Polices principales** : 
  - Bleu marine foncé (#1A2B4A)
  - Bordeaux (#6B2737)
- **Accents** : Or (#D4AF37)
- **Style** : Premium, élégant, simple mais stylé

## 🚀 Démarrage rapide

### Installation des dépendances

```bash
npm install
```

### Lancement du serveur de développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Build de production

```bash
npm run build
npm start
```

## 📄 Structure du projet

```
longevity/
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Page d'accueil
│   ├── globals.css         # Styles globaux
│   └── science/
│       └── page.tsx        # Page Science & Expertise
├── public/                 # Fichiers statiques
├── .gitignore
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## ✨ Fonctionnalités

- **Landing Page** avec value proposition claire
- **Page Science** présentant l'expertise de Vincent Foulonneau
- Design responsive et accessible
- Navigation fluide
- Palette de couleurs premium
- Typography optimisée pour 50+

## 🔬 Expertise

Le site met en avant l'approche scientifique de Vincent Foulonneau :
- Physicien chercheur en sciences du vieillissement
- Coach expert en prophylaxie
- Approche basée sur des données scientifiques validées

## 📱 Pages

### Page d'accueil (/)
- Hero section avec value proposition
- Section bénéfices (Corps, Cerveau, Lien)
- Fonctionnalités (tracking, objectifs, motivation)
- Call-to-action

### Page Science (/science)
- Profil de l'expert Vincent Foulonneau
- Piliers scientifiques de la méthode
- Données de recherche
- Principes fondamentaux

## 🛠️ Technologies

- **Framework** : Next.js 14
- **Language** : TypeScript
- **Styling** : Tailwind CSS
- **Font** : Inter (Google Fonts)

## 📆 Intégration Google Agenda (MVP)

Le projet inclut maintenant une connexion Google Agenda dans le questionnaire initial (`/onboarding/profil`).

### Variables d'environnement requises

Ajoutez dans `.env.local` :

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
CALENDAR_TOKEN_SECRET=une_phrase_longue_et_aleatoire
```

### Base de données Supabase

Exécutez le script SQL :

```bash
sql/calendar_google_mvp.sql
```

### OAuth Google

Dans Google Cloud Console (OAuth Client), ajoutez cette URI de redirection :

```text
http://localhost:3000/api/calendar/google/callback
```

## 📝 License

© 2026 EnTrain. Tous droits réservés.
