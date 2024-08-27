//import React, { useState, useRef, useEffect } from 'react';
//import { Stage, Layer, Image as KonvaImage, Transformer, Group } from 'react-konva';
//import HeaderEditor from '../Header/HeaderEditor';
//import TextToImage from '../TextToImage/TextToImage';
//import Konva from 'konva';
//import MaskArea from '../MaskComponents/MaskArea';
//import UploadButton from '../uploadButton/UploadButton';
//
//Konva.Group.prototype.snapToGrid = function(value) {
//  const GRID_SIZE = 10;
//  return Math.round(value / GRID_SIZE) * GRID_SIZE;
//};
//
//Konva.Group.prototype.onDragEnd = function(e) {
//  const node = e.target;
//  const snapToGrid = this.snapToGrid;
//
//  node.position({
//    x: snapToGrid(node.x()),
//    y: snapToGrid(node.y()),
//  });
//
//  node.getLayer().batchDraw();
//};
//
//Konva.Group.prototype.onTransformEnd = function(e) {
//  const node = e.target;
//  const snapToGrid = this.snapToGrid;
//
//  const scaleX = node.scaleX();
//  const scaleY = node.scaleY();
//
//  node.scaleX(1);
//  node.scaleY(1);
//
//  node.setAttrs({
//    x: snapToGrid(node.x()),
//    y: snapToGrid(node.y()),
//    width: Math.max(5, snapToGrid(node.width() * scaleX)),
//    height: Math.max(5, snapToGrid(node.height() * scaleY)),
//  });
//
//  node.getLayer().batchDraw();
//};
//
//const CustomImage = ({ shapeProps, isSelected, onSelect, onChange }) => {
//  const imageRef = useRef();
//  const canvasRef = useRef();
//  const groupRef = useRef();
//  const trRef = useRef();
//  const [isTransforming, setIsTransforming] = useState(false);
//
//  useEffect(() => {
//    if (isSelected && trRef.current && groupRef.current) {
//      trRef.current.nodes([groupRef.current]);
//      trRef.current.getLayer().batchDraw();
//    }
//  }, [isSelected, shapeProps.width, shapeProps.height]);
//
//  useEffect(() => {
//    const updateDimensions = () => {
//      if (groupRef.current && imageRef.current && canvasRef.current) {
//        const newWidth = shapeProps.width;
//        const newHeight = shapeProps.height;
//
//        groupRef.current.width(newWidth);
//        groupRef.current.height(newHeight);
//        imageRef.current.width(newWidth);
//        imageRef.current.height(newHeight);
//        canvasRef.current.width(newWidth);
//        canvasRef.current.height(newHeight);
//
//        groupRef.current.getLayer().batchDraw();
//      }
//    };
//
//    updateDimensions();
//  }, [shapeProps.width, shapeProps.height]);
//
//  return (
//    <>
//      <Group
//        ref={groupRef}
//        x={shapeProps.x}
//        y={shapeProps.y}
//        width={shapeProps.width}
//        height={shapeProps.height}
//        draggable
//        onClick={onSelect}
//        onTap={onSelect}
//        onDragStart={() => setIsTransforming(true)}
//        onDragEnd={(e) => {
//          Konva.Group.prototype.onDragEnd.call(e.target, e);
//          onChange({
//            ...shapeProps,
//            x: e.target.x(),
//            y: e.target.y(),
//          });
//          setIsTransforming(false);
//        }}
//        onTransformStart={() => setIsTransforming(true)}
//        onTransformEnd={(e) => {
//          const node = groupRef.current;
//          const scaleX = node.scaleX();
//          const scaleY = node.scaleY();
//          
//          // Reset scale
//          node.scaleX(1);
//          node.scaleY(1);
//          
//          const snapToGrid = Konva.Group.prototype.snapToGrid;
//          const newWidth = Math.max(5, snapToGrid(node.width() * scaleX));
//          const newHeight = Math.max(5, snapToGrid(node.height() * scaleY));
//          
//          node.width(newWidth);
//          node.height(newHeight);
//          
//          const newProps = {
//            ...shapeProps,
//            x: snapToGrid(node.x()),
//            y: snapToGrid(node.y()),
//            width: newWidth,
//            height: newHeight,
//          };
//
//          onChange(newProps);
//          
//          node.getLayer().batchDraw();
//          setIsTransforming(false);
//        }}
//      >
//        <KonvaImage
//          ref={imageRef}
//          image={shapeProps.image}
//          width={shapeProps.width}
//          height={shapeProps.height}
//          listening={true}
//        />
//        <KonvaImage
//          ref={canvasRef}
//          width={shapeProps.width}
//          height={shapeProps.height}
//          listening={false}
//        />
//      </Group>
//      {isSelected && (
//        <Transformer
//          ref={trRef}
//          flipEnabled={false}
//          enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
//          rotateEnabled={false}
//          keepRatio
//          boundBoxFunc={(oldBox, newBox) => {
//            if (newBox.width < 5 || newBox.height < 5) {
//              return oldBox;
//            }
//            return newBox;
//          }}
//        />
//      )}
//    </>
//  );
//};
//
//const Editor = () => {
//  const [images, setImages] = useState([]);
//  const [selectedId, setSelectedId] = useState(null);
//  const [scale, setScale] = useState(1);
//  const [canvasSize, setCanvasSize] = useState({
//    width: window.innerWidth,
//    height: window.innerHeight,
//  });
//  const [history, setHistory] = useState([]);
//  const [historyStep, setHistoryStep] = useState(-1);
//  const [imageCache, setImageCache] = useState({});
//
//  const stageRef = useRef(null);
//  const isPanning = useRef(false);
//  const lastPos = useRef({ x: 0, y: 0 });
//  const isDraggingShape = useRef(false);
//
//  const handleImageChange = (id, newProps) => {
//    setImages(prevImages =>
//      prevImages.map(img =>
//        img.id === id ? { ...img, ...newProps } : img
//      )
//    );
//  };
//
//  const handleNewImage = (base64Image, source) => {
//    const newImage = new window.Image();
//    newImage.src = base64Image;
//  
//    newImage.onload = () => {
//      const maxDimension = 350;
//      let newWidth = newImage.width;
//      let newHeight = newImage.height;
//  
//      if (newWidth > maxDimension || newHeight > maxDimension) {
//        if (newWidth > newHeight) {
//          newHeight = (newHeight * maxDimension) / newWidth;
//          newWidth = maxDimension;
//        } else {
//          newWidth = (newWidth * maxDimension) / newHeight;
//          newHeight = maxDimension;
//        }
//      }
//  
//      const imageScreenX = 40;
//      const imageScreenY = 330; 
//  
//      const stage = stageRef.current.getStage();
//      const scale = stage.scaleX();
//      const stageX = stage.x();
//      const stageY = stage.y();
//  
//      const canvasOffsetX = stageX / scale;
//      const canvasOffsetY = stageY / scale;
//  
//      const canvasX = imageScreenX - canvasOffsetX;
//      const canvasY = imageScreenY - canvasOffsetY;
//  
//      const newImageObj = {
//        id: Date.now().toString(),
//        x: canvasX,
//        y: canvasY,
//        width: newWidth,
//        height: newHeight,
//        src: newImage.src,
//      };
//  
//      setImages((prevImages) => [...prevImages, newImageObj]);
//      setImageCache((prevCache) => ({
//        ...prevCache,
//        [newImageObj.id]: newImage,
//      }));
//      setSelectedId(newImageObj.id);
//    };
//  
//    newImage.onerror = (error) => {
//      console.error("Error loading new image:", error);
//    };
//  };
//
//  const handleWheel = (e) => {
//    e.evt.preventDefault();
//    const stage = stageRef.current;
//    if (!stage) return;
//
//    const scaleBy = 1.1;
//    const oldScale = stage.scaleX();
//    const mousePointTo = {
//      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
//      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
//    };
//
//    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
//    const clampedScale = Math.max(1, Math.min(6000 / window.innerWidth, newScale));
//    setScale(clampedScale);
//
//    const newCanvasWidth = Math.max(window.innerWidth, Math.min(6000, window.innerWidth * clampedScale));
//    const newCanvasHeight = Math.max(window.innerHeight, Math.min(6000, window.innerHeight * clampedScale));
//    setCanvasSize({ width: newCanvasWidth, height: newCanvasHeight });
//
//    const newPos = {
//      x: -(mousePointTo.x - stage.getPointerPosition().x / clampedScale) * clampedScale,
//      y: -(mousePointTo.y - stage.getPointerPosition().y / clampedScale) * clampedScale,
//    };
//
//    stage.scale({ x: clampedScale, y: clampedScale });
//    stage.position(newPos);
//    stage.batchDraw();
//  };
//
//  const handleDownload = () => {
//    if (selectedId) {
//      const selectedImage = images.find(img => img.id === selectedId);
//      if (selectedImage && imageCache[selectedId]) {
//        const img = imageCache[selectedId];
//        
//        let newWidth = img.width;
//        let newHeight = img.height;
//        if (newWidth > 1024 || newHeight > 1024) {
//          if (newWidth > newHeight) {
//            newHeight = (newHeight * 1024) / newWidth;
//            newWidth = 1024;
//          } else {
//            newWidth = (newWidth * 1024) / newHeight;
//            newHeight = 1024;
//          }
//        }
//
//        const canvas = document.createElement('canvas');
//        canvas.width = newWidth;
//        canvas.height = newHeight;
//        const ctx = canvas.getContext('2d');
//
//        ctx.drawImage(img, 0, 0, newWidth, newHeight);
//
//        const dataURL = canvas.toDataURL('image/png');
//
//        const link = document.createElement('a');
//        link.download = `quvi-${selectedId}.png`;
//        link.href = dataURL;
//        link.click();
//      }
//    }
//  };
//
//  const handleMouseDown = (e) => {
//    const stage = stageRef.current.getStage();
//    if (!stage) return;
//
//    if (e.evt.button === 0) {
//      if (e.target === stage) {
//        setSelectedId(null);
//        isPanning.current = true;
//        lastPos.current = { x: e.evt.clientX, y: e.evt.clientY };
//        const isShapeUnderCursor = e.target.findAncestor('KonvaImage');
//        isDraggingShape.current = !!isShapeUnderCursor;
//      }
//    }
//  };
//
//  const handleMouseMove = (e) => {
//    const stage = stageRef.current;
//    if (!stage) return;
//
//    if (isPanning.current && !isDraggingShape.current) {
//      const pos = {
//        x: stage.x() + (e.evt.clientX - lastPos.current.x),
//        y: stage.y() + (e.evt.clientY - lastPos.current.y),
//      };
//
//      stage.position(pos);
//      stage.batchDraw();
//      lastPos.current = { x: e.evt.clientX, y: e.evt.clientY };
//    }
//  };
//
//  const handleMouseUp = () => {
//    isPanning.current = false;
//    isDraggingShape.current = false;
//  };
//
//  const handleKeyDown = (e) => {
//    if (e.key === 'Delete' && selectedId) {
//      setImages(images.filter(image => image.id !== selectedId));
//      setSelectedId(null);
//    } else if (e.ctrlKey && e.key === 'z') {
//      handleUndo();
//    } else if (e.ctrlKey && e.key === 'y') {
//      handleRedo();
//    }
//  };
//
//  const saveHistory = () => {
//    const newHistory = history.slice(0, historyStep + 1);
//    newHistory.push(images);
//    setHistory(newHistory);
//    setHistoryStep(newHistory.length - 1);
//  };
//
//  const handleUndo = () => {
//    if (historyStep > 0) {
//      const prevStep = historyStep - 1;
//      setImages(history[prevStep]);
//      setHistoryStep(prevStep);
//    }
//  };
//
//  const handleRedo = () => {
//    if (historyStep < history.length - 1) {
//      const nextStep = historyStep + 1;
//      setImages(history[nextStep]);
//      setHistoryStep(nextStep);
//    }
//  };
//
//  useEffect(() => {
//    document.addEventListener('keydown', handleKeyDown);
//    return () => {
//      document.removeEventListener('keydown', handleKeyDown);
//    };
//  }, [handleKeyDown]);
//
//  useEffect(() => {
//    saveHistory();
//  }, [images]);
//
//  return (
//    <>
//      <div style={{ overflow: 'hidden', width: '100vw', height: '100vh' }}>
//        <HeaderEditor showDownloadButton={selectedId !== null} onDownload={handleDownload} />
//        <UploadButton onImageUpload={(base64Image) => handleNewImage(base64Image, 'upload')} />
//        {!selectedId ? (
//          <TextToImage onImageGenerated={(base64Image) => handleNewImage(base64Image, 'textToImage')} />
//        ) : (
//          <MaskArea />
//        )}
//
//        <Stage
//          width={canvasSize.width}
//          height={canvasSize.height}
//          ref={stageRef}
//          onWheel={handleWheel}
//          onMouseDown={handleMouseDown}
//          onMouseMove={handleMouseMove}
//          onMouseUp={handleMouseUp}
//        >
//          <Layer>
//            {images.map((image) => (
//              <CustomImage
//                key={image.id}
//                shapeProps={{
//                  ...image,
//                  image: imageCache[image.id],
//                }}
//                isSelected={image.id === selectedId}
//                onSelect={() => setSelectedId(image.id)}
//                onChange={(newProps) => handleImageChange(image.id, newProps)}
//              />
//            ))}
//          </Layer>
//        </Stage>
//      </div>
//    </>
//  );
//};
//
//export default Editor;

import React, { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage, Transformer, Group } from 'react-konva';
import HeaderEditor from '../Header/HeaderEditor';
import TextToImage from '../TextToImage/TextToImage';
import Konva from 'konva';
import MaskArea from '../MaskComponents/MaskArea';
import UploadButton from '../uploadButton/UploadButton';

Konva.Group.prototype.snapToGrid = function(value) {
  const GRID_SIZE = 10;
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
};

Konva.Group.prototype.onDragEnd = function(e) {
  const node = e.target;
  const snapToGrid = this.snapToGrid;

  node.position({
    x: snapToGrid(node.x()),
    y: snapToGrid(node.y()),
  });

  node.getLayer().batchDraw();
};

Konva.Group.prototype.onTransformEnd = function(e) {
  const node = e.target;
  const snapToGrid = this.snapToGrid;

  const scaleX = node.scaleX();
  const scaleY = node.scaleY();

  node.scaleX(1);
  node.scaleY(1);

  node.setAttrs({
    x: snapToGrid(node.x()),
    y: snapToGrid(node.y()),
    width: Math.max(5, snapToGrid(node.width() * scaleX)),
    height: Math.max(5, snapToGrid(node.height() * scaleY)),
  });

  node.getLayer().batchDraw();
};

const CustomImage = ({ shapeProps, isSelected, onSelect, onChange, brushMode }) => {
  const imageRef = useRef();
  const canvasRef = useRef();
  const groupRef = useRef();
  const trRef = useRef();
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastLine, setLastLine] = useState(null);
  const [isTransforming, setIsTransforming] = useState(false);

  useEffect(() => {
    if (isSelected && trRef.current && groupRef.current) {
      trRef.current.nodes([groupRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.draggable(!brushMode);
    }
  }, [brushMode]);

  const handleMouseDown = (e) => {
    if (!brushMode) return;
    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    setLastLine([pos.x, pos.y]);
  };

  const handleMouseMove = (e) => {
    if (!brushMode || !isDrawing) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const ctx = canvasRef.current.getContext();
    ctx.strokeStyle = shapeProps.brushColor || '#000000';
    ctx.lineJoin = 'round';
    ctx.lineWidth = shapeProps.brushSize || 5;
    ctx.beginPath();
    ctx.moveTo(lastLine[0], lastLine[1]);
    ctx.lineTo(point.x, point.y);
    ctx.closePath();
    ctx.stroke();
    setLastLine([point.x, point.y]);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  useEffect(() => {
    const updateDimensions = () => {
      if (groupRef.current && imageRef.current && canvasRef.current) {
        const newWidth = shapeProps.width;
        const newHeight = shapeProps.height;

        groupRef.current.width(newWidth);
        groupRef.current.height(newHeight);
        imageRef.current.width(newWidth);
        imageRef.current.height(newHeight);
        canvasRef.current.width(newWidth);
        canvasRef.current.height(newHeight);

        groupRef.current.getLayer().batchDraw();
      }
    };

    updateDimensions();
  }, [shapeProps.width, shapeProps.height]);

  return (
    <>
      <Group
        ref={groupRef}
        x={shapeProps.x}
        y={shapeProps.y}
        width={shapeProps.width}
        height={shapeProps.height}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDragStart={() => setIsTransforming(true)}
        onDragEnd={(e) => {
          Konva.Group.prototype.onDragEnd.call(e.target, e);
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
          setIsTransforming(false);
        }}
        onTransformStart={() => setIsTransforming(true)}
        onTransformEnd={(e) => {
          const node = groupRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);

          const snapToGrid = Konva.Group.prototype.snapToGrid;
          const newWidth = Math.max(5, snapToGrid(node.width() * scaleX));
          const newHeight = Math.max(5, snapToGrid(node.height() * scaleY));

          node.width(newWidth);
          node.height(newHeight);

          const newProps = {
            ...shapeProps,
            x: snapToGrid(node.x()),
            y: snapToGrid(node.y()),
            width: newWidth,
            height: newHeight,
          };

          onChange(newProps);

          node.getLayer().batchDraw();
          setIsTransforming(false);
        }}
      >
        <KonvaImage
          ref={imageRef}
          image={shapeProps.image}
          width={shapeProps.width}
          height={shapeProps.height}
          listening={true}
        />
        <KonvaImage
          ref={canvasRef}
          width={shapeProps.width}
          height={shapeProps.height}
          listening={false}
        />
      </Group>
      {isSelected && !brushMode && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
          rotateEnabled={false}
          keepRatio
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

const Editor = () => {
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [scale, setScale] = useState(1);
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [imageCache, setImageCache] = useState({});
  const [brushMode, setBrushMode] = useState(false);

  const stageRef = useRef(null);
  const isPanning = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const isDraggingShape = useRef(false);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);

  const handleImageChange = (id, newProps) => {
    setImages(prevImages =>
      prevImages.map(img =>
        img.id === id ? { ...img, ...newProps, brushColor, brushSize } : img
      )
    );
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/userInfo/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        setErrorMessage(`Kullanıcı verileri alınırken bir hata oluştu: ${errorText}`);
        console.error('Kullanıcı verileri alınırken hata oluştu:', response.statusText);
        return;
      }

      const data = await response.json();
      setUserData(data);
      setIsAuthenticated(true);
      console.log('Kullanıcı Verileri:', data);
    } catch (error) {
      console.error('Kullanıcı verileri alınırken hata oluştu:', error);
      setErrorMessage('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleNewImage = (base64Image, source) => {
    const newImage = new window.Image();
    newImage.src = base64Image;

    newImage.onload = () => {
      const maxDimension = 350;
      let newWidth = newImage.width;
      let newHeight = newImage.height;

      if (newWidth > maxDimension || newHeight > maxDimension) {
        if (newWidth > newHeight) {
          newHeight = (newHeight * maxDimension) / newWidth;
          newWidth = maxDimension;
        } else {
          newWidth = (newWidth * maxDimension) / newHeight;
          newHeight = maxDimension;
        }
      }

      const imageScreenX = 40;
      const imageScreenY = 330;

      const stage = stageRef.current.getStage();
      const scale = stage.scaleX();
      const stageX = stage.x();
      const stageY = stage.y();

      const canvasOffsetX = stageX / scale;
      const canvasOffsetY = stageY / scale;

      const canvasX = imageScreenX - canvasOffsetX;
      const canvasY = imageScreenY - canvasOffsetY;

      const newImageObj = {
        id: Date.now().toString(),
        x: canvasX,
        y: canvasY,
        width: newWidth,
        height: newHeight,
        src: newImage.src,
      };

      setImages((prevImages) => [...prevImages, newImageObj]);
      setImageCache((prevCache) => ({
        ...prevCache,
        [newImageObj.id]: newImage,
      }));
      setSelectedId(newImageObj.id);
    };

    newImage.onerror = (error) => {
      console.error('Error loading new image:', error);
    };
  };

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const scaleBy = 1.1;
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const clampedScale = Math.max(1, Math.min(6000 / window.innerWidth, newScale));
    setScale(clampedScale);

    const newCanvasWidth = Math.max(window.innerWidth, Math.min(6000, window.innerWidth * clampedScale));
    const newCanvasHeight = Math.max(window.innerHeight, Math.min(6000, window.innerHeight * clampedScale));
    setCanvasSize({ width: newCanvasWidth, height: newCanvasHeight });

    const newPos = {
      x: -(mousePointTo.x - stage.getPointerPosition().x / clampedScale) * clampedScale,
      y: -(mousePointTo.y - stage.getPointerPosition().y / clampedScale) * clampedScale,
    };

    stage.scale({ x: clampedScale, y: clampedScale });
    stage.position(newPos);
    stage.batchDraw();
  };

  const handleDownload = () => {
    if (selectedId) {
      const selectedImage = images.find((img) => img.id === selectedId);
      if (selectedImage && imageCache[selectedId]) {
        const img = imageCache[selectedId];

        let newWidth = img.width;
        let newHeight = img.height;
        if (newWidth > 1024 || newHeight > 1024) {
          if (newWidth > newHeight) {
            newHeight = (newHeight * 1024) / newWidth;
            newWidth = 1024;
          } else {
            newWidth = (newWidth * 1024) / newHeight;
            newHeight = 1024;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        const dataURL = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.download = `quvi-${selectedId}.png`;
        link.href = dataURL;
        link.click();
      }
    }
  };

  const handleMouseDown = (e) => {
    const stage = stageRef.current.getStage();
    if (!stage) return;

    if (e.evt.button === 0) {
      if (e.target === stage) {
        setSelectedId(null);
        isPanning.current = true;
        lastPos.current = { x: e.evt.clientX, y: e.evt.clientY };
        const isShapeUnderCursor = e.target.findAncestor('KonvaImage');
        isDraggingShape.current = !!isShapeUnderCursor;
      }
    }
  };

  const handleMouseMove = (e) => {
    const stage = stageRef.current;
    if (!stage) return;

    if (isPanning.current && !isDraggingShape.current) {
      const pos = {
        x: stage.x() + (e.evt.clientX - lastPos.current.x),
        y: stage.y() + (e.evt.clientY - lastPos.current.y),
      };

      stage.position(pos);
      stage.batchDraw();
      lastPos.current = { x: e.evt.clientX, y: e.evt.clientY };
    }
  };

  const handleMouseUp = () => {
    isPanning.current = false;
    isDraggingShape.current = false;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Delete' && selectedId) {
      setImages(images.filter((image) => image.id !== selectedId));
      setSelectedId(null);
    } else if (e.ctrlKey && e.key === 'z') {
      handleUndo();
    } else if (e.ctrlKey && e.key === 'y') {
      handleRedo();
    }
  };

  const saveHistory = () => {
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(images);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      const prevStep = historyStep - 1;
      setImages(history[prevStep]);
      setHistoryStep(prevStep);
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      const nextStep = historyStep + 1;
      setImages(history[nextStep]);
      setHistoryStep(nextStep);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    saveHistory();
  }, [images]);

  return (
    <>
      <div style={{ overflow: 'hidden', width: '100vw', height: '100vh' }}>
        {userData && (
          <HeaderEditor
            userData={userData}
            showDownloadButton={selectedId !== null}
            onDownload={handleDownload}
          />
        )}
        <UploadButton onImageUpload={(base64Image) => handleNewImage(base64Image, 'upload')} />
        {!selectedId ? (
          <TextToImage onImageGenerated={(base64Image) => handleNewImage(base64Image, 'textToImage')} />
        ) : (
          <MaskArea
            brushMode={brushMode}
            setBrushMode={setBrushMode}
            brushColor={brushColor}
            setBrushColor={setBrushColor}
            brushSize={brushSize}
            setBrushSize={setBrushSize}
          />
        )}

        <Stage
          width={canvasSize.width}
          height={canvasSize.height}
          ref={stageRef}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <Layer>
            {images.map((image) => (
              <CustomImage
                brushMode={brushMode}
                key={image.id}
                shapeProps={{
                  ...image,
                  image: imageCache[image.id],
                }}
                isSelected={image.id === selectedId}
                onSelect={() => setSelectedId(image.id)}
                onChange={(newProps) => handleImageChange(image.id, newProps)}
              />
            ))}
          </Layer>
        </Stage>
      </div>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </>
  );
};

export default Editor;
