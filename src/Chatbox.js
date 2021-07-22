import React, { useEffect, useState, useRef } from "react";
import Avatar from "@material-ui/core/Avatar";
import "./Chatbox.css";
import CreateIcon from "@material-ui/icons/Create";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { Button } from "@material-ui/core";
import { useParams } from "react-router-dom";
import db from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import firebase from "firebase";
import { logout, selectEmail, selectUser } from "./features/user/userSlice";
import SendIcon from '@material-ui/icons/Send';
import SendOutlinedIcon from '@material-ui/icons/SendOutlined';

function Chatbox() {
      const [message, setmessage] = useState("");
      const [roomName, setroomName] = useState([]);
      const [messages_from_store, setmessages_from_store] = useState([]);
      // in back days getting a link of other compoet was a headchae ,
      // but with this we can easliy get a link; the link this is graps
      // is same as the roomId we declared it in App.js at route path of
      // line 28 inside which <sidebar>  and <chatbox>  is defined

      // here this roomId is same as id in firebase......
      // in App.js it gets roomId from as a Link which in sidebarchat.js
      //  is given as id value
      // you can also print it as a console value and check it

      const userEmail = useSelector(selectEmail);
      console.log("user is,", userEmail);

      const { id } = useParams();
      useEffect(() => {
            if (id) {
                  db.collection("rooms")
                        .doc(id)
                        .onSnapshot((snapshot) => setroomName(snapshot.data()?.personName));
            }
      }, [id]);

      useEffect(() => {
            // if (id) {
            db.collection("rooms").doc(userEmail).collection("messages").doc(id)
                  .get((snapshot) => setmessages_from_store(snapshot.docs.map((doc) => doc.data())))



            // scroll to bottom



            // }
      }, [id]); //the id param here is very
      //important. it must be bear in mind
      // that with the change in id only we want
      //to know that we have chanfed to a different
      // person and now we want to know messaged of
      //different id that is different person

      const sendMessage = (event) => {
            event.preventDefault();
            if (message !== "") {
                  db.collection("rooms").doc(userEmail).collection("messages").doc(id).set({
                        message: message,
                        name: userEmail,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                  });
                  setmessage("");
            }
      };

      const dispatch = useDispatch();

      const log_out = (e) => {
            e.preventDefault();
            console.log("cliecked_logout");
            dispatch(logout());
            console.log("cliecked_logout_after_dispatch");
      };

      useEffect(() => {
            var div = document.querySelector("#scrollDiv")
            div.scrollTop = div?.scrollHeight - div?.clientHeight

      }, [messages_from_store])

      return (
            <div className="chatbox">
                  <div className="chatbox_header">
                        <div className="chatbox_header_avatar">
                              <Avatar />

                        </div>

                        <div className="chatbox_header_details">
                              <h3>{roomName}</h3>
                              <p>Last Seen At...</p>
                        </div>
                        <div className="exit_icon" onClick={log_out}>
                              <div className="exit_icon_icon">
                                    <ExitToAppIcon onClick={log_out} />
                              </div>
                              <p>LogOut</p>
                        </div>
                  </div>

                  <div id="scrollDiv" className="message_scroll">
                        {messages_from_store.map((a_message) => (
                              <div id="" className="chatbox_body">
                                    <p
                                          className={`chatbox_message_sender ${userEmail === a_message.name && `chatbox_message_receiver`
                                                }`}
                                    >
                                          {" "}
                                          <br />
                                          <p className="span_name">{a_message.name}</p>
                                          {a_message.message}
                                          {/* <span className="span_time">
                                                {new Date(messages_from_store.timestamp?.toDate()).toUTCString()}
                                          </span> */}
                                    </p>
                              </div>
                        ))}
                  </div>

                  <div className="chatbox_footer">
                        <form className="chatbox_footer_form" style={{ fontSize: "22px" }}  >
                              <textarea style={{ border: "none", outline: "none", flex: "1" }}
                                    value={message}
                                    onChange={(e) => setmessage(e.target.value)}
                                    type="text"
                                    placeholder="Type a message"
                              />
                              <SendOutlinedIcon fontSize="large" onClick={sendMessage} className="form_button" type="submit" style={{ cursor: "pointer" }} />
                        </form>
                  </div>
            </div>
      );
}

export default Chatbox;
