import { useState } from 'react';
import { Camera, Upload, Image as ImageIcon, X, RotateCw, Download, Save, Settings } from 'lucide-react';

export function DrawingsPage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'manual'>('upload');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [showOutput, setShowOutput] = useState(false);
  const [buildingDescription, setBuildingDescription] = useState('');
  const [dimensions, setDimensions] = useState({ height: '', width: '', length: '' });
  const [buildingType, setBuildingType] = useState('residential');

  const generationSteps = [
    'Analyzing image...',
    'Calculating dimensions...',
    'Generating design...'
  ];

  const mockMaterialList = [
    { item: 'Standards (2m)', quantity: 50, unit: 'pieces' },
    { item: 'Ledgers (2.5m)', quantity: 40, unit: 'pieces' },
    { item: 'Boards', quantity: 30, unit: 'pieces' },
    { item: 'Base plates', quantity: 20, unit: 'pieces' },
    { item: 'Couplers', quantity: 120, unit: 'pieces' },
    { item: 'Guard rails', quantity: 35, unit: 'pieces' },
  ];

  const totalWeight = 2450;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerationStep(0);

    const interval = setInterval(() => {
      setGenerationStep((prev) => {
        if (prev >= 2) {
          clearInterval(interval);
          setIsGenerating(false);
          setShowOutput(true);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
  };

  const handleDownload = (type: string) => {
    console.log(`Download ${type} clicked`);
  };

  return (
    <div className="min-h-screen bg-black pt-24">
      <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1
            className="text-4xl font-bold mb-2"
            style={{
              background: 'linear-gradient(135deg, #A30E15 0%, #780A0F 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            AI Scaffold Designer
          </h1>
          <p className="text-[#e5e5e5]">Generate 2D/3D scaffold designs from photos or descriptions</p>
        </div>

        <div className="neumorphic-card p-8 mb-8">
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all ${
                activeTab === 'upload'
                  ? 'neumorphic-button text-white'
                  : 'text-[#e5e5e5] hover:text-white hover:bg-[#780A0F]'
              }`}
            >
              Upload Photo
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all ${
                activeTab === 'manual'
                  ? 'neumorphic-button text-white'
                  : 'text-[#e5e5e5] hover:text-white hover:bg-[#780A0F]'
              }`}
            >
              Describe Manually
            </button>
          </div>

          {activeTab === 'upload' ? (
            <div>
              <div className="border-2 border-dashed border-[#2d2d2d] rounded-lg p-12 text-center mb-6 hover:border-[#3d3d3d] transition-colors">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 text-[#e5e5e5]" />
                <p className="text-[#e5e5e5] mb-6">Drag photo here or click to upload</p>

                <div className="flex flex-col gap-3 max-w-md mx-auto">
                  <label className="neumorphic-button cursor-pointer flex items-center justify-center gap-2 py-3 px-6">
                    <Camera className="w-5 h-5" />
                    <span>Take Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>

                  <label className="neumorphic-button cursor-pointer flex items-center justify-center gap-2 py-3 px-6">
                    <ImageIcon className="w-5 h-5" />
                    <span>Choose from Gallery</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>

                  <label className="neumorphic-button cursor-pointer flex items-center justify-center gap-2 py-3 px-6">
                    <Upload className="w-5 h-5" />
                    <span>Upload from Computer</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              </div>

              {uploadedImage && (
                <div className="neumorphic-card p-4 relative">
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-6 right-6 neumorphic-button p-2 text-white hover:text-[#A30E15] transition-colors z-10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <img
                    src={uploadedImage}
                    alt="Uploaded building"
                    className="max-w-full max-h-[400px] mx-auto rounded-lg"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-2">Building Description</label>
                <textarea
                  value={buildingDescription}
                  onChange={(e) => setBuildingDescription(e.target.value)}
                  placeholder="Describe the building... e.g., 3-story brick office building, 40ft height, flat roof, street access on two sides"
                  className="w-full h-32 bg-[#0d0d0d] border border-[#2d2d2d] rounded-lg p-4 text-white placeholder-[#666] focus:outline-none focus:border-[#3d3d3d]"
                  style={{
                    boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.5), inset -4px -4px 8px rgba(40, 40, 40, 0.1)'
                  }}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2">Height (meters)</label>
                  <input
                    type="number"
                    value={dimensions.height}
                    onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
                    placeholder="0"
                    className="w-full bg-[#0d0d0d] border border-[#2d2d2d] rounded-lg p-3 text-white placeholder-[#666] focus:outline-none focus:border-[#3d3d3d]"
                    style={{
                      boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.5), inset -4px -4px 8px rgba(40, 40, 40, 0.1)'
                    }}
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Width (meters)</label>
                  <input
                    type="number"
                    value={dimensions.width}
                    onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
                    placeholder="0"
                    className="w-full bg-[#0d0d0d] border border-[#2d2d2d] rounded-lg p-3 text-white placeholder-[#666] focus:outline-none focus:border-[#3d3d3d]"
                    style={{
                      boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.5), inset -4px -4px 8px rgba(40, 40, 40, 0.1)'
                    }}
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Length (meters)</label>
                  <input
                    type="number"
                    value={dimensions.length}
                    onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
                    placeholder="0"
                    className="w-full bg-[#0d0d0d] border border-[#2d2d2d] rounded-lg p-3 text-white placeholder-[#666] focus:outline-none focus:border-[#3d3d3d]"
                    style={{
                      boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.5), inset -4px -4px 8px rgba(40, 40, 40, 0.1)'
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Building Type</label>
                <select
                  value={buildingType}
                  onChange={(e) => setBuildingType(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-[#2d2d2d] rounded-lg p-3 text-white focus:outline-none focus:border-[#3d3d3d]"
                  style={{
                    boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.5), inset -4px -4px 8px rgba(40, 40, 40, 0.1)'
                  }}
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                  <option value="highrise">High-rise</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="neumorphic-button px-12 py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: isGenerating ? undefined : 'linear-gradient(135deg, #A30E15 0%, #780A0F 100%)',
              WebkitBackgroundClip: isGenerating ? undefined : 'text',
              WebkitTextFillColor: isGenerating ? undefined : 'transparent',
              backgroundClip: isGenerating ? undefined : 'text'
            }}
          >
            {isGenerating ? 'Generating...' : 'Generate 2D/3D Scaffold Design'}
          </button>

          {isGenerating && (
            <div className="mt-6">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 border-4 border-[#2d2d2d] border-t-white rounded-full animate-spin"></div>
              </div>
              <p className="text-white font-semibold">{generationSteps[generationStep]}</p>
            </div>
          )}
        </div>

        {showOutput && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="neumorphic-card p-6">
                <h3 className="text-white font-bold text-lg mb-4">2D Elevation View</h3>
                <div className="bg-[#0d0d0d] rounded-lg aspect-[3/2] flex items-center justify-center border border-[#2d2d2d]">
                  <svg viewBox="0 0 300 200" className="w-full h-full p-4">
                    <rect x="50" y="20" width="200" height="160" fill="none" stroke="#A30E15" strokeWidth="2" />
                    <line x1="50" y1="60" x2="250" y2="60" stroke="#A30E15" strokeWidth="1" />
                    <line x1="50" y1="100" x2="250" y2="100" stroke="#A30E15" strokeWidth="1" />
                    <line x1="50" y1="140" x2="250" y2="140" stroke="#A30E15" strokeWidth="1" />
                    <line x1="90" y1="20" x2="90" y2="180" stroke="#A30E15" strokeWidth="1" />
                    <line x1="130" y1="20" x2="130" y2="180" stroke="#A30E15" strokeWidth="1" />
                    <line x1="170" y1="20" x2="170" y2="180" stroke="#A30E15" strokeWidth="1" />
                    <line x1="210" y1="20" x2="210" y2="180" stroke="#A30E15" strokeWidth="1" />
                  </svg>
                </div>
              </div>

              <div className="neumorphic-card p-6">
                <h3 className="text-white font-bold text-lg mb-4">3D Interactive Model</h3>
                <div className="bg-[#0d0d0d] rounded-lg aspect-[3/2] flex items-center justify-center border border-[#2d2d2d] relative">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 perspective-1000">
                      <div className="w-full h-full relative preserve-3d animate-[spin_8s_linear_infinite]">
                        <div className="absolute inset-0 border-2 border-[#A30E15] bg-[#A30E15]/10"></div>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <button className="neumorphic-button p-2 text-[#e5e5e5] hover:text-white">
                        <RotateCw className="w-4 h-4" />
                      </button>
                      <button className="neumorphic-button p-2 text-[#e5e5e5] hover:text-white">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="neumorphic-card p-6">
                <h3 className="text-white font-bold text-lg mb-4">Material List</h3>
                <div className="space-y-3">
                  {mockMaterialList.map((item, index) => (
                    <div key={index} className="flex justify-between items-center pb-2 border-b border-[#2d2d2d]">
                      <div>
                        <p className="text-white font-semibold text-sm">{item.item}</p>
                        <p className="text-[#999] text-xs">{item.unit}</p>
                      </div>
                      <span className="text-white font-bold">{item.quantity}</span>
                    </div>
                  ))}
                  <div className="pt-2 mt-2 border-t-2 border-[#2d2d2d]">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold">Total Weight</span>
                      <span className="text-white font-bold">{totalWeight} kg</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => handleDownload('2D')}
                className="neumorphic-button flex items-center gap-2 px-6 py-3"
              >
                <Download className="w-5 h-5" />
                Download 2D Drawing
              </button>
              <button
                onClick={() => handleDownload('3D')}
                className="neumorphic-button flex items-center gap-2 px-6 py-3"
              >
                <Download className="w-5 h-5" />
                Download 3D Model
              </button>
              <button
                onClick={() => handleDownload('materials')}
                className="neumorphic-button flex items-center gap-2 px-6 py-3"
                style={{
                  background: 'linear-gradient(135deg, #A30E15 0%, #780A0F 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                <Save className="w-5 h-5" style={{ WebkitTextFillColor: 'white' }} />
                <span>Save to Job</span>
              </button>
              <button
                onClick={() => setShowOutput(false)}
                className="neumorphic-button flex items-center gap-2 px-6 py-3 border border-[#2d2d2d]"
              >
                <Settings className="w-5 h-5" />
                Adjust Design
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
