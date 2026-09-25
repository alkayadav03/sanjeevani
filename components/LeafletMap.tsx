'use client';

import React, { useEffect, useRef } from 'react';
import { PHC } from '@/lib/data/types';
import L from 'leaflet';

interface LeafletMapProps {
  phcs: PHC[];
  selectedPhc: PHC | null;
  onSelectPhc: (phc: PHC) => void;
}

export default function LeafletMap({ phcs, selectedPhc, onSelectPhc }: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.CircleMarker }>({});

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default center around North India (Punjab/Haryana/Rajasthan/UP)
      const map = L.map(mapContainerRef.current, {
        center: [28.6139, 77.209],
        zoom: 6,
        minZoom: 5,
        maxZoom: 13,
      });

      // OpenStreetMap tiles with dark command theme filter
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Marker color by risk
    const getColor = (status: string) => {
      switch (status) {
        case 'CRITICAL':
          return '#F43F5E'; // rose-500
        case 'HIGH_RISK':
          return '#F97316'; // orange-500
        case 'WARNING':
          return '#F59E0B'; // amber-500
        default:
          return '#10B981'; // emerald-500
      }
    };

    // Plot circle markers
    phcs.forEach((phc) => {
      const color = getColor(phc.status);
      const isSelected = selectedPhc?.id === phc.id;

      const marker = L.circleMarker([phc.latitude, phc.longitude], {
        radius: isSelected ? 10 : phc.status === 'CRITICAL' ? 8 : 6,
        fillColor: color,
        color: isSelected ? '#FFFFFF' : '#0F172A',
        weight: isSelected ? 3 : 1.5,
        opacity: 1,
        fillOpacity: 0.85,
      });

      marker.bindTooltip(
        `<strong>${phc.name}</strong><br/>${phc.district}, ${phc.state}<br/>Status: <span style="color:${color};font-weight:bold;">${phc.status}</span><br/>Beds: ${phc.availableBeds}/${phc.totalBeds} avail`,
        { direction: 'top', className: 'map-custom-tooltip' }
      );

      marker.on('click', () => {
        onSelectPhc(phc);
      });

      marker.addTo(map);
      markersRef.current[phc.id] = marker;
    });

    if (selectedPhc) {
      map.setView([selectedPhc.latitude, selectedPhc.longitude], 9, { animate: true });
    }
  }, [phcs, selectedPhc, onSelectPhc]);

  return (
    <div className="w-full h-full min-h-[450px] relative rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
