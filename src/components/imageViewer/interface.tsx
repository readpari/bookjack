import BookModel from "../../model/Book";
export interface ImageViewerProps {
  rendition: any;
  isShow: boolean;
  handleLeaveReader: (position: string) => void;
  handleEnterReader: (position: string) => void;
  t: any;
  currentBook: BookModel;
}
export interface ImageViewerStates {
  isShowImage: boolean;
  imageRatio: string;
  zoomIndex: number;
  rotateIndex: number;
}
