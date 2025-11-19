import React, { useState, useRef, useEffect } from 'react';
import { BrainDumpNote } from '../types';
import { MicIcon, SendIcon } from './icons';

interface CaptureViewProps {
  notes: BrainDumpNote[];
  addNote: (content: string) => void;
  startTriage: (noteId: string) => void;
}

const NoteBubble: React.FC<{ note: BrainDumpNote; onClick: () => void; }> = ({ note, onClick }) => {
  const isTisse = note.status === 'Tissé';
  return (
    <div
      className={`
                animate-fadeIn w-full max-w-2xl p-5 my-2 rounded-2xl transition-all duration-300 group
                ${isTisse
          ? 'card border-l-4 border-axiom-success/50 text-axiom-text-secondary'
          : 'card-hover border-l-4 border-axiom-warning cursor-pointer hover:scale-[1.02] hover:-translate-y-1'
        }
            `}
      onClick={!isTisse ? onClick : undefined}
    >
      <p className="text-axiom-text-primary leading-relaxed">{note.content}</p>
      <div className="flex items-center justify-between mt-3">
        <div className={`text-xs font-medium px-3 py-1 rounded-full ${isTisse
            ? 'bg-axiom-success/20 text-axiom-success'
            : 'bg-axiom-warning/20 text-axiom-warning'
          }`}>
          {note.status}
        </div>
        {!isTisse && (
          <span className="text-axiom-text-secondary text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            Cliquer pour tisser →
          </span>
        )}
      </div>
    </div>
  );
};

export const CaptureView: React.FC<CaptureViewProps> = ({ notes, addNote, startTriage }) => {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialiser Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'fr-FR';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');

        setInputValue(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleVoiceRecognition = () => {
    if (!recognitionRef.current) {
      alert('La reconnaissance vocale n\'est pas supportée par votre navigateur. Utilisez Chrome, Edge ou Safari.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addNote(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="p-6 text-center glass-strong backdrop-blur-xl border-b border-white/10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-axiom-accent to-axiom-accent-light bg-clip-text text-transparent">
          AXIOM
        </h1>
        <p className="text-axiom-text-secondary mt-1 text-sm">L'Inbox Chaotique: Videz votre cerveau.</p>
      </header>

      <main className="flex-grow p-6 overflow-y-auto flex flex-col items-center">
        {notes.length === 0 ? (
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-axiom-accent/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-axiom-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="text-axiom-text-secondary">Commencez par capturer une idée...</p>
            </div>
          </div>
        ) : (
          [...notes].reverse().map(note => (
            <NoteBubble key={note.id} note={note} onClick={() => startTriage(note.id)} />
          ))
        )}
      </main>

      <footer className="p-4 sticky bottom-0 glass-strong backdrop-blur-xl border-t border-white/10">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex items-center gap-3 card p-3 shadow-glow">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Écrivez ou parlez..."
            className="flex-grow bg-transparent text-axiom-text-primary placeholder-axiom-text-secondary/60 resize-none outline-none p-2 max-h-32"
            rows={1}
          />
          <button
            type="button"
            onClick={toggleVoiceRecognition}
            className={`p-3 rounded-xl transition-all duration-200 ${isListening
                ? 'bg-red-500/20 text-red-500 animate-pulse'
                : 'text-axiom-text-secondary hover:text-axiom-accent hover:bg-axiom-accent/10'
              }`}
            title={isListening ? 'Arrêter l\'écoute' : 'Activer la reconnaissance vocale'}
          >
            <MicIcon />
          </button>
          <button
            type="submit"
            className="p-3 bg-gradient-to-r from-axiom-accent to-axiom-accent-hover rounded-xl text-white hover:shadow-glow transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!inputValue.trim()}
          >
            <SendIcon />
          </button>
        </form>
      </footer>
    </div>
  );
};
