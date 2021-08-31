import React from "react";

export default function DealComment(props) {
  const { id } = props;

  return (
    <div variant="outlined">
        Comment {id}
    </div>
  );
}
