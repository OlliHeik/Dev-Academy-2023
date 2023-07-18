import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import ReactPaginate from "react-paginate";
import LoadingSpinner from "../components/LoadingSpinner";

const SearchBar = ({ searchTable }) => {  // simple searchbar component
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

const Journeys = () => {

    const [journeys, setJourneys] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    const [,setpageNumber] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [sorting, setSorting] = useState({ column: "idjourney", order: "asc"});
    const [searchValue, setSearchValue] = useState("");
    let limit = 10; // limit how many journeys per page

    const isDescSorting = sorting.column && sorting.order === "desc";
    const isAscSorting = sorting.column && sorting.order === "asc";
    const futureSortingOrder = isDescSorting ? "asc" : "desc";

    const sortTable = (newSorting) => {  // Update by which column we are sorting and if asc or desc
        setSorting(newSorting);
    }

    const searchTable = (newSearchValue) => {  // update search parameters
        setSearchValue(newSearchValue);
    }

    // fetch journeys with search and sorting 
    useEffect(() => {
        const getJourneys = async () => {
          setIsLoading(true);  // display loading spinner when fetching data
          const res = await axios.get(`journeys/search?_page=1&_limit=${limit}&_sort=${sorting.column}&_order=${sorting.order}&name_like=${searchValue}`);
          const total = res.headers.get("x-total-count");
          setpageCount(Math.ceil(total / limit));
          setJourneys(res.data);
          setIsLoading(false); // set to false to display data
        };
    
        getJourneys();
    }, [limit, sorting, searchValue]);  // useEffect runs every time these dependencies change

    // fetch journeys for the current page
    const fetchJourneys = async (currentPage) => {
        setIsLoading(true);
        const res = await axios.get(`journeys/search?_page=${currentPage}&_limit=${limit}&_sort=${sorting.column}&_order=${sorting.order}&name_like=${searchValue}`);
        return res.data;
    };

    const handlePageClick = async (data) => {
        let currentPage = data.selected + 1;
        setpageNumber(currentPage);
    
        const journeys = await fetchJourneys(currentPage);
        setIsLoading(false);
    
        setJourneys(journeys);
        // scroll to the top
        window.scrollTo(0, 0)
    };

    return (
        <div className="journeys">
            <SearchBar searchTable={searchTable} />
            <h1>Journeys</h1>
            <table>
                <tbody>
                    <tr className="columns">
                        <th
                        onClick={() => sortTable({ column: "idjourney", order: futureSortingOrder})}
                        > #
                        {isDescSorting && <span>▼</span>}
                        {isAscSorting && <span>▲</span>}
                        </th>
                        <th
                        onClick={() => sortTable({ column: "departure_station_name", order: futureSortingOrder})}
                        > Departure station name 
                        {isDescSorting && <span>▼</span>}
                        {isAscSorting && <span>▲</span>}
                        </th>
                        <th>Departure date </th>
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
                    journeys.map((journey) => (
                        <tr key={journey.idjourney}>
                            <td>
                                {journey.idjourney}
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