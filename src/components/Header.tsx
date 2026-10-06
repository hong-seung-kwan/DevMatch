import { NavLink } from "react-router-dom";

function Header() {
    return (
        <header className="border-b">
            <div className="flex gap-4 items-center px-6 py-4">

                <NavLink to="/jobs">
                    DevMatch
                </NavLink>

                <nav className="flex gap-6">
                    <NavLink
                        to="/jobs"
                        className={({ isActive }) =>
                            isActive
                                ? "font-bold"
                                : "text-gray-500"
                        }
                    >
                        채용공고
                    </NavLink>

                    <NavLink
                        to="/bookmarks"
                        className={({ isActive }) =>
                            isActive
                                ? "font-bold"
                                : "text-gray-500"
                        }
                    >
                        북마크
                    </NavLink>

                    <NavLink
                        to="/applications"
                        className={({ isActive }) =>
                            isActive
                                ? "font-bold"
                                : "text-gray-500"
                        }
                    >
                        지원관리
                    </NavLink>

                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            isActive
                                ? "font-bold"
                                : "text-gray-500"
                        }
                    >
                        대시보드
                    </NavLink>
                </nav>
            </div>
        </header>
    )
}
export default Header;