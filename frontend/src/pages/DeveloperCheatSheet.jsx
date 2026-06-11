function DeveloperCheatSheet() {

  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div>
      <h1 style={{ color: "white" }}>
        DEVELOP Cheatsheet
      </h1>

      <p>23/5/2026 : setup influxdb in aws</p>
      <p>24/5/2026 : setup mqtt mosquitto</p>
      <p>1/6/2026 : done backend login and logout logic but not yet done for css</p>

      <p style={{ color: "yellow" }}>
        Test Accounts
      </p>

      <p style={{ color: "yellow" }}>
        SUPER ADMIN:
        superadmin@novalobster.com
      </p>

      <p style={{ color: "yellow" }}>
        COMPANY ADMIN:
        admin@pikachu.com
      </p>

      <p style={{ color: "yellow" }}>
        COMPANY WORKER:
        pikachu1@pikachu.com
      </p>

    </div>
  );
}

export default DeveloperCheatSheet;