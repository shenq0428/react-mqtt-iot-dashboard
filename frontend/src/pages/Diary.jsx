import { useState } from "react";

function Diary() {

  const [note,
    setNote] =
    useState(
      localStorage.getItem(
        "diary"
      ) || ""
    );

  const saveDiary = () => {

    localStorage.setItem(
      "diary",
      note
    );

    alert(
      "Diary Saved"
    );
  };

  return (

    <div>

      <h1>
        <p style={{ color: "yellow" }}>SuperAdmin Diary</p>

      </h1>

      <p>23/5/2026 :setup influxdb in aws</p>
      <p>24/5/2026 :setup mqtt mosquitto</p>
      <p>1/6/2026: done backend login and logout logic but not yet done for css,done login and logoutcss.
        2:change the navbar menu into menuConfig and added roles inside to map out according user roles.
        3:change the dashboard into toggle state </p>
      <p>2/6/2026: added protected route component to protect the routes according to user roles, added profile page and added profile link in navbar, 
        added audit logs page and user management page and company management page and add diary page and only superadmin can access the diary page.</p>
      
      <textarea
        rows="10"
        cols="50"
        value={note}
        onChange={(e) =>
          setNote(
            e.target.value
          )
        }
      />

      <br />

      <button
        onClick={saveDiary}
      >
        Save
      </button>

    </div>

  );
}

export default Diary;