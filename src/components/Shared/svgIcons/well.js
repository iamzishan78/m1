import React from "react";

export default (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.small ? "24" : "30"}
    height={props.small ? "24" : "29"}
    fill="none"
    viewBox="0 0 30 29"
    className={props.className}
  >
    <path
      fill={props.color ? props.color : "#000"}
      fillOpacity={props.opacity ? props.opacity : "0.394"}
      d="M20.647 17.176l2.2 9.687H30V29H0v-2.137h14.79V14.956l-5.935-2.25-4.514 5.657-1.123-.425v2.312h1.437v4.782H3.22v-2.501H2.3v2.501H.866V20.25h1.437V17.59l-1.437-.544L7.368 0l3.508 1.328-.418 7.201 16.598 6.292 2.479 2.758-.973 2.597-.869-.33v2.395h2.06c.018.117.026.236.026.354 0 1.35-1.107 2.447-2.467 2.447s-2.467-1.098-2.467-2.447c0-.118.009-.237.026-.354h2.06v-2.683l-6.284-2.382zm-4.028-1.525v11.212h4.353l-2.377-10.465-1.98-.75.004.003z"
    ></path>
  </svg>
);
