import React from 'react'
import UnitCard from "./Unit/UnitCard";
import AgreementCard from "./Agreement/AgreementCard";
import { agreementLayers } from 'components/Shared/functions/shapeLayer';


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
        agreementLayers.includes(props.type) && <AgreementCard
          closeCard={handleCloseCard}
          selectedShape={props.selectedShape}
        />
      }

    </>
  )
}