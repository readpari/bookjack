import xml2js from "xml2js";
export const xmlMetadata = (xml: string) => {
  return new Promise<object>((resolve, reject) => {
    var objBook: any = {};
    let parser = new xml2js.Parser();
    parser.parseString(xml, function (err, result) {
      if (err) {
        console.log("Error with parsing xml" + err);
        resolve({});
      }
      var fictionBook = result.FictionBook;
      var bookDesc = fictionBook.description[0]["title-info"][0];
      objBook.name = bookDesc["book-title"][0];

      if (bookDesc["author"] && bookDesc["author"][0]["first-name"]) {
        objBook.author = bookDesc["author"][0]["first-name"][0];

        if (bookDesc["author"][0]["last-name"]) {
          objBook.author += " " + bookDesc["author"][0]["last-name"][0];
        }
      }
      if (fictionBook.binary) {
        objBook.cover = "data:image/jpeg;base64," + fictionBook.binary[0]["_"];
      }
      resolve(objBook);
    });
  });
};

export const xmlBookParser = (xml: any, bookString: string) => {
  var regExpTagDelete = /<epigraph>|<\/epigraph>|<empty-line\/>|/gi;
  var regExpTitleOpen = /<title>/gi;
  var regExpTitleClose = /<\/title>/gi;
  var bookStart = bookString.match(/<body.*?>/i) || [""];
  var bookBody = bookString.slice(
    bookString.search(/<body.*?>/i) + bookStart[0].length,
    bookString.search(/<\/body>/i)
  );

  bookBody = bookBody.replace(regExpTagDelete, "");
  bookBody = bookBody.replace(regExpTitleOpen, "<h3>");
  bookBody = bookBody.replace(regExpTitleClose, "</h3>");

  return xmlImageHandler(xml, bookBody);
};

export const xmlImageHandler = (xml: any, bookString: string) => {
  let parser = new xml2js.Parser();
  parser.parseString(xml, function (err, result) {
    if (err) {
      console.log("Error with parsing xml" + err);
      return "";
    }

    var fictionBook = result.FictionBook;
    if (fictionBook.binary) {
      let strArr = bookString.split(`<image xlink:href="#`);

      for (let i = 0; i < strArr.length; i++) {
        for (let j = 0; j < fictionBook.binary.length; j++) {
          if (strArr[i].startsWith(fictionBook.binary[j]["$"].id)) {
            strArr[i] =
              '<img alt="poster" style="max-width: 100%; max-height: 100%" src="' +
              "data:image/jpeg;base64," +
              fictionBook.binary[j]["_"] +
              strArr[i].slice(fictionBook.binary[j]["$"].id.length);
          }
        }
      }

      bookString = strArr.join("");
    }
  });

  return bookString;
};
