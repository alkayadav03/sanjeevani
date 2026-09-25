'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useResilienceStore } from '@/lib/useResilienceStore';
import {
  Cpu,
  ShieldAlert,
  Play,
  RotateCw,
  Layers,
  ArrowRight,
  Database,
  Lock,
  Sparkles,
  CheckCircle2,
  Info,
} from 'lucide-react';

export default function FederatedPage() {
  const { data } = useResilienceStore();
  const federated = data?.federated;

  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [currentStepText, setCurrentStepText] = useState('Idle');
  const [modelVersion, setModelVersion] = useState(federated?.globalModelVersion || 'v2.4.1');
  const [roundNumber, setRoundNumber] = useState(federated?.round || 14);

  const [nodes, setNodes] = useState([
    { id: 'pb', state: 'Punjab', phcs: 25, samples: '48,500 records', status: 'IDLE', accuracy: 94.2, loss: 0.082 },
    { id: 'hr', state: 'Haryana', phcs: 25, samples: '46,200 records', status: 'IDLE', accuracy: 93.8, loss: 0.089 },
    { id: 'rj', state: 'Rajasthan', phcs: 25, samples: '51,200 records', status: 'IDLE', accuracy: 94.7, loss: 0.078 },
    { id: 'up', state: 'Uttar Pradesh', phcs: 25, samples: '62,400 records', status: 'IDLE', accuracy: 95.1, loss: 0.071 },
  ]);

  const handleStartTraining = () => {
    if (isTraining) return;
    setIsTraining(true);
    setTrainingProgress(5);
    setCurrentStepText('Phase 1: Local edge training on state PHC telemetry...');

    // Step 1: Local training
    setNodes((prev) => prev.map((n) => ({ ...n, status: 'TRAINING' })));

    setTimeout(() => {
      setTrainingProgress(35);
      setCurrentStepText('Phase 2: Computing secure model weight gradients (ΔW)...');
      setNodes((prev) => prev.map((n) => ({ ...n, status: 'SYNCING' })));

      setTimeout(() => {
        setTrainingProgress(70);
        setCurrentStepText('Phase 3: Transmitting encrypted gradients to Federated Aggregator...');

        setTimeout(() => {
          setTrainingProgress(95);
          setCurrentStepText('Phase 4: FedAvg aggregation & global weight synthesis...');

          setTimeout(() => {
            setTrainingProgress(100);
            setIsTraining(false);
            setCurrentStepText('Completed: Global model updated and redistributed to all 4 states.');
            setRoundNumber((r) => r + 1);

            // Increment version e.g. v2.4.1 -> v2.4.2
            const parts = modelVersion.replace('v', '').split('.');
            const newMinor = parseInt(parts[2] || '1', 10) + 1;
            setModelVersion(`v${parts[0]}.${parts[1]}.${newMinor}`);

            setNodes((prev) =>
              prev.map((n) => ({
                ...n,
                status: 'READY',
                accuracy: +(n.accuracy + 0.3).toFixed(1),
                loss: +(n.loss - 0.005).toFixed(3),
              }))
            );
          }, 1200);
        }, 1200);
      }, 1200);
    }, 1200);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Cpu className="w-6 h-6 text-cyan-400" />
              <span>Federated AI Distributed Learning</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Cross-border and multi-state epidemiological machine learning without centralizing patient-identifiable records.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono font-bold">
              Global Model: {modelVersion} (Round #{roundNumber})
            </span>
          </div>
        </div>

        {/* Mandatory Transparency & Privacy Disclaimer */}
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-600/60 flex items-center gap-3 text-xs text-amber-300">
          <Info className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <strong className="text-white block font-semibold">
              Federated learning prototype simulation. No production privacy guarantee.
            </strong>
            <p className="text-amber-300/80 mt-0.5">
              This demonstrates the distributed parameter-exchange architecture. In production, this would be fortified with differential privacy noise (ε, δ) and secure multi-party computation.
            </p>
          </div>
        </div>

        {/* Architecture Pipeline Stepper: Local Data -> Local Model -> Model Update -> Aggregator -> Global Model */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">
              Decentralized Parameter Flow Pipeline
            </h3>
            <span className="text-xs text-cyan-400 font-mono">FedAvg Algorithm</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <Database className="w-4 h-4 text-cyan-400 mx-auto" />
              <div className="text-xs font-bold text-white">1. Local Telemetry</div>
              <div className="text-[10px] text-slate-400">Stored on PHC server</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <Cpu className="w-4 h-4 text-teal-400 mx-auto" />
              <div className="text-xs font-bold text-white">2. Edge Training</div>
              <div className="text-[10px] text-slate-400">SGD on local tensor</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <Lock className="w-4 h-4 text-blue-400 mx-auto" />
              <div className="text-xs font-bold text-white">3. Model Weights (ΔW)</div>
              <div className="text-[10px] text-slate-400">Gradients encrypted</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <Layers className="w-4 h-4 text-amber-400 mx-auto" />
              <div className="text-xs font-bold text-white">4. Fed Aggregator</div>
              <div className="text-[10px] text-slate-400">Weighted parameter avg</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-600/70 space-y-1 shadow-sm">
              <Sparkles className="w-4 h-4 text-cyan-300 mx-auto" />
              <div className="text-xs font-bold text-cyan-300">5. Global {modelVersion}</div>
              <div className="text-[10px] text-slate-400">Broadcast to all nodes</div>
            </div>
          </div>
        </div>

        {/* Interactive Training Console */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">
                Federated Round Orchestration
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Trigger decentralized gradient computation across 4 state health data centers.
              </p>
            </div>

            <button
              onClick={handleStartTraining}
              disabled={isTraining}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all ${
                isTraining
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-slate-950'
              }`}
            >
              {isTraining ? <RotateCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isTraining ? 'Training In Progress...' : 'Start Federated Training'}</span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-cyan-400 font-mono font-semibold">{currentStepText}</span>
              <span className="font-mono text-white font-bold">{trainingProgress}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-300"
                style={{ width: `${trainingProgress}%` }}
              />
            </div>
          </div>

          {/* 4 State Nodes Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {nodes.map((node) => (
              <div
                key={node.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2 relative overflow-hidden"
              >
                {node.status === 'TRAINING' && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl animate-pulse" />
                )}
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">{node.state}</h4>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      node.status === 'TRAINING'
                        ? 'bg-cyan-950 text-cyan-400 border border-cyan-700 animate-pulse'
                        : node.status === 'SYNCING'
                        ? 'bg-amber-950 text-amber-400 border border-amber-700'
                        : 'bg-slate-900 text-emerald-400 border border-slate-800'
                    }`}
                  >
                    {node.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-400">
                  <div>
                    Nodes:{' '}
                    <strong className="text-slate-200">{node.phcs} PHCs</strong>
                  </div>
                  <div>
                    Telemetry:{' '}
                    <strong className="text-slate-200">{node.samples}</strong>
                  </div>
                  <div className="pt-1 flex items-center justify-between border-t border-slate-900 text-[11px]">
                    <span>Local Val Acc:</span>
                    <span className="text-cyan-400 font-bold font-mono">{node.accuracy}%</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span>Loss:</span>
                    <span className="text-slate-300 font-mono">{node.loss}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
