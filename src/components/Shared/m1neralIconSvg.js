import React from "react";

/* props is just a style object*/

const M1neralIconSvg = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size?.width || "50"}
      height={props.size?.height || "50"}
      // viewBox="0 0 11320 2490"
      viewBox="0 0 1700 2500"
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <path
          fill="#12ABE0"
          d="M1396 1823c-201 202-528 202-729 0-15-15-30-31-43-48l-366 366c14 16 29 31 44 47 403 402 1056 402 1459 0 356-356 397-908 124-1309l-379 378c80 188 43 413-110 566zm-839-163c-80-188-43-413 110-566 201-201 528-201 729 0 16 15 30 32 43 48l366-366c-14-16-29-31-44-47L1032 0 302 729c-356 356-397 908-124 1309l379-378zm292-384c101-100 264-100 365 0 101 101 101 264 0 365s-264 101-365 0c-100-101-100-264 0-365z"
        ></path>
      </g>
    </svg>
  );
};

export default M1neralIconSvg;
