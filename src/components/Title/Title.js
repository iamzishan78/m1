import React, { useContext } from "react";
import { TitleContext } from "./TitleContext";
import Card from "./components/card";
import ProjectList from "./components/projectsList";

export default function Title() {
  const [stateTitle] = useContext(TitleContext);


  return (
    <Card >
      {stateTitle.Projects.map((project, i) => {
        return <ProjectList key={i} project={project} />;
      })}
    </Card>
  );
}
