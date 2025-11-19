import { GoogleGenAI } from "@google/genai";
import { IdeaNode, UserStory, ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

// Prompt système pour AXIOM - définit la personnalité et le rôle
const SYSTEM_PROMPT = `Tu es AXIOM, un assistant IA expert en développement de produits et startups.

**Ton rôle principal :**
- Aider les entrepreneurs à structurer leurs idées de manière conversationnelle et naturelle
- Comprendre rapidement le contexte du projet sans poser trop de questions
- Être direct, concis et actionnable
- Adapter tes réponses au niveau de maturité de l'idée

**Ta méthodologie :**
1. **Écoute active** : Analyse attentivement chaque message pour extraire le maximum d'informations
2. **Inférence intelligente** : Déduis ce que tu peux plutôt que de tout demander
3. **Questions ciblées** : Pose seulement les questions essentielles manquantes
4. **Synthèse rapide** : Avec 2-3 échanges, tu dois avoir assez d'infos pour passer à l'action

**Ton style :**
- Français naturel et conversationnel
- Phrases courtes et percutantes
- Pas de jargon inutile
- Empathique mais efficace

**Informations à extraire (par ordre de priorité) :**
1. Le problème/besoin principal
2. Le public cible
3. La solution envisagée (nom du projet)
4. L'urgence et l'échelle estimées

**IMPORTANT :** Ne pose jamais plus de 2 questions à la fois. Privilégie la compréhension contextuelle.`;

// Chat intelligent pour le Triage
export async function chatWithAxiom(
  userMessage: string,
  conversationHistory: ChatMessage[],
  currentIdea: Partial<IdeaNode>
): Promise<{ response: string; extractedData: Partial<IdeaNode> }> {
  try {
    // Construire le contexte de la conversation
    const historyText = conversationHistory
      .map(msg => `${msg.sender === 'user' ? 'Utilisateur' : 'AXIOM'}: ${msg.text}`)
      .join('\n');

    const contextAnalysis = `
Informations déjà collectées sur le projet :
${currentIdea.problem ? `- Problème: ${currentIdea.problem}` : ''}
${currentIdea.targetAudience ? `- Public cible: ${currentIdea.targetAudience}` : ''}
${currentIdea.projectName ? `- Nom du projet: ${currentIdea.projectName}` : ''}

Historique de conversation :
${historyText}

Nouveau message utilisateur : "${userMessage}"

**Ta mission maintenant :**
1. Analyse ce nouveau message et EXTRAIS toutes les informations pertinentes (problème, public cible, nom, etc.)
2. Identifie ce qui manque encore pour avoir une vision complète
3. Réponds de manière conversationnelle en faisant avancer la discussion
4. Si tu as assez d'infos (problème + public cible + nom), propose de passer à l'évaluation

Réponds en JSON avec :
{
  "response": "Ta réponse naturelle à l'utilisateur",
  "extracted_problem": "Le problème identifié (ou null)",
  "extracted_target_audience": "Le public cible identifié (ou null)",
  "extracted_project_name": "Le nom du projet (ou null)",
  "is_ready_for_evaluation": true/false,
  "confidence": "high/medium/low"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'Je comprends parfaitement mon rôle. Je suis AXIOM, et je vais aider à structurer cette idée de manière fluide et intelligente.' }] },
        { role: 'user', parts: [{ text: contextAnalysis }] }
      ],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.8, // Un peu de créativité mais pas trop
      }
    });

    const parsed = JSON.parse(response.text);

    // Extraire les données structurées
    const extractedData: Partial<IdeaNode> = {};
    if (parsed.extracted_problem) extractedData.problem = parsed.extracted_problem;
    if (parsed.extracted_target_audience) extractedData.targetAudience = parsed.extracted_target_audience;
    if (parsed.extracted_project_name) extractedData.projectName = parsed.extracted_project_name;

    return {
      response: parsed.response,
      extractedData
    };

  } catch (error) {
    console.error('Error in chatWithAxiom:', error);
    return {
      response: "Hmm, j'ai eu un petit bug. Pouvez-vous reformuler ?",
      extractedData: {}
    };
  }
}

// Évaluation intelligente avec chat
export async function evaluateIdea(
  idea: Partial<IdeaNode>,
  userInput: string
): Promise<{ urgency?: number; scale?: 'Niche' | 'Moyen' | 'Massif'; excitement?: number }> {
  try {
    const prompt = `
En tant qu'AXIOM, analyse cette réponse utilisateur pour extraire son évaluation du projet.

Projet :
- Nom: ${idea.projectName}
- Problème: ${idea.problem}
- Public: ${idea.targetAudience}

Réponse utilisateur : "${userInput}"

Extrais de manière intelligente :
1. L'urgence perçue (1-10) : À quel point le problème est urgent pour le public cible ?
2. L'échelle du marché : "Niche", "Moyen" ou "Massif"
3. L'enthousiasme de l'utilisateur (1-10) : À quel point il est excité par cette idée ?

Si l'info n'est pas explicite, INFÈRE-LA du contexte et du ton.

Réponds en JSON :
{
  "urgency": number (1-10),
  "scale": "Niche" | "Moyen" | "Massif",
  "excitement": number (1-10),
  "reasoning": "Brève explication de ton inference"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text);
    return {
      urgency: parsed.urgency,
      scale: parsed.scale,
      excitement: parsed.excitement
    };

  } catch (error) {
    console.error('Error in evaluateIdea:', error);
    return { urgency: 5, scale: 'Moyen', excitement: 5 };
  }
}

// Génération du plan d'action (amélioré)
export async function generateActionPlan(idea: IdeaNode): Promise<UserStory[]> {
  try {
    const prompt = `
Tu es un Product Manager expérimenté. Crée un plan d'action MVP concret et réaliste.

**Projet :**
- Nom : ${idea.projectName}
- Problème : ${idea.problem}
- Public cible : ${idea.targetAudience}
- Urgence : ${idea.urgency}/10
- Échelle : ${idea.scale}
- Passion : ${idea.excitement}/10

**Instructions :**
1. Génère 5-8 user stories CONCRÈTES et ACTIONNABLES
2. Priorise par ordre d'importance (MVP first)
3. Sois spécifique au contexte de CE projet précis
4. Utilise le format : "En tant que [public cible], je veux [action] pour [bénéfice]"
5. Chaque story doit être réalisable en 1-3 jours max

Réponds en JSON :
{
  "user_stories": [
    { "story": "..." },
    { "story": "..." }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const jsonResponse = JSON.parse(response.text);

    if (jsonResponse.user_stories && Array.isArray(jsonResponse.user_stories)) {
      return jsonResponse.user_stories.map((item: { story: string }, index: number) => ({
        id: `story-${Date.now()}-${index}`,
        text: item.story,
        completed: false,
      }));
    } else {
      console.error("Unexpected JSON structure:", jsonResponse);
      return [];
    }
  } catch (error) {
    console.error("Error generating action plan:", error);
    return [
      { id: 'fallback-1', text: `En tant que ${idea.targetAudience}, je veux résoudre ${idea.problem} facilement.`, completed: false },
      { id: 'fallback-2', text: "Créer une landing page simple pour valider l'intérêt.", completed: false },
      { id: 'fallback-3', text: "Implémenter la fonctionnalité core du MVP.", completed: false },
      { id: 'fallback-4', text: "Mettre en place un système de feedback utilisateur.", completed: false },
    ];
  }
}

// Message d'intro intelligent basé sur le braindump
export async function generateTriageIntro(brainDumpContent: string): Promise<string> {
  try {
    const prompt = `
L'utilisateur vient de dumper cette idée : "${brainDumpContent}"

En tant qu'AXIOM, génère UNE phrase d'intro accueillante qui :
1. Montre que tu as LU et COMPRIS l'idée
2. Pose LA question la plus pertinente pour avancer
3. Sois naturel et conversationnel

Retourne JUSTE la phrase, sans JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
      config: {
        temperature: 0.9,
      }
    });

    return response.text.trim();
  } catch (error) {
    console.error('Error generating intro:', error);
    return "Intéressant ! Pour commencer, quel est le problème principal que tu veux résoudre ?";
  }
}
