"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { GymStore } from "@/lib/store";
import { GymProgram } from "@/lib/types";
import { compressAndReadFile } from "@/lib/imageUtils";
import { Dumbbell, Plus, Eye, EyeOff, Edit, X, Upload } from "lucide-react";

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<GymProgram[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState<GymProgram["category"]>("Strength Training");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("/images/gym-interior-2.jpg");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = () => {
    setPrograms(GymStore.getPrograms());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTogglePublish = (p: GymProgram) => {
    const updated = programs.map((item) =>
      item.programId === p.programId ? { ...item, isPublished: !item.isPublished } : item
    );
    GymStore.savePrograms(updated);
    setPrograms(updated);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const dataUrl = await compressAndReadFile(file, 1200, 1200, 0.85);
      setImageUrl(dataUrl);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to read image file.");
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProg: GymProgram = {
      programId: `PROG-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      category,
      description: description.trim(),
      duration: "Ongoing",
      imageUrl,
      isPublished: true,
      displayOrder: programs.length + 1,
    };

    const updated = [...programs, newProg];
    GymStore.savePrograms(updated);
    setPrograms(updated);
    setShowModal(false);
    setName("");
    setDescription("");
    setImageUrl("/images/gym-interior-2.jpg");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            Gym Programs & Training Areas
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure workout programs, category badges, and upload custom images directly.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Gym Program</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {programs.map((prog) => (
          <div
            key={prog.programId}
            className="bg-[#161616] border border-zinc-800 rounded-xl overflow-hidden shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 w-full">
                <Image src={prog.imageUrl} alt={prog.name} fill className="object-cover" />
                <span className="absolute top-3 left-3 px-2 py-0.5 text-xs font-bold bg-[#FF6B00] text-white rounded">
                  {prog.category}
                </span>
                <span
                  className={`absolute top-3 right-3 px-2 py-0.5 text-[11px] font-semibold rounded ${
                    prog.isPublished
                      ? "bg-emerald-500/80 text-white"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {prog.isPublished ? "Published" : "Draft / Hidden"}
                </span>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-heading text-lg font-bold text-white">{prog.name}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{prog.description}</p>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-zinc-800/80 flex items-center justify-between">
              <span className="text-[11px] text-zinc-500 font-mono">ID: {prog.programId}</span>
              <button
                onClick={() => handleTogglePublish(prog)}
                className={`px-3 py-1.5 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors ${
                  prog.isPublished
                    ? "bg-zinc-800 text-zinc-300 hover:text-white"
                    : "bg-[#FF6B00]/20 text-[#FF6B00] border border-[#FF6B00]/40"
                }`}
              >
                {prog.isPublished ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide Program</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Publish Live</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-zinc-700 max-w-md w-full rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-heading text-lg font-bold text-white">Create Gym Program</h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Program Title *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Strength & Powerlifting"
                  className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Category Badge</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GymProgram["category"])}
                  className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                >
                  <option value="Strength Training">Strength Training</option>
                  <option value="Weight Training">Weight Training</option>
                  <option value="General Fitness">General Fitness</option>
                  <option value="Personal Training">Personal Training</option>
                  <option value="Guidance">Guidance</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Program overview..."
                  className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                />
              </div>

              {/* Display Image Upload */}
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Display Image</label>
                <div className="relative h-36 w-full rounded-xl overflow-hidden border-2 border-dashed border-[#FF6B00]/70 bg-zinc-900 flex items-center justify-center mb-2">
                  <Image src={imageUrl} alt="Program Preview" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="px-3.5 py-1.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold rounded-lg shadow flex items-center gap-1.5 transition-transform"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploading ? "Uploading..." : "Upload New Image"}</span>
                    </button>
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Or Choose Preset Asset</label>
                <select
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                >
                  <option value="/images/gym-interior-1.jpg">Gym Interior 1 (Dumbbell Area)</option>
                  <option value="/images/gym-interior-2.jpg">Gym Interior 2 (Power Cage)</option>
                  <option value="/images/gym-interior-3.jpg">Gym Interior 3 (Mirrors)</option>
                  <option value="/images/gym-interior-4.jpg">Gym Interior 4 (Open Floor)</option>
                  <option value="/images/gym-equipment.jpg">Gym Equipment (Dumbbell Racks)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold uppercase rounded-lg transition-colors shadow-lg"
              >
                Save Program
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
