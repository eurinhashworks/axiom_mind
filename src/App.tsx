
import React, { useState, useCallback } from 'react';
import { Stage, BrainDumpNote, IdeaNode, UserStory } from './types';
import { CaptureView } from './components/CaptureView';
import { TriageView } from './components/TriageView';
import { EvaluationView } from './components/EvaluationView';
import { ActionPlanView } from './components/ActionPlanView';
import { GalaxyView } from './components/GalaxyView';
import { generateActionPlan } from './services/geminiService';

const App: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<Stage>(Stage.CAPTURE);
  const [notes, setNotes] = useState<BrainDumpNote[]>([]);
  const [activeIdea, setActiveIdea] = useState<IdeaNode | null>(null);
  const [actionPlan, setActionPlan] = useState<UserStory[]>([]);
  const [completedIdeas, setCompletedIdeas] = useState<IdeaNode[]>([]);

  const addNote = useCallback((content: string) => {
    const newNote: BrainDumpNote = {
      id: `note-${Date.now()}`,
      content,
      status: 'À Tisser',
    };
    setNotes(prev => [newNote, ...prev]);
  }, []);

  const startTriage = useCallback((noteId: string) => {
    const noteToTriage = notes.find(n => n.id === noteId);
    if (noteToTriage) {
      setActiveIdea({
        id: `idea-${Date.now()}`,
        originalNote: noteToTriage.content,
      });
      setCurrentStage(Stage.TRIAGE);
    }
  }, [notes]);
  
  const updateActiveIdea = useCallback((ideaUpdate: Partial<IdeaNode>) => {
    setActiveIdea(prev => prev ? { ...prev, ...ideaUpdate } : null);
  }, []);

  const completeTriage = useCallback(() => {
    setCurrentStage(Stage.EVALUATION);
  }, []);
  
  const completeEvaluation = useCallback(async () => {
    if (activeIdea) {
      const plan = await generateActionPlan(activeIdea);
      setActionPlan(plan);
      setCurrentStage(Stage.ACTION_PLAN);
    }
  }, [activeIdea]);
  
  const toggleStoryCompletion = useCallback((storyId: string) => {
      setActionPlan(prev =>
          prev.map(story =>
              story.id === storyId ? { ...story, completed: !story.completed } : story
          )
      );
  }, []);

  const finishIdea = useCallback(() => {
    if (activeIdea) {
        setCompletedIdeas(prev => [...prev, activeIdea]);
        setNotes(prev => prev.map(n => n.content === activeIdea.originalNote ? {...n, status: 'Tissé'} : n));
        setActiveIdea(null);
        setActionPlan([]);
        setCurrentStage(Stage.CAPTURE);
    }
  }, [activeIdea]);
  
  const showGalaxyView = useCallback(() => {
    if (activeIdea) {
        // "Finish" the current idea before showing the galaxy
        setCompletedIdeas(prev => [...prev, activeIdea]);
        setNotes(prev => prev.map(n => n.content === activeIdea.originalNote ? {...n, status: 'Tissé'} : n));
    }
    setCurrentStage(Stage.GALAXY);
  }, [activeIdea]);

  const renderCurrentStage = () => {
    switch (currentStage) {
      case Stage.CAPTURE:
        return <CaptureView notes={notes} addNote={addNote} startTriage={startTriage} />;
      case Stage.TRIAGE:
        const noteForTriage = notes.find(n => n.content === activeIdea?.originalNote);
        if (!activeIdea || !noteForTriage) {
          setCurrentStage(Stage.CAPTURE); // safety fallback
          return null;
        }
        return <TriageView note={noteForTriage} updateIdea={updateActiveIdea} completeTriage={completeTriage} />;
      case Stage.EVALUATION:
         if (!activeIdea) {
          setCurrentStage(Stage.CAPTURE);
          return null;
        }
        return <EvaluationView idea={activeIdea} updateIdea={updateActiveIdea} completeEvaluation={completeEvaluation} />;
      case Stage.ACTION_PLAN:
        if (!activeIdea) {
          setCurrentStage(Stage.CAPTURE);
          return null;
        }
        return <ActionPlanView idea={activeIdea} actionPlan={actionPlan} toggleStoryCompletion={toggleStoryCompletion} showGalaxyView={showGalaxyView} />;
      case Stage.GALAXY:
        return <GalaxyView ideas={completedIdeas} goBack={finishIdea} />;
      default:
        return <CaptureView notes={notes} addNote={addNote} startTriage={startTriage} />;
    }
  };

  return (
    <div className="h-screen w-screen font-sans">
      {renderCurrentStage()}
    </div>
  );
};

export default App;
