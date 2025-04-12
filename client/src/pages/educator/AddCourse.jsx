import React, { useEffect, useRef, useState } from 'react'
import uniqid from 'uniqid'
import quill from 'quill'
import { assets } from '../../assets/assets'

const AddCourse = () => {


  const quillRef = useRef(null)
  const editorRef = useRef(null)

  const [courseTitle, setCourseTitle] = useState('')
  const [coursePrice, setCoursePrice] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [image, setImage] = useState(null)
  const [chapters, setChapters] = useState([])
  const [shoWPopup, setShoWPopup] =  useState(false)
  const [currentChapterId, setCurrentChapterId] = useState(null)
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle : '',
    lectureDuration : '',
    lectureUrl : '',
    isPreviewFree : false,
  })

  const handleChapter = (action, chapterId) => {
    if(action === 'add') {
      const title =  prompt('Enter chapter Name:')
      if(title) {
        const newChapter ={
          chapterId : uniqid(),
          chapterTitle : title,
          chapterContent : [],
          collapsed :false,
          chapterOrder : chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        }
        setChapters([...chapters, newChapter])
      }
    }
    else if (action === 'remove') {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId))
    }
    else if (action === 'toggle') {
      setChapters(
        chapters.map((chapter) =>
        chapter.chapterId === chapterId ? {...chapter, collapsed : !chapter.collapsed} :chapter)
      )
    }
  }

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId)
      setShoWPopup(true)
    }
    else if (action === 'remove') {
      setChapters(
        chapters.map((chapter) => {
          if(chapter.chapterId === chapterId) {
            chapter.chapterContent.splice(lectureIndex, 1)
          }
          return chapter
        })
      )
    }
  }

  const addLecture = () => {
    setChapters(
      chapters.map((chapter) => {
        if(chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureOrder : chapter.chapterContent.length > 0 ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1: 1,
            lectureId : uniqid()
          }
          chapter.chapterContent.push(newLecture)
        }
        return chapter
      })
    )
    setShoWPopup(false)
    setLectureDetails({
      lectureTitle : '',
      lectureDuration : '',
      lectureUrl : '',
      isPreviewFree : false,

    })
  }

  const handleSubmit = async (e) => {
   e.preventDefault() 
  }


  useEffect(() => {
    // initiate quill only once
    if(!quillRef.current && editorRef.current) {
      quillRef.current = new quill(editorRef.current, {
        theme :  'snow',
      })
    }
  }, [])

  return (
    <div className='h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0'>
      <form className='flex flex-col  gap-4 max-w-md w-full text-gray-500' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-1'>
          <p>Course Title</p>
          <input className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500' onChange={e => setCourseTitle(e.target.value)} value={courseTitle} type="text" placeholder='Type here' required />
        </div>
        <div className='flex flex-col gap-1'>
          <p>Course Description</p>
          <div ref={editorRef}></div>
        </div>
        <div className='flex items-center justify-between flex-wrap'>
          <div className='flex flex-col gap-1'>
            <p>Course Price</p>
            <input className='outline-none md:py-2.5 py-2 px-3 w-28 rounded border border-gray-500' onChange={e => setCoursePrice(e.target.value)} value={coursePrice} type="number" placeholder='0' required />
          </div>
          <div className='flex md:flex-row flex-col items-center gap-3'>
            <p>Course Thumbnail</p>
            <label className='flex items-center gap-3' htmlFor="thumbnailImage">
              <img className='p-3 bg-blue-500 rounded' src={assets.file_upload_icon} alt="" />
              <input type="file" id='thumbnailImage' onChange={e => setImage(e.target.files[0])} accept='image/*' hidden/>
              <img className='max-h-10' src={image ? URL.createObjectURL(image) : ''} alt="" />
            </label>
          </div>
        </div>
        <div className='flex flex-col gap-1'>
          <p>Discount %</p>
          <input className='outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500' onChange={e => setDiscount(e.target.value)} value={discount} type="number" placeholder='0' min={0} max={100} required/>
        </div>
        {/* adding chpaters and lectures */}
        <div>
          {chapters.map((chapter, chapterIndex) => (
            <div className='bg-white border rounded-lg mb-4' key={chapterIndex}>
              <div className=' flex justify-between items-center p-4 border-b'>
                <div className='flex items-center'>
                  <img className={`mr-2 cursor-pointer transition-all ${chapter.collapsed && "-rotate-90" }`} onClick={() => handleChapter('toggle', chapter.chapterId)} src={assets.dropdown_icon} alt="" width={14} />
                  <span className='font-semibold'>{chapterIndex + 1} {chapter.chapterTitle}</span>
                </div>
                <span className='text-gray-500'>{chapter.chapterContent.length} Lectures</span>
                <img onClick={() => handleChapter('remove', chapter.chapterId)} className='cursor-pointer' src={assets.cross_icon} alt="" /  >
              </div>
              {!chapter.collapsed && (
                <div className='p-4'>
                  {chapter.chapterContent.map((lecture, lectureIndex) => (
                    <div className='flex justify-between items-center mb-2' key={lectureIndex}>
                      <span>{lectureIndex + 1} {lecture.lectureTitle} - {lecture.lectureDuration} mins - <a className='text-blue-500' href={lecture.lectureUrl} target='_blank'>Link</a> - {lecture.isPreviewFree ? 'Free Preview' : 'paid'}</span>
                      <img className='cursor-pointer' onClick={() => handleLecture('remove', chapter.chapterId, lectureIndex)} src={assets.cross_icon} alt="" />
                    </div>
                  ))}
                  <div className='inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2' onClick={() => handleLecture('add', chapter.chapterId)}>+ Add Lecture</div>
                </div>
              )}
            </div>
          ))}
          <div className='flex justify-center items-center bg-blue-100 p-2 rounded-lg cursor-pointer' onClick={() => handleChapter('add')}> + Add Chapter</div>
          {shoWPopup && (
            <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50'>
              <div className='bg-white text-gray-700 p-4 rounded relative w-full max-w-80'>
                <h2 className='text-lg font-semibold mb-4'>Add Lecture</h2>
                <div className='mb-2'>
                  <p>Lecture Title</p>
                  <input className='mt-1 block w-full border rounded py-1 px-2' value={lectureDetails.lectureTitle} onChange={(e) => setLectureDetails({...lectureDetails, lectureTitle : e.target.value})} type="text" />
                </div>
                <div className='mb-2'>
                  <p>Duartion (minutes)</p>
                  <input className='mt-1 block w-full border rounded py-1 px-2' value={lectureDetails.lectureDuration} onChange={(e) => setLectureDetails({...lectureDetails, lectureDuration : e.target.value})} type="number" />
                </div>
                <div className='mb-2'>
                  <p>Lecture URL</p>
                  <input className='mt-1 block w-full border rounded py-1 px-2' value={lectureDetails.lectureUrl} onChange={(e) => setLectureDetails({...lectureDetails, lectureUrl : e.target.value})} type="text" />
                </div>
                <div className='flex gap-2 my-2'>
                  <p>Is preview Free?</p>
                  <input className='mt-1 scale-125' checked={lectureDetails.isPreviewFree} onChange={(e) => setLectureDetails({...lectureDetails, isPreviewFree : e.target.checked})} type="checkbox" />
                </div>
                <button className='w-full bg-blue-400 text-white px-4 py-2 rounded' onClick={addLecture} type='button'>Add</button>
                <img className='absolute top-4 right-4 w-4 cursor-pointer' onClick={() => setShoWPopup(false)} src={assets.cross_icon} alt="" />
              </div>
            </div>
          )
          }
        </div>
        <button className='bg-black text-white w-max py-2.5 px-8 rounded my-4' type='submit'>ADD</button>
      </form>
    </div>
  )
}

export default AddCourse
