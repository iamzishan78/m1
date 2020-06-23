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

export default class Envelope extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string,
  };

  static defaultProps = {
    height: "16px",
    predefinedClassName: "data-ex-icons-email",
  };

  render() {
    return (
      <Base {...this.props}>
        <g transform="translate(8, 8)">
          <path d="M10 21v54h76V21zm40.122 34.464a3.01 3.01 0 01-4.244 0L13.431 23.017a.01.01 0 01.007-.017h69.124a.01.01 0 01.01.01.01.01 0 01-.003.007zM35.586 48L12.017 71.569a.01.01 0 01-.017-.007V24.438a.01.01 0 01.01-.01.01.01 0 01.007.003zM37 49.414l7.464 7.464a5 5 0 007.071 0h.001L59 49.414l23.569 23.569a.01.01 0 01-.007.017H13.438a.01.01 0 01-.01-.01.01.01 0 01.003-.007zM60.414 48l23.569-23.569a.01.01 0 01.017.007v47.124a.01.01 0 01-.01.01.01.01 0 01-.007-.003z" />
        </g>
      </Base>
    );
  }
}
