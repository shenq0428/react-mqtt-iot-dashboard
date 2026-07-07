import { useEffect, useState } from "react";
import { getCompanies, createCompany} from "../services/companyService";
import { useNavigate } from "react-router-dom";
import './CompanyManagement.css';


function CompanyManagement() {
    const [companies, setCompanies] = useState([]);
    const navigate = useNavigate();
    const [showCreatePanel, setShowCreatePanel] = useState(false);
    const [newCompany, setNewCompany] = useState({
            company_name: "",
    short_name: "",
    company_email: "",
    company_phone: "",
    company_address: "",
    registration_number: "",
    industry: "",
    status: "active"
    });

     const handleCompanyFieldChange = (e) => {
        const { name, value } = e.target;

        setNewCompany((current) => ({
            ...current,
            [name]: value
        }));
    };

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [toast, setToast] = useState("");

    const handleCreateCompany = async () => {
        try {
            setError("");
            setMessage("");
            const result = await createCompany(newCompany);

            setToast("Company Created Successfully");
            setTimeout(() => { setToast(""); }, 3000);

            setMessage(result.message);
            setNewCompany({
                company_name: "",
    short_name: "",
    company_email: "",
    company_phone: "",
    company_address: "",
    registration_number: "",
    industry: "",
    status: "active"
            });
            setShowCreatePanel(false);
            await loadCompanies();

        } catch (err) {
            //frontend validation error display
            setError(err.response?.data?.message || "Something went wrong");
            console.error(err);
        }
    };

    const loadCompanies = async () => {

        try {
            const data = await getCompanies();
            setCompanies(data);
            console.log(data);

        } catch (err) {
            console.error(err);
        }

    };

    useEffect(() => {
        loadCompanies();
    }, [])

    return (
        <div className="company_management_container">

            {/* Toast */}

            {
                toast && (<div className="toast">{toast}</div>)
            }


            <input className="company_search" type="text" placeholder="Search Company..." />

            <div className="company_management_header">

                <div className="company_count">
                    Total Companies: {companies.length}
                </div>

                <button className="create_company_btn" onClick={() => setShowCreatePanel(true)}>
                    Create Company
                </button >


            </div>
            <table className="company_table">

                <thead>

                    <tr>
                        <th>Company ID</th>
                        <th>Company Name</th>

                        <th>Email</th>
                        <th>Phone</th>

                        <th>Users</th>

                        <th>Status</th>

                        <th>Details</th>

                    </tr>

                </thead>

                <tbody>

                    {companies.map((company) => (

                        <tr key={company.id}>
                            <td>{company.id}</td>
                            <td>{company.company_name}</td>

                            <td>{company.company_email}</td>
                            <td>{company.company_phone}</td>

                            <td>{company.total_users}</td>

                            <td>{company.status}</td>

                            <td>

                                <button className="view_button" onClick={() => navigate(`/company-management/${company.id}`)}>
                                    View
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>
            {
                showCreatePanel && (

                    <div className="create_company_panel">

                        <div className="panel_header">

                            <h2>Create Company</h2>

                            <button onClick={() => setShowCreatePanel(false)} >
                                ✕
                            </button>

                        </div>

                        
                        <label>Company Name </label>
<input
    type="text"
    name="company_name"
    value={newCompany.company_name}
    onChange={handleCompanyFieldChange}
/>

<label>Short Name </label>
<input
    type="text"
    name="short_name"
    value={newCompany.short_name}
    onChange={handleCompanyFieldChange}
    placeholder="Example: DEMO"
/>

<label>Company Email</label>
<input
    type="email"
    name="company_email"
    value={newCompany.company_email}
    onChange={handleCompanyFieldChange}
/>

<label>Company Phone</label>
<input
    type="text"
    name="company_phone"
    value={newCompany.company_phone}
    onChange={handleCompanyFieldChange}
/>

<label>Company Address</label>
<input
    type="text"
    name="company_address"
    value={newCompany.company_address}
    onChange={handleCompanyFieldChange}
/>

<label>Registration Number</label>
<input
    type="text"
    name="registration_number"
    value={newCompany.registration_number}
    onChange={handleCompanyFieldChange}
/>

<label>Industry</label>
<input
    type="text"
    name="industry"
    value={newCompany.industry}
    onChange={handleCompanyFieldChange}
    placeholder="Example: Palm Oil Mill"
/>

<button className="create_submit_btn" onClick={handleCreateCompany}>
    Create Company
</button>

{error && <div className="error_message">{error}</div>}
                    </div>
                )}

        </div>
    )

}

export default CompanyManagement