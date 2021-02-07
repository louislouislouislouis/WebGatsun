import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Avatar from "../Components/Shared/Avatar";
import Input from "../Components/Shared/Input";
import { VALIDATOR_REQUIRE } from "../util/validators";
import { useForm } from "../Hooks/form-hook";

import "./userMessages.css";
const DUMMY_USER = [
  {
    name: "LOMBARD",
    firstname: "Louis",
    username: "El_torero",
    bio:
      "Salut! Je m'appelle louis et je suis apprenti torrero en argenine. Je vous partage ma passion à travers ce blog",
    post: ["p1", "p2"],
    likes: ["Voitures", "Vie", "Pepsi"],
    conversation: ["c1", "c2"],
    demande: ["d1", "d2"],
    id: "u1",
    email: "test@test.com",
    role: "sudo",
    img:
      "https://www.leparisien.fr/resizer/8myHvElJVa1G1DpaHysQfhZZXzA=/932x582/cloudfront-eu-central-1.images.arcpublishing.com/leparisien/ZPHEFWAHZJXSPZPQNXN4OZJ76U.jpg",
  },
  {
    name: "martin",
    firstname: "Matin",
    username: "Ekip",
    bio:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cumque quis dolore cum placeat earum officiis molestiae praesentium consequatur aliquid suscipit tenetur, asperiores vitae pariatur aspernatur modi nemo ipsum culpa porro!",
    post: ["p3", "p4"],
    likes: ["Chat", "Chien", "Poisson"],
    conversation: ["c1", "c3"],
    demande: ["d9", "d4"],
    id: "u2",
    email: "testddddddddd2@test.com",
    role: "u",
    img:
      "https://pbs.twimg.com/profile_images/966627563228553216/FVNkkIcj_400x400.jpg",
  },
];
const DUMMY_CONV1 = {
  id: "conv1",
  participants: ["u1", "u2"],
  messages: [
    {
      from: "u1",
      date: "2012-04-23T18:25:43.511Z",
      body: "Hey u1, how are u?",
    },
    {
      from: "u2",
      date: "2012-04-23T18:25:44.511Z",
      body: "I am fine",
    },
    {
      from: "u1",
      date: "2012-04-23T18:25:46.511Z",
      body: "give me pizza",
    },
    {
      from: "u2",
      date: "2012-04-23T18:25:47.511Z",
      body:
        "wanna hangout tonight?Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus id laudantium, et in asperiores iste praesentium aspernatur voluptatum. Beatae pariatur assumenda repellat maxime odio corporis ad, delectus tempore deleniti fugiat?",
    },
  ],
};
const UserMessages = () => {
  const userId = useParams().userId;
  const [myconv,setConv]=useState(DUMMY_CONV1)
  //console.log(DUMMY_CONV.messages);
  const [MsgState, inputhandler, setformData] = useForm(
    {
      body :{
        value: "d",
        isValid: false,
      },
    },
    false
  );
  const userUpdateSubmitHandler = (e) => {
    e.preventDefault();
    //console.log(authState.inputs.name.value);
   console.log(myconv)
    
    myconv.messages.push({from:userId,date:new Date(), body:MsgState.inputs.body.value})
    console.log(myconv)
    setConv((myconv)=>(myconv))
  };



  return (
    <div className="User__message__page">
      <div className="user_conv">
        <div className="user_conv_info">
          {myconv.participants.map((part) => {
            return (
              <div key={part} className="participants">
                <Avatar
                  image={DUMMY_USER.find((user) => user.id === part).img}
                  alt={part}
                  width="50px"
                ></Avatar>
              </div>
            );
          })}
        </div>
        <div className="message">
          {myconv.messages.map((index) => {
            return (
              <div
                className={`${userId === index.from ? "my" : "other"}msg`}
                key={index.date + index.from}
              >
                <div
                  className={`${
                    userId === index.from ? "my" : "other"
                  }msg__content`}
                >
                  <p>{index.body}</p>
                </div>
              </div>
            );
          })}
        </div>
        <form
                        className="send"
                        onSubmit={userUpdateSubmitHandler}
                      >
                        <Input
                          id="body"
                          element="input"
                          type="text"
                          validators={[VALIDATOR_REQUIRE()]}
                          onInput={inputhandler}
                          initialvalue=""
                        />
                        <button type="submit"  disabled={!MsgState.isValid}>
                          Envoyer
                        </button>
                      </form>
      </div>
    </div>
  );
};

export default UserMessages;
