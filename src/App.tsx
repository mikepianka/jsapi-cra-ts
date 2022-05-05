import { useEffect, useMemo, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import "./App.css";
import { IBooleanRef, IMapViewRef, IProps, IViewArgs } from "./types";

// hook to set additional MapView properties after init
function useMapViewConfig({ mapViewReady, mapViewRef, properties }: IViewArgs) {
  const appliedViewConfig: IBooleanRef = useRef(false);

  useEffect(() => {
    const view = mapViewRef.current;

    if (appliedViewConfig.current) {
      console.debug(
        "--- View config already applied, did not set additional config"
      );
    }

    if (view && mapViewReady) {
      view.set(properties);
      appliedViewConfig.current = true;
      console.debug("+++ set additional View config");
    } else {
      console.debug("??? View not ready, cannot set additional config");
    }
  }, [mapViewReady, mapViewRef, properties]);
}

export default function App({
  basemap = "streets-vector",
  center,
  zoom = 13,
}: IProps) {
  /* setup to create the MapView --> */
  const mapDiv = useRef(null);
  const mapViewRef: IMapViewRef = useRef(null); // ref to store the MapView instance
  const [mapViewReady, setMapViewReady] = useState(false);

  useEffect(() => {
    if (!mapViewRef.current) {
      if (mapDiv.current) {
        mapViewRef.current = new MapView({
          container: mapDiv.current,
          map: new Map({ basemap }),
          center,
          zoom,
        });
        setMapViewReady(true);
        console.debug("+++ created MapView");
      } else {
        console.debug("??? container not ready, cannot add MapView");
      }
    } else {
      console.debug("--- MapView already initialized, did not add MapView");
    }
  }, [basemap, center, zoom]);
  /* <-- setup to create the MapView */

  /* apply some conditional view config for small screens --> */
  // set a state variable for whether it's a small screen or not
  const [smallscreen, setSmallscreen] = useState(false);

  // create a media query to detect a small screen and listen for changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 700px)");
    mediaQuery.addEventListener("change", (e) => setSmallscreen(e.matches));
    return () => {
      mediaQuery.removeEventListener("change", (e) =>
        setSmallscreen(e.matches)
      );
    };
  }, []);

  // create a memoized view config object to conditionally switch to the night basemap on small screens
  const mobileViewConfig = useMemo(
    () => ({
      map: {
        basemap: smallscreen ? "streets-night-vector" : basemap,
      },
    }),
    [basemap, smallscreen]
  );

  // apply the view config
  useMapViewConfig({ mapViewReady, mapViewRef, properties: mobileViewConfig });
  /* <-- apply some conditional view config for small screens */

  return <div id="mapDiv" ref={mapDiv}></div>;
}
