import { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import { Loader } from "./components/Loader";
import SearchBar from "./components/SearchBar";
import LeafSpectra from "./components/LeafSpectra";
import { searchSpectra } from "./helpers/api";
import "./App.css";

function App() {
  const [isSearching, setIsSearching] = useState(false);
  const [projectsSelected, setProjectsSelected] = useState([]);
  const [searchBarValue, setSearchBarValue] = useState("");
  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchEndDate, setSearchEndDate] = useState("");
  const [searchSpectraIDs, setSearchSpectraIDs] = useState([]);
  const [geomFilter, setGeomFilter] = useState("");
  const [showSpectra, setShowSpectra] = useState(false);
  const [speciesSelected, setSpeciesSelected] = useState("");
  const [speciesList, setSpeciesList] = useState<Array<string>>([]);

  const searchButtonClicked = () => {
    searchSpectra(
      searchBarValue,
      geomFilter,
      projectsSelected,
      searchStartDate,
      searchEndDate
    ).then((result: any) => {
      const ids = result.map((s: any) => s.sample_id);
      setSearchSpectraIDs(ids);
    });
    setSpeciesSelected(searchBarValue);
    setSpeciesList([searchBarValue]);
  };

  return (
    <Box>
      <Grid container sx={{ maxWidth: "1000px" }} justifyContent="center">
        <Grid item xs={8} lg={6}>
          <img
            alt="CABO logo"
            src="CABO_color.png"
            className="main-logo"
            style={{ width: "100%", position: "relative" }}
          />
        </Grid>
      </Grid>
      <SearchBar
        {...{
          setSearchBarValue,
          searchBarValue,
          searchButtonClicked,
        }}
      />
      {isSearching && <Loader />}
      <LeafSpectra
        {...{
          whichSpectra: "main",
          speciesSelected,
          speciesList,
          showSpectra,
          setShowSpectra,
        }}
      />
    </Box>
  );
}

export default App;
