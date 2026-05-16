import Cropper from "react-easy-crop";
import { useState, useCallback } from "react";

const ImageCropper = ({
  image,
  onClose,
  onCropDone,
  defaultAspect = 3 / 5
}) => {

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(defaultAspect);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCrop = async () => {
    const canvas = document.createElement("canvas");
    const img = new Image();
    img.src = image;

    img.onload = () => {
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        img,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob((blob) => {
        const croppedFile = new File([blob], "cropped.jpg", {
          type: "image/jpeg",
        });
        onCropDone(croppedFile);
      }, "image/jpeg");
    };
  };

  return (
    <div className="cropper-modal" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      
      <div style={{ position: "relative", width: "90%", maxWidth: "500px", height: "400px", background: '#111', borderRadius: '8px', overflow: 'hidden' }}>
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '15px', alignItems: 'center', width: '90%', maxWidth: '500px', background: '#222', padding: '15px', borderRadius: '8px' }}>
        <label style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          Zoom:
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
            style={{ flex: 1 }}
          />
        </label>
        <select 
          value={aspect} 
          onChange={(e) => setAspect(Number(e.target.value))}
          style={{ padding: '8px', background: '#333', color: 'white', border: '1px solid #444', borderRadius: '4px' }}
        >
          <option value={3 / 5}>3:5 (Product — recommended)</option>
          <option value={9 / 16}>9:16 (Product — tall)</option>
          <option value={1}>1:1 (Square)</option>
          <option value={3 / 4}>3:4 (Portrait)</option>
          <option value={4 / 3}>4:3 (Landscape)</option>
          <option value={16 / 9}>16:9 (Widescreen / Banner)</option>
          
        </select>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button className="view-btn" onClick={handleCrop} style={{ background: 'white', color: 'black', fontWeight: 'bold' }}>
          Crop Image
        </button>
        <button className="view-btn danger" onClick={onClose}>
          Cancel
        </button>
      </div>

    </div>
  );
};

export default ImageCropper;