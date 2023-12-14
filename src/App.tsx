import { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import { Loader } from "./components/Loader";
import SearchBar from "./components/SearchBar";
import LeafSpectra from "./components/LeafSpectra";
import TraitsOverall from "./components/TraitsOverall";
import { searchSpectra } from "./helpers/api";
import theme from "./styles/theme";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "./App.css";
import { t, lang } from "./helpers/translations";

function App() {
  const [isSearching, setIsSearching] = useState(false);
  const [projectsSelected, setProjectsSelected] = useState([]);
  const [searchSpecies, setSearchSpecies] = useState([]);
  const [searchBarValue, setSearchBarValue] = useState([]);
  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchEndDate, setSearchEndDate] = useState("");
  const [searchSpectraIDs, setSearchSpectraIDs] = useState([]);
  const [geomFilter, setGeomFilter] = useState("");
  const [showSpectra, setShowSpectra] = useState(false);
  const [spFreq, setSpFreq] = useState({});
  const [searchIndex, setSearchIndex] = useState(0);
  const [showOverallTraits, setShowOverallTraits] = useState<boolean>(false);

  useEffect(() => {
    let mounted: boolean = true;
    setShowSpectra(false);
    if (searchBarValue.length === 0) {
      setSearchSpecies([]);
      setIsSearching(false);
    } else {
      const sp: any = searchBarValue.map((s: any) => s.id);
      setIsSearching(true);
      searchSpectra(
        sp,
        geomFilter,
        projectsSelected,
        searchStartDate,
        searchEndDate
      ).then((result: any) => {
        if (mounted) {
          let ids: any = [];
          let spFr: any = {};
          result.forEach((r: any) => {
            if (r.data.length > 0) {
              ids = ids.concat(r.data.map((s: any) => s.sample_id));
              spFr[r.data[0].scientific_name] = r.data.length;
            } else {
              setShowSpectra(true);
              setIsSearching(false);
            }
          });
          setSearchSpectraIDs(ids);
          setShowOverallTraits(true);
          setSpFreq(spFr);
          setSearchSpecies(sp);
        }
      });
      return () => (mounted = false);
    }
  }, [searchBarValue, searchIndex]);

  const searchButtonClicked = () => {
    setSearchIndex((old) => old + 1);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          marginBottom: "30vh",
        }}
      >
        <Grid container sx={{ width: "100%" }} justifyContent="center">
          <Grid item xs={8} lg={6}>
            <img
              alt="CABO logo"
              src="CABO_color.png"
              className="main-logo"
              style={{ width: "100%", maxWidth: "500px", position: "relative" }}
            />
          </Grid>
        </Grid>
        <SearchBar
          {...{
            setSearchBarValue,
            searchBarValue,
            spFreq,
            searchStartDate,
            searchEndDate,
            setSearchStartDate,
            searchButtonClicked,
            setSearchEndDate,
          }}
        />
        {isSearching && <Loader />}
        <LeafSpectra
          {...{
            whichSpectra: "main",
            searchSpecies,
            searchBarValue,
            showSpectra,
            setShowSpectra,
            setIsSearching,
            searchIndex,
          }}
        />
        <TraitsOverall
          {...{
            searchSpecies,
            searchSpectraIDs,
            showOverallTraits,
          }}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
