import React, { Component } from "react";
import "./tokenDialog.css";
import { Trans } from "react-i18next";
import { TokenDialogProps, TokenDialogState } from "./interface";
import StorageUtil from "../../../utils/serviceUtils/storageUtil";
import toast from "react-hot-toast";
import { openExternalUrl } from "../../../utils/serviceUtils/urlUtil";
class TokenDialog extends Component<TokenDialogProps, TokenDialogState> {
  constructor(props: TokenDialogProps) {
    super(props);
    this.state = { isNew: false };
  }

  handleCancel = () => {
    this.props.handleTokenDialog(false);
  };
  handleTokenComfirm = () => {
    let token: string = (
      document.querySelector(".token-dialog-token-box") as HTMLTextAreaElement
    ).value;
    StorageUtil.setReaderConfig(`${this.props.driveName}_token`, token);
    this.props.handleTokenDialog(false);
    toast.success(this.props.t("Add Successfully"));
  };
  handleDavComfirm = () => {
    let url: string = (
      document.querySelector(".token-dialog-url-box") as HTMLTextAreaElement
    ).value;
    let username: string = (
      document.querySelector(
        ".token-dialog-username-box"
      ) as HTMLTextAreaElement
    ).value;
    let password: string = (
      document.querySelector(
        ".token-dialog-password-box"
      ) as HTMLTextAreaElement
    ).value;
    StorageUtil.setReaderConfig(
      `${this.props.driveName}_token`,
      JSON.stringify({ url, username, password })
    );
    this.props.handleTokenDialog(false);
    toast.success(this.props.t("Add Successfully"));
  };
  handleJump = (url: string) => {
    openExternalUrl(url);
  };
  render() {
    return (
      <div className="token-dialog-container">
        <div className="token-dialog-box">
          <div className="token-dialog-title">
            <Trans>Authorize</Trans>
            &nbsp;
            {this.props.driveName}&nbsp;
            <Trans>Token</Trans>
          </div>
          {this.props.driveName === "webdav" ? (
            <>
              <div
                className="token-dialog-info-text"
                style={
                  StorageUtil.getReaderConfig("lang") === "en"
                    ? { fontSize: "14px" }
                    : {}
                }
              >
                <Trans>Webdav Info</Trans>
              </div>
              <input
                type="text"
                name="username"
                placeholder={this.props.t("Server Address")}
                id="token-dialog-url-box"
                className="token-dialog-url-box"
              />
              <input
                type="text"
                name="username"
                placeholder={this.props.t("Username")}
                id="token-dialog-username-box"
                className="token-dialog-username-box"
              />
              <input
                type="text"
                name="username"
                placeholder={this.props.t("Password")}
                id="token-dialog-password-box"
                className="token-dialog-password-box"
              />
            </>
          ) : (
            <>
              <div
                className="token-dialog-info-text"
                style={
                  StorageUtil.getReaderConfig("lang") === "en"
                    ? { fontSize: "14px" }
                    : {}
                }
              >
                <Trans>
                  Please authorize your account, and fill the following box with
                  the token
                </Trans>
              </div>
              <div
                className="token-dialog-link-text"
                onClick={() => {
                  this.handleJump(this.props.url);
                }}
              >
                <Trans>Authorize</Trans>
              </div>
              <textarea className="token-dialog-token-box" />
            </>
          )}

          <div
            className="token-dialog-cancel"
            onClick={() => {
              this.handleCancel();
            }}
          >
            <Trans>Cancel</Trans>
          </div>
          <div
            className="token-dialog-comfirm"
            onClick={() => {
              if (this.props.driveName === "webdav") {
                this.handleDavComfirm();
              } else {
                this.handleTokenComfirm();
              }
            }}
          >
            <Trans>Confirm</Trans>
          </div>
        </div>
      </div>
    );
  }
}

export default TokenDialog;
