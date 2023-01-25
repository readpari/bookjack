import { connect } from "react-redux";
import {
  handleFetchBooks,
  handleFetchBookSortCode,
  handleFetchNoteSortCode,
  handleFetchList,
  handleTipDialog,
  handleLoadingDialog,
  handleNewDialog,
  handleSetting,
  handleBackupDialog,
  handleFetchNotes,
  handleFetchBookmarks,
  handleEditDialog,
  handleDeleteDialog,
  handleAddDialog,
  handleReadingState,
} from "../../store/actions";
import { withTranslation } from "react-i18next";

import "./manager.css";
import { stateType } from "../../store";
import Manager from "./component";
import { withRouter } from "react-router-dom";
const mapStateToProps = (state: stateType) => {
  return {
    books: state.manager.books,
    notes: state.reader.notes,
    digests: state.reader.digests,
    bookmarks: state.reader.bookmarks,
    isReading: state.book.isReading,
    mode: state.sidebar.mode,
    dragItem: state.book.dragItem,
    shelfIndex: state.sidebar.shelfIndex,
    isOpenEditDialog: state.book.isOpenEditDialog,
    isOpenDeleteDialog: state.book.isOpenDeleteDialog,
    isOpenAddDialog: state.book.isOpenAddDialog,
    isSettingOpen: state.manager.isSettingOpen,
    isAboutOpen: state.manager.isAboutOpen,
    isBookSort: state.manager.isBookSort,
    isSortDisplay: state.manager.isSortDisplay,
    isShowLoading: state.manager.isShowLoading,
    isShowNew: state.manager.isShowNew,
    isTipDialog: state.manager.isTipDialog,
    isBackup: state.backupPage.isBackup,
  };
};
const actionCreator = {
  handleFetchBooks,
  handleFetchNotes,
  handleSetting,
  handleFetchBookmarks,
  handleFetchBookSortCode,
  handleFetchNoteSortCode,
  handleFetchList,
  handleEditDialog,
  handleDeleteDialog,
  handleAddDialog,
  handleTipDialog,
  handleLoadingDialog,
  handleNewDialog,
  handleBackupDialog,
  handleReadingState,
};
export default connect(
  mapStateToProps,
  actionCreator
)(withTranslation()(withRouter(Manager)));
