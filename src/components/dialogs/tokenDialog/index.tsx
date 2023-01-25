import { connect } from "react-redux";
import { handleTokenDialog } from "../../../store/actions";
import { stateType } from "../../../store";
import { withTranslation } from "react-i18next";
import TokenDialog from "./component";
const mapStateToProps = (state: stateType) => {
  return {
    books: state.manager.books,
    isOpenDeleteDialog: state.book.isOpenDeleteDialog,
    currentBook: state.book.currentBook,
    bookmarks: state.reader.bookmarks,
    notes: state.reader.notes,
    digests: state.reader.digests,
  };
};
const actionCreator = {
  handleTokenDialog,
};
export default connect(
  mapStateToProps,
  actionCreator
)(withTranslation()(TokenDialog as any));
