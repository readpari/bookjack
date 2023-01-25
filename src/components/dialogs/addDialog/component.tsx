import React, { Component } from "react";
import ShelfUtil from "../../../utils/readUtils/shelfUtil";
import { Trans } from "react-i18next";
import { AddDialogProps, AddDialogState } from "./interface";
import "./addDialog.css";
import toast from "react-hot-toast";

class AddDialog extends Component<AddDialogProps, AddDialogState> {
  constructor(props: AddDialogProps) {
    super(props);
    this.state = { isNew: true, shelfTitle: "" };
  }

  handleCancel = () => {
    this.props.handleAddDialog(false);
  };
  handleComfirm = () => {
    const inputElement: HTMLInputElement = document.querySelector(
      ".add-dialog-new-shelf-box"
    ) as HTMLInputElement;
    if (!isNaN(parseInt(inputElement.value))) {
      toast(this.props.t("Shelf title can't be pure number"));
      return;
    }
    let shelfTitle: string = this.state.shelfTitle;
    let shelfList = ShelfUtil.getShelf();
    let shelfTitles = Object.keys(ShelfUtil.getShelf());
    let shelfIndex = this.state.isNew
      ? shelfTitles.length
      : shelfTitles.indexOf(inputElement.value);
    if (this.state.isNew) {
      shelfTitle = inputElement.value;
      if (shelfList.hasOwnProperty(shelfTitle)) {
        toast(this.props.t("Duplicate Shelf"));
        return;
      }
    }
    //未填书架名提醒
    if (!shelfTitle) {
      toast(this.props.t("Shelf Title is Empty"));
      return;
    }
    //判断书架中是否已有该图书
    if (
      shelfList[`${shelfTitle}`] &&
      shelfList[`${shelfTitle}`].indexOf(this.props.currentBook.key) > -1
    ) {
      toast(this.props.t("Duplicate Book"));
      return;
    }
    if (this.props.isSelectBook) {
      this.props.selectedBooks.forEach((item) => {
        ShelfUtil.setShelf(shelfTitle, item);
      });
      this.props.handleSelectBook(!this.props.isSelectBook);
      if (this.props.isSelectBook) {
        this.props.handleSelectedBooks([]);
      }
    } else {
      ShelfUtil.setShelf(shelfTitle, this.props.currentBook.key);
    }

    this.props.handleAddDialog(false);
    toast.success(this.props.t("Add Successfully"));
    this.props.handleActionDialog(false);
    this.props.handleMode("shelf");
    this.props.handleShelfIndex(shelfIndex);
  };
  //如果是添加到已存在的书架就diable新建图书的input框
  handleChange = (shelfTitle: string) => {
    if (shelfTitle === "New") {
      this.setState({ isNew: true });
    } else {
      this.setState({ shelfTitle });
      this.setState({ isNew: false });
    }
  };
  render() {
    const renderShelfList = () => {
      let shelfList = ShelfUtil.getShelf();
      let shelfTitle = Object.keys(shelfList);
      return shelfTitle.map((item) => {
        return (
          <option
            value={item}
            key={item}
            className="add-dialog-shelf-list-option"
          >
            {this.props.t(item)}
          </option>
        );
      });
    };
    return (
      <div className="add-dialog-container">
        <div className="add-dialog-title">
          <Trans>Add to Shelf</Trans>
        </div>
        <div className="add-dialog-shelf-list-container">
          <div className="add-dialog-shelf-list-text">
            <Trans>Select</Trans>
          </div>
          <select
            className="add-dialog-shelf-list-box"
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
              this.handleChange(event.target.value);
            }}
          >
            {renderShelfList()}
          </select>
        </div>
        <div className="add-dialog-new-shelf-container">
          <div className="add-dialog-new-shelf-text">
            <Trans>New Shelf</Trans>
          </div>
          <input
            className="add-dialog-new-shelf-box"
            disabled={!this.state.isNew}
          />
        </div>
        <div
          className="add-dialog-cancel"
          onClick={() => {
            this.handleCancel();
          }}
        >
          <Trans>Cancel</Trans>
        </div>
        <div
          className="add-dialog-comfirm"
          onClick={() => {
            this.handleComfirm();
          }}
        >
          <Trans>Confirm</Trans>
        </div>
      </div>
    );
  }
}

export default AddDialog;
