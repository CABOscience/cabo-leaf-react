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
        { ...paramObj, count: 10000 },
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
  paramArray: Array<string>,
  method: string = "get"
) => {
  let result;
  const base_url = import.meta.env.VITE_APP_CABO_API_SERVER as string;
  const headers = {
    Authorization: `Bearer ${import.meta.env.VITE_APP_CABO_API_TOKEN_ADMIN}`,
  };
  const gets = paramArray.map((p: any) =>
    axios
      .get(base_url + endpoint, {
        params: {
          species: p,
        },
        headers: headers,
      })
      .catch(function (error) {
        console.log(error);
      })
  );
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
  link.href = "/download/" + data.response.data;
  link.target = "_blank";
  link.setAttribute("download", "");
  document.body.appendChild(link);
  link.click();
};

export const searchSpectra = async (
  searchBarValue: string,
  geomFilter: string,
  projectsSelected: Array<string>,
  searchStartDate: string,
  searchEndDate: string
) => {
  if (
    searchBarValue.trim() !== "" ||
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
    return await getCABOApi(
      "leaf_spectra/search/taxa",
      {
        taxa: searchBarValue,
        start_date: searchStartDate,
        end_date: searchEndDate,
        geometry: geomFilter,
        projects: projects,
      },
      "post"
    );
  }
};
