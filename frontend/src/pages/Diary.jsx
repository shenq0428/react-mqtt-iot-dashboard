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