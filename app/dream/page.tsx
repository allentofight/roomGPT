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
import { useEffect } from 'react';

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
    "unsupportedFileType": "图片类型应为jpeg/png/jpg",
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

export default function DreamPage() {
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  const [picCredits, setPicCredits] = useState<number>(10);

  useEffect(() => {
    const storedValue = localStorage.getItem('picCredits');
    if (storedValue) {
      setPicCredits(Number(storedValue));
    }
  }, []);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [restoredLoaded, setRestoredLoaded] = useState<boolean>(false);
  const [sideBySide, setSideBySide] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [theme, setTheme] = useState<themeType>("现代");
  const [room, setRoom] = useState<roomType>("客厅");


  const [items, setItems] = useState([
    { label: '现代', imgSrc: '/someimg-modern.webp', restoreImageSrc: '', checked: false },
    { label: '简约', imgSrc: '/someimg-minimalist.webp', restoreImageSrc: '', checked: false },
    { label: '专业', imgSrc: '/someimg-professional.webp', restoreImageSrc: '', checked: true },
    { label: '热带', imgSrc: '/someimg-tropical.webp', restoreImageSrc: '', checked: false },
    { label: '海岸', imgSrc: '/someimg-coastal.webp', restoreImageSrc: '', checked: false },
    { label: '复古', imgSrc: '/someimg-vintage.webp', restoreImageSrc: '', checked: false },
    { label: '工业', imgSrc: '/someimg-industrial.webp', restoreImageSrc: '', checked: false },
    { label: '新古典', imgSrc: '/someimg-neoclassic.webp', restoreImageSrc: '', checked: false },
    { label: '部落', imgSrc: '/someimg-tribal.webp', restoreImageSrc: '', checked: false },
  ]);

  const UploadDropZone = () => (
    <UploadDropzone
      uploader={uploader}
      options={options}
      onUpdate={(file) => {
        if (file.length !== 0) {
          setPhotoName(file[0].originalFile.originalFileName);
          setOriginalPhoto(file[0].fileUrl.replace("raw", "thumbnail"));
        }
      }}
      width="670px"
      height="250px"
    />
  );

  async function generatePhoto(fileUrl: string, label: themeType) {

    const themStyles = {
      "现代": "Modern",
      "复古": "Vintage",
      "简约": "Minimalist",
      "专业": "Professional",
      "热带": "Tropical",
      "海岸": "Coastal",
      "工业": "Industrial",
      "新古典": "Neoclassic",
      "部落": "Tribal"
    };

    const roomTypes = {
      "客厅": "Living Room",
      "餐厅": "Dining Room",
      "卧室": "Bedroom",
      "浴室": "Bathroom",
      "办公室": "Office",
      "游戏室": "Gaming Room"
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setLoading(true);
      const res = await fetch("/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: fileUrl, theme: themStyles[label], room: roomTypes[room] }),
      })

      let newPhoto = await res.json();
      if (res.status !== 200) {
        setError(newPhoto);
      } else {
        setItems(prevItems => {
          return prevItems.map((item, i) =>
            item.label === label ? { ...item, restoreImageSrc: newPhoto[1] } : item
          );
        });
      }
      setTimeout(() => {
        setLoading(false);
      }, 1300);
    } catch (error: unknown) {
      setPicCredits(prevPicCredits => {
        const newPicCredits = prevPicCredits + checkedItems.length;
        localStorage.setItem('picCredits', newPicCredits.toString());
        return newPicCredits;
      });
      setLoading(false);
      console.log('error = ', error)
    }
  }

  const checkedCount = items.filter(item => item.checked).length;

  const restoreImageCnt = items.filter(item => item.restoreImageSrc.length > 0).length;

  const checkedItems = items.filter(item => item.checked);

  const gridClasses = checkedCount === 1 ? 'lg:grid-cols-1' : 'lg:grid-cols-2';
  const maxSelectionReached = checkedCount >= 2;

  const handleClick = (index: number) => {
    if (items[index].checked || !maxSelectionReached) {
      setItems(prevItems => {
        return prevItems.map((item, i) =>
          i === index ? { ...item, checked: !item.checked } : item
        );
      });
    }
  };

  const handleDownload = () => {
    for (let index = 0; index < checkedItems.length; index++) {
      const item = checkedItems[index];
      downloadPhoto(item.restoreImageSrc, item.label + '-' + room)
    }
  }

  const reset = () => {
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      setItems(prevItems => {
        return prevItems.map(item => {
          return { ...item, restoreImageSrc: '' }
        });
      });
    }
  }

  const customStyles = {
    content: {
      color: 'black',
      backgroundColor: 'white',
      width: '50%', // Set the width to 50%
      height: '55%', // Set the height to 50%
      margin: 'auto', // Center the modal
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // 设置背景颜色
    },
  };

  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />
      <main className="flex flex-1 w-full justify-center text-center px-4 mt-4 sm:mb-0 mb-8 sm:space-x-8 space-x-0 sm:flex-row flex-col">
        <div className="sm:w-[440px] w-full flex flex-col gap-3 py-4 p-3">
          {
            picCredits == 0 &&
            <div className="font-bold text-lg border rounded-lg p-3 mb-3">您的次数已耗尽。 <a className="text-blue-500" href="/buy-credits">点此购买</a> 获取更多生成次数</div>
          }
          <div className="font-bold">
            上传一张你房间的图片
          </div>

          {!originalPhoto && <UploadDropZone />}
          {originalPhoto && (
            <div className="bg-neutral-800 p-3 rounded-xl">
              <div className="flex justify-between mb-2 mx-2">
                <div className="text-sm text-gray-400">原图</div>
                <button onClick={() => setOriginalPhoto('')}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash text-[#9ca3af] hover:text-white transition"><path d="M3 6L5 6 21 6"></path><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                  </svg>
                </button>
              </div>
              <div className="flex justify-center items-center">
                <Image
                  loading="lazy"
                  decoding="async"
                  data-nimg="1"
                  alt="original photo"
                  src={originalPhoto}
                  className="rounded-lg"
                  width={350}
                  height={350}
                  style={{ color: 'transparent' }}
                />
              </div>
            </div>
          )}
          <div className="font-bold">
            选择房间类型
          </div>
          <DropDown
            theme={room}
            setTheme={(newRoom) =>
              setRoom(newRoom as typeof room)
            }
            themes={rooms}
          />
          <div className="font-bold mt-4 mb-2">
            选择房间主题 (最多可以选2个)
          </div>
          <div className="grid grid-cols-3 grid-rows-3 gap-2 mb-6">
            {items.map((item, index) => (
              <div
                className="flex flex-col space-y-2 items-center"
                key={index}
              >
                <button
                  style={{
                    cursor: item.checked || !maxSelectionReached ? 'pointer' : 'not-allowed',
                  }}
                  onClick={() => !maxSelectionReached || item.checked ? handleClick(index) : null}
                >
                  <div className="relative">
                    {item.checked && (
                      <div className="absolute bg-black rounded-md right-1 top-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check">
                          <path d="M20 6L9 17 4 12"></path>
                        </svg>
                      </div>
                    )}
                    <Image alt="" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" className={`w-24 h-24 rounded-md ${item.checked ? 'border-2 border-white -p-2' : ''}`} src={item.imgSrc} style={{ color: 'transparent' }} />

                  </div>
                </button>
                <div className="text-sm pb-2">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
          <div className="justify-center flex items-center space-x-5">
            {!loading &&
              <>
                <button
                  type="button"
                  style={{
                    cursor: originalPhoto && checkedCount > 0 ? 'pointer' : 'not-allowed',
                  }}
                  className="inline-flex items-center gap-x-1.5 rounded-md bg-blue-600 px-3 py-3 font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 justify-between disabled:cursor-not-allowed false"
                  onClick={() => {

                    if (picCredits <= 0) {
                      setModalIsOpen(true)
                      return
                    }

                    if (picCredits < checkedItems.length) {
                      setModalIsOpen(true)
                      return
                    }

                    const { isLogin } = loginUtil()
                    if (!isLogin()) {
                      window.location.href = '/login'
                      return
                    }

                    if (!originalPhoto) {
                      alert('请先上传图片')
                      return
                    }

                    for (let index = 0; index < checkedItems.length; index++) {
                      const item = checkedItems[index];
                      generatePhoto(originalPhoto, item.label as themeType)
                    }

                    setPicCredits(prevPicCredits => {
                      const newPicCredits = prevPicCredits - checkedItems.length;
                      localStorage.setItem('picCredits', newPicCredits.toString());
                      return newPicCredits;
                    });

                  }}><span>开始设计</span></button>
                <span className="px-2 rounded-md" aria-hidden="true">剩余 <span className="font-bold">{picCredits}</span></span>
              </>
            }

            {loading &&
              <button
                type="button"
                className="inline-flex items-center gap-x-1.5 rounded-md bg-blue-600 px-3 py-2 font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-blue-600 justify-center cursor-not-allowed"
                disabled={true}
              >
                <span
                  className="bg-blue-900 px-2 rounded-md text-sm "
                  aria-hidden="true"
                >
                  正在生成
                </span>
                <span>
                  <LoadingDots color="white" style="large" />
                </span>
              </button>
            }
          </div>
        </div>
        <div className="w-[-webkit-fill-available] px-3 md:mt-8 mt-0">
          <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-normal text-slate-100 sm:text-5xl mb-5 hidden lg:block">几秒钟内重新设计你的 <span className="text-blue-600">房间</span></h1>
          <p className="text-gray-400 hidden lg:block">开始上传照片，指定房间类型，选择房间主题，然后提交。
          </p>
          <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-normal text-slate-100 sm:text-6xl mb-3 sm:hidden visible mt-4" id="rendered-designs">Rendered designs</h1>
          <div className={`sm:p-8 p-0 pr-0 grid grid-cols-1 gap-10 sm:mt-0 mt-10 place-items-center ${gridClasses}`}>
            {items.map((item, index) => {
              return item.checked &&
                <>
                  {
                    !item.restoreImageSrc.length &&
                    <div className="w-full" key={index}>
                      <div className="bg-gray-600 max-w-[402px] h-[312px] rounded-lg flex justify-center items-center mx-auto">
                        {!loading &&
                          <Image alt="logo" loading="lazy" width="50" height="50" decoding="async" data-nimg="1" src="/couch.svg" style={{ color: 'transparent' }} />
                        }

                        {loading &&
                          <RingLoaindg />
                        }
                      </div>

                      <p className="text-gray-400 mt-1">{item.label}</p>
                    </div>
                  }
                  {
                    item.restoreImageSrc.length > 0 &&
                    <div>
                      <div className="rounded-lg flex justify-center items-center">
                        <Image
                          alt=""
                          className="rounded-lg"
                          loading="lazy"
                          decoding="async"
                          data-nimg="1"
                          src={item.restoreImageSrc}
                          width={500}
                          height={400}
                          fill={false} // 如果你在使用 Next.js，你可以添加这个属性
                          style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                        />
                      </div>
                      <p className="text-gray-400 mt-1">{item.label}</p>
                    </div>
                  }

                </>
            })}

          </div>
          {
            restoreImageCnt > 0 &&
            <div className="flex space-x-2 justify-center">
              <button className="bg-blue-500 rounded-full text-white font-medium px-4 py-2 hover:bg-blue-500/80 transition" onClick={() => reset()}>重置</button>
              <button className="bg-white rounded-full text-black border font-medium px-4 py-2 hover:bg-gray-300 transition duration-300 ease-in-out" onClick={() => handleDownload()}>下载图片</button>
            </div>
          }
        </div>
        <div style={{ position: 'fixed', zIndex: 9999, inset: '16px', pointerEvents: 'none' }}>
        </div>
      </main >
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <CloseIcon
            onClick={() => setModalIsOpen(false)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              cursor: 'pointer'
            }} // 将关闭图标定位到模态对话框的右上角
          />
          <h2>请联系商务咨询购买次数，能享受更多折扣哦</h2>
          <Image alt="logo" loading="lazy" width="350" height="474" decoding="async" data-nimg="1"
            src="/business.png"
            style={{ width: "auto", height: "auto" }}
            fill={false} // 如果你在使用 Next.js，你可以添加这个属性
          />
        </div>
      </Modal>
    </div >
  );
}
