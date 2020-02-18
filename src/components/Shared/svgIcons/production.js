import React from 'react'

export default props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="33"
    height="25"
    fill="none"
    viewBox="0 0 33 25"
    className={props.className}
  >
    <path
      fill={props.color ? props.color : '#000'}
      fillOpacity={props.opacity ? props.opacity : '0.394'}
      fillRule="evenodd"
      d="M30.514 22.356l.005-21.094C30.519.587 27.78.036 24.333 0v22.356h-.759v-1.324l-3.255.75v.575h-.759V.327c-1.315.231-2.14.564-2.14.935l.008 21.094H15.46l.005-13.797c0-.698-2.932-1.264-6.55-1.264-.612 0-1.204.017-1.767.047v15.014H4.92l1.672-.385v-1.398l-2.396.552v1.231h-.559V7.811c-.798.21-1.27.468-1.27.748l.009 13.797H.43V25h32v-2.644h-1.917z"
      clipRule="evenodd"
    ></path>
  </svg>
)
