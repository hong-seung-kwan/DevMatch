import { NavLink } from "react-router-dom";


function getNavLinkClass(isActive: boolean) {
    return isActive
        ? "font-bold"
        : "text-gray-500"
}

function Header() {
    return (
        <header className="border-b">
            <div className="flex gap-4 items-center px-6 py-4">

                <NavLink to="/jobs" className="text-blue-700 font-bold">
                    DevMatch
                </NavLink>

                <nav className="flex gap-6">
                    <NavLink
                        to="/jobs"
                        end
                        className={({ isActive }) => getNavLinkClass(isActive)}
                    >
                        채용공고
                    </NavLink>

                    <NavLink
                        to="/bookmarks"
                        className={({ isActive }) => getNavLinkClass(isActive)}
                    >
                        북마크
                    </NavLink>

                    <NavLink
                        to="/applications"
                        className={({ isActive }) => getNavLinkClass(isActive)}
                    >
                        지원관리
                    </NavLink>

                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) => getNavLinkClass(isActive)}
                    >
                        대시보드
                    </NavLink>

                    <NavLink
                        to="/jobs/new"
                        className={({ isActive }) => getNavLinkClass(isActive)}
                    >
                        공고등록
                    </NavLink>
                </nav>
            </div>
        </header>
    )
}
export default Header;