import React, { useEffect, useState } from "react";
import {
  Grid,
  InputAdornment,
  TextField,
  Autocomplete,
  FilledInput,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  FormGroup,
  Button,
  ButtonGroup,
} from "@mui/material";
import { getCABOApi, getCABOApiMulti } from "../../helpers/api";
import * as d3 from "d3";
import spectra from "./spectra";
import { colors } from "../../helpers/constants";
import "./style.css";

export default function LeafSpectra(props: any) {
  const {
    spectraID,
    speciesSelected,
    whichSpectra,
    speciesList,
    showSpectra,
    setShowSpectra,
  } = props;
  const [transmittance, setTransmittance] = useState(false);
  const [reflectance, setReflectance] = useState(true);
  const [spectraGraphId, setSpectraGraphId] = useState("spectraGraph");

  useEffect(() => {
    if (whichSpectra === "main") {
      setSpectraGraphId("spectraGraph");
      spectra.drawBox("reflectance", "main", spectraGraphId);
      if (speciesSelected) {
        getCABOApiMulti("leaf_spectra_mean/search/", [speciesSelected])
          .then((result: any) => {
            let i = 1;
            result.forEach((s: any) => {
              if (
                s.data[0] &&
                speciesSelected.indexOf(s.data[0].scientific_name) !== -1
              ) {
                const color =
                  colors[speciesList.indexOf(s.data[0].scientific_name)];
                let animate = false;
                if (i == s.data.length) {
                  animate = true;
                }
                spectra.meanLeafSpectra(s.data, "main", color, animate);
                setShowSpectra(true);
              }
              i++;
            });
          })
          .catch((error) => {
            console.log(error);
          });
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
  }, [speciesSelected, speciesList]);
  return (
    <Grid container justifyContent="center">
      <Grid item xs={6}>
        {" "}
        {showSpectra && (
          <div id="spectra-container" className="row">
            <div
              id={spectraGraphId}
              className="main-spectra-graph"
              style={{ width: "100%", height: "100%" }}
            ></div>
          </div>
        )}
      </Grid>
    </Grid>
  );
}
