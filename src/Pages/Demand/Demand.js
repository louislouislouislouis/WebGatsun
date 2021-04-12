import React, { useState, useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useHttpClient } from "../../Hooks/http-hook";
import { AuthContext } from "../../Context/auth-context";
import Button from "../../Components/Shared/Button";

import "./Demand.css";
import "react-calendar/dist/Calendar.css";
import microsvg from "../../File/svg/micro.svg";
import paniersvg from "../../File/svg/panier.svg";
import IconSvg from "../../Components/Shared/IconSvg";
import Modal from "../../Components/Shared/Modal";
import NewDemand from "./NewDemand";

const INITDEMAND = {
  id: "",
  datecmd: "",
  datedmd: "",
  status: "",
  from: "",
  message: "",
  modepaiment: "",
};
const MYDUMMYDEMAND = [
  {
    id: "id1",
    datecmd: new Date(),
    datedmd: new Date("December 17, 1995 03:24:00"),
    status: "send",
    from: "userId",
    message: "Bonjour je voudrais réservé le studio pour un ",
    modepaiment: "carte",
  },
  {
    id: "id2",
    datecmd: new Date("December 17, 1995 03:24:00"),
    datedmd: new Date("December 17, 1995 03:24:00"),
    status: "send",
    from: "userId",
    message: "string",
    modepaiment: "carte",
  },
  {
    id: "id3",
    datecmd: new Date("December 17, 1995 03:24:00"),
    datedmd: new Date("December 17, 1999 03:24:00"),
    status: "send",
    from: "userId",
    message: "string",
    modepaiment: "carte",
  },
  {
    id: "id4",
    datecmd: new Date("December 17, 2020 03:24:00"),
    datedmd: new Date("December 17, 2910 03:24:00"),
    status: "send",
    from: "userId",
    message: "string",
    modepaiment: "carte",
  },
  {
    id: "id4",
    datecmd: new Date("December 17, 2020 03:24:00"),
    datedmd: new Date("December 17, 2910 03:24:00"),
    status: "send",
    from: "userId",
    message: "string",
    modepaiment: "carte",
  },
  {
    id: "id4",
    datecmd: new Date("December 17, 2020 03:24:00"),
    datedmd: new Date("December 17, 2910 03:24:00"),
    status: "send",
    from: "userId",
    message: "string",
    modepaiment: "carte",
  },
  {
    id: "id4",
    datecmd: new Date("December 17, 2020 03:24:00"),
    datedmd: new Date("December 17, 2910 03:24:00"),
    status: "send",
    from: "userId",
    message: "string",
    modepaiment: "carte",
  },
  {
    id: "id4",
    datecmd: new Date("December 17, 2020 03:24:00"),
    datedmd: new Date("December 17, 2910 03:24:00"),
    status: "send",
    from: "userId",
    message: "string",
    modepaiment: "carte",
  },
  {
    id: "id4",
    datecmd: new Date("December 17, 2020 03:24:00"),
    datedmd: new Date("December 17, 2910 03:24:00"),
    status: "send",
    from: "userId",
    message: "string",
    modepaiment: "carte",
  },
  {
    id: "id4",
    datecmd: new Date("December 17, 2020 03:24:00"),
    datedmd: new Date("December 17, 2910 03:24:00"),
    status: "send",
    from: "userId",
    message: "string",
    modepaiment: "carte",
  },
  {
    id: "id4",
    datecmd: new Date("December 17, 2020 03:24:00"),
    datedmd: new Date("December 17, 2910 03:24:00"),
    status: "send",
    from: "userId",
    message: "string",
    modepaiment: "carte",
  },
  {
    id: "id4",
    datecmd: new Date("December 17, 2020 03:24:00"),
    datedmd: new Date("December 17, 2910 03:24:00"),
    status: "send",
    from: "userId",
    message: "string",
    modepaiment: "carte",
  },
  {
    id: "id4",
    datecmd: new Date("December 17, 2020 03:24:00"),
    datedmd: new Date("December 17, 2910 03:24:00"),
    status: "send",
    from: "userId",
    message: "string",
    modepaiment: "carte",
  },
  {
    id: "id4",
    datecmd: new Date("December 17, 2020 03:24:00"),
    datedmd: new Date("December 17, 2910 03:24:00"),
    status: "send",
    from: "userId",
    message: "string",
    modepaiment: "carte",
  },
  {
    id: "id4",
    datecmd: new Date("December 17, 2020 03:24:00"),
    datedmd: new Date("December 17, 2910 03:24:00"),
    status: "send",
    from: "userId",
    message: "string",
    modepaiment: "carte",
  },
  {
    id: "id4",
    datecmd: new Date("December 17, 2020 03:24:00"),
    datedmd: new Date("December 17, 2910 03:24:00"),
    status: "send",
    from: "userId",
    message: "string",
    modepaiment: "carte",
  },
  {
    id: "id4",
    datecmd: new Date("December 17, 2020 03:24:00"),
    datedmd: new Date("December 17, 2910 03:24:00"),
    status: "send",
    from: "userId",
    message: "string",
    modepaiment: "carte",
  },
  {
    id: "id4",
    datecmd: new Date("December 17, 2020 03:24:00"),
    datedmd: new Date("December 17, 2910 03:24:00"),
    status: "send",
    from: "userId",
    message: "string",
    modepaiment: "carte",
  },
  {
    id: "id4",
    datecmd: new Date("December 17, 2020 03:24:00"),
    datedmd: new Date("December 17, 2910 03:24:00"),
    status: "send",
    from: "userId",
    message: "string",
    modepaiment: "carte",
  },
  {
    id: "id4",
    datecmd: new Date("December 17, 2020 03:24:00"),
    datedmd: new Date("December 17, 2910 03:24:00"),
    status: "send",
    from: "userId",
    message: "string",
    modepaiment: "carte",
  },
];

const Demand = () => {
  const [demandonFocus, setdemandonFocus] = useState(INITDEMAND);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [histomodecomplet, sethistomodecomplet] = useState(false);
  const [prev, setprev] = useState([]);
  useEffect(() => {
    setprev(MYDUMMYDEMAND.slice(0, 3));
  }, []);
  const [newdemandmode, setnewdemandMode] = useState(false);
  //see historique
  const histomodecomplethandler = (e) => {
    console.log(`translateY(-${window.innerHeight / 2}px)`);
    sethistomodecomplet((p) => !p);
  };

  const newdemandHandler = () => {
    setnewdemandMode((p) => !p);
  };
  console.log(histomodecomplet);
  //Show infos
  const explichandler = (e) => {
    const date = new Date();
    console.log(date);
    console.log(
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
        "." +
        (date.getMonth() > 8
          ? date.getMonth() + 1
          : "0" + (date.getMonth() + 1)) +
        "." +
        date.getFullYear()
    );
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
  let el;
  useEffect(() => {
    if (histomodecomplet) {
      el = (
        <React.Fragment>
          {MYDUMMYDEMAND.map((demand, index) => {
            if (index < 3) {
              return (
                <React.Fragment key={demand.id + index}>
                  <div className="date">
                    <p>{DatetoStringMinemethod(demand.datecmd)}</p>
                  </div>
                  <div className="status">
                    <p>{demand.status}</p>
                  </div>
                  <div className="interro">
                    <div className="interrogation" onClick={explichandler}>
                      <div className="roundedinter">?</div>
                    </div>
                  </div>
                </React.Fragment>
              );
            }
          })}
        </React.Fragment>
      );
    } else {
      el = (
        <React.Fragment>
          {MYDUMMYDEMAND.map((demand, index) => {
            return (
              <React.Fragment key={demand.id + index}>
                <div className="date">
                  <p>{DatetoStringMinemethod(demand.datecmd)}</p>
                </div>
                <div className="status">
                  <p>{demand.status}</p>
                </div>
                <div className="interro">
                  <div className="interrogation" onClick={explichandler}>
                    <div className="roundedinter">?</div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </React.Fragment>
      );
    }
  }, [histomodecomplet]);

  return (
    <div className="demandhomepage">
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
            ? `translateY(-${window.innerHeight / 2.4}px)`
            : "",
          height: histomodecomplet ? `650px` : "232px",
        }}
      >
        <h2>Prev Demands</h2>
        <div className="table">
          <h3>Date</h3>
          <h3 className="status">Status</h3>
          <h3></h3>
          {!histomodecomplet &&
            prev.map((demand, index) => {
              return (
                <React.Fragment key={demand.id}>
                  <div className="date">
                    <p>{DatetoStringMinemethod(demand.datecmd)}</p>
                  </div>
                  <div className="status">
                    <p>{demand.status}</p>
                  </div>
                  <div className="interro">
                    <div className="interrogation" onClick={explichandler}>
                      <div className="roundedinter">?</div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          {histomodecomplet &&
            MYDUMMYDEMAND.map((demand, index) => {
              return (
                <React.Fragment key={demand.id}>
                  <div className="date">
                    <p>{DatetoStringMinemethod(demand.datecmd)}</p>
                  </div>
                  <div className="status">
                    <p>{demand.status}</p>
                  </div>
                  <div className="interro">
                    <div className="interrogation" onClick={explichandler}>
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
