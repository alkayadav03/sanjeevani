'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  PHC,
  Medicine,
  InventoryItem,
  StockAlert,
  TransferRecommendation,
  EmergencyState,
  FederatedState,
  DemoPreset,
  TransferStatus,
} from './data/types';

export interface StoreData {
  phcs: PHC[];
  medicines: Medicine[];
  inventory: InventoryItem[];
  alerts: StockAlert[];
  redistributions: TransferRecommendation[];
  emergency: EmergencyState;
  federated: FederatedState;
  activePreset: DemoPreset;
  stats: {
    total: number;
    critical: number;
    highRisk: number;
    warning: number;
    normal: number;
    totalBeds: number;
    availableBeds: number;
    occupiedBeds: number;
    bedOccupancyRate: number;
    patientsToday: number;
    staffTotal: number;
    staffPresent: number;
    staffAttendanceRate: number;
    alerts: {
      totalActive: number;
      critical: number;
      highRisk: number;
      warning: number;
    };
    redistribution: {
      total: number;
      recommended: number;
      approved: number;
      inTransit: number;
      received: number;
      totalQuantityMoved: number;
    };
  };
}

const CACHE_KEY = 'swasthya_cached_store_v1';

export function useResilienceStore() {
  const [data, setData] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStore = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/data/store');
      if (!res.ok) throw new Error(`Failed to load data (HTTP ${res.status})`);
      const json: StoreData = await res.json();
      setData(json);
      setError(null);
      // Cache locally for offline resilience
      if (typeof window !== 'undefined') {
        localStorage.setItem(CACHE_KEY, JSON.stringify(json));
      }
    } catch (err: any) {
      console.warn('Network fetch failed, attempting cached fallback:', err.message);
      setError(err.message);
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          try {
            setData(JSON.parse(cached));
          } catch (e) {
            console.error('Failed to parse cached store');
          }
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStore();

    const handleOnline = () => {
      setIsOffline(false);
      fetchStore();
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [fetchStore]);

  const simulateEmergency = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/data/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'simulate_emergency' }),
      });
      if (res.ok) {
        await fetchStore();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const resetDemo = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/data/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      });
      if (res.ok) {
        await fetchStore();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = async (preset: DemoPreset) => {
    try {
      setLoading(true);
      const res = await fetch('/api/data/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'preset', preset }),
      });
      if (res.ok) {
        await fetchStore();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateTransfer = async (transferId: string, status: TransferStatus) => {
    try {
      const res = await fetch('/api/data/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_transfer', transferId, status }),
      });
      if (res.ok) {
        await fetchStore();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return {
    data,
    loading,
    error,
    isOffline,
    refresh: fetchStore,
    simulateEmergency,
    resetDemo,
    applyPreset,
    updateTransfer,
  };
}
