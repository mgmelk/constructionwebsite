import "./DashboardCards.css";

import {
  FaUsers,
  FaProjectDiagram,
  FaHardHat,
  FaUserTie,
} from "react-icons/fa";

function DashboardCards({ stats }) {
  const cards = [
    {
      title: "Users",
      number: stats?.totalUsers ?? 0,
      icon: <FaUsers />,
    },
    {
      title: "Projects",
      number: stats?.totalProjects ?? 0,
      icon: <FaProjectDiagram />,
    },
    {
      title: "Active Projects",
      number: stats?.activeProjects ?? 0,
      icon: <FaHardHat />,
    },
    {
      title: "Completed Projects",
      number: stats?.completedProjects ?? 0,
      icon: <FaUserTie />,
    },
  ];

  return (
    <div className="cards">
      {cards.map((card, index) => (
        <div className="card" key={index}>
          <div className="card-icon">{card.icon}</div>
          <h2>{card.number}</h2>
          <p>{card.title}</p>
        </div>
      ))}
    </div>
  );
}

export default DashboardCards;