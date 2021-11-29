import React from 'react'
import UnitCard from "./Unit/UnitCard";
import AgreementCard from "./Agreement/AgreementCard";


export default function ShapeCardProvider(props) {
  const handleCloseCard = () => {
    props.closeUnitCard()
  }

  return (
    <>
      {
        props.type === 'unit' && <UnitCard
          closeCard={handleCloseCard}
          selectedShape={props.selectedShape}
        />
      }
      {
        props.type === 'agreement' && <AgreementCard
          closeCard={handleCloseCard}
          selectedShape={props.selectedShape}
        />
      }

    </>
  )
}