import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCompanyById, updateCompany, deleteCompany } from "../services/companyService";
import { Navigate } from "react-router-dom";

function CompanyDetails() {
    const [company, setCompany] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [showEditPanel, setShowEditPanel] = useState(false);
    const [editedCompany, setEditedCompany] = useState({});
    const [error, setError] = useState("");
    const [toast, setToast] = useState({ message: "", type: "" });
    const { id } = useParams();
    const [deleteText, setDeleteText] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showStatusConfirm, setShowStatusConfirm]= useState(false);
    const navigate = useNavigate();

    const loadCompany = async () => {
        try {
            const data = await getCompanyById(id);
            setCompany(data);
            setEditedCompany(data)
            console.log(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadCompany();
    }, [id]);

    if (!company) {
        return <h2>Loading...</h2>;
    }

    const handleUpdateCompany = async () => {

        try {

            await updateCompany(
                company.id,
                editedCompany
            );
            await loadCompany();
            setShowEditPanel(false);
            setEditMode(false);

            setToast({
                message: "😋Company Updated Successfully",
                type: "success"
            });
            setTimeout(() => {
                setToast({
                    message: "",
                    type: ""
                });
            }, 3000);

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message);
        }

    };

    const handleDeleteCompany = async () => {

        try {

            await deleteCompany(company.id);

            setToast({
                message: "Company Deleted Successfully",
                type: "delete"
            });

            setTimeout(() => {
                setToast({
                    message: "",
                    type: ""
                });
                navigate(
                    "/company-management"
                );
            }, 1500);

        } catch (err) {

            console.error(err);

        }

    };

    const handleToggleStatus = async () => {

        try {

            await updateCompany(
                company.id,
                {
                    status:
                        company.status === "active"
                            ? "inactive"
                            : "active"
                }
            );

            await loadCompany();

            setToast({
                message:
                    company.status === "active"
                        ? "Company Deactivated"
                        : "Company Activated",
                type: "warning"
            });

            setTimeout(() => {

                setToast({
                    message: "",
                    type: ""
                });

            }, 3000);

        } catch (err) {

            console.error(err);

        }

    };

    return (
        <div
            className="
                        p-6
                        text-white
                        min-h-screen

                        bg-[#1a1a1a]
                    "
        >
            {
                toast.message && (

                    <div
                        className={`
                                    toast

                            ${toast.type === "success"
                                ? "bg-green-600"

                                : toast.type === "delete"
                                    ? "bg-red-600"

                                    : toast.type === "error"
                                        ? "bg-red-500"

                                        : toast.type === "warning"
                                            ? "bg-yellow-600"

                                            : "bg-yellow-500"

                            }
                                    `}
                    >

                        {toast.message}

                    </div>

                )
            }
            {/* Header */}

            <div className="mb-8">

                <h1 className="
    text-4xl

    font-bold

    text-white

    tracking-wide
">
                    Company Details
                </h1>

                <p className="text-gray-400 mt-2">
                    Company ID: {company.id}
                </p>

            </div>

            {/* Top Section */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Company Information */}

                <div
                    className="
                lg:col-span-2

                bg-[rgba(79,30,156,.45)]
                backdrop-blur-sm

                rounded-xl
                p-6

                border border-cyan-500/20

                shadow-[0_0_10px_rgba(0,255,255,.08)]

                hover:shadow-[0_0_20px_rgba(0,255,255,.15)]

                transition-all
                duration-300
            "
                >

                    <div className="flex justify-between items-center mb-6">

                        <h2 className="text-cyan-300 text-xl font-semibold">
                            Company Information
                        </h2>

                        <button
                            className="
                        px-4
                        py-2

                        rounded-lg

                        border border-cyan-500/30

                        bg-cyan-500/10

                        text-cyan-300

                        hover:bg-cyan-500/20
                        hover:text-white

                        transition-all
                        duration-200
                    "
                            onClick={() => { setEditMode(!editMode); setShowEditPanel(!showEditPanel); }}>
                            {editMode ? "Editing ..." : "Edit Company"}
                        </button>

                        <button

    className={`
        px-4
        py-2

        rounded-lg

        transition-all

        ${
            company.status === "active"

                ? `
                border border-yellow-500/30
                bg-yellow-500/10
                text-yellow-400
                hover:bg-yellow-500/20
                `

                : `
                border border-green-500/30
                bg-green-500/10
                text-green-400
                hover:bg-green-500/20
                `
        }
    `}

    onClick={() =>setShowStatusConfirm(true)}

>

    {
        company.status === "active"
            ? "Deactivate Company"
            : "Activate Company"
    }

</button>

                        <button

                            className="
                                        px-4
                                        py-2

                                        rounded-lg

                                        border
                                        border-red-500/30

                                        bg-red-500/10

                                        text-red-400

                                        hover:bg-red-500/20
                                    "

                            onClick={() =>
                                setShowDeleteConfirm(true)
                            }

                        >
                            Delete Company
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <div>
                            <p className="text-gray-400">Company Name</p>
                            <p>{company.company_name}</p>
                        </div>

                        <div>
                            <p className="text-gray-400">Email</p>
                            <p>{company.company_email}</p>
                        </div>

                        <div>
                            <p className="text-gray-400">Phone</p>
                            <p>{company.company_phone}</p>
                        </div>

                        <div>
                            <p className="text-gray-400">Registration Number</p>
                            <p>{company.registration_number}</p>
                        </div>

                        <div className="md:col-span-2">
                            <p className="text-gray-400">Address</p>
                            <p>{company.company_address}</p>
                        </div>

                        <div>
                            <p className="text-gray-400">Status</p>
                            <p>{company.status}</p>
                        </div>

                        <div>
                            <p className="text-gray-400">Created At</p>
                            <p>{company.created_at}</p>
                        </div>

                    </div>

                </div>

                {/* Statistics */}

                <div
                    className="
                bg-[rgba(79,30,156,.45)]
                backdrop-blur-sm

                rounded-xl
                p-6

                border border-cyan-500/20

                shadow-[0_0_10px_rgba(0,255,255,.08)]

                hover:shadow-[0_0_20px_rgba(0,255,255,.15)]

                transition-all
                duration-300
            "
                >

                    <h2 className="text-cyan-300 text-xl font-semibold mb-6">
                        Statistics
                    </h2>

                    <div className="space-y-6">

                        <div>
                            <p className="text-gray-400">
                                Total Users
                            </p>

                            <p className="text-3xl font-bold text-cyan-300">
                                {company.total_users}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-400">
                                IoT Devices
                            </p>

                            <p className="text-3xl font-bold text-cyan-300">
                                0
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-400">
                                MQTT Topics
                            </p>

                            <p className="text-3xl font-bold text-cyan-300">
                                0
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-400">
                                Active Alarms
                            </p>

                            <p className="text-3xl font-bold text-cyan-300">
                                0
                            </p>
                        </div>

                    </div>

                </div>

            </div>

            {/* Subscription */}

            <div className="mt-6 card">

                <h2 className="text-cyan-300 text-xl font-semibold mb-6">
                    Subscription Plan
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div>
                        <p className="text-gray-400">Plan</p>
                        <p>Premium</p>
                    </div>

                    <div>
                        <p className="text-gray-400">Start Date</p>
                        <p>2026-01-01</p>
                    </div>

                    <div>
                        <p className="text-gray-400">End Date</p>
                        <p>2026-12-31</p>
                    </div>

                </div>

            </div>

            {/* Devices */}

            <div className="mt-6 card">

                <div className="flex justify-between items-center">

                    <h2 className="text-cyan-300 text-xl font-semibold">
                        IoT Devices
                    </h2>

                    <span className="text-gray-400">
                        Total Devices: 0
                    </span>

                </div>

                <div className="mt-6">

                    <p className="text-gray-500">
                        No devices assigned.
                    </p>

                </div>

            </div>

            {/* MQTT Topics */}

            <div className="mt-6 card">

                <h2 className="text-cyan-300 text-xl font-semibold mb-6">
                    MQTT Topics
                </h2>

                <ul className="space-y-3">

                    <li>novalobster/demo/device01</li>
                    <li>novalobster/demo/device02</li>
                    <li>novalobster/demo/device03</li>

                </ul>

            </div>

            {/* Users */}

            <div className="mt-6 card">

                <div className="flex justify-between items-center">

                    <h2 className="text-cyan-300 text-xl font-semibold">
                        Company Users
                    </h2>

                    <span>
                        Total Users: {company.total_users}
                    </span>

                </div>

                <div className="mt-6">

                    <button
                        className="
                    px-4
                    py-2

                    rounded-lg

                    border border-cyan-500/30

                    bg-cyan-500/10

                    text-cyan-300

                    hover:bg-cyan-500/20

                    transition-all
                    duration-200
                "
                onClick={() =>
        navigate(
            `/user-management?companyId=${company.id}`
        )
    }
                    >
                        View Users →
                    </button>

                </div>

            </div>
            {
                showEditPanel && (

                    <div className="create_company_panel">

                        <div className="panel_header">

                            <h2>Edit Company</h2>

                            <button
                                onClick={() => { setShowEditPanel(false); setEditMode(!editMode); }
                                }
                            >
                                ✕
                            </button>

                        </div>

                        {error && (
                            <div className="error_message">
                                {error}
                            </div>
                        )}

                        <label>
                            Company Name
                        </label>

                        <input
                            type="text"

                            value={
                                editedCompany.company_name || ""
                            }

                            onChange={(e) =>

                                setEditedCompany({

                                    ...editedCompany,

                                    company_name:
                                        e.target.value

                                })

                            }
                        />

                        <label>
                            Company Email
                        </label>

                        <input
                            type="email"

                            value={
                                editedCompany.company_email || ""
                            }

                            onChange={(e) =>

                                setEditedCompany({

                                    ...editedCompany,

                                    company_email:
                                        e.target.value

                                })

                            }
                        />

                        <label>
                            Company Phone
                        </label>

                        <input
                            type="text"

                            value={
                                editedCompany.company_phone || ""
                            }

                            onChange={(e) =>

                                setEditedCompany({

                                    ...editedCompany,

                                    company_phone:
                                        e.target.value

                                })

                            }
                        />

                        <label>
                            Company Address
                        </label>

                        <input
                            type="text"

                            value={
                                editedCompany.company_address || ""
                            }

                            onChange={(e) =>

                                setEditedCompany({

                                    ...editedCompany,

                                    company_address:
                                        e.target.value

                                })

                            }
                        />

                        <label>
                            Registration Number
                        </label>

                        <input
                            type="text"

                            value={
                                editedCompany.registration_number || ""
                            }

                            onChange={(e) =>

                                setEditedCompany({

                                    ...editedCompany,

                                    registration_number:
                                        e.target.value

                                })

                            }
                        />

                        <button
                            className="create_submit_btn"
                            onClick={handleUpdateCompany}
                        >
                            Save Changes
                        </button>

                    </div>

                )
            }
            {
                showDeleteConfirm && (

                    <div
                        className="
                                fixed
                                inset-0

                                bg-black/70

                                flex
                                items-center
                                justify-center

                                z-[9999]
                                "
                    >

                        <div
                            className="
                                        bg-[#262626]

                                        rounded-xl

                                        p-6

                                        w-[500px]

                                        border
                                        border-red-500/20
                                        "
                        >

                            <h2 className="text-red-400 text-xl font-bold">

                                Delete Company

                            </h2>

                            <p className="mt-4 text-gray-300">

                                This action cannot be undone.

                            </p>

                            <p className="mt-2 text-gray-300">

                                To confirm deletion, please type the company name:

                            </p>

                            <strong
                                className="text-red-400"
                            >
                                {company.company_name}
                            </strong>

                            <input

                                className="
                                            w-full
                                            mt-4
                                            p-3
                                            rounded-lg
                                            bg-[#1a1a1a]
                                            border
                                            border-gray-600
                                            text-white
                                            "
                                value={deleteText}

                                onChange={(e) =>
                                    setDeleteText(e.target.value)
                                }

                            />

                            <div
                                className=" flex justify-end gap-3 mt-6"
                            >

                                <button

                                    onClick={() => {

                                        setShowDeleteConfirm(false);

                                        setDeleteText("");

                                    }}

                                >

                                    Cancel

                                </button>

                                <button

                                    disabled={
                                        deleteText !==
                                        company.company_name
                                    }

                                    onClick={
                                        handleDeleteCompany
                                    }

                                    className={`px-4 py-2 rounded-lg
                                        ${deleteText ===
                                            company.company_name
                                            ? "bg-red-600 text-white"
                                            : "bg-gray-600 text-gray-300 cursor-not-allowed"
                                        }
                                            `}

                                >

                                    Delete

                                </button>

                            </div>

                        </div>

                    </div>

                )
            }
            {
showStatusConfirm && (

<div
    className="
    fixed
    inset-0

    bg-black/70

    flex
    items-center
    justify-center

    z-[9999]
"
>

    <div
        className="
        bg-[#262626]

        rounded-xl

        p-6

        w-[450px]

        border
        border-yellow-500/20
    "
    >

        <h2
            className="
            text-yellow-400

            text-xl

            font-bold
        "
        >

            {
                company.status === "active"
                ? "Deactivate Company"
                : "Activate Company"
            }

        </h2>

        <p className="mt-4 text-gray-300">

            Are you sure you want to

            <strong
                className="
                
                ml-1
            "
            >

                {
                    company.status === "active"
                    ? "deactivate "
                    : "activate "
                }

            </strong>

            this company?

        </p>

        <p
            className="
            mt-4

            text-yellow-400

            font-semibold
        "
        >

            {company.company_name}

        </p>

        <div
            className="
            flex
            justify-end

            gap-3

            mt-6
        "
        >

            <button

                className="
                px-4
                py-2

                rounded-lg

                bg-gray-700

                hover:bg-gray-600
            "

                onClick={() =>
                    setShowStatusConfirm(false)
                }
            >

                No

            </button>

            <button

                className="
                px-4
                py-2

                rounded-lg

                bg-yellow-600

                hover:bg-yellow-500

                text-white
            "

                onClick={async () => {

                    await handleToggleStatus();

                    setShowStatusConfirm(false);

                }}

            >

                Yes

            </button>

        </div>

    </div>

</div>

)
}
        </div>

    );
}

export default CompanyDetails;