import React, { useEffect, useState } from 'react';
import styles from './HeaderEditor.module.css';
import logo from '../assets/quviLogo.png';
import { Link } from 'react-router-dom';
import coin from '../assets/quviCoin.png';
import DownloadButton from '../DownloadButton/DownloadButton';

function HeaderEditor({ showDownloadButton, onDownload }) {
 

 

  return (
    <>
      <header className={styles.headerEditor}>
        <Link to="/">
          <button className={styles.logo}>
            <img className={styles.logoImage} src={logo} alt="Logo" />
          </button>
        </Link>
        <div className={styles.headerRight}>
          {showDownloadButton && <DownloadButton onDownload={onDownload} />}
          <div className={styles.HeaderProfile}>
            <div className={styles.userValues}>
              <img className={styles.coinImage} src={coin} alt="Coin" />
              <p className={styles.coinValue}>{userData.coinValue}</p>
            </div>
            
          </div>
        </div>
      </header>
      <hr />
    </>
  );
}

export default HeaderEditor;
