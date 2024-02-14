import { useState, useEffect, useRef } from "react";
import { Box, Grid, Grow, TextField, Alert } from "@mui/material";
import { Loader } from "./components/Loader";
import SearchBar from "./components/SearchBar";
import LeafSpectra from "./components/LeafSpectra";
import TraitsOverall from "./components/TraitsOverall";
import MapOverall from "./components/MapOverall";
import PlantsTable from "./components/PlantsTable";
import SampleModal from "./components/SampleModal";
import { CustomPaper } from "./styles/customMUI";
import { searchSpectra } from "./helpers/api";
import theme from "./styles/theme";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "./App.css";
import { getCABOApiMulti } from "./helpers/api";
import { t, lang } from "./helpers/translations";
import { InputOutlined, Check } from "@mui/icons-material";
import bcrypt from "bcryptjs";

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminClicked, setAdminClicked] = useState(false);
  const [plants, setPlants] = useState([]);
  const [showOverallTraits, setShowOverallTraits] = useState<boolean>(false);
  const [openSampleModal, setOpenSampleModal] = useState(false);
  const [clickedSample, setClickedSample] = useState("");
  const [traitSelection, setTraitSelection] = useState<number>(0);
  const ref1 = useRef(0);

  useEffect(() => {
    let mounted: boolean = true;
    setShowSpectra(false);
    setShowOverallTraits(false);
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
              ids = ids.concat(r.data.map((s: any) => s));
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
    }
    return () => {
      mounted = false;
    };
  }, [searchBarValue, searchIndex]);

  const searchButtonClicked = () => {
    setSearchIndex((old) => old + 1);
  };

  const accessibleSamples = () => {
    if (!isAdmin) {
      return searchSpectraIDs.filter((p: any) => {
        return p.permission == 1;
      });
    } else {
      return searchSpectraIDs;
    }
  };

  useEffect(() => {
    if (clickedSample) {
      setOpenSampleModal(true);
    }
  }, [clickedSample]);

  useEffect(() => {
    let ignore = false;
    if (searchSpectraIDs.length > 0) {
      getCABOApiMulti("plants_samples", accessibleSamples(), "get").then(
        (s) => {
          if (!ignore) {
            var pl: any = [];
            let plants = s.map((m) => m.data[0]);
            plants = plants.filter((s) => typeof s !== "undefined");
            var ids = plants.map((p) => {
              return p.fulcrum_id;
            });
            plants.map((p: any) => {
              var i = ids.indexOf(p.fulcrum_id);
              if (typeof pl[i] === "undefined") {
                pl[i] = p;
              } else {
                pl[i].bulk_leaf_samples.push(p.bulk_leaf_samples[0]);
              }
            });
            setPlants(pl);
          }
        }
      );
    }
    return () => {
      ignore = true;
    };
  }, [searchSpectraIDs]);

  const changePassword = (pass: string) => {
    bcrypt
      .compare(pass, import.meta.env.VITE_APP_CABO_PASSWORD)
      .then((res: any) => {
        if (res) {
          setIsAdmin(true);
          setAdminClicked(false);
        }
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          marginBottom: "30vh",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "10px",
            left: "10px",
            cursor: "pointer",
          }}
        >
          {(!adminClicked || isAdmin) && (
            <Box
              sx={{ color: isAdmin ? "green" : "black" }}
              onClick={() => setAdminClicked(true)}
            >
              admin
            </Box>
          )}
          {adminClicked && !isAdmin && (
            <TextField
              size="small"
              onChange={(e) => {
                changePassword(e.target.value);
              }}
              placeholder={t("password")}
            ></TextField>
          )}
        </Box>
        <Grid container sx={{ width: "100%" }} justifyContent="center">
          <Grid item xs={8} lg={6}>
            <img
              alt="CABO logo"
              src="/leaf/react/CABO_color.png"
              className="main-logo"
              style={{ width: "100%", maxWidth: "500px", position: "relative" }}
            />
          </Grid>
        </Grid>
        <SearchBar
          key="searchBar"
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
          key="leafSpectra"
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
        <Box
          sx={{ display: showSpectra && showOverallTraits ? "block" : "none" }}
        >
          <CustomPaper elevation={3}>
            <TraitsOverall
              ref={ref1}
              key="traitsOverall"
              {...{
                searchSpecies,
                searchSpectraIDs,
                showOverallTraits,
                type: "overall",
              }}
              traitSelection={traitSelection}
              setTraitSelection={setTraitSelection}
            />
          </CustomPaper>
        </Box>
        {showSpectra && (
          <Alert
            severity="success"
            sx={{ marginTop: "30px", fontSize: "large" }}
          >
            {`${accessibleSamples().length} plants can be explored`}
          </Alert>
        )}
        {showSpectra && accessibleSamples().length > 0 && (
          <MapOverall
            key="mapOverall"
            {...{
              searchSpecies,
              searchSpectraIDs,
              showOverallTraits,
              plants,
              setClickedSample,
              setOpenSampleModal,
            }}
          />
        )}
        {showSpectra && accessibleSamples().length > 0 && (
          <PlantsTable
            key="plantsTable"
            plants={plants}
            setClickedSample={setClickedSample}
            setOpenSampleModal={setOpenSampleModal}
            traitSelection={traitSelection}
          ></PlantsTable>
        )}
        <SampleModal
          openSampleModal={openSampleModal}
          setOpenSampleModal={setOpenSampleModal}
          clickedSample={clickedSample}
          plants={plants}
          searchSpecies={searchSpecies}
          traitSelection={traitSelection}
          setTraitSelection={setTraitSelection}
        ></SampleModal>
      </Box>
    </ThemeProvider>
  );
}

export default App;
