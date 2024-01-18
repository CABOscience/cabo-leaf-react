import React, { useEffect, useState, useRef } from "react";
import {
  Grid,
  Paper,
  Typography,
  Grow,
  FormControlLabel,
  FormGroup,
  Switch,
  Container,
  Button,
  Checkbox,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from "@mui/material";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import { getCABOApi, getCABOApiMulti } from "../../helpers/api";
import * as d3 from "d3";
import spectra from "../LeafSpectra/spectra";
import { colors } from "../../helpers/constants";
import {
  CustomButtonCABO,
  CustomAutocomplete,
  CustomPaper,
} from "../../styles/customMUI";
import "./style.css";
import { theme } from "../../styles/theme";
import { t } from "../../helpers/translations";
import { downloadTaxaMeanCSV } from "../../helpers/api";

export default function LeafSampleSpectra(props: any) {
  const {
    selectedSample,
    //searchSpecies,
    searchBarValue,
    whichSpectra,
    speciesList,
    setIsSearching,
    searchIndex,
  } = props;
  const [transmittance, setTransmittance] = useState(false);
  const [reflectance, setReflectance] = useState(true);
  const [spectraGraphId, setSpectraGraphId] = useState("sample-spectra");
  const [spectraData, setSpectraData] = useState([]);
  const [showRange, setShowRange] = useState(true);
  const [emptySpectra, setEmptySpectra] = useState(false);
  const [selectedLeaves, setSelectedLeaves] = useState({
    "1": true,
    "2": false,
    "3": false,
    "4": false,
    "5": false,
    "6": false,
  });
  const [showSpectra, setShowSpectra] = useState(false);

  useEffect(() => {
    let ignore = false;
    spectra.clear("leafSpectraGraph");
    let ids = selectedSample.split(",");
    ids = ids.map((i) => parseInt(i));
    //headers.post["Content-Type"] ="application/x-www-form-urlencoded";
    getCABOApi(
      "leaf_spectra_raw/",
      {
        ids: ids,
      },
      "post"
    )
      .then((result) => {
        setSpectraData(result);
        if (result.length > 0) {
          setEmptySpectra(false);
        } else {
          setEmptySpectra(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return () => {
      ignore = true;
    };
  }, [selectedSample]);

  const downloadCSV = () => {
    const searchSpecies: any = searchBarValue.map((s: any) => s.id);
    downloadTaxaMeanCSV(searchSpecies);
  };

  const handleLeafCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedLeaves({
      ...selectedLeaves,
      [event.target.name]: event.target.checked,
    });
  };

  useEffect(() => {
    spectra.clear("sample-spectra");
    if (spectraData.length > 0) {
      let which = reflectance ? "reflectance" : "none";
      which = transmittance ? "transmittance" : which;
      which = reflectance && transmittance ? "both" : which;
      spectra.drawBox(which, "sample", "sample-spectra");
      let i = 1;
      //setIsSearching(false);
      setShowSpectra(true);

      Object.keys(selectedLeaves).map((l: any) => {
        if (selectedLeaves[l]) {
          const tl = spectraData.filter((t: any) => {
            return t.leaf_number == parseInt(l);
          });
          spectra.meanLeafSpectra(
            tl,
            "sample-spectra",
            colors[parseInt(l) - 1]
          );
        }
      });
    }
  }, [selectedLeaves, spectraData, reflectance, transmittance]);

  return (
    <>
      <Grow in={showSpectra && !emptySpectra} timeout={1000}>
        <CustomPaper
          elevation={0}
          sx={{
            margin: "0px auto",
          }}
        >
          <Grid
            container
            justifyContent="center"
            sx={{
              display: "block",
              paddingLeft: "0px",
              margin: "0px 0px 20px 20px ",
            }}
          >
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
                      onChange={(event) =>
                        setTransmittance(event.target.checked)
                      }
                    />
                  }
                  label={t("transmittance")}
                  labelPlacement="end"
                />
              </FormGroup>
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
                  control={
                    <Checkbox
                      defaultChecked
                      onChange={handleLeafCheck}
                      name="1"
                    />
                  }
                  label="1"
                />
                <FormControlLabel
                  control={<Checkbox onChange={handleLeafCheck} name="2" />}
                  label="2"
                />
                <FormControlLabel
                  control={<Checkbox onChange={handleLeafCheck} name="3" />}
                  label="3"
                />
                <FormControlLabel
                  control={<Checkbox onChange={handleLeafCheck} name="4" />}
                  label="4"
                />
                <FormControlLabel
                  control={<Checkbox onChange={handleLeafCheck} name="5" />}
                  label="5"
                />
                <FormControlLabel
                  control={<Checkbox onChange={handleLeafCheck} name="6" />}
                  label="6"
                />
              </FormGroup>
              <Button
                sx={{ right: "10px", position: "absolute" }}
                startIcon={<DownloadForOfflineIcon />}
                onClick={downloadCSV}
              >
                {t("download_csv")}
              </Button>
            </Grid>
            <Grid item xs={6}>
              <div id="spectra-container" className="row">
                <div
                  id={spectraGraphId}
                  className="sample-spectra-graph"
                  style={{
                    width: "90%",
                    height: "90%",
                    position: "relative",
                  }}
                ></div>
              </div>
            </Grid>
          </Grid>
        </CustomPaper>
      </Grow>
      {showSpectra && emptySpectra && (
        <Paper
          sx={{
            background: "white",
            color: theme.palette.primary.dark,
            maxWidth: "30vw",
            padding: "60px",
            border: `2px solid ${theme.palette.secondary.light}`,
            margin: "auto",
          }}
        >
          <Container>
            <Typography variant="h5">{t("no_spectra")}</Typography>
          </Container>
        </Paper>
      )}
    </>
  );
}
