import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

const AddJourney = () => {
    const [departureDate, setDepartureDate] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [departureStation, setDepartureStation] = useState("");
    const [returnStation, setReturnStation] = useState("");
    const [distance, setDistance] = useState("");
    const [duration, setDuration] = useState("");
    const [stations, setStations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {  // fetch all the stations so User can select departure and return stations
        const fetchStations = async () => {
            try {
                const response = await axios.get("/stations");
                setStations(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchStations();
    }, []);

    const getStationIdByName = (stationName) => { // gets the stationid by its name. we need the station id for the post method
        const station = stations.find((station) => station.nimi === stationName);
        return station ? station.stationid : null;
    };

    const handleClick = async (e) => {  // form submit
        e.preventDefault();
        
        try {

            // format everything and get the ID's ready
            const departureStationId = getStationIdByName(departureStation);
            const returnStationId = getStationIdByName(returnStation);
            const formattedDepartureDate = moment(departureDate).format('YYYY-MM-DD HH:mm:ss');
            const formattedReturnDate = moment(returnDate).format('YYYY-MM-DD HH:mm:ss');

            if (!departureStationId || !returnStationId) { // if there is no stationid for the station name that user chose, we return out of the form submit
                console.log("Invalid station name");
                return;
            }

            await axios.post("/journey/add", {
                formattedDepartureDate,
                formattedReturnDate,
                departureStationId,
                departureStation,
                returnStationId,
                returnStation,
                distance,
                duration,
            });
            navigate("/"); // goes to home page after successful submit
        } catch (err) {
            console.log(err);
        }
    };

    const calculateDuration = () => {  // calculates the duration based on departureDate and returnDate
        if (departureDate && returnDate) {
          const departureMoment = moment(departureDate);
          const returnMoment = moment(returnDate);
    
          const duration = moment.duration(returnMoment.diff(departureMoment));
          const durationInSeconds = duration.asSeconds();
    
          setDuration(durationInSeconds); // we need the duration in seconds
        }
    };

    return (
        <div className="add">
            <h1>Add new journey</h1>
            <div className="content">
                Departure date and time
                <input
                    type="datetime-local"
                    onChange={(e) => setDepartureDate(e.target.value)}
                    onBlur={calculateDuration}
                />
            </div>
            <div className="content">
                Return date and time
                <input
                    type="datetime-local"
                    onChange={(e) => setReturnDate(e.target.value)}
                    onBlur={calculateDuration}
                />
            </div>
            <div className="content">
                Departure station
                <select onChange={(e) => setDepartureStation(e.target.value)}>
                    <option value="">Select Departure Station</option>
                    {stations.map((station) => (
                        <option key={station.stationid} value={station.name}>
                            {station.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="content">
                Return station
                <select onChange={(e) => setReturnStation(e.target.value)}>
                    <option value="">Select Return Station</option>
                    {stations.map((station) => (
                        <option key={station.stationid} value={station.name}>
                            {station.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="content">
                Distance (metres):
                <input
                    type="number"
                    onChange={(e) => setDistance(e.target.value)}
                />
            </div>
            <div className="button">
                <button onClick={handleClick}>Publish</button>
            </div>
        </div>
    );
}

export default AddJourney;