import React, { useRef, useEffect } from 'react';
import { ChartPie, Rss, ChartBar, FolderSimple, Clipboard } from 'phosphor-react';

const solution = [
  {
    icon: <ChartPie size={32} />,
    title: "Marketing Teams",
    description: "Whether launching a new product or creating content, TaskFlow helps marketing teams succeed."
  },
  {
    icon: <Rss size={32} />,
    title: "Remote Teams",
    description: "Keep your remote team connected and motivated, no matter where they're located around the world."
  },
  {
    icon: <Clipboard size={32} />,
    title: "Task Management",
    description: "Use TaskFlow management boards and roadmap features to simplify complex projects and processes."
  },
  {
    icon: <FolderSimple size={32} />,
    title: "Startups",
    description: "From hitting revenue goals to managing workflows, small businesses thrive with TaskFlow."
  },
  {
    icon: <ChartBar size={32} />,
    title: "Tracking Performance",
    description: "Tracking a person performance based on true number of tasks and the workload of the task."
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
        <h2 className="text-lg text-black border-b border-black mb-4">Take a page out of these pre-built TaskFlow playbooks designed for all teams</h2>
        <div className="flex justify-center gap-6 mb-6">
          <div className="flex flex-col items-start p-4 bg-gray-100" style={{ width: '350px', height: '145px' }}>
            <div className="flex text-black items-center mb-2">
              {solution[0].icon}
              <h3 className="ml-3 text-lg font-medium text-gray-900">{solution[0].title}</h3>
            </div>
            <p className="text-sm text-black">{solution[0].description}</p>
          </div>
          <div className="flex flex-col items-start p-4 bg-gray-100" style={{ width: '350px', height: '145px' }}>
            <div className="flex text-black items-center mb-2">
              {solution[1].icon}
              <h3 className="ml-3 text-lg font-medium text-gray-900">{solution[1].title}</h3>
            </div>
            <p className="text-sm text-black">{solution[1].description}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solution.slice(2).map((item, index) => (
            <div key={index + 2} className="flex flex-col items-start p-4 bg-gray-100" style={{ width: '350px', height: '145px' }}>
              <div className="flex items-center text-black mb-2">
                {item.icon}
                <h3 className="ml-3 text-lg font-medium text-gray-900">{item.title}</h3>
              </div>
              <p className="text-sm text-black">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Solution;
