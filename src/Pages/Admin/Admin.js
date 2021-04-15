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
  const [developmode, setdevelopmode] = useState(false);
  const [developmodepaiment, setdevelopmodepeiement] = useState(false);

  const [confirmationmode, setconfirmationmode] = useState(false);
  const [newdemandmode, setnewdemandemode] = useState(false);

  const [focus, setfocus] = useState({});
  const [focusmode, setfocusmode] = useState(false);

  const [success, setsuccess] = useState();
  const [message, setmessage] = useState("");

  const [reload, setrelaos] = useState(false);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  const quitfocusHandler = (e) => {
    setfocusmode(false);
  };
  //JS function to manipule date
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

  const developmodehandler = () => {
    setdevelopmode((p) => !p);
  };

  const focusmodehandler = (e, mode) => {
    setfocusmode(mode);
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

  const hndlesubmit = async (e) => {
    console.log("dede");
    if (!success && message !== "" && focusmode == "reservationenattente") {
      const tosend = {
        demand: e._id,
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
    } else if (success && focusmode == "reservationenattente") {
      const tosend = {
        demand: e._id,
        message: "ras",
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
      try {
        const tosend = {
          demand: e._id,
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
    } else if (focusmode == "keys") {
      try {
        console.log("dd");
        const tosend = {
          demand: e._id,
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
  const changemessagehandler = (e) => {
    setmessage(e.target.value);
  };
  const newdemandHandler = () => {
    setnewdemandemode((p) => !p);
  };
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
      console.log(response);
    } catch (err) {}
  };
  return (
    <div className="adminPage">
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
          success && focusmode == "reservationenattente"
            ? "Vous êtes sur le point de valider une demande. Êtes vous sur de pouvoir l'assurer?"
            : focusmode === "paiment"
            ? "Vous êtes sur le point de confirmer le paiement d'un membre. En êtes vous sur ? "
            : focusmode === "keys" && success
            ? "Vous êtes sur le point de confirmer que les clefs ont bien étées données à la personne adéquate. En êtes vous sur ? "
            : "Vous êtes sur le point de refuser une demande. En êtes vous sur ?"
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
          success && focusmode == "reservationenattente"
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
        height={"auto"}
        overflow="scroll"
      >
        <div className="demandId">
          <h1 style={{ fontSize: "20px" }}>Demand Id</h1>
          <p>{focus._id}</p>
        </div>
        <div className="nomprenom">
          <h1 style={{ fontSize: "20px" }}>Demandeur</h1>
          <p>{focus.ownerdenomination}</p>
        </div>
        <div className="datedossier">
          <h1 style={{ fontSize: "20px" }}>Date de dossier</h1>
          <p>{DatetoStringMinemethod(new Date(focus.askingDate))}</p>
        </div>
        <div className="datedébut">
          <h1 style={{ fontSize: "20px" }}>Date de la réservation</h1>
          <p>{`Le ${DatetoStringMinemethod(
            new Date(focus.askedDatebeg)
          )} à ${new Date(focus.askedDatebeg).getHours()}H`}</p>
        </div>
        <div className="Heure">
          <h1 style={{ fontSize: "20px" }}>Nombre d'heure</h1>
          <p>
            {(new Date(focus.askedDateend).getTime() -
              new Date(focus.askedDatebeg).getTime()) /
              3600000}
          </p>
        </div>
        <div className="status">
          <h1 style={{ fontSize: "20px" }}>Status</h1>
          <p
            style={{
              color:
                focus.status === "Waiting for validation" ? "orange" : "black",
            }}
          >
            {focus.status}
          </p>
        </div>
        <div className="status">
          <h1 style={{ fontSize: "20px" }}>Type</h1>
          <p>{focus.type}</p>
        </div>

        <div className="demandId">
          <h1 style={{ fontSize: "20px" }}>Mode de paiement</h1>
          <p>{focus.paymentmethod}</p>
        </div>
        <div className="demandId">
          <h1 style={{ fontSize: "20px" }}>Message</h1>
          <p>{focus.body}</p>
        </div>

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

      <div className="Inventaire">
        <h1>Inventaire</h1>
        <p>Pas encore disponible</p>
      </div>
      <NewDemand public show={newdemandmode} onCancel={newdemandHandler} />
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
      <div
        className="paiementenattente"
        style={{ height: developmodepaiment ? "70vh" : "" }}
      >
        <h1>Clefs en attente</h1>
        <div
          className="buttoncontainer"
          style={{
            overflowY: developmodepaiment ? "scroll" : "visible",
            height: developmodepaiment ? "80%" : "",
          }}
        >
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