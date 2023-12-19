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
  const { plants } = props;
  const [markers, setMarkers] = useState([]);
  const [bounds, setBounds] = useState([]);

  useEffect(() => {
    if (plants.length > 0) {
      let b: any = [];
      const s = plants.filter(
        (s) =>
          typeof s !== "undefined" &&
          s.geometry !== null &&
          s.geometry.coordinates[1] !== 0
      );
      s.forEach((m: any) => {
        if (m.sites !== null) {
          m.site =
            m.sites.verbatim_site == null
              ? m.sites.site_id
              : m.sites.verbatim_site;
          m.geometry.coordinates = [
            m.geometry.coordinates[1],
            m.geometry.coordinates[0],
          ];
          b.push([m.geometry.coordinates[0], m.geometry.coordinates[1]]);
          let ids: any = [];
          m.bulk_leaf_samples.map((i: any) => {
            ids.push(i.sample_id);
          });
          m.sample_ids = ids.join(",");
        }
      });
      setMarkers(s);
      setBounds(b);
    }
  }, [plants]);

  const MyTileLayer = (props) => {
    const { markers, bounds } = props;
    const map = useMap();

    useEffect(() => {
      if (typeof window !== "undefined") {
        map.invalidateSize(false);
      }
      if (bounds.length > 0) {
        map.fitBounds(bounds);
      }
    }, [map, bounds]);

    return (
      <Container sx={{ width: "100%", height: "100%" }}>
        <MarkerClusterGroup chunkedLoading>
          {markers.map((geo: any, index) => (
            <Marker
              key={index}
              position={[
                geo.geometry.coordinates[0],
                geo.geometry.coordinates[1],
              ]}
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
            maxZoom={18}
            scrollWheelZoom={false}
            style={{ width: "100%", height: "450px" }}
          >
            <MyTileLayer markers={markers} bounds={bounds} />
          </MapContainer>
        </Grid>
      </Grid>
    </CustomPaper>
  );
};

export default MapOverall;
