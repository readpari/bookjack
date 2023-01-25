import { connect } from "react-redux";
import { stateType } from "../../../store";
import { withTranslation } from "react-i18next";
import ProgressPanel from "./component";
const mapStateToProps = (state: stateType) => {
  return {
    currentBook: state.book.currentBook,
    isReading: state.book.isReading,
    percentage: state.progressPanel.percentage,
    htmlBook: state.reader.htmlBook,
    currentChapterIndex: state.reader.currentChapterIndex,
    currentChapter: state.reader.currentChapter,
    renderBookFunc: state.book.renderBookFunc,
  };
};
const actionCreator = {};
export default connect(
  mapStateToProps,
  actionCreator
)(withTranslation()(ProgressPanel as any));
