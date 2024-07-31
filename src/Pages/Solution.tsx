import React, { useRef, useEffect } from 'react';
import { Eye, ShareNetwork, BookOpen, UserPlus, Medal } from 'phosphor-react';

const solution = [
  {
    icon: <Eye size={32} />,
    title: "Views",
    description: "See the progress of your project teammates."
  },
  {
    icon: <ShareNetwork size={32} />,
    title: "Share",
    description: "Share your project using the link."
  },
  {
    icon: <Medal size={32} />,
    title: "Point",
    description: "Get points from completing tasks."
  },
  {
    icon: <UserPlus size={32} />,
    title: "Add Member",
    description: "Add your member into your project."
  },
  {
    icon: <BookOpen size={32} />,
    title: "Report",
    description: "Report your tasks when they are finished."
  }
];

interface SolutionProps {
  isOpen: boolean;
}

function Solution({ isOpen }: SolutionProps) {
  const solutionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (solutionRef.current) {
      if (isOpen) {
        solutionRef.current.style.maxHeight = `${solutionRef.current.scrollHeight}px`;
      } else {
        solutionRef.current.style.maxHeight = '0px';
      }
    }
  }, [isOpen]);

  return (
    <div 
      ref={solutionRef}
      className={`
        absolute top-full left-0 w-full bg-white shadow-lg rounded-b-md overflow-hidden
        transition-all duration-300 ease-in-out
        ${isOpen ? 'opacity-100' : 'opacity-0'}
      `}
      style={{ maxHeight: '0px' }}
    >
      <div className="max-w-7xl mx-auto px-20 sm:px-20 lg:px-20 py-6">
        <h2 className="text-lg text-black border-b border-black mb-4">Explore the features that help your team succeed</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solution.map((solution, index) => (
            <div key={index} className="flex flex-col items-start p-4 bg-gray-100">
              <div className="flex items-center text-black mb-2">
                {solution.icon}
                <h3 className="ml-3 text-lg font-medium text-gray-900">{solution.title}</h3>
              </div>
              <p className="text-sm text-black">{solution.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Solution;
