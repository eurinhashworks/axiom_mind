# AXIOM - The Lightning Architect's Interface

Application de gestion d'idées avec **authentification Google** et synchronisation cloud via Firebase.

## 🚀 Démarrage Rapide

**⚡ Nouveau :** Authentification Google implémentée ! Chaque utilisateur a son espace personnel.

### Installation Complète

```bash
# 1. Cloner le projet
git clone https://github.com/eurinhashworks/axiom_mind.git
cd axiom_mind

# 2. Installer les dépendances
pnpm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local

# 4. Éditer .env.local avec vos clés:
# - VITE_GEMINI_API_KEY (Google AI Studio)
# - VITE_FIREBASE_* (Firebase Console)

# 5. Lancer le serveur de développement
pnpm dev
```

**📖 Guides détaillés :**
- **Configuration Firebase :** Voir `FIREBASE_SETUP.md` (8 étapes simples)
- **Premier démarrage :** Voir `DEMARRAGE_RAPIDE.md`
- **Tests :** Voir `TESTING_GUIDE.md`

L'application sera accessible sur `http://localhost:3001/`

## 🏗️ Build de Production

```bash
pnpm build
pnpm preview
```

## 🌟 Fonctionnalités

### ✅ Disponibles
- 🔐 **Authentification Google OAuth** - Espace personnel sécurisé
- ☁️ **Synchronisation Cloud** - Firestore automatique
- 🎤 **Capture Vocale** - Web Speech API
- 💬 **Triage IA Intelligent** - Dialogue conversationnel avec Gemini
- 📊 **Évaluation 3D** - Urgence, Échelle, Passion
- 🗺️ **Plan d'Action MVP** - User stories générées par IA
- 🌌 **Galaxie Interactive** - Visualisation D3.js
- 💾 **Persistance** - LocalStorage + Firestore backup
- 📤 **Export Markdown** - Téléchargement et copie

### 🚧 En Développement (voir ROADMAP.md)
- 🔍 Recherche globale dans les notes
- 🏷️ Système de tags et catégories
- 🌓 Mode sombre/clair
- ⌨️ Raccourcis clavier

## 🛠️ Stack Technique

### Frontend
- **React 19** avec TypeScript
- **Vite 6** pour le build ultra-rapide
- **React Router 7** pour le routing
- **Tailwind CSS 3** pour le styling moderne
- **D3.js 7** pour la visualisation

### Backend & Services
- **Firebase Authentication** - Google OAuth 2.0
- **Firestore Database** - Base de données NoSQL
- **Google Gemini AI** - IA conversationnelle et génération

## 📁 Structure du Projet

```
axiom_mind/
├── src/
│   ├── components/     # Composants React
│   ├── services/       # Services (Gemini API)
│   ├── App.tsx        # Composant principal
│   ├── types.ts       # TypeScript types
│   └── index.tsx      # Point d'entrée
├── index.html
├── vite.config.ts
└── tailwind.config.js
```

## 🔗 Liens

View app in AI Studio: https://ai.studio/apps/drive/1K0iXUDPzjSLpeeH4t7BI0rQEQB6BL3DW

---

## 📚 Documentation

### 📖 Pour Tous
- **[📋 DOCS_INDEX.md](./DOCS_INDEX.md)** - Index de navigation de toute la documentation

### 👨‍💻 Pour les Développeurs
- **[📘 DOCUMENTATION.md](./DOCUMENTATION.md)** - Guide technique complet (architecture, composants, services)
- **[🔌 API.md](./API.md)** - Référence API complète avec exemples
- **[🤝 CONTRIBUTING.md](./CONTRIBUTING.md)** - Guide de contribution (standards, PR, bugs)
- **[🗺️ ROADMAP.md](./ROADMAP.md)** - Features futures (24 fonctionnalités planifiées)

**🚀 Nouveau contributeur ?** Commencez par [DOCS_INDEX.md](./DOCS_INDEX.md) !

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Consultez [CONTRIBUTING.md](./CONTRIBUTING.md) pour :
- Setup de l'environnement de dev
- Standards de code
- Processus de Pull Request
- Comment reporter des bugs

---

Développé avec ❤️ par eurinhashworks
