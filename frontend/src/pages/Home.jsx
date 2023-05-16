import React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const Home = () => {

    const [journeys, setJourneys] = useState([]);
    const [stations, setStations] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("/journeys");
                setJourneys(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("/stations");
                setStations(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="home">
            <div className="journeys">
                <h1>Journeys</h1>
                {journeys.map((journey) => (
                    <div className="journey" key={journey.idjourney}>
                        <div className="content">
                            <Link className="link" to={`/journey/${journey.idjourney}`}>
                                <h1>{journey.distance}</h1>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
            <div className="stations">
                <h1>Stations</h1>
                {stations.map((station) => (
                    <div className="station" key={station.FID}>
                        <div className="content">
                            <Link className="link" to={`/station/${station.stationid}`}>
                                <h1>{station.nimi}</h1>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;