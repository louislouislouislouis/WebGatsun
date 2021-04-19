import React, { useState, useContext, useEffect } from "react";
import { useHttpClient } from "../../Hooks/http-hook";
import { AuthContext } from "../../Context/auth-context";
import Button from "../../Components/Shared/Button";

import "./Demand.css";
import "react-calendar/dist/Calendar.css";

import microsvg from "../../File/svg/micro.svg";
import paniersvg from "../../File/svg/panier.svg";
import IconSvg from "../../Components/Shared/IconSvg";
import NewDemand from "./NewDemand";
import Waitings from "../../Components/Shared/Waitings";
import ErrorModal from "../../Components/Shared/ErrorModal";
import Modal from "../../Components/Shared/Modal";

const Demand = () => {
  //data
  const [alldemand, setalldemand] = useState([]);
  const [prev, setprev] = useState([]);
  const [focus, setfocus] = useState([]);

  //different mode
  const [newdemandmode, setnewdemandMode] = useState(false);
  const [focusmode, setfocusmode] = useState(false);
  const [histomodecomplet, sethistomodecomplet] = useState(false);

  //global
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  //get data
  useEffect(() => {
    const sendreq = async () => {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BACKENDURL}/api/demand/`,
          "GET",
          null,
          { Authorization: "bearer " + auth.token }
        );

        response.demanduser.sort((a, b) => {
          return (
            new Date(b.askingDate).getTime() - new Date(a.askingDate).getTime()
          );
        });

        setalldemand(response.demanduser);
      } catch (err) {}
    };
    sendreq();
  }, [auth, sendRequest, newdemandmode]);

  //get prev
  useEffect(() => {
    setprev(alldemand.slice(0, 3));
  }, [alldemand]);

  //see historique
  const histomodecomplethandler = (e) => {
    sethistomodecomplet((p) => !p);
  };

  //New demand
  const newdemandHandler = () => {
    setnewdemandMode((p) => !p);
  };

  //Show infos an traitment data
  const explichandler = (e) => {
    if (e) {
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
            newkeyname = " Identifiant du demandeur";
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
          case "paymentmethod":
            newkeyname = "Mode de Paiement";
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
    } else {
      e = [];
    }
    setfocus(e);
    setfocusmode((p) => !p);
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

  return (
    <div className="demandhomepage">
      <ErrorModal
        error={error}
        onClear={clearError}
        onClearAction={clearError}
        action="Go Home"
      />
      <Modal
        show={focusmode}
        className="focuondemand"
        onCancel={() => explichandler()}
        height={`${window.innerHeight - 100}px`}
        overflow="scroll"
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

        <Button
          height="30px"
          orange
          width="70%"
          borderradius="38px"
          maxWidth="90vw"
          onClick={() => explichandler()}
          bottom="10px"
          topmargin="30px"
        >
          <h4 style={{ fontSize: "20px", margin: "0" }}>Retour</h4>
        </Button>
      </Modal>
      <NewDemand show={newdemandmode} onCancel={newdemandHandler} />
      <h1>My Demands</h1>
      <div className="IconContainer">
        <IconSvg
          onClick={newdemandHandler}
          src={microsvg}
          alt={"Studio"}
          width={`${window.innerWidth < 400 ? "100" : "150"}px`}
          text="Reserver"
          text2="Studio"
          borderRadius={`${window.innerWidth < 400 ? "32" : "50"}px`}
          className="UnconnectedIndividualIcon"
        />
        <IconSvg
          onClick={() => console.log("pas encore dispo")}
          src={paniersvg}
          alt={"pannier"}
          width={`${window.innerWidth < 400 ? "100" : "150"}px`}
          text="Louer"
          text2="Matos"
          borderRadius={`${window.innerWidth < 400 ? "32" : "50"}px`}
          className="UnconnectedIndividualIcon"
        />
      </div>
      <div className="englobeprev">
        <div
          className="prevdemand"
          style={{
            transform: histomodecomplet
              ? `translateY(-${0.28 * window.innerHeight}px)`
              : "",
            height: histomodecomplet
              ? `${0.7 * window.innerHeight}px`
              : "232px",
          }}
        >
          <h2>Prev Demands</h2>
          <div className="table">
            <h3>Date</h3>
            <h3 className="status">Status</h3>
            <h3> </h3>
            {isLoading && (
              <Waitings
                width="100px"
                pos="absolute"
                left="50%"
                transform="translateX(-50%)"
                bottom="50px"
              />
            )}
            {!histomodecomplet &&
              prev.map((demand) => {
                return (
                  <React.Fragment key={demand._id}>
                    <div className="date">
                      <p>
                        {DatetoStringMinemethod(new Date(demand.askingDate))}
                      </p>
                    </div>
                    <div
                      className={`status ${demand.status.replace(/\s/g, "")}`}
                    >
                      <p>{demand.status}</p>
                    </div>
                    <div className="interro">
                      <div
                        className="interrogation"
                        onClick={() => explichandler(demand)}
                      >
                        <div className="roundedinter">?</div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            {histomodecomplet &&
              alldemand.map((demand) => {
                return (
                  <React.Fragment key={demand._id}>
                    <div className="date">
                      <p>
                        {DatetoStringMinemethod(new Date(demand.askingDate))}
                      </p>
                    </div>
                    <div
                      className={`status ${demand.status.replace(/\s/g, "")}`}
                    >
                      <p>{demand.status}</p>
                    </div>
                    <div className="interro">
                      <div
                        className="interrogation"
                        onClick={() => explichandler(demand)}
                      >
                        <div className="roundedinter">?</div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
          </div>
          <Button
            height="30px"
            orange
            width="70%"
            borderradius="38px"
            maxWidth="90vw"
            onClick={histomodecomplethandler}
            bottom="10px"
            position="absolute"
          >
            <h4>{`${!histomodecomplet ? "Historique complet" : "Back"}`}</h4>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Demand;
