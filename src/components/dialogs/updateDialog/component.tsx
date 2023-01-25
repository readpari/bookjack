import React from "react";
import "./updateInfo.css";
import { UpdateInfoProps, UpdateInfoState } from "./interface";
import packageInfo from "../../../../package.json";
import { Trans } from "react-i18next";
import axios from "axios";
import Lottie from "react-lottie";
import animationNew from "../../../assets/lotties/new.json";
import animationSuccess from "../../../assets/lotties/success.json";
import StorageUtil from "../../../utils/serviceUtils/storageUtil";
import { openExternalUrl } from "../../../utils/serviceUtils/urlUtil";
const newOptions = {
  loop: false,
  autoplay: true,
  animationData: animationNew,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
const successOptions = {
  loop: false,
  autoplay: true,
  animationData: animationSuccess,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

class UpdateInfo extends React.Component<UpdateInfoProps, UpdateInfoState> {
  constructor(props: UpdateInfoProps) {
    super(props);
    this.state = {
      updateLog: "",
      isUpdated: false,
    };
  }
  componentDidMount() {
    !this.props.currentBook.key &&
      axios
        .get(`https://koodo.960960.xyz/api/update?name=${navigator.language}`)
        .then((res) => {
          const newVersion = res.data.log.version;
          console.log(
            res,
            packageInfo.version,
            newVersion,
            packageInfo.version.localeCompare(newVersion)
          );

          setTimeout(() => {
            if (packageInfo.version.localeCompare(newVersion) < 0) {
              if (StorageUtil.getReaderConfig("isDisableUpdate") !== "yes") {
                this.setState({ updateLog: res.data.log });
                this.props.handleNewDialog(true);
              } else {
                this.props.handleNewWarning(true);
              }
            } else if (
              StorageUtil.getReaderConfig("version") !== newVersion &&
              StorageUtil.getReaderConfig("isFirst")
            ) {
              this.setState({ isUpdated: true });
              this.props.handleNewDialog(true);
              StorageUtil.setReaderConfig("version", newVersion);
            }
            StorageUtil.setReaderConfig(
              "appInfo",
              packageInfo.version.localeCompare(newVersion) < 0
                ? "new"
                : packageInfo.version.localeCompare(newVersion) === 0
                ? "stable"
                : "dev"
            );
          }, 500);
        })
        .catch((err) => {
          console.log(err);
        });
  }
  renderList = (arr: any[]) => {
    return arr.map((item, index) => {
      return (
        <li className="update-dialog-list" key={index}>
          <span>{index + 1 + ". "}</span>
          <span>{item}</span>
        </li>
      );
    });
  };

  handleClose = () => {
    this.setState({ updateLog: "", isUpdated: false });
    this.props.handleNewDialog(false);
  };

  render() {
    return (
      <>
        {(this.state.updateLog || this.state.isUpdated) &&
          this.props.isShowNew && (
            <div
              className="new-version"
              style={
                this.state.isUpdated
                  ? { height: "240px", top: "calc(50vh - 120px)" }
                  : {}
              }
            >
              <div className="new-version-title">
                {this.state.isUpdated ? (
                  <Trans>Update Complete</Trans>
                ) : (
                  <>
                    <Trans>Update to</Trans>
                    {" " + this.state.updateLog.version}
                  </>
                )}
              </div>
              <div
                className="setting-close-container"
                onClick={() => {
                  this.handleClose();
                }}
              >
                <span className="icon-close setting-close"></span>
              </div>
              {this.state.isUpdated && (
                <div className="update-info-text">
                  <Trans>You successfully update to</Trans>
                  {" " + packageInfo.version}
                </div>
              )}
              <div className="update-dialog-info" style={{ height: 420 }}>
                <div className="new-version-animation">
                  {this.state.isUpdated ? (
                    <Lottie
                      options={successOptions}
                      height={80}
                      width={80}
                      style={{ marginTop: "10px", marginBottom: "10px" }}
                    />
                  ) : (
                    <Lottie options={newOptions} height={220} width={220} />
                  )}
                </div>
                <div
                  className="new-version-open"
                  onClick={() => {
                    openExternalUrl(
                      this.state.isUpdated
                        ? "https://koodo.960960.xyz/en/log"
                        : "https://koodo.960960.xyz/en"
                    );
                  }}
                  style={this.state.isUpdated ? { marginTop: "10px" } : {}}
                >
                  {this.state.isUpdated ? (
                    <>
                      <Trans>Changelog</Trans>
                    </>
                  ) : (
                    <Trans>Download</Trans>
                  )}
                </div>
                {this.state.updateLog && (
                  <>
                    <p className="update-dialog-new-title">
                      <Trans>What's New</Trans>
                    </p>
                    <ul className="update-dialog-new-container">
                      {this.renderList(this.state.updateLog.new)}
                    </ul>
                    <p className="update-dialog-fix-title">
                      <Trans>What's been fixed</Trans>
                    </p>
                    <ul className="update-dialog-fix-container">
                      {this.renderList(this.state.updateLog.fix)}
                    </ul>
                  </>
                )}
              </div>
            </div>
          )}
      </>
    );
  }
}

export default UpdateInfo;
