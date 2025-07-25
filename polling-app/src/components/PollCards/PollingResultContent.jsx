// File: src/components/PollCards/PollingResultContent.jsx

import React from "react";
import moment from "moment";
import CharAvatar from "../cards/CharAvatar";

const PollOptionVoteResult = ({ label, optionVotes, totalVotes }) => {
  const progress = totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;

  return (
    <div className="w-full bg-slate-200/80 rounded-md h-6 relative mb-3">
      <div
        className="bg-sky-900/10 h-6 rounded-md"
        style={{ width: `${progress}%` }}
      ></div>
      <span className="absolute inset-0 flex items-center justify-between text-gray-800 text-[12px] font-medium mx-4">
        {label} <span className="text-[11px] text-slate-500">{progress}%</span>
      </span>
    </div>
  );
};

const ImagePollResult = ({ imgUrl, optionVotes, totalVotes }) => {
  return (
    <div>
      <div className="w-full bg-gray-800 flex items-center gap-2 mb-4 rounded-md overflow-hidden">
        <img src={imgUrl} alt="Poll option" className="w-full h-36 object-contain" />
      </div>
      <PollOptionVoteResult optionVotes={optionVotes} totalVotes={totalVotes} />
    </div>
  );
};

const OpenEndedPollResponse = ({ profileImgUrl, userFullName, response, createdAt }) => {
  return (
    <div className="mb-8 ml-3">
      <div className="flex gap-3">
        {profileImgUrl ? (
          <img src={profileImgUrl} alt="avatar" className="w-8 h-8 rounded-full" />
        ) : (
          <CharAvatar
            fullName={userFullName}
            style="w-8 h-8 text-[10px] bg-sky-800/40"
          />
        )}
        <p className="text-[13px] text-black">
          {userFullName}
          <span className="text-[10px] text-slate-500 ml-1">
            {createdAt ? moment(createdAt).fromNow() : ""}
          </span>
        </p>
      </div>
      <p className="text-xs text-slate-700 -mt-2 ml-[44px]">{response}</p>
    </div>
  );
};

const PollingResultContent = ({ type, options = [], voters = 0, responses = [] }) => {
  switch (type) {
    case "single-choice":
    case "yes/no":
    case "rating":
      return (
        <>
          {options.map((option) => (
            <PollOptionVoteResult
              key={option._id}
              label={`${option.optionText}${type === "rating" ? " Star" : ""}`}
              optionVotes={option.votes}
              totalVotes={voters}
            />
          ))}
        </>
      );

    case "image-based":
      return (
        <div className="grid grid-cols-2 gap-4">
          {options.map((option) => (
            <ImagePollResult
              key={option._id}
              imgUrl={option.optionText}
              optionVotes={option.votes}
              totalVotes={voters}
            />
          ))}
        </div>
      );

    case "open-ended":
      return (
        <>
          {responses.map((response) => (
            <OpenEndedPollResponse
              key={response._id}
              profileImgUrl={response.voterId?.profileImageUrl}
              userFullName={response.voterId?.fullName || "Mike Johnson"}
              response={response.responseText || ""}
              createdAt={response.createdAt}
            />
          ))}
        </>
      );

    default:
      return null;
  }
};

export default PollingResultContent;
