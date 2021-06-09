
// this function is intended to convert a date to a presentable format 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faFilePdf,
	faFilePowerpoint,
	faFileWord,
	faFile,
	faFileExcel,
	faFileArchive,
	faFileCode,
	faFileImage,
} from "@fortawesome/free-solid-svg-icons";



export default function get_file_icon(value) {

    const getFileIcon = (fileExtension) => {
        switch (fileExtension) {
          case "pdf":
            return (
              <FontAwesomeIcon
                icon={faFilePdf}
                style={{ fontSize: "2rem", color: "#F15642" }}
              />
            );
          case "csv":
            return (
              <FontAwesomeIcon
                icon={faFileExcel}
                style={{ fontSize: "2rem", color: "#207244" }}
              />
            );
          case "xlsx":
            return (
              <FontAwesomeIcon
                icon={faFileExcel}
                style={{ fontSize: "2rem", color: "#207244" }}
              />
            );
          case "xlsb":
            return (
              <FontAwesomeIcon
                icon={faFileExcel}
                style={{ fontSize: "2rem", color: "#207244" }}
              />
            );
          case "xlsm":
            return (
              <FontAwesomeIcon
                icon={faFileExcel}
                style={{ fontSize: "2rem", color: "#207244" }}
              />
            );
          case "xltx":
            return (
              <FontAwesomeIcon
                icon={faFileExcel}
                style={{ fontSize: "2rem", color: "#207244" }}
              />
            );
          case "doc":
            return (
              <FontAwesomeIcon
                icon={faFileWord}
                style={{ fontSize: "2rem", color: "#2A5599" }}
              />
            )
          case "docx":
            return (
              <FontAwesomeIcon
                icon={faFileWord}
                style={{ fontSize: "2rem", color: "#2A5599" }}
              />
            );
          case "ppt":
            return (
              <FontAwesomeIcon
                icon={faFilePowerpoint}
                style={{ fontSize: "2rem", color: "#D04424" }}
              />
            );
          case "pptx":
            return (
              <FontAwesomeIcon
                icon={faFilePowerpoint}
                style={{ fontSize: "2rem", color: "#D04424" }}
              />
            );
            case "jpg"|| "jpeg"|| "png" || "bmp":
              return (
                <FontAwesomeIcon
                  icon={faFileImage}
                  style={{ fontSize: "2rem", color: "#4c6ef5" }}
                />
              );
            case "zip":
              return (
                <FontAwesomeIcon
                  icon={faFileArchive}
                  style={{ fontSize: "2rem", color: "#15aabf" }}
                />
              );
            case "shp":
              return (
                <FontAwesomeIcon
                  icon={faFileCode}
                  style={{ fontSize: "2rem", color: "#82c91e" }}
                />
              );
          default:
            // return <span>{fileExtension}</span>;
            return (
              <FontAwesomeIcon
                icon={faFile}
                style={{ fontSize: "2rem", color: "grey" }}
              />
            );
        }
      };


    return getFileIcon(value)
  }
  