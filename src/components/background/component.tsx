import React from "react";
import "./background.css";
import { BackgroundProps, BackgroundState } from "./interface";
import StorageUtil from "../../utils/serviceUtils/storageUtil";

class Background extends React.Component<BackgroundProps, BackgroundState> {
  isFirst: Boolean;
  constructor(props: any) {
    super(props);
    this.state = {
      isSingle:
        StorageUtil.getReaderConfig("readerMode") &&
        StorageUtil.getReaderConfig("readerMode") !== "double",
      scale: StorageUtil.getReaderConfig("scale") || 1,
    };
    this.isFirst = true;
  }
  componentDidMount() {
    let background = document.querySelector(".background");
    if (!background) return;
    background?.setAttribute(
      "style",
      `background-color:${
        StorageUtil.getReaderConfig("backgroundColor")
          ? StorageUtil.getReaderConfig("backgroundColor")
          : StorageUtil.getReaderConfig("appSkin") === "night" ||
            (StorageUtil.getReaderConfig("appSkin") === "system" &&
              StorageUtil.getReaderConfig("isOSNight") === "yes")
          ? "rgba(44,47,49,1)"
          : "rgba(255,255,255,1)"
      };filter: brightness(${
        StorageUtil.getReaderConfig("brightness") || 1
      }) invert(${StorageUtil.getReaderConfig("isInvert") === "yes" ? 1 : 0})`
    );
  }

  render() {
    return (
      <>
        <div
          className="background-box2"
          style={
            document.body.clientWidth < 570
              ? { left: 5, right: 8 }
              : this.state.isSingle
              ? {
                  left: `calc(50vw - ${
                    270 * parseFloat(this.state.scale)
                  }px - ${this.state.isSingle ? "9" : "5"}px)`,
                  right: `calc(50vw - ${
                    270 * parseFloat(this.state.scale)
                  }px - 7px)`,
                  boxShadow: "0 0 0px rgba(191, 191, 191, 1)",
                }
              : {}
          }
        ></div>

        <div
          className="background-box3"
          style={
            document.body.clientWidth < 570
              ? { left: 5, right: 10 }
              : this.state.isSingle
              ? {
                  left: `calc(50vw - ${
                    270 * parseFloat(this.state.scale)
                  }px - 9px)`,
                  right: `calc(50vw - ${
                    270 * parseFloat(this.state.scale)
                  }px - 9px)`,
                }
              : {}
          }
        >
          {(!StorageUtil.getReaderConfig("backgroundColor") &&
            (StorageUtil.getReaderConfig("appSkin") === "night" ||
              (StorageUtil.getReaderConfig("appSkin") === "system" &&
                StorageUtil.getReaderConfig("isOSNight") === "yes"))) ||
          StorageUtil.getReaderConfig("backgroundColor") ===
            "rgba(44,47,49,1)" ? (
            <div
              className="dark-spine-shadow-left"
              style={
                this.state.isSingle ||
                (StorageUtil.getReaderConfig("backgroundColor") &&
                  StorageUtil.getReaderConfig("backgroundColor").startsWith(
                    "#"
                  ))
                  ? { display: "none" }
                  : {}
              }
            ></div>
          ) : (
            <div
              className="spine-shadow-left"
              style={
                this.state.isSingle ||
                (StorageUtil.getReaderConfig("backgroundColor") &&
                  StorageUtil.getReaderConfig("backgroundColor").startsWith(
                    "#"
                  ))
                  ? { display: "none" }
                  : {}
              }
            ></div>
          )}
          <div
            className="book-spine"
            style={this.state.isSingle ? { display: "none" } : {}}
          ></div>
          {(!StorageUtil.getReaderConfig("backgroundColor") &&
            (StorageUtil.getReaderConfig("appSkin") === "night" ||
              (StorageUtil.getReaderConfig("appSkin") === "system" &&
                StorageUtil.getReaderConfig("isOSNight") === "yes"))) ||
          StorageUtil.getReaderConfig("backgroundColor") ===
            "rgba(44,47,49,1)" ? (
            <div
              className="dark-spine-shadow-right"
              style={
                StorageUtil.getReaderConfig("backgroundColor") &&
                StorageUtil.getReaderConfig("backgroundColor").startsWith("#")
                  ? { display: "none" }
                  : this.state.isSingle
                  ? {
                      position: "relative",
                      right: 0,
                    }
                  : {}
              }
            ></div>
          ) : (
            <div
              className="spine-shadow-right"
              style={
                StorageUtil.getReaderConfig("backgroundColor") &&
                StorageUtil.getReaderConfig("backgroundColor").startsWith("#")
                  ? { display: "none" }
                  : this.state.isSingle
                  ? {
                      position: "relative",
                      right: 0,
                    }
                  : {}
              }
            ></div>
          )}
        </div>

        <div
          className="background-box1"
          style={
            document.body.clientWidth < 570
              ? { left: 5, right: 6 }
              : this.state.isSingle
              ? {
                  left: `calc(50vw - ${
                    270 * parseFloat(this.state.scale)
                  }px - ${this.state.isSingle ? "9" : "5"}px)`,
                  right: `calc(50vw - ${
                    270 * parseFloat(this.state.scale)
                  }px - 5px)`,
                  boxShadow: "0 0 0px rgba(191, 191, 191, 1)",
                }
              : {}
          }
        ></div>
      </>
    );
  }
}

export default Background;
