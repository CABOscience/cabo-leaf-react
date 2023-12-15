import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Container } from "@mui/material";
import TraitDensity from "../TraitDensity";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  useMap,
  Marker,
} from "react-leaflet";
import {
  CustomButtonCABO,
  CustomAutocomplete,
  CustomPaper,
} from "../../styles/customMUI";
import { theme } from "../../styles/theme";
import { t } from "../../helpers/translations";
import "/node_modules/leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster";

const MapOverall = (props) => {
  const MyTileLayer = () => {
    const map = useMap();

    useEffect(() => {
      if (typeof window !== "undefined") {
        map.invalidateSize(false);
      }
    }, [map]);

    return (
      <Container sx={{ width: "100%", height: "100%" }}>
        <MarkerClusterGroup chunkedLoading>
          {(addressPoints as AdressPoint).map((address, index) => (
            <Marker
              key={index}
              position={[address[0], address[1]]}
              title={address[2]}
              icon={customIcon}
            ></Marker>
          ))}
        </MarkerClusterGroup>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}"
        />
      </Container>
    );
  };

  return (
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
            {t("map_of_observations")}
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ height: "450px", width: "100%" }}>
          <MapContainer
            center={[45.5, -73.5]}
            zoom={10}
            scrollWheelZoom={false}
            style={{ width: "100%", height: "450px" }}
          >
            <MyTileLayer />
          </MapContainer>
        </Grid>
      </Grid>
    </CustomPaper>
  );
};

export default MapOverall;
