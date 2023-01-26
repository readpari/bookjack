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
      <div className="aboutContainer">
        <h1>Idea of the Book Jack</h1>
        <p className="aboutText">
          Book Jack is a simple reader with magical powers. Everyone knows that Reading is the most
          difficult activity of all. It takes a lot of will power to read. Book Jack will give you
          that power.
        </p>
        <p className="aboutText">
          Book Jack provides an opportunity to bet on reading. Bet that you will read 10 hours, no
          better than 13 hours, this week. Once you open the book, time will pass. As soon as you
          close the time will stop. Until the end of the week, you need to have time to keep the
          book open for 13 hours. You could choose less time, but you have already chosen 13 hours a
          week, the bet cannot be changed. If you do not make it by the appointed time, you will
          lose your money. If you have time, the money will be returned to you back, as much as you
          bet, no more. Everything is simple.
        </p>
        <p className="aboutText">
          What is the benefit, you ask?<br></br> It's a win you can never spend.
        </p>

        <p className="aboutText">
          To feel the excitement and defeat yourself, you need to make a serious bet, otherwise the
          magic will not work. And here you have another question: why do i trust jack my money?
        </p>
        <p className="aboutText">
          Book Jack is a smart-contract on the Near Blockchain. A smart-contract is a smart wallet
          that does not belong to anyone and manages its money according to a strictly defined
          algorithm. Its code is open source and extremely simple. When placing a bet, you send
          money to this smart-contract, and no one is able to get them out of there. It simply does
          not provide for such an opportunity. A smart-contract cannot be hacked or blocked. It is
          invulnerable by nature. Unless the Near blockchain will be destroyed, along with Bitcoin
          blockchain and other cryptocurrencies. But it's impossible.
        </p>
        <p className="aboutText">
          How smart-contract Book Jack works.
          <br />
          When you open the book, every 3 minutes, notifications will be sent to the smart-contract
          that you are flipping pages and actively reading. If you fall asleep and stop flipping
          pages, the timer inside the smart-contract will stop. The only way to fool him is to turn
          the pages without reading. Book Jack is a truly smart smart-contract, but alas, he can not
          cope with the human intellect. As soon as you dial the right time, it will automatically
          send money to your wallet. If you do not have time by the appointed time, he will
          automatically transfer your money to our wallet.
        </p>
        <p className="aboutText">
          The only unpleasant or pleasant circumstance may be a change in the exchange rate of the
          near cryptocurrency while they are stored on it, so I advise you to bet for a short time.
          In addition, we also do not want to wait long for your loss, if any. However, we wish you
          lucky reading.
        </p>
      </div>
    </div>
  );
};

export default withRouter(AboutList);


