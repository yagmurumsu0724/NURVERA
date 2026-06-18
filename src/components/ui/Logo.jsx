import React from 'react';

export default function Logo({ variant = "primary", className = "" }) {
  // variant: "primary" | "secondary" | "icon" | "monogram"
  
  // The core leaf icon (used across variants)
  const LeafIcon = ({ w = 100, h = 80 }) => (
    <svg width={w} height={h} viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
      {/* Outer Left Leaf */}
      <path d="M50 75 C 10 70, 5 35, 20 20 C 25 40, 35 60, 50 75" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Inner Left Leaf */}
      <path d="M50 75 C 25 65, 20 25, 40 10 C 42 35, 45 55, 50 75" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Inner Right Leaf */}
      <path d="M50 75 C 75 65, 80 25, 60 10 C 58 35, 55 55, 50 75" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Outer Right Leaf */}
      <path d="M50 75 C 90 70, 95 35, 80 20 C 75 40, 65 60, 50 75" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Droplet */}
      <path d="M72 58 C 76 62, 76 68, 72 72 C 68 68, 68 62, 72 58 Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  // Divider Icon
  const Divider = () => (
    <svg width="24" height="12" viewBox="0 0 24 12" fill="currentColor" className="mx-auto my-2">
      <path d="M11.5 1 C11.5 1 5 6 5 10 C5 12 7 12 9 12 C11 12 11.5 10 11.5 8 Z" />
      <path d="M12.5 1 C12.5 1 19 6 19 10 C19 12 17 12 15 12 C13 12 12.5 10 12.5 8 Z" />
    </svg>
  );

  // Render logic based on variant
  if (variant === "icon") {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <LeafIcon w={60} h={48} />
      </div>
    );
  }

  if (variant === "monogram") {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <div className="relative font-serif text-4xl tracking-widest leading-none flex items-center justify-center">
          <span>N</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute -top-1 -right-3">
            <path d="M12 21 C 2 15, 2 5, 12 2 C 22 5, 22 15, 12 21" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    );
  }

  if (variant === "secondary") {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <LeafIcon w={50} h={40} />
        <div className="font-serif text-xl md:text-2xl tracking-[0.2em] leading-none mt-2">
          NURVERA
        </div>
      </div>
    );
  }

  // primary (default)
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <LeafIcon w={70} h={56} />
      
      <div className="font-serif text-3xl md:text-4xl tracking-[0.22em] leading-none mt-3">
        NURVERA
      </div>
      
      <Divider />

      <div className="text-[0.6rem] md:text-[0.65rem] tracking-[0.3em] font-sans font-medium uppercase whitespace-nowrap opacity-90">
        DOĞADAN SİZE, SAF VE ÖZENLE
      </div>
    </div>
  );
}
