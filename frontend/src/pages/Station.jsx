import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const Station = () => {
    const [station, setStation] = useState({});
    const [totalStart, setTotalStart] = useState("");
    const [totalEnd, setTotalEnd] = useState("");
    const [averageStartDistance, setAverageStartDistance] = useState("");
    const [averageEndDistance, setAverageEndDistance] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams();


    // fetch all necessary data for single station using stationID from URL with react-router-dom useParams()
    useEffect(() => {
        const fetchData = async () => {
          try {
            setIsLoading(true);
            const res = await axios.get(`/station/${id}`);
            setStation(res.data.station);
            setTotalStart(res.data.totalStart);
            setTotalEnd(res.data.totalEnd);
            setAverageStartDistance(res.data.averageStartDistance);
            setAverageEndDistance(res.data.averageEndDistance);
            setIsLoading(false);
          } catch (err) {
            console.log(err);
          }
        };
        fetchData();
    }, [id]);  // this runs every time station id changes

    useEffect(() => {  // and this runs every time the station object changes
        const iframeData=document.getElementById("iframeId")
        iframeData.src=`https://maps.google.com/maps?q=${station.y},${station.x}&hl=es;&output=embed` // display station location using latitude and longitude from station table
    }, [station]);

    return (
        <div className="station">
          <div className="single">
            {isLoading ? (
              <div>
                <div>
                  <LoadingSpinner />
                </div>
                <div className="map">
                  <h1>Loading map...</h1>
                </div>
              </div>
            ) : (
              <div className="single">
                <h1>Station name: {station.nimi}</h1>
                <h1>Address: {station.osoite}</h1>
                <h1>Number of journeys starting from the station: {totalStart}</h1>
                <h1>Number of journeys ending from the station: {totalEnd}</h1>
                <h1>
                  Average distance of a journey starting from the station: {Math.trunc(averageStartDistance)} meters
                </h1>
                <h1>
                  Average distance of a journey ending at the station: {Math.trunc(averageEndDistance)} meters
                </h1>
              </div>
            )}
          </div>
          {!isLoading && (
            <div className="map">
              <h1>Location</h1>
              <iframe id="iframeId" height="500px" width="100%" title="Station Map"></iframe>
            </div>
          )}
        </div>
    );
      
};

export default Station;