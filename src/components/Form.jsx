// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import "react-datepicker/dist/react-datepicker.css";

import { useEffect, useState } from "react";
import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Message from "./Message";
import Spinner from "./Spinner";
import { useCities } from "../contexts/Cities";
import DatePicker from "react-datepicker";

export function convertToEmoji(countryCode) {
  if (typeof countryCode !== 'string' || countryCode.length !== 2) {
    throw new Error('Invalid country code. Country code must be a two-letter string.');
  }

  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client?";

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const {lat , lng} = useUrlPosition();
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false)
  const [emoji, setEmoji] = useState('');
  const [geocodingError, setGeocodingError] = useState("");
  const {createCity, isLoading} = useCities()
  const navigate = useNavigate();

  

  useEffect(function () {

    async function fetchPositionData(){
      try{
        setIsLoadingGeocoding(true)
        setGeocodingError("");
        const res = await fetch(`${BASE_URL}latitude=${lat}&longitude=${lng}`)
        const data = await res.json()
        setCityName(data.city)
        setCountry(data.countryName)
        if (!data.countryCode){throw new Error("That dosent seem to be a city click somewhere else")}
        setEmoji(convertToEmoji(data.countryCode))

      }catch (err){
        setGeocodingError(err.message)
      } finally{
        setIsLoadingGeocoding(false)
      }
    }
    fetchPositionData();
  },[lat, lng])

  if(isLoadingGeocoding) return <Spinner />

  if (!lat && !lng) return <Message message="Start by clicking somewhere on map" />

  if(geocodingError) return <Message message={geocodingError} />

  async function handleSubmit(e) {
    e.preventDefault();

    if(!cityName || !date) return

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position : {lat , lng}
    }

    await createCity(newCity);
    navigate(-1);
  }

  return (
    <form className={`${styles.form} ${isLoading ? styles.loading : ''}`} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        {<span className={styles.flag}>{emoji}</span>}
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/*<input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        />*/}

        <DatePicker onChange={date => setDate(date)} selected={date} dateFormat='dd/MM/yyyy' />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type='primary'>Add</Button>
        <Button type='back' onClick={(e) => {
          e.preventDefault();
          navigate(-1);
        }}>&larr; Back</Button>
      </div>
    </form>
  );
}

export default Form;
