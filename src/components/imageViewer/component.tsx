import React from "react";
import "./imageViewer.css";
import { ImageViewerProps, ImageViewerStates } from "./interface";
import FileSaver from "file-saver";
import { handleLinkJump } from "../../utils/readUtils/linkUtil";
import { getIframeDoc } from "../../utils/serviceUtils/docUtil";

class ImageViewer extends React.Component<ImageViewerProps, ImageViewerStates> {
  constructor(props: ImageViewerProps) {
    super(props);
    this.state = {
      isShowImage: false,
      imageRatio: "horizontal",
      zoomIndex: 0,
      rotateIndex: 0,
    };
  }

  componentDidMount() {
    this.props.rendition.on("rendered", () => {
      let doc = getIframeDoc();
      if (!doc) return;
      // StyleUtil.addDefaultCss();
      doc.addEventListener("click", this.showImage);
    });
  }

  showImage = (event: any) => {
    event.preventDefault();
    if (this.props.isShow) {
      this.props.handleLeaveReader("left");
      this.props.handleLeaveReader("right");
      this.props.handleLeaveReader("top");
      this.props.handleLeaveReader("bottom");
    }
    handleLinkJump(event);
    if (!event.target.src) {
      return;
    }
    if (this.state.isShowImage) {
      this.setState({
        isShowImage: false,
        zoomIndex: 0,
        rotateIndex: 0,
        imageRatio: "horizontal",
      });
    }
    event.preventDefault();
    const handleDirection = (direction: string) => {
      this.setState({ imageRatio: direction });
    };
    var img = new Image();
    img.addEventListener("load", function () {
      handleDirection(
        this.naturalWidth / this.naturalHeight > 1 ? "horizontal" : "vertical"
      );
    });
    img.src = event.target.src;
    let image: HTMLImageElement | null = document.querySelector(".image");
    if (image) {
      image!.src = event.target.src;
      this.setState({ isShowImage: true });
    }
  };
  hideImage = (event: any) => {
    event.preventDefault();
    if (event.target.src) {
      let image: HTMLImageElement | null = document.querySelector(".image");
      if (image) image.src = "";
    }
    this.setState({ isShowImage: false });
  };
  handleZoomIn = () => {
    let image: any = document.querySelector(".image");
    if (image.style.width === "200vw" || image.style.height === "200vh") return;
    this.setState({ zoomIndex: this.state.zoomIndex + 1 }, () => {
      if (this.state.imageRatio === "horizontal") {
        image.style.width = `${60 + this.state.zoomIndex * 10}vw`;
      } else {
        image.style.height = `${100 + 10 * this.state.zoomIndex}vh`;
        image.style.marginTop = `${10 * this.state.zoomIndex}vh`;
      }
    });
  };
  handleZoomOut = () => {
    let image: any = document.querySelector(".image");
    if (image.style.width === "10vw" || image.style.height === "10vh") return;
    this.setState({ zoomIndex: this.state.zoomIndex - 1 }, () => {
      if (this.state.imageRatio === "horizontal") {
        image.style.width = `${60 + this.state.zoomIndex * 10}vw`;
      } else {
        image.style.height = `${100 + 10 * this.state.zoomIndex}vh`;
      }
    });
  };
  handleSave = async () => {
    let image: any = document.querySelector(".image");
    let blob = await fetch(image.src).then((r) => r.blob());
    FileSaver.saveAs(blob, `${new Date().toLocaleDateString()}`);
  };
  handleClock = () => {
    let image: any = document.querySelector(".image");
    this.setState({ rotateIndex: this.state.rotateIndex + 1 }, () => {
      image.style.transform = `rotate(${this.state.rotateIndex * 90}deg)`;
    });
  };
  handleCounterClock = () => {
    let image: any = document.querySelector(".image");
    this.setState({ rotateIndex: this.state.rotateIndex - 1 }, () => {
      image.style.transform = `rotate(${this.state.rotateIndex * 90}deg)`;
    });
  };
  render() {
    return (
      <div
        className="image-preview"
        style={this.state.isShowImage ? {} : { display: "none" }}
      >
        <div
          className="image-background"
          style={
            this.state.isShowImage
              ? { backgroundColor: "rgba(75,75,75,0.3)" }
              : {}
          }
          onClick={(event) => {
            this.hideImage(event);
          }}
        ></div>
        <img
          src=""
          alt=""
          className="image"
          style={
            this.state.imageRatio === "horizontal"
              ? { width: "60vw" }
              : { height: "100vh" }
          }
        />
        <div className="image-operation">
          <span
            className="icon-zoom-in zoom-in-icon"
            onClick={() => {
              this.handleZoomIn();
            }}
          ></span>
          <span
            className="icon-zoom-out zoom-out-icon"
            onClick={() => {
              this.handleZoomOut();
            }}
          ></span>
          <span
            className="icon-save save-icon"
            onClick={() => {
              this.handleSave();
            }}
          ></span>
          <span
            className="icon-clockwise clockwise-icon"
            onClick={() => {
              this.handleClock();
            }}
          ></span>
          <span
            className="icon-counterclockwise counterclockwise-icon"
            onClick={() => {
              this.handleCounterClock();
            }}
          ></span>
        </div>
      </div>
    );
  }
}

export default ImageViewer;
