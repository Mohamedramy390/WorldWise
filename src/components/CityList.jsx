import CityItem from './CityItem';
import styles from './CityList.module.css'
import Spinner from './Spinner';
import Message from './Message'
import { useCities } from '../contexts/Cities';

function CityList() {

    const {cities, isLoading} = useCities();

    if(isLoading) return <Spinner />

    if(!cities.length) return <Message message="Click on a city on map" />
    return (
        <ul className={styles.cityList}>
            {cities.map(city => <CityItem key={city.id} city={city} />)}
        </ul>
    )
}

export default CityList
