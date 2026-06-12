import { useEffect, useState } from "react";
import { getDashboardStats, getRecentActivities, getRecentLoginActivities } from "../services/dashboardService";
import { formatDistanceToNow } from "date-fns";
import { FaUsers, FaBuilding, FaSignInAlt, FaWifi } from "react-icons/fa";
import { Link } from "react-router-dom";

function AdminDashboard() {

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCompanies: 0,
        todayLogins: 0,
        onlineUsers: "fake",
        lastLoginUser: "",
        lastLoginTime: "",
    });

    const [activities, setActivities] = useState([]);
    const [loginActivities, setLoginActivities] = useState([]);
    const [userGrowth, setUserGrowth] = useState([]);
    const [auditSummary, setAuditSummary] = useState([]);

    useEffect(() => {

        const loadStats = async () => {
            try {

                const data = await getDashboardStats();
                const activityData = await getRecentActivities();
                const loginData = await getRecentLoginActivities();

                setStats(prev => ({ ...prev, ...data, }));
                setActivities(activityData);
                setLoginActivities(loginData);

            } catch (err) {

                console.error("Failed to load dashboard stats:", err);

            }
        };

        loadStats();

    }, []);

    return (
        <div className="min-h-screen bg-slate-50 p-4">

            <div className="mb-8">
                <p className="text-2xl">
                    System overview and statistics
                </p>
            </div>

            <div className="grid grid-cols-4 gap-3">

                {/* Total Users */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">

                    <div className="flex items-start gap-4">

                        <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
                            <FaUsers className="text-blue-600 text-3xl" />
                        </div>

                        <div>
                            <p className="text-slate-700 text-base font-bold">
                                Total Users
                            </p>

                            <h2 className="text-slate-900 text-4xl font-bold mt-1">
                                {stats.totalUsers}
                            </h2>

                            <p className="text-green-600 text-sm font-medium">
                                ↑ 12% vs last 30 days (fake)
                            </p>

                        </div>

                    </div>


                </div>

                {/* Total Companies */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">

                    <div className="flex items-start gap-4">

                        <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center">
                            <FaBuilding className="text-green-600 text-3xl" />
                        </div>

                        <div>

                            <p className="text-slate-700 text-base font-bold">
                                Total Companies
                            </p>

                            <h2 className="text-slate-900 text-4xl font-bold mt-1">
                                {stats.totalCompanies}
                            </h2>

                            <p className="text-green-600 text-sm font-medium">
                                ↑ 8% vs last 30 days (fake)
                            </p>

                        </div>

                    </div>

                </div>

                {/* Today's Logins */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">

                    <div className="flex items-start gap-4">

                        <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center">
                            <FaSignInAlt className="text-amber-600 text-3xl" />
                        </div>

                        <div>

                            <p className="text-slate-700 text-base font-bold">
                                Today's Logins
                            </p>

                            <h2 className="text-slate-900 text-4xl font-bold mt-1">
                                {stats.todayLogins}
                            </h2>

                            <p className="text-green-600 text-sm font-medium">
                                ↑ 20% vs yesterday (fake)
                            </p>

                        </div>

                    </div>

                </div>

                {/* Online Users */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">

                    <div className="flex items-start gap-4">

                        <div className="w-16 h-16 rounded-2xl bg-cyan-100 flex items-center justify-center">
                            <FaWifi className="text-cyan-600 text-3xl" />
                        </div>

                        <div>

                            <p className="text-slate-700 text-base font-bold">
                                Online Users
                            </p>

                            <h2 className="text-slate-900 text-4xl font-bold mt-1">
                                {stats.onlineUsers}
                            </h2>

                            <p className="text-green-600 text-sm font-medium">
                                Currently online (fake)
                            </p>

                        </div>

                    </div>

                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm col-span-1">

                    <div className="flex items-center justify-between">

                        <div className="flex gap-4">

                            {/* Icon */}
                            <div className="w-12 h-12 rounded-xl bg-purple-100 
                            flex items-center justify-center text-purple-500 text-2xl">
                                🕒
                            </div>

                            {/* Login Info */}
                            <div>

                                <p className="text-slate-500 text-sm">
                                    Last Login
                                </p>

                                <h3 className="text-slate-900 font-semibold text-lg">
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
                        <div className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-lg">
                            {stats.lastLoginTime && formatDistanceToNow(new Date(stats.lastLoginTime), { addSuffix: true })}
                        </div>

                    </div>

                </div>

            </div>
            {/* Charts Row */}
            <div className="grid grid-cols-2 gap-4 mt-4">

                <div className="bg-white  border  border-slate-200  rounded-xl  p-5  shadow-sm  h-[350px] ">
                    User Growth
                </div>

                <div className="bg-white   border   border-slate-200   rounded-xl p-5  shadow-sm  h-[350px]">
                    Audit Activity
                </div>

            </div>
            {/* Tables Row */}
            <div className="grid grid-cols-2 gap-4 mt-4">

                {/* Recent Login Activity */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">

                    <h2 className="text-xl font-semibold mb-4">
                        Recent Login Activity
                    </h2>

                    <table className="w-full">

                        <thead>
                            <tr className="text-left border-b">
                                <th>Email</th>
                                <th>IP</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>

                            {loginActivities.map((login) => (

                                <tr
                                    key={login.created_at}
                                    className="border-b"
                                >

                                    <td className="py-3">
                                        {login.email}
                                    </td>

                                    <td>
                                        {login.ip_address}
                                    </td>

                                    <td>

                                        <span
                                            className={
                                                login.action === "LOGIN_SUCCESS"
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }
                                        >
                                            {login.action}
                                        </span>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>
                    <div className="flex justify-center mt-4">

                        <Link to="/audit-logs?filter=login"
                            className="text-blue-600 text-sm font-medium hover:underline">
                            View All Login Activity →
                        </Link>

                    </div>
                </div>

                {/* Recent System Activity */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">

                    <h2 className="text-xl font-semibold mb-4">
                        Recent System Activity
                    </h2>

                    <table className="w-full">

                        <thead>
                            <tr className="text-left border-b">

                                <th className="py-2">
                                    Activity
                                </th>

                                <th>
                                    User
                                </th>

                                <th>
                                    Time
                                </th>

                            </tr>
                        </thead>

                        <tbody>

                            {activities.map((activity) => (

                                <tr
                                    key={activity.created_at}
                                    className="border-b"
                                >

                                    <td className="py-3">
                                        {activity.description}
                                    </td>

                                    <td>
                                        {activity.email}
                                    </td>

                                    <td>
                                        {new Date(activity.created_at)
                                            .toLocaleString(
                                                "en-MY",
                                                {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                }
                                            )}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                    <div className="flex justify-center mt-4">

                        <Link to="/audit-logs"
                            className="text-blue-600 text-sm font-medium hover:underline">
                            View All Audit Logs →
                        </Link>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default AdminDashboard;