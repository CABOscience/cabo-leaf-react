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
    leafSampleIds,
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
  const [spectraGraphId, setSpectraGraphId] = useState("leafSpectraGraph");
  const [spectraData, setSpectraData] = useState([]);
  const [showRange, setShowRange] = useState(true);
  const [emptySpectra, setEmptySpectra] = useState(false);

  useEffect(() => {
    let ignore = false;
    const searchSpecies: any = searchBarValue.map((s: any) => s.id);
    spectra.clear("leafSpectraGraph");
    let ids = leafSampleIds.split(",");
    ids = ids.map((i) => {
      return parseInt(i);
    });
    //headers.post["Content-Type"] ="application/x-www-form-urlencoded";
    getCABOApi(
      "leaf_spectra_raw/",
      {
        ids: ids,
      },
      "post"
    )
      .then((result) => {
        setSpectraData(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
    return () => {
      ignore = true;
    };
  }, [leafSampleIds]);

  useEffect(() => {
    spectra.clear("leafSpectraGraph");
    let which = reflectance ? "reflectance" : "none";
    which = transmittance ? "transmittance" : which;
    which = reflectance && transmittance ? "both" : which;
    const sl: any = spectraData.map((m: any) => m.data.length);
    if (sl.some((x: boolean) => x)) {
      setEmptySpectra(false);
      spectra.drawBox(which, "main", "spectraGraph");
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
    } else {
      setEmptySpectra(true);
      setShowSpectra(true);
      setIsSearching(false);
    }
  }, [spectraData, reflectance, transmittance, showRange]);

  const downloadCSV = () => {
    const searchSpecies: any = searchBarValue.map((s: any) => s.id);
    downloadTaxaMeanCSV(searchSpecies);
  };

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
                {t("mean_spectra")}
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
