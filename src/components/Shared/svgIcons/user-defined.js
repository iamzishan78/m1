// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, { Component } from "react";
import PropTypes from "prop-types";
import Base from "./base";

export default class UserDefined extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string,
  };

  static defaultProps = {
    height: "16px",
    predefinedClassName: "data-ex-icons-userdefined",
  };

  render() {
    return (
      <Base
        {...this.props}
        color={this.props.color ? this.props.color : ""}
      >
        <defs>
          <clipPath id="clip0">
            <path d="M341 165 391 165 391 223 341 223Z" fillRule="evenodd" clipRule="evenodd" />
          </clipPath>
        </defs>
        <g clipPath="url(#clip0)" transform="translate(-341 -165)">
          <path d="M348.5 178.5C348.5 175.186 351.186 172.5 354.5 172.5L378.5 172.5C381.814 172.5 384.5 175.186 384.5 178.5L384.5 202.5C384.5 205.814 381.814 208.5 378.5 208.5L354.5 208.5C351.186 208.5 348.5 205.814 348.5 202.5Z" stroke="#FFFFFF" strokeWidth="1.33333" strokeMiterlimit="8" fill="#FFFFFF" fillRule="evenodd" />
          <text fill="#00B0F0" fontFamily="Calibri,Calibri_MSFontService,sans-serif" fontWeight="400" fontSize="27" transform="translate(357.339 199)">U</text>
        </g>
      </Base>
    );
  }
}
