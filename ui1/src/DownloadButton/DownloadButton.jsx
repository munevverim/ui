import styles from './DownloadButton.module.css'

function DownloadButton({ onDownload }) {
    return(
        <button id='downloadButton' className={styles.downloadButton} onClick={onDownload}>
            Export
        </button>
    )
}

export default DownloadButton