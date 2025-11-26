import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Wrench, Image as ImageIcon } from 'lucide-react';
import Resizer from './tools/Resizer';

function Layout({ children }) {
  const location = useLocation();

  const tools = [
    { path: '/', name: 'Resizer', icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Wrench size={20} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">DevTools</span>
        </div>

        <nav className="p-4 space-y-2 flex-1">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = location.pathname === tool.path;
            return (
              <Link
                key={tool.path}
                to={tool.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
              >
                <Icon size={18} />
                <span className="font-medium">{tool.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <a href="/" className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-2 transition-colors">
            &larr; Back to Main Site
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter basename="/tools">
      <Layout>
        <Routes>
          <Route path="/" element={<Resizer />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
