function clean(input) {
  const str = input + "";

  if (str === "") return 0;

  const replaced = str.replace(/[^0-9.-]/g, "");
  if (replaced === "-") return 0;
  else return parseFloat(replaced);
}

export function getMarkerPosition(watch, fallback) {
  if (fallback) return fallback;

  const lat = watch("lat");
  const lng = watch("lng");

  if (lat && lng)
    return {
      lat: clean(lat + ""),
      lng: clean(lng + ""),
    };

  return {
    lat: 0,
    lng: 0,
  };
}
