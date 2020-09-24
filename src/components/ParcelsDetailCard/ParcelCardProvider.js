import React from 'react'

import { ParcelCardContextProvider } from "./ParcelCardContext";
import ParcelCard from "./ParcelCard";


export default function ParcelCardProvider(props) {
  const handleCloseCard = () => {
    props.closeParcelCard()
  }

  return (
    <ParcelCardContextProvider>
      <ParcelCard
        closeCard={handleCloseCard}
        selectedParcel={props.selectedParcel}
      />
    </ParcelCardContextProvider>
  )
}