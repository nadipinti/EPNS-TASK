import React, { useEffect, useState } from "react";
import axios from "axios";

function Countries() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [regionOptions, setRegionOptions] = useState();
  const [filteredData, setFilteredData] = useState(items);
  const [sortType, setSortType] = useState("ALF");
  const [regionType, setRegionType] = useState("all");

  const getCountries = () => {
    let regoptions = [];
    axios.get("https://restcountries.com/v3.1/all").then(
      (res) => {
      
        setIsLoaded(true);
        setItems(res.data);
        setFilteredData(
          res.data.sort((a, b) => a.name.common.localeCompare(b.name.common))
        );
        regoptions = [...new Set(res.data.map((item) => item.region))];
        setRegionOptions(regoptions);
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    );
  };
  useEffect(() => {
    getCountries();

  }, []);

  const handleRegion = (e) => {
    setRegionType(e.target.value);
    const filData = items.filter((data) => {
      if (data.region === e.target.value) {
        return data;
      }
    });
    setFilteredData(filData);
    if (e.target.value === "all") {
      setFilteredData(items);
    }
  };
  
  const sortArray = () => {
    let sorted = [];
    if (sortType === "population") {
      sorted = [...filteredData].sort((a, b) => a.population - b.population);
    }
    if (sortType === "ALF") {
      sorted = [...filteredData].sort((a, b) =>
        a.name.common.localeCompare(b.name.common)
      );
    }
    
    setFilteredData(sorted);
  };

  
  useEffect(() => {
    sortArray();
  }, [sortType, regionType]);

  return (
    <div className="App">
      <div className="filtersection">
        <label className="select_label">Filter : </label>
        <select className="country_select me-3" onChange={(e) => handleRegion(e)}>
          <option value="all">All</option>
          {regionOptions &&
            regionOptions.map((region) => (
              <option value={region}>{region}</option>
            ))}
        </select>
        <label className="select_label">Sort : </label>
        <select className="country_select" onChange={(e) => setSortType(e.target.value)}>
          <option value="ALF">A-Z</option>
          <option value="population">Population</option>
        </select>
      </div>
      {!isLoaded ? <h1>Loading Data...</h1> : null}
      <section className="grid">
        {filteredData &&
          filteredData.map((item, id) => (
            <div key={id}>
              <img src={item.flags.png} alt={""} />
              <div className="details">
                <h3 className="countryname">{item.name.common}</h3>

                <h4>
                  Population : <span>{item.population}</span>
                </h4>
                <h4>
                  Region : <span>{item.region}</span>
                </h4>
                <h4>
                  Capital : <span>{item.capital}</span>
                </h4>
              </div>
            </div>
          ))}
      </section>
    </div>
  );
}

export default Countries;

