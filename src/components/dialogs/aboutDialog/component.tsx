import React from "react";
import { Trans } from "react-i18next";
import { AboutDialogProps, AboutDialogState } from "./interface";
import { isElectron } from "react-device-detect";
import { openExternalUrl } from "../../../utils/serviceUtils/urlUtil";

class AboutDialog extends React.Component<AboutDialogProps, AboutDialogState> {
  constructor(props: AboutDialogProps) {
    super(props);
    this.state = {};
  }
  handleJump = (url: string) => {
    openExternalUrl(url);
    this.props.handleAbout(false);
  };

  render() {
    return (
      <div
        className="sort-dialog-container"
        onMouseLeave={() => {
          this.props.handleAbout(false);
        }}
        onMouseEnter={() => {
          this.props.handleAbout(true);
        }}
        style={
          this.props.isNewWarning
            ? { left: "510px", width: "150px" }
            : {
                left: "510px",

                width: "150px",
              }
        }
      >
        <ul className="sort-by-category">
          <li
            className="sort-by-category-list"
            onClick={() => {
              this.props.handleSetting(true);
              this.props.handleAbout(false);
            }}
          >
            <Trans>Setting</Trans>
          </li>

          <li
            className="sort-by-category-list"
            onClick={() => {
              if (navigator.language.indexOf("zh") > -1) {
                this.handleJump(
                  "https://troyeguo.notion.site/Koodo-Reader-0c9c7ccdc5104a54825dfc72f1c84bea"
                );
              } else {
                this.handleJump(
                  "https://troyeguo.notion.site/Koodo-Reader-Document-9c767af3d66c459db996bdd08a34c34b"
                );
              }
            }}
          >
            <Trans>Help</Trans>
          </li>
          <li
            className="sort-by-category-list"
            onClick={() => {
              this.handleJump(`https://koodo.960960.xyz/en/support`);
            }}
          >
            <Trans>Feedback</Trans>
          </li>
          <li
            className="sort-by-category-list"
            onClick={() => {
              if (navigator.language.indexOf("zh") > -1) {
                this.handleJump(
                  "https://www.notion.so/troyeguo/215baeda57804fd29dbb0e91d1e6a021?v=360c00183d944b598668f34c255edfd7"
                );
              } else {
                this.handleJump(
                  "https://www.notion.so/troyeguo/d1c19a132932465bae1d89dd963c92ea?v=ca8aa69cf25849c18c92b92ba868663b"
                );
              }
            }}
          >
            <Trans>Roadmap</Trans>
          </li>
          <li
            className="sort-by-category-list"
            onClick={() => {
              this.handleJump("https://koodo.960960.xyz");
            }}
          >
            <Trans>Our Website</Trans>
          </li>
          <li
            className="sort-by-category-list"
            onClick={() => {
              this.handleJump(
                "https://poeditor.com/join/project?hash=fk4qbQTlsk"
              );
            }}
          >
            <Trans>Translation</Trans>
          </li>
          <li
            className="sort-by-category-list"
            onClick={() => {
              this.handleJump("https://github.com/troyeguo/koodo-reader");
            }}
          >
            <Trans>Github Repo</Trans>
          </li>
          {isElectron && (
            <li
              className="sort-by-category-list"
              onClick={() => {
                window
                  .require("electron")
                  .ipcRenderer.invoke("open-console", "ping");
              }}
            >
              <Trans>Open Console</Trans>
            </li>
          )}
          {this.props.isNewWarning && (
            <li
              className="sort-by-category-list"
              onClick={() => {
                this.handleJump("https://koodo.960960.xyz/en");
              }}
              style={{ color: "rgb(35, 170, 242)" }}
            >
              <Trans>New Version</Trans>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default AboutDialog;
