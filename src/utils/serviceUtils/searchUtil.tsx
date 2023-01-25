import BookModel from "../../model/Book";
import NoteModel from "../../model/Note";
class SearchUtil {
  static MergeArray(arr1: number[], arr2: number[]) {
    var _arr: number[] = [];
    for (let item of arr1) {
      _arr.push(item);
    }
    for (let item of arr2) {
      var flag = true;
      for (let subitem of arr1) {
        if (item === subitem) {
          flag = false;
          break;
        }
      }
      if (flag) {
        _arr.push(item);
      }
    }
    return _arr;
  }
  static fuzzyQuery(list: string[], keyWord: string) {
    var arr: number[] = [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].indexOf(keyWord) > -1) {
        arr.push(i);
      }
    }
    return arr;
  }
  static MouseSearch(books: BookModel[]) {
    let keyword = (
      document.querySelector(".header-search-box") as HTMLInputElement
    ).value.toLowerCase();
    let bookNameArr: string[] = [];
    let AuthorNameArr: string[] = [];
    if (!books) return [];
    books.forEach((item) => {
      bookNameArr.push(item.name.toLowerCase());
      AuthorNameArr.push(item.author.toLowerCase());
    });
    let bookResults = this.fuzzyQuery(bookNameArr, keyword);
    let authorResults = this.fuzzyQuery(AuthorNameArr, keyword);

    return this.MergeArray(bookResults, authorResults);
  }
  static KeySearch(event: any, books: BookModel[]) {
    if (event && event.keyCode === 13) {
      let bookNameArr: string[] = [];
      let AuthorNameArr: string[] = [];
      if (!books) return [];

      books.forEach((item) => {
        bookNameArr.push(item.name.toLowerCase());
        AuthorNameArr.push(item.author.toLowerCase());
      });
      let bookResults = this.fuzzyQuery(
        bookNameArr,
        event.target.value.toLowerCase()
      );
      let authorResults = this.fuzzyQuery(
        AuthorNameArr,
        event.target.value.toLowerCase()
      );

      return this.MergeArray(bookResults, authorResults);
    }
  }
  static MouseNoteSearch(notes: NoteModel[]) {
    let keyword = (
      document.querySelector(".header-search-box") as HTMLInputElement
    ).value.toLowerCase();
    let noteArr: string[] = [];
    let textArr: string[] = [];
    notes.forEach((item: NoteModel) => {
      noteArr.push(item.notes.toLowerCase());
      textArr.push(item.text.toLowerCase());
    });
    let noteResults = this.fuzzyQuery(noteArr, keyword);
    let textResults = this.fuzzyQuery(textArr, keyword);
    return this.MergeArray(noteResults, textResults);
  }
  static KeyNoteSearch(event: any, notes: NoteModel[]) {
    if (event && event.keyCode === 13) {
      let noteArr: string[] = [];
      let textArr: string[] = [];
      notes.forEach((item: NoteModel) => {
        noteArr.push(item.notes.toLowerCase());
        textArr.push(item.text.toLowerCase());
      });
      let noteResults = this.fuzzyQuery(
        noteArr,
        event.target.value.toLowerCase()
      );
      let textResults = this.fuzzyQuery(
        textArr,
        event.target.value.toLowerCase()
      );
      return this.MergeArray(noteResults, textResults);
    }
  }
}
export default SearchUtil;
