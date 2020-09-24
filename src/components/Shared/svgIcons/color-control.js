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

export default class ColorControl extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string,
  };

  static defaultProps = {
    height: "16px",
    predefinedClassName: "data-ex-icons-colorcontrol",
  };

  render() {
    return (
      <Base
        {...this.props}
        color={this.props.color ? this.props.color : ""}
      >
         <g transform="scale(3, 3)">
          <path d="M9.5602 0L10.4894 0C16.2733 0 20.9788 4.70555 20.9788 10.4894C20.9788 16.2733 16.2733 20.9788 10.4894 20.9788L9.5602 20.9788L9.5602 20.9372C4.21004 20.4653 0 15.9601 0 10.4894C0 5.01869 4.21004 0.51354 9.5602 0.0416283L9.5602 0ZM9.56019 1.9082C5.23642 2.37311 1.8584 6.04384 1.8584 10.489C1.8584 14.9343 5.23642 18.6049 9.56019 19.0699L9.56019 1.9082Z" id="Icon" fill={this.props.color} fillRule="evenodd" stroke="none" />
        </g>
      </Base>
    );
  }
}
