"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { UploadDropzone } from "react-uploader";
import { Uploader } from "uploader";
import Header from "../../components/Header";
import LoadingDots from "../../components/LoadingDots";
import RingLoaindg from "../../components/RingLoaindg";
import CloseIcon from '../../components/CloseIcon'; // 请将这个路径替换为你的 SVG 组件的路径
import ResizablePanel from "../../components/ResizablePanel";
import Toggle from "../../components/Toggle";
import appendNewToName from "../../utils/appendNewToName";
import downloadPhoto from "../../utils/downloadPhoto";
import DropDown from "../../components/DropDown";
import { roomType, rooms, themeType, themes } from "../../utils/dropdownTypes";
import { loginUtil } from "../../utils/loginUtil";
import Modal from 'react-modal';
import Link from "next/link";



// Configuration for the uploader
const uploader = Uploader({
    apiKey: !!process.env.NEXT_PUBLIC_UPLOAD_API_KEY
        ? process.env.NEXT_PUBLIC_UPLOAD_API_KEY
        : "free",
});

const options = {
    maxFileCount: 1,
    mimeTypes: ["image/jpeg", "image/png", "image/jpg"],
    editor: { images: { crop: false } },
    locale: {
        "error!": "出错啦!",
        "done": "完成",
        "addAnotherFile": "Add another file...",
        "addAnotherImage": "Add another image...",
        "cancel": "cancel",
        "cancelled!": "cancelled",
        "continue": "Continue",
        "customValidationFailed": "Failed to validate file.",
        "crop": "Crop",
        "finish": "Finished",
        "finishIcon": true,
        "image": "Image",
        "maxFilesReached": "Maximum number of files:",
        "maxImagesReached": "Maximum number of images:",
        "maxSize": "File size limit:",
        "next": "Next",
        "of": "of",
        "orDragDropFile": "...or drag and drop a file.",
        "orDragDropFiles": "...or drag and drop files.",
        "orDragDropImage": "或拖拽图片",
        "orDragDropImages": "...or drag and drop images.",
        "pleaseWait": "Please wait...",
        "removed!": "removed",
        "remove": "remove",
        "skip": "Skip",
        "unsupportedFileType": "File type not supported.",
        "uploadFile": "Upload a File",
        "uploadFiles": "Upload a File",
        "uploadImage": "点击上传图片",
        "uploadImages": "Upload an Image",

        "validatingFile": "Validating file..."
    },
    styles: {
        colors: {
            primary: "#2563EB", // Primary buttons & links
            error: "#d23f4d", // Error messages
            shade100: "#fff", // Standard text
            shade200: "#fffe", // Secondary button text
            shade300: "#fffd", // Secondary button text (hover)
            shade400: "#fffc", // Welcome text
            shade500: "#fff9", // Modal close button
            shade600: "#fff7", // Border
            shade700: "#fff2", // Progress indicator background
            shade800: "#fff1", // File item background
            shade900: "#ffff", // Various (draggable crop buttons, etc.)
        },
    },
};

export default function CreditPage() {
    return (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: "center", height: "100vh" }}>
            <h2 className="mb-2">请联系商务咨询购买次数，能享受更多折扣哦</h2>
            <Image alt="logo" loading="lazy" width="350" height="474" decoding="async" data-nimg="1"
                src="/business.png"
                style={{ width: "auto", height: "auto" }}
                fill={false} // 如果你在使用 Next.js，你可以添加这个属性
            />
            <Link
                className="bg-blue-600 rounded-xl text-white font-medium px-4 py-3 sm:mt-10 mt-8 hover:bg-blue-500 transition"
                href="/dream"
            >
                返回
            </Link>
        </div>
    );
}
