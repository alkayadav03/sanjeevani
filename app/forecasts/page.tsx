'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useResilienceStore } from '@/lib/useResilienceStore';
import { ForecastEngine } from '@/lib/data/forecastEngine';
import {
  TrendingUp,
  AlertCircle,
  Calendar,
  Sparkles,
  Info,
  ShieldCheck,
  Building,
  Pill,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
} from 'recharts';

export default function ForecastsPage() {
  const { data } = useResilienceStore();
  const phcs = data?.phcs || [];
  const medicines = data?.medicines || [];

  const [selectedPhc, setSelectedPhc] = useState<string>('phc-004'); // Kalyanpur PHC
  const [selectedMed, setSelectedMed] = useState<string>('med-01'); // Paracetamol

  const [medicineForecast, setMedicineForecast] = useState<any[]>([]);
  const [patientForecast, setPatientForecast] = useState<any[]>([]);
  const [bedForecast, setBedForecast] = useState<any[]>([]);

  useEffect(() => {
    // Generate forecasts dynamically
    const medFc = ForecastEngine.getMedicineDemandForecast(selectedPhc, selectedMed);
    const patFc = ForecastEngine.getPatientFootfallForecast(selectedPhc);
    const bedFc = ForecastEngine.getBedOccupancyForecast(selectedPhc);

    setMedicineForecast(medFc);
    setPatientForecast(patFc);
    setBedForecast(bedFc);
  }, [selectedPhc, selectedMed, data?.emergency?.isActive]);

  const activePhcObj = phcs.find((p) => p.id === selectedPhc);
  const activeMedObj = medicines.find((m) => m.id === selectedMed);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
              <span>Predictive AI Forecasting Engine</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              7-day forward algorithmic projections for drug depletion, patient inflows, and bed occupancy.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
              Horizon: 7 Days (T+7)
            </span>
          </div>
        </div>

        {/* Mandatory Algorithmic Estimate Disclaimer Banner */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-300">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong className="text-white">Estimate Label: </strong>
            {ForecastEngine.DISCLAIMER}
          </span>
        </div>

        {/* Forecast Configuration Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-cyan-400" />
              <span>Target Primary Health Centre</span>
            </label>
            <select
              value={selectedPhc}
              onChange={(e) => setSelectedPhc(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {phcs.slice(0, 35).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.district}) - {p.status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1.5 flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5 text-cyan-400" />
              <span>Essential Medication</span>
            </label>
            <select
              value={selectedMed}
              onChange={(e) => setSelectedMed(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {medicines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Primary Chart: Medicine Demand 7-Day Forecast */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-white text-base">
                7-Day Demand Projection: {activeMedObj?.name} at {activePhcObj?.name}
              </h3>
              <p className="text-xs text-slate-400">
                Confidence band envelope (±12%) accounting for day-of-week seasonality and surge factors.
              </p>
            </div>
            <div className="text-xs text-right">
              <span className="text-slate-400 block">Unit of measure:</span>
              <strong className="text-cyan-400">{activeMedObj?.unit}</strong>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={medicineForecast}>
                <defs>
                  <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="dayName" stroke="#64748B" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '0.5rem',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                {/* Confidence Interval Band */}
                <Area
                  dataKey="upperBound"
                  fill="url(#confidenceBand)"
                  stroke="transparent"
                  name="Upper Bound (+12%)"
                />
                <Area
                  dataKey="lowerBound"
                  fill="#0B132B"
                  stroke="transparent"
                  name="Lower Bound (-12%)"
                />
                {/* Baseline & Predicted Demand */}
                <Line
                  type="monotone"
                  dataKey="baselineDemand"
                  stroke="#94A3B8"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  name="Baseline Seasonal Demand"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="predictedDemand"
                  stroke="#06B6D4"
                  strokeWidth={3}
                  name="Predicted Consumption"
                  dot={{ r: 4, fill: '#06B6D4' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Charts: Patient Inflow Projection & Bed Occupancy */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patient Footfall Forecast */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-sm">
              7-Day Patient Inflow Forecast ({activePhcObj?.name})
            </h3>
            <p className="text-xs text-slate-400">
              Anticipated daily outpatient registrations for the next 7 days.
            </p>
            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={patientForecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="dayName" stroke="#64748B" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748B" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '0.5rem',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="predictedDemand" fill="#14B8A6" name="Projected Patients" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bed Occupancy Forecast */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-sm">
              7-Day Bed Occupancy Rate Projections
            </h3>
            <p className="text-xs text-slate-400">
              Ward stress threshold: critical surge boundary marked at 90% capacity.
            </p>
            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bedForecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="dayName" stroke="#64748B" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748B" tick={{ fontSize: 10 }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '0.5rem',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="rate" fill="#3B82F6" name="Occupancy %" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
