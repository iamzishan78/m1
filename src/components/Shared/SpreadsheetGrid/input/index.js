import React, { useEffect, useState, useRef } from "react";
// import PropTypes from "prop-types";
import keys from "./../kit/keymap";

import styles from "./styles.css";

const SpreadsheetGridInput = (props) => {
  const input = useRef(null);
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(props.value)
  }, [props.value]);

  useEffect(() => {
    prepareFocus(props.focus);
  }, [props.focus]);

  const onKeyDown = (e) => {
    if (e.keyCode === keys.TAB) {
      e.preventDefault();
      input.current.blur();
    }
  };

  const onChange = (e) => {
    const value = e.target.value;
    setValue(value);
  };

  const onBlur = () => {
    if (props.onChange) {
      props.onChange(value);
    }
  };

  const prepareFocus = (focus) => {
    if (focus) {
      input.current.focus();
      input.current.selectionStart = value?.toString()?.length;
    } else if (input.current === document.activeElement) {
      input.current.blur();
    }
  };

  const onKeyPress = e => {
    // moving on to new row
    if (e.key === 'Enter') {
      props.addNewRow(null, props.gridRef);
    }
  };

  return (
    <input
      className="SpreadsheetGridInput"
      value={value}
      placeholder={props.placeholder}
      ref={input}
      onKeyDown={onKeyDown}
      onKeyPress={onKeyPress}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
};

export default SpreadsheetGridInput;

// class SpreadsheetGridInput1 extends React.PureComponent {
//     constructor(props) {
//       super(props);

//       this.onKeyDown = this.onKeyDown.bind(this);
//       this.onChange = this.onChange.bind(this);
//       this.onBlur = this.onBlur.bind(this);

//       this.state = {
//         props,
//         value: this.props.value,
//       };
//     }

//     static getDerivedStateFromProps(nextProps, prevState) {
//       if (nextProps !== prevState.props) {
//         return {
//           ...prevState,
//           props: nextProps,
//           value: nextProps.value,
//         };
//       }
//       return prevState;
//     }

//     componentDidMount() {
//       this.prepareFocus(this.props.focus);
//     }

//     componentDidUpdate(prevProps) {
//       // Don't touch focus if the state is updating
//       if (this.props !== prevProps) {
//         this.prepareFocus(this.props.focus);
//       }
//     }

//     onKeyDown(e) {
//       if (e.keyCode === keys.ENTER || e.keyCode === keys.TAB) {
//         e.preventDefault();
//         this.input.blur();
//       }
//     }

//     onChange(e) {
//       const value = e.target.value;

//       this.setState({
//         value,
//       });
//     }

//     onBlur() {
//       if (this.props.onChange) {
//         this.props.onChange(this.input.value);
//       }
//     }

//     prepareFocus(focus) {
//       if (focus) {
//         this.input.focus();
//         this.input.selectionStart = this.input.value.length;
//       } else if (this.input === document.activeElement) {
//         this.input.blur();
//       }
//     }

//     render() {
//       return (
//         <input
//           className="SpreadsheetGridInput"
//           value={this.state.value}
//           placeholder={this.props.placeholder}
//           ref={(input) => (this.input = input)}
//           onKeyDown={this.onKeyDown}
//           onChange={this.onChange}
//           onBlur={this.onBlur}
//         />
//       );
//     }
//   }