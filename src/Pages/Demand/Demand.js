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
  const [alldemand, setalldemand] = useState([]);
  const [newdemandmode, setnewdemandMode] = useState(false);

  const [focusmode, setfocusmode] = useState(false);
  const [focus, setfocus] = useState(false);
  const [histomodecomplet, sethistomodecomplet] = useState(false);
  const [prev, setprev] = useState([]);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  //get data
  useEffect(() => {
    const sendreq = async () => {
      try {
        const response = await sendRequest(
          `http://localhost:5000/api/demand/`,
          "GET",
          null,
          { Authorization: "bearer " + auth.token }
        );
        setalldemand(response.demanduser);
      } catch (err) {}
    };
    sendreq();
  }, [auth, sendRequest]);

  //get prev
  useEffect(() => {
    setprev(alldemand.slice(0, 3));
  }, [alldemand]);

  //see historique
  const histomodecomplethandler = (e) => {
    sethistomodecomplet((p) => !p);
  };
  //
  const newdemandHandler = () => {
    setnewdemandMode((p) => !p);
  };

  //Show infos
  const explichandler = (e) => {
    console.log(e);
    setfocus(e);
    setfocusmode(true);
  };
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
        onCancel={quitfocusHandler}
        height={`${window.innerHeight - 100}px`}
        overflow="scroll"
      >
        <div className="demandId">
          <h1>Demand Id</h1>
          <p>{focus._id}</p>
        </div>
        <div className="datedossier">
          <h1>Date de dossier</h1>
          <p>{DatetoStringMinemethod(new Date(focus.askingDate))}</p>
        </div>
        <div className="datedébut">
          <h1>Date de la réservation</h1>
          <p>{DatetoStringMinemethod(new Date(focus.askedDatebeg))}</p>
        </div>
        <div className="Heure">
          <h1>Nombre d'heure</h1>
          <p>
            {(new Date(focus.askedDateend).getTime() -
              new Date(focus.askedDatebeg).getTime()) /
              3600000}
          </p>
        </div>
        <div className="status">
          <h1>Status</h1>
          <p
            style={{
              color:
                focus.status === "Waiting for validation" ? "orange" : "black",
            }}
          >
            {focus.status}
          </p>
        </div>
        {focus.feedback && (
          <div className="demandId">
            <h1>Demand Id</h1>
            <p>{focus._id}</p>
          </div>
        )}
        <Button
          height="30px"
          orange
          width="70%"
          borderradius="38px"
          maxWidth="90vw"
          onClick={quitfocusHandler}
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
          width="150px"
          text="Reserver"
          text2="Studio"
          borderRadius="50px"
          className="UnconnectedIndividualIcon"
        />
        <IconSvg
          onClick={newdemandHandler}
          src={paniersvg}
          alt={"pannier"}
          width="150px"
          text="Louer"
          text2="Matos"
          borderRadius="50px"
          className="UnconnectedIndividualIcon"
        />
      </div>
      <div
        className="prevdemand"
        style={{
          transform: histomodecomplet
            ? `translateY(-${0.5 * window.innerHeight}px)`
            : "",
          height: histomodecomplet ? `${window.innerHeight - 100}px` : "232px",
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
                    <p>{DatetoStringMinemethod(new Date(demand.askingDate))}</p>
                  </div>
                  <div
                    className="status"
                    style={{
                      color:
                        demand.status === "Waiting for validation"
                          ? "orange"
                          : "black",
                    }}
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
                    <p>{DatetoStringMinemethod(new Date(demand.askingDate))}</p>
                  </div>
                  <div className="status">
                    <p
                      style={{
                        color:
                          demand.status === "Waiting for validation"
                            ? "orange"
                            : "black",
                      }}
                    >
                      {demand.status}
                    </p>
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
          <h4>{`${
            !histomodecomplet ? "Voir mon historique complet" : "Back"
          }`}</h4>
        </Button>
      </div>
    </div>
  );
};

export default Demand;
