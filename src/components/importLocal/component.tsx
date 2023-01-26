import React from 'react';
import './importLocal.css';
import BookModel from '../../model/Book';
import localforage from 'localforage';
import { fetchMD5 } from '../../utils/fileUtils/md5Util';
import { Trans } from 'react-i18next';
import Dropzone from 'react-dropzone';
import { Tooltip } from 'react-tippy';
import { ImportLocalProps, ImportLocalState } from './interface';
import RecordRecent from '../../utils/readUtils/recordRecent';
import { isElectron } from 'react-device-detect';
import { withRouter } from 'react-router-dom';
import BookUtil from '../../utils/fileUtils/bookUtil';
import { fetchFileFromPath } from '../../utils/fileUtils/fileUtil';
import toast from 'react-hot-toast';
import StorageUtil from '../../utils/serviceUtils/storageUtil';
declare var window: any;
let clickFilePath = '';

class ImportLocal extends React.Component<ImportLocalProps, ImportLocalState> {
  constructor(props: ImportLocalProps) {
    super(props);
    this.state = {
      isOpenFile: false,
      width: document.body.clientWidth,
    };
  }
  componentDidMount() {
    if (isElectron) {
      const { ipcRenderer } = window.require('electron');
      if (!localStorage.getItem('storageLocation')) {
        localStorage.setItem('storageLocation', ipcRenderer.sendSync('storage-location', 'ping'));
      }

      const filePath = ipcRenderer.sendSync('get-file-data');
      if (filePath && filePath !== '.') {
        this.handleFilePath(filePath);
      }
      window.addEventListener(
        'focus',
        (event) => {
          const _filePath = ipcRenderer.sendSync('get-file-data');
          if (_filePath && _filePath !== '.') {
            this.handleFilePath(_filePath);
          }
        },
        false,
      );
    }
    window.addEventListener('resize', () => {
      this.setState({ width: document.body.clientWidth });
    });
  }
  handleFilePath = async (filePath: string) => {
    clickFilePath = filePath;
    let md5 = await fetchMD5(await fetchFileFromPath(filePath));
    if ([...(this.props.books || []), ...this.props.deletedBooks].length > 0) {
      let isRepeat = false;
      let repeatBook: BookModel | null = null;
      [...(this.props.books || []), ...this.props.deletedBooks].forEach((item) => {
        if (item.md5 === md5) {
          isRepeat = true;
          repeatBook = item;
        }
      });
      if (isRepeat && repeatBook) {
        this.handleJump(repeatBook);
        return;
      }
    }
    const fileTemp = await fetchFileFromPath(filePath);

    this.setState({ isOpenFile: true }, async () => {
      await this.getMd5WithBrowser(fileTemp);
    });
  };
  handleJump = (book: BookModel) => {
    if (StorageUtil.getReaderConfig('isOpenInMain') === 'yes') {
      this.props.history.push(BookUtil.getBookUrl(book));
      this.props.handleReadingBook(book);
    } else {
      localStorage.setItem('tempBook', JSON.stringify(book));
      BookUtil.RedirectBook(book);
      this.props.history.push('/manager/home');
    }
  };
  handleAddBook = (book: BookModel, buffer: ArrayBuffer) => {
    return new Promise<void>((resolve, reject) => {
      if (this.state.isOpenFile) {
        StorageUtil.getReaderConfig('isImportPath') !== 'yes' &&
          StorageUtil.getReaderConfig('isPreventAdd') !== 'yes' &&
          BookUtil.addBook(book.key, buffer);
        if (StorageUtil.getReaderConfig('isPreventAdd') === 'yes') {
          this.handleJump(book);

          this.setState({ isOpenFile: false });

          return resolve();
        }
      } else {
        StorageUtil.getReaderConfig('isImportPath') !== 'yes' && BookUtil.addBook(book.key, buffer);
      }

      let bookArr = [...(this.props.books || []), ...this.props.deletedBooks];
      if (bookArr == null) {
        bookArr = [];
      }
      bookArr.push(book);
      this.props.handleReadingBook(book);
      RecordRecent.setRecent(book.key);
      localforage
        .setItem('books', bookArr)
        .then(() => {
          this.props.handleFetchBooks();

          toast.success(this.props.t('Add Successfully'));
          setTimeout(() => {
            this.state.isOpenFile && this.handleJump(book);
            if (StorageUtil.getReaderConfig('isOpenInMain') === 'yes' && this.state.isOpenFile) {
              this.setState({ isOpenFile: false });
              return;
            }
            this.setState({ isOpenFile: false });
            this.props.history.push('/manager/home');
          }, 100);
          return resolve();
        })
        .catch(() => {
          toast.error(this.props.t('Import Failed'));
          return resolve();
        });
    });
  };

  //获取书籍md5
  getMd5WithBrowser = async (file: any) => {
    return new Promise<void>(async (resolve, reject) => {
      const md5 = await fetchMD5(file);
      if (!md5) {
        toast.error(this.props.t('Import Failed'));
        return resolve();
      } else {
        await this.handleBook(file, md5);
        return resolve();
      }
    });
  };

  handleBook = (file: any, md5: string) => {
    let extension = (file.name as string).split('.').reverse()[0].toLocaleLowerCase();
    let bookName = file.name.substr(0, file.name.length - extension.length - 1);
    let result: BookModel | string;
    return new Promise<void>((resolve, reject) => {
      //md5重复不导入
      let isRepeat = false;
      if ([...(this.props.books || []), ...this.props.deletedBooks].length > 0) {
        [...(this.props.books || []), ...this.props.deletedBooks].forEach((item) => {
          if (item.md5 === md5 && item.size === file.size) {
            isRepeat = true;
            toast.error(this.props.t('Duplicate Book'));
            return resolve();
          }
        });
      }
      //解析图书，获取图书数据
      if (!isRepeat) {
        let reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = async (e) => {
          if (!e.target) {
            toast.error(this.props.t('Import Failed'));
            return resolve();
          }
          let reader = new FileReader();
          reader.onload = async (event) => {
            const file_content = (event.target as any).result;
            result = await BookUtil.generateBook(
              bookName,
              extension,
              md5,
              file.size,
              file.path || clickFilePath,
              file_content,
            );
            clickFilePath = '';
            if (result === 'parse_kindle_error') {
              toast.error(
                this.props.t(
                  "You may see this error when the book you're importing is not supported by Reader, try converting it with Calibre",
                ),
              );
              return resolve();
            } else if (result === 'get_metadata_error') {
              toast.error(this.props.t('Import Failed'));
              return resolve();
            }
            await this.handleAddBook(result as BookModel, file_content as ArrayBuffer);

            return resolve();
          };
          reader.readAsArrayBuffer(file);
        };
      }
    });
  };

  render() {
    return (
      <Dropzone
        onDrop={async (acceptedFiles) => {
          this.props.handleDrag(false);
          for (let item of acceptedFiles) {
            await this.getMd5WithBrowser(item);
          }
        }}
        accept={[
          '.epub',
          '.pdf',
          '.txt',
          '.mobi',
          '.azw3',
          '.djvu',
          '.htm',
          '.html',
          '.xml',
          '.xhtml',
          '.docx',
          '.rtf',
          '.md',
          '.fb2',
          '.cbz',
          '.cbt',
          '.cbr',
        ]}
        multiple={true}>
        {({ getRootProps, getInputProps }) => (
          <div
            className="import-from-local"
            {...getRootProps()}
            style={
              this.props.isCollapsed && document.body.clientWidth < 950 ? { width: '42px' } : {}
            }>
            <div className="animation-mask-local"></div>
            {this.props.isCollapsed && this.state.width < 950 ? (
              <Tooltip
                title={this.props.t('Import')}
                position="top"
                style={{ height: '20px' }}
                trigger="mouseenter">
                <span className="icon-folder" style={{ fontSize: '15px', fontWeight: 500 }}></span>
              </Tooltip>
            ) : (
              <span>
                <Trans>Import</Trans>
              </span>
            )}

            <input
              type="file"
              id="import-book-box"
              className="import-book-box"
              name="file"
              {...getInputProps()}
            />
          </div>
        )}
      </Dropzone>
    );
  }
}

export default withRouter(ImportLocal);
