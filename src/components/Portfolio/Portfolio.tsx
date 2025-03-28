import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhone, faMapMarkerAlt, faUniversity, faCalendarAlt, faHandSparkles } from '@fortawesome/free-solid-svg-icons';
import resumeData from '../../resume.json';
import './Portfolio.css';

interface PortfolioProps {
    activeSection: string;
}

interface Card {
    id: string;
    title: string;
    content: React.ReactNode;
}

const Portfolio: React.FC<PortfolioProps> = ({ activeSection }) => {
    const cardsRef = useRef<HTMLDivElement>(null);

    const cards: Card[] = [
        {
            id: 'about',
            title: 'About Me',
            content: (
                <div className="card-content">
                    <div className="profile-image-container">
                        <img src="/profile.jpg" alt={resumeData.name} className="profile-image" />
                    </div>
                    <p className="greeting">
                        <FontAwesomeIcon icon={faHandSparkles} className="greeting-icon" />
                        Hello! I'm {resumeData.name}, a passionate {resumeData.experience[0].position} based in {resumeData.location}.
                    </p>
                    <p>With a strong foundation in {resumeData.skills.languages.slice(0, 3).join(", ")}, I specialize in building robust and scalable applications.</p>
                    <p>Currently working as a {resumeData.experience[0].position} at {resumeData.experience[0].company}, focusing on {resumeData.experience[0].responsibilities[0]}.</p>
                </div>
            )
        },
        {
            id: 'skills',
            title: 'Technical Skills',
            content: (
                <div className="card-content">
                    <h3>Languages</h3>
                    <div className="skill-tags">
                        {resumeData.skills.languages.map(lang => (
                            <span key={lang} className="skill-tag">{lang}</span>
                        ))}
                    </div>
                    <h3>Technologies</h3>
                    <div className="skill-tags">
                        {resumeData.skills.technologies.map(tech => (
                            <span key={tech} className="skill-tag">{tech}</span>
                        ))}
                    </div>
                    <h3>DevOps & CI/CD</h3>
                    <div className="skill-tags">
                        {resumeData.skills.devops_ci_cd.map(devops => (
                            <span key={devops} className="skill-tag">{devops}</span>
                        ))}
                    </div>
                    <h3>Cloud & Infrastructure</h3>
                    <div className="skill-tags">
                        {resumeData.skills.cloud_infrastructure.map(cloud => (
                            <span key={cloud} className="skill-tag">{cloud}</span>
                        ))}
                    </div>
                    <h3>Software Development</h3>
                    <div className="skill-tags">
                        {resumeData.skills.software_development.map(sd => (
                            <span key={sd} className="skill-tag">{sd}</span>
                        ))}
                    </div>
                </div>
            )
        },
        {
            id: 'experience',
            title: 'Work Experience',
            content: (
                <div className="card-content">
                    {resumeData.experience.map((exp, index) => (
                        <div key={index} className="experience-item">
                            <h3>{exp.position}</h3>
                            <p className="company">{exp.company} | {exp.duration}</p>
                            <p className="location">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="location-icon" /> {exp.location}
                            </p>
                            <ul>
                                {exp.responsibilities.map((resp, i) => (
                                    <li key={i}>{resp}</li>
                                ))}
                            </ul>
                            {exp.technologies && (
                                <div className="technologies">
                                    <h4>Technologies Used:</h4>
                                    <div className="skill-tags">
                                        {exp.technologies.map(tech => (
                                            <span key={tech} className="skill-tag">{tech}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )
        },
        {
            id: 'education',
            title: 'Education',
            content: (
                <div className="card-content">
                    <h3>{resumeData.education.degree}</h3>
                    <p className="education-item">
                        <FontAwesomeIcon icon={faUniversity} className="education-icon" />
                        {resumeData.education.institution}
                    </p>
                    <p className="education-item">
                        <FontAwesomeIcon icon={faCalendarAlt} className="education-icon" />
                        {resumeData.education.duration}
                    </p>
                </div>
            )
        },
        {
            id: 'contact',
            title: 'Contact',
            content: (
                <div className="card-content">
                    <div className="contact-item">
                        <span className="contact-icon">
                            <FontAwesomeIcon icon={faEnvelope} />
                        </span>
                        <a href={`mailto:${resumeData.contact.email}`} className="contact-link">{resumeData.contact.email}</a>
                    </div>
                    <div className="contact-item">
                        <span className="contact-icon">
                            <FontAwesomeIcon icon={faLinkedin} />
                        </span>
                        <a href={`https://${resumeData.contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="contact-link">LinkedIn Profile</a>
                    </div>
                    <div className="contact-item">
                        <span className="contact-icon">
                            <FontAwesomeIcon icon={faGithub} />
                        </span>
                        <a href={`https://${resumeData.contact.github}`} target="_blank" rel="noopener noreferrer" className="contact-link">GitHub Profile</a>
                    </div>
                    <div className="contact-item">
                        <span className="contact-icon">
                            <FontAwesomeIcon icon={faPhone} />
                        </span>
                        <a href={`tel:${resumeData.contact.phone}`} className="contact-link">{resumeData.contact.phone}</a>
                    </div>
                </div>
            )
        }
    ];

    useEffect(() => {
        if (cardsRef.current && activeSection) {
            const activeCard = cardsRef.current.querySelector(`[data-section="${activeSection}"]`);
            if (activeCard) {
                activeCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }, [activeSection]);

    return (
        <div className="portfolio-container">
            <div className="portfolio-header">
                <h2>Portfolio</h2>
            </div>
            <div className="cards-container" ref={cardsRef}>
                {cards.map(card => (
                    <div key={card.id} className={`card ${activeSection === card.id ? 'active' : ''}`} data-section={card.id}>
                        <h2 className="card-title">{card.title}</h2>
                        {card.content}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Portfolio; 