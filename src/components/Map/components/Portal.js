import { memo,useRef} from 'react';
import { createPortal } from 'react-dom';

const PortalD = ({ id, children }) => {
  const el = useRef(document.getElementById(id));
  //console.log('portal called',el.current)
  if(el.current && children){
    return createPortal(children, el.current);
  }
  return
  
};

export default memo(PortalD);