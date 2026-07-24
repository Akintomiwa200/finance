"use client";

import { create } from "zustand";
import type { Asset, AssetDisposal } from "@/src/types/asset";

interface AssetState {
  assets: Asset[];
  disposals: AssetDisposal[];
  loading: boolean;
  _pollInterval: ReturnType<typeof setInterval> | null;

  fetchAssets: (params?: Record<string, string>) => Promise<void>;
  fetchDisposals: (params?: Record<string, string>) => Promise<void>;
  getAssetById: (id: string) => Asset | undefined;
  getDisposalById: (id: string) => AssetDisposal | undefined;

  addAsset: (data: Record<string, unknown>) => Promise<Asset | null>;
  updateAsset: (id: string, data: Record<string, unknown>) => Promise<Asset | null>;
  deleteAsset: (id: string) => Promise<boolean>;

  addDisposal: (data: Record<string, unknown>) => Promise<AssetDisposal | null>;
  updateDisposal: (id: string, data: Record<string, unknown>) => Promise<AssetDisposal | null>;
  deleteDisposal: (id: string) => Promise<boolean>;
  approveDisposal: (id: string) => Promise<AssetDisposal | null>;
  completeDisposal: (id: string) => Promise<AssetDisposal | null>;

  startPolling: () => void;
  stopPolling: () => void;
}

function mapAsset(raw: Record<string, unknown>): Asset {
  return {
    id: raw.id as string,
    name: raw.name as string,
    code: raw.code as string,
    category: raw.category as Asset["category"],
    description: raw.description as string | null,
    serialNumber: raw.serialNumber as string | null,
    purchasePrice: Number(raw.purchasePrice),
    currentValue: Number(raw.currentValue),
    purchaseDate: raw.purchaseDate as string,
    depreciationMethod: raw.depreciationMethod as Asset["depreciationMethod"],
    usefulLife: raw.usefulLife as number | null,
    salvageValue: raw.salvageValue != null ? Number(raw.salvageValue) : null,
    accumulatedDepreciation: Number(raw.accumulatedDepreciation),
    monthlyDepreciation: Number(raw.monthlyDepreciation),
    status: (raw.status as string).toLowerCase() as Asset["status"],
    location: raw.location as string | null,
    departmentName: raw.departmentName as string | null,
    assignedTo: raw.assignedTo as string | null,
    supplier: raw.supplier as string | null,
    warrantyExpiry: raw.warrantyExpiry as string | null,
    notes: raw.notes as string | null,
    organizationId: raw.organizationId as string,
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string,
  };
}

function mapDisposal(raw: Record<string, unknown>): AssetDisposal {
  const asset = raw.asset as Record<string, unknown> | undefined;
  return {
    id: raw.id as string,
    disposalNumber: raw.disposalNumber as string,
    disposalDate: raw.disposalDate as string,
    disposalMethod: raw.disposalMethod as AssetDisposal["disposalMethod"],
    saleAmount: Number(raw.saleAmount),
    disposalCost: Number(raw.disposalCost),
    netProceeds: Number(raw.netProceeds),
    bookValueAtDisposal: Number(raw.bookValueAtDisposal),
    gainLoss: Number(raw.gainLoss),
    gainLossType: (raw.gainLossType as string) === "loss" ? "loss" : "gain",
    status: (raw.status as string).toLowerCase() as AssetDisposal["status"],
    buyerName: raw.buyerName as string | null,
    buyerContact: raw.buyerContact as string | null,
    reason: raw.reason as string | null,
    approvedBy: raw.approvedBy as string | null,
    approvedAt: raw.approvedAt as string | null,
    processedBy: raw.processedBy as string | null,
    processedAt: raw.processedAt as string | null,
    reference: raw.reference as string | null,
    notes: raw.notes as string | null,
    assetId: raw.assetId as string,
    assetName: (asset?.name as string) || "",
    assetCode: (asset?.code as string) || "",
    organizationId: raw.organizationId as string,
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string,
  };
}

export const useAssetStore = create<AssetState>()((set, get) => ({
  assets: [],
  disposals: [],
  loading: false,
  _pollInterval: null,

  startPolling: () => {
    const state = get();
    if (state._pollInterval) return;
    state.fetchAssets();
    state.fetchDisposals();
    const id = setInterval(() => {
      get().fetchAssets();
      get().fetchDisposals();
    }, 30000);
    set({ _pollInterval: id });
  },
  stopPolling: () => {
    const state = get();
    if (state._pollInterval) {
      clearInterval(state._pollInterval);
      set({ _pollInterval: null });
    }
  },

  fetchAssets: async (params) => {
    set({ loading: true });
    try {
      const sp = new URLSearchParams(params);
      const res = await fetch(`/api/assets?${sp.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch assets");
      const data = await res.json();
      set({ assets: (data.assets || []).map(mapAsset), loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchDisposals: async (params) => {
    set({ loading: true });
    try {
      const sp = new URLSearchParams(params);
      const res = await fetch(`/api/assets/disposals?${sp.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch disposals");
      const data = await res.json();
      set({ disposals: (data.disposals || []).map(mapDisposal), loading: false });
    } catch {
      set({ loading: false });
    }
  },

  getAssetById: (id) => get().assets.find((a) => a.id === id),
  getDisposalById: (id) => get().disposals.find((d) => d.id === id),

  addAsset: async (data) => {
    try {
      const res = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const { asset } = await res.json();
      const mapped = mapAsset(asset);
      set({ assets: [mapped, ...get().assets] });
      return mapped;
    } catch { return null; }
  },

  updateAsset: async (id, data) => {
    try {
      const res = await fetch(`/api/assets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const { asset } = await res.json();
      const mapped = mapAsset(asset);
      set({ assets: get().assets.map((a) => (a.id === id ? mapped : a)) });
      return mapped;
    } catch { return null; }
  },

  deleteAsset: async (id) => {
    try {
      const res = await fetch(`/api/assets/${id}`, { method: "DELETE" });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      set({ assets: get().assets.filter((a) => a.id !== id) });
      return true;
    } catch { return false; }
  },

  addDisposal: async (data) => {
    try {
      const res = await fetch("/api/assets/disposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const { disposal } = await res.json();
      const mapped = mapDisposal(disposal);
      set({ disposals: [mapped, ...get().disposals] });
      return mapped;
    } catch { return null; }
  },

  updateDisposal: async (id, data) => {
    try {
      const res = await fetch(`/api/assets/disposals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const { disposal } = await res.json();
      const mapped = mapDisposal(disposal);
      set({ disposals: get().disposals.map((d) => (d.id === id ? mapped : d)) });
      return mapped;
    } catch { return null; }
  },

  deleteDisposal: async (id) => {
    try {
      const res = await fetch(`/api/assets/disposals/${id}`, { method: "DELETE" });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      set({ disposals: get().disposals.filter((d) => d.id !== id) });
      return true;
    } catch { return false; }
  },

  approveDisposal: async (id) => {
    try {
      const res = await fetch(`/api/assets/disposals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const { disposal } = await res.json();
      const mapped = mapDisposal(disposal);
      set({ disposals: get().disposals.map((d) => (d.id === id ? mapped : d)) });
      return mapped;
    } catch { return null; }
  },

  completeDisposal: async (id) => {
    try {
      const res = await fetch(`/api/assets/disposals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const { disposal } = await res.json();
      const mapped = mapDisposal(disposal);
      set({ disposals: get().disposals.map((d) => (d.id === id ? mapped : d)) });
      return mapped;
    } catch { return null; }
  },
}));
