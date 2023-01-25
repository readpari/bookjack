import React from "react";
import AddFavorite from "../../utils/readUtils/addFavorite";
import BookModel from "../../model/Book";
import { Trans } from "react-i18next";
import { BookListProps, BookListState } from "./interface";
import localforage from "localforage";
import { withRouter } from "react-router-dom";
import FileSaver from "file-saver";
import toast from "react-hot-toast";
class SelectBook extends React.Component<BookListProps, BookListState> {
  constructor(props: BookListProps) {
    super(props);
    this.state = {
      isOpenDelete: false,
      favoriteBooks: Object.keys(AddFavorite.getAllFavorite()).length,
    };
  }

  render() {
    return (
      <div
        className="booklist-manage-container"
        style={this.props.isCollapsed ? { left: "75px" } : {}}
      >
        <span
          onClick={() => {
            this.props.handleSelectBook(!this.props.isSelectBook);
            if (this.props.isSelectBook) {
              this.props.handleSelectedBooks([]);
            }
          }}
          className="book-manage-title"
        >
          <Trans>{this.props.isSelectBook ? "Cancel" : "Select"}</Trans>
        </span>
        {this.props.isSelectBook && (
          <>
            <span
              className="book-manage-title"
              onClick={() => {
                this.props.handleAddDialog(true);
              }}
            >
              <Trans>Add to Shelf</Trans>
            </span>
            <span
              className="book-manage-title"
              onClick={() => {
                this.props.handleDeleteDialog(true);
              }}
            >
              <Trans>Delete</Trans>
            </span>
            <span
              className="book-manage-title"
              onClick={() => {
                this.props.books
                  .filter(
                    (item: BookModel) =>
                      this.props.selectedBooks.indexOf(item.key) > -1
                  )
                  .forEach(async (item: BookModel) => {
                    let result: any = await localforage.getItem(item.key);

                    FileSaver.saveAs(
                      new Blob([result]),
                      item.name + `.${item.format.toLocaleLowerCase()}`
                    );
                  });
                this.props.handleSelectBook(!this.props.isSelectBook);
                if (this.props.isSelectBook) {
                  this.props.handleSelectedBooks([]);
                }
                toast.success(this.props.t("Export Successfully"));
              }}
            >
              <Trans>Export</Trans>
            </span>
            <span
              className="book-manage-title"
              onClick={() => {
                if (
                  this.props.selectedBooks.length === this.props.books.length
                ) {
                  this.props.handleSelectedBooks([]);
                } else {
                  this.props.handleSelectedBooks(
                    this.props.books.map((item) => item.key)
                  );
                }
              }}
            >
              {this.props.selectedBooks.length === this.props.books.length ? (
                <Trans>Deselect All</Trans>
              ) : (
                <Trans>Select All</Trans>
              )}
            </span>{" "}
          </>
        )}
      </div>
    );
  }
}

export default withRouter(SelectBook);
