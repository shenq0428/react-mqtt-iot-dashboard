import { useEffect,useState } from "react";
import {getCompanies} from "../services/companyService";
import { useNavigate } from "react-router-dom";

function CompanyManagement() {
  const [companies,setCompanies]=useState([]);
  const navigate = useNavigate();

  useEffect(()=>{
    const loadCompanies = async () => {

    try {
        const data = await getCompanies();
        setCompanies(data);
        console.log(data);
    } catch (err) {
        console.error(err);
    }

};

  loadCompanies();
},[])
  return (
    <>
    <h1 style={{color:"white"}}>Company Management Page</h1>
    <p>Company Overview outside click in will show details like below</p>
     <p>   Company Information
Company Admin
Users In This Company
IoT Devices
MQTT Topics
Subscription Plan ,start date, end date
Company Name
Company Address
Company Email
Company Phone
Created Date
Company Admin
Number Of Users
    </p>
    <p>Company Name, Admin, Users, Status, Action</p>
    <table>

    <thead>

        <tr>
            <th>Company ID</th>
            <th>Company Name</th>

            <th>Email</th>
            <th>Phone</th>
  
            <th>Users</th>

            <th>Status</th>

            <th>Action</th>

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

                    <button onClick={()=> navigate(`/company-management/${company.id}`)}>
                        View
                    </button>

                </td>

            </tr>

        ))}

    </tbody>

</table>
  </>
  )

}

export default CompanyManagement