import React, { useEffect, useState, useRef } from "react";
import { Grid, Paper, Typography } from "@mui/material";
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
  const mounted = React.useRef(false);

  useEffect(() => {
    //setSpectraGraphId("spectraGraph");
    mounted.current = true;
    const searchSpecies: any = searchBarValue.map((s: any) => s.id);
    if (searchSpecies.length === 0) {
      spectra.clear("spectraGraph");
    } else {
      if (whichSpectra === "main") {
        setShowSpectra(true);
        spectra.drawBox("reflectance", "main", "spectraGraph");
        if (searchSpecies.length > 0) {
          const paramObj = searchSpecies.map((sp: any) => ({ species: sp }));
          getCABOApiMulti("leaf_spectra_mean/search/", paramObj, "get")
            .then((result: any) => {
              if (mounted.current) {
                let i = 1;
                setIsSearching(false);
                setShowSpectra(true);
                result.forEach((s: any) => {
                  if (s.data[0]) {
                    const color =
                      colors[searchSpecies.indexOf(s.data[0].scientific_name)];
                    let animate = false;
                    if (i == s.data.length) {
                      animate = true;
                    }

                    spectra.meanLeafSpectra(s.data, "main", color, animate);
                  }
                  i++;
                });
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
    return () => (mounted.current = false);
  }, [searchBarValue]);
  return (
    <>
      {showSpectra && (
        <CustomPaper elevation={3}>
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
                verticalAlign: "middle",
              }}
            >
              <Typography sx={{ fontWeight: "bold" }}>Mean spectra</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>Mean spectra</Typography>
            </Grid>
            <Grid item xs={6}>
              <div id="spectra-container" className="row">
                <div
                  id="spectraGraph"
                  className="main-spectra-graph"
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                  }}
                ></div>
              </div>
            </Grid>
          </Grid>
        </CustomPaper>
      )}
    </>
  );
}
