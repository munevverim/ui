import { useState, useRef, useEffect } from 'react';
import styles from './TextToImage.module.css';
import StylesArea from '../StylesArea/StylesArea';
import BaseFetch from '../BaseFetch';

function TextToImage({ onImageGenerated }) {
    const [isFocused, setIsFocused] = useState(false);
    const [selectedRatio, setSelectedRatio] = useState("1:1");
    const [selectedStyle, setSelectedStyle] = useState('');
    const [selectedRadio, setSelectedRadio] = useState('Architectural');
    const [stylesList, setStylesList] = useState(getStylesByOption('Architectural'));
    const t2iTextRef = useRef(null);
    const stylesAreaRef = useRef(null);
    const t2iAreaRef = useRef(null);

    const handleClickOutside = (event) => {
        if (
            stylesAreaRef.current &&
            !stylesAreaRef.current.contains(event.target) &&
            t2iTextRef.current &&
            !t2iTextRef.current.contains(event.target) &&
            t2iAreaRef.current &&
            !t2iAreaRef.current.contains(event.target)
        ) {
            setIsFocused(false);
        }
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleRatioChange = (event) => {
        setSelectedRatio(event.target.value);
    };

    const handleGenerateClick = async () => {
        const promptText = t2iTextRef.current.value;
        const [width, height] = getDimensions().split('x');
        const baseURL = BaseFetch();

        const payload = {
            prompt: promptText,
            width: parseInt(width, 10),
            height: parseInt(height, 10),
            style: selectedStyle,
        };

        try {
            const response = await fetch(`${baseURL}/generate-image/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server responded with an error:', errorText);
                return;
            }

            const result = await response.json();

            if (onImageGenerated && result.images) {
                onImageGenerated(result.images);
            } else {
                console.log("onImageGenerated is not a function or result.images is missing");
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const dimensionsMap = {
        "1:1": "1024x1024",
        "4:3": "1024x768",
        "3:4": "768x1024",
        "16:9": "1024x576",
        "9:16": "576x1024"
    };
    
    const getDimensions = () => dimensionsMap[selectedRatio] || "";

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
        <div className={styles.t2i} ref={t2iAreaRef}>
            <div className={styles.t2iArea}>
                <div className={styles.scaleArea}>
                    <input
                        type="radio"
                        id="ratio1_1"
                        name="aspectRatio"
                        value="1:1"
                        checked={selectedRatio === "1:1"}
                        onChange={handleRatioChange}
                    />
                    <label className={styles.scaleButton} htmlFor="ratio1_1">1:1</label>

                    <input
                        type="radio"
                        id="ratio4_3"
                        name="aspectRatio"
                        value="4:3"
                        checked={selectedRatio === "4:3"}
                        onChange={handleRatioChange}
                    />
                    <label className={styles.scaleButton} htmlFor="ratio4_3">4:3</label>

                    <input
                        type="radio"
                        id="ratio3_4"
                        name="aspectRatio"
                        value="3:4"
                        checked={selectedRatio === "3:4"}
                        onChange={handleRatioChange}
                    />
                    <label className={styles.scaleButton} htmlFor="ratio3_4">3:4</label>

                    <input
                        type="radio"
                        id="ratio16_9"
                        name="aspectRatio"
                        value="16:9"
                        checked={selectedRatio === "16:9"}
                        onChange={handleRatioChange}
                    />
                    <label className={styles.scaleButton} htmlFor="ratio16_9">16:9</label>

                    <input
                        type="radio"
                        id="ratio9_16"
                        name="aspectRatio"
                        value="9:16"
                        checked={selectedRatio === "9:16"}
                        onChange={handleRatioChange}
                    />
                    <label className={styles.scaleButton} htmlFor="ratio9_16">9:16</label>
                </div>
                <i>{getDimensions()}</i>
                <textarea
                    className={styles.t2iPrompt}
                    id="t2iText"
                    ref={t2iTextRef}
                    onFocus={handleFocus}
                ></textarea>
                <button className={styles.t2iGB} id='t2iGenerate' onClick={handleGenerateClick}>Generate</button>
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

export default TextToImage;