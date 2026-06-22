import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import {getCompanyById} from "../services/companyService";

function CompanyDetails() {
const [company, setCompany] = useState(null);

    const { id } = useParams();

    useEffect(() => {
        const loadCompany = async () => {
        
            try {
                const data = await getCompanyById(id);
                setCompany(data);
                console.log(data);
            } catch (err) {
                console.error(err);
            }
        
        };
        
          loadCompany();
}, [id]);

    if (!company) {
        return <h2>Loading...</h2>;
    }

    return (
        <>
            <h1>Company Details</h1>
            <p>Company ID: {id}</p>
            <table>
                <thead>
                    <tr>
                        <th>Company ID</th>
                        <th>Company Name</th>
                        <th>Total User</th>
                        <th>Created At</th>
                        <th>Company Email</th>
                        <th>Company Phone</th>
                        <th>Registration Number</th>
                        <th>Company Address</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>

                        <tr key={company.id}>
                            <td>{company.id}</td>
                            <td>{company.company_name}</td>
                            <td>{company.total_users}</td>
                            <td>{company.created_at}</td>
                            <td>{company.company_email}</td>
                            <td>{company.company_phone}</td>
                            <td>{company.registration_number}</td>
                            <td>{company.company_address}</td>
                            <td>{company.status}</td>
                        </tr>

                </tbody>
            </table>
            <h2 classname="color:white">view all user → link to usermanagement with filter companyId=x </h2>
        </>
    );
}

export default CompanyDetails;