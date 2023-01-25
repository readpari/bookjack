import {
  handleSelection,
  handleOpenMenu,
  handleMenuMode,
  handleChangeDirection,
  handleNoteKey,
  handleRenderNoteFunc,
} from "../../../store/actions";
import { connect } from "react-redux";
import { stateType } from "../../../store";
import PopupMenu from "./component";
import { withTranslation } from "react-i18next";

const mapStateToProps = (state: stateType) => {
  return {
    digests: state.reader.digests,
    notes: state.reader.notes,
    noteKey: state.reader.noteKey,
    currentBook: state.book.currentBook,
    isOpenMenu: state.viewArea.isOpenMenu,
    menuMode: state.viewArea.menuMode,
    color: state.reader.color,
    isChangeDirection: state.viewArea.isChangeDirection,
  };
};
const actionCreator = {
  handleSelection,
  handleOpenMenu,
  handleMenuMode,
  handleChangeDirection,
  handleNoteKey,
  handleRenderNoteFunc,
};
export default connect(
  mapStateToProps,
  actionCreator
)(withTranslation()(PopupMenu));
