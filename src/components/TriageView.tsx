import React, { useState, useEffect, useRef } from 'react';
import { BrainDumpNote, ChatMessage, IdeaNode } from '../types';
import { SendIcon, AxiomIcon } from './icons';
import { chatWithAxiom, generateTriageIntro } from '../services/geminiService';

interface TriageViewProps {
  note: BrainDumpNote;
  updateIdea: (idea: Partial<IdeaNode>) => void;
  completeTriage: () => void;
}

const ChatBubble: React.FC<{ message: ChatMessage; isLoading?: boolean }> = ({ message, isLoading }) => {
  const isAxiom = message.sender === 'axiom';
  return (
    <div className={`flex items-end gap-3 my-4 animate-fadeIn ${isAxiom ? 'justify-start' : 'justify-end'}`}>
      {isAxiom && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-axiom-accent to-axiom-accent-light flex items-center justify-center shrink-0 shadow-glow">
          <AxiomIcon className="w-6 h-6" />
        </div>
      )}
      <div
        className={`max-w-lg p-4 rounded-2xl ${isAxiom
            ? 'card rounded-bl-none'
            : 'bg-gradient-to-r from-axiom-accent to-axiom-accent-hover text-white rounded-br-none shadow-glow'
          }`}
      >
        {isLoading ? (
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-axiom-text-secondary animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-axiom-text-secondary animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 rounded-full bg-axiom-text-secondary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        ) : (
          <div
            className="leading-relaxed"
            dangerouslySetInnerHTML={{ __html: message.text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>') }}
          />
        )}
      </div>
    </div>
  );
};

export const TriageView: React.FC<TriageViewProps> = ({ note, updateIdea, completeTriage }) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentIdea, setCurrentIdea] = useState<Partial<IdeaNode>>({});
  const [isReadyForEvaluation, setIsReadyForEvaluation] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  // Initialisation : Générer le message d'intro basé sur la note
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      initializeChat();
    }
  }, []);

  const initializeChat = async () => {
    setIsLoading(true);
    const intro = await generateTriageIntro(note.content);
    setChatHistory([{ sender: 'axiom', text: intro }]);
    setIsLoading(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSend = async () => {
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage = inputValue.trim();
    setChatHistory(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInputValue('');
    setIsLoading(true);

    // Ajouter un indicateur de chargement
    setChatHistory(prev => [...prev, { sender: 'axiom', text: '...' }]);

    try {
      const { response, extractedData } = await chatWithAxiom(
        userMessage,
        chatHistory,
        currentIdea
      );

      // Mettre à jour les données extraites
      const updatedIdea = { ...currentIdea, ...extractedData };
      setCurrentIdea(updatedIdea);
      updateIdea(extractedData);

      // Remplacer le message de chargement par la vraie réponse
      setChatHistory(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { sender: 'axiom', text: response };
        return updated;
      });

      // Vérifier si on peut passer à l'évaluation
      if (updatedIdea.problem && updatedIdea.targetAudience && updatedIdea.projectName) {
        setIsReadyForEvaluation(true);
        setTimeout(() => {
          setChatHistory(prev => [...prev, {
            sender: 'axiom',
            text: "Parfait ! J'ai tout ce qu'il me faut. ✨ Prêt à évaluer cette idée ?"
          }]);
        }, 1500);

        setTimeout(completeTriage, 4000);
      }

    } catch (error) {
      console.error('Chat error:', error);
      setChatHistory(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          sender: 'axiom',
          text: "Oups, j'ai eu un souci technique. Peux-tu reformuler ?"
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="p-6 text-center glass-strong backdrop-blur-xl border-b border-white/10">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-axiom-accent to-axiom-accent-light bg-clip-text text-transparent">
          Dialogue Socratique
        </h1>
        <p className="text-axiom-text-secondary text-sm mt-1 truncate px-4 max-w-2xl mx-auto">
          {note.content}
        </p>
      </header>

      <main className="flex-grow p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {chatHistory.map((msg, index) => (
            <ChatBubble
              key={index}
              message={msg}
              isLoading={index === chatHistory.length - 1 && msg.text === '...'}
            />
          ))}
        </div>
        <div ref={chatEndRef} />
      </main>

      <footer className="p-4 sticky bottom-0 glass-strong backdrop-blur-xl border-t border-white/10">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="max-w-3xl mx-auto flex items-center gap-3 card p-3 shadow-glow"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder={isReadyForEvaluation ? "En attente..." : "Tapez votre réponse..."}
            className="flex-grow bg-transparent text-axiom-text-primary placeholder-axiom-text-secondary/60 outline-none p-2"
            disabled={isLoading || isReadyForEvaluation}
          />
          <button
            type="submit"
            onClick={handleSend}
            disabled={isLoading || isReadyForEvaluation || !inputValue.trim()}
            className="p-3 bg-gradient-to-r from-axiom-accent to-axiom-accent-hover rounded-xl text-white hover:shadow-glow transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <SendIcon />
          </button>
        </form>
      </footer>
    </div>
  );
};
