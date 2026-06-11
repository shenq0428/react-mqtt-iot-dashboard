import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardService";

function AdminDashboard() {

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCompanies: 0,
        todayLogins: 0,
        onlineUsers: 9,
    });


    useEffect(() => {

        const loadStats = async () => {
            try {

                const data = await getDashboardStats();

                console.log("Dashboard Stats:", data);

                setStats(prev => ({ ...prev, ...data, }));

            } catch (err) {

                console.error("Failed to load dashboard stats:", err);

            }
        };

        loadStats();

    }, []);

    return (
        <div className="min-h-screen bg-slate-50 p-6">

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">
                    Admin Dashboard
                </h1>

                <p className="text-slate-500">
                    System overview and statistics
                </p>
            </div>

            <div className="grid grid-cols-4 gap-5">

                {/* Total Users */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">

                    <p className="text-slate-500 text-sm font-medium">
                        Total Users
                    </p>

                    <h2 className="text-slate-900 text-4xl font-bold mt-2">
                        {stats.totalUsers}
                    </h2>

                </div>

                {/* Total Companies */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">

                    <p className="text-slate-500 text-sm font-medium">
                        Total Companies
                    </p>

                    <h2 className="text-slate-900 text-4xl font-bold mt-2">
                        {stats.totalCompanies}
                    </h2>

                </div>

                {/* Today's Login */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">

                    <p className="text-slate-500 text-sm font-medium">
                        Today's Logins
                    </p>

                    <h2 className="text-slate-900 text-4xl font-bold mt-2">
                        {stats.todayLogins}
                    </h2>

                </div>

                {/* Online Users */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">

                    <p className="text-slate-500 text-sm font-medium">
                        Online Users
                    </p>

                   <h2 className="text-slate-900 text-4xl font-bold mt-2">
                        {stats.onlineUsers}
                    </h2>

                </div>

            </div>

        </div>
    );
}

export default AdminDashboard;