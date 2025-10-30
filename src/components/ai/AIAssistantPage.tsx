import { Sparkles, Send } from 'lucide-react';

export function AIAssistantPage() {
  const examplePrompts = [
    "Show me all active jobs",
    "What's due this week?",
    "Create a new project"
  ];

  return (
    <div className="fixed inset-0 pt-24 bg-black flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto h-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col items-center text-center max-w-2xl">
            <div className="neumorphic-icon-box p-8 mb-6">
              <Sparkles className="w-16 h-16 text-white" style={{
                filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))'
              }} />
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
              AI Assistant
            </h1>

            <p className="text-[#e5e5e5] text-lg mb-8">
              Ask me anything about your projects
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              {examplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  className="neumorphic-button px-6 py-3 text-white font-medium text-sm hover:scale-105 transition-transform"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#2d2d2d] bg-black">
        <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <div
                className="rounded-2xl px-6 py-4 bg-[#1a1a1a] border border-[#2d2d2d]"
                style={{
                  boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.5), inset -4px -4px 8px rgba(40, 40, 40, 0.1)'
                }}
              >
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="w-full bg-transparent text-white placeholder-[#666] outline-none text-base"
                />
              </div>
            </div>

            <button
              className="neumorphic-button p-4 rounded-2xl text-white hover:scale-105 transition-transform flex-shrink-0"
            >
              <Send
                className="w-6 h-6"
                style={{
                  filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.2))'
                }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
