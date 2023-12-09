'use client'

import {  useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer, useGoogleMap } from "@react-google-maps/api";
import { useEffect, useRef, useState }  from "react";
import styles from "@/app/components/map.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";

import Notes from '@/app/components/notes'


export default function App() {
  // Set useState

  const [ costs, setCosts ] = useState([])
  const [ standTrad, setStandTrad ] = useState(0)
  const [ standMod, setStandMod ] = useState(0)
  const [ discTrad, setDiscTrad ] = useState(0)
  const [ discMod, setDiscMod ] = useState(0)
  const [ location, setLocation ] = useState(0)
  const [ metrics, setMetrics ] = useState(0)
  const [ center, setCenter ] = useState({ lat: 10.332615673533242, lng: 123.90974285444454 })
  const [ zoom, setZoom ] = useState(13)
  const [ routes, setRoutes ] = useState('')
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [ notesOpen, setNotesOpen ] = useState(false)

  // Others

  const cebuBounds = {
    north: 10.3597,
    south: 10.2257,
    east: 123.9227,
    west: 123.8001,
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBF8tm3ds5kJQ7l7VbQcqWQQZkUy1AFgKM",
    libraries: ["places"],
  });

  // Set useEffect

  useEffect(() => {
    const fetchCost = async () => {
      try {
        const res = await fetch('/api/get-cost')
        const result = await res.json()
        setCosts(result)
      } catch(error) {
        console.error(error)
      }
    }
    fetchCost()
  }, [])

  useEffect(() => {
    if (isLoaded) {
      geocoder.current = new window.google.maps.Geocoder()
    }
  }, [isLoaded])

  // Set useRef
  const geocoder = useRef(null)
  const originRef = useRef();
  const destiantionRef = useRef();

  // Set Functions

  async function getLoc(){
    try {
      const position = await new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(resolve, reject)
        } else {
          reject( new Error('Not Supported'))
        }
      })
      setCenter({ lat: position.coords.latitude, lng: position.coords.longitude })
      setZoom(16)
      setLocation(1)
      if (geocoder.current) {
        geocoder.current.geocode({ location: center}, (res, stat) => {
          if (stat === 'OK') {
            originRef.current.value = res[0].formatted_address
          }
        })
      }
    } catch (error) {
      console.error('Error getting location')
    }
  }

  async function calculateRoute() {
    if (originRef.current.value === "" || destiantionRef.current.value === "") {
      return;
    }

    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      travelMode: google.maps.TravelMode.TRANSIT,
    });

    setRoutes(' ')
    setLocation(0)
    setMetrics(1)
    setNotesOpen(false)

    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration.text)

    let route_codes = ''
    let standard_trad = 0, standard_modern = 0

    results.routes[0].legs[0].steps.forEach(e => {
      if (e.travel_mode === 'TRANSIT') {
        if (route_codes != '') {
          route_codes = route_codes + '>> '
        }
        if (e.transit.line.short_name === undefined) {
          route_codes = route_codes + 'CERES BUS'
        } else {
          pushRoute(e.transit.line.short_name)
          route_codes = route_codes + e.transit.line.short_name + ' '
        }
        const dist = e.distance.value / 1000
        standard_trad = standard_trad + costs[0].initprice + (Math.max(dist - 4, 0) * costs[0].priceperkm)
        standard_modern = standard_modern + costs[1].initprice + (Math.max(dist - 4, 0) * costs[1].priceperkm)
      }
    })



    setStandTrad(standard_trad)
    setDiscTrad(standard_trad * 0.8)
    setStandMod(standard_modern)
    setDiscMod(standard_modern * 0.8)
    setRoutes(route_codes === '' ? 'PLEASE START WALKING' : route_codes)
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    setLocation(0)
    setMetrics(0)
    setNotesOpen(false)
    originRef.current.value = "";
    destiantionRef.current.value = "";
  }

  async function pushRoute(data){
    try{
      const res = await fetch('/api/update-route',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    } catch (error) {
      console.error(error)
    }
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <button className={styles.location} onClick={getLoc}>
        <FontAwesomeIcon icon={faLocationCrosshairs} />
      </button>
      <div className={styles.overlay}>
        <div className={styles.inputContainer}>
          <Autocomplete bounds={cebuBounds}>
            <input
              type="text"
              placeholder="Start Point"
              ref={originRef}
              className={styles.textInput}
            />
          </Autocomplete>
          <Autocomplete bounds={cebuBounds}>
            <input
              type="text"
              placeholder="End Point"
              ref={destiantionRef}
              className={styles.textInput}
            />
          </Autocomplete>
          <button
            onClick={calculateRoute}
            className={styles.button}
            style={{ background: "var(--confirm)", color: "white" }}
          >
            Calculate
          </button>
          <button
            onClick={clearRoute}
            className={styles.button}
            style={{ background: "var(--error)", color: "white" }}
          >
            Clear
          </button>
        </div>
        <div className={metrics === 0 ? styles.hide : styles.metrics }>
          {/* Distance & Duration */}
          <div className={styles.tblHead}>
            <div className={styles.col_2}>
              <span className={styles.tblHeadtxt}>Distance</span>
            </div>
            <div className={styles.col_2}>
              <span className={styles.tblHeadtxt}>Duration</span>
            </div>
          </div>
          <div className={styles.tblCont}>
            <div className={styles.col_2}>
              <span className={styles.tbltxt}>{distance}</span>
            </div>
            <div className={styles.col_2}>
              <span className={styles.tbltxt}>{duration}</span>
            </div>
          </div>
          {/* Cost */}
          <div className={styles.tblHead}>
            <div className={styles.col_3}>

            </div>
            <div className={styles.col_3}>
              <span className={styles.tblHeadtxt}>Traditional</span>
            </div>
            <div className={styles.col_3}>
              <span className={styles.tblHeadtxt}>Modern</span>
            </div>
          </div>
          <div className={styles.tblCont}>
            <div className={styles.col_3}>
              <span className={styles.tbltxt}>Standard</span>
            </div>
            <div className={styles.col_3}>
              <span className={styles.tbltxt}>Php {standTrad.toFixed(2)}</span>
            </div>
            <div className={styles.col_3}>
              <span className={styles.tbltxt}>Php {standMod.toFixed(2)}</span>
            </div>
          </div>
          <div className={styles.tblCont}>
            <div className={styles.col_3}>
              <span className={styles.tbltxt}>Discount</span>
            </div>
            <div className={styles.col_3}>
              <span className={styles.tbltxt}>Php {discTrad.toFixed(2)}</span>
            </div>
            <div className={styles.col_3}>
              <span className={styles.tbltxt}>Php {discMod.toFixed(2)}</span>
            </div>
          </div>
          {/* Route Codes */}
          <div className={styles.tblHead}>
            <div className={styles.col_1}>
              <span className={styles.tblHeadtxt}>Route</span>
            </div>
          </div>
          <div className={styles.tblCont}>
            <div className={styles.col_1}>
              <span className={styles.tbltxt}>{routes}</span>
            </div>
          </div>
        </div>
      </div>
      <div className={notesOpen == true ? styles.overlay2 : styles.hide}>
        <Notes routeCodes={routes} />
      </div>
      <div className={styles.mapContainer}>
        {/* Google Map Box */}
        <GoogleMap center={center} zoom={zoom} mapContainerStyle={{ width: "100%", height: "100%" }} options={{
            zoomControl: false,
            streetViewControl:false,
            mapTypeControl: false,
            fullscreenControl: false, }}
          onLoad={(map) => setMap(map)}>
            <Marker position={location === 0 ? null : center} />
            {directionsResponse && ( <DirectionsRenderer directions={directionsResponse} /> )}
        </GoogleMap>
      </div>
    </div>
  );
}