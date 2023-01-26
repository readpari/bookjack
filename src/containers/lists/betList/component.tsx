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

const ButtonPlusMinus = ({ setCount, count, plusX, sign }) => {
  const [on, setOn] = useState(false);

  const countClickDown = (setfunc, count, xplusX) => {
    if (count + plusX >= 0) setfunc(count + plusX);
    setOn(true);
  };

  const countClickUp = () => {
    setOn(false);
  };

  return (
    <div
      className="button"
      onPointerDown={() => countClickDown(setCount, count, 1)}
      onPointerUp={() => countClickUp()}
      style={{ transform: on ? 'scale(1.1)' : 'scale(1)' }}>
      {sign}
    </div>
  );
};

const Question = ({ header, count, setCount, word, plusX, warn }) => {
  return (
    <div className="container">
      <h1 className="counterHeader">{header}</h1>
      <div className="counter">
        <ButtonPlusMinus setCount={setCount} count={count} plusX={-1 * plusX} sign={'-'} />
        <div className="count">
          {count} {word}
        </div>
        <ButtonPlusMinus setCount={setCount} count={count} plusX={1 * plusX} sign={'+'} />
      </div>
      {warn && <p className="warn">increase the number </p>}
    </div>
  );
};

// Опции для ставки

const BetWasNot = ({ days, setDays, hours, setHours, bet, setBet, setBetDidMount }) => {
  const [betButtonOn, setBetButtonOn] = useState(false);
  const [warn, setWarn] = useState({ days: false, hours: false, bet: false });

  const betButtonDown = () => {
    setBetButtonOn(true);
  };
  const betButtonUp = () => {
    setBetButtonOn(false);
    setWarn({
      hours: hours == 0 ? true : false,
      days: days == 0 ? true : false,
      bet: bet == 0 ? true : false,
    });
    if (hours && days && bet) setBetDidMount(true);
  };

  return (
    <>
      <Question
        header={'How long are you going to read?'}
        count={hours}
        word={'hours'}
        setCount={setHours}
        plusX={1}
        warn={warn.hours}
      />
      <Question
        header={'How many days will you need?'}
        count={days}
        word={'days'}
        setCount={setDays}
        plusX={1}
        warn={warn.days}
      />
      <Question
        header={'How much are you willing  \n  to bet on this event?'}
        count={bet}
        word={'near'}
        setCount={setBet}
        plusX={10}
        warn={warn.bet}
      />

      <div
        className="betButton"
        onPointerDown={() => betButtonDown()}
        onPointerUp={() => betButtonUp()}
        style={{ transform: betButtonOn ? 'scale(1.1)' : 'scale(1)' }}>
        bet
      </div>
    </>
  );
};

const BetWas = ({ hours, days, bet }) => {
  const month = ['jan', 'feb', 'march', 'april', 'may', 'june', 'july', 'aug', 'spt', 'nvm', 'dcm'];
  const date = new Date(Date.now() + 86400000 * days);
  const dateString = ` ${date.getDate()} ${month[date.getMonth()]} ${
    date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  }:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}:${
    date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  }  `;

  return (
    <>
      <h1>You need to read {hours} hours.</h1>
      <h1>Deadline {dateString}</h1>
      <h1>bet: {bet} near</h1>
      <h1>timer : 0</h1>
    </>
  );
};

const BetList = () => {
  const [hours, setHours] = useState(0);
  const [days, setDays] = useState(0);
  const [bet, setBet] = useState(0);
  const [betDidMount, setBetDidMount] = useState(false);

  return (
    <div className="book-list-container-parent">
      {betDidMount ? (
        <BetWas hours={hours} days={days} bet={bet} />
      ) : (
        <BetWasNot
          hours={hours}
          setHours={setHours}
          days={days}
          setDays={setDays}
          bet={bet}
          setBet={setBet}
          setBetDidMount={setBetDidMount}
        />
      )}
    </div>
  );
};

export default withRouter(BetList);
