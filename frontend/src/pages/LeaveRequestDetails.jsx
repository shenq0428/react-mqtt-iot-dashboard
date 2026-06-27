import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getLeaveRequestById, updateLeaveRequest} from "../services/leaveRequestService";

function LeaveRequestDetails() {

    const { id } = useParams();

    const [leave, setLeave] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [updating, setUpdating] = useState(false);
const [actionError, setActionError] = useState("");
const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {

        const fetchLeaveRequest = async () => {

            try {

                setLoading(true);
                setError("");

                const leaveRequest = await getLeaveRequestById(id);

                setLeave(leaveRequest);

            } catch (err) {

                console.error("Failed to fetch leave request:", err);

                setError(err.response?.data?.message || "Failed to load leave request.");

            } finally {

                setLoading(false);

            }

        };

        fetchLeaveRequest();

    }, [id]);

    const handleChange = (event) => {

        const { name, value } = event.target;

        setLeave((currentLeave) => ({
            ...currentLeave,
            [name]: value
        }));

    };

    const handleUpdate = async () => {

    try {

        setUpdating(true);
        setActionError("");
        setSuccessMessage("");

        const response = await updateLeaveRequest(
            id,
            {
                leave_type: leave.leave_type,
                start_date: getDateInputValue(leave.start_date),
                end_date: getDateInputValue(leave.end_date),
                reason: leave.reason
            }
        );

        setLeave(response.leaveRequest);

        setSuccessMessage(
            response.message ||
            "Leave request updated successfully."
        );

    } catch (err) {

        console.error("Failed to update leave request:", err);

        setActionError(
            err.response?.data?.message ||
            "Failed to update leave request."
        );

    } finally {

        setUpdating(false);

    }

};

    const formatDate = (dateValue) => {

        if (!dateValue) { return "-"; }

        return new Intl.DateTimeFormat(
            "en-MY",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        ).format(new Date(dateValue));

    };

    const formatDateTime = (dateValue) => {

        if (!dateValue) { return "-"; }

        return new Intl.DateTimeFormat(
            "en-MY",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        ).format(new Date(dateValue));

    };

    const getDateInputValue = (dateValue) => {

        if (!dateValue) { return ""; }

        return dateValue.substring(0, 10);

    };

    if (loading) {

        return (

            <div className="p-8 text-white">

                Loading leave request...

            </div>

        );

    }

    if (error) {

        return (

            <div className="p-8">

                <Link
                    to="/leave-requests"
                    className="text-gray-400 hover:text-white transition"
                >
                    ← Back
                </Link>

                <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">

                    {error}

                </div>

            </div>

        );

    }

    if (!leave) {

        return null;

    }

    const isEditable = leave.status === "pending";

    const statusStyles = {

        pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",

        approved: "bg-green-500/20 text-green-400 border-green-500/30",

        rejected: "bg-red-500/20 text-red-400 border-red-500/30",

        cancelled: "bg-gray-500/20 text-gray-300 border-gray-500/30"

    };

    const statusClass = statusStyles[leave.status] || statusStyles.pending;

    return (

        <div className="max-w-5xl mx-auto p-8">

            {/* Header */}
            <div className="mb-8">

                <Link
                    to="/leave-requests"
                    className="text-gray-400 hover:text-white transition"
                >
                    ← Back
                </Link>

                <h1 className="text-3xl font-bold text-white mt-3">

                    Leave Request Details

                </h1>

                <p className="text-gray-400 mt-2">

                    Manage your leave application and track its approval status.

                </p>

            </div>

            {/* Summary Card */}
            <div
                className="
                    bg-[#1B1F2B]
                    border
                    border-gray-700
                    hover:border-blue-500/40
                    transition
                    duration-300
                    rounded-2xl
                    shadow-lg
                    shadow-black/20
                    p-6
                    mb-8
                "
            >

                <div className="mb-6">

                    <span
                        className={`
                            inline-flex
                            items-center
                            px-4
                            py-2
                            rounded-full
                            border
                            font-medium
                            capitalize
                            ${statusClass}
                        `}
                    >
                        {leave.status}

                    </span>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">

                    <div>

                        <p className="text-gray-400 text-sm">

                            Request Number

                        </p>

                        <p className="text-white font-semibold mt-1">

                            {leave.request_number}

                        </p>

                    </div>

                    <div>

                        <p className="text-gray-400 text-sm">

                            Submitted At

                        </p>

                        <p className="text-white font-semibold mt-1">

                            {formatDateTime(leave.created_at)}

                        </p>

                    </div>

                </div>

            </div>

            {/* Leave Information */}
            <div
                className="
                    bg-[#1B1F2B]
                    border
                    border-gray-700
                    hover:border-blue-500/40
                    transition
                    duration-300
                    rounded-2xl
                    shadow-lg
                    shadow-black/20
                    p-6
                "
            >

                <h2 className="text-xl font-semibold text-white mb-8">

                    Leave Information

                </h2>

                <div className="space-y-6">

                    <div>

                        <label className="block text-gray-400 text-sm mb-2">

                            Leave Type

                        </label>

                        <select
                            name="leave_type"
                            value={leave.leave_type || ""}
                            onChange={handleChange}
                            disabled={!isEditable}
                            className="
                                w-full
                                rounded-xl
                                bg-[#252B3B]
                                border
                                border-gray-600
                                p-3
                                text-white
                                disabled:cursor-not-allowed
                                disabled:opacity-70
                            "
                        >
                            <option value="Annual Leave">
                                Annual Leave
                            </option>

                            <option value="Medical Leave">
                                Medical Leave
                            </option>

                            <option value="Emergency Leave">
                                Emergency Leave
                            </option>

                            <option value="Unpaid Leave">
                                Unpaid Leave
                            </option>
                        </select>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                        <div>

                            <label className="block text-gray-400 text-sm mb-2">

                                Start Date

                            </label>

                            <input
                                type="date"
                                name="start_date"
                                value={getDateInputValue(leave.start_date)}
                                onChange={handleChange}
                                disabled={!isEditable}
                                className="
                                    w-full
                                    rounded-xl
                                    bg-[#252B3B]
                                    border
                                    border-gray-600
                                    p-3
                                    text-white
                                    disabled:cursor-not-allowed
                                    disabled:opacity-70
                                "
                            />

                        </div>

                        <div>

                            <label className="block text-gray-400 text-sm mb-2">

                                End Date

                            </label>

                            <input
                                type="date"
                                name="end_date"
                                value={getDateInputValue(leave.end_date)}
                                onChange={handleChange}
                                disabled={!isEditable}
                                className="
                                    w-full
                                    rounded-xl
                                    bg-[#252B3B]
                                    border
                                    border-gray-600
                                    p-3
                                    text-white
                                    disabled:cursor-not-allowed
                                    disabled:opacity-70
                                "
                            />

                        </div>

                    </div>

                    <div>

                        <label className="block text-gray-400 text-sm mb-2">

                            Reason

                        </label>

                        <textarea
                            rows={6}
                            name="reason"
                            value={leave.reason || ""}
                            onChange={handleChange}
                            disabled={!isEditable}
                            className="
                                w-full
                                rounded-xl
                                bg-[#252B3B]
                                border
                                border-gray-600
                                p-3
                                text-white
                                resize-none
                                disabled:cursor-not-allowed
                                disabled:opacity-70
                            "
                        />

                    </div>

                </div>

            </div>

            {/* Approval Information */}
            {(leave.status === "approved" ||
                leave.status === "rejected") && (

                    <div
                        className="
                        mt-8
                        bg-[#1B1F2B]
                        border
                        border-gray-700
                        rounded-2xl
                        shadow-lg
                        shadow-black/20
                        p-6
                    "
                    >

                        <h2 className="text-xl font-semibold text-white mb-6">

                            Approval Information

                        </h2>

                        <div className="space-y-5">

                            <div>

                                <p className="text-gray-400 text-sm">

                                    Decision

                                </p>

                                <p className="text-white capitalize mt-1">

                                    {leave.status}

                                </p>

                            </div>

                            <div>

                                <p className="text-gray-400 text-sm">

                                    Processed At

                                </p>

                                <p className="text-white mt-1">

                                    {formatDateTime(leave.approved_at)}

                                </p>

                            </div>

                            {leave.status === "rejected" && (

                                <div>

                                    <p className="text-gray-400 text-sm">

                                        Rejection Reason

                                    </p>

                                    <p className="text-white mt-1">

                                        {leave.rejected_reason || "-"}

                                    </p>

                                </div>

                            )}

                        </div>

                    </div>

                )}

            {/* Activity Timeline */}
            <div
                className="
                    mt-8
                    bg-[#1B1F2B]
                    border
                    border-gray-700
                    rounded-2xl
                    shadow-lg
                    shadow-black/20
                    p-6
                "
            >

                <h2 className="text-xl font-semibold text-white mb-6">

                    Activity Timeline

                </h2>

                <div className="space-y-6">

                    <div>

                        <p className="text-white font-medium">

                            Leave Request Submitted

                        </p>

                        <p className="text-gray-400 text-sm mt-1">

                            {formatDateTime(leave.created_at)}

                        </p>

                    </div>

                    {leave.status === "pending" && (

                        <div>

                            <p className="text-yellow-400 font-medium">

                                Waiting for Approval

                            </p>

                            <p className="text-gray-400 text-sm mt-1">

                                Pending company administrator review

                            </p>

                        </div>

                    )}

                    {leave.status === "approved" && (

                        <div>

                            <p className="text-green-400 font-medium">

                                Leave Request Approved

                            </p>

                            <p className="text-gray-400 text-sm mt-1">

                                {formatDateTime(leave.approved_at)}

                            </p>

                        </div>

                    )}

                    {leave.status === "rejected" && (

                        <div>

                            <p className="text-red-400 font-medium">

                                Leave Request Rejected

                            </p>

                            <p className="text-gray-400 text-sm mt-1">

                                {leave.rejected_reason || "No reason provided"}

                            </p>

                        </div>

                    )}

                    {leave.status === "cancelled" && (

                        <div>

                            <p className="text-gray-300 font-medium">

                                Leave Request Cancelled

                            </p>

                            <p className="text-gray-400 text-sm mt-1">

                                {formatDateTime(leave.cancelled_at)}

                            </p>

                        </div>

                    )}

                </div>

            </div>
                    
                    {actionError && (

    <div className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-300">

        {actionError}

    </div>

)}

{successMessage && (

    <div className="mt-8 rounded-xl border border-green-500/30 bg-green-500/10 px-5 py-4 text-green-300">

        {successMessage}

    </div>

)}

            {/* Actions: API endpoints are not implemented yet */}
            {isEditable && (

                <div className="flex justify-end gap-4 mt-8">

                    <button
                        type="button"
                        disabled
                        className="
                            px-6
                            py-3
                            rounded-xl
                            bg-red-500/20
                            text-red-400
                            opacity-50
                            cursor-not-allowed
                        "
                    >
                        Cancel Request
                    </button>

                    <button
    type="button"
    onClick={handleUpdate}
    disabled={updating}
    className="
        px-6
        py-3
        rounded-xl
        bg-blue-600
        hover:bg-blue-700
        transition
        text-white
        disabled:cursor-not-allowed
        disabled:opacity-50
    "
>
    {updating
        ? "Updating..."
        : "Update Request"}
</button>

                </div>

            )}

        </div>

    );

}

export default LeaveRequestDetails;