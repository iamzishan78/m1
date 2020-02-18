import { memo,useRef} from 'react';
import { createPortal } from 'react-dom';

const Portal = ({ id, children }) => {
  const el = useRef(document.getElementById(id));
  //console.log('portal called',el.current)
  
  return createPortal(children, el.current);
};

export default memo(Portal);