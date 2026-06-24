import { useEffect, useState } from "react";
import { getMyLeaveRequests } from "../services/leaveRequestService";
import { formatDate } from "../utils/dateFormatter";
import { useNavigate } from "react-router-dom";

function LeaveRequests() {

    const [leaveRequests, setLeaveRequests] = useState([]);
    const [leaveType, setLeaveType] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reason, setReason] = useState("");
    const navigate = useNavigate();

    useEffect(() => {

        const loadLeaveRequests =
            async () => {

                try {

                    const data =
                        await getMyLeaveRequests();

                    setLeaveRequests(
                        data
                    );

                } catch (err) {

                    console.error(err);

                }

            };

        loadLeaveRequests();

    }, []);

    return (

        <div className=" p-6 min-h-screen text-white">

            <div
                className="
                flex
                justify-between
                items-center
                mb-6
                "
            >

                <h1
                    className="
                    text-3xl
                    font-bold
                    text-white
                    "
                >
                    Leave Requests
                </h1>

                <button
                    className="
                    px-4
                    py-2
                    rounded-lg

                    bg-cyan-500/20
                    border
                    border-cyan-500/30

                    hover:bg-cyan-500/30
                    "
                    onClick={()=>navigate("/leave-requests/create")}
                >
                    + Request Leave
                </button>

            </div>

            <div
                className="
                bg-[#151515]
                rounded-xl
                border
                border-cyan-500/20
                overflow-hidden
                "
            >

                <table className="w-full">

                    <thead>

                        <tr
                            className="
                            bg-cyan-500/10
                            "
                        >
                            <th className="p-4 text-left">
                                Leave Type
                            </th>

                            <th className="p-4 text-left">
                                Start Date
                            </th>

                            <th className="p-4 text-left">
                                End Date
                            </th>

                            <th className="p-4 text-left">
                                Status
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {leaveRequests.map((leave) => (

                            <tr
                                key={leave.id}
                                className="
                                border-t
                                border-gray-700
                                "
                            >

                                <td className="p-4">
                                    {leave.leave_type}
                                </td>

                                <td className="p-4">
                                    {formatDate(leave.start_date)}
                                </td>

                                <td className="p-4">
                                    {formatDate(leave.end_date)}
                                </td>

                                <td className="p-4">
                                    {
                                        leave.status === "pending" &&
                                        (
                                            <span
                                                className="
                                                px-3 py-1
                                                rounded-full
                                                bg-yellow-500/20
                                                text-yellow-400
                                                "
                                            >
                                                Pending
                                            </span>
                                        )
                                        || leave.status === "approved" &&
                                        (
                                            <span
                                                className="
                                                px-3 py-1
                                                rounded-full
                                                bg-green-500/20
                                                text-green-400
                                                "
                                            >
                                                Approved
                                            </span>
                                        )
                                        || leave.status === "rejected" &&
                                        (
                                            <span
                                                className="
                                                px-3 py-1
                                                rounded-full
                                                bg-red-500/20
                                                text-red-400
                                                "
                                            >
                                                Rejected
                                            </span>
                                        )
                                    }
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>
           
        </div>

    );

}

export default LeaveRequests;