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
import { text } from './text';
import { useState, useEffect } from 'react';

const AboutList = () => {
  const langs = [
    'EN',
    'RU',
    'CHN',
    'FR',
    'GRM',
    'ITL',
    'SPN',
    '日本語',
    '韓國語',
    'العربية',
    'עִבְרִית',
  ];

  const [activeLang, setActiveLang] = useState('EN');
  const [textLang, setTextLang] = useState(text['EN']);

  return (
    <div className="book-list-container-parent">
      <div className="aboutContainer">
        <div className="languageButtons">
          {langs.map((lang) => (
            <div
              className="lang"
              onPointerDown={() => (setActiveLang(lang), setTextLang(text[lang]))}
              style={{ color: lang == activeLang ? 'red' : 'black' }}>
              {lang}
            </div>
          ))}
        </div>

        {textLang.map((item) => (
          <p className="aboutText">{item}</p>
        ))}
      </div>
    </div>
  );
};

export default withRouter(AboutList);
