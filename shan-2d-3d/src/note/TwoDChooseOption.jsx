import React, { useState } from "react";
import { Button, Modal, Offcanvas } from "react-bootstrap";

const TwoDChooseOption = ({pathee, frontNumber, backNumber, powerNumber, twentyNumbers, permunated, breakGroup, singleDouble, addDigits}) => {
  const [isOp2Show, setIsOp2Show] = useState(false);

  const breakNums = [
    {"id" : 1, "group" : "0/10"},
    {"id" : 2, "group" : "1/11"},
    {"id" : 3, "group" : "2/12"},
    {"id" : 4, "group" : "3/13"},
    {"id" : 5, "group" : "4/14"},
    {"id" : 6, "group" : "5/15"},
    {"id" : 7, "group" : "6/16"},
    {"id" : 8, "group" : "7/17"},
    {"id" : 9, "group" : "8/18"},
    {"id" : 10, "group" : "9/19"},
  ];
  
  const sizes = [
    { id: 1, group: "ညီအစ်ကို" },
    { id: 2, group: "ကြီး" },
    { id: 3, group: "ငယ်" },
    { id: 4, group: "မ" },
    { id: 5, group: "စုံ" },
    { id: 6, group: "စုံစုံ" },
    { id: 7, group: "စုံမ" },
    { id: 8, group: "အပူး" },
  ];

  const kwat20 = ["00-19", "20-39", "40-59", "60-79", "80-99"];

  // Mapping from break group id to actual digit sets
  const breakGroupDigits = {
    1: ["01", "10", "29", "38", "47", "56"],
    2: ["11", "20", "39", "48", "57", "66"],
    3: ["21", "30", "49", "58", "67"],
    4: ["31", "40", "22", "59", "68", "77"],
    5: ["41", "50", "69", "78", "32"],
    6: ["51", "60", "79", "33", "88"],
    7: ["61", "70", "89", "43", "98"],
    8: ["71", "80", "99", "53", "44"],
    9: ["81", "90", "18", "27", "36"],
    10: ["91", "28", "37", "46", "55"]
  };

  // Corrected singleDoubleDigits mapping
  const singleDoubleDigits = {
    1: ["01","12","23","34","45","56","67","78","89","90"], // ညီအစ်ကို
    2: [ "55","56","57","58","59","65","66","67","68","69","75","76","77","78","79","85","86","87","88","89","95","96","97","98","99"], // ကြီး
    3: ["00","01","02","03","04","10","11","12","13","14","20","21","22","23","24","30","31","32","33","34","40","41","42","43","44"], // ငယ်
    4: ["11","13","15","17","19","31","33","35","37","39","51","53","55","57","59","71","73","75","77","79","91","93","95","97","99"], // မ
    5: ["00","02","04","06","08","20","22","24","26","28","40","42","44","46","48","60","62","64","66","68","80","82","84","86","88"], // စုံ
    6: ["01","12","23","34","45","56","67","78","89","90","10","21","32","43","54","65","76","87","98","09","30","41","52","63","74"], // စုံစုံ
    7: ["00","11","22","33","44","55","66","77","88","99"], // စုံမ
    8: ["00","11","22","33","44","55","66","77","88","99"], // အပူး
  };

  return (
    <div className="flex justify-around items-center px-3 py-3 mb-3 gap-4">
      <div className="flex flex-col items-center cursor-pointer" onClick={() => setIsOp2Show(!isOp2Show)}>
        <div className="w-8 h-8 mb-2 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm">⚡</span>
        </div>
        <span className="text-xs">အမြန်ရွေး</span>
      </div>

      <div className="flex flex-col items-center cursor-pointer" onClick={() => permunated()}>
        <div className="w-8 h-8 mb-2 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm">🔄</span>
        </div>
        <span className="text-xs">ပတ်လည်</span>
      </div>

      <Offcanvas
        placement="top"
        show={isOp2Show}
        onHide={() => setIsOp2Show(false)}
        className="!bg-gray-800/95 !backdrop-blur-xl"
        backdropClassName="!bg-black/70 !backdrop-blur-sm"
        style={{ zIndex: 9999 }}
      >
        <Offcanvas.Header closeButton className="!border-b-0 !bg-gray-800/80">
          <Offcanvas.Title className="font-bold text-lg text-white">အမြန်ရွေး</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-4 space-y-6 max-h-[70vh] overflow-y-auto !bg-gray-800/90">
          <div>
            <p className="text-gold font-bold mb-2">ဘရိတ်</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {breakNums.map((num, index) => {
                return (
                  <button
                    key={index}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-gold/20 to-gold/10 text-gold font-semibold shadow-lg hover:from-gold/30 hover:to-gold/20 border border-gold/50 transition-all duration-300 hover:scale-105"
                    onClick={() => { breakGroup(num.id); addDigits(breakGroupDigits[num.id] || []); setIsOp2Show(false); }}
                  >
                    {num.group}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <p className="text-gold font-bold mb-2">Single & Double Size</p>
            <div className="flex overflow-x-auto flex-nowrap gap-x-2 pb-2 mb-4">
              {sizes.map((size, index) => (
                <button
                  key={index}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-gold/20 to-gold/10 text-gold font-semibold shadow-lg hover:from-gold/30 hover:to-gold/20 border border-gold/50 transition-all duration-300 hover:scale-105 shrink-0"
                  onClick={() => { singleDouble(size.id); addDigits(singleDoubleDigits[size.id] || []); setIsOp2Show(false); }}
                >
                  {size.group}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-gold font-bold mb-2">20 ဂဏန်း</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {kwat20.map((n) => (
                <button
                  key={n}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-gold/20 to-gold/10 text-gold font-semibold shadow-lg hover:from-gold/30 hover:to-gold/20 border border-gold/50 transition-all duration-300 hover:scale-105"
                  onClick={() => [twentyNumbers(n), setIsOp2Show(false)]}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default TwoDChooseOption;
