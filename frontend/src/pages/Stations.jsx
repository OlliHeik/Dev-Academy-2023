import React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import ReactPaginate from "react-paginate";
import LoadingSpinner from "../components/LoadingSpinner";

const Stations = () => {

    const [stations, setStations] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    const [pageNumber, setpageNumber] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    let limit = 10;

    useEffect(() => {
        const getStations = async () => {
          setIsLoading(true);
          const res = await axios.get(`stations?_page=1&_limit=${limit}`);
          const total = res.headers.get("x-total-count");
          setpageCount(Math.ceil(total / limit));
          setStations(res.data);
          setIsLoading(false);
        };
    
        getStations();
    }, [limit]);

    const fetchStations = async (currentPage) => {
        setIsLoading(true);
        const res = await axios.get(`stations?_page=${currentPage}&_limit=${limit}`);
        return res.data;
    };

    const handlePageClick = async (data) => {
        console.log(data.selected);
    
        let currentPage = data.selected + 1;
        setpageNumber(currentPage);
    
        const stations = await fetchStations(currentPage);
        setIsLoading(false);
    
        setStations(stations);
        // scroll to the top
        window.scrollTo(0, 0)
    };

    const calculateIndex = (currentPage, index) => {
        return (currentPage - 1) * limit + index + 1;
    };

    return (
        <div className="stations">
            <h1>Stations</h1>
            <table>
                <tbody>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Address</th>
                        <th>City</th>
                        <th>Capacity</th>
                    </tr>
                    {isLoading ? (
                    <tr>
                        <td colSpan="5">
                            <LoadingSpinner/>
                        </td>
                    </tr>
                    ) : (
                    stations.map((station, index) => (
                    <tr key={station.FID}>
                        <td><Link className="link" to={`/station/${station.stationid}`}>{calculateIndex(pageNumber, index)}</Link></td>
                        <td>{station.name}</td>
                        <td>{station.osoite}</td>
                        <td>{station.kaupunki}</td>
                        <td>{station.kapasiteetti}</td>
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

export default Stations;