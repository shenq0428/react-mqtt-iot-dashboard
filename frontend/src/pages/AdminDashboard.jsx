import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardService";
import { formatDistanceToNow } from "date-fns";

function AdminDashboard() {

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCompanies: 0,
        todayLogins: 0,
        onlineUsers: 9,
        lastLoginUser: "",
        lastLoginTime: "",
    });


    useEffect(() => {

        const loadStats = async () => {
            try {

                const data = await getDashboardStats();
                // close console after done
                console.log("Dashboard Stats:", data);

                setStats(prev => ({ ...prev, ...data, }));

            } catch (err) {

                console.error("Failed to load dashboard stats:", err);

            }
        };

        loadStats();

    }, []);

    return (
        <div className="min-h-screen bg-slate-50 p-4">

            <div className="mb-8">
                <p className="text-slate-500">
                    System overview and statistics
                </p>
            </div>

            <div className="grid grid-cols-4 gap-3">

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

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm col-span-2">

                    <div className="flex items-center justify-between">

                        <div className="flex gap-4">

                            {/* Icon */}
                            <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center text-purple-500 text-2xl">
                                🕒
                            </div>

                            {/* Login Info */}
                            <div>

                                <p className="text-slate-500 text-sm">
                                    Last Login
                                </p>

                                <h3 className="text-slate-900 font-semibold text-xl">
                                    {stats.lastLoginUser}
                                </h3>

                                <p className="text-slate-500 text-sm mt-1">
                                    {stats.lastLoginTime &&
                                        new Date(stats.lastLoginTime).toLocaleString("en-MY", { 
                                            day: "numeric", month: "short", year: "numeric", 
                                            hour: "2-digit", minute: "2-digit", 
                                            })}
                                </p>

                            </div>

                        </div>

                        {/* Badge */}
                        <div className="   bg-green-100   text-green-700   text-sm    font-medium    px-3    py-1    rounded-lg    ">
                            {stats.lastLoginTime && formatDistanceToNow(new Date(stats.lastLoginTime), { addSuffix: true })}
                        </div>

                    </div>

                </div>
            </div>

        </div>
    );
}

export default AdminDashboard;