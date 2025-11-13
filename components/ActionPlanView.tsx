
import React from 'react';
import { UserStory, IdeaNode } from '../types';
import { TelescopeIcon } from './icons';

interface ActionPlanViewProps {
  idea: IdeaNode;
  actionPlan: UserStory[];
  toggleStoryCompletion: (storyId: string) => void;
  showGalaxyView: () => void;
}

const UserStoryItem: React.FC<{ story: UserStory; onToggle: () => void; }> = ({ story, onToggle }) => {
    return (
        <div 
            className={`flex items-start gap-4 p-4 my-2 rounded-lg transition-colors duration-300 animate-fadeIn ${story.completed ? 'bg-axiom-light text-axiom-text-secondary' : 'bg-axiom-medium'}`}
        >
            <input 
                type="checkbox" 
                checked={story.completed}
                onChange={onToggle}
                className="mt-1 form-checkbox h-5 w-5 text-axiom-accent bg-axiom-light border-axiom-light rounded focus:ring-axiom-accent"
            />
            <label className={`flex-grow cursor-pointer ${story.completed ? 'line-through' : ''}`}>
                {story.text}
            </label>
        </div>
    );
};

export const ActionPlanView: React.FC<ActionPlanViewProps> = ({ idea, actionPlan, toggleStoryCompletion, showGalaxyView }) => {
  return (
    <div className="flex flex-col h-full bg-axiom-dark p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-axiom-text-primary">La Boussole</h1>
        <p className="text-axiom-text-secondary mt-1">Roadmap MVP pour : <span className="text-axiom-accent font-semibold">{idea.projectName || 'Nouveau Projet'}</span></p>
      </header>
      
      <main className="flex-grow max-w-3xl w-full mx-auto overflow-y-auto">
        {actionPlan.length > 0 ? (
          actionPlan.map(story => (
            <UserStoryItem key={story.id} story={story} onToggle={() => toggleStoryCompletion(story.id)} />
          ))
        ) : (
          <div className="text-center text-axiom-text-secondary py-16">
            <p>Le plan d'action est en cours de construction...</p>
          </div>
        )}
      </main>

      <footer className="mt-8 flex justify-center items-center gap-4">
        <button className="bg-axiom-medium py-2 px-4 rounded-lg hover:bg-axiom-light transition-colors">Exporter</button>
        <button onClick={showGalaxyView} className="flex items-center gap-2 bg-axiom-medium py-2 px-4 rounded-lg hover:bg-axiom-light transition-colors">
            <TelescopeIcon className="w-5 h-5" />
            Zoom arrière
        </button>
      </footer>
    </div>
  );
};
