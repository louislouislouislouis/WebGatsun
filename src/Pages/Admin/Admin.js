import React, { useEffect, useContext, useState } from "react";

import { useHttpClient } from "../../Hooks/http-hook";
import { AuthContext } from "../../Context/auth-context";
import Button from "../../Components/Shared/Button";
import Modal from "../../Components/Shared/Modal";
import Confimationmodal from "../../Components/Shared/Confimationmodal";

import developsvg from "../../File/svg/develop.svg";

import "./Admin.css";
import Errormodal from "../../Components/Shared/ErrorModal";
import NewDemand from "../Demand/NewDemand";

const Admin = () => {
  //data
  const [alldemand, setalldemand] = useState([]);
  const [prevalldemand, setprevalldemand] = useState([]);
  const [alldemandpaiment, setalldemandpaiement] = useState([]);
  const [prevalldemandpaiment, setprevalldemandpaiment] = useState([]);
  const [alldemandkeys, setalldemandkeys] = useState([]);
  const [focus, setfocus] = useState([]);

  //mode of vision
  const [developmode, setdevelopmode] = useState(false);
  const [developmodepaiment, setdevelopmodepeiement] = useState(false);
  const [confirmationmode, setconfirmationmode] = useState(false);
  const [newdemandmode, setnewdemandemode] = useState(false);
  const [focusmode, setfocusmode] = useState(false);
  const [success, setsuccess] = useState();
  const [message, setmessage] = useState("");

  const [reload, setrelaos] = useState(false);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  //MODECHANGER

  const quitfocusHandler = (e) => {
    setfocusmode(false);
  };
  const developmodehandler = () => {
    setdevelopmode((p) => !p);
  };
  //focusmodechanger + setter
  const focusmodehandler = (e, mode) => {
    setfocusmode(mode);
    delete e.validateby;
    const nexfocus = [];
    const time =
      (new Date(e.askedDateend).getTime() -
        new Date(e.askedDatebeg).getTime()) /
      3600000;

    Object.keys(e).forEach((key) => {
      let newkeyname;
      switch (key) {
        case "from":
          newkeyname = "Identifiant du demandeur";
          break;
        case "_id":
          newkeyname = "Identifiant de la demande";
          break;
        case "body":
          newkeyname = "Message";
          break;
        case "type":
          newkeyname = "Type";
          break;
        case "askedDatebeg":
          newkeyname = "Date de début";
          e[key] = new Date(e[key]).toString();
          break;
        case "askedDateend":
          newkeyname = "Durée";
          e[key] = time + "H";
          break;
        case "askingDate":
          newkeyname = "Date de la demande";
          e[key] = new Date(e[key]).toString();
          break;
        case "status":
          newkeyname = "Status";
          break;
        case "ownerdenomination":
          newkeyname = "Demandeur";
          break;
        case "feedback":
          newkeyname = "Retour";
          break;
        case "feedbackdate":
          newkeyname = "Date d'inspection";
          e[key] = new Date(e[key]).toString();
          break;
        case "dateofclose":
          newkeyname = "Fermeture de dossier";
          e[key] = new Date(e[key]).toString();
          break;
        case "emaildemandeur":
          newkeyname = "Mail du demandeur";
          break;
        default:
          newkeyname = key;
          break;
      }
      nexfocus.push([newkeyname, e[key]]);
    });

    e = nexfocus;

    setfocus(e);
  };
  const responsehandle = (e) => {
    setsuccess(e);
    setconfirmationmode(true);
  };
  const modeconfhandler = (e) => {
    setconfirmationmode((p) => !p);
  };
  const developmodepaiementhandler = (e) => {
    setdevelopmodepeiement((p) => !p);
  };
  const changemessagehandler = (e) => {
    setmessage(e.target.value);
  };
  const newdemandHandler = () => {
    setnewdemandemode((p) => !p);
  };

  //GET DEMAND WAITINGS
  useEffect(() => {
    const sendreq = async () => {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BACKENDURL}/api/demand/all`,
          "GET",
          null,
          { Authorization: "bearer " + auth.token }
        );
        setalldemand(response.alldemand);
        setprevalldemand(response.alldemand.slice(0, 2));
      } catch (err) {}
    };
    sendreq();
  }, [auth, sendRequest, reload]);

  //GET DEMAND KEYS
  useEffect(() => {
    const sendreq = async () => {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BACKENDURL}/api/demand/allkeys`,
          "GET",
          null,
          { Authorization: "bearer " + auth.token }
        );
        setalldemandkeys(response.alldemand);
      } catch (err) {}
    };
    sendreq();
  }, [auth, sendRequest, reload]);

  //GET DEMAND PAYMENT
  useEffect(() => {
    const sendreq = async () => {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BACKENDURL}/api/demand/allpayment`,
          "GET",
          null,
          { Authorization: "bearer " + auth.token }
        );
        setalldemandpaiement(response.alldemand);
        setprevalldemandpaiment(response.alldemand.slice(0, 2));
      } catch (err) {}
    };
    sendreq();
  }, [auth, sendRequest, reload]);

  const hndlesubmit = async (e) => {
    //DENY DEMAND
    let id;
    for (let i = 0; i < e.length; i++) {
      if (e[i][0] === "Identifiant de la demande") {
        id = e[i][1];
        break;
      }
    }
    if (!success && message !== "" && focusmode === "reservationenattente") {
      const tosend = {
        demand: id,
        result: success,
        message: message,
        date: new Date(),
      };

      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BACKENDURL}/api/demand/`,
          "PATCH",
          JSON.stringify(tosend),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );

        if (response.message === "Success") {
          setconfirmationmode(false);
          setfocusmode(false);
          setdevelopmode(false);
          setrelaos((p) => !p);
          setmessage("");
        }
      } catch (err) {}
    } else if (success && focusmode === "reservationenattente") {
      //ACCEPT DEMAND
      const tosend = {
        demand: id,
        message: "OK",
        result: success,
        date: new Date(),
      };

      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BACKENDURL}/api/demand/`,
          "PATCH",
          JSON.stringify(tosend),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        if (response.message === "Success") {
          setconfirmationmode(false);
          setdevelopmode(false);
          setfocusmode(false);
          setrelaos((p) => !p);
          setmessage("");
        }
      } catch (err) {}
    } else if (focusmode === "paiment") {
      //VALIDATE PAYEMENT
      try {
        const tosend = {
          demand: id,
        };
        const response = await sendRequest(
          `${process.env.REACT_APP_BACKENDURL}/api/demand/validate`,
          "PATCH",
          JSON.stringify(tosend),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        if (response.message === "Success") {
          setconfirmationmode(false);
          setdevelopmode(false);
          setfocusmode(false);
          setrelaos((p) => !p);
          setmessage("");
        }
      } catch (err) {}
    } else if (focusmode === "keys") {
      //VALIDATE KEYS
      try {
        const tosend = {
          demand: id,
          result: success,
        };
        const response = await sendRequest(
          `${process.env.REACT_APP_BACKENDURL}/api/demand/validatekeys`,
          "PATCH",
          JSON.stringify(tosend),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        if (response.message === "Success") {
          setconfirmationmode(false);
          setdevelopmode(false);
          setfocusmode(false);
          setrelaos((p) => !p);
          setmessage("");
        }
      } catch (err) {}
    }
  };

  //VALIDATE PAYMENT WITH HELLO ASSO
  const sendverifypayment = async (e) => {
    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BACKENDURL}/api/helloasso/`,
        "GET",
        null,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
    } catch (err) {}
  };

  return (
    <div className="adminPage">
      <NewDemand public show={newdemandmode} onCancel={newdemandHandler} />
      <Errormodal
        error={error}
        onClear={clearError}
        onClearAction={clearError}
        action="Go Home"
      ></Errormodal>
      <Confimationmodal
        type="Other"
        title={"Warning"}
        text={
          success && focusmode === "reservationenattente"
            ? "Vous êtes sur le point de valider une demande. Êtes vous sur de pouvoir l'assurer?"
            : focusmode === "paiment"
            ? "Vous êtes sur le point de confirmer le paiement d'un membre. En êtes vous sur ? "
            : focusmode === "keys" && success
            ? "Vous êtes sur le point de confirmer que les clefs ont bien étées données à la personne adéquate. En êtes vous sur ? "
            : "Vous êtes sur le point de refuser une demande. En êtes vous sur ?" //case for deny key or reservation
        }
        onCancel={modeconfhandler}
        onClick={() => hndlesubmit(focus)}
        show={confirmationmode}
        isLoading={isLoading}
        disabled={
          focusmode !== "keys" &&
          focusmode !== "paiment" &&
          !success &&
          message === ""
        }
        buttontext={
          success && focusmode === "reservationenattente"
            ? "Valider la demande"
            : focusmode === "paiment"
            ? "Je confirme son paiement"
            : focusmode === "keys" && success
            ? "Je lui ai donnée les clefs"
            : "Refuser la demande"
        }
      >
        {focusmode !== "keys" && focusmode !== "paiment" && !success && (
          <div className="messa">
            <h2>Message (obligatoire)</h2>
            <textarea
              type="textarea"
              className="demandinput"
              value={message}
              rows="9"
              onChange={changemessagehandler}
              style={{ backgroundColor: message === "" ? "#ffd1d1" : "" }}
            />
          </div>
        )}
      </Confimationmodal>
      <Modal
        show={!!focusmode}
        className="focuondemand"
        onCancel={quitfocusHandler}
        overflow="scroll"
        height={window.innerHeight * 0.9}
      >
        {focus.map((foc) => {
          return (
            <div
              key={foc[0]}
              className={`${
                foc[0] === "Status"
                  ? `info Status ${foc[1].replace(/\s/g, "")}`
                  : `info ${foc[0]}`
              }`}
            >
              <h1>{foc[0]}</h1>
              <p>{foc[1]}</p>
            </div>
          );
        })}
        <div className="actionstodo">
          {focusmode === "reservationenattente" && (
            <React.Fragment>
              <Button
                height="50px"
                width="40%"
                borderradius="38px"
                maxWidth="90vw"
                onClick={() => responsehandle(false)}
                bottom="10px"
                topmargin="30px"
              >
                <h4 style={{ fontSize: "20px", margin: "0" }}>Refuser</h4>
              </Button>
              <Button
                height="50px"
                orange
                width="40%"
                borderradius="38px"
                maxWidth="90vw"
                onClick={() => responsehandle(true)}
                bottom="10px"
                topmargin="30px"
              >
                <h4 style={{ fontSize: "20px", margin: "0" }}>Valider</h4>
              </Button>
            </React.Fragment>
          )}
          {focusmode === "paiment" && (
            <React.Fragment>
              <Button
                height="50px"
                width="80%"
                orange
                borderradius="38px"
                maxWidth="90vw"
                onClick={() => responsehandle(false)}
                bottom="10px"
                topmargin="30px"
              >
                <h4 style={{ fontSize: "20px", margin: "0" }}>
                  Valider paiement
                </h4>
              </Button>
            </React.Fragment>
          )}
          {focusmode === "keys" && (
            <React.Fragment>
              <Button
                height="50px"
                width="80%"
                orange
                borderradius="38px"
                maxWidth="90vw"
                onClick={() => responsehandle(true)}
                bottom="10px"
                topmargin="30px"
              >
                <h4 style={{ fontSize: "20px", margin: "0" }}>Clefs données</h4>
              </Button>
              <Button
                height="50px"
                width="80%"
                orange
                borderradius="38px"
                maxWidth="90vw"
                onClick={() => responsehandle(false)}
                bottom="10px"
                topmargin="30px"
              >
                <h4 style={{ fontSize: "20px", margin: "0" }}>Refus</h4>
              </Button>
            </React.Fragment>
          )}
        </div>
      </Modal>
      <div
        className="reservationenattente"
        style={{ height: developmode ? "70vh" : "280px" }}
      >
        <h1>Reservations en attente</h1>
        <div
          className="buttoncontainer"
          style={{
            overflowY: developmode ? "scroll" : "visible",
            height: developmode ? "80%" : "180px",
          }}
        >
          {!developmode &&
            prevalldemand.map((demand) => {
              return (
                <React.Fragment key={demand._id}>
                  <Button
                    key={demand._id}
                    height="55px"
                    orange
                    borderradius="38px"
                    maxWidth="90vw"
                    onClick={() =>
                      focusmodehandler(demand, "reservationenattente")
                    }
                  >
                    <h2>{demand.ownerdenomination}</h2>
                  </Button>
                </React.Fragment>
              );
            })}
          {developmode &&
            alldemand.map((demand) => {
              return (
                <React.Fragment key={demand._id}>
                  <Button
                    height="55px"
                    orange
                    borderradius="38px"
                    maxWidth="90vw"
                    onClick={() =>
                      focusmodehandler(demand, "reservationenattente")
                    }
                  >
                    <h2>{demand.ownerdenomination}</h2>
                  </Button>
                </React.Fragment>
              );
            })}
        </div>
        <img
          style={{
            width: "43px",
            position: "absolute",
            bottom: "5px",
            left: "45%",
          }}
          src={developsvg}
          alt="develop"
          onClick={developmodehandler}
        />
      </div>
      <div className="synchronisationHelloAsso">
        <div className="synchroAdhesion">
          <Button
            height="55px"
            orange
            borderradius="38px"
            width="40%"
            marginbottom="20px"
            maxWidth="90vw"
            onClick={sendverifypayment}
          >
            <h4>Check Payment</h4>
          </Button>
          <Button
            height="55px"
            orange
            borderradius="38px"
            width="40%"
            marginbottom="20px"
            maxWidth="90vw"
            onClick={newdemandHandler}
          >
            <h4>Public session</h4>
          </Button>
        </div>
        <div className="synchoreservation"></div>
      </div>
      <div
        className="paiementenattente"
        style={{ height: developmodepaiment ? "70vh" : "280px" }}
      >
        <h1>Paiements en attente</h1>
        <div
          className="buttoncontainer"
          style={{
            overflowY: developmodepaiment ? "scroll" : "visible",
            height: developmodepaiment ? "80%" : "180px",
          }}
        >
          {!developmodepaiment &&
            prevalldemandpaiment.map((demand) => {
              return (
                <React.Fragment key={demand._id}>
                  <Button
                    key={demand._id}
                    height="55px"
                    orange
                    borderradius="38px"
                    maxWidth="90vw"
                    onClick={() => focusmodehandler(demand, "paiment")}
                  >
                    <h2>{demand.ownerdenomination}</h2>
                  </Button>
                </React.Fragment>
              );
            })}
          {developmodepaiment &&
            alldemandpaiment.map((demand) => {
              return (
                <React.Fragment key={demand._id}>
                  <Button
                    key={demand._id}
                    height="55px"
                    orange
                    borderradius="38px"
                    maxWidth="90vw"
                    onClick={() => focusmodehandler(demand, "paiment")}
                  >
                    <h2>{demand.ownerdenomination}</h2>
                  </Button>
                </React.Fragment>
              );
            })}
        </div>
        <img
          style={{
            width: "43px",
            position: "absolute",
            bottom: "5px",
            left: "45%",
          }}
          src={developsvg}
          alt="develop"
          onClick={developmodepaiementhandler}
        />
      </div>
      <div className="clefenattente">
        <h1>Clefs en attente</h1>
        <div className="buttoncontainer">
          {alldemandkeys.map((demand) => {
            return (
              <React.Fragment key={demand._id}>
                <Button
                  key={demand._id}
                  height="55px"
                  orange
                  borderradius="38px"
                  maxWidth="90vw"
                  onClick={() => focusmodehandler(demand, "keys")}
                  marginbottom="10px"
                >
                  <h2>{demand.ownerdenomination}</h2>
                </Button>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Admin;
