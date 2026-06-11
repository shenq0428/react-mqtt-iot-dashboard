const pool = require("../config/db");

const getDashboardStatus = async(req,res)=>{
    try{
        const totalUsers = await pool.query("SELECT COUNT(*) FROM users");
        const totalCompanies = await pool.query("SELECT COUNT(*) FROM companies");
        const todayLogin = await pool.query(`SELECT COUNT(*) FROM audit_logs WHERE action = 'LOGIN_SUCCESS' AND DATE(created_at) = CURRENT_DATE`);
        
        res.json({
            totalUsers:Number(totalUsers.rows[0].count),
            totalCompanies:Number(totalCompanies.rows[0].count),
            todayLogin:Number(todayLogin.rows[0].count),
        });
    }catch(err){
        console.error(err);

        res.status(500).json({message:"FAILED TO LOAD DASHBOARD PANEL STATUS",});
    }
};

module.exports= {getDashboardStatus};