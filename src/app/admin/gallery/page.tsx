"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { GymStore } from "@/lib/store";
import { GalleryMedia } from "@/lib/types";
import { readMediaFile } from "@/lib/imageUtils";
import {
  Image as ImageIcon,
  Plus,
  Star,
  Trash2,
  Upload,
  X,
  Edit,
  Play,
  Video,
  CheckCircle2,
} from "lucide-react";

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState<GalleryMedia[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryMedia | null>(null);

  // Form states for Add / Edit
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState<GalleryMedia["category"]>("Interior");
  const [photoPreview, setPhotoPreview] = useState("/images/gym-interior-1.jpg");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const loadData = () => {
    setGallery(GymStore.getGallery());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleFeatured = (item: GalleryMedia) => {
    const updated = gallery.map((g) =>
      g.imageId === item.imageId ? { ...g, isFeatured: !g.isFeatured } : g
    );
    GymStore.saveGallery(updated);
    setGallery(updated);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to remove this media item?")) return;
    const updated = gallery.filter((g) => g.imageId !== id);
    GymStore.saveGallery(updated);
    setGallery(updated);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await readMediaFile(file);
      if (isEdit && editingItem) {
        setEditingItem({ ...editingItem, imageUrl: res.url, mediaType: res.mediaType });
      } else {
        setPhotoPreview(res.url);
        setMediaType(res.mediaType);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to process media file.");
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;

    const newItem: GalleryMedia = {
      imageId: `IMG-${Date.now().toString().slice(-4)}`,
      imageUrl: photoPreview,
      mediaType,
      caption: caption.trim(),
      category,
      displayOrder: gallery.length + 1,
      isFeatured: false,
      isPublished: true,
    };

    const updated = [newItem, ...gallery];
    GymStore.saveGallery(updated);
    setGallery(updated);
    setShowAddModal(false);
    setCaption("");
    setPhotoPreview("/images/gym-interior-1.jpg");
    setMediaType("image");
  };

  const handleOpenEdit = (item: GalleryMedia) => {
    setEditingItem(item);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const updated = gallery.map((g) =>
      g.imageId === editingItem.imageId ? editingItem : g
    );
    GymStore.saveGallery(updated);
    setGallery(updated);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            Gym Media & Video Gallery
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage high-resolution facility photographs and workout videos. Upload directly from your device (no links needed).
          </p>
        </div>

        <button
          onClick={() => {
            setCaption("");
            setPhotoPreview("/images/gym-interior-1.jpg");
            setMediaType("image");
            setShowAddModal(true);
          }}
          className="px-4 py-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md flex items-center gap-1.5 transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Image / Video</span>
        </button>
      </div>

      {/* Official Gym Logo Status Card */}
      <div className="p-4 bg-[#161616] border border-zinc-800 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#FF6B00]">
            <Image src="/images/logo.png" alt="Official Gym Logo" fill className="object-cover" />
          </div>
          <div>
            <span className="text-[10px] text-[#FFC857] font-semibold uppercase tracking-widest block">
              Active Official Branding
            </span>
            <h3 className="font-heading text-base font-bold text-white">
              Safdarbad Gym Khan’a Emblem Logo
            </h3>
            <p className="text-xs text-zinc-400">
              Preserved at 1024x1024 native resolution with custom metallic border styling.
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded">
          Active Live
        </span>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map((item) => {
          const isVideo = item.mediaType === "video" || item.imageUrl.startsWith("data:video") || item.imageUrl.endsWith(".mp4");
          return (
            <div
              key={item.imageId}
              className="bg-[#161616] border border-zinc-800 rounded-xl overflow-hidden shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full group bg-black">
                  {isVideo ? (
                    <video
                      src={item.imageUrl}
                      muted
                      loop
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image src={item.imageUrl} alt={item.caption} fill className="object-cover" />
                  )}

                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-bold bg-black/80 text-[#FFC857] border border-zinc-700 rounded">
                    {item.category}
                  </span>

                  {isVideo && (
                    <span className="absolute top-2.5 left-20 px-2 py-0.5 text-[10px] font-bold bg-blue-600/90 text-white rounded flex items-center gap-1">
                      <Video className="w-3 h-3" />
                      <span>Video</span>
                    </span>
                  )}

                  {item.isFeatured && (
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 text-[10px] font-bold bg-[#FF6B00] text-white rounded flex items-center gap-1">
                      <Star className="w-3 h-3 fill-white" />
                      <span>Featured</span>
                    </span>
                  )}
                </div>
                <div className="p-4 space-y-1">
                  <p className="text-xs text-white font-medium line-clamp-2">{item.caption}</p>
                  <span className="text-[10px] text-zinc-500 font-mono block truncate">
                    {item.imageUrl.startsWith("data:") ? `Uploaded ${isVideo ? "Video Clip" : "Image"}` : item.imageUrl}
                  </span>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleFeatured(item)}
                    className={`p-1.5 rounded transition-colors ${
                      item.isFeatured
                        ? "text-[#FFC857] hover:bg-amber-950/40"
                        : "text-zinc-500 hover:text-white"
                    }`}
                    title="Toggle Featured on Homepage"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-950/40 rounded transition-colors"
                    title="Edit Photo / Caption"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => handleDelete(item.imageId)}
                  className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-950/40 rounded transition-colors"
                  title="Delete Media"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload / Add Photo Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-zinc-700 max-w-md w-full rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-heading text-lg font-bold text-white">Upload Gym Media (Photo or Video)</h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              {/* Media Upload Area */}
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Upload Image or Video File
                </label>
                <div className="relative h-44 w-full rounded-xl overflow-hidden border-2 border-dashed border-[#FF6B00]/70 bg-zinc-900 flex items-center justify-center mb-2">
                  {mediaType === "video" ? (
                    <video
                      src={photoPreview}
                      controls
                      autoPlay
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image src={photoPreview} alt="Preview" fill className="object-cover" />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="pointer-events-auto px-4 py-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold rounded-lg shadow-lg flex items-center gap-2 transition-transform transform active:scale-95"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{uploading ? "Processing..." : "Select File (Image / Video)"}</span>
                    </button>
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*,video/*"
                  onChange={(e) => handlePhotoUpload(e, false)}
                  className="hidden"
                />
                <span className="text-[11px] text-zinc-400 block">
                  Supports JPG, PNG, WEBP, MP4, and WEBM video clips.
                </span>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Or Choose Preset Facility Area</label>
                <select
                  value={photoPreview}
                  onChange={(e) => {
                    setPhotoPreview(e.target.value);
                    setMediaType("image");
                  }}
                  className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                >
                  <option value="/images/gym-interior-1.jpg">Gym Interior 1 (Dumbbell Arena)</option>
                  <option value="/images/gym-interior-2.jpg">Gym Interior 2 (Power Rack)</option>
                  <option value="/images/gym-interior-3.jpg">Gym Interior 3 (Mirrors)</option>
                  <option value="/images/gym-interior-4.jpg">Gym Interior 4 (Open Area)</option>
                  <option value="/images/gym-workout.jpg">Workout (Heavy Dumbbell Curl)</option>
                  <option value="/images/gym-equipment.jpg">Equipment (Full Rack)</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GalleryMedia["category"])}
                  className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                >
                  <option value="Interior">Interior</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Workout">Workout</option>
                  <option value="Atmosphere">Atmosphere</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Caption / Description *</label>
                <input
                  type="text"
                  required
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. Heavy deadlift area or dumbbell training reel"
                  className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold uppercase rounded-lg transition-colors shadow-lg"
              >
                Save Media Item
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Photo / Video Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-zinc-700 max-w-md w-full rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-heading text-lg font-bold text-white">Edit Media Item</h3>
              <button onClick={() => setEditingItem(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Replace Image or Video</label>
                <div className="relative h-44 w-full rounded-xl overflow-hidden border-2 border-dashed border-[#FF6B00]/70 bg-zinc-900 flex items-center justify-center mb-2">
                  {editingItem.mediaType === "video" || editingItem.imageUrl.startsWith("data:video") || editingItem.imageUrl.endsWith(".mp4") ? (
                    <video
                      src={editingItem.imageUrl}
                      controls
                      autoPlay
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image src={editingItem.imageUrl} alt={editingItem.caption} fill className="object-cover" />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                    <button
                      type="button"
                      onClick={() => editFileInputRef.current?.click()}
                      disabled={uploading}
                      className="pointer-events-auto px-4 py-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold rounded-lg shadow-lg flex items-center gap-2 transition-transform"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{uploading ? "Processing..." : "Upload New File"}</span>
                    </button>
                  </div>
                </div>
                <input
                  type="file"
                  ref={editFileInputRef}
                  accept="image/*,video/*"
                  onChange={(e) => handlePhotoUpload(e, true)}
                  className="hidden"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Category</label>
                <select
                  value={editingItem.category}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      category: e.target.value as GalleryMedia["category"],
                    })
                  }
                  className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                >
                  <option value="Interior">Interior</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Workout">Workout</option>
                  <option value="Atmosphere">Atmosphere</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Caption</label>
                <input
                  type="text"
                  required
                  value={editingItem.caption}
                  onChange={(e) => setEditingItem({ ...editingItem, caption: e.target.value })}
                  className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase rounded-lg transition-colors shadow"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
