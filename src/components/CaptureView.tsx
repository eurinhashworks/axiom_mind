
import React, { useState } from 'react';
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
                animate-fadeIn w-full max-w-2xl p-4 my-2 rounded-lg shadow-md transition-all duration-300
                ${isTisse 
                    ? 'bg-axiom-light border-l-4 border-axiom-accent text-axiom-text-secondary' 
                    : 'bg-axiom-medium border-l-4 border-yellow-400 cursor-pointer hover:bg-axiom-light'
                }
            `}
            onClick={!isTisse ? onClick : undefined}
        >
            <p className="text-axiom-text-primary">{note.content}</p>
            <div className="text-right text-xs mt-2 text-axiom-text-secondary">{note.status}</div>
        </div>
    );
};

export const CaptureView: React.FC<CaptureViewProps> = ({ notes, addNote, startTriage }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addNote(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-axiom-dark">
      <header className="p-4 text-center">
        <h1 className="text-2xl font-bold text-axiom-text-primary">AXIOM</h1>
        <p className="text-axiom-text-secondary">L'Inbox Chaotique: Videz votre cerveau.</p>
      </header>

      <main className="flex-grow p-4 overflow-y-auto flex flex-col items-center">
        {notes.length === 0 ? (
          <div className="flex-grow flex items-center justify-center text-axiom-text-secondary">
            <p>Commencez par capturer une idée...</p>
          </div>
        ) : (
          [...notes].reverse().map(note => (
            <NoteBubble key={note.id} note={note} onClick={() => startTriage(note.id)} />
          ))
        )}
      </main>

      <footer className="p-4 sticky bottom-0 bg-axiom-dark">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex items-center gap-2 bg-axiom-medium p-2 rounded-full shadow-lg">
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
            className="flex-grow bg-transparent text-axiom-text-primary placeholder-axiom-text-secondary resize-none outline-none p-2"
            rows={1}
          />
          <button type="button" className="p-2 text-axiom-text-secondary hover:text-axiom-text-primary transition-colors">
            <MicIcon />
          </button>
          <button type="submit" className="p-3 bg-axiom-accent rounded-full text-white hover:bg-axiom-accent-hover transition-colors shadow-md">
            <SendIcon />
          </button>
        </form>
      </footer>
    </div>
  );
};
