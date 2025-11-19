
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
      className={`card-hover p-5 my-3 cursor-pointer group ${story.completed ? 'opacity-60' : ''}`}
      onClick={onToggle}
    >
      <div className="flex items-start gap-4">
        <div className={`relative flex-shrink-0 w-6 h-6 mt-0.5 rounded-md border-2 transition-all duration-300 ${story.completed
            ? 'bg-axiom-accent border-axiom-accent'
            : 'border-axiom-border group-hover:border-axiom-accent'
          }`}>
          {story.completed && (
            <svg className="w-full h-full text-white p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <p className={`flex-grow text-axiom-text-primary leading-relaxed ${story.completed ? 'line-through text-axiom-text-secondary' : ''}`}>
          {story.text}
        </p>
      </div>
    </div>
  );
};

export const ActionPlanView: React.FC<ActionPlanViewProps> = ({ idea, actionPlan, toggleStoryCompletion, showGalaxyView }) => {
  const completedCount = actionPlan.filter(s => s.completed).length;
  const progress = actionPlan.length > 0 ? (completedCount / actionPlan.length) * 100 : 0;

  return (
    <div className="flex flex-col h-full p-6 md:p-8">
      <header className="mb-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-axiom-accent to-axiom-accent-light bg-clip-text text-transparent text-center">
            La Boussole
          </h1>
          <p className="text-axiom-text-secondary mt-2 text-center">
            Roadmap MVP pour : <span className="text-axiom-accent-light font-semibold">{idea.projectName || 'Nouveau Projet'}</span>
          </p>

          {/* Progress bar */}
          <div className="mt-6 glass rounded-full overflow-hidden h-3">
            <div
              className="h-full bg-gradient-to-r from-axiom-accent to-axiom-accent-light transition-all duration-500 rounded-full shadow-glow"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-axiom-text-secondary text-sm mt-2">
            {completedCount} / {actionPlan.length} complétées ({Math.round(progress)}%)
          </p>
        </div>
      </header>

      <main className="flex-grow max-w-4xl w-full mx-auto overflow-y-auto">
        {actionPlan.length > 0 ? (
          actionPlan.map(story => (
            <UserStoryItem key={story.id} story={story} onToggle={() => toggleStoryCompletion(story.id)} />
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4 animate-pulse">
              <div className="w-16 h-16 mx-auto rounded-full bg-axiom-accent/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-axiom-accent animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <p className="text-axiom-text-secondary">Le plan d'action est en cours de génération...</p>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-8 flex justify-center items-center gap-4 max-w-4xl mx-auto w-full">
        <button className="card-hover py-3 px-6 font-medium hover:scale-105 transition-all duration-200">
          📤 Exporter
        </button>
        <button
          onClick={showGalaxyView}
          className="flex items-center gap-2 bg-gradient-to-r from-axiom-accent to-axiom-accent-hover py-3 px-6 rounded-xl font-medium text-white shadow-glow hover:scale-105 transition-all duration-200"
        >
          <TelescopeIcon className="w-5 h-5" />
          Voir la Galaxie
        </button>
      </footer>
    </div>
  );
};
