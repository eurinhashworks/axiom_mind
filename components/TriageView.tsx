
import React, { useState, useEffect, useRef } from 'react';
import { BrainDumpNote, ChatMessage, IdeaNode } from '../types';
import { SendIcon, AxiomIcon } from './icons';

interface TriageViewProps {
  note: BrainDumpNote;
  updateIdea: (idea: Partial<IdeaNode>) => void;
  completeTriage: () => void;
}

const triageQuestions = [
  { key: 'problem', question: "Intéressant. J'ai lu votre note. Pour commencer, quel est le **problème principal** que vous essayez de résoudre ici ?" },
  { key: 'targetAudience', question: "Compris. Et qui est **la personne** qui a le plus ce problème ?" },
  { key: 'projectName', question: "Parfait. Quel nom de projet ou de solution envisagez-vous pour cette idée ?" },
];

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isAxiom = message.sender === 'axiom';
    return (
        <div className={`flex items-end gap-2 my-4 animate-fadeIn ${isAxiom ? 'justify-start' : 'justify-end'}`}>
            {isAxiom && <div className="w-8 h-8 rounded-full bg-axiom-light flex items-center justify-center shrink-0"><AxiomIcon className="w-6 h-6" /></div>}
            <div
                className={`max-w-lg p-3 rounded-lg ${isAxiom ? 'bg-axiom-light rounded-bl-none' : 'bg-axiom-accent text-white rounded-br-none'}`}
                dangerouslySetInnerHTML={{ __html: message.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
            />
        </div>
    );
};

export const TriageView: React.FC<TriageViewProps> = ({ note, updateIdea, completeTriage }) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentStep < triageQuestions.length) {
      const currentQuestion = triageQuestions[currentStep].question;
      setChatHistory(prev => [...prev, { sender: 'axiom', text: currentQuestion }]);
    } else {
      setChatHistory(prev => [...prev, { sender: 'axiom', text: "Excellent. Nous avons assez d'informations pour passer à l'évaluation. Prêt ?" }]);
      setTimeout(completeTriage, 2000);
    }
  }, [currentStep, completeTriage]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSend = () => {
    if (inputValue.trim() === '' || currentStep >= triageQuestions.length) return;

    const userAnswer = inputValue.trim();
    setChatHistory(prev => [...prev, { sender: 'user', text: userAnswer }]);
    
    const { key } = triageQuestions[currentStep];
    updateIdea({ [key]: userAnswer });

    setInputValue('');
    setCurrentStep(prev => prev + 1);
  };

  return (
    <div className="flex flex-col h-full bg-axiom-dark">
        <header className="p-4 text-center sticky top-0 bg-axiom-dark z-10">
            <h1 className="text-xl font-bold text-axiom-text-primary">Dialogue Socratique</h1>
            <p className="text-axiom-text-secondary text-sm truncate px-4">{note.content}</p>
        </header>

        <main className="flex-grow p-4 overflow-y-auto">
            {chatHistory.map((msg, index) => (
                <ChatBubble key={index} message={msg} />
            ))}
            <div ref={chatEndRef} />
        </main>

        <footer className="p-4 sticky bottom-0 bg-axiom-dark">
            <div className="max-w-3xl mx-auto flex items-center gap-2 bg-axiom-medium p-2 rounded-full shadow-lg">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                    placeholder="Répondez ici..."
                    className="flex-grow bg-transparent text-axiom-text-primary placeholder-axiom-text-secondary outline-none p-2"
                    disabled={currentStep >= triageQuestions.length}
                />
                <button
                    onClick={handleSend}
                    disabled={currentStep >= triageQuestions.length}
                    className="p-3 bg-axiom-accent rounded-full text-white hover:bg-axiom-accent-hover transition-colors shadow-md disabled:bg-axiom-light disabled:cursor-not-allowed"
                >
                    <SendIcon />
                </button>
            </div>
        </footer>
    </div>
  );
};
