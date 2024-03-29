import React, { useState, useEffect, useContext } from "react";
import Calendar from "react-calendar";
import { AuthContext } from "../../Context/auth-context";
import { useHttpClient } from "../../Hooks/http-hook";

import "./NewDemand.css";

import ErrorModal from "../../Components/Shared/ErrorModal";
import Modal from "../../Components/Shared/Modal";
import Button from "../../Components/Shared/Button";
import Confimationmodal from "../../Components/Shared/Confimationmodal";

const NewDemand = (props) => {
  const [occupation, setoccupation] = useState([]);

  //value necessited by the users
  const [timevalue, settimevalue] = useState("19:00");
  const [paymentmethod, setpaymentmethod] = useState("CB");
  const [longtime, setlongtime] = useState(2);
  const [message, setmessage] = useState("");
  const [value, setvaluechange] = useState(
    new Date(new Date().setHours(0, 0, 0, 0))
  );
  const [keys, setkeys] = useState(false);

  //value of controls
  const [maxh, setmaxh] = useState(6);
  const [feedback, setfeedback] = useState();
  const [feedbacktime, setfeedbacktime] = useState("");

  //success sendingreq
  const [success, setsucess] = useState(false);

  //different mode of vision
  const [showingcalendar, setshowingcalendar] = useState(false);
  const [confirmationmode, setconfirmationmode] = useState(false);

  //habitual
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  //Get the date of occupation when load
  useEffect(() => {
    const vsendReq = async () => {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BACKENDURL}/api/occup/`,
          "GET",
          null,
          { Authorization: "bearer " + auth.token }
        );

        response.occup.forEach((el) => {
          el.datebegin = new Date(el.datebegin);
          el.dateend = new Date(el.dateend);
        });

        setoccupation(response.occup);
      } catch (err) {}
    };
    vsendReq();
  }, [auth.token, sendRequest]);

  //MODE CHANGING

  //change mode
  const modeconfhandler = () => {
    setconfirmationmode((p) => !p);
  };
  //show calendar
  const showcalendar = (state) => {
    setshowingcalendar(state);
  };

  //VALUE CHANGING

  //changemsg
  const changemessagehandler = (e) => {
    setmessage(e.target.value);
  };
  //changemodepaiment
  const changeStatusHandler = (e) => {
    setpaymentmethod(e);
  };
  //chnage date value
  const setvaluechangehandler = (e) => {
    setvaluechange(e);
  };
  //change keys
  const changekeyshandler = (e) => {
    setkeys(e);
  };
  //changetimevalue
  const timevaluehancler = (e) => {
    let myval = e.target.value.substring(0, 2);
    myval += ":00";
    settimevalue(myval);
  };
  //change durée
  const longtimevalueHandler = (e) => {
    if (parseInt(e.target.value)) {
      setlongtime(Math.min(parseInt(e.target.value), maxh));
    } else if (e.target.value === "") {
      setlongtime("");
    }
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

  //setfeedbackdate each time new date
  useEffect(() => {
    let senderfeedback;
    const reservationonsamedate = occupation.filter((res) => {
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
            (index === reservationonsamedate.length - 1 ? "" : " and from");
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
            senderfeedback = senderfeedback.slice(0, -9);
          } else if (occup.dateend.getDate() === value.getDate()) {
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
  }, [value, occupation]);

  //set feedbacktime each time time of reservation or date change
  useEffect(() => {
    let senderfeedback = "";
    const reservationonsamedate = occupation.filter((res) => {
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
            senderfeedback = "Impossible, le studio est déja réservé";
          }
        } else {
          if (datesAreOnSameDay(occup.datebegin, value)) {
            if (occup.datebegin.getHours() <= hourwanted) {
              senderfeedback = "Impossible, le studio est déja réservé";
            }
          } else if (datesAreOnSameDay(occup.dateend, value)) {
            if (occup.dateend.getHours() > hourwanted) {
              senderfeedback = "Impossible, le studio est déja réservé";
            }
          }
        }
      });
    }
    setfeedbacktime(senderfeedback);
  }, [timevalue, value, occupation]);

  //update maxhourpossible time time of reservation or date change
  useEffect(() => {
    let landemain = new Date(value);
    landemain.setDate(landemain.getDate() + 1);

    const hourwanted = parseInt(timevalue.substring(0, 2));
    let datebeginning = new Date(value);

    datebeginning.setHours(hourwanted);

    const reservationonsamedate = occupation.filter((res) => {
      return (
        datesAreOnSameDay(value, res.datebegin) ||
        datesAreOnSameDay(value, res.dateend) ||
        datesAreOnSameDay(landemain, res.datebegin)
      );
    });
    let min = 6;
    reservationonsamedate.forEach((date) => {
      if ((date.dateend.getTime() - datebeginning.getTime()) / 3600000 <= 0) {
      } else if (
        (date.datebegin.getTime() - datebeginning.getTime()) / 3600000 >=
        0
      ) {
        min = Math.min(
          min,
          (date.datebegin.getTime() - datebeginning.getTime()) / 3600000
        );
      } else if (
        (date.datebegin.getTime() - datebeginning.getTime()) / 3600000 < 0 &&
        (date.dateend.getTime() - datebeginning.getTime()) / 3600000 > 0
      ) {
        min = 0;
      }
    });
    setmaxh(min);
    setlongtime((p) => Math.min(p, min));
  }, [timevalue, value, occupation]);

  //envoyer demands
  const hndlesubmit = async (e) => {
    //Creating a good datebeg value
    const hourwanted = parseInt(timevalue.substring(0, 2));
    let datebeginning = new Date(value);
    datebeginning.setHours(hourwanted);

    //Creating a good enddate value
    let enddate = new Date(datebeginning);
    enddate.setHours(enddate.getHours() + longtime);

    //object to send
    const tosend = {
      askingDate: new Date(),
      askedDatebeg: datebeginning,
      askedDateend: enddate,
      message: message,
      ...(props.public && { key: keys }),
      type: props.public ? "public" : "private",
      paymentmethod: paymentmethod === "Liquide" ? "cash" : "cb",
    };

    //envoie
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKENDURL}/api/demand/new`,
        "POST",
        JSON.stringify(tosend),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      //if victory set sucess
      setsucess(true);
      //renbobiner all data
      setmessage("");
      setlongtime(2);
      setpaymentmethod("CB");
      settimevalue("19:00");
      setvaluechange(new Date(new Date().setHours(0, 0, 0, 0)));
      setkeys(false);

      props.onCancel();
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal
        error={error}
        onClear={clearError}
        onClearAction={clearError}
        action="Go Home"
      ></ErrorModal>
      <Confimationmodal
        type={success ? "Success" : "Avert"}
        text={
          !success
            ? `Vous êtes sur le point de demander une réservation ${
                props.public ? "public" : "privée"
              } du studio pour le ${DatetoStringMinemethod(
                value
              )} à ${timevalue}H pour une durée de ${longtime}H. ${
                props.public
                  ? keys
                    ? "VOUS AVEZ LES CLEFS"
                    : "VOUS N'AVEZ PAS LES CLEFS"
                  : `Le paiement se fera en ${paymentmethod}`
              }`
            : "Votre confirmation a été réservé. Vous allez être contactez par mail sous peu"
        }
        onCancel={modeconfhandler}
        onClick={success ? modeconfhandler : hndlesubmit}
        show={confirmationmode}
        isLoading={isLoading}
      />
      <Modal
        height={`${window.innerHeight - 100}px`}
        top="50px"
        overflow="scroll"
        show={props.show}
        onCancel={props.onCancel}
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
            style={{
              backgroundColor:
                !(longtime <= 6 && longtime) > 0 ? "#ffd1d1" : "",
            }}
            onChange={longtimevalueHandler}
            max={maxh}
            min={1}
          />
          <p>
            {feedbacktime === ""
              ? !(longtime <= 6 && longtime) > 0
                ? `La durée de réservation doit être comprise entre 1H et ${maxh}H`
                : ""
              : "Veuillez changer l'heure de réservation"}
          </p>
        </div>
        <div className="skingreason">
          <h2>Message</h2>
          <textarea
            type="textarea"
            className="demandinput"
            onFocus={() => showcalendar(false)}
            value={message}
            rows="3"
            onChange={changemessagehandler}
            style={{ backgroundColor: message === "" ? "#ffd1d1" : "" }}
          />
          <p>
            {message === ""
              ? "Une brève description du projet est nécessaire"
              : ""}
          </p>
        </div>
        {!props.public && (
          <div className="skingreason">
            <h2>Mode de Paiement</h2>
            <div className="Answerstatu">
              <div
                className={`choice${
                  paymentmethod === "CB" ? "focus" : "unfocus"
                }`}
                onClick={() => changeStatusHandler("CB")}
              >
                <p>CB</p>
              </div>
              <div
                className={`choice${
                  paymentmethod === "Liquide" ? "focus" : "unfocus"
                }`}
                onClick={() => changeStatusHandler("Liquide")}
              >
                <p>Liquide</p>
              </div>
            </div>
          </div>
        )}
        {props.public && (
          <div className="keys">
            <h2>Clefs du studio</h2>
            <div className="Answerstatu">
              <div
                className={`choice${keys ? "focus" : "unfocus"}`}
                onClick={() => changekeyshandler(true)}
              >
                <p>J'ai les clefs</p>
              </div>
              <div
                className={`choice${!keys ? "focus" : "unfocus"}`}
                onClick={() => changekeyshandler(false)}
              >
                <p>Je n'ai pas les clefs</p>
              </div>
            </div>
          </div>
        )}

        <Button
          height="56px"
          text="Reserver le studio"
          fontsize="20px"
          borderradius="22px"
          width="100%"
          orange
          marginbottom="30px"
          onClick={modeconfhandler}
          disabled={
            feedbacktime !== "" ||
            message === "" ||
            longtime > maxh ||
            longtime <= 0
          }
        ></Button>
      </Modal>
    </React.Fragment>
  );
};

export default NewDemand;
