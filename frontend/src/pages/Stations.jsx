import React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import ReactPaginate from "react-paginate";
import LoadingSpinner from "../components/LoadingSpinner";

const SearchBar = ({ searchTable }) => {
    const [searchValue, setSearchValue] = useState("");
    const submitForm = (e) => {
      e.preventDefault();
      searchTable(searchValue);
    };
    return (
      <div className="search-bar">
        <form onSubmit={submitForm}>
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </form>
      </div>
    );
};

const Stations = () => {

    const [stations, setStations] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    const [pageNumber, setpageNumber] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    let limit = 10;

    useEffect(() => {
        const getStations = async () => {
          setIsLoading(true);
          const res = await axios.get(`stations/search?_page=1&_limit=${limit}&address_like=${searchValue}`);
          const total = res.headers.get("x-total-count");
          setpageCount(Math.ceil(total / limit));
          setStations(res.data);
          console.log(res.data);
          setIsLoading(false);
        };
    
        getStations();
    }, [limit, searchValue]);

    const fetchStations = async (currentPage) => {
        setIsLoading(true);
        const res = await axios.get(`stations/search?_page=${currentPage}&_limit=${limit}&address_like${searchValue}`);
        return res.data;
    };

    const searchTable = (newSearchValue) => {
        setSearchValue(newSearchValue);
    }

    const handlePageClick = async (data) => {
        //console.log(data.selected);
    
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
            <SearchBar searchTable={searchTable}/>
            <h1>Stations</h1> <h5>click on the number to view station</h5>
            <table className="table">
                <tbody>
                    <tr className="columns">
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
                        <td className="id"><Link className="link" to={`/station/${station.stationid}`}>{calculateIndex(pageNumber, index)}</Link></td>
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