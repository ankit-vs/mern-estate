import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase';
import { createNextState } from '@reduxjs/toolkit';
import { updateUserStart, updateUserSuccess, upadeUserFailure } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

export default function Profile() {
  const {currentUser, loading, error} = useSelector(state => state.user);
  const fileRef = useRef(null);
  const [file, setFile]= useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSucess , setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  // firebase storage rule
  // allow read;
  //     allow write: if 
  //     request.resource.size < 2 *1024 *1024 &&
  //     request.resource.contentType.matches('image/.*');
  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime()+file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
  uploadTask.on('state_changed',
  (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) *100;
    setFilePerc(Math.round(progress));
  },
  (error) => {
    setFileUploadError(true);
  },
  ()=>{
    getDownloadURL(uploadTask.snapshot.ref).then
    ((downloadURL)=>{
      setFormData({...formData, avatar:downloadURL});
    });
    }
  );
  };
const handleChange = (e) => {
  setFormData({...formData, [e.target.id]: e.target.value});
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try{
    dispatch(updateUserStart());
    const res = await fetch(`/api/user/update/${currentUser._id}`, {
    method:'POST',
    headers:{
      'Content-Type':'application/json',
    },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (data.success === false){
    console.log("error occured");
    dispatch(upadeUserFailure(data.message));
    return;
  };

  dispatch(updateUserSuccess(data));
  setUpdateSuccess(true);
  }catch(error){
    
    dispatch(upadeUserFailure(error.message));
  };
};
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7 '>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e)=> setFile(e.target.files[0])}
        type='file' ref={fileRef} hidden accept='image/*'></input>
        <img onClick={()=>fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt='Profile' 
        className='rounded-full h-24 w-24 object-cover 
        cursor-pointer self-center mt-2' />
        <p className='text-sm self-center'>
          { fileUploadError ? (<span className='text-red-500'>Error Image Upload
          </span>) : 
          filePerc > 0 && filePerc < 100 ? (<span className='text-slate-700 '>
            {`Uploading ${filePerc}%`}
          </span>) :
          filePerc === 100 ? 
          (<span className='text-green-700'>Image successfully uploaded</span>) : ""
          }
        </p>
        <input onChange={handleChange} defaultValue={currentUser.username} type='text' placeholder='username' id='username' className='border p-3 rounded-lg'/>
        <input onChange={handleChange} defaultValue={currentUser.email} type='text' placeholder='email' id='email' className='border p-3 rounded-lg'/>
        <input type='text' placeholder='password' id='password' className='border p-3 rounded-lg'/>
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
        {loading?'LOADING..':'update'}</button>

      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
      <p className='text-red-500 mt-5'>{error ? error : ""}</p>
      <p className='text-green-500 mt-5'>{updateSucess ?
       "User is updated successfully!" : ""}</p>
    </div>
  )
}
