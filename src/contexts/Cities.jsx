import { createContext, useState, useEffect, useContext, useReducer, useMemo, useCallback } from "react";

const CitiesContext = createContext();
const initialState = {
    cities: [],
    isLoading: false,
    currentCity: {}
}
function reducer(state, action){
    switch(action.type){
        case 'loading':
            return {...state, isLoading : true}
        case 'loaded':
            return {...state, isLoading: false}
        case 'cities/loaded':
            return {...state, isLoading : false, cities : action.payload}
        case 'currentCity/loaded':
            return {...state, isLoading : false, currentCity : action.payload}
        case 'city/created':
            return {...state, isLoading : false, cities: [...state.cities, action.payload], currentCity: action.payload}
        case 'city/deleted':
            return {...state, isLoading : false, cities: state.cities.filter(city => city.id !== action.payload), currentCity: {}};
        default:
            throw new Error ("unknonw error")
    }
}
function CitiesProvider({children}){
    const [{cities, isLoading, currentCity}, dispatch] = useReducer(reducer, initialState)
    // const [cities, setCities] =  useState([]);
    // // eslint-disable-next-line no-unused-vars
    // const [isLoading, setIsLoading] = useState(false);
    // const [currentCity, setCurrentCity] = useState({});

    useEffect(() => {
        async function fetchCities(){
            dispatch({type:'loading'})
        try{
            const res = await fetch('http://localhost:9000/cities');
            const data = await res.json();
            dispatch({type:'cities/loaded', payload : data})
        } catch {
            alert("error")
        } 
        }
        fetchCities();
    }, [])

    const getCity = useCallback((
        async function getCity(id){
            if(Number(id) === currentCity.id) return
            try{
                dispatch({type:'loading'})
                const res = await fetch(`http://localhost:9000/cities/${id}`);
                const data = await res.json();
                dispatch({type:'currentCity/loaded', payload : data})
            } catch {
                alert("error")
            } 
        }
    ), [currentCity.id])

    async function createCity(newCity){
        try{
            dispatch({type:'loading'})
            const res = await fetch(`http://localhost:9000/cities`, {
                method: "POST",
                body: JSON.stringify(newCity),
                headers : {
                    "Content-Type" : "application/json"
                },
            });
            const data = await res.json();
            dispatch({type:'city/created', payload: data});
        } catch {
            alert("error create city")
        }
    }
    async function deleteCity(id){
        try{
            dispatch({type:'loading'})
            const res = await fetch(`http://localhost:9000/cities/${id}`, {
                method: "DELETE",
            });
            dispatch({type:'city/deleted', payload: id});
        } catch {
            alert("error delete city")
        }
    }

    // const value = useMemo(() => , [])

    return (
        <CitiesContext.Provider
        value = {{
                cities,
                isLoading,
                currentCity,
                getCity,
                createCity,
                deleteCity,
        }}
        >
            {children}
        </CitiesContext.Provider>
    )
}


function useCities(){
    const context = useContext(CitiesContext)
    if(context === undefined) throw new Error("context used outside safe place")
    return context;
}

export {CitiesProvider, useCities}