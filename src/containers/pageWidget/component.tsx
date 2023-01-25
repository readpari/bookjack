import React from "react";
import "./background.css";
import { BackgroundProps, BackgroundState } from "./interface";
import StorageUtil from "../../utils/serviceUtils/storageUtil";
import { Trans } from "react-i18next";
import RecordLocation from "../../utils/readUtils/recordLocation";
class Background extends React.Component<BackgroundProps, BackgroundState> {
  isFirst: Boolean;
  constructor(props: any) {
    super(props);
    this.state = {
      isSingle:
        StorageUtil.getReaderConfig("readerMode") &&
        StorageUtil.getReaderConfig("readerMode") !== "double",
      prevPage: 0,
      nextPage: 0,
      scale: StorageUtil.getReaderConfig("scale") || 1,
      isHideFooter: StorageUtil.getReaderConfig("isHideFooter") === "yes",
      isHideHeader: StorageUtil.getReaderConfig("isHideHeader") === "yes",
    };
    this.isFirst = true;
  }

  async UNSAFE_componentWillReceiveProps(nextProps: BackgroundProps) {
    if (nextProps.htmlBook !== this.props.htmlBook && nextProps.htmlBook) {
      await this.handlePageNum(nextProps.htmlBook.rendition);
      nextProps.htmlBook.rendition.on("page-changed", async () => {
        await this.handlePageNum(nextProps.htmlBook.rendition);
        await this.handleLocation();
      });
    }
  }
  handleLocation = async () => {
    let position = await this.props.htmlBook.rendition.getPosition();
    RecordLocation.recordHtmlLocation(
      this.props.currentBook.key,
      position.text,
      position.chapterTitle,
      position.count,
      position.percentage,
      position.cfi
    );
  };
  async handlePageNum(rendition) {
    let pageInfo = await rendition.getProgress();
    this.setState({
      prevPage: this.state.isSingle
        ? pageInfo.currentPage
        : pageInfo.currentPage * 2 - 1,
      nextPage: this.state.isSingle
        ? pageInfo.currentPage
        : pageInfo.currentPage * 2,
    });
  }

  render() {
    return (
      <div
        className="background"
        style={{
          color: StorageUtil.getReaderConfig("textColor")
            ? StorageUtil.getReaderConfig("textColor")
            : "",
        }}
      >
        <div className="header-container">
          {!this.state.isHideHeader && this.props.currentChapter && (
            <p
              className="header-chapter-name"
              style={
                this.state.isSingle
                  ? {
                      left: `calc(50vw - 
                      270px)`,
                    }
                  : {}
              }
            >
              {this.props.currentChapter}
            </p>
          )}
          {!this.state.isHideHeader &&
            this.props.currentChapter &&
            !this.state.isSingle && (
              <p
                className="header-book-name"
                style={
                  this.state.isSingle
                    ? {
                        right: `calc(50vw - 
                      270px)`,
                      }
                    : {}
                }
              >
                {this.props.currentBook.name}
              </p>
            )}
        </div>
        <div className="footer-container">
          {!this.state.isHideFooter && this.state.prevPage > 0 && (
            <p
              className="background-page-left"
              style={
                this.state.isSingle
                  ? {
                      left: `calc(50vw - 
                      270px)`,
                    }
                  : {}
              }
            >
              <Trans i18nKey="Book Page" count={this.state.prevPage}>
                Page
                {{
                  count: this.state.prevPage,
                }}
              </Trans>
            </p>
          )}
          {!this.state.isHideFooter &&
            this.state.nextPage > 0 &&
            !this.state.isSingle && (
              <p className="background-page-right">
                <Trans i18nKey="Book Page" count={this.state.nextPage}>
                  Page
                  {{
                    count: this.state.nextPage,
                  }}
                </Trans>
              </p>
            )}
        </div>
        <>
          {this.props.isShowBookmark ? <div className="bookmark"></div> : null}
        </>
      </div>
    );
  }
}

export default Background;
