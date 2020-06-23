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

export default class Delete extends Component {
  static propTypes = {
    height: PropTypes.string,
  };

  static defaultProps = {
    height: "16px",
    predefinedClassName: "data-ex-icons-delete",
  };

  render() {
    return (
      <Base {...this.props}>
        <g transform="translate(8, 8)">
          <path d="M48 14.328 56.1 38.643 56.556 40.011 82.656 40.011 63.689 56.511 62.715 57.358 63.086 58.595 70.446 83.133 49.137 68.375 48 67.587 46.861 68.375 25.553 83.129 32.913 58.591 33.284 57.354 32.31 56.507 13.343 40.007 39.443 40.007 39.899 38.639ZM38 38.011 8 38.011 31 58.011 22 88.025 48 70.02 74 88.025 65 58.016 88 38.016 58 38.016 48 8Z" />
        </g>
      </Base>
    );
  }
}
