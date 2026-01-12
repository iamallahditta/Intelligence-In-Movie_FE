import React, { useRef, useState } from "react";

import Button from "./Button";
import SignaturePad from "react-signature-canvas";

const SignatureCanvas = ({ sigPadRef, signature, setSignature }) => {
  const handleClear = () => {
    if (!sigPadRef?.current?.isEmpty()) {
      sigPadRef?.current?.clear();
      setSignature(null);
    }

    if (signature) {
      setSignature(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="border-[1px] border-gray-200 rounded-lg relative ">
        {!signature ? (
          <SignaturePad
            ref={sigPadRef}
            canvasProps={{
              className: "w-full h-[200px] rounded-lg",
            }}
          />
        ) : (
          <img
            src={signature}
            alt="Signature"
            className="w-full h-[200px] object-contain rounded-lg"
          />
        )}

        <div className="w-[80px] absolute bottom-1 right-1">
          <Button
            label="Clear"
            onClick={handleClear}
            outline={true}
            small={true}
          />
        </div>
      </div>
    </div>
  );
};

export default SignatureCanvas;
