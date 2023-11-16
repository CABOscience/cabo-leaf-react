/* eslint-disable no-return-assign */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-bitwise */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import axios from "axios";

/**
 * function used to make any custom request
 * @param {*} endpoint
 * @param {*} paramObj
 * @returns
 */
export const getCABOApi = async (endpoint: string, paramObj: any) => {
  let result;
  const base_url = import.meta.env.VITE_APP_CABO_API_SERVER as string;
  const headers = {
    Authorization: `Bearer ${import.meta.env.VITE_APP_CABO_API_TOKEN_ADMIN}`,
  };

  try {
    result = await axios.get(`${base_url}${endpoint}`, {
      headers: headers,
      params: { ...paramObj, count: 10000 },
    });
  } catch (error) {
    result = { data: null };
  }
  return result.data;
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
