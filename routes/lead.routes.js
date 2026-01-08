// server.js
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- MASTER ASSET DATA (YOUR EXISTING ARRAY) ----------
const assets = [
  {
    srNo: 1,
    modelAndDetails: "Desktop HP tiny RAM 8 GB",
    purchasedFrom: "DTS",
    billNo: "",
    dateOfPurchase: "Sept. 2024",
    quantity: 1,
    rate: "",
    price: "",
    assetLocation: "Work Station A",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 2,
    modelAndDetails: "Desktop HP tiny RAM 8 GB",
    purchasedFrom: "DTS",
    billNo: "",
    dateOfPurchase: "Sept. 2024",
    quantity: 1,
    rate: "",
    price: "",
    assetLocation: "Work Station B",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 3,
    modelAndDetails: "Desktop computer HD Graphics",
    purchasedFrom: "DTS",
    billNo: "",
    dateOfPurchase: "Sept. 2024",
    quantity: 1,
    rate: "",
    price: "53000",
    assetLocation: "Counter",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 4,
    modelAndDetails: "Desktop",
    purchasedFrom: "DTS",
    billNo: "",
    dateOfPurchase: "N.A.",
    quantity: "",
    rate: "",
    price: "",
    assetLocation: "Counter",
    usingBy: "",
    remarks: "RD Badoniya sir",
  },
  {
    srNo: 5,
    modelAndDetails: "Laptop 1 (Processor- i5, RAM- 8GB, HP)",
    purchasedFrom: "DTS",
    billNo: "",
    dateOfPurchase: "Sept. 2024",
    quantity: 1,
    rate: "",
    price: "",
    assetLocation: "Counselor",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 6,
    modelAndDetails: "Laptop2 (HP, RAM- 8 GB, Processor- i5)",
    purchasedFrom: "DTS",
    billNo: "",
    dateOfPurchase: "Sept. 2024",
    quantity: 2,
    rate: "",
    price: "",
    assetLocation: "Office",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 7,
    modelAndDetails: "Laptop (DELL, RAM- 16 GB, Processor- i7)",
    purchasedFrom: "DTS",
    billNo: "",
    dateOfPurchase: "Jan. 2025",
    quantity: 3,
    rate: "",
    price: "",
    assetLocation: "Counselor",
    usingBy: "January",
    remarks: "",
  },
  {
    srNo: 8,
    modelAndDetails: "Printer Brother DCP-L2541 DW",
    purchasedFrom: "DTS",
    billNo: "",
    dateOfPurchase: "August -2024",
    quantity: 1,
    rate: "",
    price: "",
    assetLocation: "Office",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 9,
    modelAndDetails: "Mobile No. 1 OPPO 18",
    purchasedFrom: "As per bill",
    billNo: "",
    dateOfPurchase: "August -2024",
    quantity: 1,
    rate: "",
    price: "",
    assetLocation: "",
    usingBy: "Pallavi",
    remarks: "",
  },
  {
    srNo: 10,
    modelAndDetails: "Mobile No. 1 OPPO 18",
    purchasedFrom: "As per bill",
    billNo: "",
    dateOfPurchase: "August -2024",
    quantity: 1,
    rate: "",
    price: "",
    assetLocation: "",
    usingBy: "Mahi Pathak",
    remarks: "",
  },
  {
    srNo: 11,
    modelAndDetails: "CCTV Cameras for Office (3)",
    purchasedFrom: "Paras Traders Ankur colony",
    billNo: "",
    dateOfPurchase: "Sept. 2024",
    quantity: 1,
    rate: "",
    price: "",
    assetLocation: "Office",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 12,
    modelAndDetails: "CCTV Cameras for Class (1)",
    purchasedFrom: "Paras Traders Ankur colony",
    billNo: "",
    dateOfPurchase: "Sept. 2024",
    quantity: 1,
    rate: "",
    price: "",
    assetLocation: "Class",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 13,
    modelAndDetails: "CCTV Cameras for Trainer room (1)",
    purchasedFrom: "Paras Traders Ankur colony",
    billNo: "",
    dateOfPurchase: "Sept. 2024",
    quantity: 1,
    rate: "",
    price: "",
    assetLocation: "Trainer room",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 14,
    modelAndDetails: "Fan in Office (4)",
    purchasedFrom: "Mayaram Electronics",
    billNo: "",
    dateOfPurchase: "Aug. 2024",
    quantity: 4,
    rate: "",
    price: "",
    assetLocation: "Office",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 15,
    modelAndDetails: "Fan in Class (2)",
    purchasedFrom: "Mayaram Electronics",
    billNo: "",
    dateOfPurchase: "Aug. 2024",
    quantity: 2,
    rate: "",
    price: "",
    assetLocation: "Class",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 16,
    modelAndDetails: "Fan in Trainer room (1)",
    purchasedFrom: "Mayaram Electronics",
    billNo: "",
    dateOfPurchase: "Aug. 2024",
    quantity: 1,
    rate: "",
    price: "",
    assetLocation: "Trainer room",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 17,
    modelAndDetails: "Student Chair (6) with Book Top",
    purchasedFrom: "Balaji Hardware",
    billNo: "",
    dateOfPurchase: "Nov. 2024",
    quantity: 6,
    rate: "",
    price: "",
    assetLocation: "English Class",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 18,
    modelAndDetails: "Executive Chairs (5)",
    purchasedFrom: "Balaji Hardware",
    billNo: "",
    dateOfPurchase: "Nov. 2024",
    quantity: 5,
    rate: "",
    price: "",
    assetLocation: "Office and Trainer room",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 19,
    modelAndDetails: "Fiber black chairs (4)",
    purchasedFrom: "Balaji Hardware",
    billNo: "",
    dateOfPurchase: "Sept. 2024",
    quantity: 4,
    rate: "",
    price: "",
    assetLocation: "Office",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 20,
    modelAndDetails: "Black chair (4)",
    purchasedFrom: "Balaji Hardware",
    billNo: "",
    dateOfPurchase: "Sept. 2024",
    quantity: 4,
    rate: "",
    price: "",
    assetLocation: "Office and class",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 21,
    modelAndDetails: "Tables (9)",
    purchasedFrom: "Mayaram Hardware",
    billNo: "",
    dateOfPurchase: "Sept. 2024",
    quantity: 9,
    rate: "",
    price: "",
    assetLocation: "Class",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 22,
    modelAndDetails: "Plastic Chairs for Students (12)",
    purchasedFrom: "Balaji Hardware",
    billNo: "",
    dateOfPurchase: "Aug. 2024",
    quantity: 12,
    rate: "",
    price: "",
    assetLocation: "Class and 101 Hostel room and Office",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 23,
    modelAndDetails: "Work station desk (3)",
    purchasedFrom: "Mayaram Hardware",
    billNo: "",
    dateOfPurchase: "Aug. 2024",
    quantity: 3,
    rate: "",
    price: "",
    assetLocation: "Office",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 24,
    modelAndDetails: "Drawers",
    purchasedFrom: "Self-fabricated",
    billNo: "",
    dateOfPurchase: "Aug. 2024",
    quantity: "",
    rate: "",
    price: "",
    assetLocation: "Office",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 25,
    modelAndDetails: "Landline phone (3)",
    purchasedFrom: "Rajpal Radios",
    billNo: "",
    dateOfPurchase: "Nov. 2024",
    quantity: 3,
    rate: "",
    price: "",
    assetLocation: "Office",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 26,
    modelAndDetails: "Square sitting Stool (4)",
    purchasedFrom: "Mayaram Hardware",
    billNo: "",
    dateOfPurchase: "Aug. 2024",
    quantity: 4,
    rate: "",
    price: "",
    assetLocation: "Office",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 27,
    modelAndDetails: "Jio Router (1)",
    purchasedFrom: "Jio Company",
    billNo: "",
    dateOfPurchase: "Aug. 2024",
    quantity: 1,
    rate: "",
    price: "",
    assetLocation: "Office",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 28,
    modelAndDetails: "Speaker 2 set",
    purchasedFrom: "DTS",
    billNo: "",
    dateOfPurchase: "Aug. 2024",
    quantity: 2,
    rate: "",
    price: "",
    assetLocation: "Office",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 29,
    modelAndDetails: "Counter Table (1)",
    purchasedFrom: "Mayaram Hardware",
    billNo: "",
    dateOfPurchase: "Aug. 2024",
    quantity: 1,
    rate: "",
    price: "",
    assetLocation: "Office",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 30,
    modelAndDetails: "Wireless Mouse (2)",
    purchasedFrom: "DTS",
    billNo: "",
    dateOfPurchase: "Nov. 2024",
    quantity: 2,
    rate: "",
    price: "",
    assetLocation: "Muskan/Paridhi",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 31,
    modelAndDetails: "Exhaust (3)",
    purchasedFrom: "",
    billNo: "",
    dateOfPurchase: "Aug. 2024",
    quantity: 3,
    rate: "",
    price: "",
    assetLocation: "Class(1)/Office (2)",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 32,
    modelAndDetails: "White Board (2)-6x4",
    purchasedFrom: "Sunil Stationary",
    billNo: "",
    dateOfPurchase: "Dec. 2024",
    quantity: 2,
    rate: "",
    price: "",
    assetLocation: "English class(1)/technical class (1)",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 33,
    modelAndDetails: "White Board (1)-3x2",
    purchasedFrom: "Sunil Stationary",
    billNo: "",
    dateOfPurchase: "Aug. 2024",
    quantity: 1,
    rate: "",
    price: "",
    assetLocation: "English class",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 34,
    modelAndDetails: "Notice Board (2)",
    purchasedFrom: "Sunil Stationary",
    billNo: "",
    dateOfPurchase: "Nov. 2024",
    quantity: 2,
    rate: "",
    price: "",
    assetLocation: "Technical class (1)/Trainer room (1)",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 35,
    modelAndDetails: "Mirror",
    purchasedFrom: "",
    billNo: "",
    dateOfPurchase: "Nov. 2024",
    quantity: 1,
    rate: "",
    price: "",
    assetLocation: "Eng. Class",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 36,
    modelAndDetails: "Mobile charger (2)",
    purchasedFrom: "",
    billNo: "",
    dateOfPurchase: "Aug. 2024",
    quantity: 2,
    rate: "",
    price: "",
    assetLocation: "Office",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 37,
    modelAndDetails: "Books (10)",
    purchasedFrom: "",
    billNo: "",
    dateOfPurchase: "Oct. 2024",
    quantity: 10,
    rate: "",
    price: "",
    assetLocation: "Office",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 38,
    modelAndDetails: "Wired ear phones (2)/Bluetooth (1)",
    purchasedFrom: "",
    billNo: "",
    dateOfPurchase: "Dec. 2024",
    quantity: "",
    rate: "",
    price: "",
    assetLocation: "Office",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 39,
    modelAndDetails: "AC",
    purchasedFrom: "Shagun Electronics",
    billNo: "",
    dateOfPurchase: "Oct. 2024",
    quantity: 1,
    rate: "",
    price: "",
    assetLocation: "Class",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 40,
    modelAndDetails: "Digital Pen with Graphic table",
    purchasedFrom: "Amazon",
    billNo: "",
    dateOfPurchase: "Oct. 2024",
    quantity: 1,
    rate: "2649",
    price: "",
    assetLocation: "Pallavi",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 41,
    modelAndDetails: "Crown LED TV",
    purchasedFrom: "Vishal Mobile",
    billNo: "",
    dateOfPurchase: "Jan. 08/2025",
    quantity: 1,
    rate: "13000",
    price: "",
    assetLocation: "Office",
    usingBy: "",
    remarks: "RD Badoniya sir",
  },
  {
    srNo: 42,
    modelAndDetails: "1 Laptop (HP,4 RAM- 8 GB, Processor- i7)",
    purchasedFrom: "DTS",
    billNo: "",
    dateOfPurchase: "Jan. 24/2025",
    quantity: 1,
    rate: "",
    price: "",
    assetLocation: "Trainer",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 43,
    modelAndDetails: "2 Water camper (Blue colour)",
    purchasedFrom: "Deependra Traders",
    billNo: "",
    dateOfPurchase: "Jan. 23/2025",
    quantity: 2,
    rate: "1500",
    price: "",
    assetLocation: "Office",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 44,
    modelAndDetails: "Office 365 (Software, for 6 computers)",
    purchasedFrom: "DTS",
    billNo: "",
    dateOfPurchase: "Jan. 29/2025",
    quantity: "",
    rate: "",
    price: "",
    assetLocation: "Mail id Muskan",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 45,
    modelAndDetails: "12 Nilkamal Chairs (12)",
    purchasedFrom: "Balaji Traders",
    billNo: "",
    dateOfPurchase: "Jan. 22/2025",
    quantity: 12,
    rate: "7800",
    price: "",
    assetLocation: "Class and faculty room",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 46,
    modelAndDetails: "1 Pen drive and keyboard",
    purchasedFrom: "Deependra Traders",
    billNo: "",
    dateOfPurchase: "Jan. 31/2025",
    quantity: 1,
    rate: "530",
    price: "",
    assetLocation: "Office",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 47,
    modelAndDetails: "3 water Bottles",
    purchasedFrom: "Baleja Shopping",
    billNo: "",
    dateOfPurchase: "Jan. 31/2025",
    quantity: 3,
    rate: "300",
    price: "",
    assetLocation: "1 in Office and 2 in interview room",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 48,
    modelAndDetails: "CCTV Camera",
    purchasedFrom: "Rahul Jain",
    billNo: "",
    dateOfPurchase: "Jan. 30/2025",
    quantity: 1,
    rate: "2516",
    price: "",
    assetLocation: "1 Camera installed in English class",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 49,
    modelAndDetails: "Attendance Machine",
    purchasedFrom: "Manish Dubey ji",
    billNo: "",
    dateOfPurchase: "Feb. 07/2025",
    quantity: 1,
    rate: "6000",
    price: "",
    assetLocation: "Office",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 50,
    modelAndDetails: "Curtain (5)",
    purchasedFrom: "Lot pot collection",
    billNo: "",
    dateOfPurchase: "Feb. 07/2025",
    quantity: 5,
    rate: "1250",
    price: "",
    assetLocation: "Interview Room",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 51,
    modelAndDetails: "Mouse Wired",
    purchasedFrom: "DTS",
    billNo: "",
    dateOfPurchase: "Feb. 10/2025",
    quantity: "",
    rate: "450",
    price: "",
    assetLocation: "Office",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 52,
    modelAndDetails: "Reaklme Narzo Mobile phone",
    purchasedFrom: "Vishal Mobile",
    billNo: "",
    dateOfPurchase: "Feb. 26/2025",
    quantity: 1,
    rate: "",
    price: "",
    assetLocation: "Interview Room",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 53,
    modelAndDetails: "2 micro Phone",
    purchasedFrom: "Vishal Mobile",
    billNo: "",
    dateOfPurchase: "Feb. 26/2025",
    quantity: 2,
    rate: "",
    price: "",
    assetLocation: "Interview Room",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 54,
    modelAndDetails: "10 water bottle",
    purchasedFrom: "Katra",
    billNo: "",
    dateOfPurchase: "March 5/2025",
    quantity: 10,
    rate: "950",
    price: "",
    assetLocation: "Office",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 55,
    modelAndDetails: "5 Curtain",
    purchasedFrom: "Katra",
    billNo: "",
    dateOfPurchase: "March 5/2025",
    quantity: 5,
    rate: "750",
    price: "",
    assetLocation: "Office",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 56,
    modelAndDetails: "One plus nord CE 2 lite Mobile imei –864835060563479",
    purchasedFrom: "Vishal Mobile",
    billNo: "",
    dateOfPurchase: "05/03/2025",
    quantity: 1,
    rate: "9500",
    price: "",
    assetLocation: "Interview Room",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 57,
    modelAndDetails: "16 Nilkamal Chairs",
    purchasedFrom: "Balaji Furniture",
    billNo: "",
    dateOfPurchase: "March 08 /2025",
    quantity: 16,
    rate: "10560",
    price: "",
    assetLocation: "Class",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 58,
    modelAndDetails: "2 Ton AC",
    purchasedFrom: "Vishal Mobile",
    billNo: "",
    dateOfPurchase: "March 11/2025",
    quantity: 1,
    rate: "",
    price: "",
    assetLocation: "Office",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 59,
    modelAndDetails: "1.5 Ton AC",
    purchasedFrom: "Vishal Mobile",
    billNo: "",
    dateOfPurchase: "March 11/2025",
    quantity: 1,
    rate: "",
    price: "",
    assetLocation: "Interview Room",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 60,
    modelAndDetails: "Cooler",
    purchasedFrom: "Vishal Mobile",
    billNo: "",
    dateOfPurchase: "March 11/2025",
    quantity: 1,
    rate: "",
    price: "",
    assetLocation: "",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 61,
    modelAndDetails: "2 mobile charger (35 watt and 65 watt)",
    purchasedFrom: "",
    billNo: "",
    dateOfPurchase: "March 21/2025",
    quantity: 2,
    rate: "750",
    price: "",
    assetLocation: "Office",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 63,
    modelAndDetails: "1 mobile IQOO (RAM- 8 GB, ROM- 128 GB)",
    purchasedFrom: "Amazon",
    billNo: "",
    dateOfPurchase: "March 24/2025",
    quantity: 1,
    rate: "18514",
    price: "",
    assetLocation: "Admin",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 64,
    modelAndDetails: "Laptop (DELL, RAM- 8 GB, Processor- i7) 7TH Generation",
    purchasedFrom: "DTS",
    billNo: "",
    dateOfPurchase: "APRIL 11/2025",
    quantity: 1,
    rate: "",
    price: "",
    assetLocation: "HR Ma’am",
    usingBy: "Mitali 14-04-25",
    remarks: "",
  },
  {
    srNo: 65,
    modelAndDetails: "Laptop (DELL, RAM- 16 GB, Processor- i7) 9th Generation",
    purchasedFrom: "DTS",
    billNo: "",
    dateOfPurchase: "APRIL 11/2025",
    quantity: 1,
    rate: "",
    price: "",
    assetLocation: "Muskan Kurmi",
    usingBy: "14-04-25",
    remarks: "",
  },
  {
    srNo: 66,
    modelAndDetails: "Five computer Table Size {3/2}",
    purchasedFrom: "V.Furniture",
    billNo: "",
    dateOfPurchase: "JULY 5 /2025",
    quantity: 5,
    rate: "900",
    price: "4500",
    assetLocation: "Classroom",
    usingBy: "5/07/25",
    remarks: "",
  },
  {
    srNo: 67,
    modelAndDetails: "Two Laptop Adaptor [HYNET]",
    purchasedFrom: "DTS (COMPUTER)",
    billNo: "",
    dateOfPurchase: "JULY 5/2025",
    quantity: 2,
    rate: "500",
    price: "1000",
    assetLocation: "Simran/Pallavi mam",
    usingBy: "5/07/25",
    remarks: "",
  },
  {
    srNo: 68,
    modelAndDetails: "Two Notice board Size{3/2}",
    purchasedFrom: "Sunil Stationary",
    billNo: "",
    dateOfPurchase: "JULY 7/2025",
    quantity: 2,
    rate: "650",
    price: "1300",
    assetLocation: "Use placed Student photo at first gallery and classroom",
    usingBy: "07/07/25",
    remarks: "",
  },
  {
    srNo: 69,
    modelAndDetails: "ONE Camper 20 liter",
    purchasedFrom: "Bharat store",
    billNo: "",
    dateOfPurchase: "JULY 11/2025",
    quantity: 1,
    rate: "550",
    price: "550",
    assetLocation: "CLASSROOM",
    usingBy: "11/07/25",
    remarks: "",
  },
  {
    srNo: 70,
    modelAndDetails: "(16) Nilkamal PLASTIC chairs",
    purchasedFrom: "Balaji Furniture",
    billNo: "",
    dateOfPurchase: "JULY 12/2025",
    quantity: 16,
    rate: "650",
    price: "10400",
    assetLocation: "CLASSROOM",
    usingBy: "12/07/25",
    remarks: "",
  },
  {
    srNo: 71,
    modelAndDetails: "One moblie (TECNO)8GB RAM IMEI NUMBER 3552574562253096",
    purchasedFrom: "Vishal moblie",
    billNo: "",
    dateOfPurchase: "AUG 4/2025",
    quantity: 1,
    rate: "9500",
    price: "9500",
    assetLocation: "MUSKAN mam use interview record and chatgpt",
    usingBy: "04/08/25",
    remarks: "",
  },
  {
    srNo: 73,
    modelAndDetails: "One mobile (TECNO)8GB RAM IMEI NUMBER-355257450725756",
    purchasedFrom: "Vishal moblie",
    billNo: "",
    dateOfPurchase: "AUG 4/2025",
    quantity: 1,
    rate: "9500",
    price: "9500",
    assetLocation: "SHUBHANGI mam use interview record and chatgpt",
    usingBy: "04/08/25",
    remarks: "",
  },
  {
    srNo: 74,
    modelAndDetails: "Two speaker set /frontech company",
    purchasedFrom: "DTS",
    billNo: "",
    dateOfPurchase: "05-Aug-25",
    quantity: 2,
    rate: "400",
    price: "800",
    assetLocation: "Office hardik /student interview",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 75,
    modelAndDetails: "Eight steel bottle company name moodware",
    purchasedFrom: "BHARAT STORE",
    billNo: "",
    dateOfPurchase: "12/08/2025",
    quantity: 8,
    rate: "220",
    price: "1760",
    assetLocation: "OFFICE",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 76,
    modelAndDetails: "CCTV CAMERA COLOUR VV DUM CAMERA",
    purchasedFrom: "MAHAKAL",
    billNo: "",
    dateOfPurchase: "25/07/2025",
    quantity: 5,
    rate: "1850",
    price: "21650",
    assetLocation: "ALL INTERVIEW ROOM",
    usingBy: "25/07/2025",
    remarks: "",
  },
  {
    srNo: 77,
    modelAndDetails: "TABLE computer Table Size {3/2}",
    purchasedFrom: "V.Furniture",
    billNo: "",
    dateOfPurchase: "19/09/2025",
    quantity: 4,
    rate: "900",
    price: "3600",
    assetLocation: "All rooms",
    usingBy: "19/09/2025s",
    remarks: "",
  },
  {
    srNo: 78,
    modelAndDetails: "Plastic chairs student Nilkamal",
    purchasedFrom: "Balaji Furniture",
    billNo: "",
    dateOfPurchase: "20/09/2025",
    quantity: 16,
    rate: "650",
    price: "10400",
    assetLocation: "Class room",
    usingBy: "20/09/2025",
    remarks: "",
  },
  {
    srNo: 79,
    modelAndDetails: "Net chairs Company Supremo",
    purchasedFrom: "Balaji Furniture",
    billNo: "",
    dateOfPurchase: "20/09/2025",
    quantity: 5,
    rate: "3200",
    price: "16000",
    assetLocation: "Office /all staff use",
    usingBy: "20/09/2025",
    remarks: "",
  },
  {
    srNo: 80,
    modelAndDetails: "LAPTOP DELL 5480 i7 6TH GENERATION ( 8 GB /256GB)",
    purchasedFrom: "DTS COMPUTER",
    billNo: "",
    dateOfPurchase: "13/09/2025",
    quantity: 1,
    rate: "",
    price: "",
    assetLocation: "Sonal Tomar",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 81,
    modelAndDetails: "LAPTOP DELL LATTITUDE 5300 IS 8TH GEN (84B/256 GB)",
    purchasedFrom: "DTS COMPUTER",
    billNo: "",
    dateOfPurchase: "13/09/2025",
    quantity: 1,
    rate: "",
    price: "",
    assetLocation: "",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 82,
    modelAndDetails: "LAPTOP HP 840 G6 i7 8TH GEN 8 gb 286 gb",
    purchasedFrom: "DTS COMPUTER",
    billNo: "",
    dateOfPurchase: "13/09/2025",
    quantity: 1,
    rate: "",
    price: "",
    assetLocation: "",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 84,
    modelAndDetails: "Acer ASpire lite AL15-41 8 GB RAM",
    purchasedFrom: "AMAZONE",
    billNo: "",
    dateOfPurchase: "07/10/2025",
    quantity: 1,
    rate: "25005",
    price: "",
    assetLocation: "HARDIK",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 84,
    modelAndDetails: "Acer aspire 3 intel core i3 12 gen",
    purchasedFrom: "AMAZONE",
    billNo: "",
    dateOfPurchase: "15/10/2025",
    quantity: 1,
    rate: "26089",
    price: "",
    assetLocation: "",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 84,
    modelAndDetails: "Acer aspire 3 intel core i3 12 gen",
    purchasedFrom: "AMAZONE",
    billNo: "",
    dateOfPurchase: "22/10/2025",
    quantity: 1,
    rate: "25089",
    price: "",
    assetLocation: "muskan",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 85,
    modelAndDetails: "Acer aspire 3 intel core i3 12 gen",
    purchasedFrom: "AMAZONE",
    billNo: "",
    dateOfPurchase: "25/10/2025",
    quantity: 1,
    rate: "25089",
    price: "",
    assetLocation: "",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 86,
    modelAndDetails: "WHITE BOARD (¾)",
    purchasedFrom: "Sunil stationary",
    billNo: "",
    dateOfPurchase: "23/10/2025",
    quantity: 1,
    rate: "1400",
    price: "1400",
    assetLocation: "Sales class room",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 87,
    modelAndDetails: "Water cooler",
    purchasedFrom: "AMAZONE",
    billNo: "",
    dateOfPurchase: "7/10/2025",
    quantity: 1,
    rate: "38890",
    price: "38890",
    assetLocation: "Student use",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 88,
    modelAndDetails: "RO",
    purchasedFrom: "AMAZONE",
    billNo: "",
    dateOfPurchase: "6/10/2025",
    quantity: 1,
    rate: "10899",
    price: "10899",
    assetLocation: "Student use",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 89,
    modelAndDetails: "Featherlite chair",
    purchasedFrom: "amazone",
    billNo: "",
    dateOfPurchase: "28/10/2025",
    quantity: 1,
    rate: "7099",
    price: "7099",
    assetLocation: "Placement cell",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 90,
    modelAndDetails: "Xp pen tablet pen",
    purchasedFrom: "amazone",
    billNo: "",
    dateOfPurchase: "27/10/2025",
    quantity: 1,
    rate: "2475",
    price: "2475",
    assetLocation: "Harsha mam",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 91,
    modelAndDetails: "Featherlite chair",
    purchasedFrom: "amazone",
    billNo: "",
    dateOfPurchase: "2/11/2025",
    quantity: 4,
    rate: "7028",
    price: "28112",
    assetLocation: "Placement cell",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 92,
    modelAndDetails: "Featherlite chair",
    purchasedFrom: "amazone",
    billNo: "",
    dateOfPurchase: "3/11/2025",
    quantity: 2,
    rate: "7028",
    price: "14056",
    assetLocation: "Palacement cell",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 93,
    modelAndDetails: "Canon colour printer",
    purchasedFrom: "amazone",
    billNo: "",
    dateOfPurchase: "2/11/2025",
    quantity: 1,
    rate: "11299",
    price: "11299",
    assetLocation: "Placement cell",
    usingBy: "",
    remarks: "",
  },
  {
    srNo: 94,
    modelAndDetails: "Hand dryer",
    purchasedFrom: "amazone",
    billNo: "",
    dateOfPurchase: "1/11/2025",
    quantity: 1,
    rate: "2188",
    price: "2188",
    assetLocation: "Placement cell washroom",
    usingBy: "",
    remarks: "",
  },
];
// ---------- CATEGORY FUNCTION ----------
function getCategory(modelAndDetails = "") {
  const text = modelAndDetails.toLowerCase();

  if (
    text.includes("laptop") ||
    text.includes("desktop") ||
    text.includes("computer") ||
    text.includes("pc")
  ) {
    return "laptops/computer";
  }

  if (
    text.includes("printer") ||
    text.includes("office 365") ||
    text.includes("graphic table") ||
    text.includes("digital pen") ||
    text.includes("xp pen") ||
    text.includes("attendance machine") ||
    text.includes("hand dryer") ||
    text.includes("landline")
  ) {
    return "printer and other tools";
  }

  if (
    text.includes("mobile") ||
    text.includes("phone") ||
    text.includes("imei") ||
    text.includes("charger") ||
    text.includes("pen drive")
  ) {
    return "mobile and chargers";
  }

  if (
    text.includes("fan") ||
    text.includes("cooler") ||
    text.includes("water cooler") ||
    text.includes("exhaust")
  ) {
    return "fans & coolers";
  }

  if (text.includes("cctv")) {
    return "cctc camera";
  }

  if (text.includes("chair") && !text.includes("stool")) {
    return "chairs";
  }

  if (
    text.includes("table") ||
    text.includes("desk") ||
    text.includes("stool") ||
    text.includes("work station") ||
    text.includes("drawer")
  ) {
    return "tables & stools";
  }

  if (text.includes("white board") || text.includes("notice board")) {
    return "white board and notice board";
  }

  if (text.includes("ac") || text.includes("air conditioner")) {
    return "AC";
  }

  if (text.includes("camper")) {
    return "Water camper";
  }

  if (text.includes("bottle")) {
    return "water bottle";
  }

  if (text.includes("curtain")) {
    return "curtains";
  }

  if (
    text.includes("speaker") ||
    text.includes("ear phone") ||
    text.includes("earphone") ||
    text.includes("headphone") ||
    text.includes("micro phone") ||
    text.includes("mic ")
  ) {
    return "sound & earphone";
  }

  if (text.includes("router")) {
    return "router";
  }

  return "others";
}

// ---------- CSV HELPERS ----------

// headers for the table (NO "Category" column – matches the Excel image)
const tableHeaders = [
  { key: "srNo", label: "Sr. No." },
  { key: "modelAndDetails", label: "Model and other Details" },
  { key: "purchasedFrom", label: "Purchased from" },
  { key: "billNo", label: "Bill No." },
  { key: "dateOfPurchase", label: "Date of Purchase" },
  { key: "quantity", label: "Quantity" },
  { key: "rate", label: "Rate" },
  { key: "price", label: "Price" },
  { key: "assetLocation", label: "Asset Location" },
  { key: "usingBy", label: "Using By" },
  { key: "remarks", label: "Remarks" },
];

const CATEGORY_ORDER = [
  "laptops/computer",
  "printer and other tools",
  "mobile and chargers",
  "fans & coolers",
  "cctc camera",
  "chairs",
  "tables & stools",
  "white board and notice board",
  "AC",
  "Water camper",
  "water bottle",
  "curtains",
  "sound & earphone",
  "router",
  "others",
];

function escapeCsv(value) {
  if (value === null || value === undefined) return "";
  const s = String(value);
  const escaped = s.replace(/"/g, '""');
  return `"${escaped}"`;
}

function buildHeaderLine() {
  return tableHeaders.map((h) => escapeCsv(h.label)).join(",");
}

// Build CSV like Excel layout:
// IT Jobs Factory
// Fixed Asset Register
//
// LAPTOPS/COMPUTER
//
// [table headers]
// [rows...]
//
// PRINTER AND OTHER TOOLS
// ...
function buildCsvByCategory(rowsWithCategory) {
  const lines = [];

  // Top title lines
  lines.push(escapeCsv("IT Jobs Factory"));
  lines.push(escapeCsv("Fixed Asset Register"));
  lines.push(""); // blank row

  const headerLine = buildHeaderLine();

  for (const cat of CATEGORY_ORDER) {
    const sectionRows = rowsWithCategory.filter((r) => r.category === cat);
    if (!sectionRows.length) continue;

    // Blank line before each section
    lines.push("");

    // Category heading (uppercased, like LAPTOPS/COMPUTER)
    lines.push(escapeCsv(cat.toUpperCase()));

    // Blank line between heading and table
    lines.push("");

    // Table header row
    lines.push(headerLine);

    // Table rows
    for (const row of sectionRows) {
      const line = tableHeaders
        .map((h) => escapeCsv(row[h.key] !== undefined ? row[h.key] : ""))
        .join(",");
      lines.push(line);
    }
  }

  return lines.join("\n");
}

// ---------- ROUTE ----------
app.get("/assets-csv", (req, res) => {
  const rowsWithCategory = assets.map((a) => ({
    ...a,
    category: getCategory(a.modelAndDetails),
  }));

  const csv = buildCsvByCategory(rowsWithCategory);

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="fixed-asset-register.csv"'
  );
  res.send(csv);
});

// ---------- EXPORT (ESM) ----------
export default app;
