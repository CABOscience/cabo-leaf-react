import axios from "axios";

/**
 * function used to make any custom request
 * @param {*} endpoint
 * @param {*} paramObj
 * @returns
 */
export const getCABOApi = async (
  endpoint: string,
  paramObj: any,
  method: string = "get"
) => {
  let result;
  const base_url = import.meta.env.VITE_APP_CABO_API_SERVER as string;
  const headers = {
    Authorization: `Bearer ${import.meta.env.VITE_APP_CABO_API_TOKEN_ADMIN}`,
  };

  try {
    if (method === "get") {
      result = await axios.get(`${base_url}${endpoint}`, {
        headers: headers,
        params: { ...paramObj, count: 10000 },
      });
    } else {
      result = await axios.post(
        `${base_url}${endpoint}`,
        { ...paramObj },
        {
          headers: headers,
        }
      );
    }
  } catch (error) {
    result = { data: null };
  }
  return result.data;
};

export const getCABOApiMulti = async (
  endpoint: string,
  paramArray: Array<any>,
  method: string = "get"
) => {
  let result;
  const base_url = import.meta.env.VITE_APP_CABO_API_SERVER as string;
  const headers = {
    Authorization: `Bearer ${import.meta.env.VITE_APP_CABO_API_TOKEN_ADMIN}`,
  };
  let gets;
  if (method === "get") {
    gets = paramArray.map((p: any) =>
      axios
        .get(base_url + endpoint, {
          params: {
            ...p,
          },
          headers: headers,
        })
        .catch(function (error) {
          console.log(error);
        })
    );
  } else {
    gets = paramArray.map((p: any) =>
      axios
        .post(
          base_url + endpoint,
          {
            ...p,
          },
          {
            headers: headers,
          }
        )
        .catch(function (error) {
          console.log(error);
        })
    );
  }
  try {
    result = await axios.all(gets);
  } catch (error) {
    result = { data: null };
  }
  return result;
};

export const processCSVResponse = (data: any) => {
  //const url = window.URL.createObjectURL(new Blob([data.response.data]));
  const link = document.createElement("a");
  link.href = "https://data.caboscience.org/download/" + data;
  link.target = "_blank";
  link.setAttribute("download", "");
  document.body.appendChild(link);
  link.click();
};

export const searchSpectra = async (
  searchSpecies: Array<string>,
  geomFilter: string,
  projectsSelected: Array<string>,
  searchStartDate: string,
  searchEndDate: string
) => {
  if (
    searchSpecies.length !== 0 ||
    geomFilter !== "" ||
    projectsSelected.length === 0 ||
    searchStartDate !== ""
  ) {
    let pA: Array<string> = [];
    let projects = "";
    if (projectsSelected.length > 1) {
      projectsSelected.map((s) => {
        pA.push("'" + s + "'");
      });
      projects = pA.join(",");
    }
    const paramObj = searchSpecies.map((sp: any) => ({
      taxa: sp,
      start_date: searchStartDate,
      end_date: searchEndDate,
      geometry: geomFilter,
      projects: projects,
    }));
    return await getCABOApiMulti("leaf_spectra/search/taxa", paramObj, "post");
  }
};

export const downloadTaxaMeanCSV = async (species_selected: any) => {
  getCABOApi(
    "leaf_spectra/csv/",
    {
      taxa: species_selected,
      type: "mean",
    },
    "post"
  ).then((resp: any) => {
    const d = Date.now();
    processCSVResponse(resp);
  });
};

export const getAllTraits = async (sample_ids) => {
  let ids: any = [];
  sample_ids.map((s) => {
    ids.push("'" + s + "'");
  });
  ids = ids.join(",");
  return await getCABOApi(
    "traits/",
    {
      ids: ids,
      type: "raw",
    },
    "post"
  );
};

export const downloadSelectedPlantTraitsCSV = async (sample_ids) => {
  let ids = [];
  if (sample_ids.length == 1) {
    ids = sample_ids.split(",");
  } else {
    ids = sample_ids;
  }
  return await getCABOApi(
    "traits/csv/",
    {
      ids: ids,
      type: "raw",
    },
    "post"
  ).then((resp) => {
    const d = Date.now();
    processCSVResponse("cabo_selected_plant_traits_" + d + ".csv");
  });
};

export const downloadPlantSpectra = async (sample_ids) => {
  getCABOApi(
    "leaf_spectra/csv/",
    {
      ids: sample_ids,
      type: "raw",
    },
    "post"
  ).then((resp: any) => {
    processCSVResponse(resp);
  });
};
