"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { GymStore } from "@/lib/store";
import { GymProgram } from "@/lib/types";
import { Dumbbell, Plus, Eye, EyeOff, Edit, X } from "lucide-react";

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<GymProgram[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState<GymProgram["category"]>("Strength Training");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("/images/gym-interior-2.jpg");

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
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            Gym Programs & Training Areas
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure workout programs, category badges, and visibility on the public website.
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {programs.map((prog) => (
          <div
            key={prog.programId}
            className="bg-[#161616] border border-zinc-800 rounded-xl overflow-hidden shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 w-full">
                <Image src={prog.imageUrl} alt={prog.name} fill className="object-cover" />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-bold bg-black/80 text-[#FFC857] border border-zinc-700 rounded">
                  {prog.category}
                </span>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-heading text-base font-bold text-white">{prog.name}</h3>
                <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                  {prog.description}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-zinc-800/80 flex items-center justify-between">
              <span
                className={`text-[11px] font-semibold ${
                  prog.isPublished ? "text-emerald-400" : "text-zinc-500"
                }`}
              >
                {prog.isPublished ? "Live" : "Hidden"}
              </span>
              <button
                onClick={() => handleTogglePublish(prog)}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                title={prog.isPublished ? "Hide" : "Show"}
              >
                {prog.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-zinc-700 max-w-md w-full rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-heading text-lg font-bold text-white">Add Gym Program</h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Program Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Barbell Squat & Deadlift Camp"
                  className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Category</label>
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

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Display Image</label>
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
                  <option value="/images/gym-workout.jpg">Workout Training (Bicep Curl)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold uppercase rounded-lg transition-colors"
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
