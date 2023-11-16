import React from "react";

export const Loader = () => (
  <div className="loader">
    <svg
      className="loader"
      xmlns="http://www.w3.org/2000/svg"
      width="200px"
      height="200px"
      viewBox="0 0 100 100"
    >
      <circle cx="18" cy="63.8778" r="4" fill="#008bae">
        <animate
          attributeName="cy"
          values="34;66;34"
          keyTimes="0;0.5;1"
          dur="1s"
          calcMode="spline"
          keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
          begin="0s"
          repeatCount="indefinite"
        ></animate>
      </circle>
      <circle cx="27" cy="65.8997" r="4" fill="#0756a1">
        <animate
          attributeName="cy"
          values="34;66;34"
          keyTimes="0;0.5;1"
          dur="1s"
          calcMode="spline"
          keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
          begin="-0.125s"
          repeatCount="indefinite"
        ></animate>
      </circle>
      <circle cx="36" cy="60.9779" r="4" fill="#65318c">
        <animate
          attributeName="cy"
          values="34;66;34"
          keyTimes="0;0.5;1"
          dur="1s"
          calcMode="spline"
          keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
          begin="-0.25s"
          repeatCount="indefinite"
        ></animate>
      </circle>
      <circle cx="45" cy="46.9951" r="4" fill="#b92587">
        <animate
          attributeName="cy"
          values="34;66;34"
          keyTimes="0;0.5;1"
          dur="1s"
          calcMode="spline"
          keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
          begin="-0.375s"
          repeatCount="indefinite"
        ></animate>
      </circle>
      <circle cx="54" cy="36.1222" r="4" fill="#e7262b">
        <animate
          attributeName="cy"
          values="34;66;34"
          keyTimes="0;0.5;1"
          dur="1s"
          calcMode="spline"
          keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
          begin="-0.5s"
          repeatCount="indefinite"
        ></animate>
      </circle>
      <circle cx="63" cy="34.1003" r="4" fill="#f59121">
        <animate
          attributeName="cy"
          values="34;66;34"
          keyTimes="0;0.5;1"
          dur="1s"
          calcMode="spline"
          keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
          begin="-0.625s"
          repeatCount="indefinite"
        ></animate>
      </circle>
      <circle cx="72" cy="39.0221" r="4" fill="#f9ed2b">
        <animate
          attributeName="cy"
          values="34;66;34"
          keyTimes="0;0.5;1"
          dur="1s"
          calcMode="spline"
          keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
          begin="-0.75s"
          repeatCount="indefinite"
        ></animate>
      </circle>
      <circle cx="81" cy="53.0049" r="4" fill="#8bc442">
        <animate
          attributeName="cy"
          values="34;66;34"
          keyTimes="0;0.5;1"
          dur="1s"
          calcMode="spline"
          keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
          begin="-0.875s"
          repeatCount="indefinite"
        ></animate>
      </circle>
    </svg>
  </div>
);
