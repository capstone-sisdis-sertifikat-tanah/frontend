import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/assets/css/leaflet.css";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { LayersControl, MapContainer } from "react-leaflet";
import ReactLeafletGoogleLayer from "react-leaflet-google-layer";

import { getMarkerPosition } from "@/lib/helper";
import { LocationMarker } from "./location-marker";
import { MapContext } from "./use-map";

const { BaseLayer } = LayersControl;

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

export type LatLong = {
  lat: number;
  lng: number;
};

export default function Map({ children }: { children: React.ReactNode }) {
  const mapRef = useRef() as MutableRefObject<L.Map>;

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const { watch } = useFormContext();
  const markerPosition = getMarkerPosition(watch);

  const handleUseCurrent = () => {
    if (mapRef) {
      mapRef.current?.locate();
    }
  };

  // Move map if input is changing
  // TODO Optimize setView calling
  useEffect(() => {
    if (isDragging) return;

    mapRef.current?.setView(markerPosition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, markerPosition.lat, markerPosition.lng]);

  const distance: string = ((mapRef.current?.distance(markerPosition, pickedLatlong) ?? 0) / 1000).toFixed(3);

  useEffect(() => {
    setTimeout(function () {
      window.dispatchEvent(new Event("resize"));
    }, 200);
  }, []);

  return (
    <MapContext.Provider value={{ handleUseCurrent }}>
      <div className="space-y-2 overflow-hidden rounded">
        <MapContainer
          className="h-80 w-full"
          zoom={14}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          center={pickedLatlong}
          ref={mapRef}
        >
          <LayersControl position="bottomleft" collapsed={false}>
            <BaseLayer name="Map">
              <ReactLeafletGoogleLayer googleMapsLoaderConf={{ apiKey }} />
            </BaseLayer>
            <BaseLayer checked name="Satellite">
              <ReactLeafletGoogleLayer googleMapsLoaderConf={{ apiKey }} />
            </BaseLayer>
          </LayersControl>
          <LocationMarker setIsDragging={setIsDragging} />
        </MapContainer>
      </div>
      {children}
    </MapContext.Provider>
  );
}

// Monas latlong
const pickedLatlong: LatLong = {
  lat: -6.1754,
  lng: 106.8272,
};
