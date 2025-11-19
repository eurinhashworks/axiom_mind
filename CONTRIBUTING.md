# 🚀 Guide de Contribution - AXIOM

Merci de votre intérêt pour contribuer à AXIOM ! Ce guide vous aidera à démarrer.

## 📋 Table des Matières

1. [Code of Conduct](#code-of-conduct)
2. [Comment Contribuer](#comment-contribuer)
3. [Setup Développement](#setup-développement)
4. [Standards de Code](#standards-de-code)
5. [Processus de Pull Request](#processus-de-pull-request)
6. [Reporting Bugs](#reporting-bugs)
7. [Proposer des Features](#proposer-des-features)

---

## 🤝 Code of Conduct

- Soyez respectueux et inclusif
- Acceptez les critiques constructives
- Focalisez sur ce qui est meilleur pour la communauté
- Montrez de l'empathie envers les autres membres

---

## 🛠️ Comment Contribuer

### Types de Contributions

1. **🐛 Bug Fixes** : Corriger des bugs existants
2. **✨ Nouvelles Features** : Ajouter des fonctionnalités
3. **📝 Documentation** : Améliorer la documentation
4. **🎨 UI/UX** : Améliorer le design
5. **⚡ Performance** : Optimisations
6. **🧪 Tests** : Ajouter des tests

---

## 💻 Setup Développement

### Prérequis

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Git
- Un éditeur (VS Code recommandé)

### Installation

```bash
# 1. Fork le repo sur GitHub
# 2. Clone votre fork
git clone https://github.com/VOTRE_USERNAME/axiom_mind.git
cd axiom_mind

# 3. Installer les dépendances
pnpm install

# 4. Créer .env avec votre clé API
echo "VITE_GEMINI_API_KEY=your_key_here" > .env

# 5. Lancer le serveur de dev
pnpm dev
```

### Structure des Branches

```
main           → Production, toujours stable
develop        → Développement actif
feature/xxx    → Nouvelles features
fix/xxx        → Bug fixes
docs/xxx       → Documentation
```

---

## 📏 Standards de Code

### TypeScript

```typescript
// ✅ BON
interface UserProps {
  name: string
  age: number
}

export const User: React.FC<UserProps> = ({ name, age }) => {
  return <div>{name} - {age}</div>
}

// ❌ MAUVAIS
export const User = (props: any) => {  // Pas de 'any'
  return <div>{props.name}</div>
}
```

### React

```typescript
// ✅ BON - Functional components avec hooks
export const MyComponent: React.FC<Props> = ({ data }) => {
  const [state, setState] = useState(initialValue)
  
  useEffect(() => {
    // side effects
  }, [dependencies])
  
  return <div>...</div>
}

// ❌ MAUVAIS - Class components
class MyComponent extends React.Component {
  // On préfère functional
}
```

### Naming Conventions

```typescript
// Components: PascalCase
export const CaptureView = () => {}

// Functions: camelCase
const handleSubmit = () => {}

// Constants: UPPER_SNAKE_CASE
const API_KEY = import.meta.env.VITE_API_KEY

// Types/Interfaces: PascalCase
interface IdeaNode {}
type NoteStatus = 'À Tisser' | 'Tissé'
```

### Imports

```typescript
// Ordre des imports:
// 1. React
import React, { useState } from 'react'

// 2. Librairies externes
import { GoogleGenAI } from '@google/genai'

// 3. Imports internes (types d'abord)
import { Stage, IdeaNode } from './types'
import { CaptureView } from './components/CaptureView'
import { useLocalStorage } from './hooks/useLocalStorage'
```

### CSS (Tailwind)

```tsx
// ✅ BON - Classes organisées et lisibles
<div className="
  flex items-center justify-between
  p-4 rounded-xl
  bg-axiom-medium hover:bg-axiom-light
  transition-all duration-300
">

// ❌ MAUVAIS - Inline styles
<div style={{ display: 'flex', padding: '16px' }}>

// ❌ MAUVAIS - Classes désorganisées
<div className="p-4 flex bg-axiom-medium rounded-xl items-center transition-all hover:bg-axiom-light duration-300">
```

---

## 🔄 Processus de Pull Request

### 1. Créer une Branche

```bash
# Feature
git checkout -b feature/add-search-functionality

# Fix
git checkout -b fix/export-button-crash

# Docs
git checkout -b docs/update-readme
```

### 2. Faire vos Modifications

- Commitez souvent avec des messages clairs
- Suivez les standards de code
- Testez vos modifications

### 3. Commits

Format de commit messages :

```
<type>(<scope>): <message>

# Types:
feat:     Nouvelle feature
fix:      Bug fix
docs:     Documentation
style:    Formatting
refactor: Code refactoring
perf:     Performance
test:     Tests
chore:    Maintenance

# Exemples:
feat(triage): add voice recognition support
fix(export): correct markdown formatting
docs(readme): update installation instructions
```

### 4. Push & PR

```bash
# Push votre branche
git push origin feature/your-feature-name

# Créer une PR sur GitHub avec:
# - Description claire
# - Screenshots si UI/UX
# - Liste de changements
# - Mention des issues résolues (Fixes #123)
```

### 5. Template de PR

```markdown
## Description
Brève description des changements

## Type de Changement
- [ ] Bug fix
- [ ] Nouvelle feature
- [ ] Breaking change
- [ ] Documentation

## Checklist
- [ ] Mon code suit les standards du projet
- [ ] J'ai testé mes changements
- [ ] J'ai mis à jour la documentation
- [ ] Mes commits sont bien formatés

## Screenshots (si applicable)
[Ajoutez des screenshots]

## Issues Liées
Fixes #123
```

---

## 🐛 Reporting Bugs

### Template de Bug Report

```markdown
**Description**
Description claire du bug

**To Reproduce**
1. Aller à '...'
2. Cliquer sur '...'
3. Voir l'erreur

**Expected Behavior**
Ce qui devrait se passer

**Screenshots**
Si applicable

**Environment:**
- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Version: [e.g. 1.0.0]

**Additional Context**
Tout autre contexte utile
```

### Où Reporter

1. Vérifier si le bug existe déjà dans [Issues](https://github.com/eurinhashworks/axiom_mind/issues)
2. Si non, créer une nouvelle issue avec le template
3. Ajouter le label `bug`

---

## ✨ Proposer des Features

### Template de Feature Request

```markdown
**Is your feature request related to a problem?**
Description du problème

**Describe the solution you'd like**
Solution proposée

**Describe alternatives you've considered**
Alternatives considérées

**Additional context**
Screenshots, mockups, etc.
```

### Processus

1. Discuter d'abord dans [Discussions](https://github.com/eurinhashworks/axiom_mind/discussions)
2. Si approuvé, créer une issue avec label `enhancement`
3. Attendre validation avant de commencer à coder

---

## 🧪 Tests

### Tests Manuels Requis

Avant de soumettre une PR, testez :

1. **Persistance**
   ```bash
   # Créer des notes → F5 → Vérifier
   ```

2. **Flow complet**
   ```bash
   # Capture → Triage → Evaluation → Plan → Galaxy
   ```

3. **Export**
   ```bash
   # Export Markdown + Copie clipboard
   ```

4. **Vocal (si modifié)**
   ```bash
   # Tester reconnaissance vocale
   ```

### Tests Automatisés (Future)

```bash
# Quand implémentés
pnpm test
pnpm test:coverage
```

---

## 📚 Ressources Utiles

- [React Best Practices](https://react.dev/learn)
- [TypeScript Guide](https://www.typescriptlang.org/docs/)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## 🎁 Premiers Contributeurs

### Good First Issues

Cherchez les issues avec le label `good first issue` :
- Petits bugs faciles
- Améliorations UI mineures
- Corrections de typos dans la doc

### Domaines de Contribution

1. **Frontend** : React, TypeScript, Tailwind
2. **IA** : Prompts Gemini, extraction de données
3. **UI/UX** : Design, animations, ergonomie
4. **Docs** : Tutoriels, guides, traductions
5. **DevOps** : CI/CD, tests, optimisations

---

## 💬 Communication

- **GitHub Issues** : Bugs, features
- **GitHub Discussions** : Questions, idées
- **Pull Requests** : Code reviews

---

## 🌟 Reconnaissance

Tous les contributeurs sont ajoutés au README avec :
- Leur GitHub
- Type de contribution
- Remerciements publics

---

## ❓ Questions ?

Besoin d'aide ? 
- Ouvrez une [Discussion](https://github.com/eurinhashworks/axiom_mind/discussions)
- Mentionnez @eurinhashworks dans une issue

**Merci d'aider à améliorer AXIOM ! 🚀**
