# AXIOM - The Lightning Architect's Interface

Application de gestion d'idées avec visualisation en galaxie interactive.

## 🚀 Lancement Local

**Prérequis:** Node.js 18+ et pnpm

### Installation

```bash
# 1. Installer les dépendances
pnpm install

# 2. Configurer la clé API Gemini
# Créez un fichier .env à la racine et ajoutez:
# VITE_GEMINI_API_KEY=votre_clé_api_ici

# 3. Lancer le serveur de développement
pnpm dev
```

L'application sera accessible sur `http://localhost:3000`

## 🏗️ Build de Production

```bash
pnpm build
pnpm preview
```

## 🌟 Fonctionnalités

- **Capture** : Dumper vos idées rapidement
- **Triage** : Structurer et clarifier vos concepts
- **Évaluation** : Analyser l'urgence, l'échelle et le potentiel
- **Plan d'Action** : Générer automatiquement des user stories via Gemini AI
- **Galaxie** : Visualiser toutes vos idées dans une galaxie interactive D3.js

## 🛠️ Stack Technique

- **React 19** avec TypeScript
- **Vite 6** pour le build
- **Tailwind CSS 3** pour le styling
- **D3.js** pour la visualisation
- **Google Gemini AI** pour la génération de plans

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
