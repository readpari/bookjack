import React from "react";
import "./booklist.css";
import BookCardItem from "../../../components/bookCardItem";
import BookListItem from "../../../components/bookListItem";
import BookCoverItem from "../../../components/bookCoverItem";
import AddFavorite from "../../../utils/readUtils/addFavorite";
import ShelfUtil from "../../../utils/readUtils/shelfUtil";
import SortUtil from "../../../utils/readUtils/sortUtil";
import BookModel from "../../../model/Book";
import { BookListProps, BookListState } from "./interface";
import StorageUtil from "../../../utils/serviceUtils/storageUtil";
import localforage from "localforage";
import Empty from "../../emptyPage";
import { Redirect, withRouter } from "react-router-dom";
import ViewMode from "../../../components/viewMode";
import { backup } from "../../../utils/syncUtils/backupUtil";
import { isElectron } from "react-device-detect";
import SelectBook from "../../../components/selectBook";
import ShelfSelector from "../../../components/shelfSelector";
class BookList extends React.Component<BookListProps, BookListState> {
  constructor(props: BookListProps) {
    super(props);
    this.state = {
      favoriteBooks: Object.keys(AddFavorite.getAllFavorite()).length,
    };
  }
  UNSAFE_componentWillMount() {
    if (this.props.mode === "trash") {
      this.props.handleFetchBooks(true);
    } else {
      this.props.handleFetchBooks(false);
    }
  }
  componentDidMount() {
    if (!this.props.books || !this.props.books[0]) {
      return <Redirect to="manager/empty" />;
    }
  }

  handleKeyFilter = (items: any[], arr: string[]) => {
    let itemArr: any[] = [];
    arr.forEach((item) => {
      items.forEach((subItem: any) => {
        if (subItem.key === item) {
          itemArr.push(subItem);
        }
      });
    });
    return itemArr;
  };

  //获取书架数据
  handleShelf(items: any, index: number) {
    //获取书架名
    if (index < 1) return items;
    let shelfTitle = Object.keys(ShelfUtil.getShelf());
    //获取当前书架名
    let currentShelfTitle = shelfTitle[index];
    if (!currentShelfTitle) return items;
    //获取当前书架的图书列表
    let currentShelfList = ShelfUtil.getShelf()[currentShelfTitle];
    //根据图书列表获取到图书数据
    let shelfItems = items.filter((item: { key: number }) => {
      return currentShelfList.indexOf(item.key) > -1;
    });
    return shelfItems;
  }

  //根据搜索图书index获取到搜索出的图书
  handleIndexFilter = (items: any, arr: number[]) => {
    let itemArr: any[] = [];
    arr.forEach((item) => {
      items[item] && itemArr.push(items[item]);
    });
    return itemArr;
  };
  renderBookList = () => {
    //根据不同的场景获取不同的图书数据

    let books = this.props.isSearch //搜索图书
      ? this.handleIndexFilter(this.props.books, this.props.searchResults)
      : this.props.shelfIndex > 0 //展示书架
      ? this.handleIndexFilter(
          this.handleShelf(this.props.books, this.props.shelfIndex),
          //返回排序后的图书index
          SortUtil.sortBooks(this.props.books, this.props.bookSortCode) || []
        )
      : this.props.mode === "favorite"
      ? this.handleIndexFilter(
          this.handleKeyFilter(this.props.books, AddFavorite.getAllFavorite()),
          //返回排序后的图书index
          SortUtil.sortBooks(this.props.books, this.props.bookSortCode) || []
        )
      : this.handleIndexFilter(
          this.props.books,
          //返回排序后的图书index
          SortUtil.sortBooks(this.props.books, this.props.bookSortCode) || []
        );

    if (this.props.mode === "shelf" && books.length === 0) {
      return (
        <div
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            zIndex: -1,
          }}
        >
          <Empty />
        </div>
      );
    }
    return books.map((item: BookModel, index: number) => {
      return this.props.viewMode === "list" ? (
        <BookListItem
          {...{
            key: index,
            book: item,
            isSelected: this.props.selectedBooks.indexOf(item.key) > -1,
          }}
        />
      ) : this.props.viewMode === "card" ? (
        <BookCardItem
          {...{
            key: index,
            book: item,
            isSelected: this.props.selectedBooks.indexOf(item.key) > -1,
          }}
        />
      ) : (
        <BookCoverItem
          {...{
            key: index,
            book: item,
            isSelected: this.props.selectedBooks.indexOf(item.key) > -1,
          }}
        />
      );
    });
  };

  render() {
    if (
      (this.state.favoriteBooks === 0 && this.props.mode === "favorite") ||
      !this.props.books ||
      !this.props.books[0]
    ) {
      return <Redirect to="/manager/empty" />;
    }
    if (isElectron) {
      //兼容之前的版本
      localforage.getItem(this.props.books[0].key).then((result) => {
        if (result) {
          backup(
            this.props.books,
            this.props.notes,
            this.props.bookmarks,
            false
          );
        }
      });
    }

    StorageUtil.setReaderConfig(
      "totalBooks",
      this.props.books.length.toString()
    );
    return (
      <>
        <ViewMode />
        <SelectBook />
        {!this.props.isSelectBook && <ShelfSelector />}
        <div
          className="book-list-container-parent"
          style={
            this.props.isCollapsed
              ? { width: "calc(100vw - 70px)", left: "70px" }
              : {}
          }
        >
          <div className="book-list-container">
            <ul className="book-list-item-box">{this.renderBookList()}</ul>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(BookList);
