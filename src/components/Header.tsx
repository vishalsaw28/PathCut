import type { ViewType } from "../types";

interface HeaderProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => (
  <header>
    <div className="container header-content">
      <div className="logo">
        <i className="fas fa-link"></i>
        <h1>PathCut</h1>
      </div>
      <nav>
        <ul>
          <li>
            <a
              className={currentView === "home" ? "active" : ""}
              onClick={() => setCurrentView("home")}
            >
              Home
            </a>
          </li>
          <li>
            <a
              className={currentView === "admin" ? "active" : ""}
              onClick={() => setCurrentView("admin")}
            >
              Admin
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
);

export default Header;
