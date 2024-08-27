//import { useState, useRef, useEffect } from 'react';
//import styles from './MaskArea.module.css';
//import StylesArea from '../StylesArea/StylesArea';
//
//const MaskArea = ({ onBrushClick, isBrushMode }) => {
//    const [isFocused, setIsFocused] = useState(false);
//    const [showBrushSettings, setShowBrushSettings] = useState(false);
//    const [brushSize, setBrushSize] = useState(5);
//    const [brushColor, setBrushColor] = useState('#000000');
//    const [brushOpacity, setBrushOpacity] = useState(1);
//    const [selectedStyle, setSelectedStyle] = useState('');
//    const [selectedRadio, setSelectedRadio] = useState('Architectural');
//    const [stylesList, setStylesList] = useState(getStylesByOption('Architectural'));
//
//    const textareaRef = useRef(null);
//    const stylesAreaRef = useRef(null);
//    const maskAreaRef = useRef(null);
//
//    const handleClickOutside = (event) => {
//        if (
//            maskAreaRef.current &&
//            !maskAreaRef.current.contains(event.target) &&
//            stylesAreaRef.current &&
//            !stylesAreaRef.current.contains(event.target)
//        ) {
//            setIsFocused(false);
//        }
//    };
//
//    useEffect(() => {
//        document.addEventListener('mousedown', handleClickOutside);
//        return () => {
//            document.removeEventListener('mousedown', handleClickOutside);
//        };
//    }, []);
//
//    const handleFocus = () => {
//        setIsFocused(true);
//    };
//
//    const toggleBrushSettings = () => {
//        setShowBrushSettings((prev) => !prev);
//    };
//
//    const handleBrushSizeChange = (e) => {
//        setBrushSize(e.target.value);
//    };
//
//    const handleBrushColorChange = (e) => {
//        setBrushColor(e.target.value);
//    };
//
//    const handleBrushOpacityChange = (e) => {
//        setBrushOpacity(e.target.value);
//    };
//
//    function getStylesByOption(optionValue) {
//        switch (optionValue) {
//            case 'Architectural':
//                return [
//                    { label: 'Modern', value: 'Modern Architecture' },
//                    { label: 'Neoclassical', value: 'Neoclassical Architecture' },
//                ];
//            case 'Free':
//                return [
//                    { label: 'Anime', value: '3D Animation' },
//                    { label: 'Photographic', value: 'sai-photographic_Photography' },
//                ];
//            default:
//                return [];
//        }
//    }
//
//    return (
//        <div className={styles.i2iArea} ref={maskAreaRef}>
//            <div>
//            <div className={styles.maskArea}>
//                <textarea
//                    className={styles.i2iPrompt}
//                    id="i2iText"
//                    ref={textareaRef}
//                    onFocus={handleFocus}
//                ></textarea>
//                <div className={styles.maskButtons}>
//                    <button id='brush' className={styles.brushButton} onClick={toggleBrushSettings}>
//                        Brush
//                    </button>
//                    <button id='eraser' className={styles.brushButton}>Erase</button>
//                    <button id='clear' className={styles.brushButton}>Clear</button>
//                </div>
//                <div className={styles.i2iButtons}>
//                    <button id='i2iGB' className={styles.i2iGenerate}>Generate</button>
//                    <button id='rb' className={styles.i2iGenerate}>Remove</button>
//                </div>
//            </div>
//            {showBrushSettings && (
//                <div className={styles.brushSettings}>
//                    <div>
//                        <label htmlFor="brushColor">Brush Color: </label>
//                        <input 
//                            type="color" 
//                            id="brushColor" 
//                            value={brushColor} 
//                            onChange={handleBrushColorChange} 
//                        />
//                    </div>
//                    <div>
//                        <label htmlFor="brushSize">Brush Size: </label>
//                        <input 
//                            type="range" 
//                            id="brushSize" 
//                            min="10" 
//                            max="200" 
//                            value={brushSize} 
//                            onChange={handleBrushSizeChange}
//                            className={styles.slider} 
//                        />
//                    </div>
//                    <div>
//                        <label htmlFor="brushOpacity">Brush Opacity: </label>
//                        <input 
//                            type="range" 
//                            id="brushOpacity" 
//                            min="0" 
//                            max="1" 
//                            step="0.1" 
//                            value={brushOpacity} 
//                            onChange={handleBrushOpacityChange}
//                            className={styles.slider} 
//                        />
//                    </div>
//                </div>
//            )}
//            </div>
//            {isFocused && (
//                <div ref={stylesAreaRef}>
//                    <StylesArea 
//                        selectedStyle={selectedStyle}
//                        onStylesChange={setSelectedStyle}
//                        selectedRadio={selectedRadio}
//                        setSelectedRadio={setSelectedRadio}
//                        stylesList={stylesList}
//                        setStylesList={setStylesList}
//                        getStylesByOption={getStylesByOption}
//                    />
//                </div>
//            )}
//        </div>
//    );
//}
//
//export default MaskArea;

import { useState, useRef, useEffect } from 'react';
import styles from './MaskArea.module.css';
import StylesArea from '../StylesArea/StylesArea';

const MaskArea = ({ brushMode, setBrushMode, brushSize: propBrushSize, setBrushSize: propSetBrushSize, brushColor: propBrushColor, setBrushColor: propSetBrushColor }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showBrushSettings, setShowBrushSettings] = useState(false);
    const [selectedStyle, setSelectedStyle] = useState('');
    const [selectedRadio, setSelectedRadio] = useState('Architectural');
    const [stylesList, setStylesList] = useState(getStylesByOption('Architectural'));

    const textareaRef = useRef(null);
    const stylesAreaRef = useRef(null);
    const maskAreaRef = useRef(null);

    const handleClickOutside = (event) => {
        if (
            maskAreaRef.current &&
            !maskAreaRef.current.contains(event.target) &&
            stylesAreaRef.current &&
            !stylesAreaRef.current.contains(event.target)
        ) {
            setIsFocused(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const toggleBrushSettings = () => {
        setShowBrushSettings((prev) => !prev);
        setBrushMode((prev) => !prev);
    };

    const handleBrushSizeChange = (e) => {
        propSetBrushSize(e.target.value);
    };

    const handleBrushColorChange = (e) => {
        propSetBrushColor(e.target.value);
    };

    function getStylesByOption(optionValue) {
        switch (optionValue) {
            case 'Architectural':
                return [
                    { label: 'Modern', value: 'Modern Architecture' },
                    { label: 'Neoclassical', value: 'Neoclassical Architecture' },
                ];
            case 'Free':
                return [
                    { label: 'Anime', value: '3D Animation' },
                    { label: 'Photographic', value: 'sai-photographic_Photography' },
                ];
            default:
                return [];
        }
    }

    return (
        <div className={styles.i2iArea} ref={maskAreaRef}>
            <div>
            <div className={styles.maskArea}>
                <textarea
                    className={styles.i2iPrompt}
                    id="i2iText"
                    ref={textareaRef}
                    onFocus={handleFocus}
                ></textarea>
                <div className={styles.maskButtons}>
                    <button id='brush' className={styles.brushButton} onClick={toggleBrushSettings}>
                        Brush
                    </button>
                    <button id='eraser' className={styles.brushButton}>Erase</button>
                    <button id='clear' className={styles.brushButton}>Clear</button>
                </div>
                <div className={styles.i2iButtons}>
                    <button id='i2iGB' className={styles.i2iGenerate}>Generate</button>
                    <button id='rb' className={styles.i2iGenerate}>Remove</button>
                </div>
            </div>
            {showBrushSettings && (
                <div className={styles.brushSettings}>
                    <div>
                        <label htmlFor="brushColor">Brush Color: </label>
                        <input 
                            type="color" 
                            id="brushColor" 
                            value={propBrushColor} 
                            onChange={handleBrushColorChange} 
                        />
                    </div>
                    <div>
                        <label htmlFor="brushSize">Brush Size: </label>
                        <input 
                            type="range" 
                            id="brushSize" 
                            min="10" 
                            max="200" 
                            value={propBrushSize} 
                            onChange={handleBrushSizeChange}
                            className={styles.slider} 
                        />
                    </div>
                </div>
            )}
            </div>
            {isFocused && (
                <div ref={stylesAreaRef}>
                    <StylesArea 
                        selectedStyle={selectedStyle}
                        onStylesChange={setSelectedStyle}
                        selectedRadio={selectedRadio}
                        setSelectedRadio={setSelectedRadio}
                        stylesList={stylesList}
                        setStylesList={setStylesList}
                        getStylesByOption={getStylesByOption}
                    />
                </div>
            )}
        </div>
    );
}

export default MaskArea;
