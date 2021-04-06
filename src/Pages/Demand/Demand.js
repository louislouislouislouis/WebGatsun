import React, { useState, useContext } from "react";
import { useHttpClient } from "../../Hooks/http-hook";
import { AuthContext } from "../../Context/auth-context";
import { NavLink } from "react-router-dom";
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
    datecmd: "6 mars",
    datedmd: "7 date",
    status: "send",
    from: "userId",
    message: "Bonjour je voudrais réservé le studio pour un ",
    modepaiment: "carte",
  },
  {
    id: "id2",
    datecmd: "6 mars",
    datedmd: "7 date",
    status: "send",
    from: "userId",
    message: "string",
    modepaiment: "carte",
  },
  {
    id: "id3",
    datecmd: "6 mars",
    datedmd: "7 date",
    status: "send",
    from: "userId",
    message: "string",
    modepaiment: "carte",
  },
  {
    id: "id4",
    datecmd: "6 mars",
    datedmd: "7 mars",
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
  console.log(auth);

  const entermousehandler = (e) => {
    console.log(e);
    setdemandonFocus(e);
  };

  return (
    <React.Fragment>
      <h1>Mes Commandes</h1>
      <section>
        <h2>Réservations Studio</h2>
        <table>
          <tbody>
            <tr>
              <th>Date de demande</th>
              <th>Statut</th>
            </tr>
            {MYDUMMYDEMAND.map((demand) => {
              return (
                <React.Fragment key={demand.id}>
                  {demandonFocus.id === demand.id && (
                    <div className="AllInfo">
                      <div className="generalInfo">
                        {demandonFocus.status === "send" && (
                          <p>
                            Votre demande nous est parvenu. Nous la traitons
                            actuellement.
                          </p>
                        )}
                      </div>
                      <div className="specificinfo">
                        <ul>
                          <li>Date de commande: {demandonFocus.datecmd}</li>
                          <li>Date de réservation: {demandonFocus.datedmd}</li>
                          <li>Status: {demandonFocus.status}</li>
                          <li>Message: {demandonFocus.message}</li>
                          <li>
                            Moyen de payement: {demandonFocus.modepaiment}
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                  {demandonFocus.id !== demand.id && (
                    <tr className="e" onClick={() => entermousehandler(demand)}>
                      <td>{demand.datecmd}</td>
                      <td>{demand.status}</td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
        <div className="newdemande">
          <NavLink to={"./demand/new"}>Make a new demand</NavLink>
        </div>
      </section>
      <section>
        <h2>Réservations Matérielles</h2>
      </section>
      <div>{MYDUMMYDEMAND[0].id}jj</div>
    </React.Fragment>
  );
};

export default Demand;
