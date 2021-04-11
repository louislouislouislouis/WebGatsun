import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "./NewDemand.css";
import Modal from "../../Components/Shared/Modal";
import Input from "../../Components/Shared/Input";
import { useForm } from "../../Hooks/form-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../util/validators";
const DUMMYOCCUPATION = [
  {
    datebegin: new Date("April 11, 2021 23:00:00"),
    dateend: new Date("April 12, 2021 00:00:00"),
  },
  {
    datebegin: new Date("April 12, 2021 19:00:00"),
    dateend: new Date("April 12, 2021 21:00:00"),
  },
  {
    datebegin: new Date("April 19, 2021 19:00:00"),
    dateend: new Date("April 19, 2021 22:00:00"),
  },
  {
    datebegin: new Date("April 19, 2021 23:00:00"),
    dateend: new Date("April 20, 2021 05:00:00"),
  },
  {
    datebegin: new Date("April 20, 2021 09:00:00"),
    dateend: new Date("April 20, 2021 22:00:00"),
  },
];
const NewDemand = (props) => {
  const [timevalue, settimevalue] = useState("19:00");
  const [longtime, setlongtime] = useState(2);
  const [feedback, setfeedback] = useState();
  const [feedbacktime, setfeedbacktime] = useState("");
  const [value, setvaluechange] = useState(
    new Date(new Date().setHours(0, 0, 0, 0))
  );
  const [showingcalendar, setshowingcalendar] = useState(false);

  //show calendar
  const showcalendar = (state) => {
    setshowingcalendar(state);
  };
  //chnage date value
  const setvaluechangehandler = (e) => {
    setvaluechange(e);
  };
  //changetimevalue
  const timevaluehancler = (e) => {
    let myval = e.target.value.substring(0, 2);
    myval += ":00";
    settimevalue(myval);
  };

  //Pratical function
  const datesAreOnSameDay = (first, second) => {
    return (
      first.getFullYear() === second.getFullYear() &&
      first.getMonth() === second.getMonth() &&
      first.getDate() === second.getDate()
    );
  };

  const DatetoStringMinemethod = (date) => {
    return (
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
      "." +
      (date.getMonth() > 8
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1)) +
      "." +
      date.getFullYear()
    );
  };

  //setfeedbackdate
  useEffect(() => {
    let senderfeedback;

    const reservationonsamedate = DUMMYOCCUPATION.filter((res) => {
      return (
        datesAreOnSameDay(value, res.datebegin) ||
        datesAreOnSameDay(value, res.dateend)
      );
    });

    if (reservationonsamedate.length !== 0) {
      senderfeedback = "That day stud is booked from ";
      reservationonsamedate.forEach((occup, index) => {
        if (datesAreOnSameDay(occup.datebegin, occup.dateend)) {
          senderfeedback +=
            (occup.datebegin.getHours() < 10
              ? "0" + occup.datebegin.getHours()
              : occup.datebegin.getHours()) +
            ":" +
            (occup.datebegin.getMinutes() < 10
              ? "0" + occup.datebegin.getMinutes()
              : occup.datebegin.getMinutes()) +
            " to " +
            (occup.dateend.getHours() < 10
              ? "0" + occup.dateend.getHours()
              : occup.dateend.getHours()) +
            ":" +
            (occup.dateend.getMinutes() < 10
              ? "0" + occup.dateend.getMinutes()
              : occup.dateend.getMinutes()) +
            (index !== reservationonsamedate.length - 1 ? " and from " : "");
        } else {
          if (occup.datebegin.getDate() === value.getDate()) {
            senderfeedback +=
              (occup.datebegin.getHours() < 10
                ? "0" + occup.datebegin.getHours()
                : occup.datebegin.getHours()) +
              ":" +
              (occup.datebegin.getMinutes() < 10
                ? "0" + occup.datebegin.getMinutes()
                : occup.datebegin.getMinutes()) +
              " to 00:00" +
              (index !== reservationonsamedate.length - 1 ? " and from " : "");
          } else if (occup.dateend.getHours() === 0) {
            if (reservationonsamedate.length !== 1) {
              senderfeedback = "That day stud is booked from ";
            } else {
              senderfeedback = "";
            }
          } else if (occup.dateend.getDate() === value.getDate()) {
            console.log(occup.dateend.getHours());
            senderfeedback +=
              "00:00 to " +
              (occup.dateend.getHours() < 10
                ? "0" + occup.dateend.getHours()
                : occup.dateend.getHours()) +
              ":" +
              (occup.dateend.getMinutes() < 10
                ? "0" + occup.dateend.getMinutes()
                : occup.dateend.getMinutes()) +
              (index !== reservationonsamedate.length - 1 ? " and from " : "");
          }
        }
      });
    }
    setfeedback(senderfeedback);
  }, [value]);

  //set feedbacktime
  useEffect(() => {
    let senderfeedback = "";
    const reservationonsamedate = DUMMYOCCUPATION.filter((res) => {
      return (
        datesAreOnSameDay(value, res.datebegin) ||
        datesAreOnSameDay(value, res.dateend)
      );
    });

    if (reservationonsamedate.length !== 0) {
      const hourwanted = parseInt(timevalue.substring(0, 2));
      reservationonsamedate.forEach((occup, index) => {
        if (datesAreOnSameDay(occup.datebegin, occup.dateend)) {
          if (
            occup.datebegin.getHours() <= hourwanted &&
            occup.dateend.getHours() > hourwanted
          ) {
            senderfeedback = "Impossible, stud will be occuped";
          }
        } else {
          if (datesAreOnSameDay(occup.datebegin, value)) {
            if (occup.datebegin.getHours() <= hourwanted) {
              senderfeedback = "Impossible, stud will be occuped";
            }
          } else if (datesAreOnSameDay(occup.dateend, value)) {
            if (occup.dateend.getHours() > hourwanted) {
              senderfeedback = "Impossible, stud will be occuped";
            }
          }
        }
      });
    }
    setfeedbacktime(senderfeedback);
  }, [timevalue, value]);

  //changehourselectedlong
  const longtimevalueHandler = (e) => {
    if (parseInt(e.target.value)) {
      setlongtime(Math.min(parseInt(e.target.value), maxh));
    } else if (e.target.value == "") {
      setlongtime("");
    }
  };
  const [maxh, setmaxh] = useState(6);

  //update maxhourpossible
  useEffect(() => {
    let landemain = new Date(value);
    landemain.setDate(landemain.getDate() + 1);

    const hourwanted = parseInt(timevalue.substring(0, 2));
    let datebeginning = new Date(value);

    datebeginning.setHours(hourwanted);

    const reservationonsamedate = DUMMYOCCUPATION.filter((res) => {
      return (
        datesAreOnSameDay(value, res.datebegin) ||
        datesAreOnSameDay(value, res.dateend) ||
        datesAreOnSameDay(landemain, res.datebegin)
      );
    });
    let min = 6;
    reservationonsamedate.forEach((date) => {
      if ((date.dateend.getTime() - datebeginning.getTime()) / 3600000 <= 0) {
        //console.log(" 1:La value ets de 6");
      } else if (
        (date.datebegin.getTime() - datebeginning.getTime()) / 3600000 >=
        0
      ) {
        /* console.log(
          "2:La value ets de " +
            (date.datebegin.getTime() - datebeginning.getTime()) / 3600000
        ); */
        min = Math.min(
          min,
          (date.datebegin.getTime() - datebeginning.getTime()) / 3600000
        );
      } else if (
        (date.datebegin.getTime() - datebeginning.getTime()) / 3600000 < 0 &&
        (date.dateend.getTime() - datebeginning.getTime()) / 3600000 > 0
      ) {
        // console.log("3:La value ets de 0");
        min = 0;
      }
    });
    setmaxh(min);
    setlongtime((p) => Math.min(p, min));
  }, [timevalue, value]);

  return (
    <Modal
      top="120px"
      show={props.show}
      onCancel={props.onCancel}
      height="700px"
    >
      <div className="askingdate">
        <h2>Date de réservation</h2>
        <input
          type="text"
          className="demandinput"
          value={DatetoStringMinemethod(value)}
          onFocus={() => showcalendar(true)}
          readOnly
        />
        <div
          className="vizualize"
          style={{ height: showingcalendar ? "270px" : "0" }}
        >
          <div className="mycalendar">
            <Calendar
              onChange={setvaluechangehandler}
              value={value}
              minDate={new Date(new Date().setHours(0, 0, 0, 0))}
            />
          </div>
        </div>
        <div className="feedback">
          <p>{feedback}</p>
        </div>
      </div>

      <div className="askingtime">
        <h2>Heure de réservation</h2>
        <input
          type="time"
          className="demandinput"
          onFocus={() => showcalendar(false)}
          style={{ backgroundColor: feedbacktime !== "" ? "#ffd1d1" : "" }}
          value={timevalue}
          onChange={timevaluehancler}
          step={3600000}
        />
        <div className="feedback">
          <p>{feedbacktime}</p>
        </div>
      </div>
      <div className="askinglong">
        <h2>durée</h2>
        <input
          type="number"
          className="demandinput"
          onFocus={() => showcalendar(false)}
          value={longtime}
          style={{ backgroundColor: feedbacktime !== "" ? "#ffd1d1" : "" }}
          onChange={longtimevalueHandler}
          max={maxh}
          min={1}
        />
      </div>
    </Modal>
  );
};

export default NewDemand;
