import { IdeaNode, UserStory } from '../types';

/**
 * Génère un plan d'action en format Markdown
 */
export function generateMarkdownPlan(idea: IdeaNode, actionPlan: UserStory[]): string {
    const completedCount = actionPlan.filter(s => s.completed).length;
    const progress = actionPlan.length > 0 ? Math.round((completedCount / actionPlan.length) * 100) : 0;

    const markdown = `# ${idea.projectName || 'Projet Sans Nom'}

**Généré par AXIOM** • ${new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}

---

## 📋 Informations du Projet

- **Problème à résoudre :** ${idea.problem || 'Non défini'}
- **Public cible :** ${idea.targetAudience || 'Non défini'}
- **Urgence :** ${idea.urgency || 'N/A'}/10
- **Échelle du marché :** ${idea.scale || 'Non défini'}
- **Niveau d'enthousiasme :** ${idea.excitement || 'N/A'}/10

${idea.opportunityScore ? `- **Score d'opportunité :** ${idea.opportunityScore}/10` : ''}
${idea.feasibilityScore ? `- **Score de faisabilité :** ${idea.feasibilityScore}/10` : ''}

---

## 🎯 Plan d'Action MVP

**Progression :** ${completedCount}/${actionPlan.length} (${progress}%)

${actionPlan.map((story, index) =>
        `${index + 1}. ${story.completed ? '[x]' : '[ ]'} ${story.text}`
    ).join('\n')}

---

## 📝 Note Originale

> ${idea.originalNote}

---

## 🔗 Prochaines Étapes

1. Valider chaque user story avec des utilisateurs potentiels
2. Prioriser les features par impact/effort
3. Commencer le développement du MVP
4. Itérer basé sur les feedbacks

---

*Créé avec ❤️ par [AXIOM](https://github.com/eurinhashworks/axiom_mind)*
`;

    return markdown;
}

/**
 * Télécharge un fichier texte
 */
export function downloadFile(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Exporte le plan d'action en Markdown
 */
export function exportActionPlan(idea: IdeaNode, actionPlan: UserStory[]) {
    const markdown = generateMarkdownPlan(idea, actionPlan);
    const filename = `${idea.projectName?.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'plan'}-${Date.now()}.md`;
    downloadFile(markdown, filename);
}

/**
 * Copie le plan dans le clipboard
 */
export async function copyPlanToClipboard(idea: IdeaNode, actionPlan: UserStory[]): Promise<boolean> {
    try {
        const markdown = generateMarkdownPlan(idea, actionPlan);
        await navigator.clipboard.writeText(markdown);
        return true;
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
}
