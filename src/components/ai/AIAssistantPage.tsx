import { Sparkles, Send } from 'lucide-react';

export function AIAssistantPage() {
  const examplePrompts = [
    "Show me all active jobs",
    "What's due this week?",
    "Create a new project"
  ];

  return (
    <div className="fixed inset-0 pt-24 bg-white flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto h-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col items-center text-center max-w-2xl">
            <div className="neumorphic-icon-box p-8 mb-6">
              <Sparkles className="w-16 h-16 text-[#A30E15]" style={{
                filter: 'drop-shadow(0 0 8px rgba(163, 14, 21, 0.5))'
              }} />
            </div>

            <h1
              className="text-3xl sm:text-4xl font-black mb-3"
              style={{
                background: 'linear-gradient(135deg, #A30E15 0%, #780A0F 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              AI Assistant
            </h1>

            <p className="text-[#666666] text-lg mb-8">
              Ask me anything about your projects
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              {examplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  className="neumorphic-button px-6 py-3 font-medium text-sm hover:scale-105 transition-transform"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#e5e5e5] bg-white">
        <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <div
                className="rounded-2xl px-6 py-4 bg-[#f9f9f9] border border-[#e5e5e5]"
                style={{
                  boxShadow: 'inset 3px 3px 6px rgba(0, 0, 0, 0.08), inset -1px -1px 3px rgba(255, 255, 255, 1)'
                }}
              >
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="w-full bg-transparent text-black placeholder-[#999] outline-none text-base"
                />
              </div>
            </div>

            <button
              className="neumorphic-button p-4 rounded-2xl hover:scale-105 transition-transform flex-shrink-0"
            >
              <Send
                className="w-6 h-6"
                style={{
                  filter: 'drop-shadow(0 0 6px rgba(163, 14, 21, 0.3))'
                }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
