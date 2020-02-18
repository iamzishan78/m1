import React, { useEffect, useState } from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'

export default function WellProfileIcon(props) {
  const [letterPath, setLetterPath] = useState('')

  useEffect(() => {
    let h =
      'M24 30H17.924V17.1429H6.07595V30H0V0H6.07595V12.1566H17.924V0H24V30Z'
    if (props.letter === 'h') {
      setLetterPath(h)
    }
  }, [props.letter])

  return (
    <SvgIcon {...props}>
      <path d={letterPath} />
    </SvgIcon>
  )
}
