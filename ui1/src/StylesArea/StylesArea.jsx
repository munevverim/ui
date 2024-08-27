import React from 'react';
import styles from './StylesArea.module.css';

function StylesArea({ 
    selectedStyle, 
    onStylesChange, 
    selectedRadio, 
    setSelectedRadio,
    stylesList,
    setStylesList,
    getStylesByOption 
}) {
    const radioOptions = ['Architectural', 'Free'];

    const handleStyleChange = (style) => {
        onStylesChange(style);
    };

    const handleRadioChange = (option) => {
        setSelectedRadio(option);
        setStylesList(getStylesByOption(option));
    };

    return (
        <div className={styles.StyleContainer}>
            <div className={styles.radioButtons}>
                {radioOptions.map((option) => (
                    <label
                        key={option}
                        className={selectedRadio === option ? styles.selectedRadio : ''}
                    >
                        <input
                            type="radio"
                            value={option}
                            checked={selectedRadio === option}
                            onChange={() => handleRadioChange(option)}
                        />
                        {option}
                    </label>
                ))}
            </div>
            
            <div className={styles.styleNames}>
                {stylesList.length > 0 ? (
                    stylesList.map((style) => (
                        <label
                            key={style.value}
                            className={`${styles.label} ${selectedStyle === style.value ? styles.selected : ''}`}
                        >
                            <input
                                type="radio"
                                name="style"
                                value={style.value}
                                checked={selectedStyle === style.value}
                                onChange={() => handleStyleChange(style.value)}
                            />
                            {style.label}
                        </label>
                    ))
                ) : (
                    <div>No styles available</div>
                )}
            </div>
        </div>
    );
}

export default StylesArea;
