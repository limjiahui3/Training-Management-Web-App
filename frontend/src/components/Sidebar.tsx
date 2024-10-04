import { createContext, ReactNode, useContext, useState } from "react";
import { CgMoreVertical } from "react-icons/cg";
import { FaRegUserCircle } from "react-icons/fa";
import { LuChevronFirst, LuChevronLast } from "react-icons/lu";
import { MdModelTraining, MdOutlineDashboard, MdOutlineDescription } from "react-icons/md";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { Link } from "react-router-dom";

interface SidebarContextType {
  expanded: boolean;
}

interface SidebarProps {
  children?: ReactNode;
  activeItem: string;
}

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  active?: boolean;
  link: string;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const Sidebar: React.FC<SidebarProps> = ({ activeItem, children }) => {
  const [expanded, setExpanded] = useState(true);

  const sidebarItems = [
    { icon: <MdOutlineDashboard size={20} />, text: "Dashboard", link: '/dashboard' },
    {icon: <RiCalendarScheduleLine size={20} />, text: "Training Sessions", link: '/sessions'},
    { icon: <FaRegUserCircle size={20} />, text: "Employees", link: '/employees' },
    { icon: <MdModelTraining size={20} />, text: "Trainings", link: '/trainings' },
    {icon: <MdOutlineDescription size={20} />, text: "Report", link: '/report'},
  ];

  return (
    <aside className="sticky top-0 h-screen bg-gray-100 text-gray-800">
      <nav className="h-full flex flex-col">
        <div
          className={`p-4 pb-2 flex ${
            expanded ? "justify-between" : "justify-center"
          } items-center`}
        >
          <img
            src="tsh.svg"
            className={`overflow-hidden transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
            alt="Logo"
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            {expanded ? <LuChevronFirst /> : <LuChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">
            {sidebarItems.map((item, index) => (
              <SidebarItem
                key={index}
                icon={item.icon}
                text={item.text}
                active={activeItem === item.text}
                link={item.link}
              />
            ))}
            {children}
          </ul>
        </SidebarContext.Provider>

        <div className="border-t border-gray-200 flex items-center p-3">
          <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-200 rounded-full">
            <span className="font-medium text-gray-600">U</span>
          </div>
          <h4
            className={`font-semibold overflow-hidden transition-all ${
              expanded ? "ml-3" : "w-0 ml-0"
            }`}
          >
            User
          </h4>
          <CgMoreVertical
            size={20}
            className={`ml-auto cursor-pointer overflow-hidden transition-all ${
              expanded ? "" : "w-0"
            }`}
          />
        </div>
      </nav>
    </aside>
  );
};

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  text,
  active,
  link,
}) => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error(
      "SidebarItem must be used within a SidebarContext.Provider"
    );
  }
  const { expanded } = context;
  return (
    // <Link to={`/${text}`}>
    <Link to={link}>

      <li
        className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
          active
            ? "bg-indigo-600 text-white"
            : "hover:bg-gray-200 text-gray-800"
        }`}
      >
        {icon}
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "w-32 ml-3" : "w-0"
          }`}
        >
          {text}
        </span>

        {!expanded && (
          <div
            className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-gray-200 text-gray-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
          >
            {text}
          </div>
        )}
      </li>
    </Link>
  );
};

export default Sidebar;
