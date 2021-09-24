import React from 'react'

import { UnitCardContextProvider } from "./UnitCardContext";
import UnitCard from "./UnitCard";


export default function UnitCardProvider(props) {
  const handleCloseCard = () => {
    props.closeUnitCard()
  }

  return (
    <UnitCardContextProvider>
      <UnitCard
        closeCard={handleCloseCard}
        selectedUnit={props.selectedUnit}
      />
    </UnitCardContextProvider>
  )
}