import React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import ReactPaginate from "react-paginate";
import LoadingSpinner from "../components/LoadingSpinner";

const Journeys = () => {

    const [journeys, setJourneys] = useState([]);
    const [stations, setStations] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    const [pageNumber, setpageNumber] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    let limit = 10;

    useEffect(() => {
        const getJourneys = async () => {
          setIsLoading(true);
          const res = await axios.get(`journeys?_page=1&_limit=${limit}`);
          const total = res.headers.get("x-total-count");
          setpageCount(Math.ceil(total / limit));
          setJourneys(res.data);
          setIsLoading(false);
        };
    
        getJourneys();
    }, [limit]);

    const fetchJourneys = async (currentPage) => {
        setIsLoading(true);
        const res = await axios.get(`journeys?_page=${currentPage}&_limit=${limit}`);
        return res.data;
    };

    const handlePageClick = async (data) => {
        console.log(data.selected);
    
        let currentPage = data.selected + 1;
        setpageNumber(currentPage);
    
        const journeys = await fetchJourneys(currentPage);
        setIsLoading(false);
    
        setJourneys(journeys);
        // scroll to the top
        window.scrollTo(0, 0)
    };

    const calculateIndex = (currentPage, index) => {
        return (currentPage - 1) * limit + index + 1;
    };

    return (
        <div className="journeys">
            <h1>Journeys</h1>
            <table>
                <tbody>
                    <tr>
                        <th>#</th>
                        <th>Departure station name</th>
                        <th>Departure date</th>
                        <th>Return station name</th>
                        <th>Return date</th>
                        <th>Distance (kilometres)</th>
                        <th>Duration (minutes)</th>
                    </tr>
                    {isLoading ? (
                    <tr>
                        <td colSpan="7">
                            <LoadingSpinner/>
                        </td>
                    </tr>
                    ) : (
                    journeys.map((journey, index) => (
                        <tr key={journey.idjourney}>
                            <td>
                                <Link className="link" to={`/journey/${journey.idjourney}`}>
                                    {calculateIndex(pageNumber, index)}
                                </Link>
                            </td>
                            <td>{journey.departure_station_name}</td>
                            <td>
                            {moment(journey.departure_date, "YYYY-MM-DD HH:mm:ss").format(
                                "YYYY-MM-DD HH:mm:ss"
                            )}
                            </td>
                            <td>{journey.return_station_name}</td>
                            <td>
                            {moment(journey.return_date, "YYYY-MM-DD HH:mm:ss").format(
                                "YYYY-MM-DD HH:mm:ss"
                            )}
                            </td>
                            <td>{journey.distance / 1000}</td>
                            <td>{Math.trunc(journey.duration / 60)}</td>
                        </tr>
                    ))
                    )}                
                </tbody>
            </table>

            <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                pageCount={pageCount}
                onPageChange={handlePageClick}
                containerClassName={"paginationBttns"}
                previousLinkClassName={"previousBttn"}
                nextLinkClassName={"nextBttn"}
                disabledClassName={"paginationDisabled"}
                activeClassName={"paginationActive"}
            />
        </div>
    );      
};

export default Journeys;