import React, { useEffect, useState, useRef } from "react";
import {
  Grid,
  Paper,
  Typography,
  Grow,
  FormControlLabel,
  FormGroup,
  Switch,
  Button,
} from "@mui/material";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import { getCABOApi, getCABOApiMulti } from "../../helpers/api";
import * as d3 from "d3";
import spectra from "./spectra";
import { colors } from "../../helpers/constants";
import {
  CustomButtonCABO,
  CustomAutocomplete,
  CustomPaper,
} from "../../styles/customMUI";
import "./style.css";
import { theme } from "../../styles/theme";

export default function LeafSpectra(props: any) {
  const {
    spectraID,
    //searchSpecies,
    searchBarValue,
    whichSpectra,
    speciesList,
    showSpectra,
    setShowSpectra,
    setIsSearching,
  } = props;
  const [transmittance, setTransmittance] = useState(false);
  const [reflectance, setReflectance] = useState(true);
  const [spectraGraphId, setSpectraGraphId] = useState("spectraGraph");
  const [spectraData, setSpectraData] = useState([]);
  const [showRange, setShowRange] = useState(true);

  useEffect(() => {
    let ignore = false;
    const searchSpecies: any = searchBarValue.map((s: any) => s.id);
    spectra.clear("spectraGraph");
    if (searchSpecies.length !== 0) {
      setShowSpectra(true);
      if (whichSpectra === "main") {
        setSpectraGraphId("spectraGraph");
        if (searchSpecies.length > 0) {
          const paramObj = searchSpecies.map((sp: any) => ({ species: sp }));
          getCABOApiMulti("leaf_spectra_mean/search/", paramObj, "get")
            .then((result: any) => {
              if (!ignore && result) {
                setSpectraData(result);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    }
    /* if (
        state.current_spectra.spectra.length !== 0 &&
        state.current_spectra.which !== "none"
      ) {
        if (state.current_spectra.reBox == true) {
          spectra.clearSpectra();
          spectra.drawBox(state.current_spectra.which, "main-spectra");
        }
        spectra.clearBox();
        this.species_list = state.species_options.map((t) => {
          return t.scientific_name;
        });
        this.speciesSelected = state.species_selected;
        this.dataSpectra = state.current_spectra.spectra;
        this.which = state.current_spectra.which;
        this.showRange = state.current_spectra.showRange;
        this.animate = true;
        state.showSpectraGraph = true;
        spectra.callSpectra();
      } else if (state.current_spectra.which == "none") {
        spectra.clearBox();
      }
    } else {
      spectra.drawBox("reflectance", state.whichSpectra);
      spectra.meanLeafSpectra(
        state.current_spectra.spectra,
        "main-spectra",
        this.colors[0]
      );
    }
    */
    return () => {
      ignore = true;
    };
  }, [searchBarValue]);

  useEffect(() => {}, [reflectance, transmittance]);

  useEffect(() => {
    spectra.clear("spectraGraph");
    let which = reflectance ? "reflectance" : "none";
    which = transmittance ? "transmittance" : which;
    which = reflectance && transmittance ? "both" : which;
    spectra.drawBox(which, "main", "spectraGraph");
    if (spectraData?.length > 0) {
      let i = 1;
      setIsSearching(false);
      setShowSpectra(true);
      const searchSpecies: any = searchBarValue.map((s: any) => s.id);
      spectraData.forEach((s: any) => {
        if (s.data[0]) {
          const color =
            colors[searchSpecies.indexOf(s.data[0].scientific_name)];
          let animate = false;
          if (i == s.data.length) {
            animate = true;
          }
          spectra.meanLeafSpectra(s.data, "main", color, animate, showRange);
        }
        i++;
      });
    }
  }, [spectraData, reflectance, transmittance, showRange]);

  return (
    <Grow in={showSpectra} timeout={1000}>
      <CustomPaper
        elevation={3}
        sx={{ display: showSpectra ? "block" : "none" }}
      >
        <Grid
          container
          justifyContent="center"
          sx={{
            display: "block",
            paddingLeft: "0px",
            margin: "75px 0 0 0",
          }}
        >
          <Grid
            item
            xs={12}
            sx={{
              color: "white",
              height: "35px",
              backgroundColor: theme.palette.primary.main,
              width: "100%",
            }}
          >
            <Typography
              sx={{ fontWeight: "bold", height: "35px", lineHeight: 2.5 }}
            >
              Mean spectra
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <FormGroup aria-label="position" row sx={{}}>
              <FormControlLabel
                value="top"
                control={
                  <Switch
                    color="primary"
                    checked={reflectance}
                    onChange={(event) => setReflectance(event.target.checked)}
                  />
                }
                label="Reflectance"
                labelPlacement="end"
              />
              <FormControlLabel
                value="end"
                control={
                  <Switch
                    color="primary"
                    checked={transmittance}
                    onChange={(event) => setTransmittance(event.target.checked)}
                  />
                }
                label="Transmittance"
                labelPlacement="end"
              />
              <FormControlLabel
                value="end"
                control={
                  <Switch
                    color="primary"
                    checked={showRange}
                    onChange={(event) => setShowRange(event.target.checked)}
                  />
                }
                label="Ranges"
                labelPlacement="end"
              />
            </FormGroup>
            <Button
              sx={{ right: "10px", position: "absolute" }}
              startIcon={<DownloadForOfflineIcon />}
            >
              Download as CSV
            </Button>
          </Grid>
          <Grid item xs={6}>
            <div id="spectra-container" className="row">
              <div
                id={spectraGraphId}
                className="main-spectra-graph"
                style={{
                  width: "90%",
                  height: "100%",
                  position: "relative",
                }}
              ></div>
            </div>
          </Grid>
        </Grid>
      </CustomPaper>
    </Grow>
  );
}
