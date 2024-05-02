import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/assets/css/leaflet.css";
import { MutableRefObject, useEffect, useRef } from "react";
import { LayersControl, MapContainer, Marker, useMapEvents } from "react-leaflet";
import ReactLeafletGoogleLayer from "react-leaflet-google-layer";
import { useInView } from "react-intersection-observer";

import { DefaultIcon } from "./location-marker";
import React from "react";

const { BaseLayer } = LayersControl;

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

export type LatLong = {
  lat: number;
  lng: number;
};

export default function ReadOnlyMap({ markerPosition }: { markerPosition: { lat: number; lng: number } }) {
  const mapRef = useRef() as MutableRefObject<L.Map>;

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (mapRef) {
      mapRef.current?.setView(markerPosition);
    }
  }, [markerPosition]);

  useEffect(() => {
    if (inView) {
      window.dispatchEvent(new Event("resize"));
    }
  }, [inView]);

  return (
    <div ref={ref} className="space-y-2 overflow-hidden rounded">
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
        <LocationMarker markerPosition={markerPosition} />
      </MapContainer>
    </div>
  );
}

function LocationMarker({ markerPosition }: { markerPosition: { lat: number; lng: number } }) {
  const map = useMapEvents({
    drag() {
      map.flyTo(markerPosition, map.getZoom());
    },
    locationfound(e) {
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  useEffect(() => {
    if (markerPosition) {
      map.flyTo(markerPosition, map.getZoom());
    }
  }, [map, markerPosition]);

  return <Marker position={markerPosition} icon={DefaultIcon}></Marker>;
}

// Monas latlong
const pickedLatlong: LatLong = {
  lat: -6.1754,
  lng: 106.8272,
};
