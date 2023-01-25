import React from "react";
import "./emptyCover.css";

const emptyCover = (props) => (
  <div className="empty-cover" style={{ transform: `scale(${props.scale})` }}>
    <div
      className="cover-banner"
      style={{
        backgroundColor:
          props.format === "PDF"
            ? "rgba(55, 170, 81, 0.7)"
            : props.format === "TXT"
            ? "rgba(251, 191, 16,1)"
            : props.format === "EPUB"
            ? "rgba(33, 165, 241,1)"
            : props.format === "MOBI"
            ? "rgba(255, 108, 110,1)"
            : props.format === "AZW3"
            ? " #ff9900"
            : props.format === "MD"
            ? "#5e7fff"
            : props.format === "DJVU"
            ? "#109870"
            : props.format === "FB2"
            ? "#0063b1"
            : props.format === "DOCX" || props.format === "RTF"
            ? " #6867d1"
            : props.format === "CBT" ||
              props.format === "CBZ" ||
              props.format === "CBR"
            ? "#00b6c2"
            : "rgba(104, 103, 209, 1)",
      }}
    >
      {props.format || "BOOK"}
    </div>
    <div
      className="cover-title"
      style={{ fontSize: props.scale === 1.15 ? "13px" : "" }}
    >
      {props.title}
    </div>
    <div className="cover-footer">Koodo Reader</div>
  </div>
);

export default emptyCover;
