# 🗺️ ROADMAP - AXIOM

> Vision et fonctionnalités futures pour AXIOM

**Dernière mise à jour :** 19 janvier 2025  
**Version actuelle :** 1.0.0  
**Prochaine version :** 1.1.0 (Q1 2025)

---

## 📊 Vue d'Ensemble

Ce document détaille les 24+ fonctionnalités planifiées pour les prochaines versions d'AXIOM. Les priorités sont définies selon l'impact utilisateur et la faisabilité technique.

### Légende des Priorités

- 🔴 **P0** - Critique (blocage ou forte demande utilisateur)
- 🟠 **P1** - Haute (amélioration significative de l'expérience)
- 🟡 **P2** - Moyenne (nice-to-have, améliore l'UX)
- 🟢 **P3** - Basse (expérimental, future vision)

### Légende des Catégories

- 🎨 **UX** - Interface et expérience utilisateur
- 🤖 **IA** - Intelligence artificielle et automatisation
- 🔧 **Infrastructure** - Architecture et technique
- 📊 **Data** - Gestion et visualisation des données
- 🔐 **Sécurité** - Protection et confidentialité
- 🌐 **Collaboration** - Fonctionnalités multi-utilisateurs

---

## 🚀 v1.1.0 - Quick Wins & Polish (Q1 2025)

**Objectif :** Améliorer l'ergonomie quotidienne et la productivité des utilisateurs existants.

### 🔐 Authentification & Espaces Personnels

#### 1. Authentification Google OAuth
- **Priorité :** 🔴 P0 (CRITIQUE - Bloquant pour multi-utilisateurs)
- **Estimation :** 7-10 jours
- **Description :**
  - Login via Google OAuth 2.0
  - Création automatique de compte utilisateur
  - Session persistante (tokens JWT)
  - Page de login élégante avec branding AXIOM
  - Logout et gestion de session
  - Migration des données LocalStorage vers compte utilisateur
- **Valeur utilisateur :** Chaque personne a son propre espace privé et sécurisé
- **Stack technique :**
  - Firebase Authentication (Google Provider)
  - React Context pour l'état utilisateur global
  - Protected routes pour les vues authentifiées
- **Dépendances :** Synchronisation Cloud (#20 - peut être simplifié avec Firebase)
- **Migration :** Popup pour importer les données LocalStorage existantes au premier login

### 🎨 UX - Productivité

#### 2. Recherche Globale dans les Notes
- **Priorité :** 🟠 P1
- **Estimation :** 3-5 jours
- **Description :** 
  - Barre de recherche avec `Ctrl+K` / `Cmd+K`
  - Recherche full-text dans toutes les notes (À Tisser + Tissé)
  - Highlight des résultats
  - Filtres par statut et date
- **Valeur utilisateur :** Retrouver rapidement une idée parmi des centaines de notes
- **Dépendances :** Aucune

#### 3. Système de Tags et Catégories
- **Priorité :** 🟠 P1
- **Estimation :** 5-7 jours
- **Description :**
  - Ajouter des tags lors de la capture (`#design`, `#saas`, etc.)
  - Filtrage par tags dans la vue Capture
  - Auto-suggestion de tags basée sur l'IA
  - Couleurs personnalisables par tag
- **Valeur utilisateur :** Organiser et retrouver les idées par thèmes
- **Dépendances :** Recherche (#2)

#### 4. Mode Sombre/Clair Toggle
- **Priorité :** 🟡 P2
- **Estimation :** 2-3 jours
- **Description :**
  - Toggle dans le header avec icône ☀️/🌙
  - Persistance de la préférence (LocalStorage)
  - Palette de couleurs adaptée (dark mode élégant)
  - Respect de la préférence système (`prefers-color-scheme`)
- **Valeur utilisateur :** Confort visuel selon l'environnement
- **Dépendances :** Aucune

#### 5. Raccourcis Clavier
- **Priorité :** 🟠 P1
- **Estimation :** 3-4 jours
- **Description :**
  - `Ctrl+K` : Recherche
  - `Ctrl+N` : Nouvelle note
  - `ESC` : Retour/Fermeture
  - `Ctrl+E` : Export rapide
  - `Ctrl+V` : Activer la voix
  - Panel d'aide avec `?`
- **Valeur utilisateur :** Navigation ultra-rapide sans souris
- **Dépendances :** Aucune

---

### 🤖 IA - Intelligence Augmentée

#### 6. Suggestions Proactives
- **Priorité :** 🟠 P1
- **Estimation :** 7-10 jours
- **Description :**
  - L'IA analyse les notes "À Tisser" et suggère des actions
  - Notifications douces : "Cette idée pourrait intéresser le marché X"
  - Suggestions de fusionner des idées similaires
  - Rappels intelligents basés sur l'urgence
- **Valeur utilisateur :** Ne jamais oublier une bonne idée
- **Dépendances :** Modèle d'évaluation étendu

#### 7. Détection de Liens Entre Idées
- **Priorité :** 🟡 P2
- **Estimation :** 10-14 jours
- **Description :**
  - Gemini analyse le contexte de toutes les idées
  - Création d'un graphe de dépendances/similarités
  - Vue "Constellation" : idées connectées par thème
  - Suggestion de "spin-offs" ou "features complémentaires"
- **Valeur utilisateur :** Découvrir des synergies cachées entre projets
- **Dépendances :** Système de tags (#2)

#### 8. Transcription Vocale Longue Durée
- **Priorité :** 🟡 P2
- **Estimation :** 5-7 jours
- **Description :**
  - Enregistrement audio jusqu'à 5 minutes
  - Transcription via Gemini API (meilleure que Web Speech)
  - Sauvegarde des fichiers audio (optionnel)
  - Timestamping des prises de parole
- **Valeur utilisateur :** Dumper des idées complexes en mode "stream of consciousness"
- **Dépendances :** Migration vers Gemini Speech API

---

### 📊 Data - Visualisation & Insights

#### 9. Dashboard Analytics
- **Priorité :** 🟡 P2
- **Estimation :** 7-10 jours
- **Description :**
  - Vue "Metrics" : nombre d'idées par mois, taux de complétion
  - Graphiques d'évolution de la productivité
  - Heatmap des jours de capture (style GitHub)
  - Score d'opportunité moyen par catégorie
- **Valeur utilisateur :** Comprendre ses patterns de créativité
- **Dépendances :** Système de tags (#2)

#### 10. Export Avancé Multi-Format
- **Priorité :** 🟢 P3
- **Estimation :** 4-5 jours
- **Description :**
  - Export en PDF (design premium)
  - Export en Notion format
  - Export en JSON structuré (API-ready)
  - Synchronisation avec Google Docs
- **Valeur utilisateur :** Intégration dans d'autres workflows
- **Dépendances :** Aucune

---

## 🌟 v1.2.0 - Power User Features (Q2 2025)

**Objectif :** Transformer AXIOM en outil indispensable pour les entrepreneurs sérieux.

### 🎨 UX - Workflows Avancés

#### 10. Templates d'Idées
- **Priorité :** 🟠 P1
- **Estimation :** 5-7 jours
- **Description :**
  - Templates pré-définis : SaaS, Mobile App, Hardware, Marketplace, etc.
  - Questionnaire adapté au type de projet
  - Bibliothèque communautaire de templates
  - Créer ses propres templates personnalisés
- **Valeur utilisateur :** Accélérer le triage pour des projets typiques

#### 11. Board Kanban pour Projets Actifs
- **Priorité :** 🟠 P1
- **Estimation :** 10-14 jours
- **Description :**
  - Vue "Active Projects" avec colonnes drag-and-drop
  - Colonnes : Backlog, In Progress, Blocked, Done
  - Sous-tâches pour chaque user story
  - Estimation de temps et deadlines
- **Valeur utilisateur :** Gérer l'exécution réelle des projets

#### 12. Notes Rapides avec Widgets
- **Priorité :** 🟡 P2
- **Estimation :** 4-6 jours
- **Description :**
  - Widget flottant "Quick Capture" (toujours accessible)
  - Capture depuis n'importe quelle vue
  - "Inbox Zero" mode : vider rapidement le brain dump
  - Batch actions (archiver, taguer en masse)
- **Valeur utilisateur :** Réduire la friction de capture

---

### 🤖 IA - Coaching Intelligent

#### 13. AXIOM Coach - Feedback Proactif
- **Priorité :** 🟠 P1
- **Estimation :** 14-21 jours
- **Description :**
  - L'IA analyse le comportement de l'utilisateur
  - Suggestions personnalisées : "Tu sembles bloqué sur ce projet, veux-tu pivoter ?"
  - Détection de patterns : "Tu capturas 5 idées SaaS ce mois, focus ?"
  - Mode "Devil's Advocate" : challenges tes hypothèses
- **Valeur utilisateur :** Un mentor IA qui pousse à l'excellence

#### 14. Auto-Recherche Market
- **Priorité :** 🟡 P2
- **Estimation :** 10-14 jours
- **Description :**
  - Gemini recherche automatiquement des concurrents
  - Analyse de tendances (Google Trends, Product Hunt, etc.)
  - Rapport de marché généré automatiquement
  - Suggestions de positionnement unique
- **Valeur utilisateur :** Validation rapide de l'opportunité de marché

#### 15. Génération de Pitch Deck
- **Priorité :** 🟢 P3
- **Estimation :** 14-21 jours
- **Description :**
  - L'IA génère un pitch deck complet (10-15 slides)
  - Basé sur les données du triage et évaluation
  - Export PowerPoint/Google Slides/PDF
  - Templates Y Combinator, 500 Startups, etc.
- **Valeur utilisateur :** Passer de l'idée au pitch en 1 clic

---

### 📊 Data - Collaboration & Partage

#### 16. Partage Public de Projets
- **Priorité :** 🟡 P2
- **Estimation :** 7-10 jours
- **Description :**
  - Générer un lien public pour partager une idée
  - Vue read-only élégante pour les investisseurs/partenaires
  - Option de feedback anonyme
  - Analytics : qui a vu ton projet ?
- **Valeur utilisateur :** Recruter des co-fondateurs ou early adopters

---

## 🔥 v2.0.0 - Collaborative & Cloud (Q3-Q4 2025)

**Objectif :** Passer d'un outil solo à une plateforme collaborative.

### 🌐 Collaboration - Multi-Utilisateurs

#### 17. Workspaces d'Équipe
- **Priorité :** 🔴 P0
- **Estimation :** 21-30 jours
- **Description :**
  - Créer des workspaces partagés (limite 5-10 personnes)
  - Rôles : Owner, Editor, Viewer
  - Permissions granulaires par projet
  - Activity feed : qui a modifié quoi
- **Valeur utilisateur :** Brainstormer en équipe

#### 18. Commentaires & Discussions
- **Priorité :** 🟠 P1
- **Estimation :** 10-14 jours
- **Description :**
  - Thread de commentaires sur chaque idée
  - Mentions `@username`
  - Résolution de commentaires (style Google Docs)
  - Notifications temps réel
- **Valeur utilisateur :** Feedback collaboratif structuré

#### 19. Version History & Rollback
- **Priorité :** 🟡 P2
- **Estimation :** 7-10 jours
- **Description :**
  - Historique complet des modifications
  - Diff visuel entre versions
  - Rollback à une version antérieure
  - Branching expérimental (tester des variantes)
- **Valeur utilisateur :** Ne jamais perdre une bonne itération

---

### 🔧 Infrastructure - Cloud & Performance

#### 20. Synchronisation Cloud
- **Priorité :** 🔴 P0
- **Estimation :** 21-30 jours
- **Description :**
  - Backend avec Firebase/Supabase
  - Sync en temps réel entre appareils
  - Offline-first avec conflict resolution
  - Migration depuis LocalStorage
- **Valeur utilisateur :** Accéder à ses idées partout

#### 21. Application Mobile (PWA)
- **Priorité :** 🟠 P1
- **Estimation :** 14-21 jours
- **Description :**
  - Progressive Web App installable
  - Mode offline complet
  - Notifications push
  - Optimisation tactile (swipe gestures)
- **Valeur utilisateur :** Capturer des idées en déplacement

#### 22. API Publique & Webhooks
- **Priorité :** 🟢 P3
- **Estimation :** 14-21 jours
- **Description :**
  - REST API documentée (OpenAPI)
  - Webhooks pour intégrations (Zapier, Make, etc.)
  - OAuth2 pour authentification
  - Rate limiting et quotas
- **Valeur utilisateur :** Automatisation et intégrations custom

---

### 🔐 Sécurité & Privacy

#### 23. Chiffrement End-to-End
- **Priorité :** 🟡 P2
- **Estimation :** 14-21 jours
- **Description :**
  - Chiffrement des données sensibles (AES-256)
  - Clés privées locales uniquement
  - Mode "Private Vault" pour idées confidentielles
  - Audit logs complets
- **Valeur utilisateur :** Protection des idées de startup critiques

#### 24. Authentification Multi-Facteurs
- **Priorité :** 🟡 P2
- **Estimation :** 5-7 jours
- **Description :**
  - 2FA via authenticator app (TOTP)
  - SMS backup (optionnel)
  - Recovery codes
  - Session management
- **Valeur utilisateur :** Sécuriser les comptes professionnels

---

## 🌈 Vision Long-Terme (v3.0+)

### 🚀 Fonctionnalités Exploratoires

#### 25. AXIOM Marketplace
- Acheter/vendre des templates et workflows personnalisés
- Marketplace de projets validés (similaire à Micro Acquire)

#### 26. Intelligence de Financement
- Matching automatique avec VCs selon le profil du projet
- Prédiction de chances de succès en fundraising

#### 27. Automated MVPs
- Générer du code fonctionnel (Next.js, Supabase) depuis un plan
- Intégration avec Cursor/GitHub Copilot

#### 28. AXIOM Community
- Forum de discussion entre entrepreneurs
- "Ideas Looking for Co-Founders"
- Events virtuels et hackathons

---

## 📅 Timeline Visuelle

```
2025 Q1     [v1.1.0] Quick Wins ████████████
2025 Q2     [v1.2.0] Power User ████████████████
2025 Q3-Q4  [v2.0.0] Cloud & Collab ████████████████████████
2026+       [v3.0+]  Vision ██████████████████████████████
```

---

## 🎯 Métriques de Succès

### v1.1.0
- [ ] 90% des users utilisent la recherche au moins 1x/semaine
- [ ] 50% des projets ont au moins 1 tag
- [ ] Temps de navigation réduit de 30% avec les raccourcis

### v1.2.0
- [ ] 70% des projets actifs utilisent des templates
- [ ] 3+ user stories complétées par projet en moyenne
- [ ] 80% de précision sur les suggestions IA

### v2.0.0
- [ ] 10 000+ utilisateurs actifs mensuels
- [ ] 30% des utilisateurs en mode collaboratif
- [ ] 99.9% uptime du cloud backend

---

## 💬 Contribution & Feedback

Vous avez une idée de fonctionnalité ? Ouvrez une **[GitHub Issue](https://github.com/eurinhashworks/axiom_mind/issues)** avec le tag `feature-request`.

### Process de Priorisation

1. **Community Voting** : Les issues sont votées par la communauté (👍 reactions)
2. **Impact/Effort Matrix** : Évaluation par l'équipe core
3. **User Interviews** : Validation avec 5-10 early adopters
4. **Prototyping** : Spike technique si incertitude

---

## 🔗 Liens Connexes

- [📋 CHANGELOG.md](./CHANGELOG.md) - Historique des versions
- [📘 DOCUMENTATION.md](./DOCUMENTATION.md) - Guide technique
- [🤝 CONTRIBUTING.md](./CONTRIBUTING.md) - Guide de contribution
- [🔌 API.md](./API.md) - Référence API

---

**Dernière révision :** 19 janvier 2025  
**Auteur :** [@eurinhashworks](https://github.com/eurinhashworks)

*Ce roadmap est une vision évolutive. Les priorités peuvent changer selon les retours utilisateurs.*
