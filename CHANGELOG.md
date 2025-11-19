# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

---

## [1.0.0] - 2025-01-19

### ✨ Ajouté

#### Features Principales
- **Capture rapide** : Inbox pour dumper les idées rapidement
- **Reconnaissance vocale** : Web Speech API pour input vocal (Chrome/Edge/Safari)
- **Dialogue IA intelligent** : Conversation contextuelle avec Gemini 2.0 Flash
- **Extraction automatique** : L'IA extrait problème, public cible, et nom du projet
- **Évaluation 3D** : Urgence, Échelle, Passion
- **Génération de plans MVP** : User stories générées automatiquement par IA
- **Visualisation galaxie** : D3.js force simulation des idées complétées
- **Persistance auto** : LocalStorage avec hook personnalisé
- **Export Markdown** : Téléchargement et copie presse-papiers
- **Timestamps** : Suivi temporel de toutes les entités

#### Infrastructure
- React 19.2.0 avec TypeScript
- Vite 6.2.0 pour le build
- Tailwind CSS 3.4.17 (configuré via npm)
- Google Gemini AI intégration
- D3.js 7.9.0 pour la visualisation

#### UI/UX
- Design glassmorphism moderne  
- Palette de couleurs indigo professionnelle
- Animations fluides (fadeIn, popIn, slideIn)
- Scrollbar personnalisée
- Mode responsive (mobile + desktop)
- Feedback visuel sur toutes les actions

#### Documentation
- `DOCUMENTATION.md` - Guide technique complet
- `API.md` - Référence API détaillée
- `CONTRIBUTING.md` - Guide de contribution
- `ROADMAP.md` - 24 fonctionnalités futures
- `DOCS_INDEX.md` - Index de navigation

### 🔧 Technique

#### Architecture
- Structure `/src` propre et organisée
- Composants React fonctionnels avec hooks
- Types TypeScript stricts
- Services IA découplés
- Custom hooks réutilisables

#### Optimisations
- Build production optimisé ~500KB
- Lazy loading potentiel (D3.js)
- Auto-save debounce capable
- Gestion d'erreurs robuste

#### Accessibilité
- Feedback visuel clair
- États de loading explicites
- Messages d'erreur informatifs
- Support clavier partiel

### 🐛 Corrigé

- Structure projet (migration vers `/src`)
- Package.json (nom invalide corrigé : `axiom-mind`)
- Tailwind CDN remplacé par npm
- Variables d'env (migration vers `VITE_*`)
- TypeScript types (ajout `vite/client`)
- Git remote configuration

### 🔒 Sécurité

- Clés API en variables d'environnement
- Pas de données sensibles dans localStorage
- Validation des inputs utilisateur
- Sanitization des réponses IA (basique)

### 📚 Documentation

#### README
- Instructions d'installation claires
- Stack technique détaillée
- Structure du projet
- Liens vers toute la documentation

#### Guides Techniques
- Architecture complète
- Flux de données
- Référence de chaque composant
- Services IA expliqués
- Systèmes de persistance

#### Contribution
- Standards de code TypeScript/React
- Processus de PR
- Templates de commits
- Guide de debugging

---

## [0.1.0] - 2025-01-18 (Version initiale AI Studio)

### Ajouté
- Structure de base avec questions rigides
- Intégration Gemini basique
- UI avec Tailwind CDN
- Composants de base (Capture, Triage, Evaluation, Action, Galaxy)

### Problèmes Connus
- ❌ Pas de persistance
- ❌ Questions non adaptatives
- ❌ Structure de fichiers désorganisée
- ❌ Dépendances via CDN
- ❌ Nom de package invalide
- ❌ Pas de timestamps

---

## [Unreleased]

### 🎯 Planifié pour v1.1.0

#### Quick Wins
- [ ] Recherche dans les notes
- [ ] Tags et catégories
- [ ] Mode sombre/clair toggle
- [ ] Raccourcis clavier

#### IA Améliorations
- [ ] Suggestions proactives
- [ ] Détection de liens entre idées
- [ ] Transcription vocale longue durée

Voir [ROADMAP.md](./ROADMAP.md) pour la liste complète.

---

## Format du Changelog

### Types de Changements
- `Ajouté` : Nouvelles features
- `Modifié` : Changements dans features existantes
- `Déprécié` : Features bientôt supprimées
- `Supprimé` : Features supprimées
- `Corrigé` : Bug fixes
- `Sécurité` : Vulnérabilités

### Versioning
- **MAJOR** (1.x.x) : Breaking changes
- **MINOR** (x.1.x) : Nouvelles features (backward compatible)
- **PATCH** (x.x.1) : Bug fixes

---

## Liens

- [Documentation Complète](./DOCUMENTATION.md)
- [Roadmap](./ROADMAP.md)
- [Guide de Contribution](./CONTRIBUTING.md)
- [Référence API](./API.md)

---

**Légende:**
- ✨ Feature
- 🐛 Bug fix
- 🔧 Technique
- 📚 Documentation
- 🔒 Sécurité
- ⚡ Performance
- 🎨 UI/UX
