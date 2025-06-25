import React, { useState, useContext } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import useUserAuth from "../../hooks/useUserAuth";
import { UserContext } from "../../context/UserContext";
import { POLL_TYPE } from "../../utils/data";
import OptionInput from "../../components/input/OptionInput";
import OptionImageSelector from "../../components/input/OptionImageSelector";
import toast  from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import uploadImage from "../../utils/uploadImage";

const CreatePoll = () => {
  useUserAuth();
  // eslint-disable-next-line no-unused-vars
  const { user, onPollCreateOrDelete } = useContext(UserContext);

  const [pollData, setPollData] = useState({
    question: "",
    type: "",
    options: [],
    imageOptions: [],
    error: "",
  });

  const handleValueChange = (key, value) => {
    setPollData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  //Clear Data
  const clearData = () => {
    setPollData({
      question: "",
      type: "",
      options: [],
      imageOptions: [],

      error: "",
    });
  };

  //Upload Images and Get Image Urls
  const updateImageAndGetLink = async (imageOptions) => {
    const optionPromises = imageOptions.map(async (imageOption) => {
      
            try{
              const imgUploadRes = await uploadImage(imageOption.file);
              return imgUploadRes.imageUrl || "";

            }catch (error) {
                 const errMsg = error instanceof Error ? error.message : "Unknown error";
                     toast.error(`Error uploading image: ${imageOption.file.name}. ${errMsg}`);
               return "";
                }
          });
        const imageUrls = await Promise.all(optionPromises);
           return imageUrls;
        };
 
   
  const getOptions = async () => {
    switch (pollData.type){
      case "single-choice":
        return pollData.options;

        case "image-based":
          { 
            const options = await updateImageAndGetLink(pollData.imageOptions)
          return options; }

          default: 
          return [];
    }
  };

  //create a new poll
  const handleCreatePoll = async () => {
    const { question, type, options, imageOptions } = pollData;

    if (!question || !type) {
      handleValueChange("error", "Please enter a question and select a poll type.");
      return;
    }

    if (type === "single-choice" && options.length < 2) {
      handleValueChange("error", "Enter at least two options.");
      return;
    }

    if (type === "image-based" && imageOptions.length < 2) {
      handleValueChange("error", "Enter at least two image options.");
      return;
    }

    handleValueChange("error", ""); // clear any previous error
    console.log("NO_ERR", { pollData });

    const optionData = await getOptions();

    try{
      const response = await axiosInstance.post(API_PATHS.POLLS.CREATE,{
        question,
        type,
        options: optionData,
        creatorId: user._id,
      });

      if ( response ){
        toast.success("Poll Created Successfully!!");
        onPollCreateOrDelete();
        clearData();
      }
    } catch (error){
            if(error.response && error.response.data.message){
              toast.error(error.response.data.message);
              handleValueChange("error", error.response.data.message);
            }else{
             handleValueChange("error", "Something went wrong. Please try again.");
            }
    }

  };

  return (
    <DashboardLayout activeMenu="Create Poll">
      <div className="bg-gray-100/80 my-5 p-5 rounded-lg mx-auto">
        <h2 className="text-lg text-black font-medium">Create Poll</h2>

        <div className="mt-3">
          <label className="text-xs font-medium text-slate-600">QUESTION</label>
          <textarea
            placeholder="What's on your mind?"
            className="w-full p-3 text-sm text-gray-800 bg-slate-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none shadow-sm transition duration-200"
            rows={4}
            value={pollData.question}
            onChange={({ target }) => handleValueChange("question", target.value)}
          />
        </div>

        <div className="mt-3">
          <label className="text-xs font-medium text-slate-600">POLL TYPE</label>
          <div className="flex gap-4 flex-wrap mt-3">
            {POLL_TYPE.map((item) => (
              <div
                key={item.value}
                className={`text-xs font-medium px-4 py-1 rounded-lg border cursor-pointer transition ${
                  pollData.type === item.value
                    ? "text-white bg-[#00bfa6] border-[#00bfa6]"
                    : "text-sky-700 bg-sky-100 border-sky-100 hover:border-[#00bfa6]"
                }`}
                onClick={() => handleValueChange("type", item.value)}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {pollData.type === "single-choice" && (
          <div className="mt-5">
            <label className="text-xs font-medium text-slate-600">OPTIONS</label>
            <div className="mt-3">
              <OptionInput
                optionList={pollData.options}
                setOptionList={(value) => handleValueChange("options", value)}
              />
            </div>
          </div>
        )}

        {pollData.type === "image-based" && (
          <div className="mt-5">
            <label className="text-xs font-medium text-slate-600">IMAGE OPTIONS</label>
            <div className="mt-3">
              <OptionImageSelector
                imageList={pollData.imageOptions}
                setImageList={(value) => handleValueChange("imageOptions", value)}
              />
            </div>
          </div>
        )}

        {pollData.error && (
          <p className="text-xs font-medium text-red-500 mt-5">{pollData.error}</p>
        )}

        <button
          className="bg-[#00bfa6] text-white px-4 py-2 rounded-xl mt-6 hover:bg-[#00a896] transition"
          onClick={handleCreatePoll}
        >
          CREATE
        </button>
      </div>
    </DashboardLayout>
  )
};

export default CreatePoll;
