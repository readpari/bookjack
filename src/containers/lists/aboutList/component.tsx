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

import { useState, useEffect } from 'react';

const AboutList = () => {
  return (
    <div className="book-list-container-parent">
      <h1>about</h1>
    </div>
  );
};

export default withRouter(AboutList);
