import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createLeaveRequest } from "../services/leaveRequestService";

function LeaveRequestCreate() {

    const [leaveType, setLeaveType] = useState("");
    const [otherLeaveType, setOtherLeaveType] = useState("");

    const [startDate, setStartDate] = useState("");

    const [endDate, setEndDate] = useState("");

    const [reason, setReason] = useState("");

    const [emergencyContact, setEmergencyContact] = useState("");

    const [attachment, setAttachment] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async () => {

        try {

            if (!leaveType) {
                alert("Please select a leave type.");
                return;
            }

            if (!startDate || !endDate) {
                alert("Please select the leave dates.");
                return;
            }

            if (new Date(startDate) > new Date(endDate)) {
                alert("End Date cannot be earlier than Start Date.");
                return;
            }

            if (!reason.trim()) {
                alert("Please enter a reason.");
                return;
            }

            await createLeaveRequest({

                leave_type:  leaveType === "Other"
                        ? otherLeaveType
                        : leaveType,

                start_date: startDate,

                end_date: endDate,

                reason

            });

            alert("Leave request submitted successfully!");

            navigate("/leave-requests");

        } catch (err) {

            console.error(err);

            alert("Failed to submit leave request.");

        }

    };

    return (

        <div
            className="
        p-6
        min-h-screen
        text-white
        "
        >

            <div
                className="
            w-full
            "
            >

                <div
                    className="
                flex
                justify-between
                items-center
                mb-8
                "
                >

                    <h1
                        className="
                    text-3xl
                    font-bold
                    "
                    >
                     click here to back ( ←)    Create Request Leave
                    </h1>

                </div>

                <div
                    className="
                bg-[#151515]
                rounded-xl
                border
                border-white-500/20
                p-8
                space-y-8
                "
                >

                    {/* Leave Information */}

                    <div
                        className="
                    bg-[#1a1a1a]
                    p-6
                    rounded-xl
                    "
                    >

                        <h2
                            className="
                        text-xl
                        font-semibold
                        mb-4
                        "
                        >
                            Leave Information
                        </h2>

                        <div
                            className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        gap-4
                        "
                        >

                            <div>

                                <label className="block mb-2">
                                    Leave Type
                                </label>

                                <select
                                    value={leaveType}
                                    onChange={(e) =>
                                        setLeaveType(
                                            e.target.value
                                        )
                                    }
                                    className="
                                w-full
                                p-3
                                rounded-lg
                                bg-[#242424]
                                border
                                border-gray-700
                                "
                                >

                                    <option value="">
                                        Select Leave Type
                                    </option>

                                    <option value="Annual Leave">
                                        Annual Leave
                                    </option>

                                    <option value="Medical Leave">
                                        Medical Leave
                                    </option>

                                    <option value="Emergency Leave">
                                        Emergency Leave
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>

                                </select>
                                {
                                    leaveType === "Other" && (

                                        <div className="mt-4">

                                            <label className="block mb-2">
                                                Other Leave Type
                                            </label>

                                            <input
                                                type="text"
                                                value={otherLeaveType}
                                                onChange={(e) =>
                                                    setOtherLeaveType(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter leave type"
                                                className="
                                                        w-full
                                                        p-3
                                                        rounded-lg
                                                        bg-[#242424]
                                                        border
                                                        border-gray-700
                                                        "
                                            />

                                        </div>

                                    )
                                }
                            </div>

                            <div />

                            <div>

                                <label className="block mb-2">
                                    Start Date
                                </label>

                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) =>
                                        setStartDate(
                                            e.target.value
                                        )
                                    }
                                    className="
                                w-full
                                p-3
                                rounded-lg
                                bg-[#242424]
                                border
                                border-gray-700
                                "
                                />

                            </div>

                            <div>

                                <label className="block mb-2">
                                    End Date
                                </label>

                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) =>
                                        setEndDate(
                                            e.target.value
                                        )
                                    }
                                    className="
                                w-full
                                p-3
                                rounded-lg
                                bg-[#242424]
                                border
                                border-gray-700
                                "
                                />

                            </div>

                        </div>

                    </div>

                    {/* Contact Information */}

                    <div
                        className="
                    bg-[#1a1a1a]
                    p-6
                    rounded-xl
                    "
                    >

                        <h2
                            className="
                        text-xl
                        font-semibold
                        mb-4
                        "
                        >
                            Contact Information
                        </h2>

                        <label className="block mb-2">
                            Emergency Contact
                        </label>

                        <input
                            type="text"
                            value={emergencyContact}
                            onChange={(e) =>
                                setEmergencyContact(
                                    e.target.value
                                )
                            }
                            placeholder="0123456789"
                            className="
                        w-full
                        p-3
                        rounded-lg
                        bg-[#242424]
                        border
                        border-gray-700
                        "
                        />

                    </div>

                    {/* Reason */}

                    <div
                        className="
                    bg-[#1a1a1a]
                    p-6
                    rounded-xl
                    "
                    >

                        <h2
                            className="
                        text-xl
                        font-semibold
                        mb-4
                        "
                        >
                            Reason
                        </h2>

                        <textarea
                            rows="6"
                            value={reason}
                            onChange={(e) =>
                                setReason(
                                    e.target.value
                                )
                            }
                            placeholder="Please provide a reason..."
                            className="
                        w-full
                        p-3
                        rounded-lg
                        bg-[#242424]
                        border
                        border-gray-700
                        "
                        />

                    </div>

                    {/* Attachment */}

                    <div
                        className="
                    bg-[#1a1a1a]
                    p-6
                    rounded-xl
                    "
                    >

                        <h2
                            className="
                        text-xl
                        font-semibold
                        mb-4
                        "
                        >
                            Supporting Documents
                        </h2>

                        <input
                            type="file"
                            onChange={(e) =>
                                setAttachment(
                                    e.target.files[0]
                                )
                            }
                            className="
                        w-full
                        p-3
                        rounded-lg
                        bg-[#242424]
                        border
                        border-gray-700
                        "
                        />

                        {

                            attachment && (

                                <p
                                    className="
                                mt-4
                                text-cyan-400
                                "
                                >
                                    Selected File:
                                    {" "}
                                    {attachment.name}
                                </p>

                            )

                        }

                    </div>

                    {/* Buttons */}

                    <div
                        className="
                    flex
                    justify-between
                    items-center
                    "
                    >

                        <button
                            className="
                        px-6
                        py-3
                        rounded-lg

                        bg-red-700

                        hover:bg-red-600
                        "
                            onClick={() =>
                                navigate(
                                    "/leave-requests"
                                )
                            }
                        >
                            Return
                        </button>

                        <button
                            className="
                        px-6
                        py-3
                        rounded-lg

                        bg-cyan-500/20

                        border
                        border-cyan-500/30

                        hover:bg-cyan-500/30
                        "
                            onClick={handleSubmit}
                        >
                            Submit Leave Request
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default LeaveRequestCreate;