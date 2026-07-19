import "./Services.css";
import { Link } from "react-router-dom";
import {
  FaBoxes,
  FaBolt,
  FaLaptopCode,
  FaDraftingCompass
} from "react-icons/fa";
import { services } from "../../data/servicesData";

function Services() {

    const serviceCards = [

        {
            icon:<FaBoxes/>,
            slug:"wholesale-construction-materials-and-equipments",
            title:"Wholesale Construction Materials and Equipments",
            description:"Supply of construction materials, tools and heavy equipment for every project scale."
        },

        {
            icon:<FaBolt/>,
            slug:"electrical-and-electromechanical-works",
            title:"Electrical and Electromechanical Works",
            description:"Complete electrical installations, power systems and electromechanical services."
        },

        {
            icon:<FaLaptopCode/>,
            slug:"software-development",
            title:"Software Development",
            description:"Custom software solutions for construction management, automation and operations."
        },

        {
            icon:<FaDraftingCompass/>,
            slug:"building-design-and-finishing-works",
            title:"Building Design and Finishing Works",
            description:"Architectural planning, interior finishings and end-to-end building design services."
        }

    ];

    return(

        <section className="services" id="services">

            <div className="services-title">

                <span>OUR SERVICES</span>

                <h2>Construction Services & Solutions</h2>

                <p>

                    We provide a full range of construction-related services for every stage of your project.

                </p>

            </div>

            <div className="services-grid">

                {

                    serviceCards.map((service,index)=>(

                        <div className="service-card" key={index}>

                            <div className="service-icon">

                                {service.icon}

                            </div>

                            <h3>

                                {service.title}

                            </h3>

                            <p>

                                {service.description}

                            </p>

                            <Link to={`/services/${service.slug}`} className="service-link">

                                Learn More →

                            </Link>

                        </div>

                    ))

                }

            </div>

        </section>

    );

}

export default Services;