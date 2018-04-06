import React from 'react';
import {withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow} from 'react-google-maps';
import { AroundMarker} from "./AroundMarker";

class AroundMap extends React.Component {


    render() {
        const arrPos = [
            { lat: -34.297, lng: 150.644 },
            { lat: -34.397, lng: 150.544 },
            { lat: -34.400, lng: 150.644 },
        ];
        return (
            <GoogleMap
                defaultZoom={8}
                defaultCenter={{ lat: -34.397, lng: 150.644 }}
            >
                {arrPos.map((pos) => {
                    return <AroundMarker key={`${this.lat}${this.lng}`} pos={pos}/>
                })}
            </GoogleMap>
        );
    }
}

export const WrapAroundMap = withScriptjs(withGoogleMap(AroundMap));