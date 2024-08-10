import { useNavigate, useSearchParams } from 'react-router-dom'
import { MapContainer, TileLayer, Marker,Popup, useMap, useMapEvent } from 'react-leaflet';
import styles from './Map.module.css'
import { useEffect, useState } from 'react';
import { useCities } from '../contexts/Cities';
import { useGeolocation } from '../hooks/useGeolocation';
import Button from './Button';
import { useUrlPosition } from '../hooks/useUrlPosition';
function Map() {

    const {cities} = useCities();

    const [mapPosition, setMapPosition] = useState([40,0])
    
    const{
        isLoading : isLoadingLocation,
        position: geolocationPosition,
        getPosition
    } = useGeolocation()

    const {lat, lng} = useUrlPosition();

    useEffect(function (){
        if(lat && lng) {setMapPosition([lat, lng])}
    }, [lat, lng])


    useEffect(function (){
        if(geolocationPosition) {
            setMapPosition([geolocationPosition.lat, geolocationPosition.lng])
        }
    }, [geolocationPosition])


    return (
        <div className={styles.mapContainer}>
            { !geolocationPosition &&  <Button type='position' onClick={getPosition}>
                {isLoadingLocation ? '...loading' : 'use your current position'}
            </Button> }
            <MapContainer className={styles.map} center={mapPosition} zoom={13} scrollWheelZoom={true}>
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />
                {cities.map( (city) => (
                    <Marker key={city.id} position={[city.position.lat, city.position.lng]}>
                        <Popup>
                            <span>{city.emoji}</span>  <span>{city.cityName}</span>
                        </Popup>
                    </Marker>
                )
                )}
                <ChangeMapCenter position={mapPosition} />
                <DetectClick />
            </MapContainer>
        </div>
    )
}

function ChangeMapCenter({position}){
    const map = useMap()
    map.setView(position)
    return null;
}

function DetectClick(){
    const navigate = useNavigate()
    useMapEvent({
        click : e => {
            navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
        }
            
    })
}

export default Map
