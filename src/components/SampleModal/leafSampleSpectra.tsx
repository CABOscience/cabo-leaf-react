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
    showSpectra,
    setShowSpectra,
    setIsSearching,
    searchIndex,
  } = props;
  const [transmittance, setTransmittance] = useState(false);
  const [reflectance, setReflectance] = useState(true);
  const [spectraGraphId, setSpectraGraphId] = useState("sample-spectra");
  const [spectraData, setSpectraData] = useState([]);
  const [showRange, setShowRange] = useState(true);
  const [emptySpectra, setEmptySpectra] = useState(false);
  const [selectedLeaves, setSelectedLeaves] = useState(["1"]);

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

  const leafSelection = (index, sel) => {
    setSelectedLeaves(sel);
  };

  useEffect(() => {
    let which = reflectance ? "reflectance" : "none";
    which = transmittance ? "transmittance" : which;
    which = reflectance && transmittance ? "both" : which;
    spectra.drawBox(which, "main", "sample-spectra");
    let i = 1;
    //setIsSearching(false);
    //setShowSpectra(true);

    for (let i = 1; i <= 6; i++) {
      if (selectedLeaves?.includes(i.toString())) {
        const tl = spectraData.filter((t: any) => {
          return t.leaf_number == i;
        });
        spectra.meanLeafSpectra(tl, "sample-spectra", colors[i - 1]);
      }
    }
  }, [selectedLeaves, spectraData, reflectance, transmittance]);

  return (
    <>
      <Grow in={showSpectra && !emptySpectra} timeout={1000}>
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
              }}
            >
              <Typography
                sx={{ fontWeight: "bold", height: "35px", lineHeight: 2.5 }}
              >
                {t("leaf_spectra")}
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
                      onChange={(event) =>
                        setTransmittance(event.target.checked)
                      }
                    />
                  }
                  label={t("transmittance")}
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
                  label={t("ranges")}
                  labelPlacement="end"
                />
              </FormGroup>

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
                <FormControlLabel
                  value="end"
                  control={
                    <Switch
                      color="primary"
                      checked={showRange}
                      onChange={(event) => setShowRange(event.target.checked)}
                    />
                  }
                  label={t("ranges")}
                  labelPlacement="end"
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
                    height: "100%",
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
