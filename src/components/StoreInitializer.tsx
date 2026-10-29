"use client";

import { useEffect } from "react";
import { GymStore } from "@/lib/store";

export default function StoreInitializer() {
  useEffect(() => {
    GymStore.initFirestoreSync();
  }, []);

  return null;
}
