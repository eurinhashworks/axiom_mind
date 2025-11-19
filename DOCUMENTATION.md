# 📚 Documentation Technique AXIOM

## 🎯 Vue d'Ensemble

AXIOM est une application web intelligente qui aide les entrepreneurs et créateurs à structurer, évaluer et planifier leurs idées de produits. L'application utilise l'IA (Google Gemini) pour guider l'utilisateur à travers un processus conversationnel naturel.

## 🏗️ Architecture

### Stack Technique

```
Frontend:
- React 19.2.0
- TypeScript 5.8.2  
- Vite 6.2.0
- Tailwind CSS 3.4.17
- React Router 7.9.6

Backend & Services:
- Firebase Authentication (Google OAuth 2.0)
- Firestore Database (NoSQL)
- Google Generative AI (Gemini 2.0 Flash)

Visualisation:
- D3.js 7.9.0

Persistance:
- Firestore (cloud, principal)
- LocalStorage (browser, fallback & migration)

Monitoring:
- Vercel Speed Insights 1.2.0
```

### Principes de Design

1. **Conversational AI** : L'IA comprend le contexte plutôt que de suivre un script rigide
2. **Progressive Disclosure** : L'interface révèle les informations au fur et à mesure
3. **Cloud-First avec Fallback** : Données cloud sécurisées, LocalStorage en backup
4. **Authentication-Required** : Espace personnel par utilisateur via Google OAuth

---

## 📁 Structure du Projet

```
axiom_mind/
├── src/
│   ├── components/          # Composants React
│   │   ├── CaptureView.tsx      # Vue inbox/capture d'idées
│   │   ├── TriageView.tsx       # Dialogue conversationnel IA
│   │   ├── EvaluationView.tsx   # Évaluation de l'idée
│   │   ├── ActionPlanView.tsx   # Plan d'action MVP
│   │   ├── GalaxyView.tsx       # Visualisation D3.js
│   │   ├── LoginView.tsx        # 🆕 Page de login Google OAuth
│   │   ├── UserMenu.tsx         # 🆕 Menu utilisateur + profil
│   │   ├── ProtectedRoute.tsx   # 🆕 Sécurisation des routes
│   │   └── icons.tsx            # Composants SVG
│   │
│   ├── contexts/            # 🆕 React Contexts
│   │   └── AuthContext.tsx      # Gestion état d'authentification global
│   │
│   ├── services/            # Services externes
│   │   ├── geminiService.ts     # API Google Gemini
│   │   └── firebaseService.ts   # 🆕 Firebase Auth + Firestore
│   │
│   ├── hooks/               # React hooks personnalisés
│   │   ├── useLocalStorage.ts   # Persistance LocalStorage (legacy)
│   │   └── useFirestoreSync.ts  # 🆕 Synchronisation Firestore
│   │
│   ├── utils/               # Utilitaires
│   │   └── exportUtils.ts       # Export Markdown
│   │
│   ├── types.ts             # Types TypeScript
│   ├── App.tsx              # Composant racine
│   ├── index.tsx            # 🆕 Point d'entrée avec routing
│   └── index.css            # Styles globaux
│
├── .agent/workflows/        # 🆕 Workflows d'implémentation
│   └── implement-google-auth.md  # Guide auth Google
│
├── index.html               # Template HTML
├── vite.config.ts          # Configuration Vite
├── tailwind.config.js      # Configuration Tailwind
├── tsconfig.json           # Configuration TypeScript
├── package.json            # Dépendances
├── .env.example            # 🆕 Template variables d'env
├── FIREBASE_SETUP.md       # 🆕 Guide setup Firebase
├── TESTING_GUIDE.md        # 🆕 Guide de test
└── DEMARRAGE_RAPIDE.md     # 🆕 Guide de démarrage
```

---

## 🔄 Flux de Données

### 1. Cycle de Vie d'une Idée

```
┌─────────────┐
│    LOGIN    │ → 🆕 Utilisateur s'authentifie avec Google
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  CAPTURE    │ → Utilisateur crée une note (sync Firestore auto)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  TRIAGE     │ → IA dialogue pour structurer l'idée
└──────┬──────┘    (problème, public, nom du projet)
       │
       ▼
┌─────────────┐
│ EVALUATION  │ → Utilisateur évalue urgence, échelle, passion
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ ACTION_PLAN │ → IA génère les user stories MVP
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  GALAXY     │ → Visualisation de toutes les idées
└─────────────┘
```

### 2. State Management

#### **Authentification (Context Global)**

```typescript
// AuthContext.tsx
const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Firebase onAuthStateChanged
    return onAuthChange((user) => {
      setCurrentUser(user)
      setLoading(false)
    })
  }, [])
  
  return <AuthContext.Provider value={{ currentUser, loading, login, logout }}>
}
```

#### **State Application (App.tsx)**

```typescript
// App.tsx - Source de vérité
const [currentStage, setCurrentStage] = useState<Stage>(Stage.CAPTURE)

// 🆕 Firestore sync au lieu de LocalStorage
const [notes, setNotes] = useFirestoreSync<BrainDumpNote[]>('notes', [])
const [completedIdeas, setCompletedIdeas] = useFirestoreSync<IdeaNode[]>('ideas', [])

const [activeIdea, setActiveIdea] = useState<IdeaNode | null>(null)
const [actionPlan, setActionPlan] = useState<UserStory[]>([])
```

**Flux unidirectionnel :**
```
User Action → Component → App.tsx → State Update → Firestore Sync → Re-render
                                        ↓
                                  (debounce 500ms)
```

### 3. Routing et Protection

```typescript
// index.tsx
<BrowserRouter>
  <AuthProvider>
    <Routes>
      <Route path="/login" element={<LoginView />} />
      <Route path="/*" element={
        <ProtectedRoute>
          <App />  {/* Toutes les vues métier */}
        </ProtectedRoute>
      } />
    </Routes>
  </AuthProvider>
</BrowserRouter>
```

**Flow d'authentification :**
```
1. User accède à l'app
2. ProtectedRoute vérifie currentUser
3. Si non connecté → redirect /login
4. Si connecté → render App
5. Logout → redirect /login automatique
```

---

## 🎨 Composants Principaux

### CaptureView

**Rôle :** Inbox pour capturer rapidement les idées (braindump)

**Features :**
- Input texte + reconnaissance vocale (Web Speech API)
- Liste de notes avec statut (À Tisser / Tissé)
- Persistance automatique

**Props :**
```typescript
interface CaptureViewProps {
  notes: BrainDumpNote[]
  addNote: (content: string) => void
  startTriage: (noteId: string) => void
}
```

---

### TriageView

**Rôle :** Conversation intelligente avec l'IA pour structurer l'idée

**Intelligence :**
- Génération de question contextuelle basée sur la note
- Extraction automatique des données (problème, public, nom)
- Décision autonome de quand passer à l'étape suivante

**Services utilisés :**
```typescript
// Génère l'intro basée sur le braindump
await generateTriageIntro(brainDumpContent)

// Conversation + extraction de données
await chatWithAxiom(userMessage, conversationHistory, currentIdea)
```

---

### EvaluationView

**Rôle :** Évaluer l'idée sur 3 dimensions

**Critères :**
1. **Urgence** (1-10) : Le problème est-il urgent ?
2. **Échelle** (Niche/Moyen/Massif) : Taille du marché
3. **Excitement** (1-10) : Passion de l'entrepreneur

**Calculs automatiques :**
```typescript
opportunityScore = (urgency + scaleToNumber(scale)) / 2
feasibilityScore = excitement
```

---

### ActionPlanView

**Rôle :** Afficher et gérer le plan d'action généré par l'IA

**Features :**
- Liste de user stories cochables
- Barre de progression
- Export Markdown
- Copie presse-papiers

**Export Format :**
```markdown
# [Nom du Projet]

## Informations du Projet
- Problème : ...
- Public : ...
- Urgence : .../10

## Plan d'Action MVP
1. [ ] User story 1
2. [x] User story 2
...
```

---

### GalaxyView

**Rôle :** Visualisation interactive de toutes les idées complétées

**Technologie :** D3.js force simulation

**Interactions :**
- Drag & drop des nœuds
- Zoom & pan
- Collision detection

```typescript
// Force simulation D3
d3.forceSimulation(nodes)
  .force("charge", d3.forceManyBody().strength(-200))
  .force("center", d3.forceCenter(width/2, height/2))
  .force("collide", d3.forceCollide().radius(60))
```

---

## 🤖 Services IA (Gemini)

### Architecture du Service

```typescript
// src/services/geminiService.ts

const ai = new GoogleGenAI({ 
  apiKey: import.meta.env.VITE_GEMINI_API_KEY 
})

// Modèle utilisé
model: 'gemini-2.0-flash-exp'
```

### Fonctions Principales

#### 1. `chatWithAxiom()`

**Purpose :** Conversation contextuelle intelligente

**Input :**
```typescript
userMessage: string                    // Message actuel
conversationHistory: ChatMessage[]     // Historique
currentIdea: Partial<IdeaNode>        // Données déjà collectées
```

**Output :**
```typescript
{
  response: string                     // Réponse naturelle
  extractedData: Partial<IdeaNode>    // Données extraites
}
```

**Prompt System :**
```
Tu es AXIOM, expert en développement de produits.
- Écoute active et inférence intelligente
- Questions ciblées (max 2 à la fois)
- Synthèse rapide (2-3 échanges suffisent)
```

#### 2. `generateActionPlan()`

**Purpose :** Générer user stories MVP

**Input :**
```typescript
idea: IdeaNode  // Idée complète
```

**Output :**
```typescript
UserStory[]  // 5-8 user stories actionnables
```

**Contraintes :**
- Format: "En tant que [public], je veux [action] pour [bénéfice]"
- Priorisées par importance
- Réalisables en 1-3 jours max

#### 3. `generateTriageIntro()`

**Purpose :** Première question contextuelle

**Input :**
```typescript
brainDumpContent: string
```

**Output :**
```typescript
string  // Question d'intro pertinente
```

**Exemple :**
```
Input: "App pour trouver restaurants halal"
Output: "Super idée ! Quelle est la principale difficulté 
         que rencontrent les gens aujourd'hui pour 
         trouver ces restaurants ?"
```

---

## 💾 Persistance & Synchronisation

### 1. useFirestoreSync Hook (Nouveau Standard)

Remplace `useLocalStorage` pour les données principales.

**Features :**
- **Cloud Sync** : Sauvegarde automatique dans Firestore `users/{uid}/data/{collection}`
- **Debounce** : Écritures groupées toutes les 500ms pour économiser les quotas
- **Migration Auto** : Au premier login, importe les données du LocalStorage vers Firestore
- **Offline Fallback** : Lit le LocalStorage si le réseau échoue (lecture seule)

```typescript
const [data, setData] = useFirestoreSync<T>('collection_name', initialValue)
### Scripts Disponibles

```bash
# Développement (hot reload)
pnpm dev

# Build production
pnpm build

# Preview build
pnpm preview
```

### Structure d'Import

```typescript
// Chemins relatifs
import { Stage } from './types'
import { CaptureView } from './components/CaptureView'

// Alias @ (pointe vers ./src)
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { exportActionPlan } from '@/utils/exportUtils'
```

---

## 🧪 Testing Guidelines

### Tests Manuels Recommandés

1. **Persistance**
   - Créer des notes → F5 → Vérifier présence
   - Compléter une idée → F5 → Vérifier galaxie

2. **IA Conversationnelle**
   - Tester avec idées vagues vs. précises
   - Vérifier extraction contextuelle
   - S'assurer de max 2-3 échanges

3. **Export**
   - Vérifier format Markdown
   - Tester copie clipboard
   - Valider noms de fichiers

4. **Reconnaissance Vocale**
   - Tester sur Chrome/Edge (supporté)
   - Tester sur Firefox (non supporté → alert)
   - Vérifier permission micro

---

## 📦 Build & Déploiement

### Build Production

```bash
pnpm build

# Output:
# dist/
# ├── index.html
# ├── assets/
# │   ├── index-[hash].css
# │   └── index-[hash].js
```

### Déploiement

**Compatibilité :**
- ✅ Vercel
- ✅ Netlify  
- ✅ GitHub Pages
- ✅ Cloudflare Pages

**Configuration requise :**
1. Variables d'env : `VITE_GEMINI_API_KEY`
2. Build command : `pnpm build`
3. Output directory : `dist`

---

## 🐛 Debugging

### Console Logs Utiles

```typescript
// geminiService.ts
console.log('Chat response:', response)
console.error('Error generating action plan:', error)

// App.tsx  
console.log('Current stage:', currentStage)
console.log('Active idea:', activeIdea)
```

### Sources Communes d'Erreurs

1. **"API Key not found"**
   - Vérifier `.env` existe
   - Vérifier préfixe `VITE_`
   - Redémarrer le serveur dev

2. **"Speech recognition not supported"**
   - Utiliser Chrome/Edge/Safari
   - Vérifier HTTPS (ou localhost)

3. **"Build failed - module not found"**
   - Vérifier imports relatifs
   - `pnpm install` si dépendance manquante

---

## 🤝 Contribution

### Ajouter une Nouvelle Vue

1. Créer `src/components/MyView.tsx`
2. Ajouter enum dans `src/types.ts` :
   ```typescript
   export enum Stage {
     // ... existing
     MY_STAGE,
   }
   ```
3. Ajouter case dans `App.tsx` :
   ```typescript
   case Stage.MY_STAGE:
     return <MyView />
   ```

### Ajouter un Service IA

1. Créer fonction dans `geminiService.ts`
2. Définir prompt system clair
3. Spécifier responseSchema si JSON
4. Ajouter fallback en cas d'erreur

### Standards de Code

- **TypeScript strict** : Pas de `any`
- **Functional components** : Hooks > Classes
- **Export named** : `export const Component` 
- **Props typing** : Toujours typer les props
- **Comments** : JSDoc pour fonctions publiques

---

## 📊 Performance

### Métriques Actuelles

- **Bundle size** : ~500KB (gzipped: ~130KB)
- **First paint** : <1s
- **Interactive** : <2s

### Optimisations Possibles

1. **Code splitting** :
   ```typescript
   const GalaxyView = lazy(() => import('./components/GalaxyView'))
   ```

2. **Lazy load D3** :
   ```typescript
   import('d3').then(d3 => { /* ... */ })
   ```

3. **Debounce auto-save** :
   ```typescript
   const [notes, setNotes] = useLocalStorage('notes', [], { debounce: 500 })
   ```

---

## 📚 Ressources

### Documentation Externe

- [React 19 Docs](https://react.dev/)
- [Gemini API](https://ai.google.dev/docs)
- [D3.js](https://d3js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

### Patterns Utilisés

- **Container/Presentational** : App.tsx (container) + Views (presentational)
- **Custom Hooks** : `useLocalStorage` pour logique réutilisable
- **Render Props** : Pas utilisé, préférence pour composition
- **Context** : Pas nécessaire (props drilling limité)

---

## 🔮 Roadmap

Voir [ROADMAP.md](./ROADMAP.md) pour les features futures.

---

**Maintenu par** : [eurinhashworks](https://github.com/eurinhashworks)  
**Licence** : MIT  
**Version** : 1.0.0
