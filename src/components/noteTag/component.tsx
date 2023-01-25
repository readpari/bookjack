//笔记书摘的标签
import React from "react";
import "./noteTag.css";
import { NoteTagProps, NoteTagState } from "./interface";
import TagUtil from "../../utils/readUtils/tagUtil";
import DeleteIcon from "../deleteIcon";
import { Trans } from "react-i18next";

class NoteTag extends React.Component<NoteTagProps, NoteTagState> {
  constructor(props: NoteTagProps) {
    super(props);
    this.state = {
      tagIndex: [],
      isInput: false,
      deleteIndex: -1,
      isShowTags: false,
    };
  }
  componentDidMount() {
    if (this.props.isReading) {
      this.setState({ tagIndex: this.tagToIndex(this.props.tag) });
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps: NoteTagProps) {
    if (
      this.props.isReading &&
      nextProps.tag &&
      nextProps.tag.length > 0 &&
      this.props.tag !== nextProps.tag
    ) {
      this.setState({ tagIndex: this.tagToIndex(nextProps.tag) });
    }
  }
  tagToIndex = (tag: string[]) => {
    let temp: number[] = [];
    if (!tag) return [];
    for (let i = 0; i < TagUtil.getAllTags().length; i++) {
      if (tag.indexOf(TagUtil.getAllTags()[i]) > -1) {
        temp.push(i);
      }
    }
    return temp;
  };
  indextoTag = (tagIndex: number[]) => {
    let temp: any = [];
    for (let i = 0; i < tagIndex.length; i++) {
      temp.push(TagUtil.getAllTags()[tagIndex[i]]);
    }
    return temp;
  };
  handleChangeTag = (index: number) => {
    let temp: number[] = [...this.state.tagIndex];
    if (this.state.tagIndex.indexOf(index) > -1) {
      temp = [...this.state.tagIndex];
      let indexResult = temp.indexOf(index);
      temp.splice(indexResult, 1);
      this.setState({ tagIndex: temp });
      this.props.handleTag(this.indextoTag(temp));
    } else {
      temp.push(index);
      this.setState({ tagIndex: temp });
      this.props.handleTag(this.indextoTag(temp));
    }
  };
  handleAddTag = (event: any) => {
    this.setState({ isInput: false });
    if (!event.target.value) {
      return;
    }
    TagUtil.setTags(event.target.value);
    this.setState({ tagIndex: [] });
    this.props.handleTag(this.indextoTag([]));
  };
  handleInput = () => {
    this.setState({ isInput: true }, () => {
      document.getElementById("newTag")?.focus();
    });
  };
  handleShowTags = (bool: boolean) => {
    this.setState({ isShowTags: bool }, () => {
      if (document.querySelector(".card-list-container")) {
        (document.querySelector(".card-list-container") as any)?.setAttribute(
          "style",
          `height:calc(100% - ${
            (document.querySelector(".card-list-container") as any)?.offsetTop
          }px)`
        );
      }
    });
  };
  render() {
    const renderTag = () => {
      let noteTags = this.props.isCard ? this.props.tag : TagUtil.getAllTags();
      return noteTags.map((item: any, index: number) => {
        return (
          <li
            key={item}
            className={
              this.state.tagIndex.indexOf(index) > -1 && !this.props.isCard
                ? "tag-list-item active-tag "
                : "tag-list-item"
            }
          >
            <div className="delete-tag-container">
              {this.state.tagIndex.indexOf(index) > -1 &&
              !this.props.isReading &&
              !this.props.isCard ? (
                <DeleteIcon
                  {...{
                    tagName: item,
                    mode: "tags",
                    index: index,
                    handleChangeTag: this.handleChangeTag,
                  }}
                />
              ) : null}
            </div>
            <div
              className="center"
              onClick={() => {
                this.handleChangeTag(index);
              }}
            >
              <Trans>{item}</Trans>
            </div>
          </li>
        );
      });
    };
    return (
      <div
        className="note-tag-container"
        style={this.props.isReading ? { width: "1999px" } : {}}
      >
        {this.props.isReading || this.props.isCard ? null : (
          <div className="tag-title">
            <Trans>All Tags</Trans>
            <span
              className="icon-dropdown tag-dropdown-icon"
              onClick={() => {
                this.handleShowTags(!this.state.isShowTags);
              }}
              style={
                !this.state.isShowTags ? {} : { transform: "rotate(-90deg)" }
              }
            ></span>
          </div>
        )}

        {(this.state.isShowTags ||
          this.props.isReading ||
          this.props.isCard) && (
          <ul className="tag-container">
            {!this.props.isCard && (
              <li
                className="tag-list-item-new"
                onClick={() => {
                  this.handleInput();
                }}
                style={this.state.isInput ? { width: "80px" } : {}}
              >
                <div className="center">
                  {this.state.isInput ? (
                    <input
                      type="text"
                      name="newTag"
                      id="newTag"
                      onBlur={(event) => {
                        this.handleAddTag(event);
                      }}
                    />
                  ) : (
                    <span className="icon-add"></span>
                  )}
                </div>
              </li>
            )}
            {renderTag()}
          </ul>
        )}
      </div>
    );
  }
}
export default NoteTag;
