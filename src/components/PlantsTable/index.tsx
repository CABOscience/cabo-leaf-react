import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Tabs,
  Tab,
  Button,
  Typography,
  Grid,
  Table,
  TableCell,
  TableBody,
  Grow,
} from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import TraitsOverallTab from "../TraitsOverallTab";
import { getAllTraits } from "../../helpers/api";
import { traitsTable } from "../../helpers/constants";
import { t } from "../../helpers/translations";
import {
  CustomButtonCABO,
  CustomAutocomplete,
  CustomPaper,
} from "../../styles/customMUI";
import { theme } from "../../styles/theme";
import _ from "lodash";

const PlantsTable = (props) => {
  const [rows, setRows] = useState([]);
  const { plants } = props;

  useEffect(() => {
    if (plants.length !== 0) {
      const rows = plants
        .filter(function (m) {
          return typeof m !== "undefined";
        })
        .map(function (m) {
          let ro = m;
          let ids: any = [];
          m.bulk_leaf_samples.map((i: any) => {
            ids.push(i.sample_id);
          });
          ro.id = ids.join(",");
          ro.scientific_name = m.scientific_name;
          ro.site =
            m.sites.verbatim_site == null
              ? m.sites.site_id
              : m.sites.verbatim_site;
          ro.edit = <Button>Click</Button>;
          return ro;
        });
      setRows(rows);
    }
  }, [plants]);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "SampleIds",
      width: 250,
      editable: false,
    },
    {
      field: "scientific_name",
      headerName: "Scientific name",
      width: 250,
      editable: true,
    },
    {
      field: "site",
      headerName: "Site name",
      type: "number",
      width: 250,
      editable: true,
    },
    {
      field: "edit",
      headerName: "Edit",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
    },
  ];

  const traitsColors = (index: number): string => {
    return props.store.state.basicColors[index];
  };

  return (
    <>
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
              {t("traits")}
            </Typography>
          </Grid>
          <Grid item>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 15,
                  },
                },
              }}
              pageSizeOptions={[5]}
              checkboxSelection
              disableRowSelectionOnClick
            />{" "}
          </Grid>
        </Grid>
      </CustomPaper>
    </>
  );
};

export default PlantsTable;
