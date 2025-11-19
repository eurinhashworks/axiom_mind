# 📖 API Reference - AXIOM

## Services

### geminiService.ts

Gère toutes les interactions avec l'API Google Generative AI (Gemini).

---

#### `chatWithAxiom()`

Gère la conversation intelligente lors du triage.

**Signature:**
```typescript
async function chatWithAxiom(
  userMessage: string,
  conversationHistory: ChatMessage[],
  currentIdea: Partial<IdeaNode>
): Promise<{
  response: string
  extractedData: Partial<IdeaNode>
}>
```

**Paramètres:**

| Nom | Type | Description |
|-----|------|-------------|
| `userMessage` | `string` | Message actuel de l'utilisateur |
| `conversationHistory` | `ChatMessage[]` | Historique complet du chat |
| `currentIdea` | `Partial<IdeaNode>` | Données déjà extraites |

**Retour:**

```typescript
{
  response: string,           // Réponse conversationnelle naturelle
  extractedData: {            // Nouvelles données extraites
    problem?: string,
    targetAudience?: string,
    projectName?: string
  }
}
```

**Exemple:**

```typescript
const { response, extractedData } = await chatWithAxiom(
  "Je veux aider les gens à manger local",
  chatHistory,
  { problem: "Difficulté à trouver producteurs locaux" }
)

// response: "Génial ! Qui serait votre public cible principal ?"
// extractedData: { targetAudience: "consommateurs urbains" }
```

**Erreurs:**

- Retourne un message par défaut si l'API échoue
- Logs l'erreur dans la console
- Ne lance jamais d'exception

---

#### `generateActionPlan()`

Génère un plan d'action MVP avec user stories.

**Signature:**
```typescript
async function generateActionPlan(
  idea: IdeaNode
): Promise<UserStory[]>
```

**Paramètres:**

| Nom | Type | Description |
|-----|------|-------------|
| `idea` | `IdeaNode` | Idée complète avec tous les champs |

**Retour:**

```typescript
UserStory[] // 5-8 user stories
```

**Type UserStory:**
```typescript
{
  id: string,           // Identifiant unique
  text: string,         // "En tant que [X], je veux [Y] pour [Z]"
  completed: boolean    // État de complétion
}
```

**Exemple:**

```typescript
const plan = await generateActionPlan({
  projectName: "LocalEat",
  problem: "Trouver producteurs locaux",
  targetAudience: "Consommateurs urbains",
  urgency: 8,
  scale: "Moyen",
  excitement: 9
})

// Retourne:
[
  {
    id: "story-1737304800000-0",
    text: "En tant que consommateur, je veux voir les producteurs près de chez moi",
    completed: false
  },
  // ...
]
```

**Fallback:**

En cas d'erreur, retourne 4 user stories génériques basées sur l'idée.

---

#### `generateTriageIntro()`

Génère la première question contextuelle basée sur le braindump.

**Signature:**
```typescript
async function generateTriageIntro(
  brainDumpContent: string
): Promise<string>
```

**Paramètres:**

| Nom | Type | Description |
|-----|------|-------------|
| `brainDumpContent` | `string` | Contenu de la note capturée |

**Retour:**

```typescript
string  // Question d'introduction contextuelle
```

**Exemple:**

```typescript
const intro = await generateTriageIntro(
  "App pour louer des outils entre voisins"
)

// Retourne:
"Intéressant ! Actuellement, comment font les gens quand ils ont besoin d'un outil qu'ils n'ont pas ?"
```

---

#### `evaluateIdea()`

Évalue intelligemment une idée basée sur l'input utilisateur (future implementation).

**Signature:**
```typescript
async function evaluateIdea(
  idea: Partial<IdeaNode>,
  userInput: string
): Promise<{
  urgency?: number
  scale?: 'Niche' | 'Moyen' | 'Massif'
  excitement?: number
}>
```

---

## Hooks

### useLocalStorage.ts

Hook personnalisé pour la persistance automatique.

---

#### `useLocalStorage<T>()`

**Signature:**
```typescript
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>]
```

**Paramètres:**

| Nom | Type | Description |
|-----|------|-------------|
| `key` | `string` | Clé localStorage |
| `initialValue` | `T` | Valeur par défaut |

**Retour:**

Comme `useState`, retourne `[value, setValue]`.

**Fonctionnement:**

1. **Initialisation** : Charge depuis localStorage ou utilise `initialValue`
2. **Auto-save** : Chaque appel à `setValue` sauvegarde dans localStorage
3. **Synchronisation** : Met à jour `localStorage` via `useEffect`

**Exemple:**

```typescript
const [notes, setNotes] = useLocalStorage<BrainDumpNote[]>('axiom_notes', [])

// Ajouter une note (sauvegarde auto)
setNotes(prev => [...prev, newNote])

// Refresh page → notes persiste !
```

**Gestion d'Erreurs:**

```typescript
try {
  // Parse localStorage
} catch (error) {
  console.warn(`Error loading ${key} from localStorage:`, error)
  // Retourne initialValue
}
```

---

#### `clearAllData()`

Efface toutes les données AXIOM.

**Signature:**
```typescript
function clearAllData(): void
```

**Utilisation:**

```typescript
clearAllData()  // Reset complet de l'app
```

---

#### `exportAllData()`

Exporte toutes les données en JSON.

**Signature:**
```typescript
function exportAllData(): void
```

**Comportement:**

- Récupère toutes les clés localStorage
- Crée un JSON avec timestamp
- Télécharge automatiquement `axiom-backup-YYYY-MM-DD.json`

---

#### `importData()`

Importe des données depuis un backup.

**Signature:**
```typescript
function importData(file: File): Promise<boolean>
```

**Exemple:**

```typescript
const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (file) {
    const success = await importData(file)
    if (success) {
      window.location.reload()  // Refresh pour charger les données
    }
  }
}
```

---

## Utils

### exportUtils.ts

Utilitaires pour exporter les plans d'action.

---

#### `generateMarkdownPlan()`

Génère un plan en Markdown formaté.

**Signature:**
```typescript
function generateMarkdownPlan(
  idea: IdeaNode,
  actionPlan: UserStory[]
): string
```

**Retour:**

String Markdown formaté avec :
- En-tête avec titre
- Informations du projet
- Barre de progression (texte)
- User stories (checkbox Markdown)
- Note originale
- Prochaines étapes

---

#### `exportActionPlan()`

Télécharge le plan en fichier `.md`.

**Signature:**
```typescript
function exportActionPlan(
  idea: IdeaNode,
  actionPlan: UserStory[]
): void
```

**Comportement:**

1. Génère le Markdown
2. Crée un Blob
3. Trigger téléchargement automatique
4. Nom: `[project-name]-[timestamp].md`

---

#### `copyPlanToClipboard()`

Copie le plan dans le presse-papiers.

**Signature:**
```typescript
async function copyPlanToClipboard(
  idea: IdeaNode,
  actionPlan: UserStory[]
): Promise<boolean>
```

**Retour:**

- `true` si copie réussie
- `false` si erreur

**Exemple:**

```typescript
const handleCopy = async () => {
  const success = await copyPlanToClipboard(idea, actionPlan)
  if (success) {
    showToast('Copié !')
  }
}
```

---

## Types

### types.ts

Définitions TypeScript du domaine.

---

#### `Stage`

Enum représentant les étapes du flow.

```typescript
export enum Stage {
  CAPTURE,      // Inbox de capture
  TRIAGE,       // Dialogue IA
  EVALUATION,   // Évaluation 3D
  ACTION_PLAN,  // Plan MVP
  GALAXY,       // Visualisation
}
```

---

#### `BrainDumpNote`

Note capturée dans l'inbox.

```typescript
export interface BrainDumpNote {
  id: string                // Unique ID
  content: string           // Texte de la note
  status: NoteStatus        // 'À Tisser' | 'Tissé'
  createdAt: string         // ISO timestamp
  updatedAt?: string        // ISO timestamp (quand tissé)
}
```

---

#### `IdeaNode`

Idée structurée complète.

```typescript
export interface IdeaNode {
  id: string                    // Unique ID
  originalNote: string          // Note initiale
  
  // Données du triage
  projectName?: string
  problem?: string
  targetAudience?: string
  
  // Données de l'évaluation
  urgency?: number              // 1-10
  scale?: 'Niche' | 'Moyen' | 'Massif'
  excitement?: number           // 1-10
  
  // Scores calculés
  opportunityScore?: number     // Auto-calculé
  feasibilityScore?: number     // Auto-calculé
  
  // Timestamps
  createdAt: string             // Quand créée
  completedAt?: string          // Quand complétée
}
```

---

#### `ChatMessage`

Message dans le dialogue de triage.

```typescript
export interface ChatMessage {
  sender: 'user' | 'axiom'
  text: string
}
```

---

#### `UserStory`

Story dans le plan d'action.

```typescript
export interface UserStory {
  id: string
  text: string          // Format: "En tant que X, je veux Y pour Z"
  completed: boolean
}
```

---

## Configuration

### Environment Variables

```typescript
// Définies dans .env
VITE_GEMINI_API_KEY: string  // OBLIGATOIRE

// Accès dans le code
import.meta.env.VITE_GEMINI_API_KEY
```

### Tailwind Config

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: { /* ... */ },
      animations: { /* ... */ }
    }
  }
}
```

### Vite Config

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

---

## Constants

### LocalStorage Keys

```typescript
const STORAGE_KEYS = {
  NOTES: 'axiom_notes',
  COMPLETED_IDEAS: 'axiom_completed_ideas'
}
```

### API Configuration

```typescript
const AI_CONFIG = {
  MODEL: 'gemini-2.0-flash-exp',
  TEMPERATURE: 0.8,           // chatWithAxiom
  TEMPERATURE_PLAN: 0.7,      // generateActionPlan
}
```

---

## Error Handling

Toutes les fonctions async utilisent try/catch :

```typescript
try {
  // API call
} catch (error) {
  console.error('Context:', error)
  // Retourner fallback
}
```

**Jamais de throw non géré** → L'app ne doit jamais crasher.

---

Voir aussi : [DOCUMENTATION.md](./DOCUMENTATION.md) pour le guide complet.
