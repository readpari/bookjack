import React from "react";
import "./popupMenu.css";
import PopupNote from "../popupNote";
import PopupOption from "../popupOption";
import PopupTrans from "../popupTrans";
import { PopupMenuProps, PopupMenuStates } from "./interface";
import StorageUtil from "../../../utils/serviceUtils/storageUtil";
import {
  getIframeDoc,
  getPDFIframeDoc,
} from "../../../utils/serviceUtils/docUtil";
let colors = ["#fac106", "#ebe702", "#0be603", "#0493e6"];
let lines = ["#FF0000", "#000080", "#0000FF", "#2EFF2E"];

declare var window: any;

class PopupMenu extends React.Component<PopupMenuProps, PopupMenuStates> {
  highlighter: any;
  timer!: NodeJS.Timeout;
  key: any;
  mode: string;
  showNote: boolean;
  isFirstShow: boolean;
  rect: any;
  constructor(props: PopupMenuProps) {
    super(props);
    this.showNote = false;
    this.isFirstShow = false;
    this.highlighter = null;
    this.mode = "";
    this.state = {
      deleteKey: "",
      rect: this.props.rect,
    };
  }

  componentDidMount() {
    this.props.rendition.on("rendered", () => {
      setTimeout(() => {
        this.handleRenderHighlight();
        this.props.handleRenderNoteFunc(this.handleRenderHighlight);
      }, 500);
    });
  }
  UNSAFE_componentWillReceiveProps(nextProps: PopupMenuProps) {
    if (nextProps.rect !== this.props.rect) {
      this.setState(
        {
          rect: nextProps.rect,
        },
        () => {
          this.openMenu();
        }
      );
    }
  }
  handleRenderHighlight = () => {
    new Promise<void>((resolve, reject) => {
      this.getHighlighter();
      resolve();
    }).then(() => {
      this.renderHighlighters();
    });
    let doc = getIframeDoc();
    if (!doc) return;
    doc.addEventListener("mousedown", this.openMenu);
    doc.addEventListener("touchend", this.openMenu);
    if (this.props.currentBook.format === "PDF") {
      setTimeout(() => {
        this.renderHighlighters();
      }, 1000);

      doc.addEventListener("wheel", () => {
        this.renderHighlighters();
      });
    }
  };
  //新建高亮
  getHighlighter = () => {
    let doc = getIframeDoc();
    if (!doc) return;
    this.highlighter = window.rangy.createHighlighter(doc);
    let classes = [
      "color-0",
      "color-1",
      "color-2",
      "color-3",
      "line-0",
      "line-1",
      "line-2",
      "line-3",
    ];
    classes.forEach((item) => {
      let config = {
        ignoreWhiteSpace: true,
        elementTagName: "span",
        elementProperties: {
          onclick: this.handleNoteClick,
        },
        onElementCreate: (element: any) => {
          element.dataset.key =
            this.key || this.props.notes[this.props.notes.length - 1].key;
        },
      };
      let applier = window.rangy.createClassApplier(item, config);
      this.highlighter.addClassApplier(applier);
    });
  };
  handleNoteClick = (event: any) => {
    let doc = getIframeDoc();
    if (!doc) return;
    this.props.handleMenuMode("note");
    let sel = doc.getSelection();
    if (!sel) return;
    let range = sel.getRangeAt(0);
    sel.removeAllRanges();
    sel.addRange(range);
    this.setState({ rect: range.getBoundingClientRect() }, () => {
      this.showMenu();
      this.handleClickHighlighter(event.currentTarget.dataset.key);
      event.stopPropagation();
    });
  };
  handlePDFClick = (event: any) => {
    this.props.handleMenuMode("note");
    this.setState({ rect: event.currentTarget.getBoundingClientRect() }, () => {
      this.showMenu();
      this.handleClickHighlighter(event.currentTarget.getAttribute("key"));
      event.stopPropagation();
    });
  };

  showPDFHighlight = (selected: any, colorCode: string, noteKey: string) => {
    let iWin = getPDFIframeDoc();
    if (!iWin) return;
    var pageIndex = selected.page;
    if (!iWin.PDFViewerApplication.pdfViewer) return;
    var page = iWin.PDFViewerApplication.pdfViewer.getPageView(pageIndex);
    if (page && page.div && page.textLayer && page.textLayer.textLayerDiv) {
      var pageElement =
        colorCode.indexOf("color") > -1
          ? page.textLayer.textLayerDiv
          : page.div;

      var viewport = page.viewport;
      selected.coords.forEach((rect) => {
        var bounds = viewport.convertToViewportRectangle(rect);
        var el = iWin.document.createElement("div");

        el?.setAttribute(
          "style",
          "position: absolute;" +
            (colorCode.indexOf("color") > -1
              ? "background-color: "
              : "border-bottom: ") +
            (colorCode.indexOf("color") > -1
              ? colors[colorCode.split("-")[1]]
              : `2px solid ${lines[colorCode.split("-")[1]]}`) +
            "; left:" +
            Math.min(bounds[0], bounds[2]) +
            "px; top:" +
            Math.min(bounds[1], bounds[3]) +
            "px;" +
            "width:" +
            Math.abs(bounds[0] - bounds[2]) +
            "px; height:" +
            Math.abs(bounds[1] - bounds[3]) +
            "px; z-index:0;"
        );
        el?.setAttribute("key", noteKey);
        el?.setAttribute("class", "pdf-note");
        el?.addEventListener("click", (event: any) => {
          this.handlePDFClick(event);
        });

        pageElement.appendChild(el);
      });
    }
  };

  handleClickHighlighter = (key: string) => {
    let dialog: HTMLInputElement | null = document.querySelector(".editor-box");
    if (!dialog) return;
    let note = this.props.notes.filter((item) => item.key === key)[0];
    if (note && note.notes) {
      dialog.value = note.notes;
    }
    dialog?.focus();
    this.props.handleNoteKey(key);
  };
  handleShowDelete = (deleteKey: string) => {
    this.setState({ deleteKey });
  };
  showMenu = () => {
    let rect = this.state.rect;
    if (!rect) return;
    this.props.handleChangeDirection(false);
    let page: any = { offsetLeft: 0 };
    if (this.props.currentBook.format !== "PDF") {
      page = document.getElementById("page-area");
      if (!page.clientWidth) return;
    }

    let height = 200;
    let x =
      this.props.currentBook.format === "PDF"
        ? rect.left
        : StorageUtil.getReaderConfig("readerMode") === "single"
        ? (rect.x % this.props.pageWidth) + page.offsetLeft
        : StorageUtil.getReaderConfig("readerMode") === "scroll"
        ? rect.left + page.offsetLeft
        : rect.x % this.props.pageWidth;
    let y = rect.y % this.props.pageHeight;
    let posX = x + rect.width / 2 - 20;
    //防止menu超出图书
    let rightEdge =
      this.props.menuMode === "note" || this.props.menuMode === "trans"
        ? this.props.pageWidth - 310 + page.offsetLeft * 2
        : this.props.pageWidth - 200 + page.offsetLeft * 2;
    let posY: number;
    //控制menu方向
    if (y < height) {
      this.props.handleChangeDirection(true);
      posY = y + 67;
    } else {
      posY = y - height / 2 - 57;
    }
    posX = posX > rightEdge ? rightEdge : posX;
    this.props.handleOpenMenu(true);
    let popupMenu = document.querySelector(".popup-menu-container");
    popupMenu?.setAttribute("style", `left:${posX}px;top:${posY}px`);
    this.setState({ rect: null });
  };
  //渲染高亮
  renderHighlighters = async () => {
    let highlighters: any = this.props.notes;
    if (!highlighters) return;
    let highlightersByChapter = highlighters.filter((item: any) => {
      return (
        (item.chapterIndex === this.props.chapterIndex ||
          item.chapter === this.props.chapter) &&
        item.bookKey === this.props.currentBook.key
      );
    });
    let pageArea = document.getElementById("page-area");
    if (!pageArea) return;
    let iframe = pageArea.getElementsByTagName("iframe")[0];
    if (!iframe || !iframe.contentWindow) return;
    let iWin = iframe.contentWindow || iframe.contentDocument?.defaultView;
    this.highlighter && this.highlighter.removeAllHighlights(); // 为了避免下次反序列化失败，必须先清除已有的高亮
    let classes = [
      "color-0",
      "color-1",
      "color-2",
      "color-3",
      "line-0",
      "line-1",
      "line-2",
      "line-3",
    ];
    highlightersByChapter &&
      highlightersByChapter.forEach((item: any) => {
        this.key = item.key;
        //控制渲染指定图书的指定高亮
        if (item.bookKey === this.props.currentBook.key) {
          try {
            if (this.props.currentBook.format === "PDF") {
              this.showPDFHighlight(
                JSON.parse(item.range),
                classes[item.color],
                item.key
              );
            } else {
              let temp = JSON.parse(item.range);
              temp = [temp];
              let doc = iframe.contentDocument;
              window.rangy
                .getSelection(iframe)
                .restoreCharacterRanges(doc, temp);
              this.highlighter.highlightSelection(classes[item.color]);
            }
          } catch (e) {
            console.warn(
              e,
              "Exception has been caught when restore character ranges."
            );
            return;
          }
        }
      });
    this.key = "";
    if (!iWin || !iWin.getSelection()) return;
    iWin.getSelection()?.empty(); // 清除文本选取
    // this.props.isOpenMenu &&
    //   window.rangy.deserializeSelection(serial, null, iWin); // （为了选取文本后不被上一行代码清除掉）恢复原本的文本选取
  };
  //控制弹窗
  openMenu = () => {
    this.setState({ deleteKey: "" });
    let pageArea = document.getElementById("page-area");
    if (!pageArea) return;
    let iframe = pageArea.getElementsByTagName("iframe")[0];
    if (!iframe) return;
    let doc = iframe.contentDocument;
    if (!doc) return;
    let sel = doc.getSelection();
    this.props.handleChangeDirection(false);
    // 如果 popmenu正在被展示，则隐藏
    if (this.props.isOpenMenu) {
      this.props.handleMenuMode("menu");
      this.props.handleOpenMenu(false);
      this.props.handleNoteKey("");
    }
    if (!sel) return;
    // 使弹出菜单更加灵活可控;
    if (sel.isCollapsed) {
      this.props.isOpenMenu && this.props.handleOpenMenu(false);
      this.props.handleMenuMode("menu");
      this.props.handleNoteKey("");
      return;
    }
    this.showMenu();
    this.props.handleMenuMode("menu");
  };
  //添加高亮
  handleHighlight() {
    let pageArea = document.getElementById("page-area");
    if (!pageArea) return;
    let iframe = pageArea.getElementsByTagName("iframe")[0];
    if (!iframe) return;
    let doc = iframe.contentDocument;
    if (!doc) return;
    let color = this.props.color;
    let classes = [
      "color-0",
      "color-1",
      "color-2",
      "color-3",
      "line-0",
      "line-1",
      "line-2",
      "line-3",
    ];
    if (!this.highlighter) return;
    this.highlighter.highlightSelection(classes[color]);
    this.props.handleMenuMode("menu");
    this.props.handleOpenMenu(false);

    doc.getSelection()?.empty();
    this.props.handleMenuMode("menu");
    this.highlighter && this.highlighter.removeAllHighlights();
    new Promise<void>((resolve) => {
      this.getHighlighter();
      resolve();
    }).then(() => {
      this.renderHighlighters();
    });
  }
  render() {
    if (this.props.menuMode === "highlight") {
      // this.getHighlighter();
      this.handleHighlight();
    }
    const PopupProps = {
      pageWidth: this.props.pageWidth,
      pageHeight: this.props.pageHeight,
      chapterIndex: this.props.chapterIndex,
      chapter: this.props.chapter,
    };
    return (
      <div>
        <div
          className="popup-menu-container"
          style={this.props.isOpenMenu ? {} : { display: "none" }}
        >
          <div className="popup-menu-box">
            {this.props.menuMode === "menu" ? (
              <PopupOption {...PopupProps} />
            ) : this.props.menuMode === "note" ? (
              <PopupNote {...PopupProps} />
            ) : this.props.menuMode === "trans" ? (
              <PopupTrans {...PopupProps} />
            ) : null}
            <span
              className="icon-close popup-close"
              onClick={() => {
                this.props.handleOpenMenu(false);
              }}
              style={this.props.isChangeDirection ? { top: "180px" } : {}}
            ></span>
          </div>
          {this.props.isChangeDirection ? (
            <span
              className="icon-popup popup-menu-triangle-up"
              style={
                this.props.menuMode === "highlight" ? { bottom: "110px" } : {}
              }
            ></span>
          ) : (
            <span className="icon-popup popup-menu-triangle-down"></span>
          )}
        </div>
      </div>
    );
  }
}

export default PopupMenu;
