export interface IBooleanRef {
  current: boolean;
}

export interface IMapViewRef {
  current: __esri.MapView | null;
}

export interface IProps {
  basemap?: __esri.MapProperties["basemap"];
  center: __esri.MapViewProperties["center"];
  zoom?: __esri.MapViewProperties["zoom"];
}

export interface IViewArgs {
  mapViewReady: boolean;
  mapViewRef: IMapViewRef;
  properties: __esri.MapViewProperties;
}
