import { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, X, Eye, Loader2 } from 'lucide-react';
import { uploadDrawing, getDrawings, deleteDrawing, type Drawing } from '../../lib/supabase';

export function DrawingsPage() {
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [viewingImage, setViewingImage] = useState<Drawing | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [userId] = useState<string>('00000000-0000-0000-0000-000000000000');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadDrawings(userId);
  }, [userId]);

  async function loadDrawings(uid: string) {
    setLoading(true);
    const { data, error } = await getDrawings(uid);
    if (data && !error) {
      setDrawings(data);
    }
    setLoading(false);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  }

  function processFiles(files: File[]) {
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic'];
      const maxSize = 10 * 1024 * 1024;
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrls(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  }

  function removeSelectedFile(index: number) {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  }

  async function handleUpload() {
    if (!userId || selectedFiles.length === 0) {
      console.log('[DrawingsPage] Cannot upload: userId or selectedFiles missing', { userId, filesCount: selectedFiles.length });
      return;
    }

    console.log('[DrawingsPage] Starting upload process for', selectedFiles.length, 'files');
    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      console.log(`[DrawingsPage] Uploading file ${i + 1}/${selectedFiles.length}:`, file.name);

      const { data, error } = await uploadDrawing(file, userId, (progress) => {
        const overallProgress = ((i + progress / 100) / selectedFiles.length) * 100;
        console.log(`[DrawingsPage] Progress: ${overallProgress.toFixed(1)}%`);
        setUploadProgress(overallProgress);
      });

      if (error) {
        console.error(`[DrawingsPage] Failed to upload ${file.name}:`, error);
        setUploadError(`Failed to upload ${file.name}: ${error.message}`);
        failCount++;
      } else {
        console.log(`[DrawingsPage] Successfully uploaded ${file.name}:`, data);
        successCount++;
      }
    }

    console.log(`[DrawingsPage] Upload complete. Success: ${successCount}, Failed: ${failCount}`);

    setSelectedFiles([]);
    setPreviewUrls([]);
    setUploading(false);
    setUploadProgress(0);

    console.log('[DrawingsPage] Reloading drawings...');
    await loadDrawings(userId);
  }

  async function handleDelete(drawingId: string) {
    if (!userId) return;

    setDeletingId(drawingId);
    const { error } = await deleteDrawing(drawingId, userId);

    if (!error) {
      setDrawings(prev => prev.filter(d => d.id !== drawingId));
    }

    setDeletingId(null);
    setShowDeleteConfirm(null);
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  return (
    <div className="min-h-screen bg-black pt-24">
      <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Drawings</h1>
          <p className="text-[#e5e5e5]">Upload and manage your construction drawings</p>
        </div>

        <div className="neumorphic-card p-8 mb-8">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragging ? 'border-white bg-[#1a1a1a]' : 'border-[#2d2d2d]'
            }`}
          >
            <Upload className="w-16 h-16 mx-auto mb-4 text-[#e5e5e5]" />
            <p className="text-[#e5e5e5] mb-2 text-lg">
              {isDragging ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-[#999] mb-6">or</p>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="neumorphic-button px-6 py-3 font-semibold text-white"
            >
              Click to Upload
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/heic"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />

            <p className="text-[#666] text-sm mt-4">
              Accepts JPG, PNG, HEIC (max 10MB per file)
            </p>
          </div>

          {selectedFiles.length > 0 && (
            <div className="mt-6">
              <h3 className="text-white font-semibold mb-4">
                Selected Files ({selectedFiles.length})
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative neumorphic-card p-2">
                    <button
                      onClick={() => removeSelectedFile(index)}
                      className="absolute -top-2 -right-2 bg-black border-2 border-[#2d2d2d] rounded-full p-1 text-white hover:text-red-400 transition-colors z-10"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="aspect-square rounded overflow-hidden bg-[#0d0d0d] mb-2">
                      <img
                        src={previewUrls[index]}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <p className="text-white text-xs truncate">{file.name}</p>
                    <p className="text-[#666] text-xs">{formatFileSize(file.size)}</p>
                  </div>
                ))}
              </div>

              {uploadError && (
                <div className="mb-6 p-4 bg-red-900/20 border-2 border-red-500 rounded-lg">
                  <div className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-red-400 font-semibold mb-1">Upload Failed</h4>
                      <p className="text-red-300 text-sm">{uploadError}</p>
                    </div>
                    <button
                      onClick={() => setUploadError(null)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {uploading && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">Uploading...</span>
                    <span className="text-[#e5e5e5]">{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full h-3 bg-[#0d0d0d] rounded-full overflow-hidden border border-[#2d2d2d]">
                    <div
                      className="h-full bg-white transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="neumorphic-button px-8 py-3 font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
                      Uploading...
                    </>
                  ) : (
                    `Upload ${selectedFiles.length} File${selectedFiles.length > 1 ? 's' : ''}`
                  )}
                </button>

                <button
                  onClick={() => {
                    setSelectedFiles([]);
                    setPreviewUrls([]);
                  }}
                  disabled={uploading}
                  className="neumorphic-button px-6 py-3 font-semibold text-[#e5e5e5] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Your Drawings ({drawings.length})
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </div>
        ) : drawings.length === 0 ? (
          <div className="neumorphic-card p-12 text-center">
            <Upload className="w-16 h-16 mx-auto mb-4 text-[#666]" />
            <p className="text-[#999] text-lg">No drawings uploaded yet</p>
            <p className="text-[#666] text-sm mt-2">Upload your first drawing to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drawings.map((drawing) => (
              <div key={drawing.id} className="neumorphic-card p-4 group">
                <div className="aspect-video rounded overflow-hidden bg-[#0d0d0d] mb-4 relative">
                  <img
                    src={drawing.file_url}
                    alt={drawing.file_name}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={() => setViewingImage(drawing)}
                      className="neumorphic-button p-3 text-white"
                    >
                      <Eye className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => setShowDeleteConfirm(drawing.id)}
                      className="neumorphic-button p-3 text-white hover:text-red-400 transition-colors"
                      disabled={deletingId === drawing.id}
                    >
                      {deletingId === drawing.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <h3 className="text-white font-semibold truncate mb-1">
                  {drawing.file_name}
                </h3>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#999]">{formatDate(drawing.created_at)}</span>
                  <span className="text-[#666]">{formatFileSize(drawing.file_size)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {viewingImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setViewingImage(null)}
        >
          <button
            onClick={() => setViewingImage(null)}
            className="absolute top-6 right-6 neumorphic-button p-3 text-white"
          >
            <X className="w-6 h-6" />
          </button>

          <img
            src={viewingImage.file_url}
            alt={viewingImage.file_name}
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="neumorphic-card p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-white mb-4">Delete Drawing?</h3>
            <p className="text-[#e5e5e5] mb-6">
              Are you sure you want to delete this drawing? This action cannot be undone.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                disabled={deletingId === showDeleteConfirm}
                className="flex-1 neumorphic-button px-6 py-3 font-semibold text-red-400 border border-[#2d2d2d] disabled:opacity-50"
              >
                {deletingId === showDeleteConfirm ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>

              <button
                onClick={() => setShowDeleteConfirm(null)}
                disabled={deletingId === showDeleteConfirm}
                className="flex-1 neumorphic-button px-6 py-3 font-semibold text-white disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
