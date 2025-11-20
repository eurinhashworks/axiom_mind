
import React, { useState } from 'react';
import { IdeaNode } from '../types';
import { ArrowRightIcon } from './icons';
import { UserMenu } from './UserMenu';

interface EvaluationViewProps {
  idea: IdeaNode;
  updateIdea: (idea: Partial<IdeaNode>) => void;
  completeEvaluation: () => void;
}

const evaluationSteps = [
  { key: 'urgency', title: "Évaluons l'Urgence 🚨", description: "Les gens ont-ils besoin de ça *maintenant* ?", type: 'slider', min: 1, max: 10 },
  { key: 'scale', title: "Parlons de l'Échelle 🌍", description: "Quelle est la taille de ce marché ?", type: 'buttons', options: ['Niche', 'Moyen', 'Massif'] },
  { key: 'excitement', title: "Votre Passion 🔥", description: "À quel point êtes-vous enthousiaste à l'idée de construire ça ?", type: 'slider', min: 1, max: 10 },
];

export const EvaluationView: React.FC<EvaluationViewProps> = ({ idea, updateIdea, completeEvaluation }) => {
  const [step, setStep] = useState(0);
  const [urgency, setUrgency] = useState(5);
  const [excitement, setExcitement] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);

  const currentStep = evaluationSteps[step];

  const handleNext = () => {
    if (step < evaluationSteps.length) {
      if (currentStep.key === 'urgency') updateIdea({ urgency });
      if (currentStep.key === 'excitement') updateIdea({ excitement });
    }
    setStep(s => s + 1);
  };

  const handleScaleSelect = (scale: 'Niche' | 'Moyen' | 'Massif') => {
    updateIdea({ scale });
    handleNext();
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    await completeEvaluation();
    // setIsGenerating(false) is not needed as the component will unmount
  };

  const renderContent = () => {
    if (step < evaluationSteps.length) {
      return (
        <div className="w-full max-w-md text-center">
          <h2 className="text-3xl font-bold mb-2">{currentStep.title}</h2>
          <p className="text-axiom-text-secondary mb-8">{currentStep.description}</p>
          {currentStep.type === 'slider' && (
            <>
              <input
                type="range"
                min={currentStep.min}
                max={currentStep.max}
                value={currentStep.key === 'urgency' ? urgency : excitement}
                onChange={(e) => currentStep.key === 'urgency' ? setUrgency(Number(e.target.value)) : setExcitement(Number(e.target.value))}
                className="w-full h-2 bg-axiom-light rounded-lg appearance-none cursor-pointer accent-axiom-accent"
              />
              <div className="text-2xl font-bold mt-4 text-axiom-accent">{currentStep.key === 'urgency' ? urgency : excitement}</div>
              <button onClick={handleNext} className="mt-8 bg-axiom-accent text-white font-bold py-3 px-6 rounded-full hover:bg-axiom-accent-hover transition-transform transform hover:scale-105 flex items-center gap-2 mx-auto">
                Suivant <ArrowRightIcon className="w-5 h-5" />
              </button>
            </>
          )}
          {currentStep.type === 'buttons' && (
            <div className="flex justify-center gap-4">
              {(currentStep.options as Array<'Niche' | 'Moyen' | 'Massif'>).map(opt => (
                <button key={opt} onClick={() => handleScaleSelect(opt)} className="bg-axiom-medium py-3 px-6 rounded-lg hover:bg-axiom-light transition-colors text-lg font-semibold">
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    } else {
      const opportunityScore = Math.round(((idea.urgency || 5) + (idea.scale === 'Niche' ? 3 : idea.scale === 'Moyen' ? 6 : 10)) / 2);
      const feasibilityScore = idea.excitement || 5;
      return (
        <div className="w-full max-w-md text-center">
          <h2 className="text-3xl font-bold mb-4">Résultats de l'Évaluation</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-axiom-text-secondary">Score d'Opportunité</h3>
              <div className="w-full bg-axiom-light rounded-full h-4 mt-2">
                <div className="bg-axiom-accent h-4 rounded-full" style={{ width: `${opportunityScore * 10}%` }}></div>
              </div>
              <p className="text-2xl font-bold mt-1 text-axiom-accent">{opportunityScore}/10</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-axiom-text-secondary">Score de Faisabilité</h3>
              <div className="w-full bg-axiom-light rounded-full h-4 mt-2">
                <div className="bg-green-500 h-4 rounded-full" style={{ width: `${feasibilityScore * 10}%` }}></div>
              </div>
              <p className="text-2xl font-bold mt-1 text-green-500">{feasibilityScore}/10</p>
            </div>
          </div>
          <button onClick={handleGeneratePlan} disabled={isGenerating} className="mt-12 bg-axiom-accent text-white font-bold py-4 px-8 rounded-full hover:bg-axiom-accent-hover transition-transform transform hover:scale-105 disabled:bg-axiom-light disabled:cursor-wait">
            {isGenerating ? "Génération du plan..." : "Générer le Plan d'Action"}
          </button>
        </div>
      );
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 bg-axiom-dark animate-popIn relative">
      <div className="absolute top-4 left-4 text-axiom-text-secondary">{step + 1} / {evaluationSteps.length + 1}</div>
      <div className="absolute top-4 right-4">
        <UserMenu />
      </div>
      {renderContent()}
    </div>
  );
};
