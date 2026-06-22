import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Accordion({ title, content, isOpen: initialIsOpen = false }) {
  const [isOpen, setIsOpen] = useState(initialIsOpen);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex w-full items-center justify-between text-left focus:outline-none group"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="font-serif text-lg text-nurvera-text group-hover:text-nurvera-olive transition-colors">
          {title}
        </span>
        <ChevronDown
          className={`text-nurvera-olive transition-transform duration-300 ml-4 flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
          size={20}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="text-nurvera-text/80 leading-relaxed text-[15px] pb-2">
          {content}
        </div>
      </div>
    </div>
  );
}
