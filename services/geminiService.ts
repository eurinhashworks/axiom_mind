import { GoogleGenAI, Type } from "@google/genai";
import { IdeaNode, UserStory } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateActionPlan(idea: IdeaNode): Promise<UserStory[]> {
  try {
    const prompt = `
      Basé sur l'idée structurée suivante, générez une feuille de route simple et actionnable pour un MVP (Produit Minimum Viable).
      La sortie doit être un tableau JSON de "user stories" (récits utilisateurs).
      Chaque "user story" doit être en français et représenter une fonctionnalité essentielle pour le MVP.
      Le style doit être concis et direct.
      Détails de l'idée :
      - Nom du Projet : ${idea.projectName}
      - Problème à résoudre : ${idea.problem}
      - Public Cible : ${idea.targetAudience}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            user_stories: {
              type: Type.ARRAY,
              description: "Une liste de récits utilisateurs pour le MVP.",
              items: {
                type: Type.OBJECT,
                properties: {
                  story: {
                    type: Type.STRING,
                    description: "Le texte du récit utilisateur, ex: 'En tant qu'utilisateur, je souhaite...'",
                  },
                },
              },
            },
          },
        },
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
    // Return a fallback plan on error
    return [
      { id: 'fallback-1', text: "Définir le flux principal d'inscription et de connexion des utilisateurs.", completed: false },
      { id: 'fallback-2', text: "Implémenter la fonctionnalité principale décrite dans l'idée.", completed: false },
      { id: 'fallback-3', text: "Mettre en place un tableau de bord de base pour afficher les informations clés.", completed: false },
    ];
  }
}
