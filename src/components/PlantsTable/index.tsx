import React, { useState, useEffect } from "react";
import { Button, Typography, Grid, Grow } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { t } from "../../helpers/translations";
import {
  CustomButtonCABO,
  CustomAutocomplete,
  CustomPaper,
} from "../../styles/customMUI";
import { theme } from "../../styles/theme";
import _ from "lodash";
import {
  downloadPlantSpectra,
  downloadSelectedPlantTraitsCSV,
} from "../../helpers/api";

const PlantsTable = (props) => {
  const [rows, setRows] = useState([]);
  const { plants, setOpenSampleModal, setClickedSample } = props;

  const [selectedRows, setSelectedRows] = React.useState<GridRowSelectionModel>(
    []
  );

  useEffect(() => {
    if (plants.length !== 0) {
      const rows = plants
        .filter(function (m) {
          return typeof m !== "undefined";
        })
        .map(function (m) {
          let ro = m;
          ro.id = m.plant_id;
          ro.scientific_name = m.scientific_name;
          ro.site =
            m.sites?.verbatim_site == null
              ? m.sites?.site_id
              : m.sites?.verbatim_site;
          return ro;
        });
      setRows(rows);
    }
  }, [plants]);

  const downloadSpectra = () => {
    downloadPlantSpectra(selectedRows);
  };

  const downloadTraits = () => {
    downloadSelectedPlantTraitsCSV(selectedRows);
  };

  const OpenDetailsButton = (params) => {
    const [count, setCount] = React.useState(0);

    return (
      <Button
        variant="contained"
        size="small"
        style={{ marginLeft: 16 }}
        tabIndex={params.hasFocus ? 0 : -1}
        onClick={() => {
          setClickedSample(params.params.id);
        }}
      >
        {t("details")}
      </Button>
    );
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Plant ID",
      width: 200,
      editable: false,
    },
    {
      field: "scientific_name",
      headerName: "Scientific name",
      width: 200,
      editable: true,
    },
    {
      field: "site",
      headerName: "Site name",
      type: "number",
      width: 200,
      editable: true,
    },
    {
      field: "edit",
      headerName: "",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 450,
      renderCell: (params: any) => (
        <>
          <OpenDetailsButton params={params} />
          {false && (
            <>
              <Button
                variant="contained"
                size="small"
                style={{ marginLeft: 16 }}
                tabIndex={params.hasFocus ? 0 : -1}
              >
                {t("download_spectra")}
              </Button>
              <Button
                variant="contained"
                size="small"
                style={{ marginLeft: 16 }}
                tabIndex={params.hasFocus ? 0 : -1}
              >
                {t("download_traits")}
              </Button>
            </>
          )}
        </>
      ),
    },
  ];

  const traitsColors = (index: number): string => {
    return props.store.state.basicColors[index];
  };

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarFilterButton />
        <Button variant="outlined" size="small" onClick={downloadSpectra}>
          <Typography sx={{ fontSize: "12px" }}>
            {t("download_selected_spectra")}
          </Typography>
        </Button>
        <Button variant="outlined" size="small" onClick={downloadTraits}>
          <Typography sx={{ fontSize: "12px" }}>
            {t("download_selected_traits")}
          </Typography>
        </Button>
      </GridToolbarContainer>
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
            slots={{
              toolbar: CustomToolbar,
            }}
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setSelectedRows(newRowSelectionModel);
            }}
            rowSelectionModel={selectedRows}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
          />{" "}
        </Grid>
      </Grid>
    </CustomPaper>
  );
};

export default PlantsTable;
