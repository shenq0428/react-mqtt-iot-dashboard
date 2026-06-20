import { useEffect, useState } from "react";
import { getAuditLogs } from "../services/auditService";
import "./AuditLogs.css"
import { useSearchParams } from "react-router-dom";
//import { search } from "../../../backend/routes/testRoutes";

function AuditLogs() {


  const actionColors = {
    LOGIN_SUCCESS: "bg-blue-100 text-blue-700",
    LOGIN_FAILED: "bg-red-100 text-red-700",
    DELETE_USER: "bg-red-100 text-red-700",
    UPDATE_USER_STATUS: "bg-yellow-100 text-yellow-700",
    CREATE_USER: "bg-green-100 text-green-700",
    UPDATE_USER: "bg-orange-100 text-orange-700",
    LOGOUT: "bg-slate-100 text-slate-700",
  };

  //读取url
  const [searchParams, setSearchParams] = useSearchParams();
  const [logs, setLogs] = useState([]);

  //filter
  const [selectedAction, setSelectedAction] = useState(searchParams.get("action") || "");
  const [searchEmail, setSearchEmail] = useState(searchParams.get("email") || "");


  //pagination
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const LOGS_PER_PAGE = 20;


  const [totalPages, setTotalPages] = useState(1);
  //side effect to call backend
  useEffect(() => {

    const loadLogs = async () => {

      try {

        const data =
          await getAuditLogs(
            currentPage,
            LOGS_PER_PAGE,
            selectedAction,
            searchEmail
          );

        console.log(data)

        setLogs(data.logs);
        setTotalPages(data.totalPages);

      } catch (error) {
        console.error(error);
      }

    };

    loadLogs();
  }, [currentPage, selectedAction, searchEmail]);

  //负责修正状态 避免 Page 5 of 1 的bug
  useEffect(() => {

    setCurrentPage(1);

  }, [selectedAction, searchEmail]);

  useEffect(() => {

    setSearchParams({
      page: currentPage,
      action: selectedAction,
      email: searchEmail,
    });

  }, [currentPage, selectedAction, searchEmail]);


  return (
    <div className="audit_logs_container">

      <h1 className="audit_logs_title">
        Audit Logs
      </h1>
      <h3 className="audit_logs_paragraph">
        Add filter button in future,make (ID:XX) become red in description
      </h3>
      {/*filter*/}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Search email..."
          value={searchEmail}
          onChange={(e) =>

            setSearchEmail(e.target.value)
          }
          className="border rounded-lg px-3 py-2 w-64"
        />

        <select
          value={selectedAction}
          onChange={(e) => { console.log("Selected:", e.target.value); setSelectedAction(e.target.value) }}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">All Actions</option>
          <option value="LOGIN_SUCCESS">LOGIN_SUCCESS</option>
          <option value="LOGIN_FAILED">LOGIN_FAILED</option>
          <option value="LOGOUT">LOGOUT</option>
          <option value="CREATE_USER">CREATE_USER</option>
          <option value="UPDATE_USER">UPDATE_USER</option>
          <option value="UPDATE_USER_STATUS">UPDATE_USER_STATUS</option>
          <option value="DELETE_USER">DELETE_USER</option>
        </select>

      </div>

      <table className="user_table">

        <thead>
          <tr>
            <th>ID</th>
            <th>Actor Email</th>
            <th>Role</th>
            <th>Company</th>
            <th>Action</th>
            <th>Description</th>
            <th>IP Address</th>
            <th>Created At</th>
          </tr>
        </thead>

        <tbody>

          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.id}</td>

              <td>
                {log.email || "-"}
              </td>

              <td>
                {log.actor_role || "-"}
              </td>

              <td>
                {log.company_name || "-"}
              </td>

              <td>
                <span
                  className={`px-2 py-1 rounded-md font-medium ${actionColors[log.action] ||
                    "bg-slate-100 text-slate-700"
                    }`}
                >
                  {log.action}
                </span>
              </td>

              <td>
                {log.description}
              </td>

              <td>
                {log.ip_address || "-"}
              </td>

              <td>
                {new Date(log.created_at).toLocaleString(
                  "en-MY",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </td>

            </tr>

          ))}

        </tbody>

      </table>
      <div className="flex items-center justify-between mt-4">

        <button
          onClick={() => setCurrentPage(prev => prev - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 border rounded-lg disabled:opacity-50"
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 border rounded-lg disabled:opacity-50"
        >
          Next
        </button>

      </div>
    </div>
  );
}

export default AuditLogs;