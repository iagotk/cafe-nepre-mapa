'use client';

import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

export interface MarkerData {
  lat: number;
  lng: number;
  info: string;
}

interface MapViewProps {
  markers: MarkerData[];
  coloredStates: string[];
}

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MapView({ markers, coloredStates }: MapViewProps) {
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch('/data/brazil-states.geojson')
      .then((res) => res.json())
      .then((data) => setGeoData(data));
  }, []);

  function style(feature: any) {
    const uf = feature.properties.name;
    return {
      fillColor: coloredStates.includes(uf) ? '#34d399' : '#ffffff', // Verde claro se selecionado
      weight: 1,
      opacity: 1,
      color: 'gray',
      fillOpacity: 0.5,
    };
  }

  return (
    <MapContainer center={[-14.235, -51.9253]} zoom={4} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {geoData && (
        <GeoJSON data={geoData} style={style} />
      )}

      {markers.map((marker, index) => (
        <Marker key={index} position={[marker.lat, marker.lng]}>
          <Popup>{marker.info}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
