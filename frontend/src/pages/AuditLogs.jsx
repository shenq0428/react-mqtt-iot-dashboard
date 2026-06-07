import { useEffect, useState } from "react";
import { getAuditLogs } from "../services/auditService";
import "./AuditLogs.css"
function AuditLogs() {

    const [logs, setLogs] = useState([]);

    useEffect(() => {

        const loadLogs = async () => {

            try {

                const data = await getAuditLogs();

                setLogs(data);

            } catch (error) {

                console.error("Failed to load audit logs:", error);

            }
        };

        loadLogs();

    }, []);

    return (
        <div className="audit_logs_container">

  <h1 className="audit_logs_title">
    Audit Logs
  </h1>
<h3 className="audit_logs_paragraph">
                Add filter button in future,make (ID:XX) become red in description
            </h3>
  <table className="user_table">

    <thead>
      <tr>
        <th>ID</th>
        <th>Actor</th>
        <th>Role</th>
        <th>Action</th>
        <th>Description</th>
        <th>Created At</th>
      </tr>
    </thead>

    <tbody>

      {
        logs.map((log) => (

          <tr key={log.id}>

            <td>{log.id}</td>

            <td>
              {log.actor_username}
            </td>

            <td>
              {log.actor_role}
            </td>

            <td>
              {log.action}
            </td>

            <td>
              {log.description}
            </td>

            <td>
              {
                new Date(
                  log.created_at
                ).toLocaleString()
              }
            </td>

          </tr>

        ))
      }

    </tbody>

  </table>

</div>
    );
}

export default AuditLogs;