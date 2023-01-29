import React from 'react';
import './betList.css';
import BookCardItem from '../../../components/bookCardItem';
import BookListItem from '../../../components/bookListItem';
import BookCoverItem from '../../../components/bookCoverItem';
import AddFavorite from '../../../utils/readUtils/addFavorite';
import ShelfUtil from '../../../utils/readUtils/shelfUtil';
import SortUtil from '../../../utils/readUtils/sortUtil';
import BookModel from '../../../model/Book';
import { BookListProps, BookListState } from './interface';
import StorageUtil from '../../../utils/serviceUtils/storageUtil';
import localforage from 'localforage';
import Empty from '../../emptyPage';
import { Redirect, withRouter } from 'react-router-dom';
import ViewMode from '../../../components/viewMode';
import { backup } from '../../../utils/syncUtils/backupUtil';
import { isElectron } from 'react-device-detect';
import SelectBook from '../../../components/selectBook';
import ShelfSelector from '../../../components/shelfSelector';
import { text, chat } from './text';

import { useState, useEffect } from 'react';

const AboutList = () => {
  const [activeLang, setActiveLang] = useState('EN');
  const [textLang, setTextLang] = useState(text['EN']);
  const [chatLang, setChatLang] = useState(chat['EN']);

  return (
    <div className="book-list-container-parent">
      <div className="aboutContainer">
        <div className="languageButtons">
          {Object.keys(text).map((lang) => (
            <div
              className="lang"
              onPointerDown={() => (
                setActiveLang(lang), setTextLang(text[lang]), setChatLang(chat[lang])
              )}
              style={{ color: lang == activeLang ? 'red' : 'black' }}>
              {lang}
            </div>
          ))}
        </div>

        {textLang.map((item) => (
          <p className="aboutText">{item}</p>
        ))}

        <h1 className="chatHeader">ChatGPT</h1>

        {chatLang.map((item, index) => (
          <div className="qContainer">
            {index % 2 ? <p className="aboutText">{item}</p> : <h2>{item}</h2>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default withRouter(AboutList);
