import { useParams } from "react-router-dom";

function CompanyDetails() {

    const { id } = useParams();

    return (
        <>
            <h1>Company Details</h1>
            <p>Company ID: {id}</p>
        </>
    );
}

export default CompanyDetails;